# FunkSpace EPIC 6 — Implementation Prompts

## How to use this pack

Prepared 28 October 2026 from the [detailed EPIC 6 plan](FunkSpace_EPIC_6_Detailed_Plan.md). This session creates prompts only. Sending a selected prompt later starts that bounded task; creating this pack does not start implementation or authorize external actions.

The outcome remains a public, tested, usable site by **Thursday evening, 29 October**, before the **Friday, 30 October, 06:00 presentation**. Times are Europe/Berlin. Preserve completed EPICs 4/5 and FS-G1/FS-G2. Game implementation follows accepted website delivery and a separate EPIC 7 instruction.

Use the same Sites and Codex chats throughout if useful. Start one writer at a time; do not paste the entire pack into an implementation chat. The letter suffixes below are handoff stages within the six existing tasks, not new epic task IDs.

### Before the first prompt — Dimi

1. Give both chats the actual repository and the detailed plan. The inspected checkout is `/Users/dimi/Projects/funkspace-app`, branch `feature/funkspace-minimum-usable`, planning HEAD `878b7da8beef805d65d5a33ea0150aef595aadab`.
2. The detailed plan was still an untracked local file when this pack was prepared. A GitHub checkout alone does not contain it. A separate Sites session needs the complete plan and the current source/diff artifact, or access to this actual workspace. Do not publish or commit merely to share context without deciding that action.
3. Pass each completed handoff to the next owner: candidate SHA plus intentional patch/hash, changed files, commands/results, findings and remaining limits. A branch name alone is insufficient when local changes exist.
4. Use the public URL `https://funkspace.de/` as the planning default; confirm the actual Vercel project/domain at release preparation. Keep credentials in the provider interface.

Sites prompts below concern the existing repository application. If Sites cannot access or edit that source, it must report the limitation; a separate generated Site is not a substitute. Dimi may explicitly reassign a bounded task to Codex with the same acceptance criteria.

### Run order

| Task   | Prompts in order                                                        | Result before proceeding                                       |
| ------ | ----------------------------------------------------------------------- | -------------------------------------------------------------- |
| FS-6.1 | 6.1A Sites → 6.1B Codex                                                 | Candidate report; required checks passed or blockers assigned  |
| FS-6.2 | 6.2A Sites → 6.2B Codex, then Dimi observations in the same chat        | Human matrix with actual evidence and findings                 |
| FS-6.3 | 6.3A Codex → 6.3B Sites only if assigned UI findings exist → 6.3C Codex | Reviewed corrected candidate; no unresolved release blocker    |
| FS-6.4 | 6.4A Sites → 6.4B Codex → 6.4C Codex after Git-delivery approval        | Real PR/current CI and a concrete release authorization packet |
| FS-6.5 | 6.5A Codex after release approval → 6.5B Sites → Dimi final acceptance  | Verified public release and Thursday presentation freeze       |
| FS-6.6 | 6.6A Sites → 6.6B Codex                                                 | Website closure, actual FS-G3 decision and game handoff        |

**Early correction loop:** If FS-6.1 finds a blocking dependency, build, CI or UI defect, use the applicable 6.3 correction prompts immediately, then resume 6.1B. Do not spend a full certification pass on a known unusable candidate or ask Dimi to test it first. This early loop does not close FS-6.3; final closure follows the human findings too. Reuse valid evidence for unchanged inputs instead of repeating whole suites without a reason.

All prompts require the final report sections: **files changed; main decisions; validation performed; remaining risks or follow-up work**. Put detailed source/command/evidence records in the named task document or a portable handoff. PASS, FAIL, warning, blocked and reused evidence must remain distinct. No agent can manufacture Dimi's acceptance.

## FS-6.1 — Automated, security and architecture review

### 6.1A — Sites: focused UI evidence

**Dimi before sending:** Supply the current plan/source and intentional diff. This is a focused review; send its result to Codex next. No design decision or new live email is needed to begin.

