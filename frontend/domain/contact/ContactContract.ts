/** Pure FS-5.1 wire contract. Runtime validation belongs to FS-5.2. */
export type ContactRequest = Readonly<{
  name: string;
  email: string;
  message: string;
  submissionId: string;
  website: string;
}>;

export const CONTACT_LIMITS = {
  nameUnits: 100,
  emailUnits: 254,
  messageUnits: 5_000,
  requestBytes: 32 * 1_024,
  providerDeadlineMs: 8_000,
  browserDeadlineMs: 15_000,
  sameSubmissionRetryMs: 23 * 60 * 60 * 1_000,
} as const;

export type ContactFieldErrors = Readonly<{
  name?: "too_long" | "invalid_characters";
  email?: "required" | "too_long" | "invalid_email" | "invalid_characters";
  message?: "required" | "too_long" | "invalid_characters";
}>;

type ContactError<TStatus extends string, TCode extends string> = Readonly<{
  status: TStatus;
  code: TCode;
  /** Validated request UUID, or null if it cannot safely be echoed. */
  submissionId: string | null;
}>;

/** HTTP status is transport metadata, not an extra JSON property. */
export type ContactResponseByHttpStatus = {
  202: Readonly<{ status: "accepted"; submissionId: string }>;
  400: ContactError<
    "rejected",
    | "invalid_utf8"
    | "malformed_json"
    | "invalid_shape"
    | "invalid_submission_id"
    | "spam_rejected"
  >;
  403: ContactError<"rejected", "origin_rejected">;
  405: ContactError<"rejected", "method_not_allowed">;
  413: ContactError<"rejected", "request_too_large">;
  415: ContactError<"rejected", "unsupported_media_type">;
  422: ContactError<"invalid", "validation_failed"> &
    Readonly<{ fieldErrors: ContactFieldErrors }>;
  429: ContactError<"rate_limited", "rate_limited"> &
    Readonly<{ retryAfterSeconds: number | null }>;
  502:
    | ContactError<"failed", "provider_rejected">
    | ContactError<
        "unknown",
        | "delivery_uncertain"
        | "provider_response_invalid"
        | "idempotency_conflict"
        | "submission_in_progress"
      >;
  503: ContactError<
    "unavailable",
    | "configuration_unavailable"
    | "provider_quota_exceeded"
    | "provider_throttled"
    | "provider_unavailable"
  >;
  504: ContactError<"unknown", "provider_timeout">;
};

export type ContactHttpStatus = keyof ContactResponseByHttpStatus;
export type ContactResponse = ContactResponseByHttpStatus[ContactHttpStatus];
