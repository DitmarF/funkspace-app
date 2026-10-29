import { CONTACT_LIMITS } from "@/domain/contact/ContactContract";
import type { ContactRequest } from "@/domain/contact/ContactContract";
import type { ContactResult } from "@/domain/contact/ContactResult";
import type { ContactSubmissionPort } from "@/domain/ports/ContactSubmissionPort";
import { BrowserContactSubmission } from "@/infrastructure/contact/BrowserContactSubmission";

/** Storybook-only transport. Never delegates to global fetch or a mail service. */
export const manualScenarios = [
  ["accepted", "Accepted (matching 202)"],
  ["held", "Hold submission; release it below"],
  ["fetch_timeout", "Browser timeout before headers (15 seconds)"],
  ["body_timeout", "Browser timeout reading body (15 seconds)"],
  ["network_error", "Network failure / uncertain delivery"],
  ["malformed", "Malformed acceptance / uncertain delivery"],
  ["mismatched", "Wrong acceptance ID / uncertain delivery"],
  ["field_errors", "Server field error (422)"],
  ["rate_json", "JSON rate limit (5-second cooldown)"],
  ["rate_html", "HTML rate limit (5-second cooldown)"],
  ["rate_empty", "Empty 429, no header (10-minute cooldown)"],
  ["configuration", "Configuration unavailable (blocks until reset)"],
  ["quota", "Provider quota exhausted"],
  ["throttled", "Provider throttled"],
  ["unavailable", "Provider unavailable"],
  ["rejected", "Request rejected (403)"],
  ["provider_rejected", "Provider rejected (502)"],
  ["provider_timeout", "Server reports provider timeout (504)"],
  ["uncertain", "Server reports uncertain delivery"],
  ["provider_invalid", "Server reports invalid provider response"],
  ["in_progress", "Same submission in progress"],
  ["conflict", "Idempotency conflict (blocks same retry)"],
] as const;
export type ManualScenario = (typeof manualScenarios)[number][0];
export type ManualSnapshot = Readonly<{
  requests: number;
  active: boolean;
  lastId: string | null;
  previousId: string | null;
  aborts: number;
  bodyCancellations: number;
  advancedHours: number;
}>;

// randomUUID requires HTTPS. getRandomValues also works on a private HTTP LAN.
// This fixture-only UUID implementation never enters application composition.
export function createManualSubmissionId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4),
    hex.slice(4, 6),
    hex.slice(6, 8),
    hex.slice(8, 10),
    hex.slice(10),
  ]
    .map((part) => part.join(""))
    .join("-");
}

