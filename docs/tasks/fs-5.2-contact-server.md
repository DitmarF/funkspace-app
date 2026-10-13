# Task FS-5.2 — Validation, contact use case and Resend adapter

## Task metadata

- **Status:** Complete — Codex technical review PASS at `6147688241fa6737de561840ba149c57ea32abb7`, then Dimi explicitly closed FS-5.2 on 2026-10-13. Earlier pending-review/delivery entries below are historical; no separate Sites review result is inferred.
- **Task group or epic:** [EPIC 5](../features/funkspace-minimum-usable.md#epic-5--real-contact-delivery-privacy-and-failure-handling).
- **Owner/current writer:** Codex; Sites checks consumption; Dimi owns final acceptance/external prerequisites.
- **Last updated:** 2026-10-13.
- **Actual implementation base:** `feature/funkspace-minimum-usable`, `5d9ec321b9ec3154b0a2460968ac49b9ceffede3`; clean on initial inspection. The containing Git commit identifies the delivered revision; exact delivery verification is in the artifact below. No reset or overwrite of newer work.
- **Previous task handoff:** [Accepted FS-5.1](fs-5.1-contact-contract.md#handoff), delivered in the base commit, including the no-pending-controls/no-InlineStatus amendment.
- **Related documentation:** [AGENTS](../../AGENTS.md), [architecture](../architecture.md#contact-composition--fs-51), [workflow](../development/ai-workflow.md), [task template](../templates/task.md), [EPIC 5 plan](../features/FunkSpace_EPIC_5_Detailed_Plan.md), [server setup](../development/contact-server.md).

## Requested outcome

Implement FS-5.2 only against the accepted contract: pure shared validation,
application use case, narrow delivery port, server-only Resend HTTPS adapter
and thin Node-runtime POST boundary. Validate with injected fakes and production
bundling, keep live sending disabled and stop before any next task.

### Acceptance criteria from the request

- [x] Actual instructions/architecture/plan/contract/handoff and clean working tree inspected.
- [x] Pure validation and use case keep inward dependencies; browser composition unchanged.
- [x] Streamed byte bounds/fatal decoding/exact fields, normalization, control/injection and length rules implemented.
- [x] Fixed configured identities/subject, structured Reply-To, deterministic plain text and original idempotency identity.
- [x] Verified provider UUID evidence required for acceptance; all frozen failure/uncertain/provider quota/conflict/concurrency outcomes exercised.
- [x] Eight-second deadline includes reading; timers/readers/controllers cleaned up; no automatic retries.
- [x] Missing/invalid configuration fails closed and production release lock prevents live sending.
- [x] Node tests use injected fakes and unexpected-fetch guard; no secret values read or exposed by tooling.
- [x] Focused tests/coverage, strict types/lint and isolated production build/compiled route checks pass.
- [x] Architecture/setup/status/evidence updated with a complete accessible candidate handoff.
- [x] Codex technical review PASS at the delivered revision; no actionable findings. Separate Sites consuming review result is not recorded; Dimi's explicit closure owns task completion.
- [x] Dimi candidate acceptance — explicitly closed FS-5.2 and requested FS-5.3 on 2026-10-13.

## Context and repository evidence

- **Inspected paths:** Root AGENTS (no nested guide), architecture/composition,
  AI workflow/task template, authoritative and detailed feature plans, accepted
  FS-5.1 task/types, existing browser service factory/provider, manifests, Next
  config, TypeScript/Vitest/ESLint setup, README and preview-isolation evidence.
- **Starting behavior:** Only pure contact wire types existed. No server route,
  validator, contact use case or provider adapter. No contact page; navigation
  disabled. Existing Next.js 15.5.24/Vercel path and backend stub preserved.
- **Existing abstractions:** Browser composition stays intact. One bounded
  reader serves the two actual HTTP consumers; no generic messaging framework.
- **Public documentation:** Resend endpoint, errors/idempotency and official API
  schema rechecked; structured `reply_to` is a string. Next handles server-only
  markers internally, so no package/lockfile change is needed. Sources are linked
  in the setup guide; account/provider verification is not claimed.

### Assumptions and open decisions

The 23-hour retry cutoff and edit/draft state belong to FS-5.4's page memory;
the frozen request has no first-attempt timestamp. Server code preserves the
UUID/key/payload and makes no retry or cache. A source-level release lock is
kept closed because this task expressly forbids live sending and deployed/legal
prerequisites remain unverified. Removing it needs separate scoped authorization.

## Scope

### In scope

Domain rules/result/port, application orchestration, server parsing/configuration/
Resend adapter/composition, Node route and method rejection, meaningful controlled
tests, dedicated Node coverage config and setup/architecture/task documentation.
The subsequent user request also authorizes documentation finalization and
commit/push of all 26 intentional FS-5.2 files.

### Out of scope

Contact UI/browser adapter/navigation enabling, limiter/WAF deployment or
process-local counters, legal finalization, account/DNS/firewall/settings changes,
environment values, live mail, merge/deployment and automatic next task.

### Protected areas

Accepted `ContactContract.ts`, homepage/scene, controls/assets/tokens, existing
browser services and game code unchanged. Synced project sources and original
Downloads plans untouched. Builds do not overwrite running preview output.

## Planned changes

| Area                  | Actual paths / change                                                                                                 | Boundary                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Domain                | `ContactValidation.ts`, `ContactResult.ts`, `ports/ContactDeliveryPort.ts`; validation tests                          | Pure shared rules and safe typed outcomes                   |
| Application           | `contact/SubmitContact.ts` and tests                                                                                  | Domain-only dependencies, injected delivery                 |
| Server infrastructure | `contact/BoundedJson.ts`, `ContactConfiguration.ts`, `ContactRequestHandler.ts`, `ResendContactDelivery.ts` and tests | Platform/network effects and safe parsing                   |
| Composition / route   | `services/createContactServerServices.ts`, `app/api/contact/route.ts` and tests                                       | Server-only construction, closed release lock, Node entry   |
| Tests                 | `tests/contact/fixtures.ts`, `vitest.contact.config.ts`; test-only alias in `vitest.config.ts`                        | Node isolation, denied unexpected fetch, dedicated coverage |
| Documentation         | Architecture, README, feature-plan status/detail, server setup and this record                                        | Durable boundaries and review handoff                       |

### Implementation sequence

Inspect accepted baseline → pure validation/port/use case → bounded server adapters
and composition → Node tests and cleanup → isolated production build/smoke →
documentation/diff review and candidate packaging. No external configuration.

## Dependencies and risks

- **Internal:** Accepted FS-5.1 types, Next's existing server-only support and native Node Request/Response/fetch.
- **External:** None added; Resend is a future live HTTPS dependency, currently tested with fakes.
- **Risks:** Syntax is not sender/account/mailbox verification. Lost transport
  may still have sent mail. Provider key retention does not promise exactly once.
  Cross-deployment configuration/payload changes need a retry-window migration.
- **Mitigations:** Source release lock independent of environment, strict origin/
  request/response bounds, no retries/redirects/content logs, honest uncertainty;
  actual protection/legal/preview gates before enabling. No global send cap claimed.

## Validation plan

Explicitly run the dedicated contact suite/coverage because broad coverage excludes
these layers. Check strict frontend types, affected lint/format, existing suite
and actual production server bundling. Use an isolated source snapshot without
environment files/credentials and with fetch denied; clean up the owned smoke server.

### Manual and automated checks

Inspect no client/server import leakage, unchanged accepted contract and fixed
mail fields, resource cleanup paths, exact response/envelope pairing, complete
untracked diff, local documentation links and actual branch/base. Independent
review and device/visual acceptance remain separate.

## Completion record

- **Outcome:** FS-5.2 implementation candidate delivered locally for review; sending stays locked off. FS-5.3–FS-5.6 not started.
- **Files changed:** Areas above; complete file list/diff in the candidate artifact.
- **Acceptance evidence:** Pure-rule/use-case/adapter/request/configuration/composition/route tests, denied-fetch guard, dedicated coverage and ten compiled-route HTTP checks.
- **Validation results:** 177 contact tests PASS across seven Node files; dedicated coverage PASS (97.65% lines, 96.90% branches, 97.42% statements, 85.71% functions). Validator/use case/Resend adapter/configuration have full measured coverage. Closed composition has intentionally unexecuted release/credential branches; no coverage exemption added. Full strict frontend types and focused lint PASS. Final broader suite PASS: 130 files/2,083 tests, including all contact regressions. `pnpm typecheck:validation` also PASS. Local link/anchor, dependency, source/build equality and scope checks PASS; final check evidence is in artifact `checks.txt`.
- **Build:** Isolated HEAD-plus-runtime-diff `pnpm build` PASS, Next 15.5.24, Node 22.22.0/pnpm 10.30.3; build ID `ERhqTvL3B_545QOlesBCu`. Dynamic `/api/contact` bundles successfully. Ten loopback HTTP checks PASS (valid disabled request, exact/excess byte limits, field error, malformed JSON/UTF-8, origin/media and method rejection); temporary server stopped/reaped. Static client bundles contain no Resend endpoint, API key/configuration name or server adapter reference.
- **Corrections/limitations:** First strict types found union-spread and test-fixture typing errors, corrected. Initial coverage could not write the sandboxed repo output, resolved with a private temporary report directory. The first build-snapshot preparation hit the host Python tar API mismatch; fixed before the successful isolated build. Self-review tightened trailing-newline UUID/configuration checks and explicitly allowlisted public error fields, with regressions. No exception lowered thresholds or enabled live mail.
- **Remaining work:** External account/legal/sender/origin/protection/preview gates. Browser/UI/23-hour page retry cutoff belongs to FS-5.4. The later Codex PASS and Dimi closure below complete FS-5.2 without inventing a separate Sites result.

### Documentation finalization and authorized Git delivery — 2026-10-13

Dimi requested: “update the documentation; then commit and push all changes”.
This authorizes the 26-file FS-5.2 candidate and its documentation refresh; it
does not close FS-5.2 or record a review/acceptance result. The remote branch
and local HEAD both matched the implementation base before delivery.

All 26 files matched the original candidate manifest before finalization.
Only this record and the two feature plans changed during finalization;
runtime/test/configuration files remain identical to the tested candidate.
The completed contact/full-suite/type/lint/build evidence therefore applies.
Formatting, local links, scope, runtime/build equality and complete patch
checks are repeated for the final delivery; no application rebuild is needed
for this documentation-only refresh. The original candidate artifact remains
preserved, with a separate final patch/manifest and Git delivery verification.

### Technical review and Dimi closure — 2026-10-13

Read-only Codex review inspected the actual repository at
`6147688241fa6737de561840ba149c57ea32abb7`, with a clean working tree. It
returned PASS without actionable FS-5.2 findings: 177 contact tests, frontend
types, focused lint, formatting and diff checks passed; all ten runtime files
matched the production-tested snapshot. Official provider schema/errors/
idempotency documentation was rechecked. No live sending or edits occurred.
Dimi then explicitly stated “FS-5.2 are done” and authorized FS-5.3 local work.
FS-5.2 is complete; external/live gates remain separate. This decision creates
no Sites, visual/device, deployed-protection or mailbox-receipt PASS and grants
no Git delivery permission for subsequent FS-5.3 changes.

## Handoff

- **Actual repository / previous task:** `/Users/dimi/Projects/funkspace-app`; accepted FS-5.1 record linked above is accessible and its wire contract unchanged.
- **Base/delivered revision:** Implementation base `5d9ec321b9ec3154b0a2460968ac49b9ceffede3`, branch `feature/funkspace-minimum-usable`. Use the containing commit and fresh `git rev-parse HEAD`/status checks for the actual delivered revision; final artifact `delivery.txt` records the full commit and remote verification after push.
- **Accessible candidate:** Original `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.2-2026-10-13/` preserves the tested candidate. Final `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.2-delivery-2026-10-13/` contains the complete 26-file `fs-5.2.patch`, checksum, file manifest, checks and Git delivery evidence. Review the actual delivered repository or matching final artifact; regenerate if changed.
- **Contract:** Exact accepted five-string JSON POST, limits/normalization and error envelopes, verified acceptance only, fixed deterministic plain-text mail/Reply-To, unchanged provider idempotency key, no retries, eight-second whole-exchange deadline; no public provider ID or raw error.
- **Receiving-chat access:** Verify branch/HEAD/status and read this record, detailed plan, contract and actual diff before review. A separate Sites workspace must prove matching base and candidate contents; working files are not automatically shared. This chat has actual local access; no other chat's access is inferred.
- **Review provenance:** Author implementation checks followed by the read-only Codex technical PASS and Dimi closure above. No separate Sites review, actual account configuration, mailbox receipt or physical-device result is claimed.
- **Stop boundary:** FS-5.3 is separately authorized for local work after closure. Earlier Git delivery permission does not extend to it; no merge, deployment/settings or live sending is authorized.
