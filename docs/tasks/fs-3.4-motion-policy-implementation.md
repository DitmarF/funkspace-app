# FS-3.4 — Shared decorative-motion policy implementation

## Status, ownership and approval evidence — 2026-09-27

**Status: Complete — Dimi accepted and closed FS-3.4 after independent re-review.**
Author and sole writer: Codex. Consumer reviewer: a separate Sites review agent.
Critical-diff reviewer: a separate fresh Codex agent. FS-G1 remains pending.

Base `3fca725459825644fe9286594c98e94644bc10e4`, branch
`feature/funkspace-minimum-usable`. Before edits, only the two existing proposal
documents were changed/untracked; they were preserved. No reset, branch change,
commit, push, PR, deployment or external configuration was performed.

The exact [revision-1 contract](fs-3.4-motion-policy-contract.md) was verified
against the proposal patch SHA-256
`784f68e26a812a4d76d2440223f0100b95eeb94882703702da0ce8a0d9302e9d`, both document
hashes and all 22 recorded source hashes. The accepted FS-3.3 service/provider
base therefore still matched the reviewed source. Dependencies FS-0.5 and
FS-2.6 were inspected along with root AGENTS, AI workflow, task template,
architecture, feature plan and the supplied detailed plan section 4 / M1–M6.

The prior Sites consuming-contract review returned **PASS**, with no required
contract revisions, for that exact proposal. It ran 28 baseline tests and
declaration/hash checks; those were not implementation validation. That review
was a read-only role review in the same conversation, not an independent
implemented-code review.

Dimi subsequently requested implementation and explicitly stated:

> I approve the final proposal.

This approves the five proposal choices: System/Reduced/Off with complete static
Reduced/Off; static pending and ready-static unavailable capability; hard
production flag with controlled fixture overrides; consumer-local Pause and
no environment-commanded replay; and the single validated persistence key.
It also supplies implementation authorization. It is not device acceptance,
approval of a nominated animated logo, scene scheduling evidence or FS-G1.
Historical pending language in the unchanged proposal describes its earlier
state and is superseded by this approval record.

## Delivered scope and contract

- Domain `MotionPolicy.ts`: one preference union/key/metadata/validator, stable
  snapshot types, independent consumer inputs, all blockers in defined order,
  pure preparation/run permission and presentation resolution. No clock or DOM.
- Application `MotionPolicyService.ts`: one live preference authority, immediate
  subscriptions, immutable snapshots, storage seed once, best-effort persistence,
  safe reentrant notification and activation identity guarding late callbacks.
- `MotionEnvironmentPort` and `BrowserMotionEnvironment`: plain environment
  observations, media-query modern/legacy and document visibility listeners,
  conservative capability failures, partial-acquisition cleanup and idempotent
  release. Construction performs no browser effects.
- Existing `createServices` and `ServiceProvider`: one service per tree, setup
  in the existing effect, restartable release for Strict Mode, narrowed consumer
  context without initialize/dispose. Availability reads the existing build
  flag; no new setting, provider stack or global singleton.
- Real-API fixture and domain/service/adapter/provider tests: two fake consumers
  share preference while retaining independent Pause, visibility, runtime and
  completed history. Fakes allocate no renderer or timers.

The provider exposes `motionPolicy` (getSnapshot/subscribe/setPreference) and
readonly `decorativeMotionAvailable`. Internally `OwnedServices` retains the
authority's initialize/dispose methods for its lifecycle owner. Release retains
preference/subscriptions but returns to pending static state; dispose is
terminal. Individual consumers unsubscribe only. No API changes were made to
ThemeService, storage, navigation, logo or animation runtime.

## M1–M6 evidence map

| ID  | Automated evidence                                                                                                                                                                                                      |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M1  | Inert construction/subscription, stable pending snapshot, SSR/first-client snapshot equality, unresolved fake consumers never prepare/run; failed environment settles ready/static.                                     |
| M2  | Exhaustive 5,760 combinations: 3 authority states × 3 preferences × 4 OS states × 5 independent booleans × 5 runtime states; exact blockers, run/preparation gates and presentation precedence.                         |
| M3  | Missing/invalid/denied storage, failed writes with fresh subscribers and reinitialization, early/reentrant choice wins, invalid setters, unavailable capability and safe blocked reload.                                |
| M4  | Two consumer fakes and two provider trees, shared preference within an authority and isolated preference across trees; consumer removal does not release shared resources.                                              |
| M5  | Pre-ready Pause; hide/show, preference/availability changes and five real theme changes preserve Pause; explicit resume can prepare; completion never replays on permission changes.                                    |
| M6  | Repeat initialize/release/dispose, Strict Mode, modern/legacy listener ownership, late old callbacks/releases, initialization disposal, independent/unsubscribed callbacks, reentrant notifications, terminal disposal. |

