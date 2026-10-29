# FS-6.3B — UI-REL-01 metadata correction

- **Status:** Technical description corrected; UI-REL-01 remains partially open for final title/icon/canonical and target decisions. Ready for Codex consolidation and independent 6.3C review; no release or human-acceptance closure.
- **Owner:** Sites counterpart; Codex owns the main findings register and integration review; Dimi owns final publication copy and identity decisions.
- **Date:** 28 October 2026, Europe/Berlin.
- **Scope:** The technical-description part of UI-REL-01 only. No scene, navigation, theme, motion, contact, legal, game or dependency correction was assigned by this change.

## Source and access

Actual repository: `/Users/dimi/Projects/funkspace-app`, `feature/funkspace-minimum-usable`, HEAD `6ad9c98f4b255b83a00f081c89b4b7acd757921b`, tree `a9680a1b225697bada43c025d976c6b67146a0b1`.

At inspection the intentional tracked diff was the existing FS-6.3 register change, SHA-256 `4a237cd239178778b26845e82ec897eeb4c3075622c40405e0648d4412010127`. The untracked [FS-6.2 acceptance record](fs-6.2-human-acceptance.md), SHA-256 `ae9af8d9682ec5f145efd5a1f9a4fe34e0d99aaef44006a11dfdac80d69c83c8`, was preserved. This counterpart did not alter the main [findings register](fs-6.3-acceptance-findings.md), whose input SHA-256 was `1e17fc24fd0d3de97ac27e6d857727da1c7f8d7297fb3df8feb2a5509977728b`.

Read `AGENTS.md`, the current findings and acceptance evidence, relevant source/tests and the complete supplied EPIC 6 plan. The requested `docs/features/FunkSpace_EPIC_6_Detailed_Plan.md` remains absent; the complete Downloads copy SHA-256 is `3bcc8a641b1c1eb3cd46c265037cce7f4936ddf967618a74908a8c1c536496ed`. The existing [FS-2.6 metadata record](fs-2.6-semantics-metadata-and-static-routes.md) preserves the proposal status of final title/icon treatment. The plan assigns final content and target checks to FS-6.4.

The isolated candidate was a fresh Git archive plus the complete intentional diff and untracked acceptance record, with 836 input source files and no `.env` files. Input manifest SHA-256: `b09eb4c83d5afbc8aeb5a5adba7bb35ec52c27fcd715628572819678315a7ff0`. Exact candidate path, input patch, final source hashes, commands, profiles, logs and correction patches are in the separately portable `artifacts/fs-6.3b-ui-rel-01/` evidence. The code-only correction patch SHA-256 is `8b08b93b65a064c593ebad7e25fc7ca12f5b98ebc2382bf05ec52e9d45893675`; the complete handoff diff and manifest are generated after this record so its own hash does not become circular.

## Per-ID result

**UI-REL-01 — Significant / Sites: partially corrected.** The root description rendered the technical sentence “FunkSpace is a design-system-first web experience built as a PNPM workspace.” Two strengthened production homepage checks reproduced that wording, with JavaScript enabled and disabled, before the source correction.

`frontend/data/startContent.ts` now reuses `aboutContent.description` verbatim:

> FunkSpace is my portfolio and creative playground for interface design and interactive web development.

This is Dimi's existing supplied About summary, already used by About metadata; no new product, operator, legal or hosting claim was invented. The existing `startIntroduction` export retains its root-metadata consumer, and the summary is not added to visible Start content. The existing title/icon proposal comment and absence of canonical/social URLs remain intact. Final publication approval of title/icon/description and verification of the canonical target remain open under UI-REL-01; this task does not infer them from the planning default domain.

The static-route regression independently expects the existing About summary in root metadata and rejects `PNPM workspace` in emitted HTML. The Start unit/static tests keep the current metadata summary out of the visible Start section. All existing assertions for native links, local fonts/assets, logo geometry, first keyboard focus, headings, 404 recovery, JavaScript-off behavior and accessibility remain.

**Other Sites IDs:** FS62-SAFARI-01 was closed by Dimi's reported recovery, with its cause unverified; no new Safari scene defect was reproduced or fixed here. UI-DEVICE-01–05 and the navigation/Storybook expectation findings have prior corrections and passing reruns. Missing detailed human evidence is not a newly reproduced UI failure. Codex-owned security, tooling and CI dispositions are outside this correction.

