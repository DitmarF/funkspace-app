import type { Metadata } from "next";
import PortfolioShell from "@/components/Layouts/PortfolioShell";
import ButtonLink from "@/components/Controls/ButtonLink";
import { contactEmail, contactHref } from "@/data/contactContent";

const draftNotice = "Draft — operator details are incomplete.";

export const metadata: Metadata = {
  title: "Impressum | FunkSpace",
  description: draftNotice,
};

export default function ImpressumPage() {
  return (
    <PortfolioShell>
      <article className="max-w-prose space-y-fs-lg break-words">
        <h1 className="text-3xl font-bold">Impressum</h1>
        <p className="text-sm leading-6">{draftNotice}</p>
        <section aria-labelledby="operator-heading" className="space-y-fs-md">
          <h2 id="operator-heading" className="text-2xl font-bold">
            Operator information
          </h2>
          <p className="text-base leading-7">
            The operator’s legal name and postal address have not yet been
            supplied. This page is incomplete.
          </p>
        </section>
        <section aria-labelledby="email-heading" className="space-y-fs-md">
          <h2 id="email-heading" className="text-2xl font-bold">
            Email
          </h2>
          <ButtonLink href={contactHref} className="scroll-mb-fs-2xl">
            {contactEmail}
          </ButtonLink>
        </section>
      </article>
    </PortfolioShell>
  );
}