```text
Perform the Sites counterpart review for FunkSpace FS-6.1 only.

Use the actual DitmarF/funkspace-app repository. Verify workspace, branch, full HEAD and
intentional diff. Read AGENTS.md, docs/features/FunkSpace_EPIC_6_Detailed_Plan.md, the
authoritative portfolio plan and current scene/contact closure records. Planning
reference 878b7da is not a reset target. If source or the detailed plan is unavailable,
identify the missing artifact; do not recreate the app as another Site.

Inspect the implemented /, /about, /animations/aperture, /contact, /privacy and
/impressum journeys, navigation/focus, overlays, themes, motion/Pause, responsive layout
and static alternatives. Preserve accepted scene settings, dedicated Contact and the
frozen contact contract. Identify draft metadata, broken links and missing acceptance
evidence without reopening completed epics.

Run only relevant existing UI/interaction/accessibility checks that can be executed
safely. Before running servers, inspect known tooling-security constraints; do not
expose vulnerable development servers. Use isolated source without .env files or
inherited mail credentials, CONTACT_ENABLED=false, blank mail settings, inspected
transport denial, fakes and fresh non-reused servers. Do not run routine tests against a
possibly live preview. If safe execution is unavailable, provide the source review and
explicit unrun checks.

Return a portable handoff with source/diff identity, checked routes/states, exact
commands/results, bounded finding IDs/severity/owner and human evidence still needed.
Codex will incorporate it into docs/tasks/fs-6.1-release-candidate-review.md. Do not
edit runtime code, fix findings, commit, push, publish, change settings, send mail or
start the next task. Report exactly these sections in order: files changed; main
decisions; validation performed; remaining risks or follow-up work.
```

### 6.1B — Codex: integrated candidate review

**Dimi before sending:** Pass Sites' handoff and the same source/diff. Review the resulting blocker list; Codex runs the commands. If a blocker needs correction, use 6.3A/6.3B and then resume this prompt's task.

```text
Execute FunkSpace FS-6.1 only: establish the current release-candidate report and
integrated quality evidence.

Use /Users/dimi/Projects/funkspace-app, verify actual HEAD/status/diff and preserve
newer work. Read AGENTS.md, docs/features/FunkSpace_EPIC_6_Detailed_Plan.md, Sites'
focused handoff, package/configuration files and linked closure/security records. Do not
assume untracked documents are present in another checkout. Keep the Thursday-evening
public-site target and accepted EPIC 4/5 scope.

First inspect current remote main/feature ancestry, dependency alerts/advisories, open
proposals and the actual candidate graph. Refresh full and production audits.
Distinguish default-branch alerts, already-remediated feature paths, withdrawn
advisories and actual remaining exposure. Do not reuse the dated alert count as a fresh
inventory. Inspect CI gaps before expensive certification. Assign concrete findings to
Codex or Sites; do not bulk-upgrade, dismiss alerts or modify runtime/dependencies in
this review step. Local isolated test setup and the evidence document are in scope.
Route necessary source/CI/security repairs through the bounded FS-6.3 correction loop,
then resume here.

Prepare isolated candidate snapshots without .env files or inherited secrets; delivery
false, blank mail credentials/identities, exact test origins, telemetry off, inspected
transport-denying guard, fakes, fresh servers and preserved per-candidate output.
Provision browsers during setup. Do not reuse an existing development/live server.

Run the detailed plan section 5.3 matrix in order: freshness, strict types/lint, broad
coverage, explicit theme/contact coverage, production/Storybook builds,
production-route/theme/contact/Storybook checks, separate compiled ON/OFF variants with
matching expectations, serial performance measurements, standalone game checks and
independent architecture/server-only/lifecycle review. Preserve thresholds. Reuse
unchanged evidence with justification; do not duplicate identical full suites. Report a
check as blocked when its prerequisites fail.

Create/update docs/tasks/fs-6.1-release-candidate-review.md with exact source/tree/diff,
tool versions, commands, outcomes, artifact references, findings and unverified
device/provider areas. State READY FOR FS-6.2 or the named blockers; a complete report
is not release approval. No commit/push/PR/merge/deployment/settings/DNS/mail
activation/live email/game implementation. Stop at this handoff and report exactly these
sections in order: files changed; main decisions; validation performed; remaining risks
or follow-up work.
```

## FS-6.2 — Human acceptance

### 6.2A — Sites: short interaction checklist

**Dimi before sending:** Supply the current FS-6.1 report/candidate and identify available phone and desktop browsers. Exact versions can be recorded when testing. Sites prepares the checklist; it does not certify your devices.

