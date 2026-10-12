# Local development and production preview isolation

## Task metadata

- Status: Local preview repair complete; Dimi reports manual smartphone/Safari/Firefox tests PASS on 2026-10-13.
- Owner/current writer: Codex.
- Date: 2026-10-12.
- Candidate: `749342717ddac85b67a3275d669363ef9bf86d2e` plus the existing uncommitted FS-4.7A corrections and this bounded configuration patch.
- Related: [FS-4.7 review](fs-4.7-scene-performance-review.md), [setup instructions](../../README.md#install--run).

Dimi's 2026-10-13 confirmation covers the pending corrections as a whole; it
does not enumerate a separate simultaneous-build test. The automated evidence
below owns that specific check. See the [combined re-review](fs-4.7-scene-performance-review.md#fs-47a-correction-re-review--2026-10-13)
for the current candidate, manual-result provenance and remaining EPIC gates.

## Requested outcome and inspected evidence

Dimi reported all animation missing in the localhost:3000 preview. The screenshot
shows HTTP 404 for `main-app.js` and `app-pages-internals.js`. Inspection reproduced
the latter 404 and found both `next dev` (:3000) and `next start` (:3001) in the same
`frontend` checkout, with the default `.next` output. Both served development-style
HTML after a production build had replaced the shared output. This prevents React
hydration and consequently animation and interactive controls. Earlier guidance
to build in that checkout failed to account for the live development server.

Repository instructions, package scripts, Next configuration, TypeScript settings,
setup documentation and current EPIC handoff were inspected. Existing uncommitted
implementation changes are preserved. The separate :3391 preview is unaffected.

## Bounded plan and changes

1. Give only Next's development phase `.next-dev`; retain production `.next`.
2. Ignore development output in Git/Prettier/coverage and include its generated
   route types in frontend TypeScript. Exclude both generated output trees from
   validation-source checks. Coverage thresholds and source exclusions are unchanged.
3. Rebuild/restart the affected production preview and verify the development
   server remains healthy during and after the build.
4. Verify script delivery, actual animation frames and navigation controls in
   browser sessions against both servers. Document the phone-preview workflow.

No animation, motion policy, application service, domain or generated token source
changes belong to this repair. No commit/push or persistent environment change is
authorized. Both previews intentionally remain running for Dimi's local testing.

## Validation and completion

The existing development process reloaded the new configuration and restored
`app-pages-internals.js` to HTTP 200. A complete production rebuild then succeeded
while development remained available. Production was stopped before rebuilding
and restarted on `0.0.0.0:3001`; the unrelated :3391 preview was preserved.

- `pnpm check:theme-bootstrap && pnpm build`: PASS. Production build ID
  `qNJB-kqJgt1bRGG4PeeGB`; existing local animation flag is `true`.
- `pnpm -F frontend exec tsc --noEmit` and `pnpm typecheck:validation`: PASS.
- `pnpm lint`: PASS after adding the generated development folder to
  `.prettierignore`. The first attempt correctly exposed that missing exclusion;
  generated files were not reformatted.
- `pnpm exec vitest run frontend/infrastructure/dom/StickyHeaderBinding.test.ts
frontend/components/Scene/StartScene.test.tsx --maxWorkers=2`: 61/61 PASS.
- Existing Chromium logo and scene regressions: 11/11 PASS on :3000, then 11/11
  PASS on :3001, one worker and no retries. Tests exercise observed logo drawing at
  320px/1280px, all four motion preferences with both OS preferences, live Canvas
  frames, Pause, themes and settings occlusion. The external config selects
  `actual build flag|Pause, all themes|only nominated identity draws` from
  `start-scene.spec.ts` and `logo-animation.spec.ts`, with `FS35_AVAILABLE=true`.
- Fresh browser network/screenshot checks: six development scripts and twelve
  production scripts loaded, zero HTTP errors, failed requests or page exceptions;
  the actual homepage Canvas was visible on both. Restored development screenshot
  inspected visually.
- Formatting, `git diff --check`, generated-cache ignore and final port checks:
  PASS. Both intended previews remain running for the user.

Changed files: `frontend/next.config.ts`, `frontend/.gitignore`,
`frontend/tsconfig.json`, `frontend/tsconfig.validation.json`, `.prettierignore`,
`vitest.config.ts`, `README.md`, and this record. No animation source changed.
External evidence is preserved at
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/preview-build-isolation-2026-10-12/`
(browser reports/config, network report/script, screenshots and configuration diff).

Full coverage, Storybook, Lighthouse and physical-device testing were not rerun
for this output-folder repair. Earlier FS-4.7 evidence remains bound to its own
candidate; device acceptance and independent review remain separate. Reload the
existing browser tab to recover its previously failed script loads. No commit or
push was made.
