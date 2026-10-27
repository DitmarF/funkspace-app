# Contact acceptance — FS-5.6

This guide records bounded evidence and Dimi's approval of the exact local
source/Privacy changes. The reviewed candidate is applied locally and remains
configuration-gated off. Git delivery, deployment, external settings,
`CONTACT_ENABLED=true`, live email and credential revocation remain separately
authorized actions. The deployed `b829447` Preview is unchanged and source-locked
off; DMARC remains unpublished.
[Task evidence](../tasks/fs-5.6-contact-acceptance.md) and
[operations](contact-operations.md) retain checks and operating procedures.
FS-5.1–5.5 and EPIC 4 stay closed; FS-G2 waits for actual EPIC 5 acceptance.
EPIC 6 has not started.

## Current candidate and observed evidence — 27 October 2026

- Actual preparation base: `feature/funkspace-minimum-usable` at
  `b8294476bfd3a20e703c14362f4f797663b59dac`; the checkout was clean at inspection.
  That revision and the existing deployed Preview retain the literal false
  source lock. Dimi subsequently approved the reviewed seven-file source/Privacy
  candidate and confirmed the three non-secret Preview values and branch scope.
  The local working tree now removes the temporary source lock; only exact
  `CONTACT_ENABLED=true` with valid configuration can create a delivery adapter.
  Missing/false/invalid configuration remains unavailable. No new commit or
  deployment is inferred from local application.
- Selected protected branch origin:
  `https://funkspace-app-frontend-git-feature-fun-606557-ditmarfs-projects.vercel.app`.
  The observed off-only Preview identifies `b829447`; its immutable URL is
  `https://funkspace-app-frontend-jdo52g9dg-ditmarfs-projects.vercel.app`. Record
  the future candidate’s new immutable URL/revision before any send;
  a moving alias alone does not identify a candidate. Earlier `ad2e98e`/`iad1`
  screenshots are historical, not proof of the future deployment's region.
- One approved off-only run produced five `400/invalid_shape` results followed
  by one HTTP 429. Five categorical application entries at 14:42:08.55–09.22 CET
  corroborate those rejections. A rule-filtered firewall view shows one rate
  limit at 14:42 for `/api/contact` and the branch-host prefix. One further
  invalid `{}` request after the reset showed recovery: seven invalid requests
  total, no valid form submission. No additional probe budget remains implied.
- That is narrow observed enforcement/recovery evidence, not proof of every
  alias, region or path variant. Individual blocked-request tracing, exhaustive
  function-log absence and the runtime screenshot's environment/deployment
  filters were not independently established. Protection must cover `/contact`
  and `/api/contact`, both the stable alias and immutable live-enabled URLs.
- Resend evidence shows `mail.funkspace.de` Verified, Ireland (`eu-west-1`),
  Forge enabled, DKIM/two CNAME records Verified, sending on and receiving off.
  The reviewed key is sending/domain restricted and showed zero uses; the Free
  account view showed 0/3,000 monthly and 0/100 daily usage. These are dated
  account observations, not reservations or future quota guarantees.
- Configuration shows no configured tracking domain and offers Configure for
  tracking setup; the earlier wizard was unsaved. Public defaults are off, but
  saved open/click flags were not individually exposed. Do not label literal
  tracking booleans verified false. Opportunistic TLS is shown; it does not
  guarantee TLS on every mail hop.
- Dimi explicitly approved using Resend for the form under the reviewed terms
  and DPA, including disclosed US processing. This records his service decision,
  not legal certification or authorization to deploy/send. His later “All things
  are approved” accepts the exact reviewed source/Privacy candidate and confirms
  the last question's three non-secret Preview values and branch scope. These are
  operator approvals/reports, not independent account-value verification. The DPA
  permits US processing and distinguishes
  agreement-related retention from message/log policy and mailbox cleanup.

## Local and delivery-off safeguards

Routine checks use isolated credential-free snapshots, no environment files,
`CONTACT_ENABLED=false`, blank credentials, a fresh server and verified egress
denial. The current deployed candidate also has a false source release lock.
The approved local candidate instead proves default/off and
invalid-configuration fail-closed behavior through explicit composition tests. Provider/browser outcomes are injected fakes. The explicit Node
contact suite, affected component/type/lint, production bundling and focused
browser checks belong to the task evidence; no routine test may contact Resend.
Failures, timeouts, duplicate guards, manual retry/expiry, non-JSON 429 and phone
presentation use controlled responses. Preserve no-JavaScript email fallback.

The saved external Preview key may remain during an expressly authorized off-only
check only when the deployed source identity, literal false lock, environment off
and null delivery port are verified. That exception never applies to local tests
and does not claim key absence. Any extra origin/alias/path/authentication probes
need listed targets, a bounded request count and explicit authorization. Do not
repeat the completed seven-request run automatically.

