# Task FS-3.1 — Combined navigation and settings overlay

## Dimi device acceptance and completion — 2026-09-25

**Status: Complete.** Dimi explicitly confirms device acceptance, confirms that
the two P2 corrections are applied, closes FS-3.1, and authorizes documentation
updates followed by commit and push of all current changes on
`feature/funkspace-minimum-usable`. This supersedes the pending acceptance and
no-commit/no-push statements in the historical handoffs below. It does not
authorize starting FS-3.2/3.3, a PR, merge, deployment or publication.

Evidence remains separate:

- **Independent review:** the read-only FS-3.1 review identified clipped
  short-screen category controls and fixed Close obscuring a focused link.
  Both P2 corrections are implemented. No separate post-correction independent
  review PASS is recorded or inferred from Dimi's completion decision.
- **Automated validation:** the final correction passed 115 portfolio browser
  checks, 34 Storybook checks, lint, type checking, production/Storybook builds
  and three local Lighthouse runs. Both regressions first failed on the reviewed
  build, then passed with the fix. See [exact commands and limits](maintenance-navigation-p2-fixes.md).
- **Dimi acceptance:** device acceptance and FS-3.1 completion explicitly given
  in this session. Device/browser versions and individual assistive-technology
  observations were not supplied; none are invented.

The accepted implementation candidate on base
`b78a4169e15edf8f549f04717151efa043c09e01` has full-patch SHA-256
`4000662e34de39a802866d462cd1734789b75263114124e4877e988763d2a2e3`,
retained in the local `artifacts/navigation-p2-fixes/` handoff. Before closure,
all 577 source files matched that validated candidate. This closure changes
documentation only; prior test/build evidence is retained rather than relabeled
as a new run. Formatting, documentation links and the complete staged diff are
checked before commit. The commit containing this section records the complete
accepted implementation, assets, tests, related maintenance and closure records.

**Owned follow-ups:** FS-3.2 retains repeated-Contact destination focus and shared
navigation lifecycle acceptance; FS-3.3 retains denied-storage appearance
consistency. Motion remains fixture-only until FS-3.4/3.5. These later tasks and
EPIC 3 as a whole remain open; FS-G1 is not approved. Earlier entries below
describe their original handoff state and do not reopen accepted FS-3.1 work.

## P2 review corrections — 2026-09-25

Dimi requested the two reviewed layout corrections. Short-screen icon-only
controls retain their normal target sizes while text enlarges, and desktop
keyboard scrolling reserves clearance beneath fixed Close. Full-target clipping,
focus-outline and hit-test assertions replace partial visibility as the evidence
for these cases. See [bounded correction and validation](maintenance-navigation-p2-fixes.md).
This supersedes the earlier short-screen claim that activation alone establishes
usability. Renewed independent review and Dimi's visual/device acceptance remain
pending; FS-3.2/3.3 behavior is outside this correction.

## Overlay spacing correction — 2026-09-25

The reserved top gap is removed: the category heading now shares Close's
vertical center, with desktop heading clearance beside the top-left control.
Mobile Close has balanced top/right target spacing and the tree uses the same
visual outer gutter as the right hex artwork. Existing trigger/rail coordinates
and shared lifecycle remain intact. See [candidate and validation](maintenance-navigation-overlay-spacing.md).
This supersedes previous detail top-spacing only; acceptance remains pending.

## Navigation destination icons — 2026-09-25

Contact is now the last tree option, and Legal notice replaces visible
Imprint/Impressum wording across the app. Eight supplied Figma families replace
temporary destination artwork and extend the existing Storybook gallery in all
three sizes. See [bounded follow-up and evidence](maintenance-navigation-tree-icons.md).
Independent review and Dimi's visual/device acceptance remain pending.

## Destination transition correction — 2026-09-24

Cross-page tree links now retain the complete overlay until Next's destination
render commits. Same-page links close before scrolling. Existing native anchor
semantics and no-JavaScript navigation remain; shared dialog lifecycle is
unchanged. See [reproduction, exact candidate and validation](maintenance-navigation-transition.md).
This supersedes synchronous closure for every destination. Dimi's visual/device
acceptance and independent review remain separate and pending.

## Navigation category icon size — 2026-09-24

