# Contact acceptance — FS-5.6

This guide prepares controlled acceptance; it does not authorize deployment,
settings changes or live email. Delivery stays source-locked off and DMARC stays
unpublished. [FS-5.6 evidence](../tasks/fs-5.6-contact-acceptance.md) records actual
checks; [operations](contact-operations.md) owns ongoing procedures. EPIC 4 and
FS-5.1–5.5 remain closed. FS-G2 waits for actual EPIC 5 acceptance; EPIC 6 has not
started.

## Candidate and evidence boundaries

- Local preparation base: `feature/funkspace-minimum-usable` at
  `ad2e98e1ff433c9d5942692bc722f0198ba12b46`. Pin the final commit and intentional
  diff/artifact before authorizing a deployment; a moving branch alias alone
  does not identify a candidate.
- Intended stable preview origin:
  `https://funkspace-app-frontend-git-feature-fun-606557-ditmarfs-projects.vercel.app`.
  Record the new immutable deployment URL after separately authorized deployment.
- The supplied existing Preview screenshot identifies `ad2e98e`, Ready, Legacy
  Standard Protection and region `iad1`. An unauthenticated GET on 2026-10-27
  redirects the stable alias to Vercel SSO. Neither verifies a future deployment
  or protection of every immutable URL/alias.
- Supplied Resend evidence shows `mail.funkspace.de`, Ireland (`eu-west-1`),
  Forge enabled, DKIM/two CNAME records Verified, sending on and receiving off.
  Dimi reports creating a restricted key and saving branch-scoped Preview
  variables; masked values and truncated branch labels are not verification of
  their contents. Never retrieve or paste credentials into evidence.
- Dimi approved `info@funkspace.de` as recipient. The fixed intended sender is
  `FunkSpace <contact@mail.funkspace.de>`. Domain verification does not prove the
  deployed values, account permissions, tracking settings or receipt.
- Dimi's published/enabled WAF screenshot shows exact path `/api/contact`, AND
  method POST, fixed window 600 seconds, five requests/IP and HTTP 429. Actual
  Preview/alias enforcement remains unverified. No paid upgrade is selected.

## Local preparation

Record actual results in the task evidence before marking local checks complete.
Use a clean isolated snapshot with no environment files, no usable credentials,
`CONTACT_ENABLED=false`, literal `CONTACT_DELIVERY_RELEASED = false`, a fresh
server and a verified egress-denying preloader. Inject provider/browser fakes;
no routine test may contact Resend. Run the explicit Node contact-layer suite,
affected component/type/lint checks, production bundling and focused browser
checks. Test failure presentation, input preservation, edit/retry identity,
expiry, duplicate submission guards and non-JSON 429 through controlled responses.
Use the static manual preview for phone scenarios. No-JavaScript email fallback
and delivery-disabled presentation must work without a provider.

Keep the frozen [contract](../features/FunkSpace_EPIC_5_Detailed_Plan.md) intact:
matching 202 is provider acceptance only, eight-second provider/fifteen-second
browser deadlines, no automatic retries, memory-only drafts and unchanged manual
retry identity within 23 hours. This preparation does not unlock delivery.

## Phase A — separately authorized delivery-off preview

1. Request authorization naming the exact candidate revision/diff, project
   `funkspace-app-frontend`, Preview branch, stable origin, deployment action and
   disabled checks below. The existing Preview is not evidence of the new build.
2. Verify the deployed source still has the literal false release lock and that
   composition cannot construct `ResendContactDelivery`: configuration is
   disabled and the delivery port is null. Verify `CONTACT_ENABLED=false` in the
   target's approved scope, without exposing the key. Local tests remain
   credential-free. A key already saved by Dimi may remain scoped to this
   delivery-off Preview only when those independent source/configuration checks
   pass; do not describe it as absent or use it to make a provider request.
3. Record exact configured origins, deployment revision/URL, protection mode,
   region and reachable aliases. Verify unauthenticated access requires login on
   the stable and immutable URLs for `/contact` and `/api/contact`; include any
   POST in the explicitly listed request/variant budget. Verify the intended
   reviewer can authenticate.
   Do not use wildcard origins or infer trust from Host. Direct clients can
   forge Origin. Stop if protection or WAF coverage is missing.