## FS-3.5 / FS-4.5 consuming handoff

Use [the executable fixture](../../frontend/application/motion/MotionPolicy.fixture.ts)
with [its transition tests](../../frontend/application/motion/MotionPolicy.fixture.test.ts)
as the bounded real-API example. It is test-only and is not imported by production.

Settings in FS-3.5 should subscribe to `motionPolicy`, render selection from
`snapshot.preference`, and send validated choices to `setPreference`. Alias the
existing MotionChoices union to the domain type when wiring it; do not create a
second state authority. Pending choices remain disabled. Failed writes retain
live selection without a saved/persisted-success claim.

Logo/scene consumers pass readonly build availability, local opt-in/visibility/
Pause/runtime state to `resolveMotionPermission`. Controlled test composition
may inject availability true but the same resolver retains every other gate.
Production `enabled=true` cannot bypass the flag during FS-3.5 migration.
Permission is not playback intent; completion/cursor/direction stay local.
Readiness-guarded story controls must support explicit resume before preparation.
The approved contract's complete public-logo method table remains binding.

FS-3.5 owns the actual logo binding/visibility migration, permitted paused seek,
autoplay and public methods, full SVG error/static assertions and nominated-logo
acceptance. FS-4.5 owns future scene consumption. This task provides no production
scene, Canvas loop, registry, scheduler, game-clock coupling, production settings
or logo enablement. Fakes prove policy decisions, not frame cancellation or
actual scene scheduling correctness.

## Validation and independent reviews

### Author validation

```bash
pnpm exec vitest run frontend/domain/motion frontend/application/motion frontend/infrastructure/motion/BrowserMotionEnvironment.test.ts frontend/application/providers/MotionPolicy.integration.test.tsx
# PASS: 45 tests / 5 files; includes 5,760 matrix combinations.
pnpm test
# PASS: 1,526 tests / 105 files; bootstrap freshness included.
pnpm -F frontend exec tsc --noEmit --incremental false
# PASS.
pnpm lint
# PASS: ESLint, bootstrap freshness, repository formatting.
pnpm build
# PASS: tokens/common/game/frontend production build; no generated source drift.
pnpm storybook:build
# PASS: existing bundle-size warnings only.
PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs34-browser.config.cjs
# PASS: 53 production Chromium cases, one run, zero retries.
git diff --check
# PASS.
```

The temporary browser configuration uses the actual production build on local
port 3144, one Chromium worker, and these existing suites: appearance (8),
navigation composition (18), query-removal handoff (8), theme bootstrap (19).
They protect five-theme behavior, reload/blocked storage, early paint/no-flash,
static JavaScript-disabled content and navigation focus/scroll. They do not
establish browser behavior of a future motion renderer. No Firefox/Safari,
physical-device or assistive-technology run was made for FS-3.4. No new visual
layout or per-frame work was introduced, so no new Lighthouse baseline is claimed.

The first type check found a widened string in a new test mock's environment
return. Adding the port's explicit function type resolved it; the final type
check passed. Runtime scope did not change. The initial author candidate passed
40 focused tests and 1,521 full-suite tests before independent review found the
exception-path gaps below; those earlier green runs did not prove their absence.

### Independent Sites implemented-API review

Separate agent `/root/sites_api_review`, read-only. Initial consuming-API verdict
PASS after **61 tests / 7 files** (new policy suites plus actual LogoMotion and
PortfolioNavigation baselines). After the critical review corrections, Sites
re-reviewed the revised service/provider and reran **45 tests / 5 files: PASS**.
No blocking compatibility findings; actual LogoMotion public-method migration,
controlled story overrides and rendering/scheduling remain FS-3.5 obligations.

### Separate fresh critical-diff review

Fresh agent `/root/critical_diff_review`, read-only and separate from author and
Sites. Its first review found two **P2** defects, owned and fixed by Codex:

