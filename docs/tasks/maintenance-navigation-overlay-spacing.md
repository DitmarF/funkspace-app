# Navigation overlay spacing — 2026-09-25

## Completion update — 2026-09-25

Included in the completed FS-3.1 change set. Dimi gives device acceptance,
confirms the P2 corrections are applied, and authorizes commit/push of all
current changes. See the [FS-3.1 acceptance record](fs-3.1-navigation-settings-overlay.md#dimi-device-acceptance-and-completion--2026-09-25).
Earlier pending-acceptance and review statements below describe their original
handoff dates; no new independent review or additional device detail is inferred.

## Task and context

Status: implementation and automated validation complete; Dimi's visual/device
acceptance pending. Sites is the sole writer.
Dimi requests balanced Close-button edge spacing, slightly more tree left
padding to match the right hex-control gutter, and removal of the top gap so
the Navigation heading shares Close's vertical center. The supplied mobile
screenshot is visual evidence. “Padding left” is interpreted as the right edge
beside the top-right Close button shown in the screenshot.

Branch `feature/funkspace-minimum-usable`, base
`b78a4169e15edf8f549f04717151efa043c09e01`; 575 working-tree files copied and
hashed before editing. Relevant AGENTS/workflow/template, authoritative feature
plan, supplied EPIC 3 plan, FS-1.6/FS-2.6 and existing FS-3.1 records were read
or retained from the preceding task. Actual overlay/tree/shell/HexButton/Dialog
CSS, composition, stories, browser tests, scripts and current state inspected.
The initially guessed FS-1.6 filename was absent; the actual prerequisite is
`fs-1.6-shared-dialog-primitive.md`, read successfully. Historical SHAs and
document instructions do not authorize resets or new stages.

## Implementation

- Overlay-only CSS shares the Close top coordinate with the content inset.
  Mobile Close's native target has equal top/right gaps while retaining its
  horizontal center on the hex rail. Safe-area constraints remain.
- Remove the old reserved content margin. A heading row matches the Close
  target height and centers its text vertically. On desktop, the heading has
  horizontal clearance beside the existing top-left Close button.
- Reuse shell gutters and its centered 80rem frame for the tree's left edge,
  matching the visible right edge of the hex artwork. Apply the same spacing
  to Accessibility details for consistent category switching.
- Short-screen category height accounts for the revised Close top inset.
  When enlarged controls exhaust a very short viewport, the added top inset
  contracts toward the safe edge so Close does not cover category activation.
  The detail-to-rail gap is capped at 12px and measured from the actual rail
  target edge, preserving room for enlarged nested labels.
  Native target sizes, rail/launcher alignment, custom artwork, destinations,
  themes, dialog lifecycle and fixture-only Motion remain unchanged.

Scope: `PortfolioNavigation.module.css`, focused composition browser checks,
this record and the parent FS-3.1 record. No public API, service, effect,
dependency, shared Dialog or tree component change. Independent review and
the next task are not started; no commit, push, PR or deployment.

## Validation and handoff

Browser assertions cover equal mobile target gaps, heading/Close centers and
tree/hex visual gutters at 320/375/768/1280/1440px. Existing long-label, 200%
text, short-screen, category/Close reachability, keyboard, themes and transition
checks protect practical behavior.

The first browser pass found two regressions at 200% text: nested-row horizontal
overflow at 320px and a Close/category pointer collision at 320×320. The final
CSS corrects these by bounding the rail gap and allowing the extra Close top
inset to contract when vertical room is exhausted. Assertions were preserved;
no shared lifecycle changes or button-size reductions were introduced.

Final results in the existing isolated source copy
`/var/folders/mc/hyg7fvq95rz1vdfk_tkx3nsc0000gn/T/funkspace-navigation-tree-_fsl0af0`:

- `pnpm lint` — PASS, including theme-bootstrap freshness and formatting.
- `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build` — PASS.
- `pnpm -F frontend exec tsc --noEmit` — PASS.
- `pnpm storybook:build` — PASS.
- Initial `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-spacing-focused.config.ts`
  — 19 PASS / 2 FAIL, the enlarged-text regressions described above. Preserved
  in `first-check.log`; this result is not treated as acceptance evidence.
- Final `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-spacing-all.config.ts`
  — PASS, 109/109, including both corrected regressions and four additional
  375/1440px composition cases. Existing theme, no-JS, keyboard, scrolling,
  responsive and delayed-navigation assertions remain intact.
- Final `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-spacing-stories.config.ts`
  — PASS, 6/6, including long/enlarged navigation and fixture-only Motion.
- `CHROME_PATH='/Users/dimi/Projects/funkspace-app/node_modules/.pnpm/playwright-core@1.55.1/node_modules/playwright-core/.local-browsers/chromium-1193/chrome-mac/Chromium.app/Contents/MacOS/Chromium' pnpm exec lhci autorun --config=/tmp/funkspace-spacing-lighthouse.json`
  — PASS, final three local desktop runs: performance 100, LCP 727.64–734.19ms,
  CLS 0, unchanged budgets and no upload.
- `PLAYWRIGHT_BROWSERS_PATH=0 node /tmp/funkspace-spacing-previews.cjs` — captured
  Dark previews at 375×668 and 1280×720 with the existing saved-theme path.
- Final focused Prettier, `git diff --check`, unchanged-input/generated hashes
  and exact incremental/full candidate replay — PASS. Four files changed;
  all 572 other input files retain their hashes. Executable validation snapshot
  matches repository source; final documentation followed the checks.

No unit rerun was needed for this CSS-only production change; browser geometry
and interaction checks are the applicable evidence. Installed dependencies were
reused. Existing Next lint deprecation and Storybook chunk-size advisories remain.
Author inspected the final diff and light/Dark mobile and wide previews. No
duplication, new listeners/state/effects, lifecycle leaks or generated drift.
Task-owned preview servers stopped. Physical devices, Safari/Firefox and
assistive-technology acceptance are not claimed. Extremely short enlarged-text
layouts prioritize category access over equal top/right spacing; wrapped headings
may grow beyond the Close target's height. Shared lifecycle acceptance remains
with FS-3.2, which was not started.

Handoff directory:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/navigation-overlay-spacing/`.
Preserved input hashes, exact incremental/full candidate diffs, validation
configuration/logs and previews belong to this candidate. Automated checks and
author inspection are separate from independent review (deferred) and Dimi's
visual/device acceptance (pending). Next action: Dimi checks the three requested
spacing relationships on the actual phone and wider screens.
