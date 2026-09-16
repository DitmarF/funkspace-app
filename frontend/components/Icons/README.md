# FunkSpace icons

Eight existing Figma families, displayed at 24, 36 and 48 CSS pixels.
The gallery is **Icons / Library / Gallery** in Storybook. Playground exposes
name and size controls; Accent demonstrates inherited semantic color.

```tsx
import { Icon } from "@/components/Icons/Icon";

<Icon name="settings-burger" size={36} /> // decorative beside visible text
<Icon name="more" size={24} label="More information" /> // meaningful standalone image
```

Icons inherit `currentColor`. Set `--fs-icon-background` on the surrounding
surface for two-tone arrow interiors; the default is `surface-background`.
The Standard Button recipe supplies its own background automatically.
An icon is artwork, not an interactive control: use a named native button/link
when it performs an action.

## Source register

[UI Library Icons page](https://www.figma.com/design/o39DgxXnQ0jogb2ez6WKfq?node-id=6-2),
exported 2026-09-15. Raw SVGs below are exact exports with original paint/IDs.
They are provenance/download files; consume the inline Icon for theme-aware UI.
The original seven families use `0 0 size size`; Close preserves the actual
26/40/48-unit frames described below. All 24 exports are available.
Replacement/design owner: Dimi; latest-needed task: this requested FS-1.3
Storybook extension. Existing logo and Next starter assets are separate from
the UI icon library.

| Logical asset      | Figma source name  | Node       | Raw export                                           |
| ------------------ | ------------------ | ---------- | ---------------------------------------------------- |
| arrow-down-48      | arrow-down-48      | `64:55`    | [SVG](../../public/svg/icons/arrow-down-48.svg)      |
| arrow-up-48        | arrow-up-48        | `138:984`  | [SVG](../../public/svg/icons/arrow-up-48.svg)        |
| settings-burger-48 | settings-burger-48 | `7:39`     | [SVG](../../public/svg/icons/settings-burger-48.svg) |
| playground-48      | plaground-48       | `132:192`  | [SVG](../../public/svg/icons/playground-48.svg)      |
| more-48            | more-48            | `134:186`  | [SVG](../../public/svg/icons/more-48.svg)            |
| arrow-right-48     | arrow-right-48     | `138:983`  | [SVG](../../public/svg/icons/arrow-right-48.svg)     |
| arrow-left-48      | arrow-left-48      | `138:985`  | [SVG](../../public/svg/icons/arrow-left-48.svg)      |
| settings-burger-36 | settings-burger-36 | `72:222`   | [SVG](../../public/svg/icons/settings-burger-36.svg) |
| playground-36      | plaground-36       | `132:199`  | [SVG](../../public/svg/icons/playground-36.svg)      |
| more-36            | more-36            | `134:190`  | [SVG](../../public/svg/icons/more-36.svg)            |
| arrow-down-36      | arrow-down-36      | `138:1005` | [SVG](../../public/svg/icons/arrow-down-36.svg)      |
| arrow-up-36        | arrow-up-36        | `138:1006` | [SVG](../../public/svg/icons/arrow-up-36.svg)        |
| arrow-right-36     | arrow-right-36     | `138:1007` | [SVG](../../public/svg/icons/arrow-right-36.svg)     |
| arrow-left-36      | arrow-left-36      | `138:1008` | [SVG](../../public/svg/icons/arrow-left-36.svg)      |
| settings-burger-24 | settings-burger-24 | `72:237`   | [SVG](../../public/svg/icons/settings-burger-24.svg) |
| playground-24      | plaground-24       | `132:202`  | [SVG](../../public/svg/icons/playground-24.svg)      |
| more-24            | more-24            | `134:193`  | [SVG](../../public/svg/icons/more-24.svg)            |
| arrow-up-24        | arrow-down-36      | `138:1021` | [SVG](../../public/svg/icons/arrow-up-24.svg)        |
| arrow-down-24      | arrow-up-36        | `138:1022` | [SVG](../../public/svg/icons/arrow-down-24.svg)      |
| arrow-right-24     | arrow-right-36     | `138:1023` | [SVG](../../public/svg/icons/arrow-right-24.svg)     |
| arrow-left-24      | arrow-left-36      | `138:1024` | [SVG](../../public/svg/icons/arrow-left-24.svg)      |

Source issues preserved in this register:

- Figma spells Playground `plaground`; the code uses `playground`.
- Four actual 24-unit arrows are named “36” in Figma.
- 24-unit up/down source names are reversed relative to the geometry.
  Code names describe the actual direction: up is 138:1021, down is 138:1022.
  No path is rotated or redrawn to compensate.

### Close addition — 2026-09-16, FS-1.6

Dimi supplied and requested this artwork for dialog dismissal, replacing the
earlier text-only Close substitute. Source file/page is the same UI Library.

| Logical asset | Actual Figma name / node | Raw export                                 | Actual viewBox | Display size |
| ------------- | ------------------------ | ------------------------------------------ | -------------- | ------------ |
| close-24      | close-24 / `188:255`     | [SVG](../../public/svg/icons/close-24.svg) | `0 0 26 26`    | 24px         |
| close-36      | close-36 / `188:251`     | [SVG](../../public/svg/icons/close-36.svg) | `0 0 40 40`    | 36px         |
| close-48      | close-48 / `188:242`     | [SVG](../../public/svg/icons/close-48.svg) | `0 0 48 48`    | 48px         |

All three are available, exported directly from Figma without geometry edits.
Raw exports retain black paint. Inline `Icon name="close"` adapts it to
`currentColor`; the 48-unit clip ID is namespaced per instance. The smaller
exports have no internal IDs. Frame/name differences are preserved rather than
cropping or redrawing the artwork. These SVGs contain only paths and, at 48,
a clip group/definition: no scripts, handlers, external references, raster or
metadata. Consumer: icon gallery and `HexButton icon="close"`; decorative
inside the dialog's native button, whose accessible name is Close. Standalone
meaningful usage supplies `label`. Replacement owner: Dimi; latest-needed task:
FS-1.6. User requested the design substitution; final FS-1.7 acceptance remains
separate.

`iconArtwork.tsx` preserves each size-specific exported path, transform, stroke
and clip geometry. It adapts only JSX attributes, dark paint to currentColor,
light arrow interiors to the surface binding, and local IDs/references to a
per-instance prefix. Raw SVG IDs are isolated when loaded as images; never
paste multiple raw files inline without namespacing their IDs.
Trusted exports contain no scripts, event handlers, external references,
embedded raster images or metadata. Clip paths are retained.

## Adding an existing or newly approved icon

1. Export the real Figma component for each supported size; do not assume the
   24-unit drawing is a scaled 48-unit drawing. Record its node and actual name.
2. Add the unmodified export under `frontend/public/svg/icons/` and a row above.
3. Add its logical name and exact geometry to `iconArtwork.tsx`, following the
   current paint/ID adaptation. Add no loader, runtime SVG parser or dependency.
   The strict size record requires evidence for all three display sizes before
   publishing a family; retain and document any differing source viewBoxes.
4. The gallery and name control use `iconNames`, so they include the family
   automatically. Check all themes, accessible labeling and repeated IDs;
   run the focused icon tests and Storybook build.