4. An optional valid synthetic off-state request must be explicitly included in
   authorization and count against the same WAF window. Expected result is
   `503/configuration_unavailable`, never 202. It contains only approved test
   details. Verify form/fallback behavior; do not submit repeatedly.
5. For each explicitly approved origin/alias, in one fresh observed window and
   one authenticated browser/IP/region, send **at most six** JSON POSTs with body
   `{}`. Use the exact permitted Origin and no personal fields. First five should
   return application `400/invalid_shape`; sixth should be rule-attributed 429
   before function invocation. No body can pass validation or invoke delivery.
   Record rule attribution and function traffic, not just an arbitrary 429.
6. Stop on unexpected status, uncertain window boundaries or earlier counted
   requests. A repeat window or additional alias needs an explicit bounded
   authorization; do not silently increase the request budget. After reset,
   authorize **one** additional invalid `{}` request to show recovery. Regional
   counters, boundary bursts, shared-network users and distributed quota abuse
   remain limitations; one region's result proves only that observed scope.
7. A bounded matrix for other methods/paths, query/normalized path variants,
   aliases and reviewer-cookie interactions requires its own listed targets and
   request counts. Perform these with delivery off. Browser failure wording and
   non-JSON 429 handling use controlled responses, not provider failures.

## Phase B — separately authorized single live acceptance

Phase A does not authorize this phase. Prepare a new explicitly approved candidate
to remove the source release lock and update Privacy’s current disabled paragraph
to match enabled processing. Review that exact public copy with Dimi, pin the new
revision and obtain approval for
Preview-only enabling. Do not change the lock in local preparation. Verify
sender/recipient, exact origins, protection and all reachable live-enabled URLs,
WAF evidence, scoped key, quota, tracking off and required account/terms/DPA and
processing-copy review before enabling. Account facts still unknown stay pending;
FS-5.5 closure is not proof of a newly enabled provider's settings.

Proposed single message for later approval: Name “FS-5.6 acceptance”, visitor
email `diamondfunk13@gmail.com`, Message “FS56-PREVIEW-ACCEPTANCE-01 — One
authorized preview test. No reply required.” Fixed subject comes from the server;
recipient is `info@funkspace.de`. Confirm this exact test before execution.

Authorization must name the exact deployment URL/revision, approved visitor
address, fixed sender/recipient, a unique harmless test marker/message and
**maximum one valid live submission**. Use one deliberate click, and make no
automatic or manual retry if its outcome is uncertain. Any additional attempt,
even with the same idempotency key, needs specific authorization.

Record valid matching public 202/submissionId separately from the provider's
acceptance identifier using approved, sanitized account evidence. Application
diagnostics deliberately omit these identifiers; they cannot prove receipt.
Dimi then confirms the marked message arrived through `info@funkspace.de` in
Workspace/Gmail. Inspect From and structured Reply-To against the approved test
address; inspect actual authentication results without inferring a DMARC pass.
Do not send a reply. Mailbox receipt is separate from provider acceptance.

## Disable, recover and accept

Return the controlled target to delivery off and verify 503/fallback without
another live message. Vercel variable changes affect subsequent deployments;
old immutable deployments retain their configuration. Verify all live-enabled
targets are disabled/restricted, or separately authorize revocation of the
dedicated test key when needed. Never claim a newly saved false value instantly
disables previous deployments. Keep production off and DMARC unpublished.

Record the final revision, target, evidence, limits, receipt and verified shutdown.
Leave acceptance blocked if service access, protection, account/legal approval,
receipt or shutdown cannot be verified. No additional live test is implied.
After technical evidence and receipt are available, Dimi's exact final action is:

> I confirm the single FS-5.6 test message FS56-PREVIEW-ACCEPTANCE-01 arrived in my Workspace inbox through info@funkspace.de. Its From and Reply-To match the approved test. I accept FS-5.6 and the EPIC 5 contact journey at the recorded revision and Preview URL, with the controlled test target returned to disabled state. Production activation and DMARC publication require separate authorization.

Attach the actual verified revision, Preview URL and receipt evidence before
requesting that decision. Do not pre-mark Dimi's action, mailbox receipt or FS-G2.
