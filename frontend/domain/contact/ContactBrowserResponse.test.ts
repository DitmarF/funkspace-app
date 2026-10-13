// @vitest-environment node
import { describe, expect, it } from "vitest";
import { submissionId } from "../../../tests/contact/fixtures";
import { parseContactBrowserResponse as parse } from "./ContactBrowserResponse";

describe("contact browser envelope parity", () => {
  it("accepts exactly matching 202, not mailbox proof", () => {
    expect(
      parse(202, { status: "accepted", submissionId }, submissionId),
    ).toEqual({ httpStatus: 202, body: { status: "accepted", submissionId } });
  });
  it.each([
    [400, "rejected", "invalid_utf8"],
    [400, "rejected", "malformed_json"],
    [400, "rejected", "invalid_shape"],
    [400, "rejected", "invalid_submission_id"],
    [400, "rejected", "spam_rejected"],
    [403, "rejected", "origin_rejected"],
    [405, "rejected", "method_not_allowed"],
    [413, "rejected", "request_too_large"],
    [415, "rejected", "unsupported_media_type"],
    [502, "failed", "provider_rejected"],
    [502, "unknown", "delivery_uncertain"],
    [502, "unknown", "provider_response_invalid"],
    [502, "unknown", "idempotency_conflict"],
    [502, "unknown", "submission_in_progress"],
    [503, "unavailable", "configuration_unavailable"],
    [503, "unavailable", "provider_quota_exceeded"],
    [503, "unavailable", "provider_throttled"],
    [503, "unavailable", "provider_unavailable"],
    [504, "unknown", "provider_timeout"],
  ])("accepts the frozen %s/%s/%s pair", (httpStatus, status, code) => {
    expect(
      parse(Number(httpStatus), { status, code, submissionId }, submissionId),
    ).not.toBeNull();
    expect(
      parse(
        Number(httpStatus),
        { status, code, submissionId: null },
        submissionId,
      ),
    ).not.toBeNull();
  });
  it.each([
    null,
    [],
    {},
    { status: "accepted", submissionId: submissionId.toUpperCase() },
    {
      status: "accepted",
      submissionId: "50a1a2b3-4567-4abc-8def-999999999999",
    },
    { status: "accepted", submissionId, code: "anything" },
  ])("rejects bad accepted evidence %j", (body) =>
    expect(parse(202, body, submissionId)).toBeNull(),
  );
  it.each([
    [500, { status: "unknown", code: "delivery_uncertain", submissionId }],
    [502, { status: "failed", code: "delivery_uncertain", submissionId }],
    [503, { status: "unavailable", code: "raw private error", submissionId }],
    [
      503,
      {
        status: "unavailable",
        code: "configuration_unavailable",
        submissionId,
        private: "raw",
      },
    ],
    [
      422,
      {
        status: "invalid",
        code: "validation_failed",
        submissionId,
        fieldErrors: {},
      },
    ],
    [
      422,
      {
        status: "invalid",
        code: "validation_failed",
        submissionId,
        fieldErrors: { website: "required" },
      },
    ],
    [
      422,
      {
        status: "invalid",
        code: "validation_failed",
        submissionId,
        fieldErrors: { email: "raw error" },
      },
    ],
    [
      429,
      {
        status: "rate_limited",
        code: "rate_limited",
        submissionId,
        retryAfterSeconds: 601,
      },
    ],
    [
      429,
      {
        status: "rate_limited",
        code: "rate_limited",
        submissionId,
        retryAfterSeconds: 1.2,
      },
    ],
    [
      503,
      {
        status: "unavailable",
        code: "configuration_unavailable",
        submissionId: "other",
      },
    ],
  ])("rejects malformed/extra/mismatched error %#", (status, body) =>
    expect(parse(Number(status), body, submissionId)).toBeNull(),
  );
  it("accepts exact field errors and bounded rate information", () => {
    expect(
      parse(
        422,
        {
          status: "invalid",
          code: "validation_failed",
          submissionId,
          fieldErrors: {
            email: "required",
            name: "too_long",
            message: "invalid_characters",
          },
        },
        submissionId,
      ),
    ).not.toBeNull();
    for (const seconds of [null, 1, 600])
      expect(
        parse(
          429,
          {
            status: "rate_limited",
            code: "rate_limited",
            submissionId,
            retryAfterSeconds: seconds,
          },
          submissionId,
        ),
      ).not.toBeNull();
  });
});
