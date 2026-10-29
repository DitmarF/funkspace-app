# Maintenance — Smart sticky header

## Task metadata

- **Status:** Implemented and reviewed; Dimi accepted the P2 correction and authorized commit/push on 2026-10-12. Targeted validation passed; broader-suite and advisory-performance follow-ups remain below. FS-4.7/4.8 are not closed by this maintenance work.
- **Parent:** [Minimum usable experience](../features/funkspace-minimum-usable.md), maintenance before FS-4.7/4.8.
- **Owner:** Codex; one current writer.
- **Date:** 2026-10-12.
- **Candidate base:** `dc61ffe7c2b98bb911cc214a8eec4f9119e56b79`, branch `feature/funkspace-minimum-usable`; clean initial worktree.

## Requested outcome and decisions

Dimi requested a subtle tablet/desktop sticky header and explicitly selected **hide while scrolling down, reveal while scrolling up**. Mobile layout stays unchanged. Dimi subsequently authorized committing and pushing the current changes on 2026-10-12; publication remains outside this task.

Acceptance: the logo, main navigation and settings launcher move together; deliberate direction changes control visibility without content reflow; keyboard focus and open navigation remain visible; existing motion choices, native fallback, intro and dialog focus/scroll contracts remain usable.

## Inspected evidence and scope

Read root AGENTS, README/package scripts, architecture/ADRs, AI workflow/task template, current feature plan, FS-3.6 closure and `/Users/dimi/Downloads/FunkSpace_EPIC_4_Detailed_Plan.md`. Inspected PortfolioShell, PortfolioNavigation, shared Dialog, motion policy, composition/provider and affected browser/component tests. Historical plan hash is not a reset target. FS-2.5's desktop launcher scrolling away was the previous accepted behavior; this request supersedes only that desktop positioning decision. Completed EPIC 3/FS-G1 stays closed.

The bounded DOM binding owns passive document scroll, resize measurement, focus/disclosure observation and teardown. Construction remains in createServices; the shell only owns binding release. Domain exposes a generic target/release port without browser types. No scheduler, React scroll state, new dependency or settings authority.

Implementation assumptions: existing 48rem breakpoint; hide after 32px downward travel beyond the opening header, reveal after 12px upward travel. Existing 400ms/ease-out tokens apply only when resolveMotionPermission permits, following Dimi's slower-transition refinement. Reduced/Off/system reduction and unavailable motion use a stationary sticky header. Short viewports where the header consumes half the height retain native scrolling. Measured header height supplies anchor/focus clearance; CSS transforms preserve document space. Mobile/no-JS remain native.

The header keeps its existing dimensions and semantic surface color, with no
bottom border or shadow, following Dimi's refinement. Focus reveals controls immediately. New focus on
page content that is obscured by the header scrolls clear using the measured
margin; dialogs and the menu launcher retain their existing scroll margins.

## Delivered files and contracts

- `frontend/domain/ports/StickyHeaderPort.ts`: generic target/release factory.
- `frontend/infrastructure/dom/StickyHeaderBinding.ts` and its test: DOM effects,
  32px/12px direction thresholds, elastic-scroll clamp, policy subscription,
  focus/disclosure pinning, resize fallback and idempotent cleanup.
- `frontend/infrastructure/services/createServices.ts` and
  `frontend/application/providers/ServiceProvider.tsx`: existing composition root
  supplies the consumer binding; no shared service activation/disposal changes.
- `frontend/components/Layouts/PortfolioShell.tsx` and its CSS: per-shell binding,
  sticky surface, synchronized launcher transform and page-only focus clearance.
- `frontend/components/Layouts/PortfolioNavigation.module.css`: enhanced fixed
  launcher coordinates replace scroll-adjusted document coordinates in the overlay.
- `frontend/components/Layouts/PortfolioShell.stories.tsx`: long-page
  **SmartStickyHeader** example with explicit motion-enabled fixture.
- `e2e/sticky-header.spec.ts` and `e2e/storybook/sticky-header.spec.ts`: real scroll,
  focus, dialog, resize, no-JS, themes and policy behavior. `FS35_AVAILABLE` must
  match the compiled flag, following the existing motion-suite convention.
- `e2e/navigation-composition.spec.ts`: existing strict alignment assertion now
  samples both controls in one layout instead of separate browser round trips.
- Layout README, architecture and feature plan: current behavior and scoped
  supersession of historical desktop positioning.

