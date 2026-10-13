import type { Metadata } from "next";
import Link from "next/link";
import PortfolioShell from "@/components/Layouts/PortfolioShell";
import ButtonLink from "@/components/Controls/ButtonLink";
import ContactForm from "@/features/contact/ContactForm";
import { contactEmail, contactHref } from "@/data/contactContent";
import { createContactServerServices } from "@/infrastructure/services/createContactServerServices";
import styles from "../about/page.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contact | FunkSpace",
  description: "General inquiries and email contact for FunkSpace.",
};

export default function ContactPage() {
  const available = createContactServerServices().available;
  return (
    <PortfolioShell>
      <article
        className={`${styles.article} max-w-prose space-y-fs-lg break-words`}
      >
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="text-portfolio-body">
          Have a question, an idea, or some feedback? Get in touch.
        </p>
        <ContactForm available={available} />
        <p className="text-portfolio-body">
          You can always contact me by email. Email links open your mail
          application.
        </p>
        <ButtonLink href={contactHref}>{contactEmail}</ButtonLink>
        <p className="text-portfolio-body">
          Read the{" "}
          <Link href="/privacy" className="text-fs-content-primary underline">
            Privacy information
          </Link>{" "}
          before sharing personal information.
        </p>
      </article>
    </PortfolioShell>
  );
}