```text
Prepare the Sites counterpart checklist for FunkSpace FS-6.2 only.

Verify access to the actual DitmarF/funkspace-app candidate, full source/diff and
docs/features/FunkSpace_EPIC_6_Detailed_Plan.md. Read AGENTS.md and the FS-6.1 report.
Missing source/plan access is a limitation to report, not permission to build another
Site.

Turn H01-H10 in section 6 of the detailed plan into a short practical checklist for
Dimi. Keep each item to setup, action and visible expected result. Cover
direct/refresh/Back navigation and arrival focus; phone portrait/short/landscape and
virtual keyboard; 200% text; desktop keyboard/Escape/focus restoration; all four
themes/System/storage failure; System/On/Reduced/Off and Pause; repeated overlays;
contact validation/error/retry/reset behavior; and real-route static/no-JS/email
fallback.

Clearly distinguish actual page checks from controlled contact fixtures. Contact
error/accepted/timeout/429/duplicate cases use safe fakes, not real mail. Do not ask
Dimi to run shell commands or wait 23 hours; Codex supplies existing controlled fixtures
for those states. H11 Production mail and H12 the presentation device remain later
FS-6.5 checks. Desktop emulation is not a phone test, and WebKit is not physical iPhone
evidence.

Return the checklist with its candidate identity and any missing fixture/access
requirements for Codex to incorporate into docs/tasks/fs-6.2-human-acceptance.md. Do not
fabricate observations, edit runtime code, run live submissions, commit/push/publish,
change settings or continue into corrections. Report exactly these sections in order:
files changed; main decisions; validation performed; remaining risks or follow-up work.
```

### 6.2B — Codex: prepare the candidate and record Dimi's results

**Dimi before sending:** Pass the checklist. After Codex supplies the safe URL/fixtures, perform the checks and reply with device/OS/browser versions plus each row's result and any failure. Do not submit a real form message during this stage.

```text
Execute the Codex support work for FunkSpace FS-6.2 only. Dimi is the human acceptance
lead.

Use the actual repository; read AGENTS.md,
docs/features/FunkSpace_EPIC_6_Detailed_Plan.md, the current FS-6.1 report and Sites'
checklist. Verify the complete source/diff identity and readiness. Preserve newer work;
do not treat a historical SHA as a reset target. If a known blocker prevents meaningful
testing, identify its FS-6.3 owner instead of asking Dimi to test a broken candidate.

Prepare a reproducible current candidate and the existing controlled contact fixtures.
Keep source isolated, exclude .env/inherited secrets, set delivery false and blank mail
credentials, inspect transport denial, and use fresh servers. Follow
contact-manual-preview.md for any phone-reachable fixture: do not expose a live API,
arbitrary repository directory or unprotected development server. Use existing
authorized access; if a new hosted preview is needed, prepare that exact action for
approval rather than publish automatically. Dimi should not become the command runner.

Create/update docs/tasks/fs-6.2-human-acceptance.md with H01-H10, source/URL, date,
tester, device/OS/browser versions, orientation/text settings, action, expected/actual
result, severity and evidence. Provide the short checklist and clear safe entry points.
Leave unanswered rows unverified. H11/H12 remain explicitly pending FS-6.5.

If observations are not supplied yet, stop with MATRIX READY FOR DIMI. When Dimi replies
in this task, record only those actual observations, clarify material ambiguities, and
return findings for FS-6.3. Preserve historical evidence with its original scope; do not
infer physical-device, screen-reader or numeric performance results. No source fixes,
Git delivery, deployment/settings/DNS change, live mail or automatic next-task
execution. Report exactly these sections in order: files changed; main decisions;
validation performed; remaining risks or follow-up work.
```

## FS-6.3 — Bounded corrections

### 6.3A — Codex: triage and technical corrections

**Dimi before sending:** Supply the latest findings. Identify any experience priorities or cosmetic items you want deferred. This prompt can also handle an early FS-6.1 blocker before human testing. Do not run Sites edits concurrently.

