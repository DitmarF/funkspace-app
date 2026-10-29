# Section variants and homepage Contact removal

## Task metadata

- **Status:** Implementation delivered; scoped technical checks PASS. Dimi visual acceptance is not yet recorded; the pre-existing broader-suite failure below remains separate.
- **Task group:** EPIC 4 refinement, before further FS-4.7/4.8 acceptance work.
- **Owner/current writer:** Codex; product acceptance: Dimi.
- **Last updated:** 2026-10-12.
- **Base:** clean `feature/funkspace-minimum-usable`, HEAD `71511616fa17e2d5cff2ab8843df5f119d8f4b4d`.
- **Related:** [feature plan](../features/funkspace-minimum-usable.md), [architecture](../architecture.md), [AI workflow](../development/ai-workflow.md).

## Requested outcome and acceptance criteria

- Reuse two section appearances across FunkSpace: SVG corners for control-rich experiences; plain sections for simple content and a few buttons.
- Keep WEB/Start cornered and make About plain.
- Update Storybook and documentation.
- Remove the homepage Contact section; its new concept belongs to EPIC 5.

## Context and repository evidence

Read root AGENTS, README/package scripts, architecture and relevant token/experience ADRs, AI workflow/task template, current feature status, EPIC 3 closure/API handoff and the supplied `/Users/dimi/Downloads/FunkSpace_EPIC_4_Detailed_Plan.md`. The supplied historical revision is not a reset target. Current code already implements later scene policy amendments; the older plan's Reduced/Off rules do not supersede them. Existing FS-4.7 partial review evidence remains historical evidence, not completion.

`PortfolioSection` already owns all four corner SVGs and shared token padding. Start, AboutPreview and the old Contact component consume it. Contact also has primary/footer/recovery links and extensive navigation regression coverage. Legal pages separately use the supplied email address.

The supplied Figma folder could not be read through the web reader. This task preserves the current repository SVG artwork; no new Figma fidelity or visual approval is claimed.

## Scope, decisions and protected areas

- Extend the existing presentation component with `variant="plain" | "cornered"`; default plain. No parallel component system. Both variants retain spacing, native section props and caller-owned accessible labels/headings.
- Remove Contact from the homepage, primary navigation, footer, recovery links and active destination registry so no dead anchor remains. Preserve legal-page email content and icon assets. EPIC 5 designs its replacement separately.
- Preserve ordinary scrolling, theme tokens, intro, four motion choices, local Pause, shared Dialog and navigation/hydration lifecycle. No application/domain/infrastructure, token or bootstrap changes are planned.
- Keep existing navigation regressions meaningful with surviving destinations and explicit fragment fixtures where needed; do not lower assertions or remove coverage to accommodate Contact removal.
- No publication, commits, remote writes, new dependencies, scene tuning or new contact functionality.

## Implementation and validation plan

1. Add the variant contract, select variants in Start/About, and remove dead Contact entry points.
2. Add reusable component stories/tests; update affected route/navigation tests and current feature documentation.
3. Run bootstrap freshness, frontend/validation types, lint, affected unit tests, production and Storybook builds, and relevant production browser checks. Review theme/mobile/enlarged-text/static behavior, final diff and local documentation links.

Primary risk: navigation tests depend on the removed destination and the shorter homepage changes available scroll distance. Preserve actual focus, history and visibility assertions with appropriate surviving targets.

## Completion record

### Delivered behavior and contracts

`PortfolioSectionProps.variant` is the only new public component input. `plain`
is the default; `cornered` renders the existing four SVGs. Start selects cornered;
AboutPreview selects plain. Padding, corner geometry, semantic color, native
props and focus targets stay unchanged. The two appearances add no service,
effect, scheduler, state or dependency.

Removed the unused Contact component, its story and its component test together
with the homepage, primary/footer/recovery links and destination entry. Legal
email content and reusable Contact icon assets remain. Legacy scroll-snap demo
fixtures remain isolated examples, not active homepage destinations.

