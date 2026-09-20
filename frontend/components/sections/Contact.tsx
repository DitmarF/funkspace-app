import { contactEmail, contactHref } from "@/data/contactContent";
import ButtonLink from "../Controls/ButtonLink";
import PortfolioSection from "../Layouts/PortfolioSection";

export default function Contact() {
  return (
    <PortfolioSection
      id="contact"
      tabIndex={-1}
      aria-labelledby="contact-heading"
    >
      <div className="max-w-prose space-y-fs-md break-words">
        <h2 id="contact-heading" className="text-2xl font-bold">
          Contact
        </h2>
        <ButtonLink href={contactHref} className="scroll-mb-fs-2xl">
          {contactEmail}
        </ButtonLink>
        {/* A future approved form belongs here in document flow, without a
            reserved height or inactive controls before its implementation. */}
      </div>
    </PortfolioSection>
  );
}