```text
Execute the Codex-owned correction work for FunkSpace FS-6.3 only, including an early
correction loop if FS-6.1 is blocked.

Use the actual repository and verify HEAD/intentional diff. Read AGENTS.md,
docs/features/FunkSpace_EPIC_6_Detailed_Plan.md and current FS-6.1/6.2 evidence where
available. An early correction needs the concrete FS-6.1 finding, not a completed human
matrix. Preserve accepted portfolio/contact/game behavior and all unrelated work.
Missing source or finding evidence is a limitation, not permission to invent findings.

Create/update docs/tasks/fs-6.3-acceptance-findings.md. Give each actual finding an ID,
severity, reproducible evidence, owner, minimal correction and required reruns. Sites
owns UI/scene corrections; Codex owns dependencies, CI, infrastructure, shared policy
and server work. Implement only the concrete open Codex-owned release findings in this
register; if none exist, report that rather than invent work. Return Sites-owned IDs as
a bounded handoff.

For dependencies, inspect current advisories and owning paths, preserve existing scoped
remediation, make the smallest compatible family/lockfile changes and refresh audits. No
bulk upgrades, blanket suppression or alert dismissal. For CI, add the plan's missing
reproducible checks with safe mail-disabled execution, retained artifacts, pinned
actions and preserved thresholds; do not change repository protection settings. Runtime
fixes require meaningful behavioral regression coverage. A necessary major migration or
new architecture requires a concrete separate decision.

Use isolated credential-free, delivery-off, transport-denied application checks and
fresh servers. Run focused tests first, then checks invalidated by the change; record
exact commands/results and new candidate identity. Do not claim a fresh full
certification from focused checks. Keep original failures and evidence visible.

Stop with the technical correction diff, validation and Sites handoff ready for
6.3B/6.3C. An early correction loop does not close final FS-6.3 before human findings
exist. No commit/push/PR/merge/deploy, external settings/DNS, live email or game
implementation. Report exactly these sections in order: files changed; main decisions;
validation performed; remaining risks or follow-up work.
```

### 6.3B — Sites: assigned UI/scene corrections, when needed

**Dimi before sending:** Pass the specific Sites-owned finding IDs and current candidate/patch from Codex. Skip this prompt if no UI/scene correction is required.

```text
Fix only the Sites-owned findings explicitly assigned in the current FunkSpace FS-6.3
register/handoff.

Verify actual repository, branch, full candidate and intentional diff. Read AGENTS.md,
docs/features/FunkSpace_EPIC_6_Detailed_Plan.md and
docs/tasks/fs-6.3-acceptance-findings.md. Confirm source/plan access; do not create a
replacement Site. Preserve Codex's completed corrections and avoid concurrent writes to
shared files.

Reproduce the assigned finding IDs, then apply the smallest UI/scene correction and
appropriate regression coverage. Preserve accepted WEB/settings, navigation/focus/dialog
ownership, ThemeService, motion policy and static alternatives. Preserve the frozen
contact UI/server contract and ordinary-button/feedback behavior. Do not turn the
correction into visual redesign, content expansion or unrelated refactoring. Missing
identity/legal facts require a stated gap, not invented copy.

Run affected UI/interaction/a11y checks on an isolated source copy with no
.env/inherited mail credentials, delivery off, inspected transport denial, fakes and
fresh servers. Do not submit real mail or test against an unknown live preview. State
actual browser/device coverage and checks not run.

Return the exact diff/artifact, source identity, per-ID fix and validation, changed
paths and any remaining risks. Codex owns consolidation into the main findings register
and independent review. Do not modify unrelated findings or mark human acceptance
complete. No commit/push/publish/deployment/settings/DNS/mail activation/live mail/game
work. Stop at the review handoff and report exactly these sections in order: files
changed; main decisions; validation performed; remaining risks or follow-up work.
```

### 6.3C — Codex: review corrections and freeze the candidate

**Dimi before sending:** Pass the completed correction handoffs. Confirm any proposed nonblocking deferrals. If this is an early correction loop, the next step is back to 6.1B, not deployment.

