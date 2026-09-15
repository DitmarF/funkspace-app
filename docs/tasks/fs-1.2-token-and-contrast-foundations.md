# Task FS-1.2 — Token and contrast foundations

## Task metadata

- **Status:** Complete — foundation corrections validated, Sites consumer review passed, and Dimi accepted all corrections on 2026-09-15; [actual decision](#dimi-acceptance--2026-09-15).
- **Stage/owner:** Acceptance and authorized commit/push; Codex is the only writer. Sites completed the separate consumer review; Dimi approved visible changes.
- **Base:** `feature/funkspace-minimum-usable`, `655f53857ebf55da57e928532e8c74b9990881cc`, initially clean checkout at `/Users/dimi/Projects/funkspace-app`.
- **Last updated:** 2026-09-15.
- **Prerequisites:** [accepted FS-1.1 contract](fs-1.1-asset-and-component-contract.md#dimi-contract-decision--2026-09-15), [FS-0.2 command evidence](fs-0.2-tooling-baseline.md), [feature scope](../features/funkspace-minimum-usable.md), [workflow](../development/ai-workflow.md), [task template](../templates/task.md), [token ADR](../decisions/ADR-002-design-token-source-of-truth.md).

## Requested outcome and scope

Reconcile required source tokens and bindings, measure rendered failures before repair, remove both contrast suppressions with their causes, and verify generated CSS/TypeScript and downstream consumers. Only foundation corrections and necessary existing-consumer mappings are authorized. No component families, palette redesign, hierarchy migration, dependency changes, commits, pushes or deployment.

### Acceptance criteria

- [x] Required values classified and fonts/spacing verified in browser and Storybook.
- [x] Actual before/after rendered pairings recorded across all four themes.
- [x] Narrow source/consumer repairs; no replacement suppression.
- [x] Generation repeated and all generated/game-facing differences reviewed.
- [x] Current types/lint/tests/builds, unfiltered smoke and focused pairing checks recorded.
- [x] Separate Sites review incorporated by Codex.
- [x] Dimi accepts visible corrections against the exact candidate.

## Inspection and implementation plan

Read root AGENTS (no nested instruction files), README, workflow/template, accepted contract, feature task, FS-0.2 and supplied `/Users/dimi/Downloads/FunkSpace_EPIC_1_Detailed_Plan.md`. Its proposed archive path remains absent; document content does not expand this task's authorization. Inspected active `style-dictionary.config.mjs`, all token sources/outputs, Tailwind, local fonts, global styles, Storybook preview/config, Button/callers/stories, ThemeSwitcher, logo sandbox, both filtered tests, bootstrap readiness contract and package/build/test configuration.

1. Capture baseline from the unchanged app and Storybook plus explicitly temporary contract-pairing fixtures.
2. Correct source typography, add required spacing bindings, and repair only demonstrated color/consumer mismatches.
3. Replace filtered assertions with unfiltered checks and observable theme/font readiness; add focused rendered-pairing coverage.
4. Generate twice, inspect every output difference, run package/browser/game regression checks, and record the exact handoff.

Protected: ThemeService/bootstrap sources and generated bootstrap bytes, logo assets/geometry/IDs, primitive palette, motion/game sources, package exports, game isolation, unrelated scales and existing Button API. Theme-bootstrap freshness passed before dev/build scripts invoked their established generator; no startup source change is planned.

## Baseline evidence

Local evidence directory: `/private/tmp/fs-1.2-evidence/`. Node `v22.22.0`, pnpm `10.30.3`, installed Chromium, desktop 1280×800, light OS preference; each application palette selected explicitly. Raw JSON records computed foreground/background ancestor chains, sizes, weights and ratios. Storybook's existing Button renders Times despite app Work Sans headings / Space Grotesk body. Default ThemeSwitcher hover: white on `rgb(204,103,59)`, 3.770:1. Existing Button default-theme hover: white on primitive `rgb(59,148,204)`, 3.337:1. Both are ordinary control text requiring 4.5:1.

Initial probe failures were harness issues: a click before hydration did not apply, then axe required an explicit browser context. Corrected probes wait for rendered `aria-pressed` selection and use `browser.newContext()`. Early axe captures also exposed intermediate color-transition failures; Sites later confirmed this defect and Codex removed unsafe color interpolation. Final checks cover transition frames as well as settled styles. No failed probe is a passing check.

## Binding decisions and bounded repairs

| Need / source                                                       | Classification                                   | Foundation decision                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base/sans family in `tokens/fs.tokens.json`                         | Source drift                                     | Replace Inter with the approved Space Grotesk family. Preserve the existing self-hosted Next font variable as the primary loaded face; source family is its fallback.                                                                                                                                                                                                                     |
| Work Sans display/control-label family                              | Missing source role                              | Add only `--fs-font-family-display`, matching the existing `font-display` consumer and accepted T1. No font download or role swap.                                                                                                                                                                                                                                                        |
| Storybook typography                                                | Missing binding                                  | Import the existing `app/fonts.ts` and attach both variable classes to the preview document root. Existing Vite/Next font handling emits the fonts; no new loader, duplicated @font-face declarations or staticDirs workaround.                                                                                                                                                           |
| `space-xs/md/lg/2xl`                                                | Missing Tailwind binding                         | Add `fs-xs/md/lg/2xl` under `theme.extend.spacing`. Existing scales/scanning stay unchanged. Button/ThemeSwitcher use source-bound 8px vertical/gap and 16px horizontal padding with unchanged values. 24px group spacing and 48px minimum are available for the later approved controls.                                                                                                 |
| Font sizes sm/md/xl; weights 400/500/600; line heights normal/tight | Already suitable source values                   | Reuse existing CSS variables for the contract samples. Current Button stays at its existing 14px/600; FS-1.3 owns the accepted 24px/500 change. No 40px/72px token or component size API added here.                                                                                                                                                                                      |
| Default semantic `action-hover`                                     | Demonstrated failing source pairing              | Change only default `#cc673b` to `#9c4b2b`; inverse text becomes 4.870:1. Primitive orange/blue and other theme hover fills remain unchanged.                                                                                                                                                                                                                                             |
| Primary Button hover and on-action text                             | Wrong consumer mapping                           | Use semantic `action-hover` and `content-inverse`, replacing primitive-blue hover and theme-dependent `white`. ThemeSwitcher uses the same inverse foreground.                                                                                                                                                                                                                            |
| Neutral Button hover                                                | Wrong consumer pairing                           | Use `content-primary / surface-elevation-1`; hover switches together to `content-inverse / surface-elevation-2`. This follows S2's semantic treatment and avoids the contract's demonstrated primary-on-elevation-2 failures.                                                                                                                                                             |
| Dark focus on elevation-1                                           | Demonstrated failing source pairing              | Alias dark `border-focus` to existing dark `border-strong`: `#3b94cc` → `#cccccc`. All existing Button/ThemeSwitcher focus rings use the focus role, 2px width/offset. No new focus token.                                                                                                                                                                                                |
| Help/error/status/link and disabled fixtures                        | Existing roles suitable with corrected selection | Use readable `content-primary` on each panel, explicit Help/Error/Pending/outcome wording, underlined links and `border-strong` field boundaries. Disabled sample uses neutral surface/content plus native disabled and “Unavailable”. Do not select the identical disabled foreground/background tokens or failing feedback/link combinations. No form or status components implemented. |
| New color roles                                                     | No demonstrated need after mapping repairs       | None added. Existing feedback, link, disabled and other palette values are preserved; their names alone do not establish a readable combination.                                                                                                                                                                                                                                          |

### Loaded and computed font evidence

`font-platform-evidence.json` records Chromium's actual platform fonts, not just CSS declarations: app heading uses custom Work Sans, app body and Storybook's current Button use custom Space Grotesk. The font metadata calls the variable file “Space Grotesk Light”; the computed weight and selected variable instance remain 500/600, not a forced light style. Existing loaders expose Work Sans 100–900 and Space Grotesk 300–700. The application fixture verifies Work Sans 24px/500 and 16px/600 control-label samples, alongside the unchanged body role. Storybook changes from computed Times to its loaded local Space Grotesk face. Final control typography/layout remains FS-1.3/FS-1.4 and Dimi's visible review.

## Rendered before/after evidence

Evidence comes from the unchanged-base app/Storybook (`before-rendered.json`), before-repair contract fixtures (`before-pairings.json`), settled after-repair existing components (`after-settled-rendered.json`) and production E2E attachments (`after-fixture-<theme>.json`). JSON contains element/state, computed colors, ancestor compositing, font and unrounded ratio. Table ratios below are rounded for display only; assertions compare unrounded values. Raw evidence and screenshots are in the local handoff bundle; these tables preserve the conclusions in the task workflow.

Use 4.5:1 for ordinary labels/help/status; the 30px/700 headings qualify for 3:1, and even the large 24px fixture is held to the stronger 4.5 project target. Authored meaningful boundaries/focus use 3:1. Disabled controls have an exception, but the chosen readable fixture also passes 4.5. Logo/brand exceptions do not justify faint control labels. See [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

All measured control/panel fills are opaque. Transparent control/ancestor backgrounds are composited over the actual panel/body. Existing `surface-overlay` tokens are opaque; there is no implemented translucent shared-dialog backdrop in scope, so no invented overlay result. The focused helper rejects images and group opacity. A future translucent consumer needs its own rendering evidence.

Keyboard focus was reached through keyboard modality and actual focus, with asserted solid 2px outline/2px offset. The offset gap means both colors immediately adjacent to the ring are the panel surface; a same-colored filled control does not touch the ring. Hover and momentary pointer-down were exercised. Pending/error+focus examples are fixtures; no real submission or selection behavior is claimed. Native disabled samples remain explicitly unavailable. Early baseline focus/disabled probe rows were not independently verified for pseudo-state and are excluded from the before/after comparison; after-focus evidence is asserted by the tests.

No production control currently consumes the 36-unit Menu icon. The accepted inverse-on-action foreground/background is measured here (also exceeding 3:1); actual icon geometry, decorative semantics and hit area remain Sites' FS-1.4 check. This is not a claimed rendered Menu-component pass.

| Theme              | Actual consumer/state     | Before FG / BG    | Ratio  | After FG / BG     | Ratio  | Target |
| ------------------ | ------------------------- | ----------------- | ------ | ----------------- | ------ | ------ |
| default            | theme choice, selected    | #ffffff / #3b47cc | 7.097  | #e6e6e6 / #3b47cc | 5.686  | 4.5    |
| default            | theme choice, default     | #3b47cc / #e6e6e6 | 5.686  | #3b47cc / #e6e6e6 | 5.686  | 4.5    |
| default            | theme choice, hover       | #ffffff / #cc673b | 3.770  | #e6e6e6 / #9c4b2b | 4.870  | 4.5    |
| dark               | theme choice, selected    | #000000 / #3b94cc | 6.294  | #1a1a1a / #3b94cc | 5.216  | 4.5    |
| dark               | theme choice, default     | #3b94cc / #1a1a1a | 5.216  | #3b94cc / #1a1a1a | 5.216  | 4.5    |
| dark               | theme choice, hover       | #000000 / #cc8668 | 7.177  | #1a1a1a / #cc8668 | 5.948  | 4.5    |
| muted              | theme choice, selected    | #ffffff / #1e2466 | 14.005 | #ffffff / #1e2466 | 14.005 | 4.5    |
| muted              | theme choice, default     | #1e2466 / #ffffff | 14.005 | #1e2466 / #ffffff | 14.005 | 4.5    |
| muted              | theme choice, hover       | #ffffff / #66331e | 10.208 | #ffffff / #66331e | 10.208 | 4.5    |
| dark-high-contrast | theme choice, selected    | #000000 / #4abaff | 9.759  | #000000 / #4abaff | 9.759  | 4.5    |
| dark-high-contrast | theme choice, default     | #4abaff / #000000 | 9.759  | #4abaff / #000000 | 9.759  | 4.5    |
| dark-high-contrast | theme choice, hover       | #000000 / #ffa882 | 11.175 | #000000 / #ffa882 | 11.175 | 4.5    |
| default            | Button primary, default   | #ffffff / #3b47cc | 7.097  | #e6e6e6 / #3b47cc | 5.686  | 4.5    |
| default            | Button primary, hover     | #ffffff / #3b94cc | 3.337  | #e6e6e6 / #9c4b2b | 4.870  | 4.5    |
| dark               | Button primary, default   | #000000 / #3b94cc | 6.294  | #1a1a1a / #3b94cc | 5.216  | 4.5    |
| dark               | Button primary, hover     | #000000 / #3b94cc | 6.294  | #1a1a1a / #cc8668 | 5.948  | 4.5    |
| muted              | Button primary, default   | #ffffff / #1e2466 | 14.005 | #ffffff / #1e2466 | 14.005 | 4.5    |
| muted              | Button primary, hover     | #ffffff / #1e2466 | 14.005 | #ffffff / #66331e | 10.208 | 4.5    |
| dark-high-contrast | Button primary, default   | #000000 / #4abaff | 9.759  | #000000 / #4abaff | 9.759  | 4.5    |
| dark-high-contrast | Button primary, hover     | #000000 / #4abaff | 9.759  | #000000 / #ffa882 | 11.175 | 4.5    |
| default            | Button secondary, default | #1a1a1a / #e6e6e6 | 13.945 | #1a1a1a / #b3b3b3 | 8.301  | 4.5    |
| default            | Button secondary, hover   | #1a1a1a / #cccccc | 10.838 | #e6e6e6 / #4d4d4d | 6.773  | 4.5    |
| dark               | Button secondary, default | #e6e6e6 / #1a1a1a | 13.945 | #e6e6e6 / #4d4d4d | 6.773  | 4.5    |
| dark               | Button secondary, hover   | #e6e6e6 / #333333 | 10.123 | #1a1a1a / #b3b3b3 | 8.301  | 4.5    |
| muted              | Button secondary, default | #000000 / #ffffff | 21.000 | #000000 / #ffffff | 21.000 | 4.5    |
| muted              | Button secondary, hover   | #000000 / #ffffff | 21.000 | #ffffff / #000000 | 21.000 | 4.5    |
| dark-high-contrast | Button secondary, default | #ffffff / #000000 | 21.000 | #ffffff / #000000 | 21.000 | 4.5    |
| dark-high-contrast | Button secondary, hover   | #ffffff / #000000 | 21.000 | #000000 / #ffffff | 21.000 | 4.5    |

### Contract fixture pairings

| Theme / surface                  | Pairing        | Before FG / BG    | Ratio  | Selected FG / BG  | Ratio  | Target              |
| -------------------------------- | -------------- | ----------------- | ------ | ----------------- | ------ | ------------------- |
| default / background             | body           | #1a1a1a / #e6e6e6 | 13.945 | #1a1a1a / #e6e6e6 | 13.945 | 4.5                 |
| default / background             | help           | #4d4d4d / #e6e6e6 | 6.773  | #1a1a1a / #e6e6e6 | 13.945 | 4.5                 |
| default / background             | error          | #cc3b3e / #e6e6e6 | 3.947  | #1a1a1a / #e6e6e6 | 13.945 | 4.5                 |
| default / background             | status         | #1a1a1a / #e6e6e6 | 13.945 | #1a1a1a / #e6e6e6 | 13.945 | 4.5                 |
| default / background             | success        | #3bcc62 / #e6e6e6 | 1.683  | #1a1a1a / #e6e6e6 | 13.945 | 4.5                 |
| default / background             | warning        | #ccca3b / #e6e6e6 | 1.393  | #1a1a1a / #e6e6e6 | 13.945 | 4.5                 |
| default / background             | info           | #3b47cc / #e6e6e6 | 5.686  | #1a1a1a / #e6e6e6 | 13.945 | 4.5                 |
| default / background             | link           | #7a3bcc / #e6e6e6 | 5.060  | #1a1a1a / #e6e6e6 | 13.945 | 4.5                 |
| default / background             | disabled       | #808080 / #808080 | 1.000  | #1a1a1a / #b3b3b3 | 8.301  | Exempt; project 4.5 |
| default / background             | focus ring     | #3b47cc / #e6e6e6 | 5.686  | #3b47cc / #e6e6e6 | 5.686  | 3                   |
| default / background             | field boundary | #333333 / #e6e6e6 | 10.123 | #333333 / #e6e6e6 | 10.123 | 3                   |
| default / elevation-1            | body           | #1a1a1a / #b3b3b3 | 8.301  | #1a1a1a / #b3b3b3 | 8.301  | 4.5                 |
| default / elevation-1            | help           | #4d4d4d / #b3b3b3 | 4.032  | #1a1a1a / #b3b3b3 | 8.301  | 4.5                 |
| default / elevation-1            | error          | #cc3b3e / #b3b3b3 | 2.350  | #1a1a1a / #b3b3b3 | 8.301  | 4.5                 |
| default / elevation-1            | status         | #1a1a1a / #b3b3b3 | 8.301  | #1a1a1a / #b3b3b3 | 8.301  | 4.5                 |
| default / elevation-1            | success        | #3bcc62 / #b3b3b3 | 1.002  | #1a1a1a / #b3b3b3 | 8.301  | 4.5                 |
| default / elevation-1            | warning        | #ccca3b / #b3b3b3 | 1.206  | #1a1a1a / #b3b3b3 | 8.301  | 4.5                 |
| default / elevation-1            | info           | #3b47cc / #b3b3b3 | 3.385  | #1a1a1a / #b3b3b3 | 8.301  | 4.5                 |
| default / elevation-1            | link           | #7a3bcc / #b3b3b3 | 3.012  | #1a1a1a / #b3b3b3 | 8.301  | 4.5                 |
| default / elevation-1            | disabled       | #808080 / #808080 | 1.000  | #1a1a1a / #b3b3b3 | 8.301  | Exempt; project 4.5 |
| default / elevation-1            | focus ring     | #3b47cc / #b3b3b3 | 3.385  | #3b47cc / #b3b3b3 | 3.385  | 3                   |
| default / elevation-1            | field boundary | #333333 / #b3b3b3 | 6.026  | #333333 / #b3b3b3 | 6.026  | 3                   |
| dark / background                | body           | #e6e6e6 / #1a1a1a | 13.945 | #e6e6e6 / #1a1a1a | 13.945 | 4.5                 |
| dark / background                | help           | #b3b3b3 / #1a1a1a | 8.301  | #e6e6e6 / #1a1a1a | 13.945 | 4.5                 |
| dark / background                | error          | #cc686a / #1a1a1a | 4.770  | #e6e6e6 / #1a1a1a | 13.945 | 4.5                 |
| dark / background                | status         | #e6e6e6 / #1a1a1a | 13.945 | #e6e6e6 / #1a1a1a | 13.945 | 4.5                 |
| dark / background                | success        | #3bcc62 / #1a1a1a | 8.287  | #e6e6e6 / #1a1a1a | 13.945 | 4.5                 |
| dark / background                | warning        | #ccca68 / #1a1a1a | 10.124 | #e6e6e6 / #1a1a1a | 13.945 | 4.5                 |
| dark / background                | info           | #68ccbb / #1a1a1a | 9.070  | #e6e6e6 / #1a1a1a | 13.945 | 4.5                 |
| dark / background                | link           | #9368cc / #1a1a1a | 4.221  | #e6e6e6 / #1a1a1a | 13.945 | 4.5                 |
| dark / background                | disabled       | #808080 / #808080 | 1.000  | #e6e6e6 / #4d4d4d | 6.773  | Exempt; project 4.5 |
| dark / background                | focus ring     | #3b94cc / #1a1a1a | 5.216  | #cccccc / #1a1a1a | 10.838 | 3                   |
| dark / background                | field boundary | #cccccc / #1a1a1a | 10.838 | #cccccc / #1a1a1a | 10.838 | 3                   |
| dark / elevation-1               | body           | #e6e6e6 / #4d4d4d | 6.773  | #e6e6e6 / #4d4d4d | 6.773  | 4.5                 |
| dark / elevation-1               | help           | #b3b3b3 / #4d4d4d | 4.032  | #e6e6e6 / #4d4d4d | 6.773  | 4.5                 |
| dark / elevation-1               | error          | #cc686a / #4d4d4d | 2.317  | #e6e6e6 / #4d4d4d | 6.773  | 4.5                 |
| dark / elevation-1               | status         | #e6e6e6 / #4d4d4d | 6.773  | #e6e6e6 / #4d4d4d | 6.773  | 4.5                 |
| dark / elevation-1               | success        | #3bcc62 / #4d4d4d | 4.025  | #e6e6e6 / #4d4d4d | 6.773  | 4.5                 |
| dark / elevation-1               | warning        | #ccca68 / #4d4d4d | 4.917  | #e6e6e6 / #4d4d4d | 6.773  | 4.5                 |
| dark / elevation-1               | info           | #68ccbb / #4d4d4d | 4.405  | #e6e6e6 / #4d4d4d | 6.773  | 4.5                 |
| dark / elevation-1               | link           | #9368cc / #4d4d4d | 2.050  | #e6e6e6 / #4d4d4d | 6.773  | 4.5                 |
| dark / elevation-1               | disabled       | #808080 / #808080 | 1.000  | #e6e6e6 / #4d4d4d | 6.773  | Exempt; project 4.5 |
| dark / elevation-1               | focus ring     | #3b94cc / #4d4d4d | 2.533  | #cccccc / #4d4d4d | 5.264  | 3                   |
| dark / elevation-1               | field boundary | #cccccc / #4d4d4d | 5.264  | #cccccc / #4d4d4d | 5.264  | 3                   |
| muted / background               | body           | #000000 / #ffffff | 21.000 | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / background               | help           | #000000 / #ffffff | 21.000 | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / background               | error          | #661e1f / #ffffff | 11.861 | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / background               | status         | #000000 / #ffffff | 21.000 | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / background               | success        | #1e6631 / #ffffff | 7.000  | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / background               | warning        | #66481e / #ffffff | 8.364  | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / background               | info           | #1e2466 / #ffffff | 14.005 | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / background               | link           | #3d1e66 / #ffffff | 13.325 | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / background               | disabled       | #808080 / #808080 | 1.000  | #000000 / #ffffff | 21.000 | Exempt; project 4.5 |
| muted / background               | focus ring     | #1e2466 / #ffffff | 14.005 | #1e2466 / #ffffff | 14.005 | 3                   |
| muted / background               | field boundary | #000000 / #ffffff | 21.000 | #000000 / #ffffff | 21.000 | 3                   |
| muted / elevation-1              | body           | #000000 / #ffffff | 21.000 | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / elevation-1              | help           | #000000 / #ffffff | 21.000 | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / elevation-1              | error          | #661e1f / #ffffff | 11.861 | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / elevation-1              | status         | #000000 / #ffffff | 21.000 | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / elevation-1              | success        | #1e6631 / #ffffff | 7.000  | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / elevation-1              | warning        | #66481e / #ffffff | 8.364  | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / elevation-1              | info           | #1e2466 / #ffffff | 14.005 | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / elevation-1              | link           | #3d1e66 / #ffffff | 13.325 | #000000 / #ffffff | 21.000 | 4.5                 |
| muted / elevation-1              | disabled       | #808080 / #808080 | 1.000  | #000000 / #ffffff | 21.000 | Exempt; project 4.5 |
| muted / elevation-1              | focus ring     | #1e2466 / #ffffff | 14.005 | #1e2466 / #ffffff | 14.005 | 3                   |
| muted / elevation-1              | field boundary | #000000 / #ffffff | 21.000 | #000000 / #ffffff | 21.000 | 3                   |
| dark-high-contrast / background  | body           | #ffffff / #000000 | 21.000 | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / background  | help           | #ffffff / #000000 | 21.000 | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / background  | error          | #ff8284 / #000000 | 8.778  | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / background  | status         | #ffffff / #000000 | 21.000 | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / background  | success        | #4aff7a / #000000 | 15.876 | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / background  | warning        | #fffd82 / #000000 | 19.624 | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / background  | info           | #82ffea / #000000 | 17.441 | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / background  | link           | #b882ff / #000000 | 7.675  | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / background  | disabled       | #808080 / #808080 | 1.000  | #ffffff / #000000 | 21.000 | Exempt; project 4.5 |
| dark-high-contrast / background  | focus ring     | #4abaff / #000000 | 9.759  | #4abaff / #000000 | 9.759  | 3                   |
| dark-high-contrast / background  | field boundary | #ffffff / #000000 | 21.000 | #ffffff / #000000 | 21.000 | 3                   |
| dark-high-contrast / elevation-1 | body           | #ffffff / #000000 | 21.000 | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / elevation-1 | help           | #ffffff / #000000 | 21.000 | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / elevation-1 | error          | #ff8284 / #000000 | 8.778  | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / elevation-1 | status         | #ffffff / #000000 | 21.000 | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / elevation-1 | success        | #4aff7a / #000000 | 15.876 | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / elevation-1 | warning        | #fffd82 / #000000 | 19.624 | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / elevation-1 | info           | #82ffea / #000000 | 17.441 | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / elevation-1 | link           | #b882ff / #000000 | 7.675  | #ffffff / #000000 | 21.000 | 4.5                 |
| dark-high-contrast / elevation-1 | disabled       | #808080 / #808080 | 1.000  | #ffffff / #000000 | 21.000 | Exempt; project 4.5 |
| dark-high-contrast / elevation-1 | focus ring     | #4abaff / #000000 | 9.759  | #4abaff / #000000 | 9.759  | 3                   |
| dark-high-contrast / elevation-1 | field boundary | #ffffff / #000000 | 21.000 | #ffffff / #000000 | 21.000 | 3                   |

## Generated-output and boundary review

The active generator remains `style-dictionary.config.mjs`. `pnpm build:tokens` ran twice, with SHA-256 equality for `styles/tokens.css` and all three `common/generated/*.ts` files; later Storybook/root builds preserved the same hashes.

- CSS: base family correction, one display-family addition, default hover correction and dark focus alias only.
- TypeScript `colors.ts`: only default semantic `action-hover` and dark semantic `border-focus` resolved values change.
- Every primitive and game-layer value is unchanged. Game source aliases refer to action-primary/feedback/surface roles, not the two edited roles. Motion output, theme names/default, public exports and token sources for motion/game are unchanged.
- Bootstrap source and generated bytes match base; freshness passes before and after standard dev/build scripts. No theme-service or bootstrap regeneration was used to conceal stale source.
- Architecture review: presentation mappings, shared token data, preview font binding and test fixtures only. No dependency, package API, domain, infrastructure, renderer, game or logo change.

## Command evidence

All commands run from the repository root with installed Node 22.22.0/pnpm 10.30.3. Browser runs use installed Chromium with `PLAYWRIGHT_BROWSERS_PATH=0`; local telemetry disabled where applicable. No install or browser download.

| Check                                                                                                                 | Result / evidence                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check:theme-bootstrap`                                                                                          | PASS before and after; bootstrap bytes unchanged.                                                                                                                                                                                                                                                                                                                                         |
| `pnpm build:tokens` twice; hash comparison                                                                            | PASS; `generate-1.log`, `generate-2.log`, `generated-1.sha256`.                                                                                                                                                                                                                                                                                                                           |
| `pnpm -F @funkspace/common typecheck`; `pnpm -F @funkspace/wave-survivor build`; `pnpm -F frontend exec tsc --noEmit` | PASS in required prerequisite order.                                                                                                                                                                                                                                                                                                                                                      |
| `pnpm lint`                                                                                                           | PASS; `lint.log`. Existing Next lint deprecation only.                                                                                                                                                                                                                                                                                                                                    |
| `pnpm test`                                                                                                           | PASS: 84 files / 1,305 tests; `test.log`.                                                                                                                                                                                                                                                                                                                                                 |
| `pnpm storybook:build` before/after                                                                                   | PASS; existing chunk-size warnings. Browser confirms actual font delivery and current Button rendering.                                                                                                                                                                                                                                                                                   |
| `pnpm build`                                                                                                          | PASS; token generation → common types → frontend script's bootstrap/game build → Next; `build.log`.                                                                                                                                                                                                                                                                                       |
| Focused `playwright test e2e/home.a11y.spec.ts e2e/foundation-pairings.spec.ts --reporter=line --workers=1`           | PASS: 8 tests, all four themes; `focused-browser-2.log`. The first attempt's extra null-storage assertion failed, then was removed because current normalization is best effort, not readiness.                                                                                                                                                                                           |
| Same focused selection against explicitly served production build, JSON reporter                                      | PASS: 8 tests, zero failures/skips/retries; `production-focused.json` with 184 fixture pairing records. No dev-server result is presented as production evidence.                                                                                                                                                                                                                         |
| `pnpm e2e`                                                                                                            | PASS: 14 tests; `e2e.log`. Both home and logo assertions use unfiltered axe violations.                                                                                                                                                                                                                                                                                                   |
| `pnpm test:theme-bootstrap`                                                                                           | PASS: 5 files / 56 tests; dedicated startup/DOM coverage 100% statements/branches/functions/lines.                                                                                                                                                                                                                                                                                        |
| `pnpm e2e:theme-bootstrap`                                                                                            | PASS: 17 production tests, including storage/media failures; `theme-bootstrap-e2e.log`.                                                                                                                                                                                                                                                                                                   |
| `pnpm -F @funkspace/wave-survivor typecheck`, `test`, `demo:build`                                                    | PASS; dedicated game test 58 files / 920 tests; game logs.                                                                                                                                                                                                                                                                                                                                |
| `playwright test --config playwright.demo.config.ts`                                                                  | PASS: 18 standalone game browser checks; `game-demo-e2e.log`.                                                                                                                                                                                                                                                                                                                             |
| Extra direct E2E TypeScript check                                                                                     | FAIL — pre-existing type-version mismatch. Root runner resolves Playwright 1.55.1; axe resolves 1.56.1. TS2739 reports missing `consoleMessages/pageErrors/requests`. An in-memory check of both untouched HEAD tests reproduces the same error (`baseline-e2e-types.log`). No cast, suppression or dependency change added. Runtime suites and required frontend/common/game types pass. |
| Lighthouse, physical device, Safari/Firefox, assistive-technology and final visual acceptance                         | NOT RUN. No new app font/resource or layout feature; no performance or device-acceptance claim. These remain separate acceptance evidence.                                                                                                                                                                                                                                                |

The initial probe's click-before-hydration and missing browser-context errors were corrected in the probe. A baseline-type diagnostic initially resolved TypeScript from the root where it is not installed; rerunning with the existing frontend compiler reproduced the actual pre-existing mismatch. These are recorded as harness failures, not application defects.

## Completion record and consumer-review handoff

- **Outcome:** FS-1.2 complete — scoped foundation corrections implemented and validated, separate Sites review passed, and Dimi accepted all corrections on 2026-09-15.
- **Files changed:** source `tokens/fs.tokens.json`; generated `styles/tokens.css` and `common/generated/colors.ts`; Tailwind; canonical Storybook preview; existing Button and ThemeSwitcher mappings; both axe test files; new `e2e/helpers/foundation.ts`, `e2e/foundation-pairings.spec.ts`, `e2e/storybook/foundations.spec.ts` and `playwright.storybook.config.ts`; existing Playwright config excludes that separately served suite; this task record and feature status. No package/lockfile/font asset/logo/bootstrap/game-source change.
- **Contract/API changes:** add display-family source and four spacing bindings; correct two semantic values and selected consumer pairings. Existing Button props/ref/default type and ThemeSwitcher selection behavior are preserved. FS-1.1's accepted dimensions/typography are not implemented ahead of FS-1.3.
- **Sites review request:** review this exact local patch on base `655f53857ebf55da57e928532e8c74b9990881cc`, the binding/pairing tables and actual source/output changes. Inspect current Button/ThemeSwitcher plus Storybook's loaded fonts and focus/hover in all themes. Report precise source/consumer findings; do not edit shared foundations or assume a synchronized checkout.
- **Next owner:** Codex records acceptance and performs the explicitly authorized commit/push. Sites owns the next component stage when Dimi separately starts FS-1.3.
- **Tooling follow-up:** Codex/Dimi own separate Playwright/axe type alignment; no unsafe bypass is proposed.
- **Cleanup:** final diff, evidence packaging and owned-server cleanup are recorded below. Implementation/review stages performed no commit or push; Dimi subsequently authorized both in the acceptance record below. No PR, merge or publication is authorized by that acceptance.

## Separate Sites consumer review and correction — 2026-09-15

Sites reviewed the actual accepted contract, source/generated/test diff, configurations and raw rendering evidence. The first handoff patch was `fs-1.2-foundations-review.patch`, SHA-256 `f6aa5eb876354d5fd3d595c0e57c533908990192bcadf1bfda09b928adc0b9e1`, on the recorded base. Sites changed no repository files; Codex remained the writer.

**Confirmed finding:** passing endpoints concealed unreadable intermediate colors. Button's general `transition` and ThemeSwitcher's `transition-colors` interpolate foreground/background during a 150ms hover transition. Sites paused actual browser CSSTransitions at 50ms and measured the following ratios; all targets are 4.5:1. Full resolved colors/compositing are preserved in `sites-transition-before.json`.

| Theme              | Secondary Button at 50ms | ThemeSwitcher at 50ms | Corrected secondary minimum | Corrected switcher minimum |
| ------------------ | ------------------------ | --------------------- | --------------------------- | -------------------------- |
| default            | 1.197                    | 1.233                 | 6.773                       | 4.870                      |
| dark               | 1.193                    | 1.071                 | 8.301                       | 5.948                      |
| muted              | 1.335                    | 1.409                 | 21.000                      | 10.208                     |
| dark-high-contrast | 1.335                    | 1.146                 | 21.000                      | 11.175                     |

**Codex correction:** Button now uses only `transition-shadow`; ThemeSwitcher changes colors immediately. This preserves safe non-color motion and the selected semantic endpoints. No timing-based suppression or new token was introduced.

**Regression:** `transitionPairs` samples actual computed control colors at 0/25/50/75/100/125/150ms, not just after `settleStyles`. Home tests exercise real ThemeSwitcher. The dedicated `playwright.storybook.config.ts` runs the existing primary/secondary Button stories across all themes, including hover entry/exit, pointer-down, focus, font binding and padding. Its separate server avoids pretending the application's E2E suite covers Storybook; the normal config excludes this directory. On a fresh checkout, generate tokens before this suite; its webServer uses the existing Storybook CLI. During these recorded checks it reused the explicitly served rebuilt static Storybook.

The first new Storybook test attempt failed before transition assertions because its font-variable comparison stripped double quotes but not single quotes. The assertion was corrected without weakening font or contrast checks. That attempt is not claimed as a successful negative control; Sites' independent pre-correction measurements establish the defect.

**Independent recheck:** Sites verified the rebuilt production app and Storybook at their actual resolved themes: 84 frame samples (12 consumer/theme combinations × 7 times), all passing, minimum 4.8702:1. `sites-transition-after.json` preserves these measurements. Its first launch needed sandbox approval; a later probe initially treated an empty Storybook theme attribute as different from default. Those probe issues were corrected and are not source defects.

**Final Sites verdict: READY FOR DIMI VISIBLE-CHANGE DECISION.** No outstanding consumer finding. This is technical acceptance of the foundation candidate, not Dimi's visual acceptance.

## Final validation and handoff

- **PASS:** rebuilt `pnpm storybook:build` and `pnpm build` after the correction (`final-storybook-build.log`, `final-build.log`).
- **PASS:** `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config playwright.storybook.config.ts --reporter=json`: 8 real-Button checks; `final-storybook-browser.json`.
- **PASS:** full normal-config `playwright test --reporter=json --workers=1` against the explicitly served final production app: 14 tests, no failures/skips/retries; `final-e2e.json`. Includes unfiltered four-theme home smoke, logo, and the 184-record foundation fixture.
- **PASS:** final `pnpm lint`, `pnpm -F frontend exec tsc --noEmit`, `pnpm test` (84 files / 1,305 tests).
- **PASS:** computed padding/gap and actual Work Sans labels in `spacing-and-label-fonts.json`: Button/ThemeSwitcher 8px vertical and 16px horizontal; switcher gap 8px; Storybook's Work Sans samples use real custom Medium 24px/500 and SemiBold 16px/600 faces.
- **FAIL, pre-existing:** the extra direct E2E typecheck with `--strict` still reports only the three axe/Playwright Page-version mismatches. The untouched base reproduces the same failure at its two existing axe call sites. No new unsafe type bypass or dependency change; alignment remains separately scoped tooling work.
- **Preservation:** later changes are presentation transition classes, browser regressions/config and documentation only. The earlier passing common/game/startup checks still cover byte-identical protected sources and token outputs; final freshness/output hashes are checked at cleanup. No repeated game generation or gameplay change is implied.
- **Candidate:** `fs-1.2-foundations-final.patch` on base `655f53857ebf55da57e928532e8c74b9990881cc`, including all untracked task/test/config files. The original review patch is retained separately; artifact checksums accompany the handoff.
- **Evidence:** `fs-1.2-evidence.zip` contains raw before/after colors, source hashes, actual-font and reviewer measurements, screenshots and command logs. Local transient servers are stopped at handoff; no hosted site or remote state was changed.
- **Dimi action at review handoff:** accept/revise the semantic hover color, neutral default/hover treatment, inverse on-action foreground and focus correction. This decision was subsequently supplied in the acceptance record below. FS-1.3 is not started.
- **PASS — final cleanup:** 56 local Markdown links/anchors resolve; formatting and diff checks pass. The 381-file baseline comparison identifies exactly 11 intended tracked changes plus 5 new task/test/config files. HEAD and the empty index are unchanged. Bootstrap freshness and all generated-output hashes pass; no owned listener remains on 3000/3100/5173/6006. Final patch reverse-applicability passes. No commit, push, PR or publication was made.

## Prompt B consumer review — 2026-09-15

Sites separately reviewed the final patch on base `655f53857ebf55da57e928532e8c74b9990881cc`, SHA-256 `e1a8f740413e831a5c6865b9e51a2242539f6ca68141cd418d6823d9ef365397`. The actual contract, source/generated/test diff, current consumers and raw pairing/generation evidence were inspected. All 386 candidate files remained byte-identical during this read-only review.

- **PASS:** 8 production home/foundation tests and 8 existing Button Storybook tests across default, dark, muted and dark-high-contrast; no failures, skips or retries. These include 184 fixture pairing records and actual hover entry/exit, transition-frame, pointer-down and keyboard-focus checks.
- **PASS:** 24 actual-font samples across app/Storybook and all themes: Work Sans 24px/500 and 16px/600; Space Grotesk 14px/400. The temporary font probe initially sampled Storybook's fallback before glyph replacement; the final check polls actual platform-font usage and passes. No source change was needed.
- **PASS:** generated-output hashes, bootstrap freshness, diff check, patch identity and source preservation; owned local servers stopped. Builds and broad package/game suites were not repeated because the reviewed candidate remained unchanged.
- **Rendered minima:** fixture text default 4.870, dark 5.216, muted 10.208, dark-high-contrast 9.759; boundary/focus minima respectively 3.385, 5.264, 14.005 and 9.759. Ratios are rounded here; assertions use unrounded values and targets of 4.5 for text and 3 for meaningful boundaries/focus.
- **Verdict:** technically ready; no foundation blocker or correction request. Dimi's visible-change decision was the remaining gate.
- **Coverage limits:** accepted Standard dimensions/typography, pending/disabled behavior, actual outlined anchors and Menu geometry, live fields/status and dialog lifecycle remain later component work. Flat-panel fixtures do not certify translucent overlays, OS forced-colors, enlarged text, other browsers/devices or assistive technology. The pre-existing axe/Playwright type mismatch remains a separately scoped Codex/Dimi follow-up.

Local review artifacts are `fs-1.2-prompt-b-consumer-review.md` and `fs-1.2-prompt-b-evidence.zip` in the session workspace's `artifacts/` directory. The evidence ZIP SHA-256 is `b95efb4f65f2d51f1d93039b9dc560bb88d2ef809a2ac0c4ee8bf4fb997bc697`. Raw review data is also at `/private/tmp/fs-1.2-prompt-b-review/`; these local artifacts are not repository dependencies. This task record preserves the durable results and limitations.

## Dimi acceptance — 2026-09-15

After the Prompt B verdict, Dimi explicitly answered:

> I accept all corrections. Update the documentation if necessary, then commit and push the changes.

This accepts the reviewed default semantic hover color, neutral default/hover treatment, inverse on-action foreground, dark focus correction and foundation bindings. The exact accepted implementation is the final patch identified above; subsequent edits only record the review, acceptance and current handoff in this task and the feature plan. No code, token, generated output or test changed after that review.

FS-1.2 is complete. The same answer explicitly authorizes committing and pushing the scoped 16-file change on `feature/funkspace-minimum-usable` to `origin`. It does not start FS-1.3 or authorize a merge, deployment or other external action. Codex owns this acceptance/commit handoff; Sites owns the next component implementation when separately requested. The documented tooling and future component coverage limits remain visible rather than being relabeled as passing checks.

Acceptance-stage validation passed: formatting of both updated documents, 59 local links/anchors, diff whitespace, bootstrap freshness and all four generated-output hashes. Comparison against the consumer-review snapshot confirmed only these two documentation files changed. The remote branch tip matched the accepted base before committing. Application/build/browser suites were not repeated for this documentation-only delta; their recorded results cover the unchanged implementation.
