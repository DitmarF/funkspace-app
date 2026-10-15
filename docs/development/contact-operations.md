# Contact abuse protection and operations — FS-5.3 / FS-5.5

The [frozen contract](../features/FunkSpace_EPIC_5_Detailed_Plan.md#frozen-uiserver-contract),
[server setup](contact-server.md), [processing/storage facts and legal-copy checklist](contact-processing-facts.md),
[FS-5.3 evidence](../tasks/fs-5.3-contact-protection.md) and
[FS-5.5 technical preparation](../tasks/fs-5.5-contact-operations.md) govern this guide.
Code and official public documentation were re-audited 2026-10-14 at
`9ba16f8d0ba7dcc5b24ff57383dc8631701b7185`. The technical subtask is prepared;
FS-5.5 legal/publication acceptance remains pending.
The [Workspace/DMARC follow-up](#workspace-aliases-and-prepared-dmarc--2026-10-15)
records later mailbox tests and public DNS checks on 2026-10-15; these are not
Resend, deployed-form or protection acceptance.
External protection is **unverified; live delivery is blocked**. This guide is
not permission to configure a firewall, change billing/secrets, deploy or send mail.

## Local security assumptions

The request boundary already enforces POST, exact configured Origin, JSON/UTF-8
and identity encoding, streamed 32 KiB bounds and pure validation, in that order.
Missing Origin and any invalid origin configuration fail closed. No Host,
forwarded header, Referer or wildcard preview name supplies trust. Direct clients
can forge an allowed Origin; this prevents unwanted browser cross-origin requests,
not determined bots. CORS is not permissive and preflight cannot deliver.

The `website` field must be exactly empty. Whitespace is spam, not normalized
away; reject with `400/spam_rejected`, never a fake `202`. Invalid/rejected input
cannot reach the delivery port. The trap can be evaded by informed callers. Its
FS-5.4 UI is implemented: no visible extra field, no keyboard or
assistive-technology exposure, autocomplete off and no required constraint.
These properties are in the actual form. Dimi reported successful phone/
accessibility testing of controlled responses; that is not deployed WAF/provider acceptance.

The false `CONTACT_DELIVERY_RELEASED` source constant remains an unconditional
production lock. Enabling `CONTACT_ENABLED` cannot unlock this candidate. Approved-origin valid input
returns `503/configuration_unavailable`; absent/unapproved origins reject first.
No process-local limiter, Redis, CAPTCHA, new dependency or application inbox
exists. Origin/trap checks do not constitute a global quota limit. Slow uploads,
platform request/duration limits and attack-related log costs require deployment
review; the provider exchange alone has the eight-second deadline.

## Application diagnostics and separate platform review

Each application-controlled response records one `contact_outcome` event with
only `httpStatus`, `outcome` and `code` (null on accepted). Runtime validation
allowlists these categorical values and copies no additional metadata. Unknown
or mismatched categories are dropped. Diagnostic writer failures leave the
established response unchanged and cause no resend. The server composition
writes a single JSON line; fakes capture events in tests. No other contact-layer
application logger is introduced.

Names, email addresses, message/body/trap data, credentials, raw provider errors,
request/response objects, Origin/Host/URL/headers, IPs, visitor submission IDs,
provider acceptance IDs and field-error details are excluded. Correlation,
duration and provider-status logging permitted by the planning allowlist is
unnecessary here and omitted. Logs cannot establish mailbox receipt or deduplicate
mail. Flooded categorical logs can still consume resources; edge rejection and
actual logging configuration need review. Edge-blocked requests need not produce
an application event; the browser's transport failures cannot prove a server outcome.

Vercel's [runtime log reference](https://vercel.com/docs/logs/runtime) documents
path/query parameters, request/deployment/session/trace/invocation identifiers,
User Agent and IP/User-Agent matching. Its listed runtime
retention is one hour on Hobby, one day on Pro, three days on Enterprise, and
30 days with Observability Plus. These are public facts, not this account's
configuration. [Firewall observability](https://vercel.com/docs/vercel-firewall/firewall-observability)
includes IP, user agent, path, ASN, JA4, country and request/time events; its
24-hour view selector is not a retention guarantee. [Log Drains](https://vercel.com/docs/drains/reference/logs)
can export function/static/firewall and other sources with proxy/request metadata.
Dimi must inspect runtime/firewall access, retention,
request detail fields, drains/exports, tracing/APM and third-party sinks, and
record the applicable terms and identifiers they retain. Do not claim the entire
infrastructure stores no identifiers. Message content may also reside in Resend
and Gmail; six-month closed-mailbox deletion is not platform-log retention.

Actual function region, drains, access roles, export sinks and retention
configuration remain unaudited. The later Workspace evidence includes a supplied
domain/project-attachment screenshot and Dimi's reported Hobby plan; neither is
a WAF/logging account audit. `.vercelignore` is upload exclusion,
not installed WAF or logging evidence. Record sanitized account findings separately
from these public defaults and from the application's narrow writer.

## Workspace aliases and prepared DMARC — 2026-10-15

Dimi performed the Google Admin/Gmail setup and manual sends. Evidence consists
of supplied screenshots, message authentication results, Dimi's receipt reports
and Codex's read-only public DNS checks. Codex did not log into the accounts or
send the messages. Google Admin showed `funkspace.de` as the verified primary
domain; Business Starter and sole inquiry access remain Dimi-supplied facts.

| Item                              | Verified outcome and evidence                                                                                                                                                                                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `info@funkspace.de`               | Existing Workspace user's alias shown saved; Gmail lists the FunkSpace sending identity. Dimi saved the same-address reply setting and explicit Reply-To, then confirmed the complete receiving/reply loop                                                             |
| Manual inquiry loop               | Personal test Gmail → `info@funkspace.de` received in Workspace; Workspace reply from `info@funkspace.de` received in personal Gmail; final reply addressed to `info@funkspace.de` received in Workspace                                                               |
| `dmarc@funkspace.de`              | Dimi confirmed the additional alias was saved and its incoming test reached the same Workspace inbox; it is not a separate licensed mailbox                                                                                                                            |
| Workspace outbound authentication | Received reply screenshot and supplied FunkSpace `Authentication-Results` show SPF PASS and DKIM PASS for `funkspace.de`, selector `google`. The SMTP envelope identifies the underlying Workspace account; an alias does not guarantee hiding that address in headers |

These aliases route to the existing user's inbox; the report alias does not need
a Gmail sending identity to receive reports.
[Google alias behavior](https://knowledge.workspace.google.com/admin/users/add-or-delete-an-alternate-email-address-email-alias).

Public DNS checks on 2026-10-15 found Vercel nameservers, Google MX
`1 smtp.google.com.`, one root SPF record
`v=spf1 include:_spf.google.com ~all` and a published
`google._domainkey.funkspace.de` DKIM TXT record. No public key, message body,
message ID, complete header or sender IP is copied into this guide.

**DMARC remains unpublished and no DMARC PASS is recorded.** Both authoritative
Vercel nameservers returned no TXT at `_dmarc.funkspace.de` (successful DNS
queries with negative answers). Gmail's received-message summary showed DMARC
FAIL; the supplied FunkSpace authentication block contains no `dmarc=` result,
so its exact UI failure reason is unresolved. The earlier `dmarc=pass` for
`header.from=gmail.com` belongs to the personal test sender, not FunkSpace.

### Prepared Vercel record — do not publish

The 2026-10-15 12:41 screenshot shows these values in the unsubmitted entry form:

| Field             | Prepared value                                    |
| ----------------- | ------------------------------------------------- |
| Domain / DNS zone | `funkspace.de`                                    |
| Name              | `_dmarc` (produces `_dmarc.funkspace.de`)         |
| Type              | `TXT`                                             |
| Value             | `v=DMARC1; p=none; rua=mailto:dmarc@funkspace.de` |
| TTL               | `60` seconds                                      |
| Priority          | Blank                                             |
| Comment           | `DMARC monitoring`                                |

Vercel's **Add** creates the published record; leave it unclicked. An unsubmitted
browser form is not a saved DNS draft or scheduled change. These documented
values preserve the preparation if that form is closed or reloaded.
[Vercel DNS fields and Add action](https://vercel.com/docs/domains/managing-dns-records).

Google recommends SPF/DKIM authenticating for at least 48 hours before DMARC.
Based on the 2026-10-15 setup and successful test around noon Europe/Berlin,
publication is deferred until 2026-10-17 around noon or later, after confirming
the full interval and obtaining specific publication authorization. No automatic
publication or reminder is configured. Start with `p=none`: it requests no
DMARC-based quarantine/rejection and asks participating receivers for aggregate
reports; it does not enforce spoof blocking or guarantee inbox delivery.
Reports need review; no report parser or automatic policy escalation exists.
[Google setup](https://knowledge.workspace.google.com/admin/security/set-up-dmarc),
[initial rollout](https://knowledge.workspace.google.com/admin/security/recommended-dmarc-rollout).

Before any later authorized publication, recheck that no DMARC record has been
added meanwhile; do not create a second one. After publication/propagation,
verify DNS and a new Workspace outbound message's DMARC result separately. Review
reports before considering an expressly authorized enforcement change. Future
Resend sending at `mail.funkspace.de` still needs its own verification/alignment;
Workspace authentication does not verify that sender or authorize a live form.

The current application recipient/fallback remains the testing Gmail choice.
Moving it to the verified Workspace alias requires a separately scoped recipient,
public/legal-copy and retry-payload migration. Account agreements, mailbox
retention/forwarding/exports, Resend setup, WAF/preview coverage and legal approval
remain pending. The source release lock stays false, `CONTACT_ENABLED` stays off,
and these mailbox tests do not start FS-5.6.

## Secure configuration and sender verification

Names only; no environment values, credential examples or secret-bearing commands:

| Server-only environment name | Responsibility                                                                                                              |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `CONTACT_ENABLED`            | Keep off until release/legal/protection/preview gates pass; source lock independently blocks delivery                       |
| `RESEND_API_KEY`             | Secure provider credential, with sending-only access restricted to the selected verified domain where available             |
| `CONTACT_FROM`               | Fixed approved FunkSpace sender identity, never visitor-controlled                                                          |
| `CONTACT_TO`                 | One fixed approved recipient, checked against the selected Gmail destination                                                |
| `CONTACT_ALLOWED_ORIGINS`    | Nonempty canonical exact-origin JSON array; no wildcard, Host inference, paths/query/userinfo or unreviewed preview aliases |

Keep configured values in authorized server environment scopes, never under a NEXT_PUBLIC
name or in client composition, prompts, repo files, test fixtures, screenshots or
raw log exports. The reader checks syntax, not account permission, domain ownership,
tracking, mailbox existence or legal approval. The current source lock prevents
reading the mail credential/identities while disabled.

For a future authorized protected preview, bind configuration to its exact
project, environment, branch/deployment revision and origins. Keep Development,
ordinary previews and routine tests without a usable mail credential; do not infer
that broad Preview settings are safely isolated. Production gets separately
approved configuration only after its own gates. Branch-specific Preview settings
override general Preview settings; inventory shared/inherited values and all aliases.
Environment edits apply to new deployments, not already-issued deployment URLs.
[Vercel environment scopes](https://vercel.com/docs/environment-variables).

Vercel currently distinguishes readable Config variables from write-only-after-save
Secret variables (including Development). Use Secret for the provider credential
and least-privilege access for configuration. Documented build-log redaction for
Secret values of at least 32 characters is not comprehensive runtime/drain
redaction; never rely on it instead of avoiding secret output.
[Config and Secret variables](https://vercel.com/docs/environment-variables/sensitive-environment-variables).

Before any separately authorized DNS/provider action, inventory existing mail/DNS
and obtain the selected subdomain/region's exact records from Resend. Owned
`funkspace.de` does not verify proposed `mail.funkspace.de`. Verify that subdomain's
SPF/DKIM state and DMARC interaction without disrupting existing mail; capture
sanitized verification/region evidence, not guessed record values. Confirm sender,
recipient, account restrictions/quota and sending-only/domain-restricted key access.
No sender verification has been performed here.
[Domain verification](https://resend.com/docs/dashboard/domains/introduction),
[DMARC](https://resend.com/docs/dashboard/domains/dmarc),
[API key permissions](https://resend.com/docs/api-reference/api-keys/create-api-key).

The adapter sends only deterministic plain text with the fixed subject and
structured validated Reply-To; it requests no tracking or automatic reply.
Resend documents open/click tracking off by default, but verify both actual domain
settings off before enabling. Public defaults are not account evidence.
[Tracking](https://resend.com/docs/dashboard/domains/tracking).

## Exact proposed WAF rule — not applied

Prepare this rule in the intended project's Firewall configuration for later
action-specific approval. No configuration file in this repository installs it.

| Setting                       | Required value                                             |
| ----------------------------- | ---------------------------------------------------------- |
| Name                          | `FunkSpace contact POST limit`                             |
| Condition 1                   | Method **Equals** `POST`                                   |
| Combination                   | **AND**; both conditions required                          |
| Condition 2                   | Request Path **Equals** `/api/contact`                     |
| Action                        | Rate Limit                                                 |
| Algorithm                     | Fixed Window                                               |
| Time window                   | **600 seconds**                                            |
| Request limit                 | **5**                                                      |
| Counting key                  | Platform **IP only**; not IP+User-Agent/JA4/visitor header |
| Exceeded action               | **Default (429)**; not Log, Deny or Challenge              |
| Host/environment restrictions | None; intended to cover every reachable alias/environment  |

Current [rate-limit documentation](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)
supports fixed windows/IP on all plans. Hobby has one rate-limit slot and a
ten-minute maximum; actual slot availability, plan eligibility, usage and cost
must be checked. Counters are regional. A fixed window can admit traffic near
both sides of its boundary; five per rolling ten minutes or a worldwide cap is
not promised. Shared networks/VPNs can exhaust a bucket for legitimate visitors;
offer the public email fallback. Many IPs/regions can exhaust provider quota.
No paid upgrade is selected.

The [configuration reference](https://vercel.com/docs/vercel-firewall/vercel-waf/rule-configuration)
distinguishes Request Path from Raw Path and framework Route. Verify that path
normalization, rewrites, trailing slash and encoded-path alternatives cannot reach
the handler outside the rule. Query strings must not create another bucket.
Review rule order and any custom bypass. [System bypass rules](https://vercel.com/docs/vercel-firewall/vercel-waf/system-bypass-rules)
concern system mitigations; custom-rule bypass is separate. Never assume that
reviewer access, protection automation bypass or an allow rule preserves limiting.

The rule reference supports Preview/Production environment conditions; dashboard
publication instructions separately describe production. Neither proves the
intended preview or every alias is enforced. If actual preview support or any
reachable route's coverage fails, retain delivery off and seek a scoped
protection decision; no process counter or unapproved service substitutes for it.

## External prerequisites and coverage register

No current account inspection, selected preview URL, deployment inventory or
firewall export is available in the repository handoff. **Every row is pending**;
even an owned domain is not proof of its current attachment or protection.

| Target                                                           | Required evidence before enabling                                                           | Current outcome                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------- |
| Intended protected preview                                       | Exact URL, commit/build, project/team, authentication method, reviewer access, enforced WAF | Blocked: URL/configuration not verified |
| Generated deployment URL                                         | Same revision; WAF plus preview protection; authorized same-origin API test                 | Unverified                              |
| Branch/preview/custom aliases                                    | Complete actual list, project/deployment mapping, enabled environments and WAF              | Unverified                              |
| Production domain(s), including owned `funkspace.de` if attached | Current attachment/revision; WAF; deliberate release permission                             | Unverified; no release permission       |
| Default project domain/production deployment URL                 | Reachability, current/historical revision, rule/protection scope                            | Unverified                              |
| Older deployments/aliases with an enabled contact handler        | Inventory; disable/restrict each reachable enabled version                                  | Unverified                              |

Dimi/authorized operator records actual plan, spare slot, account use eligibility,
cost/overage policy, published rule identity/revision/order and exemptions without
secrets. [Deployment Protection](https://vercel.com/docs/deployment-protection)
is distinct from WAF; Standard excludes production domains. Current public docs
list All Deployments protection on all plans, with Vercel Authentication requiring
no paid add-on; that is not this project's selected setting. Verify protection on
the specific preview and reviewer browser requests; use relative same-origin API
requests with normal authentication cookies. Keep bypass tokens out of prompts,
artifacts, fixtures and URLs. Terms/DPA/legal/sender/tracking/scoped credential
verification from FS-5.1/5.5 remains mandatory. Do not test a deployed endpoint
until its exact target and credential-free, delivery-off state are authorized.

### Deployment-only check procedure — no PASS recorded

After separately authorized configuration and deployment of a delivery-off
candidate, enumerate all rows and verify every reachable URL. Record sanitized
rule/coverage evidence with commit, deployment, date, region and authentication
mode. No message/name/email is needed in the test body: `{}` with approved Origin
and JSON media is invalid locally and cannot send. Keep no usable provider key
on the test deployment as well as the release lock.

Within one observed fresh fixed window and one IP/region, make five matching
requests; they should reach the application and reject invalid shape. The sixth
must receive HTTP 429 before invocation. Verify rule attribution/function traffic,
not just an arbitrary 429. If a window boundary intervenes, repeat the controlled
check rather than claiming five-per-window evidence. Verify recovery after reset,
other methods/paths unaffected by this rule, and query/path variants, aliases,
reviewer cookies/bypass interactions and regional counts. Stop on missing coverage;
do not loosen the rule or enable sending. A platform 429 can be HTML/empty without
the app envelope or Retry-After; FS-5.4 already recognizes status before JSON parsing
and preserves draft/key. Report deployment evidence separately from local fakes.

## Quota recovery and emergency disabling

### Failure diagnosis without content or secrets

| Observed response/code                                                         | Meaning and operator action                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `400/403/405/413/415/422`                                                      | Boundary/validation rejection. Check exact origin/media/encoding/shape/limits or highlighted fields. Delivery is not invoked; do not weaken origin rules or trap validation                                                                                                                |
| Any edge HTTP `429`                                                            | Proposed platform limit, possibly non-JSON/no header. Confirm rule attribution/coverage using approved platform evidence; the function may not run. Shared IP/regional/window effects matter; keep email fallback                                                                          |
| `503/configuration_unavailable`                                                | With approved Origin and valid input, expected for the current locked-off candidate or missing/invalid mail configuration. Invalid/empty origin configuration instead rejects Origin with 403. The UI blocks further attempts and preserves text; syntax alone cannot clear external gates |
| `503/provider_quota_exceeded` / `provider_throttled`                           | Provider quota or request rate, distinct from edge 429; confirm safe account usage/reset/restrictions and stop attempts                                                                                                                                                                    |
| `503/provider_unavailable` / `502/provider_rejected`                           | Explicit provider unavailability or recognized rejection. Inspect approved account/sender/key permission evidence; never paste raw provider responses or contents into artifacts                                                                                                           |
| `502` unknown codes / `504/provider_timeout` / browser network-timeout failure | Delivery may have been accepted. Preserve the unchanged manual identity while valid; inspect approved provider records separately. Do not infer non-delivery from a missing application/receipt log                                                                                        |
| `idempotency_conflict` / `submission_in_progress`                              | Same key with changed payload or concurrent provider request. Stop conflicting sends; preserve payload/configuration, wait for the existing operation or use fallback. Never generate another key to bypass uncertainty                                                                    |
| Matching public `202`                                                          | Provider acceptance evidence only. Gmail receipt/inbox/reading is separately unverified; no receipt webhook exists                                                                                                                                                                         |

The application diagnostic has no submission/provider ID or content and cannot
uniquely correlate a visitor message or prove mailbox receipt. Use approved
deployment/time/context and account inspection carefully; Resend logs may contain
original request/response bodies and private mail data. Avoid exposing headers,
credentials, addresses or messages when collecting sanitized incident evidence.
Do not request a visitor's whole message just to diagnose a categorical outcome.

### Recovery and disabling

Provider daily/monthly quota rejection maps to `503/provider_quota_exceeded`;
request throttling to `503/provider_throttled`. The official [Resend errors](https://resend.com/docs/api-reference/errors)
describe daily reset at midnight UTC; monthly reset/actual remaining allowance
must be checked in the account. Stop attempts, use email fallback, inspect only
safe outcome categories and approved account usage, and wait for confirmed quota
or throttle recovery. Do not upgrade, enable overages or schedule retries. A lost
response still means uncertain delivery: preserve unchanged manual identity under
23 hours, and never rotate an uncertain key to work around limits. Account/config
changes must preserve payload stability through the retry window.

If abuse, quota loss or legal/protection uncertainty occurs, keep/set
`CONTACT_ENABLED` off in **every affected deployment scope** through a separately
authorized secure action. Environment edits do not alter already running or old
deployments: obtain deployment authorization, publish a disabled candidate, verify
`503/configuration_unavailable` for valid approved-origin requests and verify every
alias/old deployment. Remove usable mail credentials from disabled test targets
through authorized configuration. The present source lock stays false throughout.

During propagation, an authorized operator may need a separately approved edge
block or credential revocation covering still-enabled versions. This guide does
not execute or authorize those actions. In-flight/accepted mail cannot be recalled.
The implemented page retains email fallback; direct API responses never fabricate
acceptance. Re-enable only after actual coverage, quota, sender, terms/legal and
candidate approval are recorded, followed by separately authorized preview/live
acceptance. FS-5.6 records provider acceptance and mailbox receipt separately.

## Rotation, stable-payload changes and rollback

These are operating procedures for separately authorized actions; this task executes none.

1. For ordinary key rotation, inventory the approved provider account/domain/key
   scope and every reachable deployment that holds it. Securely create an equivalent
   sending-only replacement; update only approved server scopes, create separately
   authorized replacement deployments, verify sender/protection/disabled state,
   then retire the old key after covered targets migrate. Do not display/download
   secrets into prompts or evidence. Revoke a compromised key promptly under
   incident authorization rather than waiting for an ordinary rollout.
2. Old immutable deployment URLs can retain old credentials. Cover or retire them;
   changing an environment variable does not modify those artifacts. A replacement
   key in another provider account can also change idempotency scope, so do not
   treat an account migration as an equivalent credential-only rotation.
3. Preserve resolved sender/recipient, subject, normalization and exact plain-text
   payload for active retries. The browser keeps a 23-hour attempt but the provider
   retains keys for 24 hours; the server receives no attempt age and uses its current
   configuration. A changed identity/template can conflict with the same key.
   Prepare an explicit stable-payload transition with sending disabled/all old
   targets covered if active retry compatibility cannot be proved. Never silently
   rotate IDs or retry automatically after configuration/rollout changes.
4. Rollback first to a reviewed delivery-disabled candidate retaining the visible
   fields/availability message/email fallback. Check source lock, environment
   switch, credentials, old URLs/aliases and WAF; an older enabled revision is not
   a safe rollback merely because it once worked. Environment changes and alias/
   rollback deployment actions require their own authorization. Accepted/in-flight
   mail cannot be recalled by disabling or rollback.
5. After any future approved operation, record sanitized revision/deployment/scope,
   verification date, protection and account outcome; do not claim recovered live
   delivery until separately authorized acceptance and Dimi's receipt check.

[Vercel rotation](https://vercel.com/docs/environment-variables/rotating-secrets),
[Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).

## Selected mailbox cleanup policy

Dimi's settled policy is to delete closed ordinary mailbox inquiries **six months
after the conversation ends**, with documented justified exceptions. It is an
operator mailbox policy, not an invented statutory obligation or a statement that
all Vercel/Resend/Google copies disappear at that deadline. No inbox, retention
scheduler or deletion automation exists in FunkSpace.

For operator approval/implementation: record the actual conversation-end/closure
date and resulting six-month cleanup date; define the closure convention and
review cadence; review ordinary closed threads and remove them by the approved
deadline. Include relevant Sent/All Mail/Trash copies, forwarding, exports and
local copies in the approved process. Exceptions record reason, scope, owner and
review/deletion date; Dimi must justify them rather than assuming a retention duty.
Those operational choices and actual execution are not verified here.

Gmail Archive is not deletion. Ordinary Delete retains Trash for up to 30 days;
Delete forever removes it from the account earlier. Dimi must approve how that
affects the selected cleanup deadline. Google describes asynchronous deletion,
backup retention and exceptions; neither account removal nor this policy proves
erasure of every provider or correspondent copy. Resend/log retention is separate.
[Gmail archive](https://support.google.com/mail/answer/6576?hl=en),
[Gmail deletion](https://support.google.com/mail/answer/7401?co=GENIE.Platform%3DDesktop&hl=en),
[Google retention](https://policies.google.com/technologies/retention?hl=en).
