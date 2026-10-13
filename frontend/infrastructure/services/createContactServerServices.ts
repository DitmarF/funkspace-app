import "server-only";
import { ContactUseCase } from "@/application/contact/SubmitContact";
import { readContactConfiguration } from "@/infrastructure/contact/ContactConfiguration";
import { createContactRequestHandler } from "@/infrastructure/contact/ContactRequestHandler";
import { ResendContactDelivery } from "@/infrastructure/contact/ResendContactDelivery";

// FS-5.2 is local implementation only. Remove this lock only in an explicitly
// authorized candidate after protection, account/legal and preview gates pass.
const CONTACT_DELIVERY_RELEASED = false;

export function createContactServerServices() {
  const configuration = readContactConfiguration({
    CONTACT_ENABLED: CONTACT_DELIVERY_RELEASED
      ? process.env.CONTACT_ENABLED
      : undefined,
    CONTACT_ALLOWED_ORIGINS: process.env.CONTACT_ALLOWED_ORIGINS,
    get RESEND_API_KEY() {
      return process.env.RESEND_API_KEY;
    },
    get CONTACT_FROM() {
      return process.env.CONTACT_FROM;
    },
    get CONTACT_TO() {
      return process.env.CONTACT_TO;
    },
  });
  const delivery = configuration.delivery
    ? new ResendContactDelivery(configuration.delivery, (url, init) =>
        fetch(url, init),
      )
    : null;
  const useCase = new ContactUseCase(delivery);
  return {
    available: delivery !== null,
    handle: createContactRequestHandler(
      (input) => useCase.execute(input),
      configuration.allowedOrigins,
      (event) => console.info(JSON.stringify(event)),
    ),
  };
}