```text
Perform the correction review and candidate consolidation for FunkSpace FS-6.3 only.

Read AGENTS.md, docs/features/FunkSpace_EPIC_6_Detailed_Plan.md, the findings register
and all completed owner handoffs. Verify actual source/diff and same-candidate access;
preserve newer work. Review the changed bytes and regression evidence against each
finding's original behavior and acceptance criterion.

Independently review Sites' changes. Arrange a separate read-only reviewer or subagent
for your own release-critical dependency, server and shared-policy corrections. Label
self-review honestly; it does not replace a required independent pass. If that pass is
unavailable, record its owner and keep release readiness pending. Return material
defects to their original owner in the same bounded loop rather than silently broadening
your edit scope.

Rerun affected checks under the isolated delivery-off/credential-free/transport-denied
setup. Security/runtime/build/shared-policy changes invalidate relevant build, route,
contact, game and performance evidence; reuse unchanged evidence only with
source/toolchain equivalence. Keep assertions, thresholds and historical failures
intact. Do not rerun full suites solely to produce duplicate results.

Update docs/tasks/fs-6.3-acceptance-findings.md and existing FS-6.1/6.2 evidence
references with current candidate identity, dispositions, review/rerun results and named
follow-ups. Do not create an empty human-acceptance record during an early loop. If this
is an early loop, return READY TO RESUME FS-6.1 and keep final FS-6.3 open. After both
technical and human findings are addressed, state READY FOR FS-6.4 only if no release
blocker remains. Do not record Dimi's deferral or acceptance without their actual
decision.

Stop at the reviewed candidate. No commit/push/PR/merge/deploy/settings/DNS/live mail or
game implementation. Report exactly these sections in order: files changed; main
decisions; validation performed; remaining risks or follow-up work.
```

## FS-6.4 — Merge and release preparation

### 6.4A — Sites: final content, links and metadata

**Dimi before sending:** Confirm the intended public URL and any final wording/identity corrections. If wording is not settled, Sites should prepare a minimal reviewable proposal. This stage does not publish it.

```text
Complete the Sites presentation/content work for FunkSpace FS-6.4 only.

Verify the actual repository and current corrected candidate/diff. Read AGENTS.md,
docs/features/FunkSpace_EPIC_6_Detailed_Plan.md, the latest acceptance records and
current content/metadata. If source/plan access is missing, report it; do not create an
unrelated Site.

Check all six public routes, native links, current email, titles/descriptions/icon and
deployment-dependent URLs against the confirmed destination. Inspect the remaining
technical scaffold metadata in frontend/app/layout.tsx and
frontend/data/startContent.ts. Prepare the minimum audience-facing metadata/content
patch using existing approved facts. Implement supplied approved wording; clearly flag
any new proposed wording for Dimi's review. Do not invent operator/legal facts, expand
SEO/content scope or replace accepted copy gratuitously.

Preserve accepted layout, scene, themes, motion, contact behavior and legal-processing
decisions. Apply only bounded final presentation corrections. Run proportionate affected
validation with isolated delivery-off/credential-free/transport-denied setup if
application checks are needed. No real form submission.

Return candidate/diff identity, changed files, final versus proposed wording,
link/metadata checks, validation and remaining decisions for Codex's
docs/tasks/fs-6.4-release-preparation.md. Any runtime/content change must be considered
in the final candidate's affected revalidation. No
commit/push/publish/deployment/settings/DNS/mail activation/live email/game work. Stop
at this handoff and report exactly these sections in order: files changed; main
decisions; validation performed; remaining risks or follow-up work.
```

### 6.4B — Codex: prepare the integration tree and release packet

**Dimi before sending:** Pass Sites' final handoff and wording decisions. Have Vercel/domain/mail account access available for later steps. Codex should finish local preparation before presenting the concrete Git-delivery and release actions for approval.

