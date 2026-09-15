# Task FS-1.3 — Extend the Standard Button family

**Current contract:** Dimi revised the reduced matrix after visual review. The
[Figma matrix correction](#figma-matrix-correction--2026-09-15) below supersedes
the initial one-size/one-icon restriction and initial visual evidence. Earlier
sections remain the execution history, not the final appearance specification.

## Task metadata

- **Status:** Complete — Dimi accepted the Button and icon implementations after manual and visual Storybook tests. Codex compatibility review remains scheduled for FS-1.7.
- **Lead/current writer:** Sites, with the same session writer carrying out Dimi's narrowly authorized token correction. Codex compatibility review remains at FS-1.7.
- **Base:** `feature/funkspace-minimum-usable`, `dcfef667a4acc3ceac69fa1a5bf0deb0394534de`; initially clean checkout at `/Users/dimi/Projects/funkspace-app`. The correction started from the actual 13-file uncommitted FS-1.3 candidate, preserving its work.
- **Last updated:** 2026-09-15.
- **Prerequisites:** [accepted FS-1.1 matrix](fs-1.1-asset-and-component-contract.md#accepted-minimal-matrix), [accepted FS-1.2 foundations](fs-1.2-token-and-contrast-foundations.md#dimi-acceptance--2026-09-15), [feature scope](../features/funkspace-minimum-usable.md), [workflow](../development/ai-workflow.md), [task template](../templates/task.md).

## Requested outcome and acceptance criteria

Extend the existing Button with the approved Standard treatments, native action/link semantics, one decorative icon slot, and stable disabled/pending presentation. Preserve useful native props, refs, class extension, primary/secondary compatibility and default `type="button"`. No page, contact delivery, shared-token edits or later component families.

- [x] Existing callers and native default/submit/reset behavior remain compatible.
- [x] Approved regular primary/secondary/outlined controls and native outlined navigation are implemented.
- [x] Pending preserves focus, visible label and layout; repeated activation is blocked by handlers, not ARIA alone.
- [x] Stories and focused unit/browser checks cover names, icons, keyboard, forms, links, long/enlarged text and relevant states.
- [x] Final lint/types/tests, Storybook/application builds and cleanup evidence recorded.
- [x] Dimi accepted the corrected Buttons and icon library after manual and visual Storybook tests (2026-09-15). This does not replace independent FS-1.7 review or establish unreported physical-device coverage.

## Inspection and scope decisions

Read root AGENTS, README, workflow/template, feature/task records, FS-0.2 evidence and supplied `/Users/dimi/Downloads/FunkSpace_EPIC_1_Detailed_Plan.md`. No nested instructions or existing Button-specific test file were found. The detailed plan's compact suggestion is superseded by the accepted matrix: no named compact use exists, so no compact API is implemented. The plan's proposed archive location is not assumed to exist.

Inspected Button, all imports/callers, stories, local fonts, CSS/Tailwind bindings, package scripts, Vitest/Playwright/Storybook configuration and FS-1.2 browser helper. Sites execution-profile detection returned portable/unconfigured, preserving the existing Next.js/pnpm project. This is local repository work, not Sites hosting or deployment.

| Existing consumer                          | Compatibility constraint / disposition                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `components/Modules/Card.tsx`              | Primary text action/onAction preserved; no icon substitution or caller rewrite.                  |
| `components/Templates/HomeTemplate.tsx`    | Primary CTA and callback preserved.                                                              |
| `components/sections/Hero.tsx`             | Forwarded `HTMLButtonElement` ref and inline motion styles remain attached to the native button. |
| `components/Layouts/Container.stories.tsx` | Existing primary/secondary imports and composition unchanged.                                    |
| `components/Controls/Button.stories.tsx`   | Existing primary/secondary story IDs retained; approved treatment/state examples added.          |

Protected: shared token sources/generated outputs, fonts, bootstrap/ThemeService, logo/assets, package/lockfile configuration, game exports/isolation and all unrelated caller code. Only presentation controls, their shared visual/content recipe, stories, tests and task/feature documentation change. No external dependency, service, architecture migration or public package export.

## API and approved combinations

| Consumer                    | API / treatment                                      | Size and typography                                                                                    |
| --------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `Button` S1                 | `variant="primary"` (default)                        | Regular only; minimum 48px, Work Sans 24px/500, line-height 1.2.                                       |
| `Button` S2                 | `variant="secondary"`                                | Same regular dimensions.                                                                               |
| `Button` S4                 | `variant="outlined"` for the named Customize command | Same; no accent-outline axis or conflicting appearance flags.                                          |
| `ButtonLink` S3             | Required real `href`, outlined only                  | Same; native anchor props/ref retained. No button type, disabled, pending or polymorphic API.          |
| Decorative slot             | One `icon` React element; `iconPosition="leading"    | "trailing"`, leading by default                                                                        | 24px nominal source-spacing slot; 8px gap; artwork geometry belongs to the supplied asset. No new icon catalogue/export. |
| Ordinary unavailable action | Native `disabled`                                    | Readable neutral semantic paint and dashed boundary; no opacity-only treatment.                        |
| Pending-capable action      | Controlled `pending={boolean}` from its first render | Stable label, reserved icon/indicator and status space, static ellipsis and visible “Working…” status. |

The 48px value is a minimum, not a clipping height. Padding is 8px vertical/16px horizontal. The 24px label at 1.2 line-height plus padding and 2px borders naturally occupies about 48.8px. Content can wrap and grow. The existing rounded-lg and shadow are preserved; CSS does not interpolate foreground/background colors.

No `size` prop is needed for one accepted size. Compact, dual icons, standalone icon-only Standard, selected toggles, inverted/accent-outline treatments and filled navigation are deliberately unsupported. Visible children are required; icon-only composition is outside this API, so no unnamed icon-only examples are supplied. The current Close/More/Customize/Send consumers remain text-only. Story arrows are text-glyph fixtures for slot testing, not approved production substitutions.

```tsx
<Button onClick={openAction}>Open action</Button>
<Button variant="secondary" type="reset">Reset</Button>
<Button variant="outlined" onClick={openCustomize}>Customize</Button>
<Button type="submit" pending={isSubmitting}>Send message</Button>

// Use when the actual destination is available; FS-1.3 does not create /about.
<ButtonLink href="/about">More about FunkSpace</ButtonLink>

// Only use approved artwork at real call sites. One decorative slot, not both.
<Button icon={approvedIcon} iconPosition="trailing">Visible action label</Button>
```

### Pending and focus policy

Pass `pending={false}` initially and keep the boolean present for the entire pending-capable lifecycle. That opts into a stable inline-grid wrapper with reserved status space and a trailing indicator slot; when an icon exists, reuse its slot. `className`, `style`, refs and native props still apply to the button itself. Ordinary buttons without `pending` keep a single native-button root. Do not conditionally add/remove the pending capability during activation, as changing the wrapper would remount the button.

While pending, the button remains natively enabled and focusable, with `aria-busy` and `aria-disabled`. Capture handlers prevent click defaults and stop activation bubbling; Enter/Space capture guards also prevent repeated activation callbacks. Native ready-state keyboard activation is untouched, so no duplicate synthetic activation is added. Tab remains available. A separate visible `role="status"` announces “Working…” and is linked through `aria-describedby`, preserving caller-provided descriptions. Label text/name remains unchanged. The indicator/status needs no animation and works under reduced motion.

Ordinary `disabled` uses the browser's disabled behavior and leaves the tab sequence. The strict API excludes combining `disabled={true}` with the pending capability and restricts pending to primary S1's actual operation. Native disabled still wins if an untyped caller bypasses that contract. The later form controller must set/clear pending and guard submission itself, including implicit/programmatic form submission. The component neither starts async work nor claims to intercept `form.submit()`/`requestSubmit()` or parent capture handlers that execute before its own handler. Its Storybook form demonstrates the controller guard without contact delivery.

### Shared recipe and semantics

`standardControl.tsx` and `standardControl.module.css` are shared only by the existing Button and the new native ButtonLink. They reuse FS-1.2's semantic foreground/fill/focus choices and existing typography/spacing variables. Decorative slot content is inert and hidden from accessibility, so nested SVG titles cannot duplicate the visible label or create another tab stop. No SVG is modified.

ButtonLink leaves navigation to the browser, including Enter, ordinary click, target/new tab, download and native anchor properties. Stories navigate to an existing primary-button story, not a fake hash or an unbuilt page. Links never wrap buttons and carry no pretend loading/disabled state.

### Existing Hero focus correction

The existing Hero's `bg-fs-blue` surface is outside FS-1.2's background/elevation-1 panels. Its inherited default focus outline resolved to `rgb(59,71,204)` against `rgb(59,148,204)`: 2.127:1. The repair stays in `standardControl.module.css`: preserve the 2px focus-role outline at a 2px offset, and add existing `content-primary`/`content-inverse` bands. They extend the overall focus paint to 6px without changing layout. No token source, theme binding or Hero code changes.

The final browser tests wait for the actual resolved theme and record all painted colors. At least one 2px band exceeds 3:1 against the surface pixels it replaces; the outline's ratio alone is not presented as passing on artwork. This is additional component focus paint for Dimi's visual review.

| Hero resolved theme | Outline alone | Inner band / surface | Outer band / surface |
| ------------------- | ------------: | -------------------: | -------------------: |
| default             |         2.127 |                5.216 |                2.673 |
| dark                |         2.078 |                2.673 |                5.216 |
| muted               |         1.000 |                1.499 |               14.005 |
| dark-high-contrast  |         1.000 |                2.152 |                9.759 |

`hero-focus-before.json` preserves the initial probe. Only its default-theme row is used as before evidence: the early probe did not wait for non-default theme resolution. `hero-focus-after.json` and the final browser assertions establish the four actual theme results. No requested toolbar label is substituted for a resolved theme.

## Validation evidence

Local evidence directory: `/private/tmp/fs-1.3-evidence/`. Current Node/pnpm and installed Chromium are reused; no install or browser download. Generated/bootstrap freshness was checked before build scripts.

| Command/check                                                                                                  | Result and scope                                                                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm exec vitest run frontend/components/Controls/Button.test.tsx`                                            | PASS: 12 tests; native types/reset, single Enter/Space activation, props/ref/style, native disabled, pending guards/focus/description/recovery, icon positions/names, anchor props and supported TypeScript combinations.                                                                         |
| `pnpm -F frontend exec tsc --noEmit`                                                                           | PASS, including unchanged callers and the negative type expectations.                                                                                                                                                                                                                             |
| Explicit story TypeScript check using a temporary config extending frontend config                             | PASS for Button/ButtonLink stories. Initial check found conditional spreading lost the icon/position union; a typed `StandardIconProps` value corrected the story without widening the component API or adding a cast. Normal frontend config excludes stories, so this check was run separately. |
| `pnpm lint`                                                                                                    | PASS: freshness, Next lint and repository formatting. Existing Next lint deprecation only.                                                                                                                                                                                                        |
| `pnpm test`                                                                                                    | PASS: 85 files / 1,317 tests.                                                                                                                                                                                                                                                                     |
| `pnpm storybook:build`                                                                                         | PASS, including final story typing correction; existing chunk-size warnings.                                                                                                                                                                                                                      |
| `NEXT_TELEMETRY_DISABLED=1 pnpm build`                                                                         | PASS in established tokens → common types → game build → frontend order, including after focus correction.                                                                                                                                                                                        |
| `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config playwright.storybook.config.ts --reporter=json` | PASS: 31 tests against built Storybook, no failures/skips/retries. Native form/implicit-submit guard, three pending slot/layout cases, actual click/Enter/new-tab navigation, all themes on both panels and Hero focus, forced-colors, 320px/200% text and all four existing callers at 375px.    |
| Pending browser selection after the story-only type fix                                                        | Rechecks the three pending examples against the final rebuilt artifact; result recorded at cleanup.                                                                                                                                                                                               |
| Full normal-config Playwright suite against the final production server                                        | PASS: 14 tests, no failures/skips/retries. Home and logo axe assertions remain unfiltered.                                                                                                                                                                                                        |
| One local desktop Lighthouse collection, report stored locally                                                 | PASS diagnostic: performance/accessibility/best-practices/SEO each 100; LCP 646.829ms, CLS 0. This is one homepage sample, not the three-run on/off release gate or a performance claim about every component state.                                                                              |
| Bootstrap freshness and generated-output/source comparisons                                                    | PASS before builds; repeated at cleanup. No shared token, bootstrap, font, game, package or caller changes.                                                                                                                                                                                       |

Command logs, reports and screenshots are retained under the evidence directory and packaged with the handoff. The full game unit suite is included in `pnpm test`, and the standalone package builds in the root build; no repeat game-browser campaign is justified by byte-identical shared outputs/game sources. No physical-device, Safari/Firefox or assistive-technology acceptance was run. The previously recorded direct E2E TypeScript version mismatch remains a separate tooling issue; no bypass or dependency alignment is introduced here.

Browser pending checks use forced pointer clicks on aria-disabled controls to verify actual event blocking; Playwright's own disabled-actionability protection is not counted as component behavior. Native `disabled` and `aria-disabled` are checked separately. The existing FS-1.2 foundation browser suite now expects the approved Work Sans 24px/500 and includes outlined treatment, retaining contrast and transition assertions.

## Dimi review checklist

- [ ] Primary, Secondary and Outlined: confirm the approved 24px/500 labels, minimum 48px targets, 8px gap and 16px horizontal padding.
- [ ] SurfaceMatrix in all four themes: inspect default, hover, momentary press, keyboard focus, native disabled dashed boundary and pending status.
- [ ] Inspect the contrasting focus bands on Hero's blue artwork; focus paint extends 6px beyond the target without changing its size.
- [ ] PendingInteraction and pending icon stories: confirm stable label/position, visible “Working…” text, retained focus and no repeat action. Tab must still leave the control.
- [ ] LongLabel at phone width and enlarged text: confirm wrapping and readable labels; no compact alternative is included.
- [ ] Review unchanged Card/HomeTemplate/Hero/Container callers with the intentionally larger approved visual default.
- [ ] ButtonLink Navigation/NewTab: confirm link behavior and outlined appearance. Icons in fixture stories demonstrate spacing only; actual named consumers remain text-only.

## Completion and handoff

- **Candidate:** `fs-1.3-standard-button.patch`, the local scoped diff on the base above; checksums accompany the session's evidence bundle. No commit/push or deployment authorized for this stage.
- **Files:** `frontend/components/Controls/Button.tsx`, `ButtonLink.tsx`, `standardControl.tsx`, `standardControl.module.css`, `Button.stories.tsx`, `ButtonLink.stories.tsx`, `Button.test.tsx`; `e2e/storybook/button.spec.ts`, `e2e/storybook/foundations.spec.ts`; this task and `docs/features/funkspace-minimum-usable.md` — 11 files total.
- **Contract changes:** additive outlined/icon/pending APIs and outlined native navigation; approved regular visual default replaces prior 14px/600 sizing. No token or package API changes.
- **Architecture review:** scope/duplication, dependency direction, complexity, tests, documentation and final-diff checklist groups reviewed. Presentation-only; no new dependency or cross-layer import; two actual consumers justify the shared recipe. Domain/application/infrastructure/game boundaries are unchanged. No architecture decision or blocking shared-token requirement arose. Deferred Dimi/FS-1.7 reviews are explicit, not claimed complete.
- **Next owners:** Dimi visual acceptance; Codex compatibility review at FS-1.7. No early counterpart review requested because no blocking foundation decision arose. Later page/contact work is not started.
- **Final cleanup:** PASS — final rebuilt pending stories, 3/3 tests with no failures/skips/retries; formatting and diff checks; 59 local links/anchors; 382 protected tracked files unchanged. Exactly four tracked modifications and seven new files comprise the candidate. HEAD remains the recorded base and the index is empty. Bootstrap and generated outputs are unchanged after builds. Owned application/Storybook servers were stopped; no listener remains on 3000/6006. No commit, push, PR, merge, deployment or live sending was performed.

## Storybook explicit light follow-up — 2026-09-15

Dimi reported that Storybook's `default` selection still rendered dark on a system with dark mode, preventing standard-palette review, and explicitly requested a `light` option. The empty body theme inherited the dark root variables applied by ThemeService. A toolbar name or empty body attribute alone did not establish a light palette.

`frontend/.storybook/preview.ts` now offers `default`, `light`, `dark`, `muted` and `highContrast`. A small preview-only binding sends the selection through the existing ThemeService: `default` selects system preference, while `light` selects the application's `default` palette explicitly. The existing provider, font setup and theme addon remain in place; no shared token, application theme service or bootstrap source changes.

The foundation/button browser helpers explicitly select `light` for standard-palette measurements. New `e2e/storybook/themes.spec.ts` reproduces the dark-OS case and verifies resolved root attributes plus body/button colors, explicit light through OS-theme changes and reload, and return to system-following `default`.

- **PASS:** Storybook build; frontend types; repository lint/formatting; all 32 Storybook browser checks, no failures/skips/retries. Logs: `storybook-light-build.log`, `light-types.log`, `light-lint.log`, `storybook-light-tests.json` in the existing evidence directory.
- **Delta:** preview binding, new theme regression, both existing Storybook test files and this task record. The cumulative FS-1.3 candidate now contains 13 files, adding `frontend/.storybook/preview.ts` and `e2e/storybook/themes.spec.ts` to the original 11-file list. Button implementation and approved shared foundations are preserved.
- **Limits:** application builds/unit suites were not repeated for this preview-only delta; prior results still cover unchanged application code. The user's existing Storybook server was reused and left running. No commit/push, deployment or Dimi visual acceptance is inferred.

## Figma matrix correction — 2026-09-15

### Source, decisions and scope amendment

Dimi rejected the reduced appearance matrix and requested the original hover
orange and matching left/right icon colors. Live design context and read-only
Plugin API inspection of [UI Library Standard set 83:460](https://www.figma.com/design/o39DgxXnQ0jogb2ez6WKfq?node-id=83-460)
confirmed 48 variants: four treatments, three sizes, default/hover/active/disabled.
The left icon instances bind their outer polygon/stroke to content-primary
regardless of state; label/right icon use the appropriate state foreground.
This explains the black arrow and its disappearance on dark fills.

Dimi explicitly answered:

- **“Full matrix: 48px, 72px and 96px.”**
- **“Use Figma pairing for large labels.”** The question disclosed that
  `#e6e6e6` on `#cc673b` is approximately 3.02:1 and meets the 3:1 large-text
  criterion, while the recorded ordinary-text target remains 4.5:1.

These choices revise the FS-1.1 reduced matrix and the FS-1.2 stronger target
for these large Standard labels only. They do not accept the finished rendering.
No 40px control, selected-command state, icon-only control, Hexagonal work or
contact orchestration is added.

### Final treatment and size mapping

| Figma treatment    | Compatible React variant | Default                                  | Hover                      | Momentary pressed                      |
| ------------------ | ------------------------ | ---------------------------------------- | -------------------------- | -------------------------------------- |
| primary            | `accent-outlined`        | Accent label/outline on inverse surface  | Orange label/outline       | Accent fill, inverse label             |
| primary-inverted   | `primary`                | Accent fill, inverse label               | Orange fill, inverse label | Inverse surface, accent label/outline  |
| secondary          | `outlined`               | Primary label/outline on inverse surface | Orange label/outline       | Primary fill, inverse label            |
| secondary-inverted | `secondary`              | Primary fill, inverse label              | Orange fill, inverse label | Inverse surface, primary label/outline |

Existing primary/secondary API names are retained rather than silently adopting
Figma's opposite naming. Neutral filled appearance now follows the matrix rather
than the earlier grey treatment. Outlined navigation keeps native anchor behavior.
Disabled controls use solid grey outline/text or grey fill/inverse text, with
native disabled blocking. Focus retains the existing contrasting bands. Pending
retains its stable label/status, focus and activation guards.

| API size          | Minimum height | Work Sans size/weight | Icon box | Gap  | Horizontal padding |
| ----------------- | -------------- | --------------------- | -------- | ---- | ------------------ |
| `small` (default) | 48px           | 24px / 700            | 24px     | 8px  | 16px               |
| `medium`          | 72px           | 36px / 600            | 36px     | 12px | 24px               |
| `large`           | 96px           | 48px / 500            | 48px     | 16px | 32px               |

Heights are minimums, allowing enlarged/long labels to wrap. Figma's fixed 48px
icons overflow its smaller masters; proportionate icon boxes preserve geometry
without reproducing that clipping. Existing spacing/font tokens supply the
dimensions, with explicit proportional calculations where needed. The existing
variable Work Sans font loads weights 100–900; no new font file or role swap.

### Icon and semantic binding evidence

`Button.story-icons.tsx` contains exact path geometry exported from instances
`80:433` and `80:443`, both viewBox `0 0 48 48`. Left outer fill/stroke and all
right paths use `currentColor`; the left inner fill uses the shared recipe's
resolved `--standard-background`. React useId scopes the retained clipPath per
instance. The source SVGs have two/four paths, respectively; no script, event
handler, external reference, raster image or metadata. The left local clipPath
is preserved. No SVG loader, logo edit or Figma document mutation.

Both icons remain decorative beside a visible label. Existing `icon` plus
`iconPosition` stays supported; `leadingIcon`/`trailingIcon` additionally
support both positions and cannot be mixed with the legacy form. Pending reuses
the trailing slot when both exist; the leading icon and label remain stable.
Production text-only Close/More/Customize/Send decisions are unchanged.

The new narrowly scoped semantic `color-action-hover-large` restores default
`#cc673b`. Other modes retain `#cc8668`, `#66331e`, `#ffa882`. The existing
`action-hover` remains unchanged for ordinary text and ThemeSwitcher.
Generated review: exactly four new CSS declarations and four corresponding
TypeScript semantic entries. No existing palette value, public export,
game-theme value, motion output or bootstrap artifact changed. Two generation
runs produced identical SHA-256 manifests.

Examples:

```tsx
<Button variant="accent-outlined" size="large"
  leadingIcon={<ApprovedArrow />} trailingIcon={<ApprovedSettings />}>
  Button
</Button>
<Button variant="secondary" size="medium">Reset</Button>
<Button pending={pending}>Send message</Button>
```

### Validation and review handoff

Revision evidence: `/private/tmp/fs-1.3-revision/`; original Figma exports,
source measurements and the refreshed patch are in the session artifact bundle.
The earlier patch/evidence bundle remains historical.

- **PASS:** generation stability; bootstrap freshness; common/game/frontend
  types; explicit story types; Storybook and production builds.
- **PASS:** root suite 85 files / 1317 tests; subsequent focused suite 13 tests
  including the new dual-icon pending case. Standalone game: 58 files / 920
  tests, types and demo build.
- **PASS:** all 40 Storybook checks, no failures/skips/retries. Four matrix tests
  cover all 12 treatment/size combinations in each theme through actual default,
  hover, pointer-down, focus and disabled rendering. Computed paints verify both
  SVGs, the inner background and unique clip IDs. Unfiltered axe checks remain.
- **Corrected test mismatch:** initial browser run 36 pass / 4 fail, all four
  existing-caller checks still expecting 500 instead of the revised Figma 700
  small-label weight. Initial story type check also exposed a variant-union
  limitation; the non-pending branch now accepts the complete variant union.
  No type bypass or contrast filter was added.
- **Dimi checklist:** inspect Controls/Button/FigmaMatrix in explicit light,
  dark, muted and highContrast; hover and hold each treatment; compare all sizes,
  both icon colors, neutral fill and disabled greys. Check phone-width long text,
  pending focus/status and real link navigation.
- **Next owners:** Dimi accepts/revises the rendering; Sites resolves component
  findings; Codex performs independent compatibility review at FS-1.7. The
  original Figma instance paint defect remains in the design file; this patch
  corrects consumption only. No acceptance, commit or push is inferred.

Final rendered hover ratios (label and icon foreground/background): default
**3.020:1**, dark **5.948:1**, muted **10.208:1**, dark-high-contrast **11.175:1**.
The matrix report contains 240 records across sizes, treatments and states;
disabled records explicitly carry the inactive-control exception. Ordinary
status and ThemeSwitcher text still use 4.5:1. No token-only measurement is
represented as a rendered pass.

- **PASS:** repository lint/formatting; 6 production home/logo browser tests and
  4 production foundation-pairing tests, unfiltered, no failures/skips/retries.
  The first production command named `foundation.spec.ts`, which does not exist
  and therefore selected only home/logo; the exact
  `e2e/foundation-pairings.spec.ts` was then run separately.
- **Candidate files (19 total, relative to the unchanged base):**
  `tokens/fs.tokens.json`, `styles/tokens.css`, `common/generated/colors.ts`;
  `frontend/.storybook/preview.ts`;
  `frontend/components/Controls/Button.tsx`, `ButtonLink.tsx`,
  `standardControl.tsx`, `standardControl.module.css`, `Button.stories.tsx`,
  `ButtonLink.stories.tsx`, `Button.story-icons.tsx`, `Button.test.tsx`;
  `e2e/storybook/foundations.spec.ts`, `button.spec.ts`,
  `button-matrix.spec.ts`, `themes.spec.ts`;
  this task, `docs/tasks/fs-1.1-asset-and-component-contract.md`,
  `docs/features/funkspace-minimum-usable.md`.
- **Exact handoff:** `fs-1.3-revision/standard-button.patch` plus
  `checksums.json` in the session artifacts. The branch/HEAD and index remain
  unchanged. No hand-edited generated output or added dependency.
- **Not run for this revision:** full release Lighthouse flag-on/off runs,
  physical devices and independent FS-1.7 review. Prior Lighthouse diagnostics
  are historical, not certification of this revision.

## Button acceptance and Storybook icon library — 2026-09-15

Dimi said **“now the buttons looks good”** and explicitly requested a Storybook
library containing the existing icons pictured in Figma, extendable in future.
This accepts the corrected Button appearance and authorizes this bounded
catalogue despite the earlier no-catalogue restriction. No later component
family or production page integration is started.

### Scope and source evidence

The unchanged branch is `feature/funkspace-minimum-usable`, base
`dcfef667a4acc3ceac69fa1a5bf0deb0394534de`. Work began on the actual 19-file
uncommitted Button candidate. Sites remains the single writer; all prior
foundation/Button work is preserved.

Live Figma Icons page `6:2` and design context frame `8:96` confirm seven
families at 24/36/48: down/up/right/left arrows, settings-burger, Playground,
and More. All 21 real size-specific exports are present; no screenshot vectors
or scaled substitute drawings were generated. The first page-level design
context call could not resolve selection; the exact child frame succeeded.
Exports were read in bounded batches after the initial whole-page payload
exceeded the response limit.

The [icon README and source register](../../frontend/components/Icons/README.md)
lists all 21 actual files and Figma nodes. Original SVG bytes are preserved in
`frontend/public/svg/icons/`. Source naming issues are explicit: “plaground”
spelling, four 24-unit arrows named “36”, and reversed up/down names for the
24-unit geometry. Code names follow actual direction; no geometry is changed.
The raw assets are available; Dimi owns replacement/design approval. Existing
logo assets retain their separate stories; unrelated Next starter assets are
not presented as FunkSpace library icons.

### Implementation and extension contract

- `frontend/components/Icons/Icon.tsx`: small strict SVG API
  `name`, `size: 24 | 36 | 48`, optional `label`, native props and ref.
  Decorative by default; a meaningful label supplies a uniquely linked title.
- `iconArtwork.tsx`: exact export geometry for each size. Only JSX attributes,
  inherited foreground/surface paints and instance-scoped IDs/references differ.
  No SVG loader, parser, dependency, new shared token or runtime service.
- `Icon.stories.tsx` and `IconGallery.module.css`: **Icons / Library**
  Gallery, Playground and Accent stories, responsive size groups and named
  icons using existing theme/font/spacing bindings.
- Button story artwork now reuses Icon. The existing Standard icon slot supplies
  `--fs-icon-background` so arrow interiors continue to match every Button state.
  Accepted Button appearance and APIs remain intact.
- The README documents adding a source export and its typed artwork/name.
  Gallery and controls derive their options from `iconNames`; no second catalogue
  needs manual synchronization. Missing size evidence is not silently invented.

### Validation and handoff

Evidence: `/private/tmp/fs-1.3-icons/`, packaged as the session's
`fs-1.3-icons/evidence.zip`; cumulative patch and checksums accompany it.

- **PASS:** 21 SVGs exactly match exported bytes; 63 path geometries preserved;
  viewBoxes and local clip references validated. No script/event handlers,
  external references, embedded raster or metadata.
- **PASS:** frontend types; explicit new/existing story types; 15 focused
  Icon/Button unit tests; repository lint/formatting; Storybook and production
  application builds. Bootstrap freshness remains passing.
- **PASS:** all 44 Storybook browser checks across four palettes, including
  existing Button regressions. Gallery checks cover 21 icons, exact sizes,
  semantic paints, unique IDs, unfiltered axe and 320px/200% text layout.
  The final caption-spacing adjustment was checked by rerunning all four
  icon-gallery cases and rebuilding Storybook; all passed.
- **Not run for this extension:** full root/game suites, production browser
  suites, Lighthouse and physical-device checks. No game/token/bootstrap
  behavior changed; earlier results remain historical.
- **Files added:** the six files under `frontend/components/Icons/`,
  21 files `frontend/public/svg/icons/{arrow-down,arrow-up,arrow-right,arrow-left,settings-burger,playground,more}-{24,36,48}.svg`,
  and `e2e/storybook/icons.spec.ts`.
- **Existing files changed in this extension:** Button story icon wrappers,
  the Standard icon-slot background binding, this task record and the
  feature/FS-1.1 handoff notes. The original uncommitted candidate is retained.
- **Next owner/action:** Dimi can review the new Gallery in Storybook; no
  acceptance of the new gallery is inferred from Button acceptance. Sites owns
  any returned icon findings; Codex review remains FS-1.7. No commit/push or
  Figma file mutation is authorized or performed.

## Final Dimi acceptance and completion — 2026-09-15

Dimi explicitly confirmed: **“FS-1.3 is now done, the buttons and the icons
implementations in storybook passed the manual and visual test.”** Dimi also
instructed the session to update documentation, commit and push the changes.
This supersedes the pending visual-review and commit-authorization statements
in the historical handoffs above.

FS-1.3 is complete. Acceptance covers the corrected four-treatment Standard
matrix at 48/72/96px, its documented native link/pending/disabled behavior,
the restored large-label hover pairing, explicit Storybook light selection,
and the seven-family icon library at 24/36/48px. The actual preceding automated
validation remains recorded above; no additional device, Lighthouse or
independent compatibility result is inferred from this acceptance.

The accepted candidate contains the 47 files inventoried in
`fs-1.3-icons/checksums.json`, based on
`dcfef667a4acc3ceac69fa1a5bf0deb0394534de`. This completion step updates the task
and feature documentation only; the accepted implementation is unchanged.
The commit containing this section is the durable repository candidate.
Commit/push authorization covers this scope on
`feature/funkspace-minimum-usable`; it does not authorize a PR, merge,
deployment or another task.

**Next owners:** Codex performs the scheduled FS-1.7 compatibility review.
Dimi chooses when to start FS-1.4; it remains not started. No further FS-1.3
acceptance action is pending.
