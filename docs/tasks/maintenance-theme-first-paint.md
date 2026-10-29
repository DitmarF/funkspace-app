# Maintenance — Saved theme before first paint

## Completion update — 2026-09-25

Included in the completed FS-3.1 change set. Dimi gives device acceptance,
confirms the P2 corrections are applied, and authorizes commit/push of all
current changes. See the [FS-3.1 acceptance record](fs-3.1-navigation-settings-overlay.md#dimi-device-acceptance-and-completion--2026-09-25).
Earlier pending-acceptance and review statements below describe their original
handoff dates; no new independent review or additional device detail is inferred.

## Task metadata and authorization

- **Status:** Implemented; automated validation passed. Independent review and Dimi acceptance pending.
- **Owner/current writer:** Sites implementation in this task. No independent Codex review started.
- **Date:** 2026-09-24.
- **Branch/base:** `feature/funkspace-minimum-usable` at `b78a4169e15edf8f549f04717151efa043c09e01`. Historical SHA is evidence, never a reset target.
- **Related:** [original maintenance](maintenance-theme-bootstrap.md), [feature plan](../features/funkspace-minimum-usable.md), [architecture](../architecture.md), [workflow](../development/ai-workflow.md), [task template](../templates/task.md).
- **Approval:** Dimi's current “apply the fix” explicitly authorizes the separately proposed and tested native-head delivery change, superseding the earlier delivery freeze. It is implementation approval, not independent review or final acceptance.
- **Approved proposal:** `artifacts/theme-first-paint-proposal/proposed-source.patch`, SHA-256 `a05782cb6c3eddaeeca25893d2fe456da261b79f27afbfad58215459edbbfe29`, in the local ChatGPT project artifact directory.

## Requested outcome and inspected evidence

Prevent the visible light flash when reopening the app with Dark saved. Apply the approved three-file delivery fix, retain startup failure handling and ThemeService authority, strengthen regression coverage, and preserve the existing navigation candidate.

Inspected the root AGENTS guidance, authoritative feature plan, workflow/template, downloaded `FunkSpace_EPIC_3_Detailed_Plan.md`, FS-1.6/FS-2.6 prerequisite records, original bootstrap maintenance/architecture, scripts, generated payload, infrastructure adapters, ThemeService/provider, root layout, and startup tests. No nested AGENTS guidance was found in affected paths. The current generated script was fresh. Before work, 44 changed/untracked files comprised the existing navigation candidate; their contents were captured and protected.

The previous Next `beforeInteractive` wrapper queued the inline payload until framework chunks arrived. It ran before hydration but could follow visible content. Diagnosis reproduced 32 light content frames with framework scripts held. The isolated approved prototype had zero light frames in development and production. These are proposal observations, separate from the applied-candidate checks below.

## Scope and contract

- `frontend/app/layout.tsx`: move the existing bootstrap wrapper into explicit head before body.
- `frontend/application/providers/ThemeBootstrapScript.tsx`: native inline script with the same ID and exact generated payload; remove the Next queue wrapper.
- `frontend/application/providers/ThemeBootstrapScript.test.tsx`: assert parser-executed script and trusted payload.
- `e2e/theme-bootstrap/startup.spec.ts`: adapt synchronous completion observation to a test-only parser checkpoint, retain all theme/failure/handoff cases and negative control, assert cold-load first-paint ordering, and test untouched responses with framework scripts held at 320/1280px across load/reload.
- README, architecture, feature plan and maintenance records: document the approved delivery change and exact evidence.

No generated output, theme source, adapter, storage key, theme choice, ThemeService runtime authority, dependency, root metadata/fonts, navigation control, dialog lifecycle, game, or motion behavior changes. No new persistence mechanism or runtime observer/listener. FS-3.2/3.3/3.4/3.5 are not started or completed by this fix. Runtime failed-persistence consistency stays with FS-3.3. No commit/push/PR/deploy/external configuration authorized or performed.

## Validation and handoff

Checks ran against `/var/folders/mc/hyg7fvq95rz1vdfk_tkx3nsc0000gn/T/funkspace-theme-proposal-ssq2wtl3`, an isolated copy of the complete current checkout, including existing local changes, with installed dependency links. This protects Dimi's active development output and is not a clean-install reproduction. Source hashes matched the applied checkout; generated tokens/bootstrap remained byte-identical. Documentation-only final evidence updates followed the executable checks.

### Automated results

Commands below run from the isolated root unless noted. Temporary configurations and complete logs are retained with the artifacts. Browser configurations use the isolated frontend, port 3302, one Chromium worker, zero retries and no server reuse. Lighthouse uses port 3303 and local filesystem reports only. Dimi's servers were not replaced.

| Actual command                                                                                                                                                                                                                                                                                 | Result                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test:theme-bootstrap`                                                                                                                                                                                                                                                                    | PASS, 56 tests in 5 files; dedicated statements/branches/functions/lines coverage 100%. Includes freshness, source/generated parity, generator/watch, storage/media failures and ThemeService. |
| `pnpm lint`                                                                                                                                                                                                                                                                                    | PASS, freshness, zero ESLint warnings/errors and repository formatting. Next's existing lint-command deprecation notice remains.                                                               |
| `pnpm exec vitest run frontend/application/theme/ThemeService.test.ts frontend/application/providers/ThemeBootstrapScript.test.tsx frontend/components/Layouts/PortfolioNavigation.test.tsx frontend/components/Controls/Dialog.test.tsx`                                                      | PASS, 14 tests in 4 files.                                                                                                                                                                     |
| `pnpm storybook:build`                                                                                                                                                                                                                                                                         | PASS. Existing Vite chunk-size advisory remains.                                                                                                                                               |
| `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build`                                                                                                                                                                                                                                              | PASS, full tokens → common types → bootstrap/game → Next production build.                                                                                                                     |
| `pnpm -F frontend exec tsc --noEmit`                                                                                                                                                                                                                                                           | PASS.                                                                                                                                                                                          |
| `pnpm exec tsc --noEmit --strict --target es2017 --module commonjs --moduleResolution node --skipLibCheck --types node e2e/theme-bootstrap/startup.spec.ts`                                                                                                                                    | PASS, focused browser-test types.                                                                                                                                                              |
| `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-theme-dev.config.ts` (from actual checkout, tests/server from isolated copy)                                                                                                                                     | Final run PASS, 19/19 development startup tests, including negative control, all themes, failures, System handoff, cold paint, reload and no-JS.                                               |
| `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-theme-start.config.ts` (same runner arrangement)                                                                                                                                                                 | Final rebuilt production PASS, 19/19.                                                                                                                                                          |
| `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-theme-regressions.config.ts` (same runner arrangement)                                                                                                                                                           | PASS, 24/24 production tests: theme persistence/System, navigation, settings, narrow/wide and short viewports, enlarged text and accessibility.                                                |
| `CHROME_PATH=/Users/dimi/Projects/funkspace-app/node_modules/.pnpm/playwright-core@1.55.1/node_modules/playwright-core/.local-browsers/chromium-1193/chrome-mac/Chromium.app/Contents/MacOS/Chromium pnpm exec lhci autorun --config=/tmp/funkspace-theme-lighthouse.json` (path shell-quoted) | PASS, 3 desktop homepage runs, performance 100 each, LCP 685.78–688.79 ms, CLS 0. Existing 2500 ms / 0.1 budgets retained. Local lab results, not field or physical-device evidence.           |

Initial production instrumentation passed 19 tests. The first development run exposed a test-induced hydration mismatch because the negative control blanked the script, then stalled while a screenshot waited with framework chunks held; it was interrupted. The final fixture parses only the target script as inert JSON and restores its type attribute before hydration without executing it. A direct Chromium screenshot avoids load/font waits during deliberately blocked startup. No browser error filter, application hydration suppression, skipped assertion or lowered threshold was added. The final complete dev and production runs have zero captured browser errors. One rerun initially refused the leftover task-owned server's occupied port; that server was stopped before the successful run.

Cold-cache, 150 ms latency, 200 KB/s and 4× CPU samples: development bootstrap completed at 395.7 ms before first paint/FCP at 512 ms; production at 313.3 ms before 432 ms. Both observed one storage read, Dark and no pressed runtime control. Negative control observed no theme, zero reads/queries/pressed controls, then runtime ThemeService recovered Dark. These are separate timing/handoff observations, not a universal timing benchmark.

Untouched-response tests held all Next JavaScript requests and observed 12 consecutive Dark content frames for each open/reload at 320 and 1280px under a Light OS preference. Attached before-runtime screenshots show Dark content. No test checkpoint is injected in these cases; later controls confirm the normal ThemeService handoff. No-JS keeps usable default static content.

### Author inspection, review and observations

Author inspected the final incremental diff, the applied three-file delivery change against the approved proposal, and narrow/wide startup screenshots. No duplicated startup implementation, new listener/timer, generated drift, navigation edit or dependency was introduced. Changes stay at the existing startup composition boundary; browser effects remain in infrastructure and generated code. The original 44-file candidate is preserved except the explicitly extended startup test and feature-plan amendment.

This is author inspection, not independent Codex read-only review. Dimi reported the original flash and authorized this correction; no post-fix physical-device observation or final acceptance is recorded.

Local artifacts: `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/theme-first-paint-fix/`. Before-images and input hashes preserve the exact starting candidate. `manifest.json` lists the exact nine task files, current file hashes, incremental/full patch SHA-256 values and base/branch. `incremental.patch` isolates this fix; `full-candidate.patch` includes protected prior work for complete candidate review. Replay checks verify patch contents. Logs, temporary configurations, traces, timing/frame JSON, screenshots and local Lighthouse reports accompany the manifest. Review the incremental patch for this correction; the full candidate does not authorize starting the deferred FS-3.1 review.

## Remaining acceptance

- Dimi: restart/reload with Dark saved on the actual phone/browser and confirm no light flash; use the normal dev command or rebuild before a production preview.
- Independent reviewer: review only the exact candidate when requested; no review is implied by author checks.
- Not verified: physical iOS/Safari, Firefox, deployed CSP/headers. No external policy change is part of this fix.
