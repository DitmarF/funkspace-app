import PortfolioShell from "@/components/Layouts/PortfolioShell";
import type { Metadata } from "next";
import ButtonLink from "@/components/Controls/ButtonLink";
import { contactEmail, contactHref } from "@/data/contactContent";

export const metadata: Metadata = { title: "Privacy — FunkSpace" };

export default function PrivacyPage() {
  return (
    <PortfolioShell>
      <article className="max-w-prose space-y-fs-lg break-words">
        <h1 className="text-3xl font-bold">Privacy</h1>
        <p className="text-sm leading-6">
          Draft — this privacy information is incomplete.
        </p>
        <section aria-labelledby="appearance-heading" className="space-y-fs-md">
          <h2 id="appearance-heading" className="text-2xl font-bold">
            Appearance preferences
          </h2>
          <p className="text-base leading-7">
            With JavaScript enabled, this site saves your appearance preference
            in your browser’s local storage under the key “theme”. If no valid
            preference has been saved, it stores “system”, which follows your
            device’s light or dark setting. Choosing a theme updates this value.
          </p>
          <p className="text-base leading-7">
            The site does not set an expiry for this value. You can remove it
            using your browser’s site-data controls. This local storage is not a
            cookie.
          </p>
        </section>
        <section aria-labelledby="fonts-heading" className="space-y-fs-md">
          <h2 id="fonts-heading" className="text-2xl font-bold">
            Fonts
          </h2>
          <p className="text-base leading-7">
            Fonts are self-hosted. Work Sans and Space Grotesk are loaded from
            this site.
          </p>
        </section>
        <section aria-labelledby="email-heading" className="space-y-fs-md">
          <h2 id="email-heading" className="text-2xl font-bold">
            Email contact
          </h2>
          <p className="text-base leading-7">
            Email links open your mail application. This site has no contact
            form.
          </p>
          <ButtonLink href={contactHref} className="scroll-mb-fs-2xl">
            {contactEmail}
          </ButtonLink>
        </section>
        <section aria-labelledby="pending-heading" className="space-y-fs-md">
          <h2 id="pending-heading" className="text-2xl font-bold">
            Information still to be completed
          </h2>
          <p className="text-base leading-7">
            Information about the operator, hosting and email processing is
            still being completed. This page is not a complete privacy notice.
          </p>
        </section>
      </article>
    </PortfolioShell>
  );
}
