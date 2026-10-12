# Maintenance — Web Aperture details and compact customization

## Task metadata

- **Status:** Implemented and reviewed; technical checks passed. Dimi authorized documentation, commit and push on 2026-10-12. This is not EPIC 4 acceptance or FS-4.7/4.8 completion.
- **Base:** `523b73e08c92a496419c65198ebb6d8e3c84a671`, clean branch `feature/funkspace-minimum-usable`.
- **Date:** 2026-10-12.
- **Scope:** Presentation maintenance before FS-4.7/4.8; commit and push authorized after review, with no merge or deployment authorization.

## Requested outcome

Match the homepage opening section on the Web Aperture details page, replacing
More with Customize and adding no introductory paragraph inside that section.
Put a concise, plain-language explanation of the animation and customization in
a separate content section. Reduce dialog copy to short control labels, values,
status and actionable errors. This is an initial copy/layout iteration for Dimi
to review, not approval of any new scene choice or performance budget.

## Inspection and decisions

Read AGENTS, workflow/task template, current architecture/ADRs, feature plan,
FS-3.6 handoff, supplied Downloads EPIC 4 plan, FS-4.6 history and affected code.
The source tree and recorded current decisions are authoritative. Existing
`Start`, `StartScene`, `PortfolioSection`, `FieldFrame`, Button and Dialog cover
the requested presentation; no new renderer, settings authority or modal owner
is needed. A read-only helper inspected control contracts and regression scope;
the parent remains the only writer.

Use the same `Start` section with a customization option on details. Reuse one
details composition in the route and Storybook. Put explanatory content in a
plain section; keep the interactive opening cornered. Short dialog names are
Particles, Speed, Size, Links, Reach, Full field and Reset. Native ranges retain
Domain limits, steps, effective values and meaningful accessible value text.
This request supersedes earlier FS-4.6 prose placing usage instructions inside
the dialog; it does not reopen completed implementation gates.

## Protected contracts

- One mounted scene and the same retained Canvas; no dialog preview renderer.
- Provider-owned motion policy, all four choices, static/error fallbacks and local Pause.
- Reset restores defaults/seed/WEB cover without changing Pause, theme or motion.
- Changes last for the mounted page, survive dialog close and reset on reload.
- Existing overlay coordination, native fallback, focus return and scroll ownership.
- Semantic tokens, generated output and shared control APIs remain unchanged.

## Planned paths and validation

Extend `components/sections/Start.tsx`; add details composition and styles beside
it; wire the aperture route and existing customization story to that composition.
Simplify `SceneCustomization` markup/styles and update affected control selectors
in unit/browser tests. Add coverage for shared opening markup, separate readable
documentation, compact values and responsive dialog behavior.

Run focused scene/section tests, types and lint, then isolated production and
Storybook builds. Verify the page and dialog in Chromium at desktop/mobile and
enlarged text, including accessibility, keyboard, wheel/touch overflow, reset,
motion restrictions and same-scene retention. Preserve the user's dev preview.
Record exact candidate, executed checks, failures and limits below.

## Delivered behavior

The route and Storybook use `ApertureDetails`, containing the shared cornered
`Start` with Customize plus a plain guide. The opening has the same scene
dimensions, title and Pause placement as home. The guide explains the moving
dots/lines and WEB window, all five ranges, Full field, motion choices, Pause,
reset and page-local settings in plain language.

The dialog retains its existing Reset-first toolbar and one native modal. It
shows Particles, Speed, Size, Links and Reach, with values beside labels; Full
field replaces the technical transparent-overlay wording. Slider limits/steps
still come from Domain. Accessible value text describes counts, per-particle
link maxima and multipliers. Visible state is brief; detailed state remains
available to assistive technology, and actionable errors remain visible.

A read-only review caught Off's retained Canvas being labeled as a temporary
pause. The label now says Still artwork for Off, with a regression assertion.
The guide explicitly makes resumed motion conditional on motion permission and
local Pause. Final read-only review found no remaining actionable findings.

## Changed files

- `frontend/components/sections/Start.tsx`: shared customization option.
- New `ApertureDetails.tsx`, `.module.css`, `.test.tsx` in that directory:
  shared two-section composition, readable responsive guide and static contract.
- `frontend/app/animations/aperture/page.tsx`: route uses that composition.
- `frontend/components/Scene/SceneCustomization.tsx`, `.module.css`, `.test.tsx`
  and `.stories.tsx`: concise controls/status, aligned values, accessible semantics
  and real details-page stories.
