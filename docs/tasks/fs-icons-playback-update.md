# Figma playback icons and Games replacement — 2026-10-02

## Goal and source

Dimi requests integration of four new Play/Pause/Stop/Replay icons and a
replacement icon described as “fames” into Storybook. Actual inspected Figma
metadata identifies the replacement as **Games**, at the existing Games nodes.
The [UI Library Icons page](https://www.figma.com/design/o39DgxXnQ0jogb2ez6WKfq/001---FunkSpace-UI-Library?node-id=6-2)
provides all five families at 24/36/48. High-fidelity design context and screenshots
were inspected for every one of the 15 nodes. The [source register](../../frontend/components/Icons/README.md#playback-additions-and-games-replacement--2026-10-02)
records each node and actual export frame.

Candidate: `feature/funkspace-minimum-usable`, HEAD
`737d5fa9147eb9f3cac0ce0f3f8edc3c73e3ae8c`, plus this bounded icon patch and the
previously pending WEB/defaults changes. The [local packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/icons-2026-10-02/README.md)
contains the exact icon diff, hashes, source URLs and browser/build logs.

## Implementation and contracts

- Download twelve new and three replacement raw SVGs unchanged into the existing
  `frontend/public/svg/icons/` directory. All contain only SVG/groups/paths;
  no scripts, event handlers, external resources or raster content.
- Extend the existing `iconArtwork`/`iconNames` registry and exact viewBox map.
  Preserve per-size paths; adapt only paint to currentColor, JSX syntax and
  unused source IDs according to the established Icon convention. No loader,
  parser, service, dependency or parallel icon system is added.
- Gallery and Playground automatically include the four additions: 28 families,
  84 displayed variants. Games keeps its logical name and replaces its artwork
  everywhere the existing shared Icon is used, including navigation. Preserve
  accessible/decorative labeling and per-instance title IDs.
- Games requires the complete 24×25, 36×37 and 48×49 exports to retain its extended
  drawing. Play/Pause and Replay/48 retain their exact non-square/fractional
  viewBoxes. Existing display slots preserve aspect ratio.
- Update the gallery's exact expected counts and reuse the established per-visit
  `a11y.manual` setting so the explicit unfiltered Axe scan owns accessibility
  measurement. No scan rules or assertions are removed.
- Playback controls are not rewired. Motion, particle simulation, Canvas,
  navigation behavior, tokens/bootstrap and the pending WEB work remain unchanged.

## Validation and result

**Implemented and validated; not a separate independent review.**

- `pnpm exec vitest run frontend/components/Icons/Icon.test.tsx`: **89 pass**.
  Existing parameterized tests verify every size's path/viewBox parity against
  its exact source, accessible names, decorative semantics and unique IDs.
- Frontend and validation TypeScript checks and existing repository lint pass.
- Production On build passes, ID `8fnPU6hD3rZt1qNTlVg0-`; Storybook build passes.
  Isolated checkout `/tmp/fs-icons-20261002/on`; existing preview preserved.
- Actual Chrome **154.0.8037.92** gallery checks: **4/4 pass**, one worker, zero
  retries. Light, Dark, Muted and High Contrast each validate all 84 variants,
  exact sizes/viewBoxes, inherited paints/contrast, ID uniqueness, unfiltered
  accessibility and 320px/200% text reflow. Light/Dark screenshots were visually
  inspected against the Figma screenshots; no requested artwork is missing.
- Source/export hashes, unchanged pending-work hashes, formatting, links and
  final diff checks pass. Exact raw exports remain unformatted provenance files.

Existing Storybook chunk-size and next-lint deprecation warnings remain. No
Safari/Firefox/physical-phone, full-application coverage or fresh performance
audit is claimed for this asset-library task. Final human design acceptance
remains Dimi's. No commit, push, deployment or Figma write was performed.