No token/generated output, dependency, engine, route, scene contract, local Pause,
footer content, contact concept or repository settings changed.

## Validation and handoff

### Validated candidate identity (before border removal)

- Base HEAD above plus source/test patch SHA-256:
  `602e67740acaa628d78cde0916875bd16c15cc166e857da415d51a80dec12922`.
  Patch includes modified/new `frontend/` and `e2e/` files (including the Layout
  README), excludes `docs/` to avoid a self-referential hash.
- Final production flag **true** build: `Ni0i-sGBGXzv-RMwml0iT`.
- Final production flag **false** build: `EsP2J8AkkJECwfa5hTtjU`.
- Builds used separate temporary copies; the user's localhost:3000 preview was
  preserved and returned HTTP 200. No commit, push or deployment occurred.

### Completed checks

- `pnpm test`: **122 files / 1,884 tests passed** on final source, including 11
  adapter cases and existing shell/provider/scene regressions.
- `pnpm -F frontend exec tsc --noEmit`, `pnpm typecheck:validation`, `pnpm lint`:
  **PASS**. Theme-bootstrap freshness and repository formatting included.
- `NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm build` and the corresponding **false**
  build in separate copies: **PASS**, including generated-token/common type steps.
- `pnpm storybook:build`: **PASS**. Existing third-party bundle/directive warnings
  remain warnings; no generated source was retained in the working tree.
- Earlier Storybook check: **5/5 passed** after fixing newly focused content being
  obscured by a stationary header. Light/dark screenshots were visually inspected;
  all four themes have automated scroll/menu checks.
- Final flag-on production: **26/26 passed**, running `e2e/sticky-header.spec.ts`
  and `e2e/navigation-composition.spec.ts`, one worker, `FS35_AVAILABLE=true`,
  isolated port 3107. Includes Axe on tablet/desktop, immediate focus reveal,
  unchanged content position, open/close scroll retention and breakpoint resize.
- Final actual flag-off production: **8/8 passed** from the sticky-header suite,
  `FS35_AVAILABLE=false`, isolated port 3110. Explicit On still remains static
  when the build-time capability is disabled.
- Final Storybook: **5/5 passed** on port 6107, including all four themes and
  stationary-header keyboard clearance. Chromium automation only.

### Failed checks and investigations

The first no-JS test used an ambiguous selector matching nested tree summaries;
it was corrected to the actual menu disclosure. Assertions were not relaxed.

The first broader responsive run had three focus-clearance assertion failures at
200% text (320×568, 844×390 and 1280×720). A targeted stationary-header Storybook
test independently exposed obscured focus; the adapter now clears that focus and
the test passes. After that correction, the combined production run on build
`sxWDBodBrswatH4eybZ6p` passed **46/47**: all 18 navigation and 8 sticky-header checks
passed, with only the 1280×720/200% homepage Pause focus assertion failing.

A temporary diagnostic copy retained every original responsive assertion and
reported extra geometry on failure. On unchanged base HEAD, build
`ipPmZ_N-VnN7GC2a48d9Q`, the 320×568/200% case timed out waiting for `:focus`; the
844×390 and 1280×720 comparisons passed. The current 1280×720 case then passed
**three isolated diagnostic repetitions**. This establishes intermittent focus
validation, not proof of a resolved root cause or an all-green broad suite.
Keep the Pause-control focus instability as an explicit follow-up; existing
responsive tests and scene code were not altered.

The final CSS refinement excludes dialog/launcher descendants from page focus
clearance. Its first targeted run passed 25/26, with the resize alignment helper
reporting a 20px difference across two separate measurements. Both controls use
the same CSS coordinate; sampling them atomically avoids comparing layouts from
opposite sides of the responsive update. The existing <0.5px assertion remains
unchanged, and the final 26/26 run passes. This test change does not address or
hide the separate intermittent Pause-control focus assertion described above.

### Performance and final review

Both actual flag builds ran `pnpm exec lhci autorun` with temporary copies of the
repository's corresponding configuration. Only the isolated URL/server port,
installed Chromium path and local output directory changed; thresholds and
desktop/devtools throttling remained unchanged. Three runs per build, local macOS
host, HeadlessChrome 140, viewport 1350×940, DPR 1, default preference/storage.

