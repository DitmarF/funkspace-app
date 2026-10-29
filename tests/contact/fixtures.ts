import { afterEach, beforeEach, expect, vi } from "vitest";
import type { ContactRequest } from "../../frontend/domain/contact/ContactContract";
import { validateContactRequest } from "../../frontend/domain/contact/ContactValidation";

// Every contact suite imports this guard, including when run by the broad suite.
// Unexpected global fetch calls fail even if production code catches their error.
let deniedFetch: ReturnType<typeof vi.fn>;
beforeEach(() => {
  deniedFetch = vi.fn(() =>
    Promise.reject(new Error("Unexpected contact test egress")),
  );
  vi.stubGlobal("fetch", deniedFetch);
});
afterEach(() => {
  try {
    expect(deniedFetch).not.toHaveBeenCalled();
  } finally {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  }
});

export const submissionId = "50a1a2b3-4567-4abc-8def-123456789abc";
export const acceptanceId = "60a1a2b3-4567-4abc-9def-123456789abc";
export const origin = "https://portfolio.example.test";
export const request: ContactRequest = {
  name: "A visitor",
  email: "visitor@example.test",
  message: "A plain contact inquiry.",
  submissionId,
  website: "",
};
export const fakeConfiguration = {
  apiKey: "re_fixture_not_a_real_credential",
  from: "FunkSpace <contact@mail.example.test>",
  to: "owner@example.test",
} as const;

export function validated(input: ContactRequest = request) {
  const result = validateContactRequest(input);
  if (!result.valid) throw new Error("Invalid contact test fixture");
  return result.value;
}

export function contactRequest(
  body: BodyInit | null = JSON.stringify(request),
  headers: HeadersInit = {},
): Request {
  const init: RequestInit & { duplex: "half" } = {
    method: "POST",
    headers: { origin, "content-type": "application/json", ...headers },
    body,
    duplex: "half",
  };
  return new Request(origin + "/api/contact", init);
}

export function bytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

export function chunked(chunks: readonly Uint8Array[], cancel = vi.fn()) {
  let index = 0;
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (index < chunks.length) controller.enqueue(chunks[index++]);
      else controller.close();
    },
    cancel,
  });
}
