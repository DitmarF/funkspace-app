# FS-2.2 — Static Start and mobile wireframe revision

## Task metadata

- **Status:** Complete — Codex technical review PASS; Dimi reports manual/visual PASS and explicitly closes FS-2.2, authorizing documentation finalization, commit and push on 2026-09-20.
- **Epic / owner:** EPIC 2; Sites implementation workflow, local repository work.
- **Updated:** 2026-09-20.
- **Authority:** Dimi's current request and supplied mobile wireframe; [minimum usable plan](../features/funkspace-minimum-usable.md), supplied EPIC 2 detailed plan, [accepted FS-2.1](./fs-2.1-page-structure-and-navigation.md), recorded FS-1.7 acceptance and FS-0.5 decisions.
- **Checkout:** `/Users/dimi/Projects/funkspace-app`; branch `feature/funkspace-minimum-usable`; implementation/review base `8a86de29e302ad44a7d611db36bf7b676aeb78d6` (historical provenance, not a reset target).
- **Protected entry state:** The 16-file first FS-2.2 candidate matched every recorded SHA-256 before revision. No unrelated local changes were found or overwritten. The separate ChatGPT mirror game checkout and synced sources remain untouched.

## Requested outcome and scope decisions

The original task requires one meaningful HTML H1 and introduction, complete trusted static artwork before hydration/without JavaScript, a responsive reserved scene, unique SVG IDs and preserved animated consumers. The homepage remains deliberately static with the animation flag on.

Dimi then supplied `Screenshot 2026-09-20 at 13.01.03.png` and explicitly established its positions as the layout direction: compact logo at top left, portrait scene below a small title, corner marks and a blue navigation/settings trigger at bottom right. The screenshot is design evidence; its counters, arrows and Customize control do not independently authorize those features.

Dimi answered **“Build the navigation/theme overlay now”** when offered either a working overlay or temporary controls below Start. This explicitly brings forward the bounded navigation/appearance portion of FS-3.1–FS-3.3 using existing Dialog and HexButton. It supersedes the earlier instruction to reserve the trigger until EPIC 3 for this subset. Animation-mode selection remains deferred until the shared policy exists. No inactive motion selector or fake Customize action is added.

Dimi's earlier **“Use README wording as draft”** applies to: “FunkSpace is a design-system-first web experience built as a PNPM workspace.” The completion decision below accepts the bounded delivered task while preserving the wording's draft provenance; it does not invent final publication-copy approval. The wireframe supplied design direction; later manual/visual PASS and explicit closure provide actual acceptance evidence.

### Acceptance register

- [x] Complete static SVG and HTML copy render before effects and without JavaScript.
- [x] Instance-scoped IDs remain stable through hydration; all real animation targets resolve locally; original geometry is unchanged.
- [x] Wireframe hierarchy: compact header identity, small H1, portrait scene, corner marks and working navigation/theme trigger (mobile bottom-right; tablet/desktop top-right).
- [x] Existing controls/providers are reused; no-JavaScript navigation remains ordinary visible footer links.
- [x] Responsive scene sizing and natural scrolling; narrow, wide, short/landscape and enlarged-text checks.
- [x] Final revision validation recorded below, including the unresolved intermittent shared-dialog check.
- [x] Requested fresh read-only Codex review of the exact candidate: PASS, no actionable findings.
- [x] Dimi reports manual/visual PASS and explicitly declares the current bounded FS-2.2 delivery done. Specific devices and separate final publication-copy/artwork approvals are not invented.

The implementation/revision sections below retain their chronological evidence, including then-pending approvals and superseded candidates. The final review/completion section is authoritative for current status.

## Inspection and reuse

Read current AGENTS (no nested guide), AI workflow, task template, architecture/checklist, feature/task/decision records, package scripts and affected code/tests. Inspected root layout/providers/bootstrap, Home/Privacy/PortfolioShell, Container, Hero/HeroMotion, LogoMotion/inline SVG/source asset, orchestration/timeline/manifest, accepted HexButton/Dialog APIs, useDialog/native binding, ThemeSwitcher/ThemeService and related browser/unit tests.

Legacy Hero remains a demo because it includes snapping, a sticky header and effect-dependent reveal. Logo geometry remains in its existing component. No new asset, navigation service, theme authority, dependency, route, Canvas renderer or motion-policy system was added.

