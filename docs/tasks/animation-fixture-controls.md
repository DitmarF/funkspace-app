# Animation fixture controls — 2026-09-30

## Scope and provenance

Dimi requests smaller, better organized Storybook controls and a usable logo timeline slider with fewer buttons. The attached logo screenshot was inspected. The second, WEB screenshot at `/Users/dimi/Desktop/Screenshot 2026-09-30 at 10.16.05.png` was unavailable; the actual `Scene/Aperture` and particle lifecycle stories were inspected instead.

Base: `01afc3fbe1a59804e690a31984f765ae76b44f1f` on `feature/funkspace-minimum-usable`, including the existing uncommitted FS-4.6 candidate. Preserve that work. This task does not grant FS-4.7, remote-action or visual-acceptance authorization.

## Decisions and contracts

- Logo: one Play/Pause action, Restart and a native timeline range. Scrubbing pauses and explicitly seeks to the inspected frame; Play continues there. Restart seeks to zero and plays. Reverse and double-speed actions are removed from this fixture; Storybook's existing speed argument remains available.
- The timeline reports its actual duration and position through an optional observation callback along the existing renderer/port/controller boundary. Only the existing renderer clock emits frame observations. The story updates the input/readout imperatively; React state changes only for lifecycle and duration changes. No extra RAF, timer, simulation or shared-service ownership is introduced. Product Pause/static identity behavior stays unchanged.
- WEB: group playback, scene/frame settings and shared motion/theme choices. Replace hidden toggle cycles with labeled aperture/frame selects, short-frame checkbox and a native particle-count range using existing Domain limits/effective values. Configuration and aperture replacement retain the mounted controller and local Pause.
- Compact styling reuses Button and semantic tokens and is scoped to the diagnostic surfaces; global/product button sizes and homepage/detail controls remain unchanged. All four motion choices remain visible.
- The existing diagnostic particle SVG is not extended into production. The solid WEB production fallback and prohibition on dense production particle DOM remain in force.

## Validation and handoff

Candidate **C1**. Existing aperture/lifecycle browser assertions are adapted to the labeled controls without dropping runtime identity, pixels, failure or lifecycle checks. The exact incremental diff and source hashes are in the [local evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/animation-fixture-controls/README.md).

- `pnpm typecheck:validation` and `pnpm lint`: pass.
- Focused Vitest run: **106 passed** across LogoMotion, its actual timeline adapter, SceneCustomization and PortfolioShell. The added integration regression verifies position observation, callback replacement, seek and terminal cleanup with one pending frame owner; scheduling is controlled by test fakes.
- Production build with animation availability on: pass. Chromium production regressions: **67 passed**, zero skipped/retried, covering homepage intro/logo and particle aperture/lifecycle behavior. This run preceded the final fixture-only heading, compact styling and select-label refinements; final Storybook checks below cover those final bytes. No fresh flag-off build or performance audit is claimed.
- Final production Storybook build and real Chromium fixture checks: **4 passed**, including native Home/ArrowRight seeking, progressing/held slider values, completion/restart, Off, particle-count keyboard changes and Canvas identity through aperture/frame/configuration changes.
- Unfiltered axe checks: no violations in the final dark 320 px logo and WEB stories. No horizontal overflow at 320 px. Desktop and narrow screenshots inspected; no physical-phone or new Firefox/WebKit evidence is claimed.
- Initial validation found a Storybook import-alias issue and fixture landmark/heading omissions; these were corrected. Native range keyboard coverage lives in Playwright; the manual logo story does not run an automatic test sequence or override the viewer's motion choice.

Changed surfaces: logo optional position observation through its existing renderer/port/controller/component, logo stories and integration test, diagnostic shared CSS, particle lifecycle fixture, aperture story and affected browser selectors, [Storybook regression tests](../../e2e/storybook/animation-fixtures.spec.ts), and this record. No particle settings, rules, simulation, Canvas drawing, aperture assets, production controls, generated outputs or FS-4.6 candidate bytes changed.

For review: open `Components/Logo/LogoMotion → Controls`, `Scene/Aperture → Replacement`, and `Scene/ParticleLifecycleFixture`. Frame widths are CSS-pixel maxima; the fixture still shrinks to the available viewport. The current Domain particle-count limits remain authoritative. Reset here keeps current configuration and local Pause; the product defaults Reset remains on the details page.

Technical verification and Dimi's visual acceptance are separate. No commit, push or deployment is part of this task.