Dimi requests the Navigation hex-button's 48px icon instead of 36px. Sites
reuses the existing 48-unit Figma export through Icon. HexButton gains optional
`iconSize: 24 | 36 | 48`; omitted values preserve its size-matched defaults.
The override scales proportionally with the existing hex artwork. Only the
Navigation category and its SelectedNavigation story opt into 48px; the medium
hexagon, hit target, other icons, Nav/Settings launcher and category order stay
unchanged. No new artwork, dependency, browser effect, motion or theme change.

Owner/current writer: Sites; branch/base remain
`feature/funkspace-minimum-usable` / `b78a4169e15edf8f549f04717151efa043c09e01`.
Prior local work preserved. Files: HexButton, its story, PortfolioNavigation,
browser composition check and this record. Exact candidate and incremental
diffs, input/file hashes, actual logs/configurations and narrow/wide previews
are retained in `artifacts/navigation-icon-48/` under the local ChatGPT project
artifact root used by the revision records.

Actual checks in the same isolated source copy documented in the tree revision:

- `pnpm exec vitest run frontend/components/Controls/HexButton.test.tsx frontend/components/Layouts/PortfolioNavigation.test.tsx frontend/components/Icons/Icon.test.tsx` — PASS, 65 tests.
- `pnpm lint`, `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build`, `pnpm -F frontend exec tsc --noEmit`, `pnpm storybook:build` — PASS. Existing Next lint deprecation / Storybook chunk-size advisories remain.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-nav-icon-48.config.ts` — PASS, 22/22. Navigation's source viewBox and actual display are 48px at 320/768/1280px; unchanged hex target dimensions and Close/rail alignment also pass.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-nav-icon-48-stories.config.ts` — PASS, 6/6.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-nav-icon-48-hex.config.ts` — PASS, 12/12, shared default icon sizes, themes, keyboard, hit targets, wrapping, enlarged text and forced colors.
- `CHROME_PATH='/Users/dimi/Projects/funkspace-app/node_modules/.pnpm/playwright-core@1.55.1/node_modules/playwright-core/.local-browsers/chromium-1193/chrome-mac/Chromium.app/Contents/MacOS/Chromium' pnpm exec lhci autorun --config=/tmp/funkspace-nav-icon-48-lighthouse.json` — PASS, three local runs against unchanged budgets; no upload.
- Final focused Prettier and `git diff --check` — PASS. Both candidate patches replayed; unrelated input hashes and generated output remain unchanged.

Author inspected the bounded diff and 320/1280px previews. The existing Icon
and HexButton remain the only artwork/control implementations; no new state,
effects or lifecycle work. Task-owned servers stopped. Independent review is
not started. Dimi owns the next visual/device acceptance of the larger
Navigation artwork; automated checks are not visual approval.

## Category order correction — 2026-09-24

Dimi requests swapping Chat-bot and Languages so Languages occupies the middle
of the five-button rail. Sites changed the existing JSX order to Navigation,
Languages, Accessibility, Chat-bot; the existing responsive rail puts Nav/Settings
first on desktop and last on mobile. Languages is therefore third from the top
on both. Both future categories remain disabled. No CSS, lifecycle, theme,
icon geometry, Motion or destination change.

Single writer: Sites. Branch/base remain `feature/funkspace-minimum-usable` /
`b78a4169e15edf8f549f04717151efa043c09e01`. Existing local changes preserved.
Changed: PortfolioNavigation, existing browser composition check, this record.
Exact incremental diff, hashes, logs/configurations and 320/768/1280px previews:
`artifacts/settings-category-order/` under the same ChatGPT project artifact
root used by the linked revision records.

Actual validation in the same isolated source copy documented in the tree
revision record (existing dependencies reused):

- `pnpm exec vitest run frontend/components/Layouts/PortfolioNavigation.test.tsx` — PASS, 2 tests.
- `pnpm lint`, `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build`, `pnpm -F frontend exec tsc --noEmit`, `pnpm storybook:build` — PASS. Existing Next lint deprecation / Storybook chunk-size advisories remain.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-category-order.config.ts` — PASS, 22/22. Actual rendered positions place Languages third at 320/768/1280px; disabled states, active categories and prior navigation/scroll/alignment checks pass.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-category-order-stories.config.ts` — PASS, 6/6.
- `CHROME_PATH='/Users/dimi/Projects/funkspace-app/node_modules/.pnpm/playwright-core@1.55.1/node_modules/playwright-core/.local-browsers/chromium-1193/chrome-mac/Chromium.app/Contents/MacOS/Chromium' pnpm exec lhci autorun --config=/tmp/funkspace-category-order-lighthouse.json` — PASS, three local runs with unchanged budgets; no upload.
- Final focused Prettier and `git diff --check` — PASS. Candidate patches replayed; unrelated inputs match their original hashes.

Author inspected the bounded diff and mobile/desktop previews. No duplicate
controls, effects or generated changes. Task-owned preview servers stopped.
Independent review is not started; Dimi owns the next visual/device acceptance
of the swapped category positions.

## Navigation hierarchy revision — 2026-09-24

Dimi replaces the flat outlined navigation links with native expandable rows:
custom arrow-right-small/arrow-down-small only for expandable groups (Dimi's latest Figma replacement), a per-row custom icon (settings-burger for now), and
text. Home, the full About page, Contact, Animations, Games and Privacy form the
root list; Privacy groups Privacy policy and Imprint. Dimi explicitly chose
disabled Coming soon entries for the unready animation/game pages. This
supersedes the earlier outlined-navigation-detail requirement and no-placeholder
restriction only for these requested noninteractive rows. Appearance controls,
the category rail, Close alignment and theme bootstrap remain protected.
See the [bounded revision and exact validation record](fs-3.1-navigation-tree.md).
Independent review and Dimi's acceptance remain pending.

## Close center alignment correction — 2026-09-24

**Request:** Dimi wants Close horizontally centered over the mobile hex-button rail and vertically centered with tablet/desktop Nav/Settings. Its smaller size and existing top-right/top-left placement remain. This is an authorized Sites presentation correction; no independent review or later task.

**Protected base:** `feature/funkspace-minimum-usable` at `b78a4169e15edf8f549f04717151efa043c09e01`. All 44 existing candidate file hashes matched `artifacts/fs-3.1-close-position/manifest.json`; prior candidate SHA-256 `fa783f14bc92aee0bd1a44bd865d8677ea5b163a622a15c4cd48fb65a201592a` is preserved. The new full/incremental patches, fingerprints, before-images and previews are in `artifacts/fs-3.1-close-alignment/` in the local ChatGPT project workspace.

**Implementation:** reuse the shell's launcher inset through a shared CSS custom property. Position the compact Close container at the appropriate center using the existing CSS anchor, with equivalent token-based coordinates as fallback. Close is fixed within the overlay rather than sticky; reserve its space in the content so it does not cover the details. Tests compare actual button centers within half a CSS pixel at normal/enlarged text, after scrolling, at both breakpoints and after resizing. No component API, browser effect, shared dialog lifecycle, target size, theme service, motion or destination change.

**Evidence/acceptance:** current results and exact commands are in this correction's handoff; earlier records below are historical. Sites owns implementation/evidence; Dimi owns visual/device acceptance; Codex owns a later explicitly requested read-only review. Next action: inspect updated narrow/wide previews. No commit, push or deployment is authorized.

Current alignment validation:

- `pnpm exec vitest run frontend/components/Controls/Dialog.test.tsx frontend/components/Layouts/PortfolioNavigation.test.tsx frontend/infrastructure/dom/NativeDialogBinding.test.ts`: PASS, 14/14. No component logic changed.
- `pnpm lint`, `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build` and `pnpm storybook:build`: PASS; production type checking and bootstrap freshness included. Existing Storybook warnings remain.
- `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /tmp/funkspace-fs31-revision.config.ts e2e/navigation-composition.spec.ts e2e/portfolio-settings.spec.ts --reporter=line --output=/tmp/funkspace-fs31-align-dev`: PASS, 18/18 current-source development checks.
- `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /tmp/funkspace-fs31-revision-production.config.ts e2e/navigation-composition.spec.ts e2e/portfolio-settings.spec.ts e2e/home.a11y.spec.ts --workers=2 --reporter=line --output=/tmp/funkspace-fs31-align-production`: PASS, 22/22. Matching centers asserted within 0.5 CSS pixels, with existing trigger geometry, themes, accessibility and short-screen checks preserved.
- `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /tmp/funkspace-fs31-revision-storybook.config.ts navigation.spec.ts --reporter=line --output=/tmp/funkspace-fs31-align-storybook`: PASS, 1/1 controlled Motion fixture against freshly built Storybook.
- Author diff inspection: only two layout stylesheets, focused browser tests and current documentation changed relative to the protected candidate. No generated drift, new effects/listeners, dependencies or shared dialog changes. Both complete and incremental patches are replayed in the handoff. This does not constitute independent review.

Previews show Navigation/Accessibility at 320×568, 768×1024 and 1280×720. Chromium-only automated evidence; Dimi's real-device acceptance is pending. Existing CSS-anchor fallback limitations remain for a partly scrolled desktop trigger in older browsers. Full unit/browser/Lighthouse suites from prior corrections were not rerun or claimed for this CSS-only correction. Task-owned test servers exited; existing user previews were preserved.

## Overlay heading and Close correction — 2026-09-24

Dimi explicitly requested removal of the visible "Navigation and settings" heading, keeping Close at the top right on mobile and top left on other screen sizes. This supersedes the earlier visible-title presentation requirement for this overlay only. Sites remains the sole implementation writer; no independent review or later task is started.

**Protected candidate:** branch `feature/funkspace-minimum-usable`, base `b78a4169e15edf8f549f04717151efa043c09e01`; all 43 prior candidate file hashes matched `artifacts/fs-3.1-revision/manifest.json` before editing. Prior candidate SHA-256 `a9cb43cea0a72e2da0e26fe7453a48b4a7332181a6c0a797156f6a70af38525a` is preserved. The new exact incremental/full diffs, file fingerprints, before-images, commands/results and previews live in `artifacts/fs-3.1-close-position/` in the local ChatGPT project workspace.

**Implementation:** existing Dialog gains optional `hideTitle` (default false). The title remains visually hidden for accessible naming; this mode supplies the existing Close ref as the default initial-focus target using the existing hook contract. Explicit consumer focus still takes precedence. The portfolio consumer opts in. Its compact, sticky Close row has no heading or separator; it aligns right below the existing 48rem breakpoint and left at/above it. The mobile category rail reserves the Close area. Shared Dialog's default visible title, binding, ports, scroll lock and dismissal lifecycle remain unchanged. No additional browser effect, service, dependency or motion setting.

**Evidence and acceptance:** the first development browser run passed 13/18; five existing portfolio checks still expected focus on the now-hidden heading. Those expectations now assert visible Close focus, matching the requested presentation. Focused Dialog/composition/binding tests passed 14/14. Final production, Storybook and build results are recorded in the new handoff. Earlier results below remain historical. Dimi owns visual/device acceptance; Codex owns a later explicitly requested read-only review. Next acceptance action is inspection of the updated narrow/wide previews. No commit, push or deployment is authorized.

Final checks for this heading/Close candidate:

- `pnpm test`: PASS, 97 files / 1,414 tests. `pnpm lint`: PASS, including formatting and theme-bootstrap freshness.
- `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build` and `pnpm storybook:build`: PASS, including production type checking. Existing Storybook chunk/directive warnings remain.
- `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /tmp/funkspace-fs31-revision-production.config.ts e2e/navigation-composition.spec.ts e2e/portfolio-settings.spec.ts e2e/home.a11y.spec.ts --workers=2 --reporter=line --output=/tmp/funkspace-fs31-close-production`: PASS, 22/22 on isolated production port 3300. Checks include hidden visual heading, retained accessible name, initial Close focus, mobile/tablet/desktop corner placement, exact Nav/Settings positioning, themes, long/enlarged/short content and Close after scrolling.
- `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /tmp/funkspace-fs31-revision-storybook.config.ts navigation.spec.ts dialog.spec.ts --reporter=line --output=/tmp/funkspace-fs31-close-storybook`: PASS, 17/17 on freshly built Storybook port 6606. Default visible-title dialogs and fixture-only Motion remain covered.
- Author diff/cleanup check: no dependency or generated drift; shared hook, native binding and ports unchanged. This is implementation self-checking, not the deferred independent review. Task-owned test servers exited; existing previews were preserved. Browser evidence is Chromium only; physical-device observations and Dimi acceptance remain pending. The earlier full browser/Lighthouse runs were not repeated for this bounded presentation change.

## Dimi's correction — 2026-09-24

**Current stage:** Sites implementation correction, one writer. Independent Codex review is still not requested. Dimi's six requested changes supersede the earlier visible-caption requirement in this record and the supplied detailed plan. The supplied reference file is not rewritten; current repository rules in AGENTS, the authoritative feature plan and FS-1.1/1.4 amendments record the new decision.

**Protected starting candidate:** branch `feature/funkspace-minimum-usable`, base `b78a4169e15edf8f549f04717151efa043c09e01`. All 39 existing changed-file hashes matched the prior `artifacts/fs-3.1/manifest.json` before editing. That candidate and its evidence remain preserved. The new handoff is `artifacts/fs-3.1-revision/` in the local ChatGPT project workspace, with before-images, an incremental patch, a full candidate patch and exact manifests. No commit, push, review, later stage or deployment is authorized.

### Correction decisions and contracts

- HexButton defaults to icon-only and supplies a meaningful icon-specific accessible name; explicit native naming still wins. Existing optional caption support remains for callers that deliberately need it. Production Nav/Settings and all category controls have no visible text field. Remove the obsolete `.menuButton` surface background entirely.
- Every category and Nav/Settings uses the same medium 72/36px artwork/icon and 76px square native target at normal text size. The existing shared launcher coordinates position the overlay trigger at the mobile bottom corner or tablet/desktop header. Categories extend upward on mobile and downward from the header; short screens can scroll the category rail independently so buttons retain their size.
- CSS anchoring follows a partially scrolled desktop trigger and responsive resizing without adding DOM measurement, listeners, state or changing the shared dialog binding. Shared coordinates are the fallback in browsers without CSS anchoring. See the [platform positioning reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/anchor). Older browsers without this feature retain header placement but do not track a partially scrolled desktop trigger exactly; real-device Safari/Firefox evidence is pending.
- Dialog adds an optional presentation `className` and an end-padding CSS variable for this consumer. The overlay reserves space for the rail, including the centered wide-shell inset. Its title and details use the dialog's own scroll area so enlarged headings cannot collapse the content viewport. The anchored Nav/Settings dismissal remains available while scrolling. Generic panel presentation, focus/scroll locking, ports and lifecycle remain unchanged.
- Detail controls keep the existing small outlined button target (at least 48px) with 16px semibold text and smaller horizontal spacing. Labels still wrap. Appearance retains ThemeService; Motion remains fixture-only; destinations, static navigation, logo, tokens, generated bootstrap and game boundaries remain protected.

### Correction validation and acceptance

Current correction evidence and final candidate fingerprints are recorded in the new handoff. The 2026-09-23 results below are historical and must not be used as proof for this correction.

- Focused component suite: 5 files / 22 tests passed. Full `pnpm test`: 97 files / 1,413 tests passed. `pnpm lint` passed, including bootstrap freshness and repository formatting.
- Current-source isolated development browser checks: 18/18 passed for phone/tablet/desktop, exact trigger dimensions/coordinates, resizing, partially scrolled header, short 320×320 with 200% text, theme choices and existing navigation behavior.
- Initial browser attempt reused an already running stale preview on port 3000: 3/6 failed the new no-caption assertion. This is not current-source evidence. Switched to a task-owned preview on port 3300 without stopping the existing server.
- The first isolated expanded layout run found four failures (14/18 passed): CSS precedence for the anchored header, insufficient room beneath enlarged headings, and wide-shell Close overlap. Fixed those presentation rules and preserved the tests. The subsequent 18/18 run passed; final production results are recorded in the handoff.
- Dimi's request is design direction and feedback on the prior candidate, not acceptance of this corrected candidate. Sites owns fixes and evidence; Codex owns a later explicitly requested read-only review; Dimi owns narrow/wide and real-device acceptance. No next task has started.

Final correction checks:

| Actual command                                                                                                                                                                                                                                  | Result                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm -F frontend exec tsc --noEmit --incremental false`                                                                                                                                                                                        | PASS.                                                                                                                                                                                               |
| `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build`                                                                                                                                                                                               | PASS, existing workspace prerequisites and production build.                                                                                                                                        |
| `pnpm storybook:build`                                                                                                                                                                                                                          | PASS, existing chunk-size/directive warnings only.                                                                                                                                                  |
| `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /tmp/funkspace-fs31-revision-production.config.ts --workers=2 --reporter=line --output=/tmp/funkspace-fs31-revision-production`                                        | PASS, 96/96, no retries. Existing production config with only isolated port/cwd/testDir overrides; archived configuration in handoff.                                                               |
| `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /tmp/funkspace-fs31-revision-storybook.config.ts navigation.spec.ts hex-button.spec.ts dialog.spec.ts --reporter=line --output=/tmp/funkspace-fs31-revision-storybook` | PASS, 29/29 against the freshly built static Storybook on port 6606.                                                                                                                                |
| `pnpm exec lhci autorun --config=/tmp/funkspace-fs31-revision-lighthouse.json` with installed Playwright Chromium as `CHROME_PATH`                                                                                                              | PASS, unchanged budgets, 3 desktop-preset homepage runs on port 3301: performance 100, LCP 685.54–694.43ms, CLS 0. Filesystem reports only. Exact environment command/config archived in handoff.   |
| `pnpm exec vitest run frontend/components/Layouts/PortfolioNavigation.test.tsx`                                                                                                                                                                 | PASS, 2/2 after removing a redundant empty-text assertion; exact empty text remains asserted.                                                                                                       |
| Author cleanup and diff inspection                                                                                                                                                                                                              | No new dependency, generated drift, lifecycle listeners/effects or changes to the protected binding/hook/ports. Both production and Storybook use current source. Independent review not performed. |

