import {
  CONTACT_LIMITS,
  type ContactRequest,
} from "@/domain/contact/ContactContract";
import { parseContactBrowserResponse } from "@/domain/contact/ContactBrowserResponse";
import type {
  ContactSubmissionPort,
  ContactSubmissionResult,
} from "@/domain/ports/ContactSubmissionPort";

type ContactFetch = (url: string, init: RequestInit) => Promise<Response>;
const unknown = (
  reason: Extract<ContactSubmissionResult, { kind: "unknown" }>["reason"],
): ContactSubmissionResult => ({ kind: "unknown", reason });

/** Browser-only same-origin adapter. No mail credentials, retries or storage. */
export class BrowserContactSubmission implements ContactSubmissionPort {
  private wall = Date.now();
  private monotonic = performance.now();
  private elapsed = 0;
  constructor(private readonly fetcher: ContactFetch) {}
  createSubmissionId(): string {
    return crypto.randomUUID();
  }
  now(): number {
    const wall = Date.now();
    const monotonic = performance.now();
    const delta = wall - this.wall;
    // Some browsers pause performance.now during sleep. Count the greater
    // elapsed interval; clock rollback conservatively retires existing retries.
    this.elapsed +=
      delta < 0
        ? CONTACT_LIMITS.sameSubmissionRetryMs
        : Math.max(delta, monotonic - this.monotonic, 0);
    this.wall = wall;
    this.monotonic = monotonic;
    return this.elapsed;
  }

  async submit(
    request: ContactRequest,
    caller: AbortSignal,
  ): Promise<ContactSubmissionResult> {
    if (caller.aborted) return unknown("cancelled");
    const started = this.now();
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancel = () => {};
    const cancellation = new Promise<ContactSubmissionResult>((resolve) => {
      cancel = () => {
        resolve(unknown("cancelled"));
        controller.abort();
      };
      caller.addEventListener("abort", cancel, { once: true });
    });
    const deadline = new Promise<ContactSubmissionResult>((resolve) => {
      timer = setTimeout(() => {
        resolve(unknown("timeout"));
        controller.abort();
      }, CONTACT_LIMITS.browserDeadlineMs);
    });
    try {
      const result = await Promise.race([
        this.exchange(request, controller.signal),
        cancellation,
        deadline,
      ]);
      return this.now() - started >= CONTACT_LIMITS.browserDeadlineMs
        ? unknown("timeout")
        : result;
    } finally {
      clearTimeout(timer);
      caller.removeEventListener("abort", cancel);
      controller.abort();
    }
  }

  private async exchange(
    request: ContactRequest,
    signal: AbortSignal,
  ): Promise<ContactSubmissionResult> {
    try {
      const response = await this.fetcher("/api/contact", {
        method: "POST",
        credentials: "same-origin",
        redirect: "error",
        cache: "no-store",
        signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      if (signal.aborted) {
        discard(response.body);
        return unknown("cancelled");
      }
      // Edge 429 may be HTML, empty or stalled. Recognize it before JSON reading.
      if (response.status === 429) {
        discard(response.body);
        const header = response.headers.get("retry-after") ?? "";
        const seconds = /^\d+$/.test(header) ? Number(header) : 0;
        return {
          kind: "response",
          result: {
            httpStatus: 429,
            body: {
              status: "rate_limited",
              code: "rate_limited",
              submissionId: request.submissionId,
              retryAfterSeconds:
                seconds >= 1 && seconds <= 600 ? seconds : null,
            },
          },
        };
      }
      const body = await readResponse(response.body, signal);
      const result = parseContactBrowserResponse(
        response.status,
        body,
        request.submissionId,
      );
      return result
        ? { kind: "response", result }
        : unknown("invalid_response");
    } catch {
      return unknown("transport");
    }
  }
}

function discard(body: ReadableStream<Uint8Array> | null): void {
  try {
    void body?.cancel().catch(() => {});
  } catch {
    /* best effort */
  }
}

// Kept browser-local: the existing request/provider reader is server-only.
async function readResponse(
  body: ReadableStream<Uint8Array> | null,
  signal: AbortSignal,
): Promise<unknown> {
  if (!body) throw new Error("Missing response");
  const reader = body.getReader();
  const cancel = () => {
    void reader.cancel().catch(() => {});
  };
  signal.addEventListener("abort", cancel, { once: true });
  let done = false;
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const part = await reader.read();
      if (signal.aborted) throw new Error("Cancelled response");
      if (part.done) {
        done = true;
        break;
      }
      size += part.value.byteLength;
      if (size > CONTACT_LIMITS.requestBytes)
        throw new Error("Oversized response");
      chunks.push(part.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return JSON.parse(
      new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes),
    ) as unknown;
  } finally {
    signal.removeEventListener("abort", cancel);
    if (!done) cancel();
    reader.releaseLock();
  }
}