```text
Prepare FunkSpace FS-6.4's merge-ready candidate and release/recovery packet. This
prompt authorizes reversible local preparation and read-only discovery, not external
mutation.

Verify actual repository/HEAD/diff. Read AGENTS.md,
docs/features/FunkSpace_EPIC_6_Detailed_Plan.md, FS-6.1-6.3 evidence, Sites' final
handoff and contact operating/processing guides. Preserve accepted behavior and newer
work.

Inspect fresh remote main/feature ancestry, unique commits, PRs/rules/checks and
automatic Vercel Preview/Production behavior. Prepare a combined integration tree in an
isolated checkout without committing or publishing it. Preserve main's unique changes
and feature security fixes; resolve conflicts by inspected intent, never wholesale side
selection or history rewrite. Review the complete diff and revalidate affected inputs.
Record source/tree/patch/lockfile identities and any evidence still requiring real PR
CI.

Create/update docs/tasks/fs-6.4-release-preparation.md and
docs/development/portfolio-release.md. Prepare PR title/body; repeatable install/build
settings; exact project/domain/alias/redirect inventory; Production versus Preview
configuration/origins/protection; accurate final metadata; provider/quota/operating
facts; and a specific known-good rollback/static/mail-off artifact. Preserve the
existing contact runbook as mail authority. Rehearse safe local fallback behavior and
distinguish that from unperformed provider rollback.

Prepare one concrete action packet identifying separately: Git commit/push/PR and
automatic Preview effects; main merge and automatic Production effects; delivery-off
configuration before publication; exact necessary settings/DNS changes; any off-only
no-mail protection probe target/source/window/request budget and recovery check;
conditional mail activation/new deployment; at most one proposed live form message;
named old-enabled-target retirement/restriction; and rollback triggers/actions. Do not
invent target details or ask for credentials in chat.

Finish all available preparation, then present the Git-delivery scope for 6.4C and the
draft later release scope. Explain any genuinely missing decision. No commit, push, PR
creation, merge into main, deployment, settings/DNS change, mail activation or live
email here. Stop with a reviewable packet and report exactly these sections in order:
files changed; main decisions; validation performed; remaining risks or follow-up work.
```

### 6.4C — Codex: approved Git delivery and actual PR evidence

**Dimi before sending:** Review 6.4B's exact diff/tree, destination branch, proposed commit/PR and automatic Preview consequences. Approve those named Git-delivery actions in that chat, then use this prompt. This approval does not include merging `main` or publishing Production.

```text
Execute only the Git-delivery actions Dimi has explicitly approved in the current
FunkSpace FS-6.4 packet, then collect actual PR evidence. If that concrete approval is
absent, show the prepared action summary and stop before mutation; this generic prompt
does not fill in missing targets or approvals.

Read AGENTS.md, docs/features/FunkSpace_EPIC_6_Detailed_Plan.md and
docs/tasks/fs-6.4-release-preparation.md. Recheck workspace, complete intended
diff/tree, source/base, branch destination and automatic Preview effects against the
approved packet. Preserve unrelated/untracked work and do not stage it indiscriminately.
Stop for a material mismatch; do not redo approval for unchanged already-approved
actions.

Perform the approved commit/push/PR creation or update, with the reviewed content and
actual multiline description. Do not merge, force push, delete branches, close bot PRs
or alter repository settings unless an exact additional action was explicitly approved.
A Preview deployment must match the approved consequence and retain
delivery-off/protection requirements. Attach the actual PR to this task where supported.

Collect current-head/base CI and review results, accounting for the fact that repository
protection may not enforce every release gate. Diagnose failures; route source
corrections through the bounded owner loop and update evidence. If inputs change,
refresh the PR review/checks and authorization packet as needed. Do not claim old-head
CI or a feature push is full certification.

Update FS-6.4 with the real PR URL, actual source/tree/base, current checks, any Preview
identity, remaining gaps and the final exact release packet for FS-6.5. Stop before
merge/Production activation/live email. State READY FOR RELEASE DECISION or named
blockers. Report exactly these sections in order: files changed; main decisions;
validation performed; remaining risks or follow-up work.
```

## FS-6.5 — Public rollout and presentation freeze

### 6.5A — Codex: execute the approved release sequence

**Dimi before sending:** Approve the final packet's named candidate/PR/target and individual actions. You can approve the complete conditional sequence in one reply; identify the single live message separately. Be available to check mailbox receipt and the real device. Enter secrets only through the provider interface.