| Build      | LCP, three runs (ms)           | CLS       | TBT       | Performance scores |
| ---------- | ------------------------------ | --------- | --------- | ------------------ |
| Motion on  | 3343.870 / 3114.069 / 3127.572 | 0 / 0 / 0 | 0 / 0 / 0 | 79 / 81 / 81       |
| Motion off | 458.656 / 460.086 / 462.698    | 0 / 0 / 0 | 0 / 0 / 0 | 100 / 100 / 100    |

Required LCP ≤5000ms and CLS ≤0.1 assertions **PASS** for both. The motion-on
performance score emits the existing advisory `<90` warning. No unchanged-HEAD
Lighthouse comparison was performed, so this is not attributed to the header.
These startup measurements do not establish the full FS-4.7 scene performance gate.

Final content/relative-link inspection, Prettier and `git diff --check`: **PASS**.
Diff review found only the 16 intended files, with no generated/token/dependency
changes. HEAD remains the base commit; all work is uncommitted. Owned test servers
are stopped; the user's original preview is retained.

Source patch, validation logs, theme screenshots and Lighthouse reports are saved
locally in
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/sticky-header-2026-10-12/`.

### Remaining handoff

- Dimi: review the scrolling feel and visual treatment; acceptance is not inferred.
- Follow-up review: investigate the intermittent 200% text Pause focus assertion;
  do not report the broader responsive suite as uniformly green.
- Retain the motion-on advisory performance warning for the upcoming EPIC 4 review.
- Safari/Firefox and physical devices were not tested. FS-4.7/4.8, commits, pushes
  and publication remain separately authorized work.

### Border removal refinement — 2026-10-12

Dimi requested removal of the sticky header's bottom line. Removed its 1px shadow
and the now-unused `data-header-scrolled` attribute writes/cleanup. Scroll direction,
transitions, focus, motion policy and mobile behavior retain their existing contracts.
The build IDs, patch hash and broad validation above identify the preceding candidate;
this small refinement receives focused validation below.

- Focused adapter/shell tests: **16/16 passed**.
- Frontend TypeScript and `pnpm lint`: **PASS**.
- Live Chromium preview at 1280×900, after scrolling down and back up: **PASS**;
  computed header shadow `none`, bottom border `0px`, position `sticky`.
- Documentation and diff formatting: **PASS**. Production/Storybook builds and
  Lighthouse were not repeated for this border-only refinement.

### Slower transition refinement — 2026-10-12

Dimi requested appearance/disappearance to be 100% slower. Doubled the shared
header/launcher transform duration from 200ms to the existing 400ms token.
Both directions retain ease-out timing; keyboard reveal remains immediate and
reduced-motion/static behavior is unchanged. Updated the browser expectation and
Layout README. Earlier build IDs and broad validation describe the preceding
candidate, not this timing refinement.

- Frontend and validation TypeScript, `pnpm lint`, and diff checks: **PASS**.
- Sticky-header browser suite on the existing localhost:3000 development preview:
  **8/8 passed**, including 400ms motion permission, both directions, menu alignment,
  immediate keyboard reveal, mobile/short viewports and no-JS fallback.
- Production/Storybook builds and Lighthouse were not repeated for this timing-only change.

### Motion toggle recovery fix — 2026-10-12

Dimi reported that the header remained stationary after changing Off → On.
Reproduced through the actual settings overlay at 768×900 and 1280×900:
`data-header-motion` correctly became `true`, but restored launcher focus kept
`data-header-focused=true` and prevented directional hiding. Both new browser
regressions failed before the fix; no test blur or synthetic preference update
was used to bypass the interaction.

The binding now releases only its focus pin when the user scrolls with a wheel
or touch. Actual focus stays on the launcher. New focus or keyboard input reveals
and pins the header immediately again. Open dialogs/disclosures and the homepage
intro remain pinned; Off/Reduced/denied motion remain stationary. Ctrl-wheel zoom
and horizontal-only wheel input do not release the pin. All new listeners are
removed on release. No shared service, preference, Dialog or mobile layout changes.

This refinement changes the adapter, its unit tests, sticky-header browser tests,
Layout README and this record. Base HEAD remains
`dc61ffe7c2b98bb911cc214a8eec4f9119e56b79`; earlier candidate hashes/builds do not
identify this refinement. Current frontend/e2e source diff (including untracked
files and Layout README, excluding docs) is saved beside earlier artifacts as
`source-motion-recovery.patch`, SHA-256
`dafbf17a4191ecb61c7ebe20760eebfa7a7881cb4ac7d888ab43e1877962aea6`.

- Adapter/shell unit tests: **18/18 passed**, including wheel/touch recovery,
  preserved focus, keyboard re-pinning and listener cleanup.
- Chromium sticky-header suite against the existing localhost:3000 development
  preview with motion available: **10/10 passed**. Both Off → On regressions
  now pass without blurring the trigger; keyboard input immediately reveals it.
- Frontend and validation TypeScript, `pnpm lint`, content/link inspection and
  `git diff --check`: **PASS**.
- Production/Storybook builds, Lighthouse, other browsers and physical touch
  devices were not rerun for this bounded event-handling fix. Touch recovery is
  unit-tested. Earlier broad-suite limits and Dimi acceptance remain separate.
- No commit, push or publication. Existing local preview retained.

### P2 initial fragment clearance — 2026-10-12

Review reproduced direct `/#start` visits with the heading at y≈40–69px beneath
the 138px sticky header at 768px and 1280px widths. Native fragment scrolling ran
before hydration installed the measured header margin. Four new browser cases
(tablet/desktop, On/Off) failed before the correction.

