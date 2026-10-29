# Navigation destination icons and wording — 2026-09-25

## Completion update — 2026-09-25

Included in the completed FS-3.1 change set. Dimi gives device acceptance,
confirms the P2 corrections are applied, and authorizes commit/push of all
current changes. See the [FS-3.1 acceptance record](fs-3.1-navigation-settings-overlay.md#dimi-device-acceptance-and-completion--2026-09-25).
Earlier pending-acceptance and review statements below describe their original
handoff dates; no new independent review or additional device detail is inferred.

## Task and scope

Status: implementation complete; independent review not started and Dimi's
visual/device acceptance pending. Owner/current writer: Sites implementation
agent. This is a bounded FS-3.1 follow-up, not authorization to start FS-3.2.

Dimi requests Contact last in the navigation tree, Legal notice instead of
Imprint throughout the app, and eight new Figma destination icons in Storybook
and the corresponding navigation rows. Preserve the existing route identities,
ordinary links, disabled Coming soon entries, dialog lifecycle and theme startup.

Branch: `feature/funkspace-minimum-usable`; base:
`b78a4169e15edf8f549f04717151efa043c09e01`. All 550 source inputs were copied
and hashed before editing. No reset, commit, push, PR or deployment.

Inspected repository AGENTS, authoritative feature plan, AI workflow/task
template, supplied EPIC 3 detailed plan, prerequisite FS-1.6/FS-2.6 and current
FS-3.1 records; actual navigation data/tree, shared destinations/footer, legal
page, icon artwork/viewBoxes/gallery, tests, package scripts and working tree.
Documents constrain this work; Dimi's latest request defines its scope.

## Implementation decisions

- Root order: Home, About, Animations, Games, Privacy, Contact. Privacy expands
  to Privacy policy and Legal notice; Contact follows all expanded children.
- Legal notice replaces visible Imprint/Impressum in navigation, footer, page
  heading and metadata title. `/impressum`, shared destination identity and
  existing row ID remain stable. Legal draft content/release blockers remain.
- Reuse the existing Icon registry, actual viewBox map, raw export directory and
  automatic Gallery/Playground. Import all eight families in all three sizes:
  24 originals, 24 new inline variants; 24 families / 72 variants total.
- Source: [Figma UI Library Icons](https://www.figma.com/design/o39DgxXnQ0jogb2ez6WKfq/001---FunkSpace-UI-Library?node-id=6-2).
  Exact node IDs and adaptations are in the [icon register](../../frontend/components/Icons/README.md).
  Figma `privacy-police` is normalized to `privacy-policy` in code. Raw SVGs
  retain exact source bytes. Only paint/JSX and unused IDs are adapted inline;
  all paths and non-square viewBoxes are preserved with normal aspect ratio.
- Tree rows select matching 24-size artwork. Pending animations/games reuse
  their category artwork, a reversible assumption until Dimi supplies specific
  item icons. Existing small disclosure arrows and hover/theme tokens remain.
- Contract changes: eight additional IconName values, Contact ordering and
  Legal notice wording. No new routes, services, state, effects or dependencies.

## Validation and handoff

Changed files: icon artwork and viewBox registries, 24 raw SVGs, icon source
register, navigation/shared destination data, legal page, associated unit/browser
expectations and four feature/task records. The artifact manifest lists all 44
paths and hashes; the incremental diff isolates this task from prior local work.

Actual checks (installed dependencies reused; no fresh-install claim):

- `pnpm test` — PASS, 1,453 tests / 98 files, including the 24 new exports'
  paths/viewBoxes and navigation artwork/order coverage.
- `pnpm lint` — PASS, including theme-bootstrap freshness and formatting.
- `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build` — PASS.
- `pnpm -F frontend exec tsc --noEmit` — PASS.
- `pnpm storybook:build` — PASS; Gallery/Playground expose 72 variants.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-tree-icons-all.config.ts`
  — PASS, 105/105 portfolio checks: routing, legal headings/titles/footer,
  narrow/wide layouts, enlarged text, themes, native no-JS links, keyboard and
  existing delayed-navigation regression coverage.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-tree-icons-stories.config.ts`
  — PASS, 6/6: all 72 variants across four themes with contrast, paint,
  viewBox/size, unique-ID and accessibility checks; growing navigation and
  fixture-only Motion. No production Motion settings were added.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-tree-icons-final.config.ts`
  — PASS, 4/4 after refining test-only screenshots to viewport captures and
  explicitly checking that Contact can be scrolled into view at 320/1280px.
  These replace initial full-page captures that included content beyond the
  dialog's visible viewport; no production change was needed.
- `CHROME_PATH='/Users/dimi/Projects/funkspace-app/node_modules/.pnpm/playwright-core@1.55.1/node_modules/playwright-core/.local-browsers/chromium-1193/chrome-mac/Chromium.app/Contents/MacOS/Chromium' pnpm exec lhci autorun --config=/tmp/funkspace-tree-icons-lighthouse.json`
  — PASS, three local desktop runs, performance 100, LCP 726.81–730.50ms,
  CLS 0, existing budgets, local reports without upload.
- Focused final Prettier, `git diff --check`, source/export hashes and exact
  incremental/full candidate patch replay — PASS. All 531 inputs outside this
  task retain their hashes; generated outputs and previous artwork are intact.

Build/browser checks ran in the existing isolated source copy:
`/var/folders/mc/hyg7fvq95rz1vdfk_tkx3nsc0000gn/T/funkspace-navigation-tree-_fsl0af0`.
Executable candidate files match the repository; final evidence-only documentation
was updated afterward. Existing Next lint deprecation and Storybook chunk-size
advisories remain. Task-owned validation servers stopped after checks.

Author inspected the diff and light/dark gallery plus 320/1280px tree captures.
No duplicate icon system, browser effects, listeners, state, lifecycle changes,
dependency or generated drift were introduced. Existing fixed desktop Close can
cover top-left content as the panel scrolls; positioning/CSS are unchanged here
and that lifecycle/layout follow-up remains with the FS-3.2 owner. No physical
device, Safari/Firefox, assistive-technology or independent-review PASS is claimed.

Handoff root:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/navigation-tree-icons/`.
It contains source export hashes, preserved inputs, exact incremental/full
candidate diffs, command logs/configuration and narrow/wide previews. Automated
checks and author inspection are separate from independent review (deferred)
and Dimi's observations/approval (pending). Next acceptance owner: Dimi checks
the icon choices, Contact-last order and Legal notice wording on actual devices.
