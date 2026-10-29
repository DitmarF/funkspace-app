import {
  isProviderAcceptanceId,
  validateContactRequest,
} from "@/domain/contact/ContactValidation";
import type { ContactResult } from "@/domain/contact/ContactResult";
import type { ContactDeliveryPort } from "@/domain/ports/ContactDeliveryPort";

export class ContactUseCase {
  constructor(private readonly delivery: ContactDeliveryPort | null) {}

  async execute(input: unknown): Promise<ContactResult> {
    const validation = validateContactRequest(input);
    if (!validation.valid) return validation.result;
    const submissionId = validation.value.submissionId;
    if (!this.delivery)
      return {
        httpStatus: 503,
        body: {
          status: "unavailable",
          code: "configuration_unavailable",
          submissionId,
        },
      };
    try {
      const result = await this.delivery.deliver(validation.value);
      switch (result.status) {
        case "accepted":
          return isProviderAcceptanceId(result.acceptanceId)
            ? { httpStatus: 202, body: { status: "accepted", submissionId } }
            : {
                httpStatus: 502,
                body: {
                  status: "unknown",
                  code: "provider_response_invalid",
                  submissionId,
                },
              };
        case "failed":
          return {
            httpStatus: 502,
            body: { status: "failed", code: result.code, submissionId },
          };
        case "unavailable":
          return {
            httpStatus: 503,
            body: { status: "unavailable", code: result.code, submissionId },
          };
        case "unknown": {
          const code = result.code;
          return code === "provider_timeout"
            ? {
                httpStatus: 504,
                body: {
                  status: "unknown",
                  code: "provider_timeout",
                  submissionId,
                },
              }
            : {
                httpStatus: 502,
                body: { status: "unknown", code, submissionId },
              };
        }
      }
    } catch {
      // An exceptional adapter outcome cannot prove that mail was not sent.
      return {
        httpStatus: 502,
        body: { status: "unknown", code: "delivery_uncertain", submissionId },
      };
    }
  }
}