Production screenshots cover Navigation and Accessibility at 320×568, 768×1024 and 1280×720. They are preview evidence, not Dimi's observations. Automated browser coverage is Chromium only; theme-bootstrap's separate 17-case suite was not rerun for this presentation correction (freshness, unit and production theme regressions passed). Task-owned preview/test servers were stopped by their runners; pre-existing ports 3000/6006 were not stopped. The live preview opening returned `queued`, so the saved screenshots are the durable visual handoff. **Next acceptance action:** Dimi inspects narrow/wide presentation and phone behavior; Codex reviews the exact candidate only when explicitly requested.

## Original implementation record — 2026-09-23

## Task metadata

- **Status:** In progress — implementation delivered; independent review and Dimi acceptance pending.
- **Epic:** EPIC 3. Dependencies FS-2.6 and FS-1.6 have recorded acceptance.
- **Owner/current writer:** Sites implementation agent. Codex counterpart review explicitly not started. Dimi owns visual/product acceptance.
- **Date:** 2026-09-23.
- **Guidance:** [feature plan](../features/funkspace-minimum-usable.md), [workflow](../development/ai-workflow.md), [task template](../templates/task.md), [architecture](../architecture.md), [FS-1.6](fs-1.6-shared-dialog-primitive.md), [FS-2.6](fs-2.6-semantics-metadata-and-static-routes.md).

