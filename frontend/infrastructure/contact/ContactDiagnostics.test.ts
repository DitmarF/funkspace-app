// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { submissionId } from "../../../tests/contact/fixtures";
import type { ContactResult } from "@/domain/contact/ContactResult";
import { recordContactDiagnostic } from "./ContactDiagnostics";

const results: ContactResult[] = [
  { httpStatus: 202, body: { status: "accepted", submissionId } },
  ...(
    [
      "invalid_utf8",
      "malformed_json",
      "invalid_shape",
      "invalid_submission_id",
      "spam_rejected",
    ] as const
  ).map((code) => ({
    httpStatus: 400 as const,
    body: { status: "rejected" as const, code, submissionId },
  })),
  {
    httpStatus: 403,
    body: { status: "rejected", code: "origin_rejected", submissionId },
  },
  {
    httpStatus: 405,
    body: { status: "rejected", code: "method_not_allowed", submissionId },
  },
  {
    httpStatus: 413,
    body: { status: "rejected", code: "request_too_large", submissionId },
  },
  {
    httpStatus: 415,
    body: { status: "rejected", code: "unsupported_media_type", submissionId },
  },
  {
    httpStatus: 422,
    body: {
      status: "invalid",
      code: "validation_failed",
      submissionId,
      fieldErrors: { email: "required" },
    },
  },
  {
    httpStatus: 429,
    body: {
      status: "rate_limited",
      code: "rate_limited",
      submissionId,
      retryAfterSeconds: 600,
    },
  },
  {
    httpStatus: 502,
    body: { status: "failed", code: "provider_rejected", submissionId },
  },
  ...(
    [
      "delivery_uncertain",
      "provider_response_invalid",
      "idempotency_conflict",
      "submission_in_progress",
    ] as const
  ).map((code) => ({
    httpStatus: 502 as const,
    body: { status: "unknown" as const, code, submissionId },
  })),
  ...(
    [
      "configuration_unavailable",
      "provider_quota_exceeded",
      "provider_throttled",
      "provider_unavailable",
    ] as const
  ).map((code) => ({
    httpStatus: 503 as const,
    body: { status: "unavailable" as const, code, submissionId },
  })),
  {
    httpStatus: 504,
    body: { status: "unknown", code: "provider_timeout", submissionId },
  },
];

describe("contact diagnostic allowlist", () => {
  it.each(results)("records only safe categories for %j", (result) => {
    const write = vi.fn();
    recordContactDiagnostic(result, write);
    expect(write).toHaveBeenCalledExactlyOnceWith({
      event: "contact_outcome",
      httpStatus: result.httpStatus,
      outcome: result.body.status,
      code: "code" in result.body ? result.body.code : null,
    });
    expect(Object.isFrozen(write.mock.calls[0][0])).toBe(true);
    expect(JSON.stringify(write.mock.calls)).not.toContain(submissionId);
  });

  it("discards extra private metadata instead of spreading it", () => {
    const write = vi.fn();
    const result = {
      httpStatus: 502 as const,
      body: {
        status: "unknown" as const,
        code: "delivery_uncertain" as const,
        submissionId,
        name: "Private name",
        email: "private@example.test",
        message: "Private message",
        ip: "192.0.2.9",
        credential: "private credential",
        rawProviderError: "private upstream error",
      },
    };
    recordContactDiagnostic(result, write);
    expect(write).toHaveBeenCalledExactlyOnceWith({
      event: "contact_outcome",
      httpStatus: 502,
      outcome: "unknown",
      code: "delivery_uncertain",
    });
  });

  it.each([
    {
      httpStatus: 599,
      body: { status: "unknown", code: "delivery_uncertain" },
    },
    {
      httpStatus: 502,
      body: { status: "unknown", code: "private provider message" },
    },
    {
      httpStatus: 503,
      body: { status: "private outcome", code: "provider_unavailable" },
    },
    { httpStatus: 502, body: { status: "failed", code: "delivery_uncertain" } },
    { httpStatus: 503, body: { status: "unavailable" } },
  ])(
    "drops unrecognized/mismatched categories rather than logging arbitrary strings %j",
    (untrusted) => {
      const write = vi.fn();
      // Deliberately malformed fake to exercise the runtime diagnostic boundary.
      recordContactDiagnostic(untrusted as unknown as ContactResult, write);
      expect(write).not.toHaveBeenCalled();
    },
  );

  it("swallows writer failure without logging the exception", () => {
    const write = vi.fn(() => {
      throw new Error("private error");
    });
    expect(() => recordContactDiagnostic(results[0], write)).not.toThrow();
    expect(write).toHaveBeenCalledOnce();
  });
});
