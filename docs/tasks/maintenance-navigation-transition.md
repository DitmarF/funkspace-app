# Navigation transition flash — 2026-09-24

## Completion update — 2026-09-25

Included in the completed FS-3.1 change set. Dimi gives device acceptance,
confirms the P2 corrections are applied, and authorizes commit/push of all
current changes. See the [FS-3.1 acceptance record](fs-3.1-navigation-settings-overlay.md#dimi-device-acceptance-and-completion--2026-09-25).
Earlier pending-acceptance and review statements below describe their original
handoff dates; no new independent review or additional device detail is inferred.

## Request, source and ownership

Dimi reports a brief view of the old page or overlay fragments when following
a tree link such as About. Sites is the single writer. Branch/base:
`feature/funkspace-minimum-usable` /
`b78a4169e15edf8f549f04717151efa043c09e01`. Prior local work was copied and
hashed before editing. Repository guidance, feature/EPIC plan, FS-1.6/FS-2.6
and current FS-3.1 records remain the constraints; this is the requested fix,
not an independent review or a start of FS-3.2.

## Reproduction and fix

The overlay's destination callback synchronously closed/unmounted the modal
and restored the old page before the native full-document navigation completed.
A 750ms delayed About response reproduced painted frames on Home with no modal.
The regression assertion failed before the fix and passed afterward. An initial
unbounded request-gate probe stalled; it was replaced with the bounded response
delay and per-frame observation. No stalled probe is counted as evidence.

The tree now renders Next Link's ordinary anchors with their existing hrefs
and `prefetch={false}`. Next's existing route transition retains the complete
old shell/overlay until the destination commits; unmount then uses the existing
dialog cleanup. No second router, transition timer, snapshot overlay, animation,
new persistence or browser API in presentation was introduced.

`onNavigate` now receives the destination href. PortfolioNavigation reads
Next's route context: same-path links synchronously close first so Contact can
scroll/focus and repeated Home/About links can dismiss normally. Cross-page
links leave the modal mounted until commit. Next Link excludes modified/new-tab
activation from this callback. Without JavaScript, the rendered native anchors
continue to work. Storybook explicitly supplies its existing App Router fixture.

Shared Dialog/useDialog/binding, focus/scroll lifecycle, theme first-paint
pipeline, icons, tokens, logo, destinations, category order and fixture-only
Motion are unchanged. No architecture/service/port or dependency expansion.
The unit tree fixture now checks nesting and hrefs; actual router dismissal,
modifier behavior and timing are covered in the production browser regression.

## Candidate and validation

Changed source: PortfolioNavigationTree, PortfolioNavigation, tree unit fixture,
navigation stories and new `e2e/navigation-transition.spec.ts`. Documentation:
this record, FS-3.1 parent and tree records. Handoff root:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/navigation-transition/`.
It contains preserved inputs, failing-before and passing-after evidence, exact
incremental/full candidate diffs, hashes, command logs/configuration and previews.

Checks use the isolated source copy described in the tree record and existing
installed dependencies. Final results:

- Before-fix `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-transition.config.ts` — expected FAIL: 46 sampled source-page frames had no modal during the delayed response. The original recording is preserved as `before-frames.json` and `before-browser/`.
- `pnpm exec vitest run frontend/components/Layouts/PortfolioNavigationTree.test.tsx frontend/components/Layouts/PortfolioNavigation.test.tsx frontend/components/Layouts/PortfolioShell.test.tsx frontend/components/Controls/Dialog.test.tsx frontend/infrastructure/dom/NativeDialogBinding.test.ts` — final PASS, 21 tests. An obsolete unit-fixture ancestor click blocker initially prevented native disclosure opening; removing it corrected the fixture.
- `pnpm test` — PASS, 1,428 tests / 98 files, including theme-bootstrap freshness.
- `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build`, `pnpm lint`, `pnpm -F frontend exec tsc --noEmit`, `pnpm storybook:build` — PASS. Existing Next lint deprecation and Storybook chunk-size advisories remain.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-transition-all.config.ts` — PASS, 105/105 portfolio checks, including no-JavaScript native anchors, layouts, keyboard/focus/scroll, themes and five new transition regressions.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-transition-theme.config.ts` — PASS, 19/19 startup checks including saved Dark before framework scripts at narrow/wide sizes.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-transition-stories.config.ts` — PASS, 6/6.
- `CHROME_PATH='/Users/dimi/Projects/funkspace-app/node_modules/.pnpm/playwright-core@1.55.1/node_modules/playwright-core/.local-browsers/chromium-1193/chrome-mac/Chromium.app/Contents/MacOS/Chromium' pnpm exec lhci autorun --config=/tmp/funkspace-transition-lighthouse.json` — PASS, three local runs, performance 100, LCP 684.78–688.45 ms, CLS 0; unchanged budgets, no upload.
- After final import ordering and frame-evidence output cleanup, production build/lint/types and `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-transition.config.ts` — PASS, 5/5. Per-frame full-screen coverage for delayed pointer/keyboard navigation at 320/1280px; Back, Contact scroll/focus, unlocked destination and modified new-tab activation. Earlier broad checks cover the same runtime behavior.
- Final focused Prettier, `git diff --check`, unchanged-input/generated hashes and incremental/full candidate patch replay — PASS. Source snapshot matches executable candidate files; final documentation evidence updates followed executable checks.

Author inspected the incremental diff, before/after frame evidence and destination
previews. Existing Next links handle transition scheduling; no added listener,
timer or dialog cleanup exists in production. Test-only delay/frame instrumentation
is confined to Playwright. Task-owned servers stopped after verification.
No physical-device, Safari/Firefox or assistive-technology acceptance is claimed.

Independent review is not started. Dimi owns final visual/device acceptance:
follow About/Contact/legal links, use Back, and inspect slow transitions on the
actual device. Automated checks are not Dimi's observations or approval.