Added Plain, Cornered and HomepageSections stories, component/SSR assertions,
and production/Storybook browser checks. Navigation regressions now use About,
Home, legal pages and the surviving About fragment. About's longer text can
legitimately scroll when Tab reaches More; redirected-fragment checks still
assert initial section focus, next-Tab destination, visibility and no later
focus/scroll override. Same-route query removal, history and delayed hydration
remain covered. The existing About route's five sections replace a stale
zero-section expectation. The updated isolated soft-redirect fixture is
type-checked; hard-redirect browser cases run against production.

### Validation and limits

- `pnpm check:theme-bootstrap`: PASS before any generation.
- `pnpm test`: PASS, 120 files / 1,852 tests. The removed Contact-only test is
  replaced by section-contract and integrated Contact-absence assertions.
- `pnpm -F frontend exec tsc --noEmit --incremental false`: PASS.
- `pnpm typecheck:validation`: PASS after test corrections.
- `pnpm lint`: PASS after formatting. Existing Next lint deprecation remains.
- `pnpm build`: PASS; isolated explicit flag-on build also PASS, build ID
  `vRxAAZ414q7nNZjTI21fJ`.
- `pnpm storybook:build`: PASS. Existing Vite chunk-size warning remains.
- Built Storybook, Chromium: 8 PASS (both variants, 320/1280 widths, four
  themes). Geometry equality, keyboard access and overflow assertions pass.
  Screenshots inspected for narrow high contrast and wide plain content.
- First 50 scoped production checks: 46 PASS initially; four test adaptations
  corrected (long About next-Tab scrolling and no-JS text-size injection).
  Six-case rerun PASS, including all four affected cases.
- Broader 153-case flag-on run: 138 PASS initially. Corrected test expectations
  for four remaining corner marks, the detailed About section count and native
  email-link focus on the legal page; a 31-case navigation/responsive rerun PASS
  covers all 15 initially failing cases (including one timeout). No production
  code or assertion threshold changed during those corrections. Together these
  runs establish 203 distinct scoped flag-on production checks passing.
- Actual flag-off build: PASS, build ID `gcKjiVu9tsggfHxsWne6Z`. Its 12 focused
  section/policy checks PASS with `FS35_AVAILABLE=false`. Total scoped production
  coverage: 203 flag-on + 12 flag-off cases, plus 8 built-Storybook cases.
- Lighthouse: three runs per actual build, same throttling/settings/assertions,
  with only ports and filesystem report destinations changed. On: LCP
  3,106.6–3,120.1 ms, CLS 0; score 0.81–0.82, aggregate 0.82 WARN. Off: LCP
  448.5–452.3 ms, CLS 0, score 1.00. Both satisfy the configured 5,000 ms LCP and
  0.1 CLS error limits. This is local desktop smoke evidence, not new Xperia
  acceptance or a replacement for FS-4.7's complete performance review.
- Existing `home.a11y.spec.ts` default-theme hover assertion: FAIL at contrast
  3.0204 versus 4.5. Reproduced identically against untouched HEAD, isolated build
  `gHzYmrwtCFuUD0mHfNoXh`; no source/test threshold change made. Current controls
  use 24px text and another existing navigation test documents the approved
  large-text pairing. Reconciliation belongs to the existing accessibility owner;
  this task does not declare the full repository browser suite green.

The first production browser startup collided with the already-running dev
server's `.next` output. The run was abandoned; all actual production evidence
uses a disposable source copy on port 3107. The mixed cache was moved aside and
the existing dev server rebuilt it without source-byte or environment changes;
the original preview returned HTTP 200. One broader run was also canceled after
discovering its `FS35_AVAILABLE` expectation did not match the true build flag;
its failures are not product findings. Subsequent runs explicitly match flags.

