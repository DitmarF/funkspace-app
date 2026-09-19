# Task FS-2.1 — Page structure and shared navigation data

## Task metadata

- **Status:** Complete — route/shell technical review passed; Dimi approved the labels/destinations and bounded shell on 2026-09-19. Later page/content work and FS-G1 remain open.
- **Epic:** [Minimum Usable Experience, EPIC 2](../features/funkspace-minimum-usable.md#epic-2--three-section-website-content-and-real-routes).
- **Owner/current writer:** Sites delivered the implementation; Codex completed the subsequent read-only review and records this explicitly authorized acceptance closure. Dimi owns product acceptance.
- **Last updated:** 2026-09-19.
- **Authorized checkout:** `/Users/dimi/Projects/funkspace-app`, branch `feature/funkspace-minimum-usable`.
- **Exact base:** `825dae1035bb20858aaf88b6cf87bddf05ae7f5d`; clean index, tracked files and untracked state before work. Accepted implementation is this base plus the reviewed FS-2.1 patch, SHA-256 `3b9edabaf47b4812527b8cfdefe47640063b7f6b00593cae7d6028fb260ff836`. The containing Git commit also records this acceptance closure and two comment/test-description updates, with no behavioral changes after review. Dimi expressly authorized commit and push; no PR/merge/deployment authorization is inferred.
- **Related guidance:** [workflow](../development/ai-workflow.md), [task template](../templates/task.md), [architecture](../architecture.md), [ADR-003](../decisions/ADR-003-interactive-experience-boundary.md), [ADR-004](../decisions/ADR-004-game-development-architecture.md), [FS-1.7 acceptance](fs-1.7-essential-component-acceptance.md), [FS-0.5](fs-0.5-product-and-technical-decisions.md).
- **Supplied scope:** `/Users/dimi/Downloads/FunkSpace_EPIC_2_Detailed_Plan.md`, SHA-256 `01a4a82294ea6d97fe33582b7605324ed5a430c6ffa25537819fa26c3c42e6b5`. Its FS-2.1 proposal is consistent with the authoritative feature plan; later tasks in that attachment are not additional implementation authorization.

## Requested outcome and acceptance

Define one small typed destination contract and the smallest reusable portfolio document shell. Preserve native navigation, server-rendered content, the accepted theme foundations and the future game boundary.

- [x] One destination definition distinguishes homepage About from `/about`; no service, CMS, copy or route-status fields.
- [x] Portfolio routes opt into one header, one `main#main-content` and one footer; homepage IDs `start`, `about`, `contact` occur once in order.
- [x] Visible links use ordinary anchors and only currently readable destinations. No empty secondary pages or unfinished contact/game links.
- [x] Focused destination, shell, duplicate-ID, native-navigation and no-JavaScript checks pass; see completion evidence below.
- [x] Codex completes the separately requested read-only route/import review; technical PASS with no actionable findings.
- [x] Dimi expressly accepts mapping/labels and the bounded FS-2.1 composition on 2026-09-19. Earlier draft permission and final content acceptance remain distinct.

## Inspection, reuse and source reconciliation

Read root AGENTS (no nested guidance found), workflow, task template, authoritative feature plan, FS-0.5 decisions, FS-1.7 acceptance, FS-0.2 prerequisite order, README, architecture/ADRs and architecture checklist. Inspected actual routes/layout, Container, HomeTemplate, Hero/About, native ButtonLink/standardControl, ThemeSwitcher, ServiceProvider/createServices, ThemeBootstrapScript, game package public exports and frontend theme adapter, package scripts, Tailwind, Vitest, Playwright and nearby tests/stories.

The base homepage has a FunkSpace H1 and ThemeSwitcher. Privacy already contains the three technical statements preserved here. `/about` and `/impressum` do not exist. Typography and sandbox routes are demonstrations, not portfolio navigation destinations.

Reuse `Container` (semantic `as`, width, spacing and native attributes) and the accepted default `ButtonLink` export (required `href`/children, default small size, real outlined `<a>`). No new control variant or icon is needed. HomeTemplate has a different feature-card/CTA responsibility, while Hero/About depend on SnapSection, hidden-on-start animation and legacy infrastructure imports. They are not suitable portfolio shells and remain untouched.

`PortfolioShell` has two demonstrated consumers: Home and Privacy. It is an ordinary server component composed **inside each portfolio page**, not `app/layout.tsx`. Future portfolio pages can opt in; a future play route is not forced into portfolio navigation. Children supply page content without another main/header/footer. No route groups or future routes are created.

The root layout, self-hosted fonts, ThemeBootstrapScript, generated bootstrap, providers and ThemeService remain unchanged. ThemeSwitcher stays the existing narrow client boundary. No game, scene or animation runtime is imported by the new shell. The existing game build prerequisite does not mean a game is mounted in the website.

Historical feature-plan handoff text restricted its preceding documentation-closure session to EPIC 1. Dimi's current explicit FS-2.1 implementation request supersedes that stale authorization statement for this task only. FS-1.7's actual completion decision supersedes its earlier pending-stage notes. Historical SHAs are not reset targets. The older fullscreen/snapping proposal remains superseded by ordinary scrolling.

The separate project-mirror checkout remains protected at `63d117358d67137cebff744a29fa3a9a49d82415` on `feature/wave-survivor`, with pre-existing untracked combat files. No file in that checkout or synced `sources/` is part of this work.

## Destination and content contract

`frontend/data/portfolioDestinations.ts` exports a readonly object. Object keys are stable identities; each value contains only `label` and root-prefixed `href`. No grouping field is needed by the current composition. Header/footer reference that object directly; their explicit selection is not a second href/label dataset or a permanent readiness registry. `main-content` is the shell's local skip target.

**Approval status:** the four routes were approved by FS-0.5. Dimi approved the precise seven-destination mapping below and the bounded shell on 2026-09-19, after the technical review. Approval of planned destinations does not make unfinished routes or contact content complete.

| Identity  | Label                | Href         | Current exposure/content                                                                | Next owner                                            |
| --------- | -------------------- | ------------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| home      | FunkSpace            | `/`          | Header identity; existing identity and bounded homepage sections                        | Sites FS-2.2; Dimi final Start copy/visual acceptance |
| start     | Start                | `/#start`    | Header; existing H1 and theme controls                                                  | Sites FS-2.2                                          |
| about     | About                | `/#about`    | Header; sourced one-sentence draft, readable without JavaScript                         | Sites FS-2.3; Dimi final short copy                   |
| contact   | Contact              | `/#contact`  | ID exists, but link withheld: honest unavailable-address notice is not a contact method | Sites FS-2.4; Dimi public address                     |
| aboutPage | More about FunkSpace | `/about`     | Contract only; route/link not created                                                   | Sites FS-2.3; Dimi full About copy                    |
| impressum | Impressum            | `/impressum` | Contract only; route/link not created                                                   | Sites FS-2.4; Dimi operator/legal material            |
| privacy   | Privacy              | `/privacy`   | Footer; existing readable technical statements, not final legal approval                | Sites FS-2.4/FS-5.5; Dimi legal approval              |

The future secondary-page Contact link must reference `destinations.contact` so it goes to `/#contact`, not a secondary page's fragment. Do not expose it merely because the ID exists. Add it only when FS-2.4 supplies a usable contact method. Similarly expose the full About/Impressum links only with readable route content.

### Input register

- **Draft, use expressly permitted in this session:** About sentence “FunkSpace is a design-system-first web experience.” sourced from README. Contact notice “A public contact address is not available yet.” Dimi answered **“Use those bounded drafts”** to the explicit proposal, including withholding Contact navigation. Later acceptance approves the mapping and bounded shell; these texts remain drafts pending their content tasks.
- **Missing:** approved Start copy/static asset treatment (Dimi, FS-2.2); final short/full About copy (Dimi, FS-2.3); public email and operator/legal facts (Dimi, FS-2.4).
- **Existing, final approval unestablished:** Privacy technical statements, preserved verbatim. No legal certification or invented provider/processing claim is added.
- Missing content keeps dependent tasks/static-site acceptance open; missing required legal information also blocks public release. FS-5.5 still owns deployment/contact-specific legal finalization.

## Scope and protected areas

In scope: destination data, opt-in shell, bounded homepage structure, existing Privacy wrapper, focused unit/browser coverage, shell Storybook fixture and task/feature evidence.

Out of implementation scope: full secondary-page completion, Start artwork/logo work, final copy, contact form/email delivery, navigation overlay, new motion policy, snapping/carousels, metadata overhaul, new routes, game integration and deployment/static export. The subsequent Codex review and acceptance closure were separately requested and are recorded below.

Protected: providers/bootstrap/ThemeService, controls/tokens/fonts/original assets, generated files, package/lockfile/configuration, standalone game and its public API, unrelated demonstration components and the separate checkout's local work. No dependency or architecture-layer change.

## Implementation sequence and changed files

1. Define typed destinations in existing frontend data location.
2. Compose the two actual routes through PortfolioShell, preserving existing content and the agreed bounded drafts.
3. Verify the real documents and native browser behavior; self-review and prepare the separate reviewer handoff.

| Path                                                     | Change                                                                     |
| -------------------------------------------------------- | -------------------------------------------------------------------------- |
| `frontend/data/portfolioDestinations.ts`                 | New shared destination contract                                            |
| `frontend/data/portfolioDestinations.test.ts`            | Exact mapping and uniqueness regression                                    |
| `frontend/components/Layouts/PortfolioShell.tsx`         | Shared server-rendered header/main/footer and skip link                    |
| `frontend/components/Layouts/PortfolioShell.test.tsx`    | Actual route SSR, landmarks, IDs and honest exposure                       |
| `frontend/components/Layouts/PortfolioShell.stories.tsx` | Existing Privacy content in reusable shell fixture                         |
| `frontend/app/page.tsx`                                  | Stable sections and bounded drafts; retain ThemeSwitcher                   |
| `frontend/app/privacy/page.tsx`                          | Adopt shell, preserve existing text                                        |
| `e2e/portfolio-navigation.spec.ts`                       | Actual routes with JavaScript on/off, skip focus, hashes, Back and refresh |
| `docs/features/funkspace-minimum-usable.md`              | FS-2.1 status and current handoff                                          |
| `docs/tasks/fs-2.1-page-structure-and-navigation.md`     | This record                                                                |

## Validation plan and completion record

Use installed Node 22.22.0 / pnpm 10.30.3. Check theme-bootstrap freshness before generation. Run tokens → common typecheck → game build → frontend typecheck, then lint, focused and full tests, Storybook/production builds and route E2E. Recheck generated diffs after commands. Browser checks use installed Chromium; no device/Safari/Firefox acceptance is inferred.

### Actual checks and outcomes

All checks ran in the authorized checkout on the base plus this source candidate. No dependencies were installed. The Sites execution-profile probe reported `portable`, `configured: false`; the existing Next.js scripts and deployment configuration were preserved. The actual shell change is presentation-only, not a new architectural integration pattern requiring a new ADR.

| Actual command/check                                                                                                                                                                                           | Result                                                                                                                                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check:theme-bootstrap` before dev/generation                                                                                                                                                             | PASS; accepted generated bootstrap was fresh                                                                                                                                                                                                                   |
| `pnpm build:tokens` → `pnpm -F @funkspace/common typecheck` → `pnpm -F @funkspace/wave-survivor build`                                                                                                         | PASS in prerequisite order; generated outputs unchanged                                                                                                                                                                                                        |
| `pnpm -F frontend exec tsc --noEmit --incremental false`                                                                                                                                                       | PASS after correcting a new test's unsupported Testing Library `exact` option; no production API/type suppression                                                                                                                                              |
| `pnpm lint`                                                                                                                                                                                                    | PASS, no lint warnings/errors and repository formatting passed; Next lint deprecation notice remains                                                                                                                                                           |
| `pnpm exec vitest run frontend/data/portfolioDestinations.test.ts frontend/components/Layouts/PortfolioShell.test.tsx frontend/components/Controls/Button.test.tsx frontend/components/ThemeSwitcher.test.tsx` | PASS, 19 tests / 4 files                                                                                                                                                                                                                                       |
| `pnpm test`                                                                                                                                                                                                    | PASS, 1,355 tests / 92 files, including the existing game tests discovered by the root suite                                                                                                                                                                   |
| `pnpm e2e --reporter=line`                                                                                                                                                                                     | PASS, 20 Chromium tests, zero retries/skips; includes 6 new route tests plus existing unfiltered home accessibility, theme, foundation/font, logo and no-cookie/third-party checks                                                                             |
| `pnpm storybook:build`                                                                                                                                                                                         | PASS; existing large-chunk warning remains                                                                                                                                                                                                                     |
| `pnpm build`                                                                                                                                                                                                   | PASS; Home and Privacy prerendered; build lists no `/about`, `/impressum` or play route                                                                                                                                                                        |
| `pnpm -F frontend exec tsc --noEmit -p <evidence>/tsconfig.json`                                                                                                                                               | PASS for new Storybook and Playwright files normally outside frontend typecheck. Initial temporary config omitted Next CSS declarations; adding the existing `next-env.d.ts` to its includes fixed the verification setup without changing that generated file |
| `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config <evidence>/playwright.production.config.ts`                                                                                           | PASS, 12 tests, zero retries/skips: the 6 navigation tests against a fresh production server at 1280×720 and 320×568, each covering JavaScript on/off                                                                                                          |
| `pnpm exec lhci autorun --config=.lighthouse/lighthouserc.off.json`                                                                                                                                            | PASS, 3 fresh production-homepage runs. LCP 653.26/647.17/644.50ms; CLS 0 and performance 1 each. Existing thresholds unchanged. This is one local build, not an ON/OFF build comparison or field p75 evidence                                                 |
| `git diff --check`, final scoped formatting and protected-path diff inspection                                                                                                                                 | PASS; no generated, provider, root-layout, token, package/lockfile or game changes                                                                                                                                                                             |

The route tests exercise direct loading/refresh of Home and Privacy, native Back, homepage hashes from Privacy, skip-link keyboard focus, server-rendered unique IDs/landmarks, and withheld unfinished links. New route checks capture browser page/console errors and passed with none. Draft Contact content is intentionally not counted as a working contact journey. The production viewport runs establish those navigation checks at two sizes, not full FS-2.5 responsive/enlarged-text acceptance.

**Not run during author validation:** independent Codex review (subsequently completed below), real-device/Safari/Firefox review, final visual/content acceptance, the standalone game demo suite, full Storybook browser suite and dedicated bootstrap browser suite (protected systems unchanged). The in-app local preview opening was attempted, but browser access was denied because its admin-enforced security policy could not be verified. No bypass was attempted; manual visual inspection is not claimed. Local development and test-owned servers were stopped after validation.

### Author self-review and cleanup

Applied the architecture checklist to all ten changed/new files. The shell has two actual route consumers; its transitive component imports terminate in existing Container/control presentation, CSS and declarative data. No new Client Component, service, event interception, storage, renderer or package dependency. Root providers/bootstrap/fonts are preserved byte-for-byte in Git. Stable homepage sections use ordinary document flow; no legacy SnapSection/HomeTemplate runtime is pulled in. Original tests and accessibility thresholds are unchanged. No hand edits to generated artifacts and no unrelated tracked changes from checks were found.

The only deviations during implementation were the corrected test typing and temporary typecheck configuration described above. No material source-scope conflict or new architecture approval was needed. This is author self-review, **not** the requested independent Codex review or a product acceptance verdict.

### Reproducible handoff

Local evidence root (`<evidence>` above): `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-2.1/`.

- `candidate.patch` includes all ten tracked/new task files against base `825dae1035bb20858aaf88b6cf87bddf05ae7f5d`; apply only to a clean checkout of that base after `git apply --check`. Do not reset an existing checkout to obtain that base.
- `manifest.json` records branch, exact base, patch SHA-256 and each candidate file's SHA-256. The patch is checked against reconstructed base files and in reverse against this working tree, without staging or committing.
- Logs retain unit, development E2E, production E2E, Storybook/build and Lighthouse results; temporary production/typecheck configurations make those extra checks reproducible on this machine. Fresh Lighthouse reports are copied separately from pre-existing historical reports.
- The source checkout remains the primary handoff; another session must explicitly open it or apply the patch. These are local artifacts, not a published preview or automatically synchronized remote branch.

Contract changes are limited to the typed destination export and opt-in `PortfolioShell({ children })` composition described above. Existing control, theme and game contracts are unchanged. The patch/manifest preserve the exact pre-acceptance review candidate; the containing Git commit is the durable implementation plus acceptance record.

## Codex route and shell review — 2026-09-19

At Dimi's subsequent request, Codex performed a fresh read-only review pass in the same conversation. It verified the actual base, patch digest and all ten candidate hashes rather than substituting another branch or relying on the author's summary. This is a separately requested technical review pass, not a separate agent's or human's sign-off.

**Verdict: PASS for bounded FS-2.1.** No actionable P0–P3 findings or required corrections. Confirmed the single destination source, root-prefixed Contact contract, ordinary anchor behavior, honest visible destinations, withheld unfinished links, unique IDs/landmarks, route-local shell placement and preserved root theme/provider composition. Direct/transitive import traversal from root/Home/Privacy found no game host/runtime reachability or root-to-PortfolioShell dependency. Production route traces contained no game references; the game build prerequisite was not treated as browser loading.

Fresh reviewer commands passed: `pnpm check:theme-bootstrap`; common/game typechecks; frontend `tsc --noEmit --incremental false`; `pnpm lint`; the same focused Vitest command above (19 tests / 4 files); `pnpm build`; and the supplied production Playwright configuration with separate output (12 tests at desktop/narrow widths, JavaScript on/off, zero skips/failures/flakes). Reviewer build ID: `4_SLqyBhBWysS5UV9tgbn`. Fresh generated Home/Privacy HTML had the five expected anchors and unique IDs, one header/main/footer. All 473 tracked/candidate file hashes and Git status were unchanged after checks; no source, test or tracked document edits occurred during review.

Reviewer evidence is retained locally at `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-2.1-codex-review/`, including `review.md`, import graph, command logs and `verification.json`. This summary preserves the verdict and actual scope in the repository. Author-only full-suite/Storybook/Lighthouse results are not relabeled as reviewer results. Real-device/Safari/Firefox and final visual/content acceptance are not inferred.

## Dimi acceptance and commit/push authorization — 2026-09-19

Dimi's actual decision:

> I approve the labels/destinations and bounded shell. Update the documentation if needed, then commit and push the changes.

This accepts FS-2.1's seven labels/hrefs and bounded shared shell after the technical PASS. It authorizes updating these records and committing/pushing the approved ten-file candidate on `feature/funkspace-minimum-usable`. It does not approve final draft copy, unfinished secondary pages/contact, legal completeness, FS-G1 or public release, nor authorize PR/merge/deployment/provider/DNS changes or live email.

Closure verified all ten candidate files still matched the reviewed manifest before edits. Only this record, the feature-plan status, the destination comment and its test description changed after review; runtime behavior and test assertions are unchanged. Final `prettier --check` on the four updated files, relative documentation-link/content checks, `pnpm check:theme-bootstrap`, `git diff --check` and focused destination/shell Vitest tests all passed (4 tests / 2 files). Application builds were not repeated for these documentation-only differences; the fresh reviewer build above remains applicable. The remote portfolio branch was confirmed at the exact base before the authorized commit/push.

FS-2.1 is complete. FS-2.2/2.3/2.4 retain the content/page owners above; expose their destinations only when usable content exists and extend route/no-JavaScript checks at that point. No automatic synchronization between sessions is assumed.