```text
Execute FunkSpace FS-6.5 using only Dimi's concrete release authorization recorded
against the final FS-6.4 packet. This prompt is not blanket permission for unspecified
targets/settings/messages. If approval is missing, present the complete ready packet and
stop before external mutation.

Read AGENTS.md, docs/features/FunkSpace_EPIC_6_Detailed_Plan.md, FS-6.4 and
contact-operations.md. Recheck current PR head/base/checks, reviewed tree,
target/project/aliases, approved settings/message budget and rollback access. Stop for a
material mismatch or failed prerequisite. Preserve accepted EPIC 4/5 behavior and the
Thursday-evening public-site objective.

Execute the already-approved conditional sequence without asking again between unchanged
approved steps:
1. Ensure Production delivery is false before any merge can automatically publish. Apply
   only approved configuration changes through the appropriate secure interface.
2. Perform the approved merge/off deployment. Record actual main SHA, tree,
   build/configuration and immutable/public identities; verify current checks and alias
   attachment.
3. Verify unauthenticated public routes, redirects/assets/metadata,
   navigation/settings/static fallback and truthful disabled Contact. Confirm exact
   origins/protection and recovery artifact.
4. Reuse protection evidence only for unchanged exact scope. If required, perform only
   the approved bounded invalid-body/no-mail probes while delivery remains off,
   including their recovery observation. Never improvise a larger request budget or
   mail-enabled abuse test.
5. Only after gates pass, perform the approved activation/new deployment. Record its new
   identity and repeat affected route/contact/protection checks on that actual artifact.
6. Send at most the separately approved one form message. Record provider/UI acceptance
   separately from Dimi's actual receipt and Reply-To confirmation. An ambiguous attempt
   does not authorize another send; an actual reply email also needs its own approved
   scope. Keep message content, credentials and unnecessary identifiers out of records.
7. Verify relevant aliases/older enabled artifacts, approved retirement actions, runtime
   observations and default-branch alert rescan. Pending rescan stays pending. If a
   release blocker appears, execute the exact approved recovery action; seek a new
   decision only if the necessary action is outside approval.

Create/update docs/tasks/fs-6.5-public-rollout.md and H11 evidence. Give Sites the final
deployed identity for 6.5B and Dimi the H12/presentation checks. Keep their unsupplied
results pending. Email-only or protected-preview fallback needs explicit acceptance as a
reduced outcome; do not call it the full public/form success. No game implementation or
ongoing monitoring automation. Stop at deployed evidence and the remaining acceptance
handoff; report exactly these sections in order: files changed; main decisions;
validation performed; remaining risks or follow-up work.
```

### 6.5B — Sites: final deployed UI smoke

**Dimi before sending:** Pass the final activated deployment ID/source and public URL from Codex. Check the site on your actual phone and presentation device; confirm receipt separately. Give the final go/no-go in the Codex rollout chat after Sites reports.

```text
Perform the Sites post-rollout smoke for FunkSpace FS-6.5 only.

Read the supplied final deployment/source/configuration identity, AGENTS.md,
docs/features/FunkSpace_EPIC_6_Detailed_Plan.md and FS-6.5 handoff. Verify you are
inspecting the named final public artifact, not an older preview or local build. Missing
access/identity is a limitation; do not create or publish a replacement Site.

From a fresh unauthenticated session, check /, /about, /animations/aperture, /contact,
/privacy and /impressum; direct load/refresh/Back, links/current navigation,
focus/Escape/overlay restoration, all themes/System, motion/Pause/static fallback,
typography/metadata and responsive/short-screen/keyboard risks. Use ordinary browsing
and local browser preferences; do not submit the form, send another email, execute WAF
probes or change persistent provider settings. Label emulation versus real devices and
any checks you cannot perform.

Return PASS or prioritized bounded findings with source/deployment, URLs,
browser/viewport, action, expected/actual result and evidence. Report urgent blockers
promptly for Codex's already-approved recovery procedure; do not modify production code
or redeploy yourself. Include the concise H12 checks Dimi still needs on the actual
presentation device/network.

Codex incorporates this handoff and Dimi's actual receipt/device/go-no-go statements
into the rollout record. Do not fabricate those approvals or mark FS-G3 complete. No Git
writes, deployment/settings changes, live mail, game work or automatic next task. Report
exactly these sections in order: files changed; main decisions; validation performed;
remaining risks or follow-up work.
```

**Dimi after the smoke:** In the Codex rollout chat, state whether the named public URL is accepted for the presentation, the actual contact result, H12 device/network observations, and any explicitly accepted reduced mode. Codex should record this in the existing FS-6.5 record. Keep the Thursday evening candidate frozen except for release-blocking recovery.

## FS-6.6 — Website closure and game handoff

### 6.6A — Sites: reusable shell/interface handoff

**Dimi before sending:** Start only after the website is online and its rollout outcome is accepted. Pass the final source/deployment. This is documentation for future game work, not permission to implement the game route.