The Sites local build skill was no longer present in the installed filesystem/catalog on this revision. Available Sites connector tools concern hosting; this authorized local-only repository task continued through terminal/patch tools and repository workflow. No hosting operation was called.

## Current implementation and contracts

### Shell and navigation

PortfolioShell remains opt-in for Home and Privacy; the universal root is unchanged. It has one portfolio header, one main and one footer. The header identity anchor uses the existing complete static logo at 144 CSS px wide (bounded by available width); the accessible link name remains FunkSpace and nested SVG branding is decorative.

PortfolioNavigation is a small client composition inside the portfolio footer. Its initial server render exposes ordinary Start and About anchors from the existing destination source. After hydration it shows the fixed bottom-right existing medium HexButton, accessible name “Menu: navigation and settings”. Dimi subsequently requested removing the visible Menu caption; the button remains named for assistive technology. The footer keeps a real Privacy link and enough bottom space to scroll it above the trigger. The dock accounts for bottom/right safe-area insets.

The button opens the existing Dialog with native navigation links, an Appearance fieldset containing the existing ThemeSwitcher, and the implemented Privacy destination. Only local readiness/open state is introduced. No open-state or theme service is duplicated.

Ordinary Close/Escape returns focus to the trigger through the existing binding. Section-link clicks synchronously close/unmount the dialog and release its scroll lock before the browser executes the native href action; no preventDefault or custom router is used. Homepage sections have tabIndex=-1 so native fragment navigation can focus the destination. Full future history/customization lifecycle is still assigned to FS-3.2.

The seven approved labels/hrefs are unchanged. Contact, About page and Impressum remain unexposed until honest content exists. The future motion controls are absent rather than disabled.

### Start and scene ownership

Start remains server-rendered. It owns the small H1, four noninteractive aria-hidden corner marks, portrait frame and HTML introduction below the frame. The mobile frame ratio is 343/503, taken from the supplied wireframe; at 48rem and above it becomes 3/2 as a reversible desktop adaptation pending visual acceptance. Token padding/surface/border/fonts are reused. No fixed viewport height, nested page scroller or content clipping is introduced.

The header logo now occupies the requested identity position. The scene uses a second complete instance of the existing logo as the bounded static preview until a different trusted visual is approved. Its original 1652.1/849.75 geometry is centered and uncropped inside the portrait frame. Both instances receive enabled=false and autoPlay=false; no animation is started merely to pause it. Their essential identity/copy remains available as HTML/anchor names, avoiding duplicate decorative announcements.

### Shared-logo and foundation corrections

The first FS-2.2 candidate's logo correction is retained: React useId scopes every SVG ID; stable data-logo-part values identify ten paths and nine dots; the existing orchestrator emits actual scoped #IDs into all 28 manifest steps. No SVG fragment/paint-server references exist in this asset. Repeated independent React roots would require coordinated identifierPrefix values; current Next uses one document root. Public logo props/ref controls and geometry are unchanged. Static fallback restores all dots after initialized animation or empty/failed manifest construction.

Overlay integration exposed Dialog's internal header as an extra banner when nested in the footer. Its title bar is now a div with the same CSS, H2, focus behavior and Close control. No Dialog API change. Unit and unfiltered browser checks protect this correction; two old body-scroll test selectors were updated to distinguish content from the title bar.

The existing reduced-motion hook now catches missing/throwing matchMedia access and returns the reduced/static fallback instead of crashing the page. Three new tests first reproduced missing/call/getter failures. Existing theme-bootstrap failure tests exercise the integration. This is browser-error handling, not the later shared motion-policy service.

Pre-existing LogoMotion-to-Infrastructure imports and DOM-shaped orchestration remain migration debt; no new dependency direction is introduced. The existing client logo still bundles its dormant adapter code. No zero-client-payload claim is made.

## Protected scope

Root layout, providers, ThemeService, generated bootstrap, accepted fonts/tokens/control geometry, SVG source asset and games/public game boundary remain unchanged. No secondary page completion, public-contact facts, legal facts, static export, live form/email, customization, counters, slide dots, previous/next/up/down controls or live animation. The SVG's nine geometry dots remain artwork.

