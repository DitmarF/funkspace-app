# Storybook color reference

## Task metadata

- **Stage:** Requested design-system reference work before the next FS task.
- **Status:** Complete — implemented and validated; Dimi authorized documentation finalization, commit and push on 2026-09-16.
- **Lead/current writer:** Sites; one local writer.
- **Date:** 2026-09-16.
- **Base:** `feature/funkspace-minimum-usable`,
  `6eeccf2a38baa8a7130a9f7715caf08a0ee9dc39`; clean working tree at start.
- **Prerequisite:** FS-1.3 is complete, manually/visually accepted and pushed.
  This request does not start FS-1.4 or reopen FS-1.3.
- **Workflow:** [AI workflow](../development/ai-workflow.md),
  [task template](../templates/task.md), [feature scope](../features/funkspace-minimum-usable.md).

## Requested outcome

Dimi asked for a representation of the current color palettes and semantic
color system before continuing with the next FS task. Extend the existing
Storybook token reference rather than create a new palette or token source.

- [x] Display the current chromatic and neutral palettes with token names/values.
- [x] Group semantic roles into surfaces, content, actions, feedback and borders.
- [x] Support light, dark, muted and high-contrast inspection.
- [x] Preserve existing token values, accepted controls, theme authority and games.

## Inspection and decisions

Inspected repository instructions, README, existing workflow/task evidence,
token source/generator/output, public common exports, Tailwind bindings,
ThemeService subscriptions, Storybook configuration and existing token stories.
No nested instructions exist. Sites profile is portable with `configured:false`;
the existing project and scripts are retained.

`Foundations/Tokens` had documentation blocks for the token categories but an
empty Overview canvas. That canvas now renders a useful palette reference.
Existing addon documentation, spacing and typography blocks are retained.
Its faint introductory text now uses content-primary.

The repository's approved current token values are authoritative here. No
historical Figma palette replaces the accepted FS-1.2/FS-1.3 color corrections.

## Implementation

- [Tokens stories](../../frontend/components/Foundations/Tokens.stories.tsx):
  **Palettes**, **Semantic Colors**, **Theme Comparison**, and populated
  **Token catalogue** overview under Foundations / Tokens.
- [ColorReference](../../frontend/components/Foundations/ColorReference.tsx)
  and [styles](../../frontend/components/Foundations/ColorReference.module.css):
  23 primitive colors and 21 semantic roles, CSS-variable swatches, hex values,
  role descriptions and variable names. Semantic entries report equal palette
  values explicitly as comparisons, not source aliases.
- Values come from the existing `@funkspace/common/tokens/colors` export.
  Single-theme swatches consume actual CSS variables. The reference subscribes
  to the existing ThemeService's resolved state and cleans up its subscription;
  it does not set or manage themes.
- Comparison panels use explicit values from the same generated export,
  isolating all four palettes even when the host follows system dark mode.
- Ordinary `action-hover` and large-label `action-hover-large` are both
  shown, with the latter labeled for Standard labels of at least 24px.
  Swatches are individual values, not claims that arbitrary pairings pass
  contrast or that future control states are implemented.
- [Addon declaration](../../frontend/types/storybook-design-token.d.ts):
  installed storybook-design-token 4.1.0 advertises a missing doc-blocks.d.ts.
  Its bundled TypeScript source map verifies categoryName and table/card
  viewType (table default). A narrow declaration covers only the API already
  used here; no any, suppression, dependency change or invented package API.

## Validation

Evidence directory: `/private/tmp/fs-color-reference/`.

- **PASS:** frontend types and explicit Tokens story types after the narrow
  declaration correction; bootstrap freshness; Storybook build; lint/formatting.
- **PASS:** 10 focused [browser checks](../../e2e/storybook/colors.spec.ts):
  all palette/semantic entries across four themes, resolved CSS paint versus
  generated values, unfiltered axe, 320px/200% text, nonempty Overview,
  system theme updates and four explicit comparison panels on a dark OS.
- **Initial findings corrected:** eight mobile/enlarged cases exposed
  unbreakable header content; min-width and wrapping fixed it. Two desktop
  system/comparison tests already passed. The initial explicit story type
  check exposed the missing legacy addon declaration described above.
- **Interrupted intermediate run:** nine checks passed; the remaining comparison
  check lost its browser execution context during a Storybook rebuild. The final
  full run after the build completed passed all 10 with no skips or retries.
- **Not run:** application build, root/game unit suites, production application
  browser suites, Lighthouse and physical-device checks. Only Storybook
  reference code and types are affected; no application consumer imports this
  reference. Prior component checks are historical, not new results here.

## Cleanup and handoff

Seven changed files: this task, the feature-plan handoff note, Tokens stories,
ColorReference component/CSS, the narrow addon declaration and color browser
spec. No generated output, token source, package/lockfile, logo, Button/Icon
implementation, game code, bootstrap or ThemeService change.

Candidate: `storybook-color-reference/color-reference.patch` on the base above,
with file inventory, checksums and command evidence in the session artifacts.
The commit containing this completion record is the durable repository candidate.
The existing user-owned Storybook server remains running.

## Completion authorization — 2026-09-16

Dimi instructed: **“Update the documentation if necessary, then commit and push
changes.”** This authorizes committing the seven-file color-reference candidate
on `feature/funkspace-minimum-usable`. This finalization changes documentation
only; the tested implementation and token values are unchanged. No separate
manual/visual test result is inferred from commit authorization.

**Next owners:** Sites handles any returned reference findings. Dimi chooses
the next FS task; FS-1.4 remains not started and Codex's FS-1.7 review remains
scheduled. No deployment, PR, merge or Figma mutation is authorized.
