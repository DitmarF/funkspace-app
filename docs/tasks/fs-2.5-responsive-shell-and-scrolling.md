# Task FS-2.5 — Responsive shell and ordinary scrolling

## Task metadata

- **Status:** Complete — Dimi explicitly declared FS-2.5 done and authorized documentation closure, commit and push on 2026-09-20. Integrated FS-2.6 review remains separate.
- **Owner:** Sites implementation; Codex integrated review; Dimi product/device acceptance.
- **Last updated:** 2026-09-20
- **Related:** [Feature plan](../features/funkspace-minimum-usable.md#fs-25--complete-responsive-shell-and-ordinary-scrolling), [workflow](../development/ai-workflow.md), [architecture](../architecture.md).

## Requested outcome and acceptance

Finish the integrated portfolio shell with mobile-first spacing, readable growing content and one ordinary document scroll flow. Preserve the accepted controls, providers and route contracts.

- [x] Four routes retain one header/main/footer with usable links and content-driven heights.
- [x] Requested six viewports and 200% text enlargement have overflow, scrolling, theme and keyboard evidence.
- [x] Long headings, addresses, URLs and navigation labels wrap without clipping.
- [x] Decorative marks remain hidden/non-intercepting; focus and footer/contact/legal links remain reachable.
- [x] Safe-area spacing and menu clearance remain portfolio-local; future play route is not created or forced into this shell.
- [x] Relevant validation, self-review and reproducible candidate supplied for integrated Codex review.
- [x] Dimi explicitly accepts task completion; actual instruction recorded below.
- [ ] Detailed physical-device/browser-version results remain unrecorded. The explicit completion decision closes the task without claiming those tests ran; emulation is not physical-device evidence.

## Context and repository evidence

Authorized checkout `/Users/dimi/Projects/funkspace-app`; branch `feature/funkspace-minimum-usable`; exact base `480424c81f4e5bb28a2471a2d3be89aef2acfcac`. Starting working tree clean, no protected local changes. No commit/push/deployment authorization is carried forward from FS-2.4 closure.

Inspected root AGENTS (no nested AGENTS found), workflow/task template, architecture/checklist, authoritative plan and supplied detailed EPIC 2 proposal, FS-0.5 and FS-1.7 decisions, FS-2.1 contract and FS-2.2/2.3/2.4 completion evidence, package scripts, four routes, root/providers, Container, PortfolioShell/Navigation/Section, Start, AboutPreview, Contact, ButtonLink/standardControl, Dialog, themes and existing browser/component checks.

The actual production path already uses normal document scrolling. Legacy About/SnapSection/fullscreen examples are not imported by these pages and remain untouched. The desktop fixed launcher could remain over article content as it scrolled; shell gutters did not account for horizontal safe areas, and navigation list items lacked an explicit shrink constraint for unusually long labels. Existing controls already wrap their own labels. Reuse those controls and constrain their actual layout parents.

### Dependencies and unresolved inputs

- [FS-2.2](fs-2.2-static-start-and-logo.md#codex-review-and-dimi-completion--2026-09-20): independent logo/static review PASS and Dimi completion recorded; original manual/visual acceptance applies to that candidate. Static logo/scene and authorized working navigation/theme overlay are retained. Later motion policy remains deferred.
- [FS-2.3](fs-2.3-about-preview-and-page.md#dimi-completion-and-commitpush-authorization--2026-09-20): accepted bounded About delivery; Lorem Ipsum remains draft, with final copy owned by Dimi before publication.
- [FS-2.4](fs-2.4-contact-footer-and-legal-structure.md#dimi-completion-and-commitpush-authorization--2026-09-20): accepted email/footer/draft legal structure, 1,371 unit and 54 browser checks recorded. Operator/current hosting/mailbox facts and final wording still block publication/full static checkpoint. Dimi supplies facts; Sites incorporates; Codex verifies technical evidence. Provider-specific finalization stays FS-5.5.
- The detailed proposal's future-only Menu timing is superseded by the explicit FS-2.2 overlay authorization. Preserve the working trigger and fresh no-JavaScript native links. No new EPIC 3 behavior is introduced.

## Scope and plan

Presentation-only changes to PortfolioShell and its CSS, PortfolioNavigation list layout, PortfolioSection padding, focused responsive browser coverage and task/feature evidence. Reuse Container with `padding="none"` only at these three shell consumers; do not change the universal Container API or unrelated examples. Keep existing typography, section spacing, scene aspect ratios and content-driven heights unless a measured defect requires correction.

1. Use a portfolio-local flex column with minimum opening height, safe-area gutters and a growing main. Short secondary pages put the footer at the bottom; long content grows normally.
2. Retain bottom-right fixed mobile Menu; reserve footer scroll space and focused-target scroll margins. Keep desktop Menu top-right opposite the logo, positioned within the shell so it scrolls with the header rather than covering articles. Reserve header room for it.
3. Constrain shared navigation list items; allow long shell copy to wrap at its layout owner. No blanket overflow suppression.
4. Add viewport/theme/keyboard, long-content/no-JS, synthetic safe-area and emulated-touch regressions; run prerequisite checks, builds and integrated browser/performance validation.

Protected: universal root layout, providers/theme bootstrap, ThemeService, accepted logo/control APIs, tokens/fonts, route/destination data, public game contract, all unrelated demos/assets. No new runtime/client boundary, framework, service, dependency, geometry or scroll handler. Future play isolation follows explicit per-route PortfolioShell composition, not a new route group.

## Validation plan

CSS viewport matrix: 320×568, 390×844, 844×390, 768×1024, 1280×720, 1440×900. Each route in default/dark/muted/dark-high-contrast at 100% and 200% root font size (text/rem enlargement, unchanged CSS viewport; not claimed browser UI zoom). Separate fresh no-JavaScript enlarged long-content fixtures at all six sizes. Synthetic 32px safe-area variables and Chromium touch input are emulation only.

Run bootstrap freshness before generation; tokens → common types → game workspace build → frontend types. Focused component tests, lint, production and Storybook builds, existing route/logo/settings/theme browser checks plus new responsive matrix, and local Lighthouse. Game build is a workspace prerequisite, not evidence of browser runtime loading. Inspect transitive imports and protected-file diffs.

## Completion record

### Implementation and constraints

- A portfolio-local wrapper owns `min-height: 100svh` and a growing main; no fixed document height, clipping or new scroll container. Existing 80rem shell maximum, readable prose width, type tokens and Start scene aspect ratios remain unchanged. Wide copy grows freely.
- Container padding is delegated only for the shell's three existing consumers. Shared gutters use the larger of responsive token padding and safe-area insets. No universal wrapper or root stylesheet change forces portfolio presentation onto a future play route.
- Section padding is capped at `5vw` while retaining the `fs-space-lg` maximum. Testing found that doubled rem gutters previously left too little reading width for the About link at 320px/200%; the layout correction preserves the accepted control's API and label wrapping.
- The focused skip link uses fixed, inset-aware positioning, preventing its top edge from leaving the viewport after native focus scrolling. Other focused targets have small scroll margins. The document scroll owner receives bottom scroll padding via `html:has(.shell)` in the shell CSS module, only while a portfolio shell is present; a fixture verifies removal of that shell class returns padding to `auto`. This is not a new scroll container or universal root-wrapper change. Decorative marks retain `aria-hidden`, `focusable=false` and `pointer-events:none`.
- At the existing 48rem breakpoint, the menu is top-right opposite the logo and scrolls with the opening header. Header padding reserves its footprint. Below that breakpoint it remains the accepted fixed bottom-right trigger, with unchanged artwork alignment, extra footer room and focused-link clearance. Floating mobile chrome still occupies a viewport corner while reading; content can scroll above it and keyboard focus must remain fully clear. This is a containment constraint for later menu work, not permission to add another scroll container or clip content.
- Safe-area variables are local aliases of browser `env(safe-area-inset-*)`; synthetic 32px fixtures verify arithmetic. Root viewport metadata remains unchanged. Actual notch/browser chrome/keyboard behavior needs Dimi's device check.
- No route labels/hrefs, component public APIs, data/backend contracts, dependencies, providers, theme bootstrap, logo behavior or game API changed. Existing production routes alone opt into PortfolioShell; no future play route was created.

### Validation results

- Before the production changes, two targeted regression checks failed: the desktop trigger remained in the viewport after document scrolling and a long-content fixture overflowed. The first candidate exposed narrow enlarged-text focus and skip-link positioning defects; both were corrected. Long-label fixtures were corrected to retain the actual control label span, rather than deleting its wrapping markup.
- Bootstrap freshness PASS before generation; `pnpm build:tokens` → common typecheck → game workspace build → frontend `tsc --noEmit` PASS. Final frontend types PASS again after corrections.
- `pnpm test`: PASS, 96 files / 1,371 tests. After the final section/skip corrections, focused PortfolioShell/Start/Contact tests: PASS, 3 files / 8 tests.
- `pnpm lint`: PASS, repeated after corrections; existing Next lint deprecation notice remains. Production build PASS after corrections; all four routes prerendered. Storybook build PASS after corrections; existing Vite client-directive/sourcemap/large-chunk warnings remain.
- Final production `pnpm e2e --workers=2 --reporter=line`: PASS, 75/75, zero retries. Includes 21 new responsive tests and 54 existing About, legal/contact, navigation, static-logo, theme, settings and accessibility tests. Existing modal lifecycle and no-JavaScript links remain usable. An earlier 74/74 pass checked focused link centers; strengthening it to reject any link/menu rectangle intersection exposed two mobile 200% failures. Portfolio-conditional document scroll padding corrected those cases; final assertions were retained and all passed.
- New matrix: 6 viewports × 2 text sizes × 4 themes × 4 routes = 192 page conditions, plus 24 fresh no-JavaScript enlarged long-content conditions, 2 synthetic safe-area sizes and 1 Chromium touch-input journey. Text enlargement uses root `font-size: 200%` with unchanged CSS viewport; browser UI zoom is not claimed. Normal wheel/PageDown/Home/End, real Tab/Enter navigation, visible focus, legal/footer reachability, no horizontal overflow, no page snap/nested article scroll and no console/page errors are checked.
- 57 local source modules traversed from root/Home/About/Impressum/Privacy: no game host/runtime imports. No new client boundary. Protected/generated tracked files unchanged; the game build prerequisite does not load a game in the browser.
- Ten final screenshots captured, with mobile Start, short landscape Start, enlarged Contact/footer focus, enlarged high-contrast Privacy and wide dark About inspected by the agent. These are Chromium emulation, not Dimi's physical-device result. Browser version is recorded in `screenshots.json`; Node 22.22.0 and pnpm 10.30.3 were used.
- Final full-rectangle focus and shell-conditional document-clearance checks: PASS in the 75-test run. Local Lighthouse: PASS, three runs on each of four routes; performance 100 in all 12, LCP 643.7–684.3 ms, maximum CLS 0.009469 (budgets 2500 ms / 0.1). Final reports are filesystem-only, with no upload. Documentation links/formatting, diff checks and eight-file patch replay/hash equality PASS; exact hashes and logs are in the accompanying handoff. Task-owned preview stopped after checks; no commit, push or deployment performed.

### Self-review and reproducible candidate

Architecture checklist: scope/duplication PASS (four actual shell consumers, existing controls and Container reused); dependency direction and public game boundary PASS; abstractions/dependencies unchanged; accessibility/scroll/focus PASS in the stated emulation; performance results in handoff; protected/generated diff clean; no suppressed assertions, test skips, speculative service, fake UI, live email or unrelated demo changes. This is author self-review, not independent Codex approval.

Changed files: PortfolioShell.tsx and its CSS, PortfolioNavigation.tsx, PortfolioSection.module.css, the new responsive browser spec, the existing settings test's description, this task record and feature-plan status. No production copy or new route changed.

Exact base: `480424c81f4e5bb28a2471a2d3be89aef2acfcac`. The validated pre-closure candidate remains preserved as the eight-file task patch on `feature/funkspace-minimum-usable`; the Git commit containing this completion record is the final accepted candidate. Accessible artifact root: `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-2.5/`. `candidate.patch`, `manifest.json` and `handoff.md` preserve the exact pre-closure diff, SHA-256 hashes/replay verification, validation results, screenshots and shell constraints for Codex. `closure.md` records the final commit and push verification. Copy these artifacts explicitly to another session; synchronization is not assumed.

### Acceptance and handoff limits

Dimi's explicit completion decision below accepts FS-2.5. Detailed results for actual phone/desktop, landscape/short screens, enlarged text, mobile menu clearance and safe areas remain unrecorded; do not borrow FS-2.2's earlier manual pass or invent device/browser versions. Codex's integrated review remains separate; no independent review, final copy/legal approval, FS-G1 or release acceptance is inferred. Missing Start/About final copy and current legal/operator facts remain with the owners/deadlines in the dependency records above.

## Dimi completion and commit/push authorization — 2026-09-20

Dimi's actual instruction: “FS-2.5 is done, update the documentation then commit and push the changes.”

This explicitly closes the delivered responsive shell and ordinary-scrolling task and authorizes documentation updates, commit and push. It supersedes the pending task-acceptance status in the implementation handoff. It does not assert a new physical-device test, independent Codex review, final publication-copy/legal approval, FS-G1 acceptance or deployment authorization. The documented floating mobile-menu constraint remains visible for later integration review.

Before closure, the branch/base, all eight candidate file hashes and patch hash matched the validated manifest; no additional local changes were present. Only this record and the feature plan changed for closure. Runtime and test files retain their validated content, so the previously recorded checks remain applicable without rerunning application suites for documentation-only changes. Documentation formatting, local link targets, diff checks and candidate consistency are checked before commit; final commit, remote verification and clean-tree result are recorded in the closure artifact.