No commit/push/PR/merge/deployment/provider/DNS authorization is inferred from prior FS-2.1 approval. No such action is performed.

## Validation record

The original candidate's logs and exact patch remain under `artifacts/fs-2.2/` in the ChatGPT project workspace. Those results are historical and are not substituted for revision checks.

Current revision:

- Bootstrap freshness → tokens → common typecheck → game build → frontend typecheck passed in documented order. The game build is a workspace prerequisite, not browser runtime loading.
- Focused Start/shell/logo/Dialog unit tests passed: 85.
- Full unit suite passed: 1,366 tests in 94 files, including the three new browser-media failure cases.
- Repository lint and Storybook build passed.
- Development E2E passed: 32, including native/no-JavaScript navigation, theme persistence, all themes, initial static visibility/IDs, 320×480 and 1440×900 scenes, plus overlay lifecycle at 320×480, 425×930 and 844×390 and 200% text.
- Initial browser run exposed the extra Dialog banner. Corrected product markup; retained unfiltered axe assertions. The new focus loop initially assumed Chromium never traverses browser chrome; aligned it with the already accepted native Dialog contract and still requires focus to return inside, never to an outside page control.
- The first shared-dialog browser run had two strict-selector failures after the title-bar div change. Corrected content targeting without weakening scroll/touch assertions. Subsequent full runs each passed 15/16: one timed out during Storybook theme-URL normalization; the last failed the existing wheel-scroll assertion at `e2e/storybook/dialog.spec.ts:240` (scrollTop stayed zero). A traced isolated rerun of that exact scrolling test passed. The intermittent full-suite result remains unresolved; no assertion, threshold or retry policy was weakened, and a clean 16/16 run is not claimed. The retained trace/logs support follow-up; this is a validation limitation, not a proven product defect or proven pre-existing failure.
- In-app mobile preview at the wireframe size was inspected, including opening/closing the overlay and changing theme. Temporary viewport override was reset afterward.
- Final flag-on production build passed. All 32 production E2E checks passed, including the existing animated sandbox/reduced-motion consumers and native fragment focus after dialog closure.
- Dedicated production theme-bootstrap suite passed: 17/17, including early application, negative control, blocked/missing browser APIs, runtime authority and no JavaScript.
- Final frontend typecheck and repository lint passed after the native fragment-focus correction. Full unit results precede only that focusability/accessible-label refinement; final production checks cover those refinements.
- Lighthouse flag-off and flag-on builds/runs passed (three runs each). The exact final flag-on build received another three-run budget check after the focusability refinement; see retained results.
- Production screenshots were inspected at 320×480 and the supplied 425×930 wireframe size, including the open dark overlay. No Safari/Firefox or real-device result is claimed.

## Review and remaining acceptance

Author self-review checks the complete diff for scope, API/identifier contracts, dependency direction, accessible landmarks, keyboard/modal lifecycle, no-JavaScript fallback, generated/unrelated changes and cleanup. It does not replace independent Codex review.

Self-review found no new service, dependency, route group, game import, generated-file edit, disabled assertion or unrelated change. The shared Dialog scrolling test remains an explicit follow-up for technical review. No clean full shared-Dialog suite or final technical acceptance is claimed.

**Early Codex review request:** review the exact revised base/patch; do not substitute the superseded first candidate. Cover static SSR, both real logo instances/IDs, animation isolation, portrait frame, shell placement, the authorized overlay, native href/focus/scroll-lock behavior, shared Dialog semantics and unavailable-media fallback. Return prioritized findings to Sites with file/line evidence, impact, smallest correction and retests.

**Dimi acceptance needed:** inspect the nominated phone and larger display, then approve/revise compact header logo position/size, scene ratio and static visual, H1/intro typography and exact draft wording, corner marks, bottom-right trigger and overlay hierarchy. A screenshot supplied as direction is not recorded as acceptance of the built result.

FS-2.2, full FS-3.1–FS-3.3 acceptance, FS-G1, secondary-page/contact/legal completion and public release remain open. Real-device/Safari/Firefox acceptance is not inferred.

## Exact candidate and accessible handoff

Base remains `8a86de29e302ad44a7d611db36bf7b676aeb78d6`. The earlier candidate patch SHA-256 was `73fa3282465d0521428155f54d4f6f58a370db047f7741cdef6c24a9aa11c552`; it is preserved unchanged for comparison.