type Held = { release: (accepted: boolean) => void; cancel: () => void };
export class ManualContactSubmission implements ContactSubmissionPort {
  private scenario: ManualScenario = "accepted";
  private offset = 0;
  private held: Held | null = null;
  private listeners = new Set<(snapshot: ManualSnapshot) => void>();
  private snapshot: ManualSnapshot = {
    requests: 0,
    active: false,
    lastId: null,
    previousId: null,
    aborts: 0,
    bodyCancellations: 0,
    advancedHours: 0,
  };
  private readonly browser = new BrowserContactSubmission((_url, init) =>
    this.exchange(init),
  );
  createSubmissionId = createManualSubmissionId;
  now = (): number => this.browser.now() + this.offset;
  getSnapshot = (): ManualSnapshot => this.snapshot;
  subscribe = (listener: (snapshot: ManualSnapshot) => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  select(scenario: ManualScenario): void {
    this.scenario = scenario;
  }
  advanceRetryWindow(): void {
    this.offset += CONTACT_LIMITS.sameSubmissionRetryMs;
    this.update({ advancedHours: this.snapshot.advancedHours + 23 });
  }
  release(accepted: boolean): void {
    this.held?.release(accepted);
  }
  dispose(): void {
    this.held?.cancel();
    this.listeners.clear();
  }
  async submit(request: ContactRequest, signal: AbortSignal) {
    this.update({ active: true });
    try {
      return await this.browser.submit(request, signal);
    } finally {
      this.update({ active: false });
    }
  }
  private update(changes: Partial<ManualSnapshot>): void {
    this.snapshot = { ...this.snapshot, ...changes };
    this.listeners.forEach((listener) => listener(this.snapshot));
  }
  private async exchange(init: RequestInit): Promise<Response> {
    const request: unknown = JSON.parse(String(init.body));
    if (
      typeof request !== "object" ||
      request === null ||
      !("submissionId" in request) ||
      typeof request.submissionId !== "string" ||
      !init.signal
    )
      throw new Error("Invalid fixture request");
    const id = request.submissionId;
    const scenario = this.scenario; // Capture outcome and ID before a held response.
    this.update({
      requests: this.snapshot.requests + 1,
      previousId: this.snapshot.lastId,
      lastId: id,
    });
    if (scenario === "held" || scenario === "fetch_timeout") {
      const signal = init.signal;
      return new Promise<Response>((resolve, reject) => {
        const finish = (response?: Response) => {
          signal.removeEventListener("abort", abort);
          if (this.held === held) this.held = null;
          if (response) resolve(response);
          else reject(new DOMException("Fixture cancelled", "AbortError"));
        };
        const abort = () => {
          this.update({ aborts: this.snapshot.aborts + 1 });
          finish();
        };
        const held: Held = {
          release: (accepted) =>
            finish(
              jsonResult(
                accepted
                  ? acceptance(id)
                  : errorResult(502, "unknown", "delivery_uncertain", id),
              ),
            ),
          cancel: abort,
        };
        if (scenario === "held") this.held = held;
        signal.addEventListener("abort", abort, { once: true });
        if (signal.aborted) abort();
      });
    }
    if (scenario === "body_timeout")
      return new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('{"status":'));
          },
          cancel: () => {
            this.update({
              bodyCancellations: this.snapshot.bodyCancellations + 1,
            });
          },
        }),
        { status: 202 },
      );
    if (scenario === "network_error") throw new TypeError("Simulated offline");
    if (scenario === "malformed")
      return new Response("invalid JSON", { status: 202 });
    if (scenario === "mismatched")
      return jsonResult(acceptance(createManualSubmissionId()));
    if (scenario === "rate_html" || scenario === "rate_empty")
      return new Response(
        scenario === "rate_html" ? "<p>Too many requests</p>" : null,
        {
          status: 429,
          headers:
            scenario === "rate_html"
              ? { "Content-Type": "text/html", "Retry-After": "5" }
              : {},
        },
      );
    return jsonResult(scenarioResult(scenario, id));
  }
}
const acceptance = (id: string): ContactResult => ({
  httpStatus: 202,
  body: { status: "accepted", submissionId: id },
});
function errorResult(
  httpStatus: 403 | 502 | 503 | 504,
  status: "rejected" | "failed" | "unknown" | "unavailable",
  code: string,
  id: string,
): ContactResult {
  // Fixture table is checked through the real browser parser and unit tests.
  return {
    httpStatus,
    body: { status, code, submissionId: id },
  } as ContactResult;
}
function scenarioResult(scenario: ManualScenario, id: string): ContactResult {
  if (scenario === "accepted") return acceptance(id);
  if (scenario === "field_errors")
    return {
      httpStatus: 422,
      body: {
        status: "invalid",
        code: "validation_failed",
        submissionId: id,
        fieldErrors: { email: "invalid_email" },
      },
    };
  if (scenario === "rate_json")
    return {
      httpStatus: 429,
      body: {
        status: "rate_limited",
        code: "rate_limited",
        submissionId: id,
        retryAfterSeconds: 5,
      },
    };
  const outcomes = {
    configuration: [503, "unavailable", "configuration_unavailable"],
    quota: [503, "unavailable", "provider_quota_exceeded"],
    throttled: [503, "unavailable", "provider_throttled"],
    unavailable: [503, "unavailable", "provider_unavailable"],
    rejected: [403, "rejected", "origin_rejected"],
    provider_rejected: [502, "failed", "provider_rejected"],
    provider_timeout: [504, "unknown", "provider_timeout"],
    uncertain: [502, "unknown", "delivery_uncertain"],
    provider_invalid: [502, "unknown", "provider_response_invalid"],
    in_progress: [502, "unknown", "submission_in_progress"],
    conflict: [502, "unknown", "idempotency_conflict"],
  } as const;
  if (!(scenario in outcomes)) throw new Error("Unsupported fixture scenario");
  const [httpStatus, status, code] =
    outcomes[scenario as keyof typeof outcomes];
  return errorResult(httpStatus, status, code, id);
}
function jsonResult(result: ContactResult): Response {
  return new Response(JSON.stringify(result.body), {
    status: result.httpStatus,
    headers: {
      "Content-Type": "application/json",
      ...(result.httpStatus === 429 ? { "Retry-After": "5" } : {}),
    },
  });
}
