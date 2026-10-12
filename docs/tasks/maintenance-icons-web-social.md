# Games/social icons, Web Aperture and overlay typography — 2026-10-12

## Goal, source and scope

Dimi requested the revised Games icon, three new families (`s-web`, `github`,
`linkedin`), and the `s-web` icon on the WEB animation's tree row. This is a local
asset-library change; no social destinations, Contact work or deployment is
included. The scene was labeled Aperture - 1 at the start of this work; Dimi's
follow-up below renames it Web Aperture.

Base: `feature/funkspace-minimum-usable`, commit
`3680da76cc09b17ecb9776d3e91cda1632f04f58`, clean working tree before this task.
Inspected the existing Icon registry, viewBox mapping, raw SVGs, source register,
gallery, tests and navigation data. Repository/architecture and EPIC constraints
read in this session remain applicable; no services or motion ownership change.

The [UI Library Icons page](https://www.figma.com/design/o39DgxXnQ0jogb2ez6WKfq/001---FunkSpace-UI-Library?node-id=6-2)
was found through the existing source register. Current metadata and high-fidelity
design context/screenshots confirm all twelve requested size variants.

## Implementation plan and contracts

1. Retain exact Figma exports in `frontend/public/svg/icons/`, replacing only the
   three Games files and adding nine files. Inspect SVG markup and preserve raw
   bytes, geometry and actual export bounds.
2. Extend `iconNames`, `iconArtwork` and `categoryIconViewBoxes`. Adapt only paint,
   JSX syntax and unused IDs as the current system does; preserve aspect ratio.
3. Assign `s-web` only to the existing WEB scene destination. The Animations
   parent and pending item retain category artwork; Games consumers inherit the
   replacement. GitHub/LinkedIn become library options without invented links.
4. Update provenance/docs and gallery counts; validate geometry, themes,
   accessibility, rendering and navigation through affected tests and isolated
   builds. Keep the user's development preview running.

## Validation and handoff

**Implemented; scoped technical checks PASS. Dimi visual acceptance pending.**

- Replaced three raw Games SVGs and added nine WEB/GitHub/LinkedIn SVGs. All
  twelve match the downloaded Figma bytes. The [source register](../../frontend/components/Icons/README.md#games-replacement-web-and-social-additions--2026-10-12)
  records their nodes and exact export frames. Source screenshots were inspected
  for all twelve variants before implementation.
- Extended the existing artwork/viewBox registry and changed the single WEB
  tree data entry. Gallery/Playground automatically expose 31 families / 93
  variants; no parallel icon system or dependency was added.
- Updated tree unit/browser assertions to compare the actual Games/WEB geometry
  to source SVGs, plus gallery counts and layout/source documentation.
- Focused tests: 3 files / **113 PASS**, including 98 icon cases. Full unit suite:
  121 files / **1,873 PASS**. Frontend types, validation types and repository lint
  passed. Validation types were repeated after adding browser geometry checks.
- Isolated flag-on production and Storybook builds: PASS. Production build ID
  `AzLQtqwLUdTfYDPENm-Pn`, checkout `/private/tmp/funkspace-active-nav-checkout`.
  All 15 changed implementation/asset files match the built source exactly.
- Production Chromium: **25 PASS** (`navigation-tree.spec.ts` and
  `active-navigation.spec.ts`), including 24/36 artwork at 320/768/1280px,
  native/no-JavaScript navigation, current state, More entry, keyboard toggles,
  history and hydration. Existing active-state/group behavior remains intact.
- Built Storybook Chromium: **19 PASS** (`icons.spec.ts` and
  `main-navigation.spec.ts`). Four gallery cases cover all 93 variants in all
  themes, exact size/viewBox, semantic paints, unique IDs, unfiltered Axe scans
  and 320px/200% text reflow. Fifteen cases retain the header/current-page states.
- Visually compared the light/dark galleries to the Figma references and
  inspected the desktop navigation screenshot. Requested shapes and proportions
  are retained, with WEB on the animation row and the revised Games artwork.

The first page-level design-context request returned no selection; metadata
discovery and explicit component-node requests then succeeded. Some asset URLs
initially returned HTTP 202 with no body; only successful SVG responses were
saved, then checked for safe markup, geometry and exact hashes.

Candidate patch SHA-256 (tracked plus new files, excluding this record):
`edb36c1cb2df0f814b7446d3417520093d3d3eedbdce0a0a5852257cd26fd6da`.
The exact patch, file hashes, Figma URL/node/export manifest, build/browser/unit
logs and screenshots are retained locally at
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/icons-2026-10-12`.

No new Lighthouse, flag-off build, full browser suite, Safari/Firefox or
physical-device check was run for this bounded asset change. Existing Next lint
deprecation and Storybook chunk-size warnings remain. Technical validation,
Dimi acceptance and EPIC completion are separate. The development preview was
preserved. No commit, push, deployment or Figma write was performed.

## Follow-up — Web Aperture naming and overlay typography — 2026-10-12

**Status:** Implementation and technical validation complete. Dimi acceptance
pending; no EPIC completion is asserted.

Dimi's next request renames Aperture - 1 to **Web Aperture** and uses **Work
Sans** for the Navigation and Accessibility overlay titles. This supersedes
the old scene name in this record and R19; the preceding icon validation and
candidate hash describe the earlier candidate only.

Inspected the existing scene headings/customization, navigation/destination
data, details metadata, shared overlay styles, font registrations, stories,
affected tests and current architecture/feature documentation. No additional
product decision is needed. The existing route `/animations/aperture`, stable
scene/navigation identities and settings contracts remain unchanged.

Implementation updates homepage/details headings, customization copy, More's
accessible label, the navigation row, details metadata and the customization
story. Existing tests now expect the new name. The overlay's existing h3 rule
uses the registered Work Sans variable with its semantic fallback; Appearance
and Motion legends retain their typography. Current-facing documentation is
updated; historical review evidence is retained.

Validation covers affected component/data tests, types, lint/formatting,
isolated production and Storybook builds, and browser navigation/customization
and overlay composition. Browser assertions check both overlay font families
at mobile/tablet/desktop widths and the renamed details page title. No shared
service, Domain, animation scheduling, generated token or dependency changes.

### Follow-up validation and handoff

- Frontend types (`pnpm -F frontend exec tsc --noEmit`), validation types
  (`pnpm typecheck:validation`) and repository lint (`pnpm lint`): PASS.
- `pnpm test --` with the four affected component/data paths ran the complete
  suite through the repository wrapper: **121 files / 1,873 tests PASS**.
- Isolated `NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm build` and
  `pnpm storybook:build`: PASS. Build ID `3pKZ7pa-bseCrwtwWQnAQ`.
  All 24 changed frontend source/asset/test files match the build checkout.
- Production Chromium: **97 PASS**, zero retries. Ran active-navigation,
  navigation-composition, navigation-tree, scene-customization, scene-actions,
  portfolio-navigation, home and static-route-contract suites against port
  3107 using `/private/tmp/funkspace-active-nav.playwright.config.ts`.
  Both title fonts passed at 320/375/768/1280/1440px; the details title,
  renamed links, native navigation, no-JavaScript, focus, enlarged text and
  customization contracts passed. Inspected navigation and accessibility
  screenshots for label legibility and heading layout.
- Built Storybook Chromium: **15 PASS** in main-navigation.spec.ts using
  `/private/tmp/funkspace-active-nav-storybook.playwright.config.ts` on port 6107. Current Web Aperture story and mobile/tablet/desktop header states pass.
- No old animation name remains in frontend code/stories or browser tests.
  Changed documentation file links, formatting and `git diff --check`: PASS.

Aggregate candidate patch SHA-256, including the pending icon work and excluding
this task record:
`4992e5db9371b1184ad839e96e6aa82c13ca1dc50d5a6a960ff08ee59680b811`.
Exact patch, file hashes, validation logs and screenshots are saved at
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/web-aperture-2026-10-12`.

No new Lighthouse, flag-off production build, dedicated theme-bootstrap browser
suite, start-scene/start-static browser suite, Safari/Firefox or physical-device
checks were run. Those updated label expectations were type checked; broader
claims are not made. Existing build-tool warnings remain. Temporary validation
servers stopped; the development preview remains untouched. At this validation
handoff, changes were uncommitted and no push or deployment had been performed.
Dimi's visual acceptance remains separate from technical validation.

## Authorized delivery — 2026-10-12

Dimi explicitly requested documentation updates, then commit and push of the
pending changes. The delivery combines the revised Games icon, new WEB/GitHub/
LinkedIn families, WEB tree icon, Web Aperture naming and the two Work Sans
overlay headings, including their stories, tests and documentation.

Before delivery, all 41 files in the recorded candidate manifest matched their
validated hashes. Only this task record and the feature-plan handoff link were
then updated. The preceding application/build/browser results therefore remain
applicable; documentation receives fresh formatting, link and diff checks.

Delivery targets `origin/feature/funkspace-minimum-usable` with a normal commit
and push. The resulting Git commit is the authoritative delivery identity; push
success and remote equality are verified after publication. This authorization
does not imply Dimi visual acceptance, EPIC closure or deployment.