The revised full patch, file hashes, logs, screenshots and handoff are recorded at:

`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-2.2-wireframe/`

Use handoff.md, candidate.patch and manifest.json together. Apply to the exact base in an isolated checkout; never reset another checkout to a historical attachment. Agent sessions do not synchronize automatically.

## Corner artwork and icon-only trigger correction — 2026-09-20

Dimi supplied readable screenshots at 14:48 showing asymmetric cross-shaped corner marks: short outer arms and longer inner arms, rotated by 90 degrees around the section. The initial attachment paths were unavailable; the subsequent inline images were inspected and superseded the temporary L-bracket interpretation before handoff.

Start now uses four instances of one inline SVG path, rotated 0/90/180/270 degrees, with the existing token size and semantic foreground color. All are decorative, non-focusable and pointer-transparent. Existing section positions and spacing remain unchanged. Future sections can follow this treatment when implemented; no unfinished About/Contact scope is marked complete.

The visible Menu caption and its unused CSS are removed. Existing HexButton geometry, accessible name, focus and overlay behavior remain intact. Logo tests now explicitly target the logo SVG rather than every SVG in Start; the original geometry/visibility/ID assertions remain unchanged. This is a visual correction, with no new public API, dependency or navigation contract.

The Sites skill is available again for this follow-up. Its profile check returned portable/configured=false, preserving existing repository scripts; no registration or publishing was performed. The prior 32-file candidate was hash-checked: only the six intended source/test paths changed before this evidence update, preserving all other work. Branch/base are unchanged.

Revision evidence and the new exact full patch are stored separately at `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-2.2-corners/`. The wireframe candidate above remains historical. Final revision validation is recorded in that handoff; previous broad-suite results are not relabeled as newly run. The prior intermittent shared Dialog scroll check, early Codex review and Dimi's final rendered/copy acceptance remain open.

Fresh correction checks passed: bootstrap freshness, frontend typecheck, focused Start/shell units (5 tests), repository lint, flag-on production build, Storybook build and the production E2E suite (32 tests, including JavaScript on/off, supported themes, native links, keyboard and overlay behavior). The production 425×930 screenshot was inspected against both supplied corner references: inward asymmetric arms and no visible Menu caption. The exact patch/manifest and final Lighthouse result are in the correction handoff. No full unit or shared Dialog suite rerun is claimed for these presentation-only changes.

## Visible navigation-edge alignment — 2026-09-20

Dimi's 17:14 screenshot requests the visible hexagon's right border on the same vertical line as the section's right corner mark. The launcher now follows Container's centered 80rem-wide shell and responsive 16/24px token gutters, subtracting the medium SVG's existing right inset plus the native 2px button border. The accepted button geometry, hit target, focus ring and bottom position are unchanged. Safe-area clearance takes priority where an inset is present.

The positioning formula is local to this portfolio launcher and explicitly documents its dependency on the existing medium HexButton and wide Container geometry. No shared control API or navigation contract changes. Existing browser checks now measure the painted SVG edge against Start's right boundary at 320, 425, 844 and 1440px, including 200% text, while retaining keyboard/theme/native-link assertions.

Only PortfolioShell CSS, the portfolio settings browser test and this task record change relative to the preceding corner-correction candidate. The exact base remains `8a86de29e302ad44a7d611db36bf7b676aeb78d6` on `feature/funkspace-minimum-usable`. Latest patch, hashes, screenshots and actual check results are at `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-2.2-alignment/`. Earlier artifacts remain historical. Broader FS-2.2 review/acceptance and the previously recorded intermittent shared Dialog check remain open; no commit, push or deployment is authorized by this correction.

Fresh checks passed: bootstrap freshness, frontend typecheck, repository lint, production/Storybook builds, final scoped formatting and diff checks, and all 34 production browser tests. Alignment assertions use the SVG path bounds, transformed stroke edge and actual section rectangle, with less than 0.5px tolerance at all four widths and 200% text. The 425×930 production screenshot was visually inspected. Final Lighthouse results are retained in the handoff. This CSS-only product change does not claim a new full unit-suite or shared Dialog-suite run.

## Tablet and desktop navigation position — 2026-09-20

