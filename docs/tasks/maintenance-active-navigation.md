# Current-page state in header and tree navigation

## Task metadata

- **Status:** Implementation delivered; scoped technical checks PASS. Dimi visual acceptance remains pending.
- **Date:** 2026-10-12.
- **Owner/current writer:** Codex.
- **Base:** `feature/funkspace-minimum-usable`, HEAD `83574b33183121c07513f5b63d6390161a5ca7ea`, with the uncommitted [header navigation/refinement](maintenance-main-navigation.md) preserved.
- **Related:** [feature plan](../features/funkspace-minimum-usable.md), [architecture](../architecture.md).

## Requested outcome

In both main navigation and the complete tree, the current page cannot be
selected again and its icon uses the hover color. Other routes remain usable.

## Evidence, scope and decisions

Inspected the shared row, Next route API, destination registry, navigation
handoff, Storybook route fixtures and the route/hydration/history regressions.
The existing shared row is the single owner of this presentation behavior.
Repository instructions and EPIC 3/4 contracts from this session still apply.

- Read the current pathname from Next's router; do not create another route
  authority, browser listener or service.
- Match exact page paths, normalizing trailing slashes. Query strings/fragments
  do not make another page active. Section-anchor links remain usable.
- Render the current item as a native disabled button with `aria-current="page"`,
  no URL or navigation handler. Keep its text weight and use the existing
  semantic hover color for its icon. Contact stays separately disabled.
- Preserve SSR/no-JavaScript rendering and hydration, cross-page focus, Back/
  Forward, intro/motion behavior, icon sizes and responsive layout.
- The user request supersedes current-page reselection and query-removal via
  self-links. Update those UI tests to assert prevention; retain the existing
  handoff implementation and its unit coverage rather than reopening EPIC 3.

## Plan and validation

1. Add current-page semantics to the shared row and route-specific stories.
2. Test exact matching, disabled activation, icon color, route changes, queries/
   fragments, history and static/hydrated behavior in both navigation surfaces.
3. Adapt affected browser tests to the new contract without weakening unrelated
   focus, overlay or history assertions.
4. Run types, lint, unit tests, isolated production/Storybook builds and affected
   browser checks; record candidate evidence, limitations and handoff.

No commit, push, deployment, new Contact functionality or shared-service change
is authorized by this task.

## Completion record

### Delivered behavior

`PortfolioNavigationRow` reads the current pathname for both surfaces. Matching
page items are disabled native buttons marked `aria-current="page"`; their
icons use `--fs-color-action-hover`. Contact remains disabled without being
marked current. The tree stylesheet also supplies a forced-colors treatment.
No navigation service, destination, lifecycle ownership or motion policy changed.

Main/tree stories now supply route context and include About/Aperture examples.
The layout README and feature plan record the new contract. New shared-row and
browser tests cover exact paths, route changes and nonactivation. Existing
navigation/query tests now assert current-page prevention while retaining
cross-route focus, scroll, overlay, query-history and Back/Forward checks.
The no-JavaScript scene test distinguishes disabled navigation controls from
interactive scene controls.

### Exact candidate and evidence

- Base HEAD remains `83574b33183121c07513f5b63d6390161a5ca7ea`.
- Aggregate binary patch SHA-256 (tracked and untracked changes, excluding this
  record): `00f663ca8a8f4a4d2206dd5791dafa481c626c7c51b071e74245775d3bb646c3`.
  This includes the preserved uncommitted header-navigation/refinement work;
  it is not a claim that every changed file originated in this task.
- Local evidence directory:
  `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/active-navigation`.
  Contains `candidate.patch`, per-file hashes, build/browser logs, temporary
  browser configurations and 12 header screenshots.
- Production/Storybook builds used an isolated copy at
  `/private/tmp/funkspace-active-nav-checkout`, preserving the existing development
  server. All 10 changed frontend implementation/story files match that copy
  byte-for-byte. Production build ID: `whTIsXtz7IigGrpURvq51`.

### Checks and results

- Frontend TypeScript and `pnpm typecheck:validation`: PASS.
- `pnpm lint`: PASS (theme bootstrap, ESLint and repository formatting).
- `pnpm test`: PASS, 121 files / 1,862 tests, including 10 new shared-row cases.
- Isolated `NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm build`: PASS.
- Isolated `pnpm storybook:build`: PASS.
- Development browser checks: 32 PASS (active, main and query navigation).
- Production Chromium: 136 PASS across active/main navigation, query handling,
  tree, composition, lifecycle, hydration, transitions, portfolio navigation and
  homepage intro. A final 20-case run passed the 17 active-navigation cases again
  after strengthening the click-position/scroll assertion, plus three affected
  animation-page cases. Total distinct production coverage: **139 cases**.
- Built Storybook Chromium: 15 PASS, covering four themes at 320/768/1280px and
  three route-specific active stories. Inspected mobile light and desktop dark
  screenshots; active icon color and previous responsive layout are preserved.
- Current-state production checks include no JavaScript, delayed hydration,
  query/fragment URLs, real pointer nonactivation, client route changes and
  Back/Forward. Theme checks verify icon and label colors in both surfaces.
- Final lint/formatting, validation types and `git diff --check`: PASS;
  137 local links in the three updated documentation files resolve. Temporary
  production/Storybook servers have stopped; the user's development server was
  preserved.

### Limits and handoff

Technical PASS applies to the stated candidate and scoped checks. It does not
constitute Dimi acceptance or completion of EPIC 4.7/4.8. Review the current-page
appearance in both navigations; the development preview remains available at
`http://localhost:3000`.

