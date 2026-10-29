import type { ContactResult } from "./ContactResult";
import { isProviderAcceptanceId } from "./ContactValidation";

const rules: Readonly<
  Record<number, { status: string; codes: readonly string[] }>
> = {
  400: {
    status: "rejected",
    codes: [
      "invalid_utf8",
      "malformed_json",
      "invalid_shape",
      "invalid_submission_id",
      "spam_rejected",
    ],
  },
  403: { status: "rejected", codes: ["origin_rejected"] },
  405: { status: "rejected", codes: ["method_not_allowed"] },
  413: { status: "rejected", codes: ["request_too_large"] },
  415: { status: "rejected", codes: ["unsupported_media_type"] },
  422: { status: "invalid", codes: ["validation_failed"] },
  429: { status: "rate_limited", codes: ["rate_limited"] },
  502: {
    status: "unknown",
    codes: [
      "provider_rejected",
      "delivery_uncertain",
      "provider_response_invalid",
      "idempotency_conflict",
      "submission_in_progress",
    ],
  },
  503: {
    status: "unavailable",
    codes: [
      "configuration_unavailable",
      "provider_quota_exceeded",
      "provider_throttled",
      "provider_unavailable",
    ],
  },
  504: { status: "unknown", codes: ["provider_timeout"] },
};
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function exact(
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean {
  return (
    Object.keys(value).length === keys.length &&
    keys.every((key) => Object.hasOwn(value, key))
  );
}

/** Validate transport/envelope parity before presenting any API outcome. */
export function parseContactBrowserResponse(
  httpStatus: number,
  body: unknown,
  submissionId: string,
): ContactResult | null {
  if (!record(body)) return null;
  if (httpStatus === 202) {
    return exact(body, ["status", "submissionId"]) &&
      body.status === "accepted" &&
      body.submissionId === submissionId &&
      isProviderAcceptanceId(body.submissionId)
      ? { httpStatus: 202, body: { status: "accepted", submissionId } }
      : null;
  }
  const rule = rules[httpStatus];
  if (!rule || typeof body.code !== "string" || !rule.codes.includes(body.code))
    return null;
  const expected =
    httpStatus === 502 && body.code === "provider_rejected"
      ? "failed"
      : rule.status;
  if (
    body.status !== expected ||
    (body.submissionId !== null && body.submissionId !== submissionId)
  )
    return null;
  const extra =
    httpStatus === 422
      ? ["fieldErrors"]
      : httpStatus === 429
        ? ["retryAfterSeconds"]
        : [];
  if (!exact(body, ["status", "code", "submissionId", ...extra])) return null;
  if (httpStatus === 422) {
    const errors = body.fieldErrors;
    if (!record(errors) || !Object.keys(errors).length) return null;
    const fields: Readonly<Record<string, readonly string[]>> = {
      name: ["too_long", "invalid_characters"],
      email: ["required", "too_long", "invalid_email", "invalid_characters"],
      message: ["required", "too_long", "invalid_characters"],
    };
    if (
      !Object.entries(errors).every(
        ([key, value]) =>
          typeof value === "string" &&
          Object.hasOwn(fields, key) &&
          fields[key].includes(value),
      )
    )
      return null;
  }
  if (
    httpStatus === 429 &&
    body.retryAfterSeconds !== null &&
    !(
      typeof body.retryAfterSeconds === "number" &&
      Number.isInteger(body.retryAfterSeconds) &&
      body.retryAfterSeconds >= 1 &&
      body.retryAfterSeconds <= 600
    )
  )
    return null;
  // Cast only after exact shape, code/status pairing, identity and extras checks.
  return { httpStatus, body } as ContactResult;
}
