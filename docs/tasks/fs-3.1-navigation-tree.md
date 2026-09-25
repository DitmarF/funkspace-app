# FS-3.1 — Expandable navigation rows

## Completion update — 2026-09-25

Included in the completed FS-3.1 change set. Dimi gives device acceptance,
confirms the P2 corrections are applied, and authorizes commit/push of all
current changes. See the [FS-3.1 acceptance record](fs-3.1-navigation-settings-overlay.md#dimi-device-acceptance-and-completion--2026-09-25).
Earlier pending-acceptance and review statements below describe their original
handoff dates; no new independent review or additional device detail is inferred.

## Destination artwork, ordering and wording — 2026-09-25

Dimi's latest request replaces temporary row artwork with eight new Figma
families, moves Contact last, and uses Legal notice throughout the visible app.
See [source provenance, candidate and validation](maintenance-navigation-tree-icons.md).
The route `/impressum` and all existing destination identities remain stable.
Earlier entries below retain their historical wording and validation evidence.

## Branch-line alignment correction — 2026-09-24

Dimi's screenshot requests the vertical branch line centered beneath the
down-arrow tip and thickened to 2px. The existing 16px arrow is symmetric:
7px logical start margin plus half the 2px border places the line at its 8px
center. Reducing child padding by 8px retains the previous total child indent
(7 + 2 + 8 = 1 + 16). This applies recursively without JavaScript or new state.

Owner/current writer: Sites; branch/base unchanged from the record below.
547 input files were preserved before editing. Scope: tree CSS, focused browser
alignment coverage and this record. No icon, theme, dialog, lifecycle, generated
source, dependency or destination changes. The screenshot is visual evidence;
Dimi's request defines this bounded correction.

Evidence: `artifacts/fs-3.1-branch-line/` under the same local ChatGPT project
artifact root below. Exact candidate hashes and incremental/full diffs are
retained with command logs and narrow/wide previews. Automated checks and author
inspection are separate from independent review (not started) and Dimi's
visual/device acceptance (pending). Next owner/action: Dimi checks the line
under expanded Animations, Games and Privacy on the actual device.

Actual validation in the isolated source copy documented below:

- `pnpm lint`, `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build`, `pnpm -F frontend exec tsc --noEmit`, `pnpm storybook:build` — PASS. Existing Next lint deprecation and Storybook chunk-size advisories remain.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-branch-line.config.ts` — PASS, 22/22. New checks measure 2px line width and arrow/line center alignment for all three groups at 320/1280px and 100%/200% text, plus existing navigation/theme/no-JS/scroll/Close checks.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-branch-line-stories.config.ts` — PASS, 6/6, including long nested content, enlarged text and the unchanged Motion fixture.
- `CHROME_PATH='<installed Chromium path recorded below>' pnpm exec lhci autorun --config=/tmp/funkspace-branch-line-lighthouse.json` — PASS, three local runs, unchanged budgets; reports retained locally.
- Final focused Prettier and `git diff --check` — PASS. Source snapshot matched executable edits; all other input files retained their original hashes. Both candidate patches replayed successfully.

Author inspected CSS/test diff and 320/1280px screenshots: line centers align,
child indentation is preserved, and no state/effect or generated drift was
introduced. Browser checks supply the relevant coverage for this CSS-only
correction; unit suites were not rerun. Task-owned servers stopped after checks.
Physical-device and independent-review evidence remains pending.

## Figma small-arrow replacement — 2026-09-24

Dimi requested four newly added Figma families in Storybook and their use in
the navigation tree. Imported all twelve original 24/36/48 SVG exports from
UI Library `o39DgxXnQ0jogb2ez6WKfq`, Icons page `6:2`; exact node identities,
the down/24 source spelling issue and adaptation are recorded in the
[icon source register](../../frontend/components/Icons/README.md#fs-31-small-arrow-additions-2026-09-24).
The first download attempt returned empty bodies; curl retrieval subsequently
returned valid SVGs. Only verified SVG bytes were added.

The existing Icon registry adds `arrow-down-small`, `arrow-up-small`,
`arrow-right-small`, `arrow-left-small`; Gallery/Playground expose all sizes.
Navigation now selects right-small closed and down-small open. Its accepted
16px display size, 24px type icon, direct links without arrows and native
details state remain intact. Existing arrow families are retained.
The public contract change is limited to four additional IconName values.
No CSS, browser lifecycle, theme, generated output, dependency or route changes.

Owner/current writer: Sites. Branch `feature/funkspace-minimum-usable`,
base `b78a4169e15edf8f549f04717151efa043c09e01`; no reset or commit.
535 existing source files were copied and hashed before editing. Handoff root:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.1-small-arrows/`.
Source export hashes, exact incremental/full candidate diffs, file hashes,
validation logs/configuration and narrow/wide previews belong to this revision.
Earlier validation below remains historical. Independent Codex review is
deferred; Dimi's visual/device acceptance remains pending.

Actual checks ran in the same isolated source copy documented below, preserving
Dimi's running preview. Existing dependency links were reused; this is not a
fresh-install reproduction.

- `pnpm exec vitest run frontend/components/Layouts/PortfolioNavigationTree.test.tsx frontend/components/Layouts/PortfolioNavigation.test.tsx frontend/components/Layouts/PortfolioShell.test.tsx frontend/components/Icons/Icon.test.tsx` — PASS, 62 tests / 4 files. Includes all twelve new exports' geometry/viewBoxes and the tree's actual small-arrow selection.
- `pnpm lint`, `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build`, `pnpm -F frontend exec tsc --noEmit`, `pnpm storybook:build` — PASS. Existing Next lint deprecation and Storybook large-chunk advisories remain.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-small-arrows.config.ts` — PASS, 20/20. Native keyboard/no-JS disclosures, right/down visibility, 16/24px sizing, direct links without arrows, theme/axe checks, narrow/wide/short screens and 200% text.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-small-arrows-stories.config.ts` — PASS, 6/6. All 48 artwork variants across four themes, original viewBoxes, colors, unique IDs, axe and narrow enlarged text; existing navigation and fixture-only Motion stories.
- `CHROME_PATH='<installed Chromium path recorded below>' pnpm exec lhci autorun --config=/tmp/funkspace-small-arrows-lighthouse.json` — PASS, three local runs, performance 100 each, LCP 685.10–687.74 ms, CLS 0. Existing budgets unchanged; no remote upload.
- Final focused Prettier and `git diff --check` — PASS. Twelve raw files match source download hashes. Unchanged inputs and protected theme/bootstrap/generated/token/dependency/lifecycle files retain their original bytes; incremental and full candidate patches replay to the recorded file hashes.

Twenty files changed: twelve new raw SVGs; `iconArtwork.tsx` and icon README;
tree component and test; Storybook icon browser test; this record, parent FS-3.1
record and feature plan. Gallery already derives its names from the registry,
so no parallel story/component was needed. Its stale eight-family assertions
were updated to sixteen and all source viewBoxes, including existing categories.

Author inspected the final incremental diff, Figma screenshot, icon gallery and
320/1280px navigation previews. No duplication, new state/effects, lifecycle
ownership changes or generated drift was introduced. `manifest.json` records
exact changed files and SHA-256 hashes; `incremental.patch` isolates this request
and `full-candidate.patch` includes preserved prior local changes.
Task-owned servers stopped after checks. No independent review is claimed.
Next acceptance owner: Dimi, compare Gallery/Playground and narrow/wide previews,
then verify closed/right and open/down arrows on the actual device. Physical
device, Safari/Firefox and assistive-technology acceptance were not rerun.

## Custom disclosure arrows correction — 2026-09-24

Dimi requested arrows only for expandable groups, using existing custom
`arrow-right` when closed and `arrow-down` when open. These render at 16px beside
24px row icons. Direct links and disabled Coming soon rows have only their type
icon and text; their icon/text columns stay aligned with group rows. CSS follows
the native `details[open]` state, including without JavaScript, with no added
state, effects, animation or icon geometry. This supersedes the original standard
right/left arrows described in historical evidence below.

Owner: Sites, one writer. Branch/base unchanged. Current instructions authorize
this bounded correction; independent review and Dimi acceptance remain pending.
The previous complete candidate was captured before editing. Exact incremental
and full patches, file hashes, logs and previews are in
`artifacts/fs-3.1-tree-arrows/` under the same local ChatGPT project artifact root
used below. Seven files changed: the tree component/CSS/test, its browser test,
this record, the parent FS-3.1 record and the feature plan. The same isolated
source copy documented below was synchronized with the current checkout; the
existing running user preview was preserved.

Actual validation for this correction:

- `pnpm exec vitest run frontend/components/Layouts/PortfolioNavigationTree.test.tsx frontend/components/Layouts/PortfolioNavigation.test.tsx frontend/components/Layouts/PortfolioShell.test.tsx frontend/components/Icons/Icon.test.tsx` — PASS, 50 tests / 4 files.
- `pnpm lint`, `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build`, `pnpm -F frontend exec tsc --noEmit`, `pnpm storybook:build` — PASS. Existing Next lint deprecation / Storybook large-chunk advisories remain.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-arrows.config.ts` — PASS, 20/20 production navigation tests. Includes right/down visibility and 16/24px sizing, no arrow SVG on direct/pending rows, keyboard state changes, native no-JS state changes, themes/axe, real destinations, 320px/short/wide layouts, 200% text and Close alignment.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-arrows-stories.config.ts` — PASS, 2/2 existing navigation/Motion fixtures.
- `CHROME_PATH='<same installed Chromium path recorded below>' pnpm exec lhci autorun --config=/tmp/funkspace-arrows-lighthouse.json` — PASS, three local desktop runs, performance 100 each, LCP 685.29–693.77 ms, CLS 0, unchanged budgets. Exact configuration/logs retained; no remote upload.
- `git diff --check` and focused Prettier check after the no-JS assertion addition — PASS. No theme/bootstrap/generated/icon-artwork/dependency change; preserved files verified by hashes.

Author inspected the incremental diff and 320/1280px previews. Native open-state
CSS selects the two existing icons; no listeners, React state or asset copies were
introduced. The previous hand-written arrow was removed. Candidate manifest and
replayable patches identify exact file bytes. Task-owned preview servers stopped
after capture; `navigation-320.png` / `navigation-1280.png` persist in the handoff.
No independent review or new Dimi visual/device acceptance is claimed. Earlier
full-suite/theme-startup evidence below remains historical, not rerun evidence for
this bounded arrow-only correction.

## Scope, owner and authorization

- Owner/current writer: Sites. Implementation requested by Dimi on 2026-09-24; independent Codex review is not started. Final visual/device acceptance remains Dimi's.
- Branch/base: `feature/funkspace-minimum-usable`, `b78a4169e15edf8f549f04717151efa043c09e01`. Existing 51 changed/untracked files were preserved; 528 input files captured before editing. Historical SHAs are not reset targets.
- Read: root AGENTS (no nested guidance), feature plan, workflow/task template, downloaded EPIC 3 detailed plan, FS-1.6/FS-2.6 and FS-3.1 records, current navigation/shell/dialog/control/icon/destination code and tests, package scripts, and screenshot. The screenshot illustrates hierarchy, not a replacement visual design. Existing documents are context; Dimi's current revision defines scope.
- Explicit follow-up: show requested unpublished animation/game entries as disabled “Coming soon” until their pages are ready.

## Decisions and implementation

Use native `details`/`summary` groups and ordinary anchors in the existing Primary navigation landmark. No ARIA application menu/tree, custom keyboard framework, new modal or dependency. Enter/Space toggle each group independently, and Tab reaches available links and summaries. Only groups have arrows: custom right when closed and custom down when open, smaller than the settings-burger row artwork. All rows retain visible text and no outlined button container. Per-row icon names live in typed navigation data for later replacement.

The list is Home → `/`, About → `/about`, Contact → `/#contact`; Animations → First animation / Second animation; Games → Wave Survivor / Second game; Privacy → Privacy policy (`/privacy`) / Imprint (`/impressum`). Future entries have no href or click handler and visibly say Coming soon. Ellipses in the brief mean future expansion, not literal menu items. The existing shared destination keys and URLs remain authoritative; navigation labels may differ from the logo, homepage section and footer labels. No new pages or game hosting are created.

The same recursive presentation supports the static no-JavaScript fallback and the existing full-screen overlay. Groups reset when the category/overlay remounts; no persistence is introduced. Same-page links retain synchronous overlay closure before scrolling; cross-page Next Link anchors keep the complete overlay until the destination commits, using the unchanged dialog lifecycle. See [transition correction](maintenance-navigation-transition.md). Contact still reaches/focuses its real homepage section. About now opens the full page. Footer legal links and homepage About preview are unchanged.

Use semantic primary text (black in the default theme, readable colors in others), normal-text orange-family hover token, existing focus token and 48px minimum rows. The normal-text hover token retains contrast at 16px; the outline button's brighter large-text hover token is unsuitable at that size. Indentation/labels wrap at narrow sizes and 200% text. No tree animation is added.

Protected: theme first-paint correction and generated pipeline, ThemeService/providers, category rail and disabled Chat-bot/Languages, Close alignment, Dialog/useDialog/browser lifecycle, static logo and fixture-only Motion, tokens/generated output, existing local work. No next-stage work, commit, push, PR, merge, deployment, reset or external configuration.

## Changed files and validation

Implementation: `frontend/data/portfolioNavigation.ts`; new `PortfolioNavigationTree.tsx` / CSS / test / stories under `frontend/components/Layouts/`; existing `PortfolioNavigation.tsx` / CSS / tests; static `PortfolioShell.test.tsx`; navigation composition/route/settings and Storybook browser tests plus `e2e/navigation-tree.spec.ts`. Documentation: this record, FS-3.1 parent record and authoritative feature plan.

Implementation and automated validation complete; independent review and Dimi acceptance pending. Local handoff root: `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.1-navigation-tree/`. `manifest.json` identifies all 17 task files, exact SHA-256 file/patch hashes, branch/base and protected source checks. `incremental.patch` isolates this revision; `full-candidate.patch` includes all prior local work. Both patches were replayed and checked against current file bytes. Input hashes/before-images protect the previous candidate. Logs, configurations, traces, Lighthouse reports and previews accompany the record.

### Commands and actual results

Commands ran in `/var/folders/mc/hyg7fvq95rz1vdfk_tkx3nsc0000gn/T/funkspace-navigation-tree-_fsl0af0`, an isolated complete current source copy with existing dependency links. This preserves Dimi's running preview and is not a clean dependency-install reproduction. Source hashes matched the applied checkout; final documentation evidence updates followed the executable checks.

| Command                                                                                                                                                                                                                                                                           | Actual result                                                                                                                                                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test`                                                                                                                                                                                                                                                                       | Final PASS, 1,416 tests / 98 files, including generated theme freshness and navigation/static document tests. Initial run had four stale static-link-count expectations; adding two real nested legal anchors required updating the counts. |
| `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build`                                                                                                                                                                                                                                 | Final PASS, full tokens/common/bootstrap/game/Next production sequence. Rebuilt after the enlarged-text CSS correction.                                                                                                                     |
| `pnpm lint`                                                                                                                                                                                                                                                                       | Final PASS, freshness, no ESLint warnings/errors and repository formatting. Existing Next lint-command deprecation notice remains.                                                                                                          |
| `pnpm -F frontend exec tsc --noEmit`                                                                                                                                                                                                                                              | Final PASS.                                                                                                                                                                                                                                 |
| `pnpm storybook:build`                                                                                                                                                                                                                                                            | Final PASS; includes the tree's Default/GrowingContent and existing overlay/Motion fixtures. Existing Vite large-chunk advisory remains.                                                                                                    |
| `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-tree-final.config.ts`                                                                                                                                                                               | Final PASS, 98/98 production portfolio tests, two Chromium workers, no retries. Includes all themes, native keyboard groups, pointer hover/focus, axe, destinations/history, no-JS, 320px/short/wide viewports, 200% text and long content. |
| `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-tree-theme-final.config.ts`                                                                                                                                                                         | PASS, 19/19 production startup tests; saved Dark before first paint, delayed chunks at 320/1280px, reload, storage/media faults and negative control remain protected.                                                                      |
| `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-tree-stories.config.ts`                                                                                                                                                                             | Final PASS, 2/2; expanded long labels at 320px/200% text and unchanged fixture-only Motion reset behavior.                                                                                                                                  |
| `CHROME_PATH='/Users/dimi/Projects/funkspace-app/node_modules/.pnpm/playwright-core@1.55.1/node_modules/playwright-core/.local-browsers/chromium-1193/chrome-mac/Chromium.app/Contents/MacOS/Chromium' pnpm exec lhci autorun --config=/tmp/funkspace-tree-lighthouse-final.json` | PASS, three local desktop-preset runs, performance 100 each, LCP 682.98–684.45 ms, CLS 0. Existing 2500 ms / 0.1 budgets retained; reports saved locally, no upload.                                                                        |

The initial browser run passed 96/98. Both failures were real 320px/200%-text visibility failures: scalable decorative slots consumed the label width. Fixed arrow/icon slots at 16/24px and capped gaps/indentation preserve room for growing text. The final complete run passed all 98 unchanged behavioral checks; no force-click, assertion removal, skipped case or threshold reduction was used to conceal the issue.

The final local production server used port 3310; Storybook used 3311. The preview returned HTTP 200; the app's browser-open tool returned `queued`, which does not prove Dimi viewed it. Task-owned preview servers were stopped after validation; existing user servers were untouched. Persistent `navigation-320-default.png`, `navigation-1280-default.png` and matching Dark screenshots are the narrow/wide handoff. Four capture contexts reported zero console/page errors.

### Author inspection and acceptance separation

Author inspected the incremental diff and narrow/wide screenshots. Native details avoid a second state/lifecycle system; the old flat overlay-link rendering and unused destination CSS were removed. Existing footer legal rendering is still used by the footer. Shared href identities, category rail, Close geometry, appearance service, startup payload, generated tokens, dependencies and browser adapters remained unchanged. No new listener, timer, persistence or motion loop was introduced.

Automated Chromium evidence and author inspection are not independent Codex review, physical-device/Safari/Firefox testing, assistive-technology acceptance, or Dimi's visual approval. Dimi's only recorded observation/choice in this revision is the supplied example and explicit disabled Coming soon decision; post-implementation acceptance is pending.

## Next acceptance action

Dimi: inspect narrow/wide previews, expand Animations/Games/Privacy, check labels and icon sizing, follow About/Contact/legal links, and check the actual device/browser at enlarged text. Future icon replacements and publishing destinations are later explicit changes. Independent review remains deferred; automated checks and author inspection are not Dimi's observations or review approval.