- New `e2e/aperture-details.spec.ts` and `e2e/storybook/aperture-details.spec.ts`;
  updated `e2e/scene-customization.spec.ts` and `e2e/scene-customization-scroll.spec.ts`.
- Architecture, feature plan and this task record document the current amendment.

## Candidate and validation

Source/test diff SHA-256 (frontend/e2e, excluding docs):
`d19a806a05257b3d5990f42fa8ae1cb4973d14261f1fbc70ef047a6c9da4cbb5`.
Base HEAD is unchanged. Production build: `2tyCQJFuQoq0126HgvyrZ`.
Source patch, logs and inspected desktop/mobile screenshots are saved locally in
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/aperture-details-2026-10-12/`.

- Full `pnpm test`: **123 files / 1,896 tests passed**.
- Frontend and validation TypeScript, `pnpm lint`: **PASS**.
- Existing local preview: **35/35 Chromium browser checks passed** across the new
  details test and existing scene actions, customization and scrolling suites.
- Isolated motion-enabled frontend production build and `pnpm storybook:build`:
  **PASS**. Storybook retains non-blocking bundle-size warnings.
- Built Storybook: **3/3 passed**, including wide/narrow/unavailable motion,
  range changes, accessible values, Axe and focus restoration.
- Final production browser suite: **35/35 passed** on the identified build.
  Includes motion/static startup, one retained Canvas, maximum settings, Reset
  under five states, modal handoff/focus, native fallback, no-JS, all four themes
  and 200% text. No retries, weakened assertions or ignored failures.
- The compact panel fits taller screens. The gesture regression now deliberately
  uses 480px height and asserts actual overflow; all prior bidirectional wheel/
  touch and background-scroll-lock assertions are retained.
- Desktop/mobile page and dialog screenshots were inspected. The intro geometry
  matches home, guide remains separate, and there is no horizontal overflow.

## Handoff and limits

User acceptance of the first guide draft and dialog presentation is pending.
No commit, push or deployment is authorized or performed. The existing development
preview is retained; isolated test servers have stopped. Final content/link,
formatting, source-hash and diff checks pass across the 16 intended files.
No runtime, scheduling, provider/service construction, generated token or package
dependency changes were made.

Lighthouse and an actual flag-disabled production build were not repeated for
this presentation change; no new performance claim is made. Storybook's disabled
capability fixture is separate from a production flag-off build. Existing EPIC 4
performance/focus-test follow-ups remain. Chromium touch emulation is not physical
device coverage; Safari/Firefox and physical devices remain untested. FS-4.7/4.8
are not completed by this maintenance task.

## Setting hints and expanded guide — 2026-10-12

Dimi requests minimal information for each customization setting and a moderate
expansion explaining the Canvas particles/connectors and SVG mask together.
This refines the earlier minimal-copy choice without changing scene behavior.

Each range now uses the existing FieldFrame help and `aria-describedby`: count
limits, movement speed, current particle width range, per-dot link maximum and
connection reach. Size shows **diameter**, derived from the Domain radius range
times the current effective size; at 0.1× it reads 0.2–0.6 px, at 2× 4–12 px.
Full field also has a short, programmatically associated hint. Hints span the
control row and retain small semantic typography.

The guide adds a short Canvas/SVG explanation: Canvas redraws dots and lines;
the SVG mask cuts WEB into the cover above the same Canvas. Full field hides
that cover. Brief additions explain the control effects, changing one setting
at a time, and offscreen/static behavior. The opening remains free of added copy.

Unit and browser assertions cover hint association, live width updates and the
new explanation. Earlier candidate hash/build/results precede this refinement;
fresh validation is recorded below.

Refined source/test diff SHA-256 (same base HEAD; frontend/e2e, excluding docs):
`d3f80b93ea3416b3571509aa5a173557b6f8a275649c463312e3289ab1a86af0`.
The artifact directory above contains `source-hints.patch`, fresh
`aperture-hints-*.log` files and `hints-screenshots/`.

- Focused customization/details unit tests: **2 files / 12 tests passed**.
- Frontend and validation TypeScript checks, full lint/format checks: **PASS**.
- Current development preview: **9/9 Chromium checks passed** covering the
  details page at 390/768/1280px, live size hints, wheel/touch scrolling, all four
  themes, short viewports, 200% text and unfiltered accessibility checks.
- Inspected current mobile dialog, desktop guide and enlarged high-contrast
  dialog screenshots; hints remain readable and the panel remains scrollable.
- This follow-up changes explanatory copy, associated help and its layout.
  Production/Storybook builds and the full unit suite were not repeated; the
  earlier results above apply to the preceding candidate only. Existing stories
  reuse these components and receive the updated content automatically.

The changes remain uncommitted. Copy/layout acceptance and the previously
recorded cross-browser/device limits remain open.

## Hint spacing and About typography — 2026-10-12

Dimi requests closer slider hints and guide font sizes matching the About details
page. This follow-up changes only `SceneCustomization.module.css`,
`ApertureDetails.module.css`, `ApertureDetails.tsx` and this existing record.

The customization ranges use a 2rem control height, zero block padding and a
0.25rem row gap through existing spacing tokens. At normal text size the hint
starts 20px below the track centre, previously 32px. The native input remains
32px tall; labels, values, hint associations and keyboard behavior are unchanged.
Other shared form controls retain their existing sizing.

The guide reuses About's `text-portfolio-body`, `text-3xl` and `text-2xl`
utilities instead of maintaining separate font sizes. Rendered comparison at
390/768/1280px confirms matching title/subtitle sizes of 30/24px and body sizes
of 17.6/20/20px respectively. Existing Storybook examples reuse the composition.

Candidate source/test diff SHA-256 (same base HEAD; frontend/e2e, excluding docs):
`a5b715280498a9418b9413eb2d0bc027f8634f51d8d1602229439272ed5a3aec`.
Production build: `BooH0cv8u-UYQaSLfmDOz`. Evidence in the same artifact directory:
`source-spacing.patch`, `aperture-spacing-*.log` and `spacing-screenshots/`.

- Frontend and validation types, lint and formatting: **PASS**.
- Existing affected unit tests: **2 files / 12 tests passed**.
- Focused development and production Chromium suites: **9/9 passed each**;
  responsive details, size hints, wheel/touch scrolling, all four themes,
  unfiltered accessibility and 200% text remain covered.
- Isolated motion-enabled production and Storybook builds: **PASS**.
- Built Storybook checks: **3/3 passed**; existing bundle-size warnings remain.
- Current mobile dialog and desktop guide screenshots visually inspected.
- Diff whitespace check: **PASS**. No new test code was needed for this styling
  refinement; existing interactions plus rendered measurements cover its scope.

Full-suite, Lighthouse, flag-off build and physical/cross-browser checks were not
repeated. Copy/layout acceptance remains separate from these technical checks.
No commit, push or deployment was performed; the active preview is preserved.

## Final review and commit handoff — 2026-10-12

The final read-only review covered all 16 changed/new files, including the guide,
dialog, shared opening, Storybook, tests and documentation. **No actionable
findings.** No source was repaired during review. The candidate remains the
`a5b715280498a9418b9413eb2d0bc027f8634f51d8d1602229439272ed5a3aec`
source/test diff above, based on `523b73e08c92a496419c65198ebb6d8e3c84a671`.
All 13 changed/new source and test files matched the isolated production checkout.

Fresh review validation:

- Full unit suite: **123 files / 1,897 tests passed**.
- Complete affected production Chromium suites: **35/35 passed** on build
  `BooH0cv8u-UYQaSLfmDOz`, including scene actions, customization, scrolling and
  details layout. Covers motion choices, retained Canvas, Reset, native/no-JS
  fallbacks, focus/navigation handoff, themes and enlarged text.
- Documentation local links and diff whitespace: **PASS**.
- The unchanged candidate's frontend/validation types, lint, production and
  Storybook builds, and **3/3 Storybook browser checks** passed in the preceding
  validation; review did not repeat those checks.

Architecture checklist: scope/reuse, dependency direction, justified composition,
test coverage, documentation and final diff inspection passed. Domain,
Application, Infrastructure, generated assets, package manifests and shared
service lifecycle remain unchanged; new package/dependency review is not
applicable. No game, persistence, contact or deployment scope was added.

Dimi subsequently requested documentation, commit and push of this reviewed
candidate to `feature/funkspace-minimum-usable`. That authorization supersedes
the earlier uncommitted/no-authorization handoff notes above; those remain
historical validation records. The resulting Git commit contains this record.
No merge or deployment is included. Technical PASS and commit authorization do
not close FS-4.7/4.8 or imply broader EPIC acceptance. Safari, Firefox, physical
devices, Lighthouse and a fresh flag-disabled production build remain outside
this validation. The user's development preview is preserved.