1. A subscriber exception while initialization published stored preference or
   ready state left the activation latched, or resources attached without a
   returned cleanup. Initialization now rolls back that activation, retains the
   original exception and permits retry. Regressions cover both notification
   phases, stale callbacks and balanced acquisition/release.
2. A motion setup/cleanup exception could strand theme/navigation cleanup.
   Provider setup now rolls back siblings on failure, and cleanup attempts every
   sibling even if one throws, preserving the first error. Actual React tests
   verify failed setup and teardown release all three services.

The independent re-review returned **PASS; both P2 findings resolved**, ran
**45 tests / 5 files**, independently repeated the failure probes, and checked
diff whitespace. No remaining blocking runtime findings. Both reviewers verified
these final critical-file SHA-256 hashes:

```text
6f204a5b267383f0480e4165edbe015ead8245f6c52ec44a44efd9d66ac27c29  frontend/application/motion/MotionPolicyService.ts
4510be8950f59a76d326c57b7ee18f0a222f178d6a04c41774770acb4afe77ec  frontend/application/providers/ServiceProvider.tsx
bf33484459f208b43c58682fbfc39f45ecde783be6c2864f720c1e9d355652cd  frontend/application/motion/MotionPolicyService.test.ts
2b4303e7a089ca62067e56689f0188842628c75bda22538dfee69aa1b7c83670  frontend/application/providers/MotionPolicy.integration.test.tsx
```

Author cleanup checks are separate: unchanged production MotionChoices/logo,
theme/bootstrap/navigation sources and generated tokens; no extra preferences,
provider stack, listeners at construction or game imports; no runtime registry,
timer or renderer in the policy/fakes. Documentation-only reconciliation after
review does not change the reviewers' runtime hashes.

### Exact candidate and file inventory