Technical verification and Dimi visual acceptance remain separate facts. No
Safari/Firefox/physical Xperia verification or FS-4.7/4.8 closure is claimed.
No commit, push, deployment or live email occurred.

### Candidate and change inventory

Base remains `71511616fa17e2d5cff2ab8843df5f119d8f4b4d`. The source/test/story/docs
patch (excluding this self-record) has SHA-256
`5d4d3d8ad6a6100dad62348469cf4be0f4fe5389ef6b985167ca40bc1dda5962`.
The actual patch, per-file hashes and logs are retained at
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/section-variants/`.
This is a local handoff artifact, not a repository or published URL. Changed
production source bytes were compared with the isolated build source and match.

- Presentation: `frontend/components/Layouts/PortfolioSection.tsx`,
  `PortfolioShell.tsx`, `frontend/components/sections/Start.tsx`,
  `AboutPreview.tsx`, `frontend/app/page.tsx`, `frontend/app/not-found.tsx`.
- Destination data: `frontend/data/portfolioDestinations.ts`,
  `portfolioNavigation.ts`.
- Removed: `frontend/components/sections/Contact.tsx`, `Contact.stories.tsx`,
  `Contact.test.tsx`.
- Component stories/tests: new `PortfolioSection.stories.tsx` and
  `PortfolioSection.test.tsx`; updated `PortfolioShell.test.tsx`,
  `PortfolioNavigation.test.tsx`, `PortfolioNavigationTree.test.tsx`,
  `portfolioDestinations.test.ts`.
- Browser coverage: new `e2e/portfolio-sections.spec.ts` and
  `e2e/storybook/portfolio-section.spec.ts`; updated affected About, legal,
  intro, navigation, settings, responsive, static-route and scene-visibility
  regressions plus the isolated redirect fixture. The manifest names each file.
- Documentation: this record, the feature plan amendment and
  `frontend/components/Layouts/README.md`.

### Cleanup and architecture review

Self-review against the repository architecture checklist finds no new boundary,
service, dependency, settings authority or runtime. All implementation changes
are Presentation/data composition. Domain, Application, Infrastructure, games,
tokens, generated outputs, motion policy, intro and Dialog implementation bytes
remain unchanged in Git. No test skips, lowered thresholds, lockfile changes or
unrelated refactor were introduced. Initial checkout was clean; no unrelated
user patch was overwritten. Local Markdown file links resolve (133 references).

### Browser command record

The retained temporary configs start the candidate on port 3107, built Storybook
on 6107 and untouched HEAD on 3111; they preserve the repository browser project
and assertions, use two production workers (one Storybook/baseline worker), and
set retries to zero. Logs and the exact configs accompany `candidate.patch`.
The isolated source copy was built with explicit
`NEXT_PUBLIC_ANIMATIONS_ENABLED=true` and then `false`; changing only the test
expectation variable was never used as evidence of a different compiled flag.

```bash
pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /private/tmp/funkspace-sections.playwright.config.ts e2e/portfolio-sections.spec.ts e2e/navigation-lifecycle.spec.ts e2e/navigation-query-removal.spec.ts e2e/contact-legal.spec.ts
pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /private/tmp/funkspace-sections.playwright.config.ts e2e/portfolio-sections.spec.ts e2e/navigation-lifecycle.spec.ts --grep 'hard-navigation redirected|section variants'
FS35_AVAILABLE=true pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /private/tmp/funkspace-sections.playwright.config.ts e2e/about.spec.ts e2e/epic3-integration.spec.ts e2e/home-intro.spec.ts e2e/navigation-composition.spec.ts e2e/navigation-hydration.spec.ts e2e/navigation-transition.spec.ts e2e/navigation-tree.spec.ts e2e/portfolio-navigation.spec.ts e2e/portfolio-responsive.spec.ts e2e/portfolio-settings.spec.ts e2e/start-scene.spec.ts e2e/static-route-contract.spec.ts
FS35_AVAILABLE=true pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /private/tmp/funkspace-sections.playwright.config.ts e2e/portfolio-navigation.spec.ts e2e/portfolio-responsive.spec.ts
FS35_AVAILABLE=false pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /private/tmp/funkspace-sections.playwright.config.ts e2e/portfolio-sections.spec.ts e2e/start-scene.spec.ts --grep 'section variants|actual build flag'
pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /private/tmp/funkspace-sections-storybook.playwright.config.ts portfolio-section.spec.ts
FS35_AVAILABLE=true pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /private/tmp/funkspace-sections-baseline.playwright.config.ts home.a11y.spec.ts --grep 'default:'
pnpm exec lhci autorun --config=/private/tmp/funkspace-sections-lhci-on.json
pnpm exec lhci autorun --config=/private/tmp/funkspace-sections-lhci-off.json
```

### Handoff

Dimi can review the two variants in **Layouts/PortfolioSection** and the actual
homepage. Next work is the requested visual feedback cycle; FS-4.7/4.8 acceptance
and EPIC 5's contact concept remain separate. The accessibility owner should
reconcile the existing hover assertion with the accepted current control
contract without silently weakening it. No further code change is proposed in
this task. Owned validation servers are stopped; the original development
preview remains available.

### Follow-up: tablet and desktop section spacing (2026-10-12)

Dimi requested halving the homepage section spacing on tablet and desktop.
Against the same base HEAD, `frontend/app/page.module.css` changes only
`--section-gap: calc(var(--fs-space-3xl) * 3)` to
`--section-gap: calc(var(--fs-space-3xl) * 1.5)` inside the existing
`min-width: 48rem` media query. Mobile spacing is unchanged; bottom padding
continues to use the same section-gap variable.

Validation: Prettier checks for the CSS and this record, plus `git diff --check`,
pass. This CSS-only follow-up does not rerun the earlier production/browser
suite; its candidate hash and browser evidence above describe the prior
candidate before this spacing adjustment. Visual acceptance remains separate.

### Full change review and commit handoff (2026-10-12)

Reviewed all 40 modified, deleted and new files against base HEAD
`71511616fa17e2d5cff2ab8843df5f119d8f4b4d`, including the spacing follow-up.
No actionable findings were identified. Section variants, Contact deferral,
Storybook, documentation and revised navigation regressions match the requested
scope. No source repairs were made during review. Shared services, motion and
navigation implementation, architecture boundaries and generated outputs remain
unchanged.

Fresh review validation on the candidate including the spacing adjustment:

- `pnpm lint`: PASS, including bootstrap freshness and repository formatting.
- `pnpm -F frontend exec tsc --noEmit --incremental false`: PASS.
- `pnpm typecheck:validation`: PASS.
- Focused Vitest run of `PortfolioSection`, `PortfolioShell`,
  `PortfolioNavigation`, `PortfolioNavigationTree` and `portfolioDestinations`:
  5 files / 14 tests PASS.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test e2e/portfolio-sections.spec.ts --reporter=line --output=/private/tmp/funkspace-current-review-results --workers=1`:
  4 Chromium tests PASS against the existing development preview, with and
  without JavaScript at 320px and 1280px.
- Additional Chromium measurements at 320, 767, 768 and 1280px: section gap and
  trailing padding are 64px below the breakpoint and 96px at/above it; no
  horizontal overflow, four Start corners, no About corners and no Contact
  target or links.
- `git diff --check`: PASS.

Production/Storybook builds, Lighthouse and the complete browser suite were not
rerun for this review. Their earlier results above remain tied to the earlier
candidate. The pre-existing hover-contrast assertion failure remains separate;
no Safari/Firefox/physical-device or FS-4.7/4.8 acceptance is claimed.

Dimi subsequently authorized updating documentation, committing and pushing all
current changes to `feature/funkspace-minimum-usable`. This authorization does
not record visual acceptance or authorize deployment. The commit containing
this record identifies the final candidate; the earlier patch hash is historical.
