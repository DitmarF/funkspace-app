# FS-3.1 — Short-screen categories and focused-link clearance

## Dimi acceptance — 2026-09-25

**Complete and device-accepted.** Dimi confirms both corrections are applied,
gives device acceptance, closes FS-3.1 and authorizes committing/pushing all
current changes. See [the completion record](fs-3.1-navigation-settings-overlay.md#dimi-device-acceptance-and-completion--2026-09-25).
This supersedes pending device acceptance below. The original review, automated
correction evidence and Dimi's approval remain distinct; no separate
post-correction independent review PASS or specific device/browser matrix is
claimed. The rest of this record preserves the implementation handoff history.

## Request and ownership

2026-09-25. Dimi authorizes applying exactly two P2 findings from the Codex
read-only review: severely clipped category controls on short screens, and
fixed Close covering a focused navigation link. Sites is the sole implementation
writer. This is a correction to FS-3.1, not the start of FS-3.2 or FS-3.3.
Implementation validation and renewed independent review are separate from
Dimi's visual/device acceptance.

Branch `feature/funkspace-minimum-usable`, base
`b78a4169e15edf8f549f04717151efa043c09e01`. All 576 existing source inputs were
copied and hashed before editing. The reviewed full candidate patch had SHA-256
`ce17b77b70ae32edc2909ec9ab059d8b02a0fca0f1370aa8191f678855181c5b`.
Existing local changes are protected; the base is an evidence reference, never
a reset target.

## Evidence and scope

Read or retained relevant AGENTS guidance, the authoritative feature plan,
development workflow, task template, supplied detailed EPIC 3 plan, FS-1.6 and
FS-2.6 prerequisites and current FS-3.1 records. Inspected actual shell/overlay,
tree, Dialog and HexButton CSS, component composition, browser tests, stories,
scripts and working-tree state. The current user request authorizes these two
fixes; historical document instructions do not authorize additional work.

The reviewed 320×320 / 200% text case exposed only a small strip of a 148px
category button. At 1280×720 / 200%, expanding all branches and moving keyboard
focus from Contact back to Home placed Home's icon, text and focus outline under
the fixed Close cover. Existing partial-viewport assertions missed both defects.

Scope: `PortfolioShell.module.css`, `PortfolioNavigation.module.css`,
`e2e/navigation-composition.spec.ts`, this record and the parent FS-3.1 record.
No new public API, service, browser effect, dependency or shared Dialog lifecycle.
Theme bootstrap/generated outputs, destinations, native links, category order,
custom artwork, static logo and fixture-only Motion are protected.

## Implementation decisions

- At heights up to 36rem, icon-only navigation artwork is capped at its existing
  nominal size: category/Menu targets remain 76px and Close remains 52px,
  including native borders. Text still enlarges normally. The launcher and
  overlay share the same size and position variables, including safe-area
  constraints. Taller layouts retain their previous scaling.
- Bound rail padding and the bottom gutter, and calculate available category
  height between Close and Menu. The existing category scroller can expose a
  complete focused target plus its focus outline. This adds no second overlay
  or new scrolling/focus lifecycle implementation.
- Desktop dialog scroll padding accounts for the fixed Close cover, so native
  keyboard scrolling reveals the focused row below it. Initial heading/Close
  alignment and the tree's initial top position remain intact.
- New regression checks use actual clipping bounds, focus-outline clearance
  and hit testing. Five short-screen cases exercise Navigation and Accessibility
  at 200% text (320×320, 320×481, 320×568, 320×577 and 1280×320). A desktop
  keyboard regression reproduces Contact-to-Home reverse traversal after all
  branches expand.

Both original regression checks failed against the unchanged reviewed build,
then passed against the fix. The additional heights cover the compact-layout
boundary and short landscape presentation. Checks do not reduce target-size,
focus or accessibility expectations.

## Validation and acceptance

Status: implementation and automated validation complete; renewed independent
review and Dimi's visual/device acceptance pending.

Validation used the isolated source copy
`/var/folders/mc/hyg7fvq95rz1vdfk_tkx3nsc0000gn/T/funkspace-fs31-review-jkz762na`,
with existing installed dependencies. Actual commands/results:

- `pnpm check:theme-bootstrap` before generation — PASS, accepted output fresh.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-fs31-review-all.config.ts --grep 'complete keyboard-focused|full navigation row'`
  against the unchanged reviewed build — 2 FAIL as expected. The new checks
  reproduce clipping and a negative 89.58px clearance beneath Close. Preserved
  as reproduction evidence, not acceptance evidence.
- Same targeted checks with `/tmp/funkspace-p2-all.config.ts` after the fix —
  2 PASS. The first broader run passed 111 checks. Coverage was then expanded
  and the compact-height breakpoint extended to protect adjacent short sizes.
- `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build` — PASS on final source.
- `pnpm lint` — PASS, including bootstrap freshness and repository formatting.
- `pnpm -F frontend exec tsc --noEmit --incremental false` — PASS.
- `pnpm storybook:build` — PASS on final source.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-p2-all.config.ts`
  — PASS, 115/115 in one final run, no retries. Includes six new regression cases,
  normal/enlarged responsive layouts, themes, legal links, keyboard traversal,
  no-JavaScript fallbacks, launcher/Close alignment and navigation transitions.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-p2-stories.config.ts`
  — PASS, 34/34; navigation, controlled Motion, icons, HexButton and Dialog.
- `CHROME_PATH='/Users/dimi/Projects/funkspace-app/node_modules/.pnpm/playwright-core@1.55.1/node_modules/playwright-core/.local-browsers/chromium-1193/chrome-mac/Chromium.app/Contents/MacOS/Chromium' pnpm exec lhci autorun --config=/tmp/funkspace-p2-lighthouse.json`
  — PASS, three local desktop homepage runs, performance 100, LCP
  725.14–729.40ms, CLS 0. Existing budgets unchanged; filesystem reports only.
  This does not measure open-overlay performance or field conditions.
- `PLAYWRIGHT_BROWSERS_PATH=0 node /tmp/funkspace-p2-previews.cjs` — PASS,
  captured Dark previews at 375×668 and 1280×720. Author also inspected the
  focused short-screen and desktop regression screenshots.
- Final focused formatting, `git diff --check`, protected-source hashes and
  incremental/full candidate replay — PASS. Five files changed; 572 other
  original source inputs are unchanged. Generated outputs have no drift, and
  the executable validation snapshot matches the repository candidate.

No unit rerun: the production changes are CSS-only, with browser geometry,
interaction and shared-story checks supplying the relevant evidence. No new
theme-bootstrap browser matrix was run; bootstrap source is untouched. Existing
Next lint deprecation and Storybook chunk-size advisories remain.

Exact incremental/full patches, their SHA-256 values, changed-file hashes,
reproduction/final logs, configurations and previews are retained at
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/navigation-p2-fixes/`;
`manifest.json` identifies the uncommitted candidate. Author reviewed the bounded
diff for duplication, regressions, lifecycle changes and generated drift.
No new listeners, effects or preference authority. Task-owned servers stopped;
no commit, push, PR, deployment or next stage started.

Next acceptance: Codex reviews the exact correction when requested; Dimi checks
short-screen category scrolling and desktop keyboard focus on actual devices.
Physical-device, Safari/Firefox and assistive-technology acceptance are not
claimed. The separately deferred same-Contact focus issue belongs to FS-3.2,
and denied-storage appearance consistency belongs to FS-3.3; neither is changed
here. Those stage owners retain their respective follow-up work.
