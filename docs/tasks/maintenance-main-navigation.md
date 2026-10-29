# Header main navigation and disabled Contact

## Task metadata

- **Status:** Implementation delivered; scoped technical checks PASS, Lighthouse advisory warning retained. Dimi visual acceptance remains separate.
- **Date:** 2026-10-12.
- **Owner/current writer:** Codex; product acceptance: Dimi.
- **Base:** `feature/funkspace-minimum-usable`, `83574b33183121c07513f5b63d6390161a5ca7ea`; clean checkout.
- **Related:** [feature plan](../features/funkspace-minimum-usable.md), [section refinement](maintenance-section-variants.md), [architecture](../architecture.md).

## Requested outcome

Add Home, About and disabled Contact to the header, right-aligned beside the
desktop settings hex. On mobile keep these controls at the top right and the
settings hex at the bottom right. Match the tree's borderless, icon-left rows.
Restore Contact in the tree as a disabled button. Update Storybook and docs.

## Inspected evidence and decisions

Read the existing shell, tree, navigation data, row styles, focus-handoff port
and adapter, tests and Storybook configuration. The current shell reserves the
desktop launcher gutter and preserves a no-JavaScript disclosure. Root AGENTS,
architecture/ADRs, workflow/template, EPIC 3 handoff and the supplied EPIC 4
plan remain the constraints from this session. The historical plan revision is
not a reset target. The repository's current artwork supplies the requested
style; no new Figma fidelity claim is made.

- Reuse one data set for the three first-level entries and one row renderer for
  header and tree; keep existing pending category entries unchanged.
- Home and About remain links to `/` and `/about`. Contact is a native disabled
  button without a URL, click handler or tab stop. It does not restore the
  homepage Contact section or implement EPIC 5.
- Header links use the provider-owned navigation handoff for destination focus.
  No service construction, disposal, browser scheduling or new authority.
- Header navigation participates in the existing content reveal sequence.
- At narrow widths the header navigation occupies a top row above the logo;
  its controls can wrap under enlarged text. Desktop keeps logo and links in
  one grid row with space reserved for the existing hex launcher.
- New work supersedes only the previous removal of the Contact navigation row;
  completed EPIC 3 work and section spacing/variants remain unchanged.

## Plan and validation

1. Share row rendering/data and add the responsive header navigation.
2. Cover SSR/disabled semantics, route and repeated-route focus, mobile/desktop
   geometry, enlarged text, themes, no-JavaScript behavior and intro regression.
3. Add component/header stories and document the current contract.
4. Run freshness, types, lint, affected tests, isolated production and Storybook
   builds and browser checks; inspect the final diff and screenshots.

No commit, push or deployment is included in this new task. Prior authorization
applied to the previous candidate. FS-4.7/4.8 acceptance remains separate.

## Completion record

### Delivered contract

The header now provides native Home/About links and a disabled Contact button.
The same Contact button is last in the tree. `PortfolioMainNavigation` and
`PortfolioNavigationTree` consume shared first-level data and
`PortfolioNavigationRow`; compact rows remove only the disclosure-arrow gutter.
Both variants retain responsive 24/36px icon artwork, semantic colors, typography,
hover/focus rules and disabled behavior. No destination for Contact was added.

The header reserves the existing desktop launcher space. Mobile places the
right-aligned navigation row above the logo, while the hex stays bottom right.
The new links use the shared handoff and the existing content-reveal marker;
they do not initialize or dispose services. Native links/buttons work before
hydration and without JavaScript. No Domain, Application, Infrastructure,
generated files, motion choices, section gaps or scene code changed.

### Files and candidate

- New presentation files: `PortfolioMainNavigation.tsx`, its CSS module and
  Storybook stories, plus `PortfolioNavigationRow.tsx` in
  `frontend/components/Layouts/`.
- Updated presentation/data: shell and tree components/styles,
  `frontend/data/portfolioNavigation.ts`.
