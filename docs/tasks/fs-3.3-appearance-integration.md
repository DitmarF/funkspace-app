# FS-3.3 — Appearance integration and live theme consistency

## Status and scope — 2026-09-27

**Owner:** Sites. **Status:** Complete — Dimi explicitly accepted and closed
FS-3.3 after Codex's technical approval. The review evidence and completion
decision are recorded below. FS-G1 remains unapproved.

**Base:** `354af41b83a5c506716088e03214b60f2d2751b9` on
`feature/funkspace-minimum-usable`. The working tree was clean. FS-3.1 and the
reconciled FS-3.2 handoff are accepted; no reset or branch change was performed.
Dimi's Firefox/Safari acceptance belongs to FS-3.2, not this new candidate.

Inspected root AGENTS, AI workflow, task template, authoritative feature plan,
the supplied detailed plan (theme contract, FS-3.3 and T1–T4), FS-3.1/FS-3.2
records, ThemeSwitcher/metadata/types, ThemeService, storage/DOM adapters,
provider/composition, typed/generated bootstrap, game-facing readers and
existing tests/scripts. No nested AGENTS guidance applies.

Goal: keep System, Default, Dark, Muted and High Contrast coherent across live
consumers when persistence fails, while preserving startup and ordinary reload.
Plan: reproduce stale-storage behavior; correct only the existing service;
test service/remount/readers and production T1–T4; preserve the exact diff for
Codex. No new manager, provider, preference type, palette or motion integration.

## Reproduction and correction

Two new service regressions failed against the accepted base (seven existing
tests passed). With storage stuck at System or Muted, select Dark, unsubscribe
the settings reader, attach a fresh reader, read the current theme, change the
OS scheme and initialize again. Fresh readers/current-theme queries returned
the stale selection; System changes or initialization could replace Dark.
The tests use the real adapter contract: denied writes are swallowed by
LocalStorageAdapter, leaving persistence unchanged. Original failure output is
archived with the handoff.

ThemeService now retains one nullable `selectedTheme`. Initialization reads and
normalizes storage only before a live selection exists; `setTheme` records the
live choice before best-effort persistence. Notifications, fresh subscriptions,
current-theme reads and system-change decisions resolve that choice. System
still resolves to the current OS scheme, while explicit choices ignore it.
Repeated initialization and provider effect replay cannot reload stale storage.
Cleanup still removes the one listener and subscribers, retaining the choice
only for the same service instance. A newly constructed service starts fresh.

### Exact contract and protected boundaries

- No public signature changes. `getStoredTheme()` still queries persistence on
  every explicit call and returns System for invalid/missing/unreadable values;
  it intentionally may disagree with the live choice after denied writes.
- `getCurrentTheme()` and subscription snapshots reflect the live selection
  after initialization or `setTheme`; before either, existing storage-derived
  reads remain available. `selectedTheme` and `resolvedTheme` remain distinct.
- `initialize()` seeds once, reapplies the live choice on later calls and owns
  at most one system listener. A user choice made before initialization wins.
- ThemeSwitcher already delegates changes and derives selection from service
  notifications. No production UI correction or second state authority needed.
- LocalStorageAdapter already catches browser access/read/write failures. Its
  meaning and implementation are unchanged. Full reload can restore only what
  storage actually retained; otherwise System is the safe fallback.
- Provider/composition, shared navigation/dialog lifecycle, bootstrap source and
  generated payload, validated storage key/types, tokens, static logo policy,
  Motion fixtures and game code are unchanged. Game readers still consume the
  existing theme adapter; no integration or new consumer framework is added.

## Changed files

- `frontend/application/theme/ThemeService.ts` — sole runtime correction.
- `frontend/application/theme/ThemeService.test.ts` — stale-write, new-reader,
  OS-change, early-choice, repeat-init and storage-query regressions.
- `frontend/components/ThemeSwitcher.integration.test.tsx` — real provider,
  real storage adapter, Strict Mode, settings remount and game-reader agreement
  with denied writes/reads; no production test hooks.
- `e2e/appearance.spec.ts` — eight real-route cases at 320/1280px.
- `docs/architecture.md`, `docs/features/funkspace-minimum-usable.md` and this
  record — live-state semantics, status and handoff.

## Validation and T1–T4 evidence

