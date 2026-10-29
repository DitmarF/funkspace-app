# Centered footer navigation — 2026-10-12

## Request and scope

**Status:** Implementation and scoped technical validation complete; Dimi visual
acceptance pending. No EPIC completion is asserted.

Dimi requested a footer with navigation-styled Legal notice and an icon-only
GitHub project link. Dimi then explicitly confirmed Privacy policy as the third
link. Deliver these three centered controls with sufficient separation across
mobile, tablet and desktop, and update Storybook and documentation.

Base: `feature/funkspace-minimum-usable` at
`038b76369bdcbf2fd728ac9a8a139176e0a94f18`, clean before implementation.
Inspected root AGENTS, workflow/template, README/package scripts, architecture
and token ADR, current feature/FS-3.6 handoff, the supplied Downloads EPIC 4 plan,
shell/footer/legal links, shared row/icon system and affected browser/unit tests.
Historical FS-2.4 Contact/footer wording is superseded only for footer
presentation by this request; legal content and acceptance remain unchanged.

## Implementation and contracts

- Add `PortfolioFooterNavigation` and its CSS/stories; retain the existing
  `PortfolioLegalLinks` owner for the two native legal anchors.
- Reuse `NavigationRowContent`, compact row styles and registered legal/GitHub
  icons. No parallel button system, provider, service or dependency.
- Legal labels are Legal notice and Privacy policy; hrefs remain `/impressum`
  and `/privacy`. No change to the Privacy page heading or shared destination
  identity. Footer anchors retain native same-page and no-JavaScript behavior.
- GitHub uses `https://github.com/DitmarF/funkspace-app`, icon only with the
  accessible name “FunkSpace project on GitHub”, a 48px minimum hit target and
  normal same-tab navigation. No embed, third-party fetch or new window.
- Center and wrap the group using semantic spacing (32px horizontal mobile gap,
  48px tablet/desktop). Retain shell intro markers, native fallback navigation,
  safe-area spacing and clearance above the mobile settings control.
- Replace the former shell-only list styles; keep Contact deferred to EPIC 5.

## Validation plan

Run affected shell tests, frontend/validation types and lint. Build production
and Storybook in the existing isolated checkout to preserve the user's preview.
Exercise native legal links with JavaScript on/off, responsive scrolling/focus,
and the new Storybook footer matrix (320/768/1280px, four themes, 200% text,
centering, spacing, keyboard, hit targets and Axe). Verify GitHub's destination
without navigating away to the external site. Review the final diff and record
actual results and limits here. No commit, push or deployment is authorized by
this implementation request.

## Validation results and handoff

- Frontend types (`pnpm -F frontend exec tsc --noEmit`), validation types
  (`pnpm typecheck:validation`), repository lint (`pnpm lint`) and final
  formatting/diff/link checks: PASS.
- Focused shell tests: **5 PASS**. Full `pnpm test`: **121 files / 1,873 PASS**.
  Server-rendered assertions cover exactly three footer links, legal hrefs,
  GitHub's accessible name/destination and decorative icon semantics.
- Isolated `NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm build` and
  `pnpm storybook:build`: PASS, build ID `FnoDt8TiJylK3SpTlQLBn` in
  `/private/tmp/funkspace-active-nav-checkout`. All seven changed frontend
  implementation/story/test files match that build's sources.
- Production Chromium: **50 PASS**, zero retries, using
  `/private/tmp/funkspace-active-nav.playwright.config.ts` on port 3107.
  Suites: portfolio-navigation, contact-legal, portfolio-responsive and
  portfolio-settings. Covers native links with/without JavaScript, refresh/Back,
  settings behavior, all themes, 100%/200% text, long labels, keyboard scrolling
  and mobile trigger clearance across six viewport sizes.
- Built Storybook Chromium: **12 PASS**, zero retries, using
  `/private/tmp/funkspace-active-nav-storybook.playwright.config.ts` on port 6107. Footer matrix covers 320/768/1280px in four themes: three destinations,
  icon-only GitHub, registered Work Sans, borderless legal links, 48px minimum
  targets, centered rows and spacing, keyboard order/focus, click actionability,
  footer-scoped unfiltered Axe and 200% text reflow. Desktop light and mobile
  dark screenshots were visually inspected.

The first Storybook run failed all twelve cases because the new font assertion
expected a human-readable family name instead of Storybook's generated name.
A second assertion exposed CSS quote serialization and that redundant run was
interrupted. The comparison now normalizes quotes and checks the resolved
registered Work Sans family. An orphaned temporary server briefly blocked the
next launch; it was stopped before the final successful twelve-case run.
No application change or weakened accessibility assertion was needed.