## Requested outcome and source distinction

Dimi explicitly requested implementation of the revised mobile-first concept together with FS-3.1. His current request supersedes the detailed plan's single-list layout: four category controls on the right, details on the left, full visible-screen coverage on every device, Navigation initially selected, Accessibility selectable, Chat-bot/Languages disabled. These two disabled categories are specifically requested exceptions to the plan's prohibition on unfinished destinations; they have no href or handler. No unfinished animation/game destinations are exposed.

Sources: supplied `/Users/dimi/Downloads/FunkSpace_EPIC_3_Detailed_Plan.md` (proposed execution context, not new authorization); `/Users/dimi/Desktop/scr_001.png` and `scr_002.png` wireframes; Figma project 490787975 and UI Library `o39DgxXnQ0jogb2ez6WKfq`, Icons page `6:2`. Figma context read for frames `8:96`, `72:58`, `72:145`; icon-node provenance is in the [icon README](../../frontend/components/Icons/README.md). Screenshots specify state/composition, not pixel-perfect production typography or acceptance.

## Repository evidence and protection

Checkout `/Users/dimi/Projects/funkspace-app`; branch `feature/funkspace-minimum-usable`; HEAD and cached upstream `b78a4169e15edf8f549f04717151efa043c09e01`. Starting `git status --short` was empty. No local changes needed preservation; no reset, commit, push, PR, deployment or external configuration is authorized. Historical plan SHAs were not used as reset targets.