| ID  | Evidence                                                                                                                                                                                                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1  | All five metadata choices, exactly one selected control, immediate page and actual header-logo colors, four distinct explicit backgrounds, visible static logo and normal reload at 320/1280px.                                           |
| T2  | System follows light/dark changes even with stale explicit storage; explicit themes ignore OS changes, and System remains selected while resolving Dark.                                                                                  |
| T3  | Stale System/Muted, denied reads/writes, actual close/reopen and remount, fresh subscribers/current-theme reads, matching game-reader snapshot, unsubscribe and Strict Mode effect replay.                                                |
| T4  | Existing bootstrap suite covers missing/invalid values and unavailable APIs; normal reload restores each selection, blocked reload restores stale persisted data or System, repeated initialization preserves bootstrapped/newer choices. |

Commands and results for this author candidate:

```bash
pnpm exec vitest run frontend/application/theme/ThemeService.test.ts
# Before runtime correction: FAIL, 2 new regressions; 7 existing tests PASS.
pnpm exec vitest run frontend/application/theme/ThemeService.test.ts frontend/components/ThemeSwitcher.integration.test.tsx frontend/components/ThemeSwitcher.test.tsx frontend/infrastructure/theme/themeBootstrap.test.ts frontend/application/providers/ThemeBootstrapScript.test.tsx frontend/features/games/theme/FunkSpaceGameThemeAdapter.test.ts frontend/features/games/GameHost.test.tsx
# PASS: 64 tests / 7 files.
pnpm test
# PASS: 1,481 tests / 100 files, including bootstrap freshness.
pnpm build
# PASS: production build; generated files unchanged.
PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-fs32-browser.config.ts --output /tmp/fs33-browser e2e/appearance.spec.ts e2e/navigation-composition.spec.ts e2e/navigation-query-removal.spec.ts
# PASS: 34 cases (8 appearance, 18 composition, 8 query-removal).
pnpm e2e:theme-bootstrap
# PASS: 19 production cases including early-paint negative control and saved-dark reload.
pnpm lint
# PASS: ESLint and repository formatting; existing Next lint deprecation notice.
pnpm -F frontend exec tsc --noEmit --incremental false
# PASS.
pnpm storybook:build
# PASS: existing bundle-size warnings, no build failure.
git diff --check
# PASS.
```

The exact candidate patch/file hashes and logs are recorded in the artifact
manifest. Initial validation exposed two test-only
Testing Library `exact` options rejected by TypeScript; these were removed
without weakening name matching. An initial lint attempt could not write its
sandboxed cache and was rerun with repository write access. Formatting was
corrected after the test-option edit before the final successful checks. Failed
intermediate attempts are not represented as PASS.

## Reconciled handoff and limitations

