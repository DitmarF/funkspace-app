# Contact server setup — FS-5.2 / FS-5.3

The accepted [EPIC 5 contract](../features/FunkSpace_EPIC_5_Detailed_Plan.md#frozen-uiserver-contract)
and [FS-5.1 closure](../tasks/fs-5.1-contact-contract.md) govern this server slice.
[FS-5.2 evidence](../tasks/fs-5.2-contact-server.md) owns the candidate/check results.
This document authorizes no live enabling or deployment.
The [operating guide](contact-operations.md) owns FS-5.3's exact proposed WAF
rule, coverage blockers, log review, quota recovery and emergency disable steps.

## Current implementation

- `domain/contact/ContactValidation.ts`: pure shared normalization, exact own
  string fields, character/length/email/UUID/trap rules. Only the successful
  validator creates the immutable validated-request brand. Wire types are unchanged.
- `application/contact/SubmitContact.ts`: validate, fail closed without a delivery
  port, invoke once and map safe outcomes. `202` requires verified provider UUID
  evidence; its public identifier is the normalized visitor submission UUID.
- `infrastructure/contact/`: server-only configuration, bounded JSON reading,
  request boundary and Resend adapter. The existing browser composition is unchanged.
- `infrastructure/contact/ContactDiagnostics.ts`: runtime allowlist of categorical
  HTTP/outcome/code events only. Request content/identifiers and raw errors are
  excluded; the composition writes one JSON line per application response.
- `infrastructure/services/createContactServerServices.ts`: server composition.
  Its thin `app/api/contact/route.ts` entry uses Node. Other HTTP methods,
  including OPTIONS, reject with `405`/`Allow: POST`; application JSON is no-store.

FS-5.4 now adds the `/contact` page, controlled form/browser submission and shared
navigation destination; [UI verification](contact-ui.md) records its boundaries.
Default delivery-off presentation shows disabled fields, an availability message
and the email fallback; sending remains blocked. The accepted
no-`Button.pending`/no-`InlineStatus` amendment still applies. Server code and
provider contracts remain unchanged.

## Delivery is locked off

`CONTACT_DELIVERY_RELEASED` is false in server composition. Environment values
cannot unlock it. Credentials/mail identities are lazy getters and are not read
while off. Availability is false; valid requests from an allowed configured
origin return `503/configuration_unavailable`. Missing/unapproved origins reject
first with `403/origin_rejected`; malformed/invalid input retains its rejection.

No environment file or account setting is created or changed. Never put real
credentials in prompts, documentation, fixtures, logs or review artifacts.

| Server-only name          | Purpose; no configured values recorded                            |
| ------------------------- | ----------------------------------------------------------------- |
| `CONTACT_ENABLED`         | Defaults off; future enable requires release and external gates   |
| `RESEND_API_KEY`          | Approved scoped credential through a secure environment mechanism |
| `CONTACT_FROM`            | One fixed approved FunkSpace sender at its verified domain        |
| `CONTACT_TO`              | One fixed approved recipient; no lists or visitor overrides       |
| `CONTACT_ALLOWED_ORIGINS` | JSON array of exact canonical scheme/host/port origins            |

Invalid/empty origin arrays fail closed as a whole. Wildcards, userinfo, paths,
query/fragment and non-canonical origins reject. HTTPS is required except
explicit loopback HTTP origins for isolated mocks. Host never supplies trust;
Origin is defense in depth, not bot authentication. Configuration requires one
valid recipient, the fixed FunkSpace sender-label format and a header-safe token.
Syntax cannot prove domain verification, account authorization or mailbox existence.

## Request, provider and retry behavior

Parsing counts actual streamed bytes up to 32 KiB inclusive despite missing or
forged Content-Length. Fatal UTF-8, BOM, malformed JSON and strict shape/types
are checked before field validation. Header controls are checked before trim.
Visible-field errors use the approved codes and precedence; standard JSON
duplicate-member handling follows the accepted plan.

Resend uses a fixed HTTPS endpoint, no redirects/retries, configured fixed
sender/recipient, fixed subject, structured `reply_to` and deterministic plain text.
No HTML, timestamp, CC/BCC, automatic reply or tracking feature is requested;
actual domain tracking settings still require verification before enabling.
The monotonic eight-second deadline includes bounded response reading/parsing.
On timeout the controller aborts. Late responses are discarded/cancelled.
Cancellation is best effort without awaiting an untrusted callback. No field
content, raw provider data or exception text is returned or logged.
Acceptance evidence is an HTTP 200 JSON object containing only a valid UUID `id`.

The adapter uses `contact/<submissionId>` and the unchanged normalized payload.
It rotates no key, schedules no retry, and stores no draft/deduplication cache.
Page-memory identity, edits, the browser's 15-second deadline, non-JSON platform
429 handling and the 23-hour retry cutoff are implemented in FS-5.4. The five-field request
does not contain first-attempt age; the server cannot enforce that browser cutoff.
Provider retention and stable payload/configuration rollout remain required;
exactly-once delivery is not promised. There is no per-process production limiter.

## Controlled checks

```bash
pnpm exec vitest run --config vitest.contact.config.ts --coverage
pnpm -F frontend exec tsc --noEmit --incremental false
pnpm -F frontend exec eslint domain/contact application/contact infrastructure/contact infrastructure/services/createContactServerServices.ts infrastructure/services/createContactServerServices.test.ts app/api/contact --max-warnings=0
```

Contact suites run in Node with injected fakes and no environment-file loading.
A guard fails unexpected global fetch calls even if the application catches the
error. Dedicated contact coverage includes these otherwise excluded layers;
existing broad thresholds remain unchanged. Vitest's `server-only` alias is
test-only; production retains Next's import rejection.

FS-5.2 build/smoke validation uses an isolated HEAD-plus-diff snapshot without
environment files or usable credentials, with fetch egress blocked. Existing
preview output stays untouched. Future browser tests need their own similarly
controlled server; browser interception alone cannot prevent server egress.

## FS-5.6 local integration preparation

The [FS-5.6 record](../tasks/fs-5.6-contact-acceptance.md) extends focused checks
with `ContactJourney.test.ts`: the actual browser adapter, HTTP handler, use case
and Resend adapter are joined through injected in-process fakes. It covers
matching acceptance, deterministic unchanged retry, uncertainty, provider quota
versus non-JSON edge 429, rejection without delivery and full deadline cleanup.
The source release lock is unchanged. Routine checks use a credential-free
snapshot and deny external transport; no routine test calls the real provider.
The [acceptance procedure](contact-acceptance.md) pins external action limits.

## External prerequisites remain pending

The [FS-5.5 processing/storage facts and Dimi checklist](contact-processing-facts.md)
and [operating procedures](contact-operations.md) are prepared from actual source
and rechecked public documentation. They do not inspect/configure accounts or
complete legal/publication/live acceptance; the release lock remains unchanged.

Removing the release lock requires Dimi's separate action/candidate authorization,
actual account terms/DPA/legal review, sender-domain verification and securely
scoped configuration. FS-5.3 must verify platform protection/capacity and all
aliases/preview coverage; regional/distributed-abuse limits remain. FS-5.6 requires
an authorized protected preview/message, with acceptance and receipt recorded
separately. These instructions authorize no setup changes, deployment or live mail.

Official sources rechecked 2026-10-13: [Resend API](https://resend.com/docs/api-reference/emails/send-email),
[API schema](https://github.com/resend/resend-openapi/blob/main/resend.yaml),
[errors](https://resend.com/docs/api-reference/errors),
[idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys),
[Next server-only boundaries](https://nextjs.org/docs/15/app/getting-started/server-and-client-components#preventing-environment-poisoning).