No new flag-off production build, Lighthouse run, full browser suite,
Safari/Firefox or physical-device check was performed for this change. Earlier
task measurements remain historical. Existing Next lint deprecation and
Storybook chunk-size warnings remain advisory. Forced-colors styling was added
but was not visually checked in an operating-system high-contrast session.

No commit, push or deployment was performed. The earlier header work and this
active-state change remain together in the working tree for review.

## Follow-up — reveal the current page's group

**Status:** Delivered; scoped technical PASS, Dimi acceptance pending.
Dimi reported that Home's animation More link reaches
the detail page, but opening navigation hides its selected item inside a closed
Animations disclosure.

Inspection confirmed that every group unconditionally starts closed. The bounded
fix uses the same exact destination matcher as the active row to open the
current page's ancestor groups, including on server rendering. Native toggling
remains available; route changes reset the disclosures to the new page's group.
No service, overlay or motion ownership changes are needed. The existing
ApertureActive story will demonstrate the expanded state.

### Follow-up changes and validation

- Changed `PortfolioNavigationTree.tsx` to open current ancestors and reset
  disclosures on pathname changes. Shared the existing exact-page matcher via
  `portfolioDestinations.ts` with `PortfolioNavigationRow.tsx`. Native toggle
  input before hydration is explicitly preserved; no effects or browser adapters
  were added. The layout README documents the behavior.
- Extended tree unit tests and active-navigation browser tests. Updated the
  Storybook active-state assertion and affected query/lifecycle/native-tree
  tests to account for groups already being open.
- Frontend types, validation types, lint, formatting and diff checks: PASS.
- Focused components: 4 files / 22 tests PASS. Full unit suite: 121 files /
  **1,864 tests PASS**.
- Isolated flag-on production and Storybook builds: PASS. Production build ID
  `gHB72deNRU5S5BR3RGEV8`; all 11 changed implementation/story files match the
  isolated build source. Existing Next lint and Vite chunk warnings remain.
- Production Chromium: **68 distinct cases PASS** across active navigation,
  query handling, tree, hydration and lifecycle. The first run had 67 passes
  and one stale native-tree assumption (it closed the newly auto-opened Privacy
  group). After correcting that test, all five tree cases passed on rerun.
- The exact Home → More → menu flow passes at 375px and 1280px, including
  manual keyboard toggling, navigation away and Back. Direct/no-JavaScript
  entry reveals current items; delayed hydration preserves a user-closed group.
- Development Chromium: 26 initial passes plus two corrected More-flow passes.
  The initial new test incorrectly expected menu-style focus handoff from the
  existing native More link; it now checks destination arrival and visibility.
  Existing cross-route menu focus assertions remain intact.
- Built Storybook: **15 cases PASS**, including ApertureActive with its parent
  group open automatically. No additional story is needed for the same state.

### Follow-up candidate and handoff

Base HEAD remains `83574b33183121c07513f5b63d6390161a5ca7ea`. Aggregate patch
SHA-256, excluding this record:
`3f1a1ee04669bf1c1dbeb25eecb8aaa19e19f5b42fd8d81324a8c6abebd732ce`.
It includes earlier uncommitted work. The preceding candidate/results in this
record remain historical. Current patch, file hashes and logs are retained in
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/current-navigation-group`.

No Lighthouse, flag-off rebuild, full E2E suite or additional browser/device
matrix was run for this bounded disclosure change; no performance or broader
EPIC acceptance is claimed. Dimi can review Home → More → navigation at
`http://localhost:3000`. The existing preview is preserved. No commit, push or
deployment was performed.

## Final combined review and delivery authorization — 2026-10-12

Reviewed all 28 changed/new files together against base
`83574b33183121c07513f5b63d6390161a5ca7ea`. No actionable findings were identified
in source, architecture, accessibility/navigation contracts, tests or docs.
Review did not repair or modify application source.

- Fresh production Chromium run: **170/170 PASS** in 3.6 minutes, zero retries.
  Scope: active/main navigation, query handling, tree, composition, lifecycle,
  hydration, transitions, portfolio navigation, homepage intro, responsive
  layout and settings. Build ID: `gHB72deNRU5S5BR3RGEV8`.
- All 11 changed implementation/story files match the isolated production
  source. Reviewed patch SHA-256, excluding this record:
  `3f1a1ee04669bf1c1dbeb25eecb8aaa19e19f5b42fd8d81324a8c6abebd732ce`.
  Subsequent delivery edits affect documentation only; this hash identifies
  the pre-delivery-documentation candidate, not the eventual Git commit.
- Review checked 140 local documentation links and diff formatting. Retained
  passing evidence above covers 1,864 unit tests, types, lint, production and
  Storybook builds, and 15 Storybook browser cases; these were inspected rather
  than rerun during review.
- Fresh review log: `/private/tmp/funkspace-review.log`; browser artifacts:
  `/private/tmp/funkspace-review-results`. Existing hover-contrast assertion
  failure and Lighthouse advisory remain documented separately; this is not
  a full-browser-suite or physical-device acceptance claim.

Dimi then explicitly authorized the documentation update, commit and push of
all combined changes to `feature/funkspace-minimum-usable`. The commit containing
this section identifies the delivered source; its hash and push result belong
in the final handoff. Earlier no-commit/no-push statements above describe the
historical implementation stages. Visual acceptance, EPIC 4.7/4.8 completion
and deployment remain separate facts.