The [frozen contract](../features/FunkSpace_EPIC_5_Detailed_Plan.md#frozen-uiserver-contract)
remains unchanged: matching 202 means provider acceptance, not mailbox receipt;
eight-second provider/fifteen-second browser deadlines; no automatic retries;
unchanged manual retry identity for less than 23 hours; memory-only draft/key.

## Local approval and remaining single-message authorization record

Complete the fields relevant to each action before requesting its authorization.
The exact reviewed source/Privacy patch is approved and applied locally; record
its patch/hash and the generated commit after authorized Git delivery. Authorize deployment by project, branch,
source revision, stable origin and exact settings, then record its returned
immutable URL. The final one-message authorization requires the actual deployed
revision and URL. Preparation approval does not execute any row.

| Item                     | Exact proposed scope or remaining input                                                                                                                                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project/environment      | `funkspace-app-frontend`, protected Preview only; branch `feature/funkspace-minimum-usable`; Production stays off                                                                                                                               |
| Source                   | Exact seven-file source/Privacy candidate approved by Dimi and applied locally; artifact/hash identifies the working diff. New Git revision remains pending; deployed `b829447` stays source-locked off                                         |
| Deployment               | Record exact new immutable URL plus the stable origin above, successful build/source identity, protection, region and every reachable live-enabled alias                                                                                        |
| Configuration            | Dimi confirmed `CONTACT_FROM`, `CONTACT_TO`, exact selected-origin JSON and the Preview branch scope. No account values/secrets were independently retrieved; verify the new deployment's effective scope before a send. The switch stays false |
| Fixed sender             | `FunkSpace <contact@mail.funkspace.de>`; approved/confirmed by Dimi and domain verification evidenced; effective new deployed value remains to verify                                                                                           |
| Fixed recipient          | `info@funkspace.de`, explicitly selected by Dimi; tested Workspace alias                                                                                                                                                                        |
| Fixed subject            | `FunkSpace contact message`, generated by the server                                                                                                                                                                                            |
| Visitor/Reply-To         | `diamondfunk13@gmail.com`, Dimi's controlled visitor address for this proposed test                                                                                                                                                             |
| Name                     | `FS-5.6 acceptance`                                                                                                                                                                                                                             |
| Message                  | `FS56-PREVIEW-ACCEPTANCE-01 — One authorized preview test. No reply required.`                                                                                                                                                                  |
| Remaining service checks | Confirm current quota, intended no-tracking behavior with its disclosed evidence limit, and any outstanding subprocessor/transfer or platform/account review; do not silently mark unexposed settings verified                                  |
| Firewall                 | Preserve five/IP/600-second fixed-window POST `/api/contact` → 429; verify applicable protection/coverage on the new deployment and enumerate alias limits rather than extending the observed PASS                                              |
| Request limit            | Maximum **one valid live form submission**, no automatic/manual retry, plus only separately listed delivery-off checks; no unsolicited reply                                                                                                    |
| Shutdown                 | Approve the off-candidate deployment and retirement/restriction of enabled immutable targets; verify that the preview key is dedicated and explicitly authorize its revocation where needed to cover stale deployments                          |

Local source/copy approval is already recorded; do not request it again. Git
delivery, external configuration or enabling, deployment, the live submission
and credential revocation each require specific authorization. They may be approved as a concrete named
sequence with reviewable source, targets, settings, request counts and shutdown
actions. A newly generated commit or deployment URL is recorded after its
authorized creation; no placeholder authorizes sending a live message to an
unverified deployment.
Keep DMARC unpublished and do not change provider decisions or upgrade a plan.

## Execute only after exact authorization

1. Pin the approved local source/copy artifact and record the new revision after
   authorized Git delivery; perform only authorized deployment and
   Preview settings actions. Reverify source identity, safe configuration scopes,
   exact origins and protection of the stable and immutable `/contact` and
   `/api/contact` URLs. Direct clients can forge Origin; it is not bot protection.
   Stop on missing protection, coverage or unresolved required approval.
2. From the approved protected Preview, make one deliberate submission using
   exactly the table's harmless message. Preserve its generated submission ID.
   A timeout, network failure or ambiguous result may already mean delivery;
   stop rather than resubmitting. Even a same-key retry needs new authorization.
3. Record a valid matching public 202/submissionId separately from the provider's
   acceptance identifier using sanitized approved account evidence. Categorical
   application logs omit these identifiers and cannot prove receipt. A provider
   rejection is a test outcome, not permission to send another inquiry.
4. Dimi confirms the unique marked message arrived through `info@funkspace.de`
   in Workspace/Gmail. Inspect From and Reply-To against the approved values,
   and actual authentication results without inferring DMARC success. Do not
   reply. Record provider acceptance and mailbox receipt as separate facts.

## Disable, recover and accept

Execute only the separately approved shutdown: return to a reviewed delivery-off
candidate and environment switch off; verify the disabled presentation and email
fallback. Any additional off-state API check needs its own stated request budget
and verified no-delivery capability; it must return 503 for valid approved-origin
input. No second live message is needed for shutdown or recovery.

Vercel environment edits affect subsequent deployments, not old immutable URLs.
Inventory every enabled target. A confirmed dedicated preview key can be revoked
under explicit authorization to remove their remaining mail capability while the
off deployment propagates. Never revoke a shared key without assessing its users;
otherwise approve an exact restriction/retirement plan for the remaining targets.
Do not claim an alias switch or newly saved false value disables old deployments.
Record actual off-state/retirement or revocation evidence; keep Production off.

Leave acceptance pending without verified source/target/protection, required
approval, provider outcome, Dimi's receipt or shutdown. After those facts exist,
Dimi's final action is:

> I confirm the single FS-5.6 test message FS56-PREVIEW-ACCEPTANCE-01 arrived in my Workspace inbox through info@funkspace.de. Its From and Reply-To match the approved test. I accept FS-5.6 and the EPIC 5 contact journey at the recorded revision and Preview URL, with the controlled test targets safely disabled. Production activation and DMARC publication require separate authorization.

Attach actual revision, full URLs and evidence before requesting that decision.
Do not pre-mark Dimi's action, mailbox receipt, EPIC 5 or FS-G2 acceptance.