Inspected root AGENTS.md (no nested guides found), authoritative feature plan, supplied EPIC 3 plan, workflow/template, prerequisite records, architecture/checklist, package scripts, actual PortfolioNavigation/Shell/CSS/destinations/legal links, Dialog/useDialog, HexButton, ThemeSwitcher, Icon, their tests/stories, browser configuration and existing portfolio/theme checks. Node 22.22.0 and pnpm 10.30.3 are installed. Production typechecking excludes Storybook and root E2E sources; those require separate build/browser evidence.

## Scope and implementation decisions

1. Import all twelve exact Figma SVG exports and extend the existing icon catalogue/gallery; preserve paths, source frames and per-instance IDs.
2. Compose the current overlay into Navigation/Accessibility with the wireframe rail. Add a visible Menu caption; keep the medium trigger target, top title/Close and one panel-content scroller. Retain ordinary anchors and existing destination identities.
3. Keep Appearance service-backed, with an opt-in outlined presentation. Motion takes only `value: "system" | "reduced" | "off"` and `onChange(value)`. Only the Storybook fixture supplies it; production does not render Motion controls, persist a preference or enable animation.
4. Cover composition, state, geometry, theme behavior, large text, long labels, narrow/wide layouts and regression behavior. Deliver exact patch plus screenshots; do not start independent review or FS-3.2.

