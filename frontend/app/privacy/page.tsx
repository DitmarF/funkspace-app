import PortfolioShell from "@/components/Layouts/PortfolioShell";
import type { Metadata } from "next";
import Link from "next/link";
import ButtonLink from "@/components/Controls/ButtonLink";
import { contactEmail, contactHref } from "@/data/contactContent";

export const metadata: Metadata = {
  title: "Privacy | FunkSpace",
  description:
    "How FunkSpace handles website requests, appearance preferences and email inquiries, and how to exercise your privacy rights.",
};

export default function PrivacyPage() {
  return (
    <PortfolioShell>
      <article className="max-w-prose space-y-fs-lg break-words">
        <h1 className="text-3xl font-bold">Privacy</h1>
        <p className="text-portfolio-body">
          FunkSpace is my personal hobby website. This notice explains the data
          used to provide the website, remember appearance choices and answer
          inquiries. Last updated:{" "}
          <time dateTime="2026-10-27">27 October 2026</time>.
        </p>
        <section aria-labelledby="operator-heading" className="space-y-fs-md">
          <h2 id="operator-heading" className="text-2xl font-bold">
            Who is responsible
          </h2>
          <p className="text-portfolio-body">
            Ditmar Funk, Thuringia, Germany, is responsible for this website’s
            processing of personal data. You can contact me about an inquiry or
            your privacy rights at:
          </p>
          <ButtonLink href={contactHref} className="scroll-mb-fs-2xl">
            {contactEmail}
          </ButtonLink>
        </section>
        <section aria-labelledby="hosting-heading" className="space-y-fs-md">
          <h2 id="hosting-heading" className="text-2xl font-bold">
            Hosting and technical requests
          </h2>
          <p className="text-portfolio-body">
            Vercel hosts this website. Delivering pages and protecting the
            service involves technical data such as your IP address, requested
            page, browser information, request time, response status and
            technical identifiers. These data are used to operate the website,
            diagnose faults and prevent misuse.
          </p>
          <p className="text-portfolio-body">
            Vercel’s published Hobby plan provides one hour of runtime-log
            history. This is not a deletion deadline for all infrastructure or
            security records. Provider retention also depends on the type of
            record and operational, security and legal needs. See{" "}
            <a
              href="https://vercel.com/docs/logs/runtime"
              className="text-fs-content-primary underline"
            >
              Vercel’s runtime-log documentation
            </a>{" "}
            and{" "}
            <a
              href="https://vercel.com/legal/privacy-notice"
              className="text-fs-content-primary underline"
            >
              Vercel’s privacy notice
            </a>
            .
          </p>
        </section>
        <section aria-labelledby="email-heading" className="space-y-fs-md">
          <h2 id="email-heading" className="text-2xl font-bold">
            Email inquiries and retention
          </h2>
          <p className="text-portfolio-body">
            Email links open your own mail application; FunkSpace does not send
            that email for you. If you write to me, I process your email
            address, any name you provide, your message and the email’s
            technical headers to handle the inquiry and reply. Please share only
            information needed for your inquiry. Providing it is voluntary; I
            need a way to contact you to send a reply.
          </p>
          <p className="text-portfolio-body">
            The contact mailbox uses Google Workspace. Your email provider and
            Google process the correspondence to deliver and store it. I
            personally manage the inquiry mailbox and have not authorised anyone
            else to handle inquiries.
          </p>
          <p className="text-portfolio-body">
            My policy is to delete closed ordinary inquiries six calendar months
            after the conversation ends. Cleanup is manual. Justified
            exceptions, such as an unresolved dispute or an applicable retention
            obligation, are documented and reviewed. This policy covers copies
            under my control; provider backups and copies held by correspondents
            have separate retention arrangements.
          </p>
        </section>
        <section aria-labelledby="form-heading" className="space-y-fs-md">
          <h2 id="form-heading" className="text-2xl font-bold">
            Contact form and drafts
          </h2>
          <p className="text-portfolio-body">
            The{" "}
            <Link href="/contact" className="text-fs-content-primary underline">
              Contact page
            </Link>{" "}
            shows whether form submission is available. The form has an optional
            Name field and required Email and Message fields. If form submission
            is disabled, please use the email alternative.
          </p>
          <p className="text-portfolio-body">
            When the form is available, submitting sends your optional name,
            required email address and message from your browser to the
            website’s Vercel server, then through Resend to the Google Workspace
            inquiry mailbox. A submission identifier allows an unchanged manual
            retry to be recognized. This delivery uses plain-text email, your
            validated email address for replies, and no automatic replies or
            open/click tracking. Provider acceptance confirms acceptance for
            delivery, not arrival in the mailbox.
          </p>
          <p className="text-portfolio-body">
            Resend’s selected sending region is Ireland. This does not mean
            EU-only storage: Resend stores message content and delivery records
            in the United States. Resend publishes standard email and log
            retention of 30 days and backup retention of seven days. Retention
            depends on the applicable plan and storage settings and is separate
            from my mailbox cleanup policy. See{" "}
            <a
              href="https://resend.com/security/gdpr"
              className="text-fs-content-primary underline"
            >
              Resend’s processing and retention information
            </a>
            .
          </p>
          <p className="text-portfolio-body">
            Contact drafts and retry identifiers are kept in page memory only;
            FunkSpace does not save them in local storage, session storage,
            cookies or URLs. A fresh page mount or reload starts a new draft.
            Your browser may manage autofill or restore previous values
            independently.
          </p>
        </section>
        <section aria-labelledby="appearance-heading" className="space-y-fs-md">
          <h2 id="appearance-heading" className="text-2xl font-bold">
            Appearance preferences
          </h2>
          <p className="text-portfolio-body">
            With JavaScript enabled, FunkSpace uses your browser’s local storage
            to remember appearance preferences. The <code>theme</code> key
            stores the selected theme. When it is missing or invalid, the site
            saves <code>system</code>, which follows your device’s light or dark
            setting. Choosing a theme updates that value.
          </p>
          <p className="text-portfolio-body">
            The <code>funkspace.motion.preference.v1</code> key stores your
            motion choice when you select an option. Without a valid saved
            choice, the site follows your system preference without creating
            this key.
          </p>
          <p className="text-portfolio-body">
            These values are local storage, not cookies. FunkSpace sets no
            expiry for them, and they are not included in contact submissions.
            You can delete them using your browser’s site-data controls; a later
            visit can recreate the default theme value. If storage is
            unavailable, choices can still work for the current page but may not
            survive a reload. Without JavaScript, these storage writes do not
            run.
          </p>
        </section>
        <section aria-labelledby="assets-heading" className="space-y-fs-md">
          <h2 id="assets-heading" className="text-2xl font-bold">
            Fonts, assets and analytics
          </h2>
          <p className="text-portfolio-body">
            Work Sans and Space Grotesk fonts and decorative assets are served
            from this website. FunkSpace does not use visitor analytics,
            advertising trackers or third-party embedded content. Ordinary
            hosting and security processing still takes place.
          </p>
        </section>
        <section aria-labelledby="purposes-heading" className="space-y-fs-md">
          <h2 id="purposes-heading" className="text-2xl font-bold">
            Purposes and legal basis
          </h2>
          <p className="text-portfolio-body">
            Where personal data is processed to provide and secure this hobby
            website or answer general inquiries, the basis is my legitimate
            interests under Article 6(1)(f) GDPR. Those interests are a usable,
            accessible and secure website and responding to messages addressed
            to me. Data is used only as needed for those purposes, with your
            rights and interests taken into account.
          </p>
          <p className="text-portfolio-body">
            FunkSpace does not use automated decision-making that produces legal
            or similarly significant effects on visitors.
          </p>
        </section>
        <section aria-labelledby="providers-heading" className="space-y-fs-md">
          <h2 id="providers-heading" className="text-2xl font-bold">
            Providers and international processing
          </h2>
          <p className="text-portfolio-body">
            Vercel and Google operate internationally. Hosting and email data
            may be processed outside Germany and the European Economic Area,
            including in the United States. Germany-only or EU-only storage is
            not promised. Their published information describes international
            processing and transfer safeguards; the applicable safeguards depend
            on the service and processing involved. You can ask me for further
            information using the contact address above.
          </p>
          <p className="text-portfolio-body">
            See{" "}
            <a
              href="https://vercel.com/legal/privacy-notice"
              className="text-fs-content-primary underline"
            >
              Vercel’s privacy and transfer information
            </a>{" "}
            and{" "}
            <a
              href="https://workspace.google.com/terms/dpa_terms.html"
              className="text-fs-content-primary underline"
            >
              Google Workspace’s data processing and transfer terms
            </a>
            .
          </p>
        </section>
        <section aria-labelledby="rights-heading" className="space-y-fs-md">
          <h2 id="rights-heading" className="text-2xl font-bold">
            Your rights
          </h2>
          <p className="text-portfolio-body">
            Under the conditions set out in the GDPR, you can request access,
            correction or deletion of your personal data, restriction of
            processing and, where applicable, data portability. You can object
            to processing based on legitimate interests for reasons relating to
            your particular situation. Contact me using the email address above
            to exercise these rights.
          </p>
          <p className="text-portfolio-body">
            You can also complain to a data protection supervisory authority,
            including the authority where you live or work. In Thuringia, this
            is the{" "}
            <a
              href="https://tlfdi.de/kontakt/"
              className="text-fs-content-primary underline"
            >
              Thüringer Landesbeauftragte für den Datenschutz und die
              Informationsfreiheit (TLfDI)
            </a>
            .
          </p>
        </section>
      </article>
    </PortfolioShell>
  );
}
