# Contact processing facts and legal-copy checklist — FS-5.5

Technical preparation at `9ba16f8d0ba7dcc5b24ff57383dc8631701b7185` on
`feature/funkspace-minimum-usable`, inspected 2026-10-14. Public provider/platform
documentation was rechecked that day. Account/deployment settings were not accessed.
The [Workspace/DMARC follow-up](contact-operations.md#workspace-aliases-and-prepared-dmarc--2026-10-15)
adds 2026-10-15 screenshot/header evidence, operator-reported mailbox tests and
read-only public DNS checks. It does not change runtime or public contact details.
This is factual input for Dimi, not approved legal copy or legal certification.
The [task evidence](../tasks/fs-5.5-contact-operations.md), [operating guide](contact-operations.md)
and [frozen contract](../features/FunkSpace_EPIC_5_Detailed_Plan.md#frozen-uiserver-contract)
govern scope. Public Privacy/Impressum pages are unchanged drafts.

## Current behavior versus the implemented delivery path

The production composition's `CONTACT_DELIVERY_RELEASED` constant is false;
environment configuration cannot unlock it. It does not read the mail credential/
identities or construct a Resend adapter while disabled. `/contact` renders Name,
Email and Message plus an ordinary Send button, all disabled before hydration,
without JavaScript and while unavailable. The public fallback is
`diamondfunk13@gmail.com`; its mailto link opens the visitor's mail application.
FunkSpace does not send that fallback message itself. These are actual source
facts; the intended Vercel project's URL/revision/configuration is unverified.

If the visitor sends an email from that mail application, their mail provider
processes it and the recipient Gmail mailbox can receive it independently of
FunkSpace form availability. Ordinary page visits can still generate hosting logs.
The safe form-availability boolean is configuration-derived, not a live provider/
quota/verification health check.

The following path is implemented and tested with fakes, but gated off:

```text
Browser form → same-origin JSON POST /api/contact
  → Vercel edge protection (actual rule/coverage pending)
  → Next.js Node route → origin/media/body checks → shared validation/use case
  → server-only Resend HTTPS request → recipient Gmail
```

An allowed, valid direct request to this disabled candidate returns configuration
unavailable, not acceptance. Earlier method/origin/media/body/validation rejection
still applies. Edge denial may prevent the function from running at all. No
Server Action, separate backend, application inbox, webhook, queue, stored draft,
automatic reply or automatic retry is implemented. Storybook's clearly marked
simulated acceptances never invoke the mail adapter.

Source: [composition](../../frontend/infrastructure/services/createContactServerServices.ts),
[page](../../frontend/app/contact/page.tsx), [form](../../frontend/features/contact/ContactForm.tsx),
[route](../../frontend/app/api/contact/route.ts), [request handler](../../frontend/infrastructure/contact/ContactRequestHandler.ts),
[use case](../../frontend/application/contact/SubmitContact.ts), [public fallback](../../frontend/data/contactContent.ts).

## Data inventory

| Data               | Browser and Vercel function                                                         | Resend and recipient mailbox, if later enabled                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | Optional string; trimmed, at most 100 JavaScript string units                       | Plain-text Name line; empty becomes “(not provided)”                                                                                |
| `email`            | Required trimmed single address; at most 254 units; control/header-injection checks | Structured Reply-To and plain-text Email line, so a human can reply                                                                 |
| `message`          | Required, normalized line endings, trimmed; at most 5,000 units                     | Plain-text Message section                                                                                                          |
| `submissionId`     | UUID v4 held with retry state in page memory; exact response matching               | `contact/<submissionId>` provider idempotency header; not included in mail text                                                     |
| `website`          | Hidden, no keyboard/AT exposure; exactly empty or request rejects as spam           | Not forwarded                                                                                                                       |
| Fixed mail fields  | Visitor cannot set sender/recipient/subject/CC/BCC                                  | One resolved configured sender and one recipient; hardcoded subject “FunkSpace contact message”; no HTML, attachments or timestamps |
| Transport metadata | Hosting/edge may process IP, path, headers, user agent and platform identifiers     | Provider may retain API request/response and delivery metadata; Gmail processes message/header/account data                         |

Strict five-string JSON shape, unexpected keys/types, fatal UTF-8, malformed JSON
and actual streamed 32 KiB bounds are enforced. Invalid/spam/origin requests do
not reach delivery; the function can still receive/process rejected input or
record its categorical outcome. Some valid IDs are echoed in error responses;
the internal provider acceptance ID is neither a public response field nor an
application diagnostic field. Resend request headers include server authentication;
credentials never go to the browser, mail text or application diagnostic writer.

The selected recipient is Dimi's supplied Gmail address. The configuration reader
accepts a single validated configured recipient and a FunkSpace-labelled sender;
syntax does not prove that the actual account uses the selected address/domain.
The proposed sender is at `mail.funkspace.de`, under owned `funkspace.de`, after
verification. Neither ownership nor this document verifies DNS/account setup.
Source: [validation](../../frontend/domain/contact/ContactValidation.ts),
[configuration](../../frontend/infrastructure/contact/ContactConfiguration.ts),
[actual provider payload](../../frontend/infrastructure/contact/ResendContactDelivery.ts).

## Acceptance, receipt and retained retry state

Public 202 is returned only after the adapter obtains a valid provider acceptance
identifier; the browser additionally requires the exact accepted envelope and
matching submission ID. It means accepted for delivery, not recipient receipt,
inbox placement, reading or a reply. No webhook/receipt reconciliation exists;
Dimi must separately confirm Gmail receipt during an authorized FS-5.6 test.

The provider exchange deadline is eight seconds, including response reading;
the browser deadline is fifteen seconds. Lost/malformed responses, timeout,
cancellation and ambiguous errors stay uncertain because mail may have been
accepted. A caller abort is not a recall. Unchanged explicit manual retries keep
the normalized payload/ID; any edit retires that attempt. The browser closes
unchanged retries after 23 hours, using conservative elapsed time/wake checks.
No first-attempt age is sent, so the server cannot enforce that browser cutoff.
Provider idempotency lasts 24 hours; the margins do not promise exactly-once mail.
[Browser adapter](../../frontend/infrastructure/contact/BrowserContactSubmission.ts),
[response parser](../../frontend/domain/contact/ContactBrowserResponse.ts),
[Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).

## Storage re-audit

These are the two runtime appearance keys found in frontend/common/game source:

| Local-storage key                | Actual value/write behavior                                                                                                                                                                     | Lifetime and removal                                                                                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `theme`                          | `default`, `dark`, `muted`, `dark-high-contrast`, `system`. Parser startup and service initialization normalize missing/invalid state by writing `system`; explicit selection writes the choice | No app expiry. No preference-service removal; browser site-data controls can remove it, but later JS startup recreates absent System |
| `funkspace.motion.preference.v1` | `system`, `on`, `reduced`, `off`. Initialization reads and falls back to System without writing/removing absent/invalid state. Explicit selection writes, including reselection                 | No app expiry. Browser site-data controls can remove it; it remains absent until another explicit selection                          |

Storage failures are caught: live choices remain usable in memory, but reload may
read an older saved value or fallback. No preference service subscribes to browser
storage events, so another tab's selection does not automatically update an
already initialized service. System choices observe device preferences through
existing adapters. Without JavaScript these application storage writes do not run.
The keys are local storage, not cookies, and are not included in the contact JSON.

Contact text/errors are React state; normalized retry payload/UUID/start time are
refs in page memory. There is no contact storage adapter, URL encoding, cookie,
local/session storage, IndexedDB or application cache persistence. The application
discards state on a fresh page mount/reload; browser autofill, memory restoration
or OS/browser handling is outside this application guarantee. Existing controlled
tests check text/UUID absent from local/session storage and loss on reload.
No new runtime test or live browser storage inspection was needed for this audit.

Source: [theme values](../../frontend/domain/theme/Theme.ts),
[bootstrap](../../frontend/infrastructure/theme/themeBootstrap.ts),
[theme service](../../frontend/application/theme/ThemeService.ts),
[motion values](../../frontend/domain/motion/MotionPolicy.ts),
[motion service](../../frontend/application/motion/MotionPolicyService.ts),
[storage adapter](../../frontend/infrastructure/storage/LocalStorageAdapter.ts),
[draft regression](../../e2e/contact-page.spec.ts).
Scene asset preparation is same-origin and memory-only; fonts use
[next/font/local](../../frontend/app/fonts.ts). No application cookie writer was
found. This is not an infrastructure-wide cookie-free claim: same-origin contact
fetch can carry existing deployment-protection/authentication cookies.

## Provider retention, location and agreements — public facts only

Resend states that customer content/log/account data is stored in the US; an EU
sending region does not move stored data. Email/log retention is 30 days on
Free/Pro/Scale, configurable on Enterprise; backups persist seven days. Remaining
customer data is deleted within 90 days after account termination. Early specific
message removal requires contacting support. Its standard DPA is pre-signed and
executed at signup, with an account copy available for download. Normal Emails
API content is not sent to Anthropic; RunPod samples some emails for trust/safety.
Actual FunkSpace account/region/plan/agreement settings remain unverified.
[Resend GDPR facts](https://resend.com/security/gdpr),
[security](https://resend.com/security), [regions](https://resend.com/docs/dashboard/domains/regions).

Resend's API-log schema includes original request/response bodies; categorical
application logs do not mean content-free provider logs.
[Retrieve Log](https://resend.com/docs/api-reference/logs/retrieve-log).
The [DPA](https://resend.com/legal/dpa) has processing/transfer/retention provisions;
its three-year compliance-record provision is not message retention. Dimi must
review applicable [terms](https://resend.com/legal/terms-of-service),
[privacy policy](https://resend.com/legal/privacy-policy),
[subprocessors](https://resend.com/legal/subprocessors) and account-specific DPA.
Published assurances are not this site's legal approval.

The later Workspace follow-up confirms the `info@funkspace.de` alias/sending
identity, Dimi's successful receiving/reply loop, and receipt at the
`dmarc@funkspace.de` report alias. Outbound SPF/DKIM passed for `funkspace.de`.
The prepared DMARC record is unpublished; no FunkSpace DMARC PASS is established.
The current app still exposes the testing Gmail fallback, not the Workspace alias.
Gmail mailbox processing/storage location, account terms, forwarding/export,
access controls and retention settings have not been audited. Business Starter
and sole access are Dimi's reports; the mailbox tests do not verify a Google
processor agreement or EU-only storage. Archiving keeps mail in
All Mail; Delete moves it to Trash, recoverable up to 30 days unless Delete forever
is used. Google documents asynchronous deletion/backup retention and exceptions.
The operator's six-month mailbox policy is distinct from all providers' retention
and does not remove correspondents' copies.
[Gmail archive](https://support.google.com/mail/answer/6576?hl=en),
[Gmail delete](https://support.google.com/mail/answer/7401?co=GENIE.Platform%3DDesktop&hl=en),
[Google retention](https://policies.google.com/technologies/retention?hl=en).

## Diagnostics and platform evidence

The application writer receives only `event`, `httpStatus`, `outcome`, `code`;
accepted has a null code. It excludes human fields/content, raw errors, credentials,
request metadata, IPs and submission/provider IDs. Writer failure does not change
delivery or cause retries. This does not establish infrastructure-wide identifier
or content exclusion. Vercel runtime/firewall/drains and Resend logs are separate;
the [operating guide](contact-operations.md#application-diagnostics-and-separate-platform-review)
records public capabilities/defaults and required actual account checks.
[Diagnostic projection](../../frontend/infrastructure/contact/ContactDiagnostics.ts).

The dated Workspace tests concern mail aliases. A supplied Vercel screenshot
shows domain/project attachment, but no installed WAF, export, complete
web-deployment alias inventory or protection evidence has been supplied. The
five/IP/ten-minute fixed-window POST rule remains a proposal;
regional/distributed-abuse and shared-network limits remain. Public Preview
environment support is not proof of any reachable URL's protection. All actual
coverage rows are pending; no deployed security acceptance is claimed.

## Dimi legal-copy approval checklist

- [ ] Supply/approve actual operator legal identity, postal address and required contact details; no placeholder replacement is authorized here.
- [ ] Decide/approve the purpose, applicable legal basis and rights/contact language; technical facts do not select them or justify a consent checkbox automatically.
- [ ] Verify actual Vercel/Resend/Gmail account types, terms/agreements, roles, locations/transfers/subprocessors, logging access/retention/drains and protection cookies; review sampled abuse-processing facts.
- [ ] Approve both appearance keys' precise defaults/write/lifetime/removal behavior and their applicable legal treatment; avoid unsupported consent/exemption conclusions.
- [ ] Describe app-memory-only drafts accurately, including limits concerning browser autofill/restoration, protected-preview cookies and the separate email fallback.
- [ ] Apply the selected six-month-after-conversation-end policy for closed ordinary mailbox inquiries, with documented justified exceptions. Decide closure-date recording, cleanup cadence, Trash/Sent/archive/export handling and exception review/deletion dates; see the operating procedure.
- [ ] Approve disabled-current versus later-enabled contact wording and acceptance-versus-receipt language against verified configuration; do not present the future processing chain as currently live.
- [ ] Approve final Privacy/Impressum text and metadata for publication separately. Current Privacy omits the motion key and complete hosting/email facts; Impressum still lacks operator identity/address. FS-5.5 legal/publication acceptance and FS-5.6 live acceptance remain pending.

Source public drafts: [Privacy](../../frontend/app/privacy/page.tsx),
[Impressum](../../frontend/app/impressum/page.tsx). Dimi owns factual/legal-copy
approval; Sites integrates only approved copy in the existing page structure.