### Contract changes

- `Dialog.presentation?: "panel" | "fullscreen"`, default panel: surface sizing only; no hook, port, native binding or lifecycle change.
- HexButton accepts the four verified category icon names and native `aria-pressed`; persistent selection is outlined blue, as in the wireframes. Existing default action buttons retain no pressed state.
- `ThemeSwitcher.presentation?: "default" | "outlined"`: same service subscription/update, new optional control treatment; existing consumers keep their presentation.
- `PortfolioNavigation.motion?: MotionChoicesProps` is optional presentation input, supplied only by the controlled story. No policy/readiness/storage authority is claimed.
- No destination URLs or identities change. Add future ready destinations to `portfolioDestinations` and compose their group alongside the existing primary/About/legal groups; no empty registry, new route, deep menu or game integration is introduced speculatively.

Protected: accepted theme bootstrap/generated pipeline, ThemeService/provider behavior, static navigation, logo geometry/static opt-out, tokens, packages/lockfile, game boundaries and shared dialog lifecycle. Legal/primary destination-focus cleanup remains FS-3.2; theme failure consistency remains FS-3.3.

## Validation and completion record

Candidate base remains `b78a4169e15edf8f549f04717151efa043c09e01`. The final handoff lives at `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.1/`; `candidate.patch` includes tracked and new files, and `manifest.json` records the complete changed-file list, exact patch SHA-256 and file fingerprints. This is an uncommitted candidate, not an approved revision.

