import "server-only";
import { CONTACT_LIMITS } from "@/domain/contact/ContactContract";
import {
  isProviderAcceptanceId,
  type ValidatedContactRequest,
} from "@/domain/contact/ContactValidation";
import type {
  ContactDeliveryOutcome,
  ContactDeliveryPort,
} from "@/domain/ports/ContactDeliveryPort";
import type { ResendContactConfiguration } from "./ContactConfiguration";
import { cancelContactBody, readBoundedJson } from "./BoundedJson";

export type ContactFetch = (
  url: string,
  init: RequestInit,
) => Promise<Response>;
const timeout: ContactDeliveryOutcome = {
  status: "unknown",
  code: "provider_timeout",
};

/** No retries, redirects, SDK, logging or provider IDs in the public result. */
export class ResendContactDelivery implements ContactDeliveryPort {
  constructor(
    private readonly configuration: ResendContactConfiguration,
    private readonly fetcher: ContactFetch,
  ) {}

  async deliver(
    request: ValidatedContactRequest,
  ): Promise<ContactDeliveryOutcome> {
    const started = performance.now();
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const deadline = new Promise<ContactDeliveryOutcome>((resolve) => {
      timer = setTimeout(() => {
        resolve(timeout);
        controller.abort();
      }, CONTACT_LIMITS.providerDeadlineMs);
    });
    try {
      const outcome = await Promise.race([
        this.exchange(request, controller.signal),
        deadline,
      ]);
      return performance.now() - started >= CONTACT_LIMITS.providerDeadlineMs
        ? timeout
        : outcome;
    } finally {
      clearTimeout(timer);
      controller.abort();
    }
  }

  private async exchange(
    request: ValidatedContactRequest,
    signal: AbortSignal,
  ): Promise<ContactDeliveryOutcome> {
    try {
      const response = await this.fetcher("https://api.resend.com/emails", {
        method: "POST",
        redirect: "error",
        cache: "no-store",
        signal,
        headers: {
          Authorization: "Bearer " + this.configuration.apiKey,
          "Content-Type": "application/json",
          "Idempotency-Key": "contact/" + request.submissionId,
        },
        body: JSON.stringify({
          from: this.configuration.from,
          to: [this.configuration.to],
          subject: "FunkSpace contact message",
          reply_to: request.email,
          text:
            "Name: " +
            (request.name || "(not provided)") +
            "\nEmail: " +
            request.email +
            "\n\nMessage:\n" +
            request.message,
        }),
      });
      if (signal.aborted) {
        cancelContactBody(response.body);
        return timeout;
      }
      let data: unknown;
      try {
        data = await readBoundedJson(
          response.body,
          CONTACT_LIMITS.requestBytes,
          signal,
        );
      } catch {
        return { status: "unknown", code: "provider_response_invalid" };
      }
      if (typeof data !== "object" || data === null || Array.isArray(data)) {
        return { status: "unknown", code: "provider_response_invalid" };
      }
      if (response.status === 200) {
        const id = "id" in data ? data.id : undefined;
        return Object.keys(data).length === 1 && isProviderAcceptanceId(id)
          ? { status: "accepted", acceptanceId: id }
          : { status: "unknown", code: "provider_response_invalid" };
      }
      return classifyError(response.status, data);
    } catch {
      return { status: "unknown", code: "delivery_uncertain" };
    }
  }
}

function classifyError(status: number, data: object): ContactDeliveryOutcome {
  if (
    !("name" in data) ||
    typeof data.name !== "string" ||
    ("statusCode" in data && data.statusCode !== status)
  )
    return { status: "unknown", code: "provider_response_invalid" };
  const name = data.name;
  if (status === 409 && name === "invalid_idempotent_request")
    return { status: "unknown", code: "idempotency_conflict" };
  if (status === 409 && name === "concurrent_idempotent_requests")
    return { status: "unknown", code: "submission_in_progress" };
  if (
    status === 429 &&
    ["daily_quota_exceeded", "monthly_quota_exceeded"].includes(name)
  ) {
    return { status: "unavailable", code: "provider_quota_exceeded" };
  }
  if (status === 429 && name === "rate_limit_exceeded")
    return { status: "unavailable", code: "provider_throttled" };
  if (status === 503 && name === "service_unavailable")
    return { status: "unavailable", code: "provider_unavailable" };
  const rejections: Readonly<Record<string, readonly number[]>> = {
    invalid_idempotency_key: [400],
    validation_error: [400, 403, 422],
    missing_api_key: [401],
    restricted_api_key: [401, 403],
    invalid_api_key: [401, 403],
    invalid_permission: [403],
    suspended_api_key: [403],
    not_found: [404],
    method_not_allowed: [405],
    invalid_parameter: [422],
    missing_required_field: [422],
    missing_required_parameter: [422],
  };
  if (rejections[name]?.includes(status))
    return { status: "failed", code: "provider_rejected" };
  return { status: "unknown", code: "delivery_uncertain" };
}