- Coverage: shell/tree component assertions, new production and Storybook
  `main-navigation.spec.ts` files, and narrowly updated intro/settings selectors
  for the additional header links.
- Documentation: this task record, the feature plan amendment and Layouts README.

Base remains `83574b33183121c07513f5b63d6390161a5ca7ea`. The exact patch,
including new files but excluding this self-record, has SHA-256
`c855579014af6fb04e60f324f629e54c615b1d61839e2c5c31725a89be169f15`.
The patch, file hashes, logs, temporary test configs and inspected header
screenshots are retained locally at
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/main-navigation/`.
Production and Storybook source bytes match the isolated build copy.

### Validation results

- Bootstrap freshness: PASS before generation.
- Frontend type check with `--noEmit --incremental false`: PASS.
- `pnpm typecheck:validation`: PASS after correcting the new test's reduced-motion
  context option; PASS again with the Storybook test included.
- `pnpm lint`: PASS; existing Next lint deprecation only.
- Focused shell/tree/navigation tests: 3 files / 10 tests PASS.
- `pnpm test`: all 120 files / 1,852 tests PASS.
- Isolated `NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm build`: PASS; build ID
  `vAxNSm4eaQjW3S4hVjA_S`.
- Isolated `pnpm storybook:build`: PASS; existing Vite chunk-size warning.
- Production Chromium: all 127 scoped cases PASS, covering new header behavior,
  native disabled Contact, no-JavaScript pages, repeated route focus, history,
  four themes, header accessibility scan, 200% text, safe areas, tree behavior,
  hydration, intro fail-open/reveal and settings lifecycle.
- Built Storybook Chromium: all 12 cases PASS across 320/768/1280px and all four
  themes. Keyboard traversal skips Contact; header screenshots inspected at
  narrow light and wide high contrast, plus development mobile/tablet layouts.
- Initial development run: four cases passed; three no-JavaScript cases failed
  because a test selector matched nested disclosures. The selector was narrowed
  to the outer disclosure; all seven new tests subsequently passed in production.
- Documentation content and 135 local file links: checked; formatting and diff
  checks PASS.
- Lighthouse on the actual flag-on build: 3 local desktop runs, repository
  throttling/assertions unchanged. LCP 3,131.3–3,138.0 ms and CLS 0 PASS the
  5,000 ms / 0.1 error limits. Performance 0.81–0.82, aggregate 0.82 WARN against
  the 0.90 advisory target, consistent with the earlier candidate's advisory
  warning. This is smoke evidence, not physical-device performance acceptance.

Production browser command (temporary config preserves the normal Chromium
project, uses two workers, zero retries and an isolated server on port 3107):

```bash
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /private/tmp/funkspace-main-nav.playwright.config.ts e2e/main-navigation.spec.ts e2e/navigation-tree.spec.ts e2e/navigation-hydration.spec.ts e2e/navigation-lifecycle.spec.ts e2e/navigation-composition.spec.ts e2e/home-intro.spec.ts e2e/portfolio-responsive.spec.ts e2e/portfolio-settings.spec.ts
PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /private/tmp/funkspace-main-nav-storybook.playwright.config.ts main-navigation.spec.ts
pnpm exec lhci autorun --config=/private/tmp/funkspace-main-nav-lhci-on.json
```

### Review and limits

Self-review found no blocking scope or architecture issues. The shared row
extraction has two actual consumers; no dependency, second service or general
navigation manager was introduced. Existing tests retain their assertions;
identity selectors now target the logo's accessible label because the header
contains a second Home link. Disabled Contact is explicitly asserted in both
landmarks. No threshold or test skip was added.

This is scoped Chromium verification, not a full repository browser-suite pass.
The earlier documented hover-contrast assertion failure was not rerun or repaired
here. No new flag-off production build, Safari/Firefox, physical-device or
FS-4.7/4.8 acceptance is claimed. The header changes no availability policy;
no-JavaScript/static paths were exercised on the actual flag-on build.

Storybook **Layouts/PortfolioMainNavigation / InHeader** and the development
homepage provide the visual-review handoff. Dimi acceptance is not recorded.
All owned validation servers on 3107/3108/6107 stopped. The original development
preview remains running; no commit, push, deployment or persistent environment
change was made for this task.

## Responsive refinement after Dimi's feedback — 2026-10-12

Dimi requested one-step smaller desktop header icons, double the gap between
tablet/desktop buttons, and clarified the mobile layout as **logo left, buttons
stacked vertically right**, with the logo vertically centered beside the stack.
This supersedes the earlier mobile row-above-logo description in this record.

- Header icons now use the existing 24px artwork at all widths. The complete
  tree retains its original 24px mobile / 36px desktop artwork.
- At `48rem` and above the inter-button gap is `2 × --fs-space-md` (32px at
  normal text size), replacing `--fs-space-md` (16px).
- Below `48rem`, buttons form a vertical stack with aligned icon/label columns.
  The logo is vertically centered in the left column; it may shrink to preserve
  readable navigation labels with enlarged text. The settings hex remains at
  bottom right. Existing route, disabled Contact and reveal behavior is unchanged.

The focused browser assertions now check real icon artwork/size, the doubled
gap, stacked row geometry and logo centering. Earlier candidate hashes, builds,
127-case regression results and Lighthouse measurements above predate these
CSS refinements and are retained as historical evidence.

Refinement validation:

- Lint, frontend types, validation types and 10 affected component tests: PASS.
- Final isolated production and Storybook builds: PASS. Actual flag-on build ID:
  `wDRo2oj5fZnl9HI355WWD`.
- Final production Chromium: 10 PASS (all seven header cases plus three narrow
  responsive cases covering themes, enlarged text and no JavaScript).
- Final built Storybook Chromium: 12 PASS (three widths, four themes, keyboard
  traversal and disabled Contact).
- Inspected mobile and tablet header screenshots, including 320px at 200% text.
  Narrow enlarged text retains full labels by allowing the logo to shrink.
- Formatting, documentation and diff review: PASS. No new architecture or
  service changes. The full 127-case run and Lighthouse were not repeated for
  this CSS-only refinement; their evidence above remains historical.

Final patch SHA-256, including new files and excluding this self-record:
`7285d12e455c28bd4862a3ac5d6fb1cf266154ca6cc1ab36379d8a7c4e470913`.
Build source bytes match the final working candidate. The patch and new logs/
screenshots are stored in the `refinement/` subdirectory of the local artifact
directory above. Production browser checks used the same temporary config with
`e2e/main-navigation.spec.ts e2e/portfolio-responsive.spec.ts` and
`--grep 'header navigation|header and tree|320×568'`; Storybook used the same
12-case command against the rebuilt output.

Visual acceptance remains separate. No commit, push or deployment was performed.

## Final combined review and delivery authorization — 2026-10-12

The subsequent [active-navigation task](maintenance-active-navigation.md) adds
disabled current-page items, hover-colored current icons and automatic expansion
of their ancestor groups. It supersedes the earlier Home/About always-link and
repeated-route selection descriptions in this historical record. The responsive
refinement above remains the current header layout.

The combined 28-file working candidate received a source, architecture, test and
documentation review with no actionable findings. A fresh isolated production
Chromium run passed all 170 scoped cases, including header layout, active state,
group expansion, keyboard/focus lifecycle, history, hydration, homepage intro,
themes, safe areas and enlarged text. See the linked record for the exact build,
candidate identity and retained evidence.

Dimi explicitly authorized updating documentation, committing and pushing the
combined changes after that review. Earlier no-commit/no-push statements record
the preceding task boundaries; they are not current restrictions. This
authorization does not imply deployment or EPIC 4.7/4.8 acceptance.
