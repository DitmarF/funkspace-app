import "server-only";
import { ContactUseCase } from "@/application/contact/SubmitContact";
import { readContactConfiguration } from "@/infrastructure/contact/ContactConfiguration";
import { createContactRequestHandler } from "@/infrastructure/contact/ContactRequestHandler";
import { ResendContactDelivery } from "@/infrastructure/contact/ResendContactDelivery";

export function createContactServerServices() {
  const configuration = readContactConfiguration({
    // Delivery defaults off; only exact true plus valid configuration enables it.
    CONTACT_ENABLED: process.env.CONTACT_ENABLED,
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
