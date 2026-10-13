import "server-only";
import type {
  ContactHttpStatus,
  ContactResponse,
} from "@/domain/contact/ContactContract";
import type { ContactResult } from "@/domain/contact/ContactResult";

export type ContactDiagnostic = Readonly<{
  event: "contact_outcome";
  httpStatus: ContactHttpStatus;
  outcome: ContactResponse["status"];
  code: Exclude<ContactResponse, { status: "accepted" }>["code"] | null;
}>;
export type ContactDiagnosticWriter = (event: ContactDiagnostic) => void;

// A runtime allowlist prevents future adapter metadata/strings reaching logs.
const allowed: Readonly<
  Record<
    number,
    Readonly<{
      outcome: ContactDiagnostic["outcome"];
      codes: readonly string[];
    }>
  >
> = {
  202: { outcome: "accepted", codes: [] },
  400: {
    outcome: "rejected",
    codes: [
      "invalid_utf8",
      "malformed_json",
      "invalid_shape",
      "invalid_submission_id",
      "spam_rejected",
    ],
  },
  403: { outcome: "rejected", codes: ["origin_rejected"] },
  405: { outcome: "rejected", codes: ["method_not_allowed"] },
  413: { outcome: "rejected", codes: ["request_too_large"] },
  415: { outcome: "rejected", codes: ["unsupported_media_type"] },
  422: { outcome: "invalid", codes: ["validation_failed"] },
  429: { outcome: "rate_limited", codes: ["rate_limited"] },
  502: {
    outcome: "unknown",
    codes: [
      "delivery_uncertain",
      "provider_response_invalid",
      "idempotency_conflict",
      "submission_in_progress",
      "provider_rejected",
    ],
  },
  503: {
    outcome: "unavailable",
    codes: [
      "configuration_unavailable",
      "provider_quota_exceeded",
      "provider_throttled",
      "provider_unavailable",
    ],
  },
  504: { outcome: "unknown", codes: ["provider_timeout"] },
};

/** Only categorical outcomes; no request, identifiers, content or raw errors. */
export function recordContactDiagnostic(
  result: ContactResult,
  write: ContactDiagnosticWriter,
): void {
  const rule = allowed[result.httpStatus];
  const code = "code" in result.body ? result.body.code : null;
  const outcome =
    code === "provider_rejected" && result.httpStatus === 502
      ? "failed"
      : rule?.outcome;
  if (
    !rule ||
    result.body.status !== outcome ||
    (code === null ? result.httpStatus !== 202 : !rule.codes.includes(code))
  )
    return;
  try {
    write(
      Object.freeze({
        event: "contact_outcome",
        httpStatus: result.httpStatus,
        outcome,
        code,
      }),
    );
  } catch {
    // Diagnostic failure must not change an already established delivery outcome.
  }
}
