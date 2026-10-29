import "server-only";

export class ContactBodyError extends Error {
  constructor(
    readonly code: "request_too_large" | "invalid_utf8" | "malformed_json",
  ) {
    super(code);
  }
}

/** Do not await potentially stalled cancellation of an untrusted body. */
export function cancelContactBody(
  body: ReadableStream<Uint8Array> | null,
): void {
  try {
    void body?.cancel().catch(() => {});
  } catch {
    /* Already locked/closed. */
  }
}

/** Shared bounded reading for the actual request and provider-response consumers. */
export async function readBoundedJson(
  body: ReadableStream<Uint8Array> | null,
  limit: number,
  signal?: AbortSignal,
): Promise<unknown> {
  if (!body) throw new ContactBodyError("malformed_json");
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let exhausted = false;
  const cancel = () => {
    try {
      void reader.cancel().catch(() => {});
    } catch {
      /* Cleanup is best effort. */
    }
  };
  signal?.addEventListener("abort", cancel, { once: true });
  try {
    if (signal?.aborted) throw new ContactBodyError("malformed_json");
    while (true) {
      const { done, value } = await reader.read();
      if (signal?.aborted) throw new ContactBodyError("malformed_json");
      if (done) {
        exhausted = true;
        break;
      }
      if (!(value instanceof Uint8Array))
        throw new ContactBodyError("malformed_json");
      size += value.byteLength;
      if (size > limit) throw new ContactBodyError("request_too_large");
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    let text: string;
    try {
      // Preserve a leading BOM so it is rejected rather than silently stripped.
      text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(
        bytes,
      );
    } catch {
      throw new ContactBodyError("invalid_utf8");
    }
    try {
      if (text.charCodeAt(0) === 0xfeff) throw new Error("BOM");
      return JSON.parse(text) as unknown;
    } catch {
      throw new ContactBodyError("malformed_json");
    }
  } catch (error) {
    if (error instanceof ContactBodyError) throw error;
    throw new ContactBodyError("malformed_json");
  } finally {
    signal?.removeEventListener("abort", cancel);
    if (!exhausted) cancel();
    reader.releaseLock();
  }
}