```text
Prepare Sites' interface handoff for FunkSpace FS-6.6 only, after accepted website
delivery.

Verify the actual final repository/source/diff and deployed identity. Read AGENTS.md,
docs/features/FunkSpace_EPIC_6_Detailed_Plan.md, FS-6.5 acceptance, architecture and the
current game EPIC 7 plan. If the website outcome is not accepted, report the missing
gate and do not start game work.

Inspect existing shell/navigation handoff, Dialog/focus/scroll ownership, theme/motion
providers, scene ports and reusable layout constraints. Return exact source paths/public
interfaces, lifecycle responsibilities, safe reuse and cautions for a future dedicated
portrait play route. Keep homepage particles and global portfolio controls from being
imposed on that layout. Identify available primitives rather than inventing a new
framework or claiming the integration already exists.

Separate accepted website behavior from pending game
instructions/HUD/pause/upgrade/result overlays, focus announcements, deliberate
start/resume, loading/retry/exit and orientation/safe-area work. Preserve existing
contact/scene decisions and list any remaining website issues with their owners.

Return a portable read-only handoff for Codex's
docs/tasks/fs-6.6-portfolio-closure-game-handoff.md. Do not concurrently edit the
closure record, change runtime code, commit/push/publish, send mail or implement
/play/wave-survivor. Stop at the interface inventory and report exactly these sections
in order: files changed; main decisions; validation performed; remaining risks or
follow-up work.
```

### 6.6B — Codex: close the milestone and prepare EPIC 7

**Dimi before sending:** Pass Sites' interface handoff and the final rollout acceptance. State your FS-G3 decision and whether returning to game EPIC 7 is authorized. If you have not decided yet, Codex should prepare the completion evidence and leave that approval pending.

```text
Complete the documentation and verification work for FunkSpace FS-6.6 only. Do not
implement game EPIC 7 in this task, even if its later start is authorized.

Verify actual final repository/source/deployment and intentional diff. Read AGENTS.md,
docs/features/FunkSpace_EPIC_6_Detailed_Plan.md, FS-6.1-6.5 records, Sites' interface
inventory, ADR-003 and the game implementation plan. Require accepted online website
outcome before closure; preserve the distinction between full public/form success and
any explicitly accepted reduced presentation mode.

Create/update docs/tasks/fs-6.6-portfolio-closure-game-handoff.md. Record final
main/tree/lockfile/deployment, actual contact mode/evidence, quality/manual evidence,
recovery guide, residual website/security work and owners. Record Dimi's actual FS-G3
and game-continuation decisions; leave them pending if not supplied. Update the
authoritative portfolio plan and game continuation entry point accurately, without
rewriting historical acceptance or claiming unperformed integration.

Verify the existing public package/loader/theme/lifecycle boundary and standalone
operation. Reuse FS-6.1 game evidence only with unchanged source/toolchain equivalence;
otherwise run the affected package/demo checks safely. Preserve gameplay and independent
execution. Correct the bounded stale games/README.md scaffolding/root-build wording if
still present.

Document that onEvent already exists; current GameHost auto-start/visibility resume and
ignored upgrade/result events are baseline behavior. /play/wave-survivor, type
consolidation/reducedEffects audit, deliberate start/resume, semantic HUD, overlays,
announcements and route cleanup remain EPIC 7 work. React receives discrete events,
never per-frame engine state; no homepage particles forced into play layout.

Stop with a fresh-agent-ready handoff and truthful milestone status. If only Dimi's gate
decision remains, present the evidence for that decision rather than silently marking
complete. No game implementation, deployment/settings changes or live mail. Any external
Git delivery of these documentation changes requires a separately named explicit
authorization. Report exactly these sections in order: files changed; main decisions;
validation performed; remaining risks or follow-up work.
```

## Prompt-pack validation and limits

This pack supplies task instructions, not implementation results. No task records were precreated and no task was marked complete. Source inspection confirmed the planning checkout and the still-local detailed plan. Validation passed: Prettier for both documents, seven local links/anchors across them, six task groups, fourteen prompt blocks with fourteen Dimi instructions, explicit report sections inside every prompt and new-file whitespace checks. Independent read-only reviews covered task sequencing and release/contact authorization; the resulting copyability and independent-review corrections were incorporated. No application checks, Git delivery or deployment were performed.

Start with **6.1A — Sites**, then pass its evidence to **6.1B — Codex**. If Sites source access is unavailable, resolve access or explicitly reassign that bounded review; do not let a tool mismatch silently change the website or skip the acceptance work.
