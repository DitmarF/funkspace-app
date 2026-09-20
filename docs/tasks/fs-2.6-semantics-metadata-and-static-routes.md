# Task FS-2.6 — Semantics, metadata and static routes

## Task metadata

- **Status:** Complete — integrated technical review PASS; Dimi explicitly declared FS-2.6 and EPIC 2 done and authorized documentation closure, commit and push on 2026-09-20. Final publication copy/metadata and legal facts remain separate follow-ups.
- **Owner:** Sites implementation; Codex integrated technical review; Dimi content/product acceptance.
- **Last updated:** 2026-09-20
- **Related:** [Feature plan](../features/funkspace-minimum-usable.md#fs-26--finish-semantic-metadata-and-static-route-behavior), [FS-2.5 completion](fs-2.5-responsive-shell-and-scrolling.md#dimi-completion-and-commitpush-authorization--2026-09-20), [workflow](../development/ai-workflow.md).

## Requested outcome and acceptance

Replace scaffold identity, complete accessible static-route and not-found recovery, and prepare the full FS-2.1–FS-2.6 candidate for independent Codex review. The initial implementation request deferred that review; Dimi subsequently requested it and explicitly closed the task/epic after the review below.

- [x] Existing four portfolio routes have coherent headings/landmarks and visible keyboard skip-to-main behavior.
- [x] Metadata reflects supplied material; title/description/icon approval status remains explicit.
- [x] Unknown paths return a verified production 404 and readable native home/contact recovery.
- [x] Direct load, refresh, Back, homepage fragments, About and secondary-page Contact/legal/email journeys work with fresh JavaScript-disabled contexts as well as hydrated pages.
- [x] Visible static artwork/text, local assets/fonts, hydration errors and theme preservation have actual evidence.
- [x] Ordered prerequisites and relevant tests/builds pass; candidate and integrated diff are reproducible (exact replay evidence in the manifest).
- [x] Integrated technical review completed; Dimi explicitly accepts the bounded FS-2.6 and EPIC 2 delivery, including its documented draft/provisional content state.
- [ ] Final publication titles, descriptions, copy and icon treatment — deferred from bounded closure; the earlier “Keep them as proposals” title decision is not rewritten as separate final editorial approval.

## Context, base and inspection

Authorized checkout `/Users/dimi/Projects/funkspace-app`; branch `feature/funkspace-minimum-usable`; exact FS-2.6 base `5d0ab6bc1a9a1e72318b584b543cf19a4f594fa0`. Clean starting tree, no protected local changes. FS-2.5 has explicit completion and push evidence. FS-2.1–2.4 approvals retain their original scope; Start/About drafts and legal facts remain unresolved for publication.

Inspected current AGENTS (no nested guidance), workflow/task template, authoritative plan/detailed EPIC 2 scope, accepted route/shell/logo/control evidence, route/layout metadata, local fonts, original SVG and ICO, providers/bootstrap, shell/skip behavior, package scripts and E2E configurations/tests. Existing metadata says “Create Next App”; ICO inspection shows the Vercel triangle. The four pages already have one shell/H1 and a working skip link. No custom not-found exists. About uses authorized Latin placeholder paragraphs under an English root without a language annotation.

Default `pnpm e2e` starts **development** Next on port 3000, permits reuse of an existing server and defines **Chromium only**. The existing theme-bootstrap config is production-only on port 3100. The new small production config extends the ordinary suite but runs `next start`, refuses reuse, and retains Chromium-only coverage. It does not infer that earlier default invocations used production without their separately recorded preview evidence.

## Content and approval register

| Item                                                                             | Status and provenance                                                                                                                                     | Owner / latest needed                                                                                           |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| English-first; four routes; FunkSpace brand/accepted logo                        | Recorded FS-0.5/FS-2.1/FS-2.2 foundations; preserved                                                                                                      | Existing accepted contract                                                                                      |
| Titles: FunkSpace; About FunkSpace; Impressum \| FunkSpace; Privacy \| FunkSpace | **Proposed**, displayed in the local candidate. Dimi answered “Keep them as proposals” to the exact title approval question in this task                  | Dimi / final publication metadata; bounded task accepted below                                                  |
| Homepage description                                                             | Exact README introduction authorized as a development draft in FS-2.2; now shared with visible Start text to prevent drift                                | Dimi final editorial approval / before publication                                                              |
| About description                                                                | Existing English “Draft content — final About copy is not yet approved.” notice; no biography invented                                                    | Dimi / final About copy and publication metadata                                                                |
| Impressum/Privacy descriptions                                                   | Existing incomplete-content notices, reused verbatim; no legal completeness claim                                                                         | Dimi / final wording before publication                                                                         |
| Favicon treatment                                                                | Existing original FunkSpace SVG, unchanged; replaces inspected Vercel scaffold ICO. Role/tiny-size treatment remains **proposed**, not new asset approval | Dimi / final publication identity treatment; no new geometry                                                    |
| About Latin placeholder paragraphs                                               | Authorized development text; `lang="la"` marks those paragraphs only. Notices/headings remain English; no translation or final-copy approval inferred     | Dimi / final copy before publication                                                                            |
| Current operator/hosting/mailbox facts and final legal wording                   | Missing/draft; FS-2.4 gap register remains authoritative                                                                                                  | Dimi supplies; Sites incorporates; Codex verifies facts / before publication; bounded checkpoint accepted below |
| Canonical host, metadataBase, social/deployment URLs                             | Not supplied/approved; intentionally absent                                                                                                               | Dimi host decision and Codex verified configuration / rollout metadata; provider-specific privacy stays FS-5.5  |

## Scope and implementation plan

1. Replace root scaffold metadata using FunkSpace and the supplied introduction; set proposed route titles and descriptions based on existing notices. Share only the introduction with its two actual consumers; no metadata service/catalogue.
2. Remove the inspected scaffold ICO, point icon metadata at the unchanged original SVG, and preserve self-hosted fonts and theme initialization. Do not invent a canonical/social host or change deployment/static export.
3. Add a server-rendered not-found component using PortfolioShell, ButtonLink and the existing home/contact destinations. Keep portfolio composition out of the universal root; a real future play route will not inherit this fallback's shell.
4. Annotate the Latin draft paragraphs, reuse existing landmarks/skip semantics, add native/static metadata/recovery coverage and an explicit production E2E command/config.
5. Run bootstrap freshness before generation, tokens → common types → workspace game build → frontend types; full tests/lint/production build and affected shared foundation checks. Capture build/import/output evidence, actual production responses and browser/asset errors. Package task and integrated diffs for later Codex review without initiating it.

Protected: route/destination contract, responsive shell, native controls, accepted logo geometry/animation behavior, tokens/fonts, ThemeService/provider/bootstrap behavior, public game boundary, unrelated demos/assets, final copy/legal decisions. Root metadata changes only; existing hydration handling is not broadened. No dependency/service/route group, live form, scene, game integration, provider/config change or motion policy. No commit, push or deployment authorization carries forward from FS-2.5 closure.

## Validation and handoff plan

New tests cover each route and not-found in fresh JS-on/off contexts, actual rendered metadata and visible text/complete header artwork, headings/skip focus, fonts/identity asset requests, direct load/refresh/history, home fragments, About, secondary Contact and legal/email reading without activating mailto. Existing production route/logo/theme/scroll suites remain in scope. Not-found receives a short-screen enlarged-text and Axe check. Production config refuses an existing dev server and does not silently create multi-browser evidence.

Record final commands/outcomes, build ID, source imports and emitted output. Supply the FS-2.6 patch against the current base plus the integrated FS-2.1–FS-2.6 diff against FS-2.1's verified base; do not reset the working checkout. Track browser-engine/physical-device limits, proposal approvals and legal gaps. Handoff EPIC 3's existing navigation/section/shell/static-logo contracts without marking EPIC 3, FS-G1, live contact, signature scene, game integration or public launch complete.

## Completion record

The implementation candidate replaces scaffold metadata and the Vercel ICO, reuses the unchanged original SVG, annotates Latin draft paragraphs and provides a server-rendered shared-shell 404. The introduced `startIntroduction` constant has exactly two current consumers (Start and root description); no content service or metadata catalogue exists. New production E2E configuration preserves default development E2E and explicitly overrides its web server.

### Actual validation and corrections

- `pnpm check:theme-bootstrap` passed before generation. `pnpm build:tokens` → `pnpm -F @funkspace/common typecheck` → `pnpm -F @funkspace/wave-survivor build` → `pnpm -F frontend exec tsc --noEmit` passed in order.
- `pnpm test`: **96 files / 1,371 tests PASS**, including existing logo, native-control, theme and game unit regressions. No source/test threshold weakened.
- `pnpm lint`: PASS, zero ESLint warnings/errors and clean repository formatting. Existing Next lint deprecation notice remains.
- `pnpm build`: PASS. Final production build ID `Zrt-f4KLGLBvPYh_hO12K`; required pages and not-found prerendered. No static-export/deployment change. Game build is a workspace prerequisite, not browser loading.
- `pnpm storybook:build`: PASS. Existing Vite client-directive/sourcemap and large-chunk notices remain; no Storybook dependency or configuration change.
- `pnpm e2e:theme-bootstrap`: **17/17 production Chromium checks PASS**, including pre-provider startup, failure cases, negative control, persisted/system theme changes and fresh no-JavaScript fallback. No new hydration suppression.
- The first production configuration attempt failed before tests: Playwright's multi-config helper concatenated web-server definitions. Replaced that with a single config object spreading existing settings and overriding `webServer`; rebuilt because the failed attempt had started dev. No server reuse enabled.
- The first corrected production suite ran **88 checks: 84 passed, four new no-JavaScript asset checks failed**. Diagnostic reproduction showed Chromium reports its intentional disabled-script preload as `resourceType=script`, `errorText=csp`; every referenced script separately returned HTTP 200. Tests now allow only that exact disabled-JavaScript condition and independently require every referenced script URL to return 200. Other request failures, asset HTTP errors and browser errors remain failures. The final affected rerun is recorded in the artifact handoff.
- Final `pnpm e2e:production e2e/static-route-contract.spec.ts --workers=2 --reporter=line --output=<artifact>/final-browser`: **13/13 PASS**, no retries. Combined with the unchanged 75 existing tests that passed in the full production run, all 88 distinct production cases have passing evidence; this is not represented as a single clean 88-test invocation. Actual HTTP 404, native recovery, skip focus, metadata, local fonts/SVG/scripts, visible text/artwork and fresh JavaScript-disabled journeys passed. No mail action was activated.
- `pnpm exec lhci autorun --config=<artifact>/lighthouse.json`: **PASS**, 3 runs per required route, 12 total; performance 100 throughout, LCP 643.34–645.48 ms, maximum CLS 0.009468. Existing LCP ≤2500 ms / CLS ≤0.1 budgets retained. Local desktop-preset simulation on the default build, filesystem reports only; not field p75 or flag-on measurements.
- Existing responsive matrix covers 320×568, 390×844, 844×390, 768×1024, 1280×720 and 1440×900; default, muted, dark and dark-high-contrast; 100%/200% root-font enlargement. This changes rem-based text/spacing at a fixed CSS viewport, **not browser zoom or a physical device**. Native scrolling, keyboard focus, footer/legal/contact reachability and safe-area/touch fixtures passed in the production run.
- Source import traversal from root/four routes/not-found covers **59 local modules** with no portfolio game host/runtime import; new modules are server-renderable. Emitted HTML records one header/main/footer and one H1 on all five documents, correct proposed metadata and no scaffold identity. Original logo/control APIs, fonts/tokens, providers/bootstrap, game code and generated tracked files have no FS-2.6 diff.

### Contract and EPIC 3 handoff

The seven typed destinations remain in `frontend/data/portfolioDestinations.ts`: `/`, `/#start`, `/#about`, `/#contact`, `/about`, `/impressum`, `/privacy`. All are exposed behind existing readable content; About and legal material remain explicit authorized drafts. Email is the supplied `diamondfunk13@gmail.com`, readable without JavaScript; tests check its `mailto:` URI without activation/delivery claims.

`PortfolioShell` is composed by each portfolio page and the not-found fallback. The universal root still owns only fonts, bootstrap and services; no route group or future play route was created. `main-content`, `start`, `about` and `contact` remain stable. Recovery links use the shared destination data and accepted native ButtonLink. A future implemented play route will not inherit the not-found component; custom play-error recovery can be scoped later if required.

The static logo contract is unchanged: accepted geometry and scoped instance IDs; portfolio consumers explicitly disable playback; existing sandbox animation consumers retain their API. No second manifest, geometry or motion policy. EPIC 3 can extend the working menu/settings client boundary while retaining native no-JavaScript footer links, server text/artwork and one document scroll flow.

The accepted FS-2.5 mobile launcher remains fixed in a viewport corner, including on not-found. At 320px/200% text it can visually overlap reading content until scrolled above it; extra footer room and focus clearance remain essential. This known constraint is preserved and shown in `404-320-200percent.png`, not claimed resolved. At 48rem and wider the trigger scrolls with the header. No new blank viewport or clipping workaround was introduced.

### Candidate, acceptance and limits

Accessible handoff directory: `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-2.6/`. `candidate.patch` is against FS-2.6 base `5d0ab6bc1a9a1e72318b584b543cf19a4f594fa0`; `integrated.patch` is against verified pre-FS-2.1 base `825dae1035bb20858aaf88b6cf87bddf05ae7f5d`. The manifest records exact hashes and replay results; `handoff.md` provides commands, browser/performance evidence and limits. Another session must receive these artifacts explicitly; automatic synchronization is not assumed.

Sites self-review applies the architecture checklist: scoped diff/reuse, unchanged dependency direction, real consumers for the single shared copy field, no new runtime/dependency or deep package import, preserved generated output, behavioral tests and documented setup/approval limits. No architecture expansion or new ADR is needed. This implementation self-review preceded the separately requested integrated review recorded below.

Final publication follow-ups for Dimi: accept or revise the four proposed titles, supplied-draft descriptions and existing-SVG favicon treatment. Task/epic acceptance is now recorded below. English-first remains the prior contract. The full black wordmark is reused unchanged for the icon; legibility at tiny sizes/on dark browser chrome is not separately approved and no cross-browser favicon fallback is claimed. Final Start/About copy and the FS-2.4 operator/current hosting/mailbox facts/legal wording remain publication blockers. The required routes pass technical usability with authorized readable drafts; Dimi's explicit closure accepts that bounded static checkpoint without certifying legal completeness. Current legal gaps are not moved to FS-5.5; future form/provider privacy finalization remains FS-5.5.

Validation is local Chromium/emulation, not Safari/Firefox, assistive-technology or physical-device acceptance. No new flag-on production build was performed for this metadata-only change; unchanged FS-2.2 flag-on/off evidence retains its original scope, and current logo regressions run in the default build. No FS-G1, live form, signature scene, game integration, deployment or public-release approval follows. Commit/push are separately authorized by the completion decision below; no PR or deployment is authorized.

## Integrated Codex review and Dimi completion — 2026-09-20

Dimi explicitly requested the complete FS-2.1–FS-2.6 read-only review, then stated:

> FS-2.6 and EPIC 2 are done, update the documentation then commit and push the changes.

**FS-2.6 and EPIC 2 are complete by this decision.** It accepts the bounded static delivery and authorizes committing/pushing this candidate plus closure documentation on `feature/funkspace-minimum-usable`. It supersedes the pending task/epic-acceptance status above and settles bounded-draft checkpoint acceptance. It does not invent final publication copy, individual final metadata/artwork approval, legal facts, a new physical-device test, FS-G1 or public-launch acceptance. The four titles retain their explicit proposal provenance for editorial finalization.

**Integrated technical verdict: PASS for the exact candidate and tested Chromium behavior; no P0–P2 implementation findings.** Review report: [Codex EPIC 2 integrated review](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/epic-2-review/review.md). This was a fresh read-only review pass in the same conversation, not another agent's or human's sign-off. Integrated base `825dae1035bb20858aaf88b6cf87bddf05ae7f5d`; reviewed 65-file patch SHA-256 `fa7083034d3e96fef4b34b1743b25e03c999fc75318a19939f01225103698ef7`; FS-2.6 base `5d0ab6bc1a9a1e72318b584b543cf19a4f594fa0` plus the 15-file candidate. All 507 tracked/candidate fingerprints and Git status were preserved during review.

Fresh reviewer checks passed: bootstrap freshness before generation; tokens/common types/game build/frontend types; **96 files / 1,371 unit tests**; lint; production build `-JcasyLswiEftxyk1df8-`; **88/88 production browser tests in one invocation without retries**; **17/17 production theme-bootstrap tests**; **10/10 additional fresh JS-on/off contexts**. Direct/reload/Back/hash/email/legal/404 journeys, complete static artwork, keyboard/skip focus, unfiltered accessibility, responsive containment and browser errors were checked. A 59-module source traversal, emitted route traces and actual homepage requests verified no game/particle runtime entry; loaded script bytes matched the production output. Workspace game build alone was not used as loading evidence.

**P3 documentation clarification resolved:** technical route readiness, authorized draft acceptance and named legal publication blockers are now separate in this record, FS-2.4 and the feature plan. No source correction or extra acceptance gate was requested. Empty/fake/unusable routes would remain technical blockers; none was reproduced. Current operator identity/address, hosting/logging/retention/recipient/location facts, mailbox handling and approved legal wording remain Dimi/Codex/Sites publication work. Provider-specific future form finalization remains FS-5.5. Known mobile Menu overlap, favicon legibility and missing Firefox/WebKit/physical-device/assistive-technology evidence remain documented limitations.

Before closure, all 15 candidate paths matched the reviewed manifest and no unrelated changes existed. Only these closure documents change after review; source/test/config bytes remain identical to the validated candidate. Formatting, local documentation links, diff scope and candidate hashes are checked before commit; application checks are not relabeled as freshly rerun for documentation-only closure. The Git commit containing this record is the final accepted candidate. Final commit/push and clean-tree evidence are recorded in `artifacts/fs-2.6/closure.md` outside the repository. No PR, merge, provider/DNS change, deployment or live email is authorized.