After its first measurement, the binding now decodes the current fragment and
corrects only a page target whose top is visibly covered by the header. It uses
the existing measured scroll margin with instant scrolling, preserving focus and
the URL. It does not repeat on resize or ordinary scroll, and skips native
Back/Forward restoration, mobile/native layouts, absent/malformed fragments and
targets already clear or above the viewport. No new scheduler, navigation owner
or shared-service lifecycle is introduced.

Changed for this correction: sticky-header adapter/unit tests, sticky-header and
navigation-lifecycle browser tests, Layout README and this record. Existing
source changes remain intact.

- Focused adapter/shell tests: **25/25 passed**. Includes encoded fragments,
  one-time correction without focus changes, and excluded history/mobile/missing/
  malformed/already-clear targets.
- Development preview: **14/14 sticky-header browser tests passed**, including
  direct Start visits and reloads at both widths with On and Off.
- Frontend and validation TypeScript, lint, formatting and diff checks: **PASS**.
- Isolated `NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm -F frontend build`: **PASS**,
  build ID `IWUNPw5qeDjvgPLg9mK9D`. User development preview preserved.
- Final production sticky-header plus N5 fragment/history selection: **20/20
  passed**. The first run was 19/20: an older desktop test attempted to click the
  intentionally hidden fixed launcher. Its setup now focuses the menu to reveal
  it and asserts it is in view before opening; all history-position assertions
  remain unchanged. No application change was needed for that test setup.
- Source/test candidate patch: `source-anchor-clearance.patch` beside earlier
  artifacts, SHA-256
  `9735606fb3da1cce5252084f28620b831003065b5b4362a6cd170075b4cfb73a`.
  Same base HEAD as above; patch includes frontend/e2e and Layout README,
  excluding docs. Build source matches final application code.
- Full unit suite, Storybook, flag-off production build and Lighthouse were not
  repeated for this correction. Previous broader-suite limits still apply;
  Chromium evidence does not establish physical-device or cross-browser coverage.
- P2 has passing technical regression evidence. Dimi acceptance remains separate;
  no commit, push or publication was performed.

### Acceptance and commit handoff — 2026-10-12

Dimi confirmed **“P2 is fixed”** and requested documentation updates followed by
commit and push of the current changes. This accepts the initial-fragment
correction and authorizes the repository write; it supersedes the earlier
no-commit/no-push checkpoint statements above. It does not close FS-4.7/4.8 or
authorize deployment.

The accepted source/test candidate remains
`9735606fb3da1cce5252084f28620b831003065b5b4362a6cd170075b4cfb73a`
against base `dc61ffe7c2b98bb911cc214a8eec4f9119e56b79`. All 17 changed files
belong to the sticky-header implementation, its refinements, regression tests
and documentation. No generated output, dependency or unrelated work is included.

Technical evidence remains the final P2 checks recorded above. The preceding
review also passed the full suite (122 files / 1,886 tests), 28 navigation/header
browser checks, types and lint before the P2 correction; those results are not
misrepresented as a full-suite rerun of the final candidate. Documentation-only
acceptance updates receive formatting, content/link and diff checks before commit.

Retained follow-ups: investigate the intermittent 200% text Pause-focus assertion,
carry the motion-on Lighthouse score warning into EPIC 4 review, and perform the
outstanding cross-browser/physical-device checks. These limits remain distinct
from the accepted P2 fix and successful targeted validation.