### Automated evidence

| Actual command/action                                                                                                                                                                                                                                                                                               | Actual result and limits                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check:theme-bootstrap` before generation                                                                                                                                                                                                                                                                      | PASS; accepted generated artifact was fresh.                                                                                                                                                                    |
| `pnpm -F frontend exec tsc --noEmit --incremental false`                                                                                                                                                                                                                                                            | PASS after corrections. Does not include stories or root E2E files.                                                                                                                                             |
| `pnpm exec vitest run frontend/components/Layouts/PortfolioNavigation.test.tsx frontend/components/Layouts/PortfolioShell.test.tsx frontend/components/Controls/Dialog.test.tsx frontend/components/Controls/HexButton.test.tsx frontend/components/Icons/Icon.test.tsx frontend/components/ThemeSwitcher.test.tsx` | Initial focused composition run PASS, 23 tests. Later full coverage run includes the expanded icon tests.                                                                                                       |
| `pnpm coverage`                                                                                                                                                                                                                                                                                                     | PASS, 97 files / 1,409 tests; statements 87.13%, branches 82.14%, functions 81.25%, lines 89.05%. Thresholds unchanged.                                                                                         |
| `pnpm lint`                                                                                                                                                                                                                                                                                                         | PASS, including bootstrap freshness, Next lint and repository formatting. Final CSS corrections are rechecked in the final run.                                                                                 |
| `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build`                                                                                                                                                                                                                                                                   | PASS; tokens, common typecheck, standalone game build prerequisite and Next production build. Final build ID recorded in the handoff. No flag-on or game-runtime claim.                                         |
| `pnpm storybook:build`                                                                                                                                                                                                                                                                                              | PASS; Figma icon gallery and new production/controlled Motion/selected category/disabled category stories build. Existing Vite directive/sourcemap and large-chunk warnings remain.                             |
| `pnpm e2e e2e/navigation-composition.spec.ts e2e/portfolio-settings.spec.ts --workers=2 --reporter=line --output=/tmp/funkspace-fs31-browser-dev-final`                                                                                                                                                             | PASS, 14/14, before the final caption-clearance and hover-contrast corrections. Final production evidence supersedes these screenshots.                                                                         |
| `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config playwright.storybook.config.ts e2e/storybook/navigation.spec.ts e2e/storybook/dialog.spec.ts e2e/storybook/hex-button.spec.ts --reporter=line --output=/tmp/funkspace-fs31-storybook-browser`                                              | 28/29 PASS; one existing high-contrast dialog case timed out during a live preview refresh. No assertion was removed.                                                                                           |
| Same Storybook command scoped to `e2e/storybook/dialog.spec.ts --grep 'dark-high-contrast: resolved typography'`, output `/tmp/funkspace-fs31-storybook-rerun`                                                                                                                                                      | PASS, 1/1. Combined evidence covers all 29 distinct cases, not a single clean 29-test invocation.                                                                                                               |
| Same Storybook command scoped to `e2e/storybook/navigation.spec.ts`, output `/tmp/funkspace-fs31-storybook-final-browser`                                                                                                                                                                                           | PASS, 1/1 on final layout. Motion changes controlled state and resets on reload; no persisted motion setting.                                                                                                   |
| `pnpm e2e:theme-bootstrap --reporter=line --output=/tmp/funkspace-fs31-theme-bootstrap`                                                                                                                                                                                                                             | PASS, 17/17 production Chromium startup, storage/media-failure, reload, OS and no-JavaScript cases. Only navigation steps changed.                                                                              |
| `pnpm e2e:production --workers=2 --reporter=line --output=/tmp/funkspace-fs31-production-final`                                                                                                                                                                                                                     | PASS, 92/92 in one final run, no retries. Includes the four corrected regressions, all required routes with/without JavaScript, settings/theme/contrast and layout samples through 200% text.                   |
| Exact exported-asset byte comparison                                                                                                                                                                                                                                                                                | PASS, all 12 raw SVGs match downloaded Figma bytes; full catalogue tests compare source viewBoxes/path geometry and unique instance IDs.                                                                        |
| `CHROME_PATH=<installed Playwright Chromium executable> pnpm exec lhci autorun --config=.lighthouse/lighthouserc.off.json`                                                                                                                                                                                          | PASS, 3 local desktop-preset homepage runs; performance 100 each, LCP 685.73–690.26 ms, CLS 0. Existing 2500 ms / 0.1 budgets unchanged; filesystem reports only. Not field performance or open-overlay timing. |

Early type checks found an import-script closing tag and Testing Library option mismatch; both corrected. The first coverage run passed 1,385 tests but failed the function threshold (73.75%); extending source-geometry coverage to the full icon catalogue resolved it. Initial browser checks found an ambiguous Close selector (5 failures); it now matches the exact Close name. The first full production run had 88/92 PASS and four failures: default theme hover text contrast and focused-link overlap with the newly captioned mobile Menu. Fixes use the existing stronger text-hover token and increase only portfolio document scroll clearance. These failures are retained in the handoff, not relabeled PASS.

### Implementation self-review

The author inspected the final tracked/new-file diff against the architecture checklist: one overlay writer, existing Dialog/provider/destination/appearance foundations reused, no new infrastructure imports, services, dependencies, persistence or package boundary. Category artwork uses exported data; repeated SVG IDs are scoped. The additional CSS owns surface/layout/persistent visual state, not dialog resource ownership. Shared hook/port/native binding and generated token/bootstrap outputs have no diff. The production shell supplies no Motion props and keeps static logo opt-out. No duplicated settings authority, lifecycle listener or animation loop was added. Two local choice-group CSS treatments intentionally remain presentation-local rather than creating a settings framework. The brief's future navigation expansion can add ready shared destinations and groups without a new router or registry.

The final production screenshots show Navigation and Accessibility at 320×568 and 1280×720 CSS pixels. Normal narrow presentation keeps all five rail controls and the Menu caption visible; longer/enlarged content uses the existing panel scroller. Close remains in the title header. Build ID: `8Q0axy-emiY76Ker9MF9r`. No manual geometry recreation, remote runtime assets or source-map/palette migration was introduced.

This self-review is **not** the independent Codex read-only review, which Dimi explicitly deferred. Automated Chromium/emulated viewport evidence is **not** Dimi's phone/desktop observation, Safari/Firefox testing or assistive-technology acceptance.

**Next acceptance actions:** Sites finishes checks and self-review; Codex reviews the exact handed-off patch only when Dimi requests it; Dimi accepts/revises the narrow/wide hierarchy, labels, active states and menu caption. No Dimi observations, physical-device outcome or acceptance is inferred from automated screenshots. FS-3.2–3.6 and FS-G1 remain unstarted/pending as applicable.
