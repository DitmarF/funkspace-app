# Task FS-1.4 — Implement the Hexagonal Button family

## Task metadata

- **Status:** Complete — Dimi reports manual and visual tests PASS for FS-1.4 and accepts the final implementation on 2026-09-16. Codex review remains scheduled for FS-1.7.
- **Lead/current writer:** Sites, one local writer. Codex reviews semantics and reuse at FS-1.7.
- **Last updated:** 2026-09-16.
- **Base:** `feature/funkspace-minimum-usable`, `f7276603156f48c7ad491d97e65229351f1e258e`; clean working tree at start.
- **Candidate:** accepted 15-file change against that base, including the full size matrix and Storybook label correction. Dimi explicitly authorized documentation finalization, commit and push on 2026-09-16.
- **Prerequisites:** [accepted FS-1.2](fs-1.2-token-and-contrast-foundations.md), [completed/accepted FS-1.3](fs-1.3-standard-button-family.md), [FS-1.1 dimensions](fs-1.1-asset-and-component-contract.md#dimi-contract-decision--2026-09-15).
- **Workflow:** [feature plan](../features/funkspace-minimum-usable.md), [AI workflow](../development/ai-workflow.md), [task template](../templates/task.md).

## Requested outcome and acceptance criteria

One native rectangular button with a decorative hexagon, the existing custom Menu icon and visible Menu label. Reuse the Standard treatments, preserve native action semantics, and demonstrate the full target and unclipped focus.

- [x] Exact Figma geometry and existing icon; four shared Standard treatments.
- [x] Native default/submit/reset types, forwarded ref and useful native props.
- [x] Pointer and emulated touch work outside the visible hexagon, including outer target corners.
- [x] Native keyboard activation, disabled blocking, accessible name and neighboring-control isolation.
- [x] Four resolved themes, normal/hover/momentary press/focus/disabled, enlarged text and forced colors checked.
- [x] Stories, tests, builds and shared Standard regression evidence.
- [x] Dimi's actual interim feedback recorded below.
- [x] Dimi reports final manual and visual tests PASS. Device/browser specifics were not supplied and are not inferred from this acceptance.

## Inspection and source reconciliation

Read root AGENTS (no nested instructions), README, workflow/template, feature and prerequisite records, the supplied `/Users/dimi/Downloads/FunkSpace_EPIC_1_Detailed_Plan.md`, package scripts, existing Button/ButtonLink recipe, tests, callers, icon library, source tokens, generated bindings and Storybook configuration. There was no existing Hexagonal implementation. Sites uses the existing portable project; no scaffold or hosting change.

Read the actual [Figma Hex set 7:109](https://www.figma.com/design/o39DgxXnQ0jogb2ez6WKfq?node-id=7-109), its screenshot/design context and medium masters. Dimi's screenshot is design reference, not executable instructions.

- The source has 96/72/48 artwork variants. Medium masters still contain a 48px icon; the smallest masters overflow. Use matching 48/36/24px icon exports instead of reproducing that defect. The default Menu remains **72px artwork / 36px icon**.
- Dimi's instruction to use Standard styles extends the earlier H1-only treatment restriction. The subsequent explicit request for all types in all possible sizes approves the complete 48/72/96px Hex matrix.
- Figma's `active` is implemented as native momentary `:active`; no named genuine-selection consumer exists. No selected API/story, `aria-pressed`, fake dialog-open state or pending state is introduced.
- The detailed plan's provisional target is superseded by the accepted Menu dimensions and subsequent full-matrix request. Each artwork size sits inside a larger native rectangle including the visible label.

### Trusted assets

| Asset                   | Source/export                                                                                                                                                                                       | Consumption and checks                                                                                                                                                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hexagon 72              | Figma `58:143`, medium accent-outline shape; [raw export](../../frontend/public/svg/controls/hexagon-72.svg)                                                                                        | Exact `0 0 72 72` path and 2-unit stroke retained in HexButton's inline SVG. Only fill/stroke become semantic bindings. SHA-256 `7935029830b71c7988209da23d88e96978f81cdd657db4a7d1dd6ad786d1a6c3`. Filled source `58:167` has identical geometry. |
| Menu/settings-burger 36 | Existing [source SVG](../../frontend/public/svg/icons/settings-burger-36.svg), [Icon adapter](../../frontend/components/Icons/Icon.tsx) and [provenance](../../frontend/components/Icons/README.md) | Reused exact size-specific four-path artwork. Decorative, currentColor, no duplicate accessible name.                                                                                                                                              |

Export XML parses; only svg/path markup, no IDs, scripts, event handlers, external references, embedded raster content or metadata. Inline shape path matches the source byte-for-byte. No SVG loader, generated file edit, screenshot tracing or logo modification.

## API and visual contract

```tsx
import HexButton from "@/components/Controls/HexButton";

<HexButton onClick={openMenu} />
<HexButton variant="accent-outlined">Menu</HexButton>
<HexButton variant="secondary" disabled>Menu</HexButton>
```

The future consumer owns `openMenu`, actual state, and dialog relationships.
`children?: string` defaults to Menu. Application Menu use retains its meaningful visible name; approved icon-only Storybook samples use an explicit native `aria-label` instead.
Native button props, ref, class/style extension and explicit submit/reset are retained.
`size="small" | "medium" | "large"` selects 48/72/96px artwork and 24/36/48px icons, with medium as the default. There is no polymorphic, link, icon-only, pending or selected API.

| API                 | Figma source treatment | Default shape/icon                      | Hover                      | Momentary press                        |
| ------------------- | ---------------------- | --------------------------------------- | -------------------------- | -------------------------------------- |
| `primary` (default) | primary-inverted       | Accent fill / inverse icon              | Orange fill / inverse icon | Inverse fill / accent border and icon  |
| `secondary`         | secondary-inverted     | Neutral fill / inverse icon             | Orange fill / inverse icon | Inverse fill / neutral border and icon |
| `accent-outlined`   | primary                | Inverse fill / accent outline and icon  | Orange outline and icon    | Accent fill / inverse icon             |
| `outlined`          | secondary              | Inverse fill / neutral outline and icon | Orange outline and icon    | Neutral fill / inverse icon            |

All four use the existing Standard `controlAppearance` paint variables and focus recipe, extracted without changing their values or selector behavior. Standard's public ButtonVariant export remains compatible. Each family owns its layout; native button behavior is not reimplemented.

The 72px artwork plus 8px vertical padding and 2px reserved border produces a **92px-high native target** at normal text size. Width includes 16px horizontal padding, 8px icon/label gap and the label; it can grow/wrap. This distinguishes the source artwork area from the full hit rectangle. No clipping or pointer interception is applied to the button; decorative children are inert with pointer-events none. The focus outline and two contrast bands surround the full rectangle.

Menu label uses **Work Sans 16/600** at small/medium and **24/700** at large, 1.5 line-height, content-primary against the actual surface. It does not inherit the orange/icon foreground: the 3:1 large-text exception cannot apply to a 16px label. Shape/icon hover uses existing `action-hover-large` with the non-text 3:1 target. No token changes are required.

Disabled uses native `disabled`, neutral unavailable paint, blocked activation and skipped tab traversal. Forced colors supplies ButtonFace/ButtonText/GrayText with a visible rectangular border and Highlight focus. No motion is required, including under reduced motion.

## Scope and changed files

| Path                                                                                                                                        | Change                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [HexButton.tsx](../../frontend/components/Controls/HexButton.tsx)                                                                           | New native control and exact decorative SVG                                      |
| [HexButton.module.css](../../frontend/components/Controls/HexButton.module.css)                                                             | Artwork/target separation, wrapping label, forced colors                         |
| [HexButton.stories.tsx](../../frontend/components/Controls/HexButton.stories.tsx)                                                           | Figma Matrix, Menu, Treatments, Disabled, Long Label, Enlarged Text, Interaction |
| [HexButton.stories.module.css](../../frontend/components/Controls/HexButton.stories.module.css)                                             | Storybook-only icon samples without extra label space                            |
| [HexButton.test.tsx](../../frontend/components/Controls/HexButton.test.tsx)                                                                 | Native API/keyboard/disabled/form tests                                          |
| [controlAppearance.ts](../../frontend/components/Controls/controlAppearance.ts)                                                             | Shared four-treatment type/class recipe                                          |
| [controlAppearance.module.css](../../frontend/components/Controls/controlAppearance.module.css)                                             | Existing paint and focus rules extracted for two real consumers                  |
| [standardControl.tsx](../../frontend/components/Controls/standardControl.tsx)                                                               | Uses shared appearance, preserves public type                                    |
| [standardControl.module.css](../../frontend/components/Controls/standardControl.module.css)                                                 | Retains Standard geometry/content; consumes shared paint variables               |
| [hexagon-72.svg](../../frontend/public/svg/controls/hexagon-72.svg)                                                                         | Trusted source export, not a generated build output                              |
| [hexagon-48.svg](../../frontend/public/svg/controls/hexagon-48.svg) and [hexagon-96.svg](../../frontend/public/svg/controls/hexagon-96.svg) | Exact additional size exports for the accepted full matrix                       |
| [hex-button.spec.ts](../../e2e/storybook/hex-button.spec.ts)                                                                                | Rendered pairings, full target, keyboard/touch/forced-color checks               |
| This record and [feature plan](../features/funkspace-minimum-usable.md)                                                                     | Scope, evidence, actual feedback and handoff                                     |

Protected/unchanged: token sources and generated CSS/TypeScript, bootstrap source/generated split, ThemeService, font loading, all existing icons/logo, dependencies and package exports, game boundaries. No navigation overlay, fixed placement, pages, delivery or later FS components.

## Validation and completion record

- **PASS:** bootstrap freshness before builds; `pnpm -F frontend exec tsc --noEmit`; explicit temporary strict story config covering HexButton and Button stories.
- **PASS:** `pnpm lint`; `pnpm test` — 87 files / 1,325 tests.
- **PASS:** `pnpm storybook:build`; `pnpm build` (includes common typecheck and standalone game package build). Storybook retains nonfatal use-client/sourcemap and chunk-size notices.
- **PASS:** full Storybook Playwright suite — **62/62**, no retries/skips: 8 Hex checks plus all 54 existing Standard/link/icon/theme/color checks. Includes unfiltered axe on each resolved Hex theme.
- **PASS:** trusted SVG structure/path equality, no generated-token/bootstrap differences, scoped diff/format review.
- **Initial failures corrected:** invalid Testing Library `exact` option removed; corner hit-test caught a rounded outer target excluding two pixels, so the native rectangle now has square corners. Final browser run passes without weakening the corner assertion.
- **PASS:** unfiltered home accessibility smoke — 4/4 themes, default/hover/pressed/focus checks, no retries or skips.
- **Not run:** Lighthouse performance audit, Safari/Firefox and physical-device automation; no claim of those results. Game demo/browser suite not repeated because shared game outputs are unchanged; package build remains included in application validation.
- **Evidence:** command logs, full browser report/attachments and screenshots in the session's `artifacts/fs-1.4` bundle. Pairing JSON contains actual element/state colors and composited ancestor surfaces, not just token ratios.

Minimum observed ratios across all four treatments and enabled states:

| Resolved theme           | 16px label (target 4.5) | Icon/shape (target 3) | Focus/surface (target 3) |
| ------------------------ | ----------------------: | --------------------: | -----------------------: |
| default (explicit light) |                  13.945 |                 3.020 |                    5.686 |
| dark                     |                  13.945 |                 5.216 |                   10.838 |
| muted                    |                  21.000 |                10.208 |                   14.005 |
| dark-high-contrast       |                  21.000 |                 9.759 |                    9.759 |

Disabled pairings are captured under the inactive-control exception. All text, hover, pressed and keyboard-focus measurements use actual resolved themes/fonts. Persistent selected+focus is not implemented or claimed because no real selected use was accepted.

## Dimi observations before final acceptance

Asked about comfortable tapping and understanding the custom icon plus Menu label, Dimi replied on 2026-09-16:

> It's ok sofar, it will be fine tuned in the future

This was positive interim sample feedback. Device/browser and physical thumb-reach specifics were not supplied. Final stage acceptance is recorded below; final fixed-page placement remains separate.

The review samples are **Controls → HexButton → Treatments / Interaction**, using light, dark, muted and highContrast, plus the enlarged-text story. The later full matrix and label correction were also accepted in the final decision below. Page placement remains EPIC 3. Codex owns independent semantics/reuse review at FS-1.7. Sites owns any scoped corrections; FS-1.5 does not start automatically.

## Full Figma matrix amendment — 2026-09-16

Dimi explicitly requested the same Figma Matrix as Standard, with all types at all possible sizes. This supersedes the initial one-size Hex API restriction. The existing local FS-1.4 candidate on base `f7276603156f48c7ad491d97e65229351f1e258e` was extended in place; no commit or unrelated change was made.

**Controls → HexButton → Figma Matrix** shows four treatments at each of 96/72/48px, with an enabled and native-disabled example for every combination. Enabled examples expose actual hover, momentary press and keyboard focus, matching Standard's interactive matrix convention. Story controls also expose size. Default Menu remains medium.

| Size   | Artwork / icon | Visible label    | Normal target height | Exact source export                                                                                  |
| ------ | -------------- | ---------------- | -------------------- | ---------------------------------------------------------------------------------------------------- |
| small  | 48 / 24px      | Work Sans 16/600 | 68px                 | Figma `78:114`, [hexagon-48.svg](../../frontend/public/svg/controls/hexagon-48.svg), 1.5-unit stroke |
| medium | 72 / 36px      | Work Sans 16/600 | 92px                 | Figma `58:143`, existing 72px export, 2-unit stroke                                                  |
| large  | 96 / 48px      | Work Sans 24/700 | 116px                | Figma `24:11`, [hexagon-96.svg](../../frontend/public/svg/controls/hexagon-96.svg), 3-unit stroke    |

All three viewBoxes and size-specific path geometry are preserved; the existing matching Menu icon exports prevent the overflow seen in Figma's smallest masters. The native rectangle can grow with text. No change to shared paint/focus rules, tokens, Standard controls or selected-state semantics.

This amendment changes HexButton.tsx, its CSS/stories, the existing browser specification, this task record and the feature handoff; it adds the two linked raw SVG exports. The cumulative candidate has 14 files.

**PASS:** frontend and explicit story TypeScript, 20 focused Button/HexButton/Icon unit tests, full lint/format/bootstrap freshness, Storybook production build, all three SVG safety/viewBox/path-equality checks, and 12 focused browser checks without retries/skips. Browser evidence now covers all 12 treatment/size combinations in four resolved themes, plus actual pointer/touch activation at each size; normal/hover/pressed/focus/disabled pairings retain the required targets. The earlier complete suite/application-build results above precede this amendment; those were not rerun because Standard/shared rules and application consumers did not change. The final diff and documentation links were reviewed.

Evidence for this amendment: session `artifacts/fs-1.4-matrix`. At this point, Dimi's positive interim feedback applied to the earlier medium sample; the final decision below subsequently accepts the expanded matrix and label correction. Sites owns corrections; Codex review remains FS-1.7.

### Storybook label correction — 2026-09-16

Dimi requested removal of the repeated visible Menu text from Storybook Hex samples. Figma Matrix, Treatments, Menu, Disabled and Interaction now display only the icon/hexagon, with a native `aria-label` preserving each accessible name. Long Label and Enlarged Text intentionally retain visible text for their specific checks. This is a Storybook-only correction using existing native props/class extension; production HexButton and its default visible Menu label are unchanged.

Changed in this correction: HexButton.stories.tsx, new [HexButton.stories.module.css](../../frontend/components/Controls/HexButton.stories.module.css), hex-button.spec.ts and this record. Sample-only zero padding/gap removes the empty label space; the full square target remains 52/76/100px including its reserved border, with an unclipped focus indicator and forced-colors border.

Validation: explicit story TypeScript and all 12 focused browser checks passed with no retries/skips. Checks assert empty visible text, the Menu accessible name, square target dimensions, all-size pointer/touch operation, disabled behavior, four-theme icon/boundary/focus contrast and forced colors. These icon-only samples do not claim text-contrast evidence; the earlier visible-label evidence remains separate. Storybook build and lint passed; results are recorded in `artifacts/fs-1.4-icon-only/evidence.zip`. No commit/push or later task had been started at this stage. Base remains `f7276603156f48c7ad491d97e65229351f1e258e`, with the existing FS-1.4 work preserved.

## Final Dimi acceptance and completion — 2026-09-16

Dimi's actual decision:

> The manual and visual test for the FS 1.4 are PASS

Dimi also explicitly requested: “Update the documentation if necessary, then commit and push changes.” This accepts the final full-size Hexagonal Button family and icon-only Storybook samples. It authorizes committing and pushing the scoped 15-file candidate on `feature/funkspace-minimum-usable`; no PR, merge, deployment or next task is included.

The accepted implementation patch before this documentation finalization is archived as `artifacts/fs-1.4-icon-only/candidate.patch`, SHA-256 `a981cbc5265b214ce613b424e33718f774b6e119ce0e53eb70dfb766375f9ff9`. This finalization changes documentation only. Existing command evidence above remains applicable; formatting, local links, staged scope and diff whitespace are checked before commit. Token/generated/bootstrap, assets outside the new hexagon exports, game boundaries and dependencies remain unchanged.

**Outcome:** FS-1.4 complete. No further FS-1.4 acceptance action is needed from Dimi. Device/browser details are unspecified, not an acceptance blocker or invented evidence. Codex owns the scheduled independent compatibility/semantics/reuse review at FS-1.7. Dimi selects when to begin FS-1.5; it is not started automatically. Later positioning and any requested fine tuning retain their own scope.