Dimi clarified the requested placement: **“Button top right; logo stays top left.”** At the existing 48rem/768px breakpoint, the fixed launcher now uses the header's top gutter and clears its bottom offset. Mobile remains fixed bottom-right. The accepted right-edge artwork alignment, safe-area clearance, logo placement, button geometry, keyboard behavior and overlay composition are preserved.

The existing browser matrix now includes 768×1024 alongside narrow, landscape and desktop sizes, verifies that the button sits beside the logo at the top on larger screens, and keeps the mobile bottom-position, visible-edge alignment, enlarged-text and lifecycle checks. No public API, route, provider or shared control change.

Only PortfolioShell CSS, portfolio-settings.spec.ts and this record change from the preceding alignment candidate; all other prior file hashes were checked and preserved. Branch/base remain unchanged. The newest exact patch and validation evidence are at `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-2.2-topnav/`; preceding artifacts are historical. Final rendered-layout acceptance, early Codex review and the earlier shared Dialog test limitation remain open. No commit, push or deployment is performed.

Fresh validation passed: bootstrap freshness, frontend typecheck, repository lint, production and Storybook builds, formatting/diff checks, and all 36 production browser checks. Tablet and desktop screenshots were visually inspected; the expanded browser matrix confirms top alignment beside the logo, existing right-edge alignment and usable settings at 200% text, with mobile bottom positioning preserved. Final Lighthouse evidence is retained with the handoff. No fresh full unit or shared Dialog suite is claimed for this CSS-only product revision.

## Codex review and Dimi completion — 2026-09-20

Dimi's actual decisions:

> The manual and visual tests are PASS. Lets do Codex — logo and static-rendering review.

After that review:

> FS-2.2 is done, update the documentation then commit and push the changes.

**FS-2.2 is complete by this explicit decision.** It accepts the delivered bounded Start/layout/static-preview work and authorizes committing/pushing the reviewed implementation plus these completion records on `feature/funkspace-minimum-usable`. README copy retains its draft provenance for later content finalization; no separate final publication-copy/artwork statement, named device/browser result, FS-G1 approval, full EPIC 3 completion, secondary-page/legal completion or public release is inferred. No PR, merge, deployment, provider/DNS change or live email is authorized.

**Technical verdict: PASS for bounded FS-2.2. No actionable P0–P3 findings or required code corrections.** This was a separately requested fresh read-only review pass in the same conversation, not another agent's or human's sign-off. Reviewed base: `8a86de29e302ad44a7d611db36bf7b676aeb78d6`; exact 32-file patch SHA-256: `930f14b102b76afd5dd1de1afebec10c349ca136a8336a223e2f077cea38e29e`. Initial response HTML and fresh no-JavaScript sessions contained the complete logos and essential HTML text. Both homepage instances stayed static with the global flag off and on. Scoped IDs survived hydration; all 28 real manifest steps resolved within their instance, and the supplied repeated-instance browser fixture animated one logo without changing its static sibling. No duplicated geometry, manifest builder, motion policy or game-runtime reachability was found. Universal root/providers/bootstrap and public logo/control contracts were preserved.

Fresh reviewer results: prerequisite freshness/common typecheck/game build/frontend typecheck and lint PASS; 101 focused tests in nine files PASS; two production builds (flag off/on) PASS; 36 production browser checks per build (72 total) PASS; four extra fresh 320×360 JavaScript on/off probes PASS; supplied repeated-instance Storybook fixture PASS; shared Dialog suite 16/16 PASS without retries. The prior intermittent Dialog failure did not reproduce; its cause is not claimed resolved. A 49-source-file import traversal found zero game references. All 483 tracked/candidate file hashes and Git status were unchanged after review.

Reviewer evidence remains at `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-2.2-codex-review/`, including review.md, verification.json, logs, initial HTML, fixture observations and screenshots. Prior author full-suite, Storybook-build and Lighthouse evidence remains separately attributed.

Before closure edits, all 483 reviewed file hashes, base and Git status matched the reviewed state. Only this task record and the authoritative feature-plan status were updated after review; runtime code and test assertions were unchanged. The reviewed patch remains immutable historical evidence; the containing Git commit is the durable accepted implementation and completion record. Commit/push result and final closure verification are recorded in the handoff artifact and user-facing completion message.
