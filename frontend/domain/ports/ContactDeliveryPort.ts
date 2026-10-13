import type { ContactResponseByHttpStatus } from "../contact/ContactContract";
import type { ValidatedContactRequest } from "../contact/ContactValidation";

export type ContactDeliveryOutcome =
  | Readonly<{ status: "accepted"; acceptanceId: string }>
  | Readonly<{ status: "failed"; code: "provider_rejected" }>
  | Readonly<{
      status: "unavailable";
      code: ContactResponseByHttpStatus[503]["code"];
    }>
  | Readonly<{
      status: "unknown";
      code:
        | "delivery_uncertain"
        | "provider_response_invalid"
        | "idempotency_conflict"
        | "submission_in_progress"
        | "provider_timeout";
    }>;

export interface ContactDeliveryPort {
  deliver(request: ValidatedContactRequest): Promise<ContactDeliveryOutcome>;
}
