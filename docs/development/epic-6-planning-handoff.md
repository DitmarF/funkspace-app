# EPIC 6 planning handoff — FunkSpace

Prepared 2026-10-27. This is the common input for planning, Codex technical work,
Sites review and Dimi's acceptance checklist. It gathers existing decisions;
it is not an approved EPIC 6 implementation plan or rollout authorization.
The [authoritative feature plan](../features/funkspace-minimum-usable.md#epic-6--integrated-quality-gates-controlled-rollout-and-game-handoff)
owns task scope, order and gates.
Source records explain decisions; they do not grant new action permission.

## Start here: repository and access

| Item                    | Planning checkpoint                                                                                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actual repository       | `/Users/dimi/Projects/funkspace-app` — [GitHub source](https://github.com/DitmarF/funkspace-app)                                                                                                |
| Branch                  | `feature/funkspace-minimum-usable`                                                                                                                                                              |
| Inspected HEAD          | `07a75a713242a0b6b4d8fde336856b13a8033e44`, `docs: close EPIC 5 contact acceptance`; clean and matching its local remote-tracking ref at inspection                                             |
| Accepted runtime source | `36407f6a790a8d9787bdc3123041e24e181bdfee`; `07a75a7` adds eight closure documents and changes no runtime code                                                                                  |
| Completed work          | EPICs 1–5, FS-G1 and FS-G2. EPIC 4/5 closure remains accepted; EPIC 6/FS-G3 and game integration are not started                                                                                |
| Release target          | Public release is the already selected portfolio goal; Dimi targets Thursday 2026-10-29. Exact target/candidate and rollout actions still need specific authorization; the date waives no check |
| This handoff's changes  | New planning packet, authoritative entry link and two corrected contact guides; local documentation only until separately committed/pushed                                                      |

The receiving chat must confirm actual repository, branch, revision and access to
the intentional diff before planning. Chats do not automatically share working
files. A GitHub checkout of `07a75a7` alone does not include this uncommitted
packet. Supply its complete patch/artifact or use the actual local checkout;
record the containing commit if it is subsequently delivered. Sites must use
the verified repository workspace at the same branch/revision. Missing source
access is a limitation to report, not permission to recreate an unrelated site.
Preserve newer work; these SHAs are reference points, not reset targets.

Read-only starting checks:

```bash
cd /Users/dimi/Projects/funkspace-app
git branch --show-current
git rev-parse HEAD
git status --short
git diff --stat
```

## Read together, in this order

| Purpose                             | Sources                                                                                                                                                                                                                                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rules and boundaries                | [AGENTS](../../AGENTS.md), [architecture](../architecture.md), [AI workflow](ai-workflow.md), [feature-plan template](../templates/feature-plan.md), [task template](../templates/task.md)                                                                                                           |
| Milestone and ownership             | [EPIC 6 and its six tasks](../features/funkspace-minimum-usable.md#epic-6--integrated-quality-gates-controlled-rollout-and-game-handoff), [recorded gates](../features/funkspace-minimum-usable.md#acceptance-criteria-and-gates)                                                                    |
| Accepted scene                      | [EPIC 4 closure](../tasks/fs-4.8-scene-acceptance.md#fs-48-and-epic-4-closure--2026-10-13), [performance/acceptance record](../tasks/fs-4.7-scene-performance-review.md)                                                                                                                             |
| Accepted contact                    | [Detailed contract](../features/FunkSpace_EPIC_5_Detailed_Plan.md#frozen-uiserver-contract), [typed contract](../../frontend/domain/contact/ContactContract.ts), [final acceptance and shutdown](../tasks/fs-5.6-contact-acceptance.md#live-acceptance-safe-shutdown-and-epic-5-closure--2026-10-27) |
| UI and safe fixtures                | [Contact UI](contact-ui.md), [controlled phone preview](contact-manual-preview.md), [recorded phone acceptance](../tasks/fs-5.4-manual-preview.md#dimi-manual-acceptance-and-git-authorization--2026-10-14)                                                                                          |
| Operations and privacy              | [Operating guide](contact-operations.md), [processing/storage facts](contact-processing-facts.md), [mailbox workflow](contact-mailbox-workflow.md), actual [Privacy](../../frontend/app/privacy/page.tsx) and [Impressum](../../frontend/app/impressum/page.tsx)                                     |
| Validation and future game boundary | [Package scripts](../../package.json), [CI](../../.github/workflows/ci.yml), [ADR-003](../decisions/ADR-003-interactive-experience-boundary.md), [standalone game](../../games/README.md)                                                                                                            |

Use current summaries and dated closure records together. Older task paragraphs,
checklists and screenshots can describe the removed homepage Contact section,
old ports or tasks that were pending at that date. Adapt those references to
actual code; do not turn them into new assignments or reopen completed epics.
The [Figma folder](https://www.figma.com/files/folder/490787975) remains the supplied
design reference; this preparation performs no new Figma or visual acceptance.

## Decisions to preserve

| Area                 | Accepted behavior                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Architecture         | Presentation → Application → Domain ← Infrastructure; pure Domain, inward dependencies and composition roots. Credentials/concrete mail adapters stay server-only. No new backend, framework or parallel authority without a justified decision                                                                                                          |
| Homepage/navigation  | Keep Start/About, ordinary scrolling, accepted scene and shared shell. No homepage Contact section or `/#contact`; dedicated `/contact` uses existing header/tree destinations and focus handoff                                                                                                                                                         |
| Scene                | Accepted WEB / Work Sans Black: 286 particles, speed 0.2×, size 0.1×, 100 links, reach 6×, Full field Off, seed `0x46533431`. Preserve complete static alternatives, local Pause and temporary customization. The closure record owns configuration and performance limits                                                                               |
| Theme                | Reuse ThemeService, selected versus resolved theme, System/OS behavior and live selection after failed storage writes. Resolved palettes: Default, Dark, Muted and Dark High Contrast. Appearance key: `theme`                                                                                                                                           |
| Motion               | Reuse provider-owned motion policy, pure `resolveMotionPermission` and consumer lifecycle. Explicit On may override device reduction under the accepted policy; System, Reduced and Off retain their declared alternatives. Availability/readiness/visibility/local Pause remain independent. Key: `funkspace.motion.preference.v1`                      |
| Dialog and rendering | Keep existing focus/scroll ownership and dismissal versus navigation handoff. Canvas/controller owns frame state; React does not. Use existing public scene/game ports and semantic tokens; do not hand-edit generated output                                                                                                                            |
| Contact presentation | English general inquiries; optional Name, required Email/Message. Ordinary Button, internal submitting guard and plain focused feedback. No pending-button presentation, spinner, InlineStatus or compulsory consent checkbox                                                                                                                            |
| Contact failures     | Preserve input and unavailable/rate-limit guidance after edits, synchronous duplicate guards, pending read-only fields, honest uncertainty and explicit accepted reset. Controlled fixtures cover failures/timeouts/retry expiry without real mail                                                                                                       |
| Contact contract     | One JSON POST `/api/contact`; exact string fields `name`, `email`, `message`, `submissionId`, `website`. Trimmed Name ≤100 and Email ≤254, line-ending-normalized/trimmed Message ≤5,000 JavaScript string units; UUID v4 ID, empty accessible-safe trap, streamed 32 KiB, strict UTF-8/shape/injection rules. Exact typed outcomes remain authoritative |
| Mail behavior        | Fixed verified sender `FunkSpace <contact@mail.funkspace.de>`, recipient/public fallback `info@funkspace.de`, subject `FunkSpace contact message`, structured validated Reply-To, deterministic plain text. No tracking, automatic replies or automatic retries                                                                                          |
| Acceptance and retry | Matching 202 means provider acceptance, not receipt. Provider/browser deadlines 8/15 seconds. Deterministic `contact/<submissionId>` key; unchanged manual retry identity below 23 hours, editing creates a new attempt. Draft/key stay in page memory only                                                                                              |
| Delivery gate        | No unconditional source lock remains. Default-off configuration requires exact `CONTACT_ENABLED=true` plus valid origins/credential/identities. Keep delivery disabled during ordinary checks                                                                                                                                                            |
| Legal/processing     | FS-5.5 wording and provider decisions are accepted. Resend terms/DPA including disclosed US processing approved; Ireland sending does not mean EU-only storage. Keep accepted six-month ordinary closed-inquiry cleanup with justified exceptions. Operator's provisional address-free/TLM position remains documented, not a claimed legal exemption    |
| Product scope        | English first. No added analytics, CMS, saved presets, extra scene catalogue, multilingual implementation, gameplay integration or speculative engine work as release cleanup                                                                                                                                                                            |

For exact API behavior read the linked source rather than extending this summary:
[navigation destinations](../../frontend/data/portfolioDestinations.ts),
[navigation handoff](../../frontend/domain/ports/PortfolioNavigationHandoffPort.ts),
[service provider](../../frontend/application/providers/ServiceProvider.tsx),
[motion policy](../../frontend/domain/motion/MotionPolicy.ts),
[Dialog port](../../frontend/domain/ports/DialogBindingPort.ts),
[scene port](../../frontend/domain/ports/ParticleScenePort.ts).

## EPIC 5 proof and final operating state

These are dated 27 October observations, not a fresh account audit in this handoff.

| Evidence                | Result and limit                                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Successful live journey | Source `36407f6`, protected Preview `6N37XmGQ3LDAnWvAwmrmJXFmUizx`. Stable-origin accepted screen and `202/accepted/code:null` log at 16:10:07.70 CET. Dimi separately confirmed actual Workspace receipt, sender and working Reply-To. Raw provider/submission IDs and individual authentication headers were not copied                        |
| Earlier rejection       | An immutable-host attempt returned `403/origin_rejected` before delivery. The configured branch address succeeded; no source/origin-wildcard change was needed                                                                                                                                                                                   |
| Shutdown                | Scoped Preview switch restored false; same-source replacement `BJwbeuR6NUejxG3GDpq3QQHj337q` Ready, host `funkspace-app-frontend-h9uharydb-ditmarfs-projects.vercel.app`. Disabled controls/notice and email fallback verified on immutable and stable Contact pages                                                                             |
| Old enabled target      | `6N37` / host identifier `4twqcqhug` deleted with specific confirmation. Old `/contact` and `/api/contact` both returned platform `404 DEPLOYMENT_NOT_FOUND`; no key revocation or extra mail was needed                                                                                                                                         |
| Protection              | Require Log In/(Legacy) Standard Protection observed. Initial off Preview's branch/immutable page/API GETs required SSO. WAF POST `/api/contact`, five/IP/600-second fixed window/429: observed branch enforcement and reset recovery. Regional, shared-IP, distributed-abuse and other-alias/path limits remain disclosed                       |
| Automated evidence      | Exact runtime candidate: 294 Node contact tests, 64 UI tests, 42 Chromium cases, types, affected lint and build passed with isolated snapshots/false switch/blank credentials/fakes/egress denial. Earlier 11-case controlled-preview and phone acceptance retain their historical scope; these are not a new complete-site/device certification |
| Production and DNS      | Last observed Production is the older `main` / `31abe42` deployment, not the accepted portfolio branch. DMARC remains unpublished. New handoff work changes neither; release must verify its actual intended target                                                                                                                              |

Configured test entry point:
[stable branch Contact](https://funkspace-app-frontend-git-feature-fun-606557-ditmarfs-projects.vercel.app/contact).
Last verified disabled reference:
[immutable off Contact](https://funkspace-app-frontend-h9uharydb-ditmarfs-projects.vercel.app/contact).
An immutable URL is not automatically an allowed form Origin. Do not infer trust
from Host or wildcard preview domains; direct clients can forge Origin.

Branch pushes may advance the stable alias automatically. The later closure
commit `07a75a7` is not proof that a particular deployed Preview was rebuilt from
it. Recheck source/revision and returned immutable identity before future
execution. A new false deployment/alias does not disable old enabled immutable
versions; inventory and retire/restrict them in the rollout/rollback plan.

## EPIC 6 planning sequence and outputs

Keep the six existing IDs and owners. Plan one integrated candidate pass, reuse
valid unchanged evidence, assign bounded findings to their owners and rerun
affected checks after corrections. Do not repeat the completed live contact test
or request settled provider/legal/phone approvals merely to start planning.

| Task   | Lead / counterpart                                   | Planning output                                                                                                                                                                                |
| ------ | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FS-6.1 | Codex / Sites focused UI evidence first              | Exact candidate/tool versions; ordered automation/architecture matrix; explicit contact-layer coverage; pass/fail and baseline limitations                                                     |
| FS-6.2 | Dimi / Sites checklist, Codex reproducible candidate | Short human matrix with revision, actual device/OS/browser/version, orientation/text settings, action, expected/actual result and severity; label reused evidence and unknown details honestly |
| FS-6.3 | Codex coordination / original implementation owner   | Prioritized bounded findings; Sites UI/scene corrections, Codex server/infrastructure/policy corrections; no concurrent edits to shared files or unrelated framework upgrade                   |
| FS-6.4 | Codex / Sites content, metadata and fallback review  | Reproducible candidate, exact public/preview target, configuration/protection/origin inventory and rollback/disable procedure                                                                  |
| FS-6.5 | Codex / Sites smoke check, Dimi account actions      | Separately authorized rollout to the named target; deployed checks and explicit rollback criteria. Any new live email needs its own bounded authorization                                      |
| FS-6.6 | Codex / Sites interfaces, Dimi FS-G3 decision        | Milestone closure and Wave Survivor EPIC 7 handoff; verify standalone/public-port boundary without integrating the game                                                                        |

Focused human journeys: direct/refresh/Back navigation and arrival focus; phone
portrait/short/landscape and enlarged text; theme/System behavior; keyboard,
Escape and focus restoration in menus/dialogs; scrolling/virtual keyboard;
System/On/Reduced/Off, Pause, visibility and no-JS/static fallbacks; controlled
contact outcomes, duplicate guards, announcements, retry/edit/expiry and email
fallback. Desktop Chromium or simulated WebKit does not establish physical-phone
or Safari acceptance. Prior acceptance stays valid with its recorded detail limits.

## Validation inputs for the plan — not commands to run now

`.nvmrc` pins Node 22.22.0; the package manager is pnpm 10.30.3. Inspect current
scripts/configuration again when selecting the actual execution candidate.

| Purpose                               | Existing command/reference                                                                                                                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reproducible install                  | `pnpm install --frozen-lockfile`                                                                                                                                                                              |
| Lint/format                           | `pnpm lint`                                                                                                                                                                                                   |
| Strict types                          | `pnpm -F frontend exec tsc --noEmit --incremental false`; `pnpm typecheck:validation`                                                                                                                         |
| Broad unit coverage                   | `pnpm coverage`; avoid also running identical `pnpm test` merely to duplicate evidence                                                                                                                        |
| Theme bootstrap contract              | `pnpm test:theme-bootstrap`                                                                                                                                                                                   |
| Explicit contact Node coverage        | `pnpm exec vitest run --config vitest.contact.config.ts --coverage`                                                                                                                                           |
| Production and visual bundles         | `pnpm build`; `pnpm storybook:build`                                                                                                                                                                          |
| Production-route/theme browser checks | `pnpm e2e:production`; `pnpm e2e:theme-bootstrap` under the safe isolated launcher                                                                                                                            |
| Contact browser checks                | `CONTACT_E2E_WORKSPACE=/absolute/isolated-candidate PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config playwright.contact.config.ts`                                                               |
| Controlled static form fixture        | `CONTACT_STORYBOOK_DIR=/absolute/static-build PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config playwright.contact-manual.config.ts`                                                              |
| Performance variants                  | `pnpm lhci:ci`; inspect both animation builds and the accepted budgets/warnings before planning results                                                                                                       |
| Standalone game boundary              | `pnpm -F @funkspace/wave-survivor typecheck`; `pnpm -F @funkspace/wave-survivor test`; `pnpm -F @funkspace/wave-survivor build` as separate package commands when the assigned FS-6.1/6.6 check requires them |

**Safety is part of the planned setup:** fresh snapshots at the actual candidate,
no copied `.env*` files or inherited mail secrets, false contact switch, blank
mail configuration, telemetry off and an inspected transport-denying preloader
with recorded absence of unexpected egress. Use injected provider fakes and
controlled browser responses. Never use a possibly live development/Preview
server or send real mail in routine tests. Preserve the snapshot, source hash,
guard and exact command/result evidence; a preloader file merely existing does
not prove its contents or coverage. Do not restart a local app under unknown
configuration to execute tests.

Broad coverage excludes Domain/Application/Infrastructure; the explicit Node
contact suite is necessary. `playwright.contact.config.ts` requires a fresh,
non-reused server; generic production E2E prevents reuse but does not by itself
blank secrets or install the egress guard. Broad `pnpm e2e` can reuse a local
server outside CI. The CI workflow triggers on `main` pushes/PRs targeting main
and lacks the explicit contact-coverage command. A feature push is not whole-CI
evidence. Plan these gaps honestly in FS-6.1; this handoff changes no CI scripts.

## Remaining release decisions and bounded follow-ups

- Pin the intended public target, candidate and branch/merge path. Do not infer
  PR/merge state from old Vercel labels, or promote the existing older Production
  build as the accepted portfolio. Verify final metadata/URLs against the target.
- For the authorized release, inventory default/custom/older aliases and actual
  origin/protection/WAF/bypass scopes. Reuse the accepted branch evidence without
  relabelling it a new global test. Keep regional/shared-network/distributed quota
  limitations and provider quota recovery/false-switch operation explicit.
- Environment names: `CONTACT_ENABLED`, `RESEND_API_KEY`, `CONTACT_FROM`,
  `CONTACT_TO`, `CONTACT_ALLOWED_ORIGINS`. Production scopes and any enabling need
  specific approval and secure provider entry. Never put secret values in a prompt.
- Preserve FS-5.5 acceptance while recording unresolved operator/address/TLM and
  platform logging/access/export/retention facts for Dimi's public-release review.
  Verify any changed facts; do not invent legal conclusions or reopen approved
  provider terms/DPA decisions. The proposed mailbox labels/Tasks workflow is
  not evidence that the six-month policy is automated or already adopted.
- Historical raw phone/device/performance details remain limited. Accepted LCP
  budget is 5 seconds and CLS 0.1; the On performance-score result was a warning.
  Fresh whole-site measurements must identify candidate, mode and environment.
  Changing an animation environment value after build does not test a new build.
- The earlier root-route Server Action identifier warning has an unverified
  cause. GitHub's push notice reported 38 default-branch dependency alerts. Neither
  is a fresh diagnosis of this feature candidate. Triage current evidence and
  lockfile in FS-6.1/6.3; no speculative fix, automatic upgrade or new scan here.

## Ready-to-copy planning handoffs

### Codex — prepare the detailed EPIC 6 plan only

```text
Prepare FunkSpace EPIC 6 planning only. Use /Users/dimi/Projects/funkspace-app,
branch feature/funkspace-minimum-usable; handoff baseline is commit
07a75a713242a0b6b4d8fde336856b13a8033e44. Inspect actual HEAD/status and preserve
newer work. Confirm access to this repository, this planning packet and its
intentional local diff/artifact; chats do not automatically share working files.

Read AGENTS.md, docs/development/epic-6-planning-handoff.md and its ordered source
links together. Use the authoritative EPIC 6 scope and existing feature/task
templates. EPICs 4–5 are closed and FS-G2 is satisfied. Save a proposed detailed
plan at docs/features/FunkSpace_EPIC_6_Detailed_Plan.md; this path is proposed,
not an existing approved plan. Preserve FS-6.1 through FS-6.6, owners and gates.

Plan the smallest integrated automation/architecture pass, a concise human
matrix, bounded owner-assigned corrections, named release/rollback steps and
EPIC 7 handoff. Reuse accepted unchanged evidence and disclose missing detail.
Separate actual facts, candidate-dependent checks and Dimi's material decisions.
Make each task's artifact, exact test setup, completion evidence and authorization
boundary clear. Routine contact checks must be isolated, off, credential-free
and protected against unexpected provider egress; no further live mail is implied.

Do not implement, run the EPIC 6 suite, change source/contracts, reopen completed
epics, auto-upgrade dependencies, commit, push, merge, deploy, enable delivery,
publish DMARC or change external settings. Report files changed, main decisions,
validation performed and remaining risks or follow-up work. Stop at a reviewable
planning candidate with accessible diff and actual base revision.
```

### Sites — read-only review of the planning candidate

```text
Review the actual FunkSpace EPIC 6 planning candidate read-only. Confirm actual
repository/workspace, branch, revision and intentional plan-diff access first;
baseline 07a75a713242a0b6b4d8fde336856b13a8033e44 is a reference, not a reset target.
If source or the proposed plan is unavailable, identify the missing input rather
than recreate FunkSpace. Read AGENTS.md, docs/development/epic-6-planning-handoff.md,
the authoritative feature plan and the supplied detailed EPIC 6 plan together.

Check preservation of accepted scene/navigation/theme/motion/contact decisions,
task IDs/ownership, realistic UI/manual criteria, safe controlled form tests,
evidence reuse and rollout/rollback boundaries. Identify conflicts before work;
do not redefine contracts or imply new device/design/live-mail acceptance.
Return PASS or prioritized actionable findings with inspected revision, exact
references and unverified human criteria. No edits, builds, deployment, settings
changes or live email. This is plan review, not permission to start FS-6.1.
```

### Dimi — decisions needed from the planning review

Keep the already selected public-release goal. Confirm the exact public domain,
candidate, branch/merge path and device/browser coverage, review a short list of
real blockers versus deferred improvements, and resolve only materially
missing public-release facts. Existing scene, phone, contact, provider and legal
copy acceptance remain recorded. Later approve the concrete rollout sequence
once source, target, settings, live-message count if any and rollback are named;
bundle that foreseeable sequence instead of repeating the same approvals.

This preparation grants no new Git delivery, merge, deployment, account/DNS/
firewall change, mail, Production enabling or DMARC authorization. EPIC 6 work
starts only under its next explicit task; a planning packet is not execution.
