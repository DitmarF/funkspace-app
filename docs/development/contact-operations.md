# Contact abuse protection and operations — FS-5.3

The [frozen contract](../features/FunkSpace_EPIC_5_Detailed_Plan.md#frozen-uiserver-contract),
[server setup](contact-server.md) and [FS-5.3 evidence](../tasks/fs-5.3-contact-protection.md)
govern this guide. Local preparation is complete only after its recorded checks.
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
accessible-safe UI belongs to FS-5.4: no visible extra field, no keyboard or
assistive-technology exposure, autocomplete off and no required constraint.
These are preserved contract requirements, not an implemented form or device PASS.

`CONTACT_DELIVERY_RELEASED=false` remains an unconditional production lock. Even
`CONTACT_ENABLED=true` cannot unlock this candidate. Approved-origin valid input
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
actual logging configuration need review.

Vercel's [runtime log reference](https://vercel.com/docs/logs/runtime) documents
request/domain/deployment metadata and IP/User-Agent matching. Its listed runtime
retention is one hour on Hobby, one day on Pro, three days on Enterprise, and
30 days with Observability Plus. These are public facts, not this account's
configuration. [Firewall observability](https://vercel.com/docs/vercel-firewall/firewall-observability)
is a separate data surface. Dimi must inspect runtime/firewall access, retention,
request detail fields, drains/exports, tracing/APM and third-party sinks, and
record the applicable terms and identifiers they retain. Do not claim the entire
infrastructure stores no identifiers. Message content may also reside in Resend
and Gmail; six-month closed-mailbox deletion is not platform-log retention.

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

The dashboard documentation describes publishing production changes. That is
not evidence this preview or every alias is protected. If actual preview support
or any reachable route's coverage fails, retain delivery off and seek a scoped
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
is distinct from WAF; Standard excludes production domains. Verify protection on
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
the app envelope or Retry-After; FS-5.4 must recognize status before JSON parsing
and preserve draft/key. Report deployment evidence separately from local fakes.

## Quota recovery and emergency disabling

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
`CONTACT_ENABLED=false` in **every affected deployment scope** through a separately
authorized secure action. Environment edits do not alter already running or old
deployments: obtain deployment authorization, publish a disabled candidate, verify
`503/configuration_unavailable` for valid approved-origin requests and verify every
alias/old deployment. Remove usable mail credentials from disabled test targets
through authorized configuration. The present source lock stays false throughout.

During propagation, an authorized operator may need a separately approved edge
block or credential revocation covering still-enabled versions. This guide does
not execute or authorize those actions. In-flight/accepted mail cannot be recalled.
The future page must retain email fallback; direct API responses never fabricate
acceptance. Re-enable only after actual coverage, quota, sender, terms/legal and
candidate approval are recorded, followed by separately authorized preview/live
acceptance. FS-5.6 records provider acceptance and mailbox receipt separately.