Candidate patch SHA-256 (tracked/new files, excluding this record):
`5e007ca87e651ea9571178cb055da4872b1451d32b740fc965f3f54bf7a4f53c`.
Exact patch, file hashes, build/unit/browser logs and screenshots are stored at
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/footer-2026-10-12`.

No new Lighthouse, flag-off production build, full browser suite, Safari/Firefox
or physical-device checks were run. GitHub was checked as a native destination,
without following the external link. Existing Next lint deprecation and
Storybook chunk-size warnings remain. Temporary test servers stopped; the
development preview is preserved. No generated output, dependency, motion
service or composition-root changes. Changes remain uncommitted and unpushed.
The remaining handoff is Dimi's visual acceptance; legal publication blockers
remain outside this footer presentation task.

## Follow-up — tighter mobile padding and larger GitHub — 2026-10-12

Dimi requests mobile footer bottom padding of
`calc(var(--fs-space-2xl) * 1 + var(--shell-safe-bottom))` instead of the former
multiplier 3, and a one-size-larger GitHub icon. The footer now uses the exact
padding expression and the registered 36px GitHub variant (viewBox 36×34), with
an explicit rendered 36px slot overriding compact rows' 24px icon slot.
Tablet/desktop padding and the two legal icons remain unchanged. Validation
results follow; preceding results and candidate hash describe the earlier footer.

The first production check found the fixed settings control overlapping GitHub
at 320px with the smaller bottom gutter. GitHub now occupies its own centered
mobile row, preserving the requested padding and avoiding that overlap;
tablet/desktop retain the inline layout. The unchanged keyboard-clearance
assertion is retained for the rerun.

The next checks exposed the same collision at 200% text on taller mobile
screens, where the settings artwork also grows. A footer width container query
now reserves the remaining settings-control overlap only below 16em of available
width. The em threshold follows text enlargement; ordinary 320px-and-wider
layouts get no extra clearance. The requested footer padding remains exact.

### Follow-up checks and candidate

- Frontend types, validation types, repository lint, formatting and diff checks:
  PASS. Focused server-rendered shell suite: **5 PASS**.
- Flag-on isolated production and Storybook builds: PASS. Current build ID
  `F4Ol3oslkh-QNXPCSF9db`; all seven changed frontend source/story/test files
  match the built candidate.
- Storybook footer matrix: **12 PASS**, checking the 36×34 GitHub viewBox,
  rendered 36px dimensions, exact 48px mobile / 32px desktop bottom padding
  without a safe-area inset, plus the existing four-theme, keyboard, layout,
  hit-target, Axe and 200% text checks. Mobile screenshot visually inspected.
- Early responsive runs exposed the ordinary and enlarged-text overlaps above;
  both were corrected without weakening the existing checks. A later concurrent
  production run failed clear-focus on the homepage More control, outside the
  footer. The unchanged suite then passed serially: **21 PASS**, zero retries,
  3.8 minutes. The More focus failure did not reproduce; it remains recorded
  rather than being presented as an initially clean run. Coverage includes
  normal/enlarged text across six viewports, themes, no-JavaScript, long labels,
  safe-area spacing and touch scrolling.

Aggregate pending patch SHA-256, excluding this task record:
`9e205b7c864f2c8d39da5941c99131a12a59f13ad50f8526fb4c3029b029d032`.
Evidence is retained at
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/footer-refinement-2026-10-12`.
The full unit suite, Lighthouse, flag-off build and other browsers/devices were
not rerun for this follow-up. Previous broader evidence remains historical.
No commit, push or deployment was performed.

The follow-up is implemented with scoped technical checks passing. Visual
acceptance remains Dimi's; no broader browser/device or EPIC acceptance is
inferred. All temporary validation servers stopped and the development preview
remains available.

## Final review and authorized delivery — 2026-10-12

Read-only review of all 15 pending files found **no actionable findings**.
The reviewed implementation matched the recorded candidate hashes. Scope,
dependency direction, shared styling/icons, native link semantics, current
documentation and the complete tracked/untracked diff were checked.

An additional production Chromium probe passed **60 combinations**: viewport
widths 320/360/390/480/600/767px, text sizes 100/125/150/175/200%, and simulated
safe-area insets of 0/32px at 900px height. All three footer targets stayed inside
the viewport, unobscured and clear of the settings control. The probe did not
follow the external GitHub link. Review evidence and file hashes are retained at
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/footer-review-2026-10-12`.
The previously recorded More-focus failure remains a validation limitation;
the passing serial rerun does not establish its cause. No fresh Safari/Firefox,
physical-device or Lighthouse evidence is claimed.

Dimi then explicitly requested documentation updates, commit and push. All 15
reviewed files still matched before this documentation-only delivery update.
The containing commit records the final delivery identity; the target is
`origin/feature/funkspace-minimum-usable`. Push success, remote equality and a
clean working tree are verified after delivery. No deployment, EPIC closure or
visual acceptance is inferred from this authorization.