## Isolated validation

Installed with `pnpm install --offline --frozen-lockfile --store-dir /private/tmp/funkspace-fs63a-deps-store` in the isolated candidate. The runner clears inherited configuration and credentials, sets `CONTACT_ENABLED=false`, blanks mail identities/settings, disables telemetry and loads the inspected Node transport guard. The pinned Playwright 1.55.1 Chromium 140 cache was provisioned before browser checks. The OS profile permits only the dedicated test port and the required Chromium profile socket; its owned-port/external-denial self-check passed. Native Node guard self-check also passed.

Every browser invocation started a fresh production server on `127.0.0.1:34457`, base origin `http://localhost:34457`, with `reuseExistingServer=false`. No pre-existing app, acceptance preview or development server was used. No contact submission/provider/mail operation was performed. Test-owned servers were torn down after the runs.

Exact argument arrays, sanitized environment, phase output directories, timings and exit codes are in `commands.jsonl`. Application-related commands ran through `run-safe.py` under the retained macOS OS profile. The temporary `.fs63b-metadata.config.ts` changes only the test launcher/origin/output path and is included in the evidence rather than the repository correction.

| Check                                                                                                                                    | Result and scope                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Baseline `pnpm build`, motion ON                                                                                                         | PASS; baseline runtime source, strengthened test already prepared.                                                                                                                                                                      |
| Baseline `playwright test --config .fs63b-metadata.config.ts e2e/static-route-contract.spec.ts --grep '/ supplies metadata' --workers=1` | **2 expected failures**, both on rendered `PNPM workspace` wording, JS on/off (`baseline-metadata.log`). Retained as reproduction, not a passing application result.                                                                    |
| Corrected `pnpm build`, motion ON                                                                                                        | PASS (`final-build-on.log`).                                                                                                                                                                                                            |
| Focused `vitest run frontend/components/sections/Start.test.tsx`                                                                         | Both tests passed, but command exited 1 because the root configuration enables project-wide coverage and a one-file run could not satisfy its global gate (`start-unit.log`). No thresholds or exclusions were changed.                 |
| `pnpm coverage`                                                                                                                          | PASS: seven native Node tests and 2,266 Vitest tests / 139 files. Statements 88.70%, branches 85.91%, functions 87.25%, lines 90.64%, with existing thresholds preserved (`final-coverage.log`).                                        |
| Affected production browser files: `static-route-contract.spec.ts` and `start-static.spec.ts`, two workers                               | **17/17 PASS** on Chromium. Includes JS on/off direct/reload metadata and native journeys, static Start behavior at emulated mobile/desktop viewport sizes, short 320px/200% text recovery and Axe checks (`final-static-browser.log`). |
| Frontend, validation/e2e and common typechecks                                                                                           | PASS (`final-types.log`).                                                                                                                                                                                                               |
| `pnpm lint`                                                                                                                              | PASS (`final-lint.log`); the existing Next lint deprecation notice remains.                                                                                                                                                             |

## Review handoff and remaining limits

Changed application/test paths are `frontend/data/startContent.ts`, `frontend/components/sections/Start.test.tsx`, `e2e/static-route-contract.spec.ts` and `e2e/start-static.spec.ts`, plus this handoff record. The original intentional register and acceptance-document changes are preserved separately. The main register requires Codex consolidation; no unrelated finding was edited.

Independent source review of the four-file incremental correction found no scope or architecture issue; that review did not itself execute tests. Runtime correction is metadata-only. The unchanged scene, contact, theme, overlay and game contracts retain their earlier evidence within its recorded scope; the 400-case ON/OFF suites, separate OFF build, Storybook, Lighthouse, live-provider and physical-device/Safari/Firefox checks were not rerun for this bounded description change. No fresh whole-site or real-device certification is claimed.

Codex 6.3C should review the exact incremental diff, verify input preservation and incorporate the partial UI-REL-01 disposition. Dimi/Codex still need the final title/icon/public-target decision and target verification before URL-dependent metadata can be set. H01–H10 human completion, H11/H12, final FS-6.3 closure and release approval remain separate. No commit, push, publication, deployment, settings/DNS change, mail activation, live email or game work was performed.
