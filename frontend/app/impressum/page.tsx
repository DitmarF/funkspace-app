import type { Metadata } from "next";
import PortfolioShell from "@/components/Layouts/PortfolioShell";
import ButtonLink from "@/components/Controls/ButtonLink";
import { contactEmail, contactHref } from "@/data/contactContent";

export const metadata: Metadata = {
  title: "Legal notice | FunkSpace",
  description:
    "Operator and contact information for FunkSpace, a personal hobby project by Ditmar Funk.",
};

export default function ImpressumPage() {
  return (
    <PortfolioShell>
      <article className="max-w-prose space-y-fs-lg break-words">
        <h1 className="text-3xl font-bold">Legal notice</h1>
        <p className="text-portfolio-body">
          FunkSpace is a personal website for my own hobby projects and
          experiments. I do not offer paid services through this website.
        </p>
        <section aria-labelledby="operator-heading" className="space-y-fs-md">
          <h2 id="operator-heading" className="text-2xl font-bold">
            Operator information
          </h2>
          <p className="text-portfolio-body">
            Ditmar Funk
            <br />
            Thuringia, Germany
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
