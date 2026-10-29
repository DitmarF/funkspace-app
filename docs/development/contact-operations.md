# Contact abuse protection and operations — FS-5.3 / FS-5.5 / FS-5.6

The [frozen contract](https://github.com/DitmarF/funkspace-app/blob/07a75a713242a0b6b4d8fde336856b13a8033e44/docs/features/FunkSpace_EPIC_5_Detailed_Plan.md#frozen-uiserver-contract),
[server setup](contact-server.md), [processing/storage facts and legal-copy checklist](contact-processing-facts.md),
[FS-5.3 evidence](../tasks/fs-5.3-contact-protection.md) and
[FS-5.5 technical preparation](../tasks/fs-5.5-contact-operations.md) govern this guide.
Code and official public documentation were re-audited 2026-10-14 at
`9ba16f8d0ba7dcc5b24ff57383dc8631701b7185`. Dimi accepted the implemented legal
copy and operating documentation and explicitly closed FS-5.5 on 2026-10-15.
The [Workspace/DMARC follow-up](#workspace-aliases-and-prepared-dmarc--2026-10-15)
records later mailbox tests and public DNS checks on 2026-10-15; these are not
Resend, deployed-form or protection acceptance.
The later [local legal presentation](../tasks/fs-5.5-legal-presentation.md#current-local-integration--2026-10-15)
implements reviewable legal/contact copy from base `fe2d074`, after Dimi directed
completion instead of continuing the extended account audit. Public email links
now use the tested `info@funkspace.de` alias; the frozen server recipient and
provider payload are unchanged. The accepted address-free choice and legal
wording do not certify an exemption or account-specific compliance. The
[presentation closure](../tasks/fs-5.5-legal-presentation.md#dimi-acceptance-and-fs-55-closure--2026-10-15)
records Dimi's acceptance and specific commit/push authorization. The separate
storage assessment, mailbox-workflow adoption and actual account facts remain
operating/activation follow-up; no external action is implied.
The selected branch Preview has observed limiter/recovery and controlled live
acceptance evidence recorded below. Wider protection retains its stated limits.
This guide is not permission for additional settings, deployments or messages.

## Setup evidence — 2026-10-27

This dated register supersedes older “not applied/no preview/every row pending”
claims only for the facts explicitly recorded here. The initial clean base was
`ad2e98e1ff433c9d5942692bc722f0198ba12b46`, branch
`feature/funkspace-minimum-usable`. These initial observations predate the later
delivered and tested `36407f6` candidate below.

| Item                | Evidence and limit                                                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Workspace           | `info@funkspace.de` and `dmarc@funkspace.de` aliases and receiving/reply tests were verified/reported on 15 October; Google SPF/DKIM passed. These are mailbox tests, not form delivery.                                                                                                                                                                                  |
| Approved identities | Dimi selected `info@funkspace.de` as the fixed recipient on 27 October; proposed fixed sender remains `FunkSpace <contact@mail.funkspace.de>`.                                                                                                                                                                                                                            |
| Resend domain       | 27 October 12:55 screenshot: `mail.funkspace.de`, Verified, Forge enabled, Ireland (`eu-west-1`); DKIM and both sending records Verified. Receiving was shown off in setup.                                                                                                                                                                                               |
| Actual DNS          | Vercel screenshot: TXT `resend._domainkey.mail` (public key omitted), CNAME `rsend.mail` to `rsend-euw1.forge.rmta.net.`, CNAME `send.mail` to `send.forge.rmta.net.`; TTL 60. Setup-session read-only queries to both Vercel nameservers confirmed these records and preserved root Google MX. Do not substitute legacy MX/SPF examples for the generated Forge records. |
| DMARC               | Root monitoring record was prepared on 15 October, deliberately never published. The setup-session public DNS check found no root DMARC TXT. No DMARC action is authorized here.                                                                                                                                                                                          |
| Key/configuration   | User reports key created/saved. Screenshot shows `RESEND_API_KEY` Secret and `CONTACT_ENABLED` Config, Preview with branch prefix. Full branch, values and actual key permissions were not inspected. Sender/recipient/origins were guided, not verified as deployed. Never reveal a value to establish this evidence.                                                    |
| Preview             | 27 October 13:26 screenshot: project `funkspace-app-frontend`, Preview Ready/Latest, source `feature/funkspace-minimum-usable` at `ad2e98e`, created 15 October, Node 22.x and region `iad1`. It predates newly saved variables and this candidate.                                                                                                                       |
| Authentication      | Require Log In on, Legacy Standard Protection in screenshots. The earlier setup-session unauthenticated GET of the branch alias redirected to Vercel SSO. This proves that URL's page gate only, not API/WAF/all-alias coverage.                                                                                                                                          |
| WAF                 | 13:41 rule screenshot has exact path `/api/contact` AND method POST, fixed window 600 seconds, 5 requests, IP-only key, 429. After the publish step, 13:49 screenshot shows **Contact form rate limit** enabled with 429 selected. Configuration evidence passes; actual enforcement does not yet have a PASS.                                                            |

Selected branch alias:
[protected Preview](https://funkspace-app-frontend-git-feature-fun-606557-ditmarfs-projects.vercel.app).
Record the new immutable URL/revision after a separately authorized deployment.
Keep the exact browser origin approved; no wildcard or Host-derived origin.
The [FS-5.6 procedure](contact-acceptance.md) names the next bounded checks.

The initial setup table above predates the later verification below. Key scope,
Free allowance, observed branch limiting and Dimi’s provider approval are now
evidenced. Remaining limits include full deployed configuration, literal saved
tracking flags, other-alias/path coverage, custom bypasses and platform
logging/access/retention. Application diagnostic
minimization does not imply that the hosting infrastructure stores no IPs.
Ireland is a sending region, not an EU storage guarantee; see
[current processing facts](contact-processing-facts.md#fs-56-current-facts--2026-10-27).

## Protected Preview and provider approval — 2026-10-27

The [FS-5.6 follow-up](../tasks/fs-5.6-contact-acceptance.md#protected-preview-and-provider-approval--2026-10-27)
owns the exact times, screenshots, provenance and limits. The off-only observed
Preview was `b829447`, Ready, on the selected branch. Its immutable URL was
`https://funkspace-app-frontend-jdo52g9dg-ditmarfs-projects.vercel.app`.
Dimi reports login protection for the stable/immutable page and API addresses
and the switch was false for that run. That historical `b829447` retained its
source lock; the later controlled acceptance used `36407f6` instead.

The controlled off-only branch test produced five typed 400 rejections, then
one 429. The named rule’s aggregate view records one matching rate limit;
five categorical runtime events corroborate application rejection. One extra
empty request after reset returned the expected 400. This is a narrow observed
branch/run PASS, not a global cap, exhaustive function trace or all-alias/path
certification. Seven invalid requests were used; no extra probes are implied.

The Resend key **FunkSpace contact preview** is sending-only/domain restricted
and showed zero uses. The account is Free with 0/3,000 monthly and 0/100 daily
at the observation. Configuration shows no configured tracking domain; saved
open/click booleans were not exposed. The earlier creation wizard was not saved.
Opportunistic TLS is observed, without asserting TLS on every delivery hop.

Dimi approved Resend under its terms/DPA, including disclosed US processing.
The downloaded vendor DPA was reviewed against technical disclosures; it is
kept outside Git and does not certify legal completeness. His later source/copy
approval is recorded below. Subsequent delivery and controlled acceptance are
recorded separately; the [procedure](contact-acceptance.md) owns action limits and
shutdown evidence. Do not repeat the
provider-choice approval or reopen FS-5.5/EPIC 4.

### Source and copy approval; local application

Dimi answered “All things are approved” to the exact reviewed seven-file
source/Privacy proposal and the last question's three non-secret Preview values
and branch scope. This approves that local source/copy application and confirms
the selected `CONTACT_FROM`, `CONTACT_TO`, exact selected-origin JSON and Preview
branch scope as operator reports. No secret or actual account value was retrieved
to independently verify the effective deployment configuration.

The approved candidate was applied locally and delivered at `36407f6`: the temporary source lock is removed,
while exact `CONTACT_ENABLED=true` and complete valid configuration remain
mandatory. Default/missing/false/invalid cases fail closed. The local approval
alone did not authorize deployment or sending. Later specific actions and the
controlled result are recorded below; they authorize no extra message or DMARC
publication.

### Controlled protected-Preview acceptance — 2026-10-27

The accepted candidate is source
`36407f6a790a8d9787bdc3123041e24e181bdfee`, deployment `6N37XmGQ3`.
The configured stable origin is
`https://funkspace-app-frontend-git-feature-fun-606557-ditmarfs-projects.vercel.app`.
The browser showed matching acceptance and the exact deployed runtime recorded
`httpStatus:202`, `outcome:accepted`, `code:null` at 16:10:07.70 CET.
This is provider acceptance through the validated application path, separately
from Dimi's confirmation that the message arrived through `info@funkspace.de`
in Workspace. He also confirmed the sender and working Reply-To and requested
EPIC 5 closure. No internal provider ID, secret or message content is copied into
these diagnostics.

The earlier 16:01:14.02 CET request from the immutable deployment's origin
returned `403/origin_rejected`; the handler rejected it before the delivery port.
The successful attempt used the approved stable origin. That exact-origin
protection was retained: no wildcard allowlist, Host exception or new code fix
was needed. No extra live send or replay is implied by documenting the diagnosis.

The scoped `CONTACT_ENABLED=false` setting was saved and separately verified.
Fresh off deployment `BJwbeuR6NUejxG3GDpq3QQHj337q`, host identifier `h9uharydb`,
was Ready at 16:18 CET from the same `36407f6` source. The stable alias and new
immutable Contact page both showed disabled controls, the availability notice
and email fallback. That off deployment did not itself disable the older URL.
Dimi explicitly authorized deleting the old test Preview, and Vercel confirmed
deletion of exact deployment `6N37XmGQ3LDAnWvAwmrmJXFmUizx`, host identifier
`4twqcqhug`. Recorded at 15:31:02 UTC, cookie-free GET checks of the old host's
`/contact` and `/api/contact` both returned 404 `DEPLOYMENT_NOT_FOUND`.
No POST, provider request, new email or key revocation was needed. The stable
Contact page was reloaded and retained the disabled notice/button and fallback.

With provider acceptance, Dimi's separate receipt/sender/Reply-To confirmation
and the verified named-target shutdown, FS-5.6, EPIC 5 and FS-G2 are complete on
27 October. This closes the recorded controlled journey, not a global inventory
or universal old-alias protection claim. Production `main` at `31abe42` is
unchanged; DMARC remains unpublished and EPIC 6 has not started. Wider release
coverage and operating evidence limits remain the follow-up described below.

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

Historical `b829447` had its unconditional false source lock. The delivered
`36407f6` candidate instead uses the existing exact `CONTACT_ENABLED=true` gate and
complete configuration. Default/missing/false enablement and invalid origins
do not read credentials. Invalid mail configuration also fails closed without
constructing a delivery adapter. Approved-origin valid input while off
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

The supplied Production screenshot identifies Ready `main` at
`31abe42d97563775272d8a99e5021f3b39bc86ab`, created 15 September, and configured
function region `iad1` (USA). It does not prove all edge/log/storage processing
locations or deploy the current feature candidate. A last-hour runtime-log view
shows no matching entries; its Production-only selection is not visible. Drains,
access roles, export sinks and complete retention configuration remain unverified;
an empty view is not evidence that logging or exports are off. These unknowns
remain relevant before activation, not a blocker to local legal-copy preparation.
`.vercelignore` is upload exclusion,
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
Workspace authentication does not itself verify that sender or authorize a live form.
Resend domain verification was subsequently evidenced on 27 October.

Historical 15 October position (superseded by the dated 27 October register):
the public fallback became `info@funkspace.de` under
Dimi's legal-presentation completion request. The frozen server recipient remains
the testing Gmail choice; no provider-recipient or retry-payload migration is
performed. A later recipient change requires its own scoped decision. Account agreements, mailbox
retention/forwarding/exports, Resend setup, WAF/preview coverage and legal approval
remain pending. The source release lock stays false, `CONTACT_ENABLED` stays off,
and these mailbox tests do not start FS-5.6.

## Secure configuration and sender verification

Names only; no environment values, credential examples or secret-bearing commands:

| Server-only environment name | Responsibility                                                                                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CONTACT_ENABLED`            | Defaults off; only an authorized target may use exact true plus valid configuration. Return controlled test targets to off under the recorded shutdown procedure |
| `RESEND_API_KEY`             | Secure provider credential, with sending-only access restricted to the selected verified domain where available                                                  |
| `CONTACT_FROM`               | Fixed approved FunkSpace sender identity, never visitor-controlled                                                                                               |
| `CONTACT_TO`                 | One fixed approved recipient, now the tested Workspace alias per the dated amendment                                                                             |
| `CONTACT_ALLOWED_ORIGINS`    | Nonempty canonical exact-origin JSON array; no wildcard, Host inference, paths/query/userinfo or unreviewed preview aliases                                      |

Keep configured values in authorized server environment scopes, never under a NEXT_PUBLIC
name or in client composition, prompts, repo files, test fixtures, screenshots or
raw log exports. The reader checks syntax, not account permission, domain ownership,
tracking, mailbox existence or legal approval. Disabled configuration prevents
reading mail credential/identities. Historical `b829447` also retained its source lock.

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
The dated setup register records verified domain evidence; the controlled test
above adds successful acceptance, Dimi's recipient receipt and sender/Reply-To
confirmation. This does not verify every future configuration scope.
[Domain verification](https://resend.com/docs/dashboard/domains/introduction),
[DMARC](https://resend.com/docs/dashboard/domains/dmarc),
[API key permissions](https://resend.com/docs/api-reference/api-keys/create-api-key).

The adapter sends only deterministic plain text with the fixed subject and
structured validated Reply-To; it requests no tracking or automatic reply.
Resend documents open/click tracking off by default. The observed account view
showed no configured tracking domain; individual saved flags were not exposed.
Retain that evidence limit instead of claiming literal booleans were inspected.
No tracking feature is requested by the implemented plain-text payload.
[Tracking](https://resend.com/docs/dashboard/domains/tracking).

## Exact WAF rule — observed branch enforcement, broader coverage pending

The operator has published the rule in `funkspace-app-frontend`, as recorded
above. No repository configuration installs it, and no local check proves its
Preview/alias enforcement. The historical proposed rule name below is descriptive;
the actual published name is **Contact form rate limit**.

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

The dated setup register supplies selected Preview and published-rule evidence.
**Full inventory and broader coverage remain operating/release follow-up**. The
observed branch limiter/reset test has a narrow PASS, and the selected stable
origin completed controlled delivery. Neither establishes worldwide protection.

| Target                                                           | Required evidence before enabling                                                           | Current outcome                                                                                                                                                            |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Intended protected preview                                       | Exact URL, commit/build, project/team, authentication method, reviewer access, enforced WAF | `b829447` limiter/reset PASS; `36407f6` / `6N37XmGQ3` accepted and received; replacement `BJwbeuR6NUejxG3GDpq3QQHj337q` UI off, old enabled deployment deleted and checked |
| Generated deployment URL                                         | Same revision; WAF plus preview protection; authorized same-origin API test                 | Historical `b829447` login operator-reported; live `6N37XmGQ3` immutable-origin request rejected before delivery; exhaustive WAF/path coverage not inferred                |
| Branch/preview/custom aliases                                    | Complete actual list, project/deployment mapping, enabled environments and WAF              | Unverified                                                                                                                                                                 |
| Production domain(s), including owned `funkspace.de` if attached | Current attachment/revision; WAF; deliberate release permission                             | Unverified; no release permission                                                                                                                                          |
| Default project domain/production deployment URL                 | Reachability, current/historical revision, rule/protection scope                            | Unverified                                                                                                                                                                 |
| Older deployments/aliases with an enabled contact handler        | Inventory; disable/restrict each reachable enabled version                                  | Unverified                                                                                                                                                                 |

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
until its exact target and delivery-off safeguards below are authorized.

### Deployment-only check procedure — observed branch PASS, broader scope pending

After separately authorized configuration and deployment of a delivery-off
candidate, enumerate all rows and verify every reachable URL. Record sanitized
rule/coverage evidence with commit, deployment, date, region and authentication
mode. No message/name/email is needed in the test body: `{}` with approved Origin
and JSON media is invalid locally and cannot send. Local/routine tests always
have blank credentials. For the selected external off-only test, the saved
branch-scoped key may remain only after verifying the deployed literal source
lock is false, the environment switch is off, and composition cannot construct
a delivery adapter or read the key. These independent safeguards plus invalid
input replace the historical requirement to remove that key; its absence must
not be claimed. If source identity/off state cannot be proved, stop. This local
task authorizes none of those external requests. The
[bounded procedure](contact-acceptance.md) controls request counts and evidence.

Within one observed fresh fixed window and one IP/region, make five matching
requests; they should reach the application and reject invalid shape. The sixth
must receive HTTP 429 before invocation. Verify rule attribution/function traffic,
not just an arbitrary 429. If a window boundary intervenes, stop without claiming five-per-window
evidence. A repeated window requires new explicit bounded authorization under
the acceptance procedure. Verify recovery after reset,
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
through authorized configuration. Routine local checks keep the switch false
and credentials blank; historical `b829447` also had a source lock. Neither a
saved environment value nor this operating guide authorizes another enabled
deployment or live message.

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

The [mailbox workflow and application guide](contact-mailbox-workflow.md)
prepares a simple manual procedure for Ditmar Funk: inquiry-state labels and one
private dated Google Task per closed conversation, plus a separate DMARC label.
It includes setup/reminder testing, date examples, reopening, exceptions and
selective permanent deletion. Tasks adds minimal operator metadata, which needs
account/privacy review and deletion alongside the mail. This is proposed and not
yet adopted/configured/tested; no mailbox setting or reminder was changed here.

For operator approval/implementation: record the actual conversation-end/closure
date and resulting six-month cleanup date; define the closure convention and
review cadence; review ordinary closed threads and remove them by the approved
deadline. Include relevant Sent/All Mail/Trash copies, forwarding, exports and
local copies in the approved process. Exceptions record reason, scope, owner and
review/deletion date; Dimi must justify them rather than assuming a retention duty.
Those operational choices and actual execution are not verified here.

For remaining hosting facts, Dimi has identified netcup. The
[read-only hosting checklist](legal-copy-draft.md#read-only-account-checks--how-to-find-the-missing-facts)
distinguishes netcup domain/package allocation and Vercel DNS routing from actual
webspace traffic. Later screenshots show a netcup Website virtual host at
`/funkspace.de/httpdocs` and visible 1 October Apache certificate-name warnings;
they do not establish visitor traffic. The older Vercel Production revision and
its displayed function-region setting are recorded above. Actual agreements,
all processing locations and full platform logging remain unverified.

Gmail Archive is not deletion. Ordinary Delete retains Trash for up to 30 days;
Delete forever removes it from the account earlier. Dimi must approve how that
affects the selected cleanup deadline. Google describes asynchronous deletion,
backup retention and exceptions; neither account removal nor this policy proves
erasure of every provider or correspondent copy. Resend/log retention is separate.
[Gmail archive](https://support.google.com/mail/answer/6576?hl=en),
[Gmail deletion](https://support.google.com/mail/answer/7401?co=GENIE.Platform%3DDesktop&hl=en),
[Google retention](https://policies.google.com/technologies/retention?hl=en).