Local handoff artifacts:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.3-appearance/`.
The manifest records base/branch, patch SHA-256, every changed path/hash, actual
commands/results and limitations. Another session must verify access rather
than assume these local artifacts exist on its host.

Browser validation is Chromium automation. No FS-3.3 physical-device,
Firefox/Safari or assistive-technology observation is claimed. Prior FS-3.2
acceptance is preserved separately. No palette/layout change or new per-frame
work warrants a new Lighthouse baseline. No inaccessible production Motion
or later scene consumer is invented to claim theme integration.

Author cleanup checks cover one theme authority, no repeated stale storage
reads after initialization, unchanged explicit storage queries, listener and
unsubscribe ownership, no generated drift and protected navigation behavior.
This is author verification, not independent approval.

**Original author handoff (subsequently reviewed):** Codex receives this exact reconciled service/provider base for
separately requested read-only appearance review before FS-3.4 changes shared
files. Provider/composition themselves are unchanged from accepted FS-3.2.
Dimi owns manual appearance/reload acceptance. Do not start either review or
FS-3.4 automatically; no commit, push, deployment or FS-G1 approval is included.

## Codex approval and reconciled handoff — 2026-09-27

**Technical reviewer:** Codex. **Documentation owner:** Sites.
After Dimi separately requested the read-only appearance review, Codex returned
**“Technical verdict: approved. No actionable findings.”** It verified live
theme consistency with denied writes, selected/resolved semantics, explicit
theme stability, repeat initialization, unsubscribe/cleanup, preserved storage
queries and honest blocked-storage reload behavior. No source or shared
completion record was edited during that review.

### Exact reviewed revision

- Base: `354af41b83a5c506716088e03214b60f2d2751b9`.
- Branch: `feature/funkspace-minimum-usable`.
- Reviewed candidate patch SHA-256:
  `6618f93d7cc6c2232c23bfea1d667f50c7cbe8f827b5b633ddb29accd8aa403a`.
- Exact patch, all seven candidate file hashes and author evidence remain in
  the original `artifacts/fs-3.3-appearance/` directory named above.

Codex confirmed all seven file hashes matched the manifest, and protected
bootstrap/provider/type/storage/token files matched the accepted base. The hash
identifies the candidate before this documentation-only handoff update; it is
not a hash of the amended documentation. Runtime and tests remain unchanged.

### Independent checks and build-cache limitation

The review independently ran:

```bash
pnpm check:theme-bootstrap
pnpm exec vitest run frontend/application/theme/ThemeService.test.ts frontend/components/ThemeSwitcher.integration.test.tsx frontend/components/ThemeSwitcher.test.tsx frontend/infrastructure/theme/themeBootstrap.test.ts frontend/application/providers/ThemeBootstrapScript.test.tsx frontend/features/games/theme/FunkSpaceGameThemeAdapter.test.ts frontend/features/games/GameHost.test.tsx
PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs33-review-isolated.config.ts
git diff --check
```

Results: **PASS**, 64 tests across seven files (including game-facing readers),
27 Chromium browser cases (eight T1–T4 appearance cases at 320/1280px and 19
bootstrap/no-flash cases), bootstrap freshness and diff checks. These are
independent reruns; the earlier full-suite, lint, typing and Storybook results
remain Sites author evidence.

The first browser attempts could not start the existing production cache:
Next reported a missing vendor chunk and both runner web-server checks timed
out. Those attempts are **not PASS**. Codex copied the current source into a
temporary directory, verified its seven candidate hashes and built it using
`node /Users/dimi/Projects/funkspace-app/frontend/node_modules/next/dist/bin/next build`
from that copy's `frontend` directory. The isolated build succeeded and all 27
browser cases then passed. Repository source and the existing build output
were left untouched; the cache failure was not treated as a source finding.

Review logs, the isolated runner configuration, and this documentation delta
are retained in
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.3-handoff/`.
The configuration names the original temporary build path; another session must
verify that path or rebuild a verified source copy before reusing it.

### FS-3.4 handoff and remaining acceptance

The reconciled service/provider base is **technically ready for FS-3.4's own
contract and approval checkpoints**. ThemeService remains the sole theme
authority with unchanged public signatures; its live selection and explicit
storage-query distinction must be preserved. Provider/composition are still
unchanged from accepted FS-3.2. There are no outstanding Codex findings assigned
to Sites for this candidate.

**Next acceptance action — Dimi:** verify the five appearance choices and an
actual reload for FS-3.3, then record acceptance. No FS-3.3 physical-device,
Firefox/Safari or assistive-technology observation has been supplied; FS-3.2
browser acceptance is not transferred to this task. Automated review coverage
is Chromium only. Sites records the supplied acceptance when available.

This handoff does not close FS-3.3 on Dimi's behalf, start FS-3.4, or approve
FS-G1. No commit, push or deployment is authorized by this documentation request.
Documentation validation consists of content/link and formatting checks,
`git diff --check`, and candidate-file hash comparison; application tests/builds
are not repeated for documentation-only changes.

## Dimi acceptance and completion — 2026-09-27

Dimi explicitly stated **“F3.3 is accepted and done”** and requested updating
the documentation, then committing and pushing **all changes**. This closes
FS-3.3 following Codex's approval with no actionable findings. The preceding
pending-acceptance language records the earlier handoff state and is superseded
by this decision. No new device/browser versions or individual manual test
steps were supplied; acceptance does not invent additional test evidence.

The authorized commit includes all seven current FS-3.3 implementation, test
and documentation files on `feature/funkspace-minimum-usable`, based on
`354af41b83a5c506716088e03214b60f2d2751b9`. Runtime/tests remain identical to the
reviewed candidate `6618f93d7cc6c2232c23bfea1d667f50c7cbe8f827b5b633ddb29accd8aa403a`;
only the feature-plan and task-record handoff/completion text has changed since
review. The earlier patch hash continues to identify that historical candidate,
not the final documentation-inclusive commit.

Closure checks: candidate inventory/hash comparison, documentation formatting,
link/content review and staged diff validation. Existing runtime validation
remains applicable because runtime/tests are unchanged. Commit/push outcomes
are reported in the session handoff only after Git confirms them.

**Next:** the accepted theme/service/provider base is available for FS-3.4 when
separately requested, subject to its own contract and approval checkpoints.
FS-3.4 is not started by this closure. FS-G1 remains pending; no PR, merge,
deployment or external configuration change is authorized here.