Local artifacts are under
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.4-implementation/`.
`candidate.patch` includes all tracked and untracked candidate files against
base `3fca725459825644fe9286594c98e94644bc10e4`; `manifest.json` identifies its
SHA-256, every file hash, reviewed runtime hashes, approval provenance, commands
and limitations. Logs and the temporary browser configuration are retained
there. Verify local access and hashes before reuse; do not assume another host
has these artifacts. The original revision-1 proposal artifact remains intact.

Implementation paths: `frontend/domain/motion/MotionPolicy.ts` and its test;
`frontend/domain/ports/MotionEnvironmentPort.ts`;
`frontend/application/motion/MotionPolicyService.ts` and its test;
`frontend/application/motion/MotionPolicy.fixture.ts` and its test;
`frontend/infrastructure/motion/BrowserMotionEnvironment.ts` and its test;
`frontend/application/providers/ServiceProvider.tsx` and new
`MotionPolicy.integration.test.tsx`; `frontend/infrastructure/services/createServices.ts`.
Documentation: this record, `docs/architecture.md`, the authoritative feature
plan, and the preserved already-reviewed `fs-3.4-motion-policy-contract.md`.
There are 16 candidate files including the existing proposal. Its contents were
not rewritten after approval.

## Remaining acceptance

Dimi has approved policy semantics; no new physical-device observation has been
supplied. Both implemented-code reviews are complete with findings resolved.
Sites receives the reconciled API, tests and exact candidate for separately
authorized FS-3.5 and FS-4.5 work. Production
logo/settings and actual scene tests remain their later tasks. No commit, push,
next-task implementation or FS-G1 approval is included in this handoff.

## Subsequent independent audit and subscriber-isolation correction — 2026-09-27

The later user-requested fresh review of candidate
`622da64071f831efee803bd7dd943709e0bf2793fbe6b36384daef9286a7acf2` superseded its
earlier PASS with one **P2, owner Codex**: a throwing subscriber aborted delivery
to later consumers. The authority could be Off or disposed while another
consumer retained System/ready and permission to run. Reselecting Off did not
repair an unchanged value. The reviewer independently ran 118 tests / 11 files
and six additional successful edge probes, then reproduced preference/disposal
failure with the actual fixture. Existing green tests did not cover that defect.

Dimi requested the correction and regressions. The author added six tests first:
Off, Reduced, unavailable OS capability, release, disposal, and nested
Reduced-to-Off delivery with exceptions. All six failed on the previous runtime;
19 existing service tests passed. The corrected `notify` records the first
exception, continues to remaining registered subscribers, abandons the old
delivery if a nested update changes the snapshot, and then rethrows that first
exception. Errors are not swallowed and same-value notification behavior is
unchanged. Disposal still clears subscriptions after every eligible consumer
has received the terminal snapshot. No public signature or approved policy
semantics changed; no production consumer was integrated.

The tests assert two real consumer fixtures receive the exact authoritative
snapshot and lose permission to run despite two earlier failing listeners.
Local Pause remains independent. They also verify first-error identity,
idempotent cleanup, ignored late callbacks, and no superseded Reduced delivery
after a nested Off update. Earlier unsubscribe-during-delivery and provider
setup/cleanup regressions remain in the focused suite.

Author evidence:

```bash
pnpm exec vitest run frontend/application/motion/MotionPolicyService.test.ts --coverage.enabled=false
# Before fix: 6 new failures, 19 existing tests passed.
pnpm exec vitest run --coverage.enabled=false frontend/domain/motion frontend/application/motion frontend/infrastructure/motion/BrowserMotionEnvironment.test.ts frontend/application/providers/MotionPolicy.integration.test.tsx frontend/application/theme/ThemeService.test.ts frontend/infrastructure/theme/themeBootstrap.test.ts frontend/application/providers/ThemeBootstrapScript.test.tsx frontend/components/ThemeSwitcher.integration.test.tsx frontend/features/games/theme/FunkSpaceGameThemeAdapter.test.ts frontend/infrastructure/dom/PortfolioNavigationHandoff.test.ts
# After fix: PASS, 124 tests / 11 files.
pnpm test
# PASS, 1,532 tests / 105 files, including bootstrap freshness.
pnpm -F frontend exec tsc --noEmit --incremental false
# PASS.
pnpm lint
# PASS, lint and repository formatting.
git diff --check
# PASS.
```

The old manifest and review hashes above remain historical evidence. The revised
candidate is stored under `artifacts/fs-3.4-notification-fix/` in the same local
project workspace as the original handoff artifacts. Its manifest records all
16 candidate hashes, the full base-relative patch and the four-file correction
relative to the previous candidate. The original artifacts are preserved.

The same independent reviewer `/root/independent_fs34_audit` re-reviewed the
correction read-only and returned **PASS: the P2 is resolved**. It independently
reran 124 tests / 11 files and updated its temporary probes to assert Off and
disposed reach and stop the later actual fixture while the original error still
propagates. Same-value reselection remains coherent; six other lifecycle/race
probes also pass. Exact reviewed hashes:

```text
cfa60e0dcdc3291571c008fbc72dffd9f213116a2272818d439b60d2be8e9782  frontend/application/motion/MotionPolicyService.ts
4d478c278920092b99cd1c70ab56c88cbdd514217a583f6e79cf95dbf6130703  frontend/application/motion/MotionPolicyService.test.ts
```

Builds, browsers and device checks were not rerun for this internal notification
correction. Earlier build/browser results remain historical; no actual renderer
scheduling, production Canvas or FS-G1 acceptance is claimed. The corrected API
is ready for the existing bounded handoff; no next-task implementation, commit
or push was performed.

## Dimi acceptance and completion — 2026-09-27

Dimi explicitly stated **“FS3.4 are done”** and requested updating documentation,
committing and pushing the changes. This closes the bounded FS-3.4 policy task
following the subscriber-isolation correction and independent PASS. Earlier
pending or no-commit language records prior task states and is superseded by
this explicit closure authorization. No additional device observation was
supplied; this decision does not invent browser, Canvas or FS-G1 acceptance.

Before closure edits, all 16 candidate files matched the corrected manifest:
patch SHA-256 `9329de62c21274757b0037b7fe952938c216f202f6e3bdd2f1301a087db2e091`,
base `3fca725459825644fe9286594c98e94644bc10e4`, branch
`feature/funkspace-minimum-usable`. Only this record and the feature-plan status
change for closure; runtime, tests, approved contract and generated files remain
identical to the validated/reviewed candidate.

Closure validation checks the candidate inventory and hashes, documentation
formatting/links, and staged diff. The recorded 1,532 tests, type/lint results
and independent correction review remain applicable; they are not relabeled as
new runs for this documentation-only closure. Commit/push results are recorded
outside the repository in `artifacts/fs-3.4-closure/` in the same local project
workspace after Git confirms them. The commit containing this record identifies
the final documentation-inclusive delivery.

The accepted API is available for separately requested FS-3.5/FS-4.5 consumption.
No next task, PR, merge, deployment, external configuration or FS-G1 approval is
authorized by this closure.
