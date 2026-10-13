# Feature plan: EPIC 5 — Real contact delivery, privacy, and failure handling

## Plan metadata

- **Status:** FS-5.1 complete — Dimi accepted the consuming contract and closed the task on 2026-10-13, with the presentation amendment below. FS-5.2 implemented for review with delivery locked off; documentation finalization and commit/push separately authorized on 2026-10-13. FS-5.3–FS-5.6 not started.
- **Owner:** Codex for contract/server preparation; Sites for FS-5.4; Dimi for product, legal and external approvals.
- **Parent authority:** [Minimum Usable Experience](funkspace-minimum-usable.md#epic-5--real-contact-delivery-privacy-and-failure-handling) owns milestone status and gates. This linked plan owns EPIC 5 detail; the [FS-5.1 record](../tasks/fs-5.1-contact-contract.md) owns execution evidence.
- **Last updated / official-document checks:** 2026-10-13.
- **Actual local base:** `/Users/dimi/Projects/funkspace-app`, `feature/funkspace-minimum-usable`, `2c545cd7cb3bc074a126fffa61166577f113cc7b`; clean at inspection. Historical planning baseline equals actual HEAD; no reset performed.
- **Target release:** Not scheduled. First real-delivery acceptance requires a separately authorized protected preview. FS-G2, publication and game integration remain separate.
- **Related decisions:** [FS-0.5](../tasks/fs-0.5-product-and-technical-decisions.md), [architecture](../architecture.md#contact-composition--fs-51), [ADR-001](../decisions/ADR-001-monorepo-strategy.md), [ADR-003](../decisions/ADR-003-interactive-experience-boundary.md).

### Source provenance and authorization

The supplied `/Users/dimi/Downloads/FunkSpace_EPIC_5_Detailed_Plan.md` (2026-10-13; original-byte SHA-256 `a1bed1b7fa900d297c635ac79f3309697ea6b3066be83a140321e594ed4e5445`) is preserved here as a reconciled plan. Its six task IDs, leads, counterpart/Dimi responsibilities and acceptance gates are retained. The parent plan's existing foundation dependencies are retained as well. Obsolete Plan-mode/save-pending statements and historical validation claims are replaced with this task's actual evidence; this is not a byte-for-byte archive. The supplied original remains unchanged.

The initial user request authorized FS-5.1 local preparation only. Dimi subsequently accepted the consuming contract, explicitly closed FS-5.1 and authorized committing/pushing this bounded change on 2026-10-13. That authorization does not extend to later tasks, merge, deployment, account/DNS/firewall changes or live email. Historical documents and this roadmap are not action permission. Never paste secrets into a prompt. Design reference: [Figma folder](https://www.figma.com/files/folder/490787975); no Figma inspection or new visual acceptance claimed here. Repository source: [GitHub](https://github.com/DitmarF/funkspace-app).

### Accepted contact presentation amendment — 2026-10-13

Dimi decided that the contact form will use neither the Button's `pending` capability nor `InlineStatus`. No spinner, “Working…”/“Sending your message…” presentation or pending live-status region is required. This resolves the consumer review's duplicate-announcement finding without changing the wire contract or existing shared primitives. Sending remains an internal state: keep the synchronous form submission guard, read-only fields, request deadlines, draft/key preservation and honest response handling. Use the ordinary Button with `pending` omitted; native disabling while submitting or unavailable is permitted. Show field errors and final acceptance/failure/recovery copy as ordinary text; focus the first invalid field for validation, or the result text after a non-validation outcome so feedback is discoverable without an `InlineStatus` region. Do not add a second feedback component or change the accepted controls globally. Final form/layout/device acceptance remains FS-5.4 work.

## Goal and user value

A visitor can make a general inquiry in English through a plain, accessible `/contact` page using the existing portfolio shell, with honest feedback and an email fallback. Provider acceptance and actual mailbox receipt remain distinct. Build a small working contact journey without a separate backend, inbox database or messaging framework.

### Settled choices

| Concern                     | Decision                                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Entry / appearance          | Dedicated plain `/contact`, existing `PortfolioShell`; header/tree Contact enabled in FS-5.4                                               |
| Visible fields              | Optional Name; required Email and Message; no other visible inputs                                                                         |
| Purpose / language          | General inquiries, collaboration, questions and feedback; English                                                                          |
| Recipient / public fallback | `diamondfunk13@gmail.com`; reuse `frontend/data/contactContent.ts` for public presentation                                                 |
| Owned domain                | `funkspace.de`, supplied by Dimi; account/DNS control not independently verified                                                           |
| Proposed fixed sender       | `FunkSpace <contact@mail.funkspace.de>`, only after sender-domain verification                                                             |
| Transport / host            | Resend HTTPS API in the existing Next.js/Vercel deployment                                                                                 |
| Mailbox cleanup             | Closed ordinary inquiries deleted six months after conversation end; justified exceptions documented with reason and review/deletion point |
| Initial live acceptance     | Separately authorized protected preview and exact controlled message                                                                       |
| Legal/account gate          | Actual provider/account terms and legal content reviewed before enabling live delivery                                                     |

No subject/phone/company/budget fields, attachments, consent checkbox, automatic reply, marketing subscription, tracking, webhook or application inbox. No homepage Contact restoration or accepted scene/homepage redesign.

## Current repository evidence

- Next.js `15.5.24` App Router; `backend/` remains a reserved stub. At the FS-5.1 base there was no contact server/UI. FS-5.2 now adds shared validation, use case/port, server-only adapter/composition and Node `/api/contact`; [candidate/check evidence](../tasks/fs-5.2-contact-server.md) records the implementation. `/contact` and browser wiring remain absent.
- `frontend/app/page.tsx` contains Start and AboutPreview only. `portfolioNavigation.ts` supplies the same disabled Contact item to header/tree; `portfolioDestinations.ts` has no Contact destination.
- `PortfolioShell` and the plain `/about` article provide the shell precedent. Reuse accepted `TextField`, `TextAreaField`, ordinary `Button` and link primitives; [FS-1.5](../tasks/fs-1.5-essential-form-primitives.md) preserves their APIs. Contact does not consume `Button.pending` or `InlineStatus` under Dimi's amendment; those shared primitives remain available to other consumers.
- `createServices` / `ServiceProvider` own browser composition and controlled fixture injection. No mail credentials or server adapter may enter this graph.
- Privacy and Impressum remain explicit drafts. The current privacy page truthfully says there is no contact form, but must be amended when one exists. It describes only `theme`; the existing motion preference key is also required in final copy.
- [EPIC 4 closure](../tasks/fs-4.8-scene-acceptance.md#fs-48-and-epic-4-closure--2026-10-13) is complete. Existing scene acceptance remains intact; FS-G2 still requires EPIC 5.

## Frozen UI/server contract

The pure [ContactContract.ts](../../frontend/domain/contact/ContactContract.ts) contains request/result types, HTTP mapping and limits only. It performs no validation, request, configuration read or UI work. Types describe trusted values; incoming JSON is `unknown` until FS-5.2 checks it.

### Request and normalization

One JSON **`POST /api/contact`**, with exactly these required string properties: `name`, `email`, `message`, `submissionId`, `website`. No Server Actions or separate backend. No extra keys, arrays, null, missing properties or coerced types.

| Field          | Frozen rule                                                                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`         | ECMAScript `trim()`; optional empty string; at most 100 JavaScript UTF-16 string units                                                                             |
| `email`        | `trim()`; nonempty; at most 254 units; practical single-address grammar below                                                                                      |
| `message`      | Replace CRLF and lone CR with LF, then `trim()`; nonempty; at most 5,000 units                                                                                     |
| `submissionId` | UUID v4, RFC variant (`8`, `9`, `a`, `b`); canonical hyphenated shape; case-insensitive hex accepted, normalized lowercase; do not trim/coerce                     |
| `website`      | Exactly empty string; do not trim a populated trap into empty; excluded from assistive technology and keyboard navigation, with autocomplete off and no `required` |
| Request body   | Maximum 32,768 bytes, inclusive, counted during stream reading before decode/parse; reject excess even with absent/forged `Content-Length`                         |

Reject invalid UTF-8 with fatal decoding; reject malformed JSON and a leading BOM. JSON must be an object with exactly the five own keys above. JSON duplicate member names follow standard `JSON.parse` last-member semantics; no custom JSON parser is introduced. Apply header-safety checks to raw name/email before trimming: reject U+0000–001F, U+007F–009F and U+2028/U+2029, so CR/LF injection cannot disappear through trimming. After line-ending normalization, Message permits LF and tab but rejects other C0/C1 controls; reject lone UTF-16 surrogates in all human fields to avoid lossy payload encoding. Do not normalize Unicode or strip/interpret message HTML; plain text remains plain text.

Email uses the single-address JavaScript-compatible grammar in the [HTML standard](<https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)>), with ASCII local/domain syntax and no display names, lists or quoted local parts. ASCII punycode domains are allowed; native `type=email` is an input aid, not server authority. Do not lowercase the email or claim mailbox existence from syntax. FS-5.2 shares the same pure rules for server validation and FS-5.4 feedback, without adding a parser dependency.

Accept `application/json`, optionally with `charset=utf-8` (case-insensitive); reject other media types/charsets or content encodings other than identity. No permissive CORS. Check method, exact origin allowlist, media type, bounded stream, decoding/shape, identifier/trap, human-field validation, then configuration before provider invocation. Unsupported methods use `405` and `Allow: POST`; preflight never sends mail. Origin failures may return before reading the body, with `submissionId: null`. Missing/unapproved Origin is rejected; never derive trust from Host or wildcard preview domains. Origin is defense in depth, not authentication against bots.

### Response envelopes and HTTP mapping

Application-controlled JSON responses carry `Content-Type: application/json` and `Cache-Control: no-store`. HTTP status is transport metadata, not a JSON field. An accepted body is exactly `{ status: "accepted", submissionId }`. Every error has `{ status, code, submissionId }`, plus only `fieldErrors` for `422` or `retryAfterSeconds` for `429`. Error `submissionId` is the normalized validated UUID if safely available, otherwise `null`. No echoed content, provider ID/raw error or arbitrary message strings. Browser copy maps stable codes locally.

| HTTP | `status`       | Exact `code`                | Meaning                                                                                                       |
| ---- | -------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 202  | `accepted`     | None                        | Resend success response has a valid acceptance UUID; matching request UUID returned; mailbox receipt unproven |
| 400  | `rejected`     | `invalid_utf8`              | Invalid UTF-8                                                                                                 |
| 400  | `rejected`     | `malformed_json`            | Invalid JSON or leading BOM                                                                                   |
| 400  | `rejected`     | `invalid_shape`             | Non-object, unexpected/missing keys or wrong types                                                            |
| 400  | `rejected`     | `invalid_submission_id`     | Not UUID v4                                                                                                   |
| 400  | `rejected`     | `spam_rejected`             | Nonempty website; no provider invocation and no fake success                                                  |
| 403  | `rejected`     | `origin_rejected`           | Missing/unapproved Origin                                                                                     |
| 405  | `rejected`     | `method_not_allowed`        | Method other than POST                                                                                        |
| 413  | `rejected`     | `request_too_large`         | Stream exceeds 32 KiB                                                                                         |
| 415  | `rejected`     | `unsupported_media_type`    | Wrong content type, charset or encoding                                                                       |
| 422  | `invalid`      | `validation_failed`         | Visible-field validation; nonempty `fieldErrors`                                                              |
| 429  | `rate_limited` | `rate_limited`              | Request abuse limit; retry delay where known                                                                  |
| 503  | `unavailable`  | `configuration_unavailable` | Delivery off or missing/invalid server configuration; reveal no configuration detail                          |
| 503  | `unavailable`  | `provider_quota_exceeded`   | Explicit provider quota rejection                                                                             |
| 503  | `unavailable`  | `provider_throttled`        | Explicit provider request-rate rejection                                                                      |
| 503  | `unavailable`  | `provider_unavailable`      | Explicit provider service-unavailable rejection with evidence of no acceptance                                |
| 502  | `failed`       | `provider_rejected`         | Other confirmed rejection with evidence of no acceptance                                                      |
| 502  | `unknown`      | `delivery_uncertain`        | Transport failure or ambiguous provider failure; acceptance cannot be ruled out                               |
| 502  | `unknown`      | `provider_response_invalid` | Malformed/truncated/oversized response or missing/invalid acceptance evidence                                 |
| 502  | `unknown`      | `idempotency_conflict`      | Same key/different payload; earlier acceptance cannot be ruled out                                            |
| 502  | `unknown`      | `submission_in_progress`    | Provider says same key already in progress                                                                    |
| 504  | `unknown`      | `provider_timeout`          | Eight-second provider deadline exceeded, including body reading                                               |

`fieldErrors` has only `name`, `email`, `message`; one deterministic code per invalid field. Name: `too_long` or `invalid_characters`. Email: `required`, `too_long`, `invalid_email`, `invalid_characters`. Message: `required`, `too_long`, `invalid_characters`. Precedence: invalid characters → required → too long → email grammar. Unknown identifier/trap errors are form-level rejections, not errors on invisible fields.

Application `429` includes `retryAfterSeconds` as a whole number 1–600 where known, otherwise `null`; include matching `Retry-After` when known. The browser **recognizes any HTTP 429 before parsing**, including HTML/empty platform responses; absent/malformed retry information uses the conservative ten-minute wording. Provider `429` quota/throttle errors map to `503`, not the visitor's abuse limit.

Only a valid `202` envelope with matching normalized `submissionId` can display acceptance. Mismatched/malformed `202`, other unexplained responses, redirects/protection HTML, browser transport failure, cancellation after starting submission or the 15-second browser deadline produce local `unknown` state. Never infer failure-to-send from a lost response. Explicit Resend error names are mapped only after bounded, safe parsing; ambiguous `5xx` falls back to uncertain, not confirmed failure.

### Provider payload, deadlines and retries

Later server infrastructure uses native `fetch` to `https://api.resend.com/emails`; no SDK with implicit retries. The fixed payload fields are `from` (verified configured sender), `to` (one configured recipient), `subject: "FunkSpace contact message"`, structured `reply_to` (validated email string), and `text`. Never construct raw mail headers from visitor text. Disable open/click tracking in the actual sender-domain settings; plain-text mail alone is not proof of account settings. No HTML, template, attachments, tags, scheduling, CC/BCC or automatic reply.

Deterministic `text` is `Name: <normalized name or (not provided)>\nEmail: <normalized email>\n\nMessage:\n<normalized message>` with no appended timestamp or diagnostic identifier. `Idempotency-Key` is exactly `contact/<lowercase submissionId>`. Payload/configuration must remain stable through the retry window: pin sender/recipient/content format per candidate; a configuration/format change retires outstanding retries and requires a documented migration before live rollout. In-memory browser keys alone cannot protect against arbitrary callers or server payload changes; exactly-once delivery is not promised.

Provider deadline: **8 seconds** from call start through full response reading and parsing; use cancellation and dispose timer/read resources on every path. Bound provider response to 32 KiB as well. Browser deadline: **15 seconds** through full API response reading/validation; release timers/listeners/read resources on settlement and unmount. Cancellation cannot recall a provider-accepted email.

No automatic retry at browser, application or provider boundary. First explicit attempt captures a UUID, normalized payload snapshot and first-attempt time in page memory. Unchanged manual retry preserves all three; editing any visible field retires the old attempt and creates a new submission even if later edited back. While submitting, fields stay read-only and a synchronous guard prevents click/Enter duplication; this internal state does not require pending controls or announcements. At elapsed time **greater than or equal to 23 hours**, disable same-key retry, keep text and offer email fallback; do not silently rotate an unchanged uncertain submission's key. Resend's key retention is 24 hours. Reload/navigation loses draft/key; no localStorage, sessionStorage, URL, cookie or server draft persistence.

## Architecture and proposed paths

Preserve `Presentation → Application → Domain ← Infrastructure`. This request approves documenting the bounded server composition decision; runtime implementation and counterpart review remain later gates. No new package/runtime/deployment or shared messaging framework.

| Layer                              | Responsibility / location                                                                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domain                             | Existing new `frontend/domain/contact/ContactContract.ts`; FS-5.2 pure validation and narrow delivery/submission ports                             |
| Application                        | Proposed contact use case depending on Domain ports only                                                                                           |
| Server infrastructure              | Proposed `frontend/infrastructure/contact/` Resend adapter, configuration and HTTP request boundary                                                |
| Server composition                 | Proposed `frontend/infrastructure/services/createContactServerServices.ts`, guarded by `server-only`; only Route Handler/server page may import it |
| Browser infrastructure/composition | Proposed same-origin submission adapter through existing `createServices` and `ServiceProvider` fixture convention; no server imports/credentials  |
| Presentation                       | Proposed `frontend/app/contact/page.tsx` and bounded client form; server page exposes only safe availability, never configuration values           |
| HTTP entry point                   | Proposed `frontend/app/api/contact/route.ts`; thin request/response entry through server composition; Node runtime in existing deployment          |
| Navigation                         | FS-5.4 adds shared destination, enables header/tree and preserves current-page disabling/focus handoff                                             |

FS-5.2 implements the Domain validator/result/delivery port, application use
case, `infrastructure/contact/` boundaries/adapter, server composition and
Node Route Handler above. The original server placement proposals are now
implemented at those paths; UI/browser work stays proposed. See [server setup](../development/contact-server.md)
for actual modules, the closed release lock and controlled tests. The wire
contract is unchanged, and no browser service/form exists.

## Configuration, privacy and operating prerequisites

Document variable names **without values**:

| Name                      | Server-only purpose                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `CONTACT_ENABLED`         | Default off; only exact `true` enables after all external gates are satisfied                             |
| `RESEND_API_KEY`          | Secret from approved secure mechanism, preferably sending/domain scoped                                   |
| `CONTACT_FROM`            | One verified fixed sender identity; validate configuration, not visitor input                             |
| `CONTACT_TO`              | One fixed approved recipient; no comma lists or runtime request override                                  |
| `CONTACT_ALLOWED_ORIGINS` | JSON array of exact canonical origins, scheme/host/port only; no paths, wildcard or Host-derived defaults |

HTTPS origins for deployed environments; explicitly approved HTTP loopback only for isolated local mocks. Empty/invalid allowlist or any missing/invalid configuration keeps delivery off. Credentials never use `NEXT_PUBLIC_`. Secrets are not recorded in source, artifacts, test fixtures, chat or logs. No environment file or variable value is created by FS-5.1. Later disabled/unconfigured mode renders email-only content and returns unavailable after boundary rejection checks, never simulated acceptance. Recheck configuration per intended Preview/Production scope; don't cache a successful availability check across changed deployments.

Data flow: page-memory draft → Vercel request/function → Resend message/log storage → Gmail correspondence. App adds no message database. Diagnostic allowlist: bounded correlation ID, outcome/code, duration, safe HTTP/provider status and internal acceptance ID. No human field values, body, IP in app logs, credentials or raw provider error. Platform/firewall logs may separately retain network identifiers; Dimi reviews actual retention/access with provider and hosting terms.

Six-month deletion applies to closed ordinary mailbox conversations, not Resend logs or platform backups. Dimi defines conversation end and a routine cleanup schedule; justified retention exceptions require purpose/reason, restricted access and a review/deletion date. No application inbox or deletion automation is implied.

### Official documentation facts verified 2026-10-13

These are public-document facts, not proof of this project's settings or legal suitability:

| Source                                                                                                                                                  | Verified fact / implication                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Resend send API](https://resend.com/docs/api-reference/emails/send-email)                                                                              | HTTPS email endpoint supports fixed mail fields/plain text; success returns an email ID. Acceptance does not prove Gmail receipt.                                                                                                                       |
| [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys)                                                                         | Keys retained 24 hours; same key/different payload and concurrent requests have distinct `409` errors.                                                                                                                                                  |
| [Resend errors](https://resend.com/docs/api-reference/errors)                                                                                           | Daily/monthly quota and request-rate errors are `429`; explicit service unavailable is documented. Classify by safe error code, not HTTP status alone.                                                                                                  |
| [Resend pricing](https://resend.com/pricing)                                                                                                            | Free lists 3,000 emails/month and 100/day. No project quota, paid upgrade or overage approval inferred.                                                                                                                                                 |
| [Resend security](https://resend.com/security)                                                                                                          | Stored data is US-based; choosing EU sending region does not move storage to EEA. Email/log retention is 30 days on Free/Pro/Scale; remaining customer data deleted within 90 days after termination.                                                   |
| [Resend DPA](https://resend.com/legal/dpa), [subprocessors](https://resend.com/legal/subprocessors), [terms](https://resend.com/legal/terms-of-service) | Published DPA includes transfer clauses and processing obligations; actual applicable account terms, signed document and current subprocessors require Dimi review. No legal completeness claimed.                                                      |
| [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction), [DMARC guidance](https://resend.com/docs/dashboard/domains/dmarc) | Owned domain/subdomain must be verified; Resend documents SPF/DKIM and DMARC guidance. Exact record names/values come from the actual selected domain/region setup.                                                                                     |
| [Vercel WAF rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)                                                            | All plans support fixed windows and IP counting. Hobby: one rate-limit rule/project, up to ten-minute window, one million included allowed requests; Pro documents 40 rules and usage pricing. Counters are regional; default limiting action is `429`. |
| [Vercel deployment protection](https://vercel.com/docs/deployment-protection)                                                                           | Standard Protection is available on all plans and excludes production domains. Protection scope/method and actual reviewer access must be checked per URL; same-origin browser requests retain protection cookies.                                      |

Provider policy marketing is not a legal assessment. Dimi reviews purpose/legal basis, operator identity/address, rights/contact, recipients/transfers, hosting/mailbox terms, DPA and retention with appropriate advice where needed before live enabling. FS-5.5 updates both legal pages, metadata and tests, including `theme` and `funkspace.motion.preference.v1`, their actual write/expiry behavior and no contact draft persistence. Do not turn today's truthful no-form statement into a claim about an implemented form before it exists.

### Account settings and external actions: unverified and pending

| Prerequisite                                                                            | Owner / latest gate                                                                                                                                             |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actual Vercel plan/use eligibility, billing and spare WAF slot                          | Dimi supplies account evidence; Codex verifies at FS-5.3 before enabling                                                                                        |
| Exact protected preview URL/revision, protection method/scope, reviewer access, aliases | Dimi authorizes deployment/access changes separately; Codex verifies before live acceptance                                                                     |
| Resend account restrictions/quota/overages, signed DPA, terms and subprocessors         | Dimi reviews actual account; required before sender setup/live enabling                                                                                         |
| Sender domain `mail.funkspace.de`, selected region, verification status, tracking off   | Dimi approves setup; Codex verifies provider evidence before live enabling                                                                                      |
| Exact SPF/DKIM/return-path records and DMARC interaction                                | Obtain actual records, inventory existing website/mailbox DNS, prepare a reviewable change, then obtain action-specific approval; no record values guessed here |
| Fixed recipient/Reply-To behavior, scoped secrets and exact origin allowlist            | Dimi securely configures approved scope; Codex verifies without exposing values                                                                                 |
| Complete legal/operator content and six-month mailbox policy operation                  | Dimi supplies/approves; Sites publishes at FS-5.5 before enabling                                                                                               |
| Provider acceptance and Gmail receipt of exact controlled message                       | Separate live-send authorization at FS-5.6; Dimi verifies receipt                                                                                               |

Proposed platform rule only: method POST AND exact path `/api/contact`, five requests per IP per ten-minute fixed window, default `429`. FS-5.3 verifies availability, remaining rule slots, actual settings and every reachable production/deployment/branch/preview/custom-domain alias. Delivery remains disabled where protection is missing. Exercise limits with sending disabled and confirm bypass/exemption interactions. Regional counters, window boundaries and distributed IPs can exceed an apparent global cap; shared IPs can block legitimate visitors. No Redis or process-local production limiter for this version, no claim of a global send cap. If actual platform availability/coverage fails, keep delivery off and return for a scoped protection decision. No paid upgrade or firewall change is preauthorized.

## Six-task delivery sequence and acceptance gates

### FS-5.1 — Preserve the plan and freeze the contact UI/server contract

**Lead:** Codex. **Counterpart:** Sites provides form-state requirements and reviews consumption. **Dimi:** accepted the consuming contract and closed FS-5.1 on 2026-10-13; actual provider/account terms and external setup remain separately owned prerequisites before live enabling.

**Depends on:** FS-0.5, FS-1.5, FS-2.4 (existing foundation dependencies retained).

**Work:** Save/link this reconciled plan, freeze request/result/limits/deadlines/retries, record composition and secure configuration names, verify official documentation, and assign external prerequisites. Actual account inspection, exact DNS records and signed-term review remain pending external gates; historical planning bullets are not instructions to perform them now.

**Complete when:** The approved contract supports UI work with controlled responses while real-provider configuration proceeds. Missing credentials are a visible delivery blocker, never simulated success. **Gate satisfied:** read-only consumer review recorded; its one pending-announcement finding resolved by Dimi's no-pending-controls/no-InlineStatus amendment; Dimi accepted the contract and explicitly closed FS-5.1. No fresh independent security, visual or device acceptance is inferred.

### FS-5.2 — Implement validation, contact use case, and mail adapter

**Current status:** Implemented locally and self-reviewed with controlled checks.
[FS-5.2 evidence/handoff](../tasks/fs-5.2-contact-server.md) owns the candidate,
results and separately authorized documentation/Git delivery record; the
containing commit identifies the delivered revision. Consumer/independent critical-diff review and Dimi
acceptance remain pending. The server release lock stays closed regardless
of environment values; no live mail or external setup performed.

**Lead:** Codex. **Counterpart:** Sites checks consuming types/presentation. **Dimi:** confirms/configures the settled sender, recipient, requirements and approved secrets.

**Depends on:** FS-5.1 reviewed/accepted contract; separate task authorization.

**Work:** Pure shared validation, injected use case/delivery port, bounded streaming HTTP boundary, server-only Resend adapter and thin Route Handler. Protect fixed headers/destinations; map acceptance, rejection, quota, malformed evidence, transport ambiguity, idempotency conflict/concurrency and timeouts. Test with fake ports/fetch; test composition never silently enables production sending.

**Complete when:** Valid requests reach the fake/approved adapter, invalid requests cannot send, headers cannot be injected, all declared outcomes are tested, and `202` means verified provider acceptance. Live configuration is not required for controlled tests and is never implied by them.

### FS-5.3 — Add abuse controls and privacy-conscious operations

**Lead:** Codex. **Counterpart:** Sites verifies rate-limit/error recovery. **Dimi:** approves actual platform/provider changes and retention/processing implications.

**Depends on:** FS-5.2.

**Work:** Implement exact-origin/media/spam protections if not already delivered in FS-5.2; verify proposed WAF rule and coverage on the selected deployment before enabling. Minimize diagnostics, review platform logs, keep overages off, document quota and emergency disabling. No per-process counter as sole production limiter, CAPTCHA or extra infrastructure without evidence and scoped decision.

**Complete when:** Abusive/oversized requests reject predictably, deployed limits and alias coverage are verified, logging reviewed and residual regional/distributed abuse limits recorded. Local-only preparation cannot certify deployed protection.

### FS-5.4 — Implement the live contact-form interface

**Lead:** Sites. **Counterpart:** Codex reviews contract parity, architecture and test isolation. **Dimi:** approves wording and keyboard/phone behavior.

**Depends on:** FS-5.1, FS-1.5, FS-2.4; real wiring follows FS-5.2/FS-5.3 validation.

**Work:** Plain `/contact` using existing shell/tokens/components. Shared route destination enables header/tree without `/#contact`, preserving current-page disabling and focus handoff. Visible labels, required indicators, `autocomplete="name"`/`"email"`, email keyboard and help/error associations. Ordinary Button without `pending`; no `InlineStatus` or pending announcement. Focus first invalid field for validation and ordinary result text for other outcomes. Keep a synchronous duplicate-submit guard, read-only fields while submitting, failure input preservation and in-memory retry rules. Accepted read-only snapshot until **Send another message**. Readable server-rendered fallback without JavaScript; no usable-looking submit before hydration or when sending unavailable. Link concise Privacy notice; final copy follows FS-5.5.

| State                 | Initial English wording                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| Idle                  | “Have a question, an idea, or some feedback? Send me a message.”                                                |
| Invalid               | Field-specific required/length/format text; focus first invalid visible field                                   |
| Submitting internally | No dedicated pending copy, spinner or live-status presentation; guard duplicate submission and preserve input   |
| Accepted              | “Your message was accepted for delivery. Thank you.”                                                            |
| Rate limited          | “Too many attempts. Please wait up to 10 minutes, or contact me by email.”                                      |
| Unavailable           | “The form is currently unavailable. You can contact me by email.”                                               |
| Confirmed rejection   | “Your message could not be sent. Your text is still here.”                                                      |
| Uncertain             | “We couldn’t confirm delivery. Your message may have been sent. Retry the same message or contact me by email.” |
| Expired retry         | “The retry window has ended. Your text is still here. Please contact me by email.”                              |

Uncertain copy offers retry only before expiry and with unchanged payload; conflict/configuration-change recovery must not promise safe same-key retry. Editing creates a new submission and may duplicate an earlier uncertain message; communicate that when relevant.

**Complete when:** Controlled component tests cover every state, input/retry/duplicate behavior and narrow/short viewport recovery. Production never reports acceptance from a timer/mock. Dimi confirms wording and phone/keyboard experience.

### FS-5.5 — Finalize legal content and the contact operating guide

**Lead:** Dimi. **Counterparts:** Codex supplies technical facts; Sites publishes approved copy.

**Depends on:** FS-5.1, FS-5.3, FS-2.4.

**Work:** Actual operator/processing facts and approved legal basis, rights/contact, recipient/transfers and retention. Replace draft placeholders/no-form statement at the appropriate implementation point. Document both existing storage keys, no draft storage and actual browser → Vercel → Resend → Gmail flow. Operating guide covers variable names without values, sender verification, scoped configuration, key rotation, stable retry payload rollout, quota diagnosis, safe logs, disabling and rollback. Review actual account/mailbox/hosting terms before live enabling.

**Complete when:** Published information matches actual configuration, has no placeholders, and the operator can diagnose/disable safely. Public-document checks are not legal certification or Dimi approval.

### FS-5.6 — Verify end-to-end delivery and failure recovery

**Lead:** Codex. **Counterpart:** Sites fixes UI findings. **Dimi:** specifically authorizes live sending and verifies recipient receipt.

**Depends on:** FS-5.2, FS-5.3, FS-5.4, FS-5.5.

**Work:** Finish mocked integration/browser checks and independent security/architecture review. Obtain authorization naming the protected preview and controlled message, send one identifiable inquiry, record provider acceptance separately from Gmail receipt, verify sender/Reply-To without an unsolicited reply. Exercise deployed limits with delivery disabled and failures through controlled responses. Verify disable/recovery and pin accepted revision/configuration scope.

**Complete when:** Dimi confirms actual intended-mailbox receipt; failures preserve text/recovery; routine tests make no live provider calls. Unavailable service access blocks real-delivery acceptance.

**Sequence:** FS-5.1 → FS-5.2 → FS-5.3. Sites may build FS-5.4 against controlled responses after reviewed FS-5.1; legal inputs can be gathered early. FS-5.6 follows all four implementation/legal prerequisites. One current writer per shared file; sequential by default. No task starts merely because it appears in this plan.

**Epic exit:** FS-G2 requires completed EPIC 5 real provider acceptance and recipient verification alongside the already completed EPIC 4 evidence. FS-G3, publication and game integration remain separate.

## Testing strategy and evidence boundaries

FS-5.1: document link/content/format/diff checks, strict type compilation and ESLint of the pure contract. No application build, Storybook, browser suite or live call is needed because no runtime behavior changes.

| Later layer              | Required evidence                                                                                                                                                                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domain                   | Empty/whitespace, exact length boundaries/Unicode units, raw header injection, controls/surrogates, email grammar, UUID/trap, client/server parity                                                                                                             |
| HTTP                     | Chunked 32 KiB boundary, forged/missing length, malformed UTF-8/JSON/BOM/shape, types/keys, origin, method/content type/encoding                                                                                                                               |
| Delivery                 | Valid acceptance UUID, quota/throttle/rejection, 8 s deadline including reading, bounded malformed response, ambiguous transport, key conflict/concurrency and deterministic payload                                                                           |
| Form                     | All states, HTTP-status/envelope parity, malformed/mismatched `202`, non-JSON `429`, 15 s deadline, duplicate click/Enter, unchanged/edit/23 h retry, accepted reset and no storage                                                                            |
| Accessibility/navigation | Labels/error associations, invalid-field/result focus, no duplicate or dedicated pending announcements, keyboard, no-JS/prehydration/disabled fallback, themes/forced colors, 200% text, narrow/short screens, direct load/refresh/Back and shared route links |
| Privacy/operations       | No browser Resend calls/secrets/content logs, accurate legal/storage copy, missing configuration/delivery off, actual preview protection/WAF coverage, disable/recovery                                                                                        |

Run Domain/Application/Infrastructure tests explicitly: current coverage configuration excludes those layers. Server tests use Node and injected fakes. Browser tests start a fresh controlled server with delivery disabled and no usable provider credential; don't reuse an arbitrary server. Browser route interception alone does not prevent server-side provider calls. Run affected types/lint/unit checks first; broaden to builds/Storybook/E2E when later runtime/routing changes justify them. Do not weaken thresholds or reopen EPIC 4. Record simulated-browser evidence separately from Dimi's actual phone/desktop acceptance.

## Implementation handoff

Start the next session with the current [FS-5.2 evidence/handoff](../tasks/fs-5.2-contact-server.md#handoff), its completed [FS-5.1 predecessor](../tasks/fs-5.1-contact-contract.md#handoff) and a fresh branch/HEAD/status check. Confirm the receiving chat can actually read the repository and every intentional change; chats do not automatically share working files. The FS-5.1 read-only consumer review accessed the actual local candidate; a future separate Sites workspace must verify the delivered branch/revision or matching final patch independently. If inaccessible, provide/apply the reviewable artifact before proceeding. Do not reset newer work or transfer secret values. FS-5.1 is accepted and complete; FS-5.2 review and Dimi acceptance remain pending. Request only a separately scoped review/next task. External prerequisites and FS-G2 remain open.
