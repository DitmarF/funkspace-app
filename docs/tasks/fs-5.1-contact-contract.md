# Task FS-5.1 — Preserve the plan and freeze the contact contract

## Task metadata

- **Status:** Complete — Dimi accepted the consuming contract and explicitly closed FS-5.1 on 2026-10-13 after resolving the consumer finding by excluding pending Button/InlineStatus presentation.
- **Task group or epic:** [EPIC 5](../features/funkspace-minimum-usable.md#epic-5--real-contact-delivery-privacy-and-failure-handling).
- **Owner/current writer:** Codex. Sites is the receiving consumer reviewer; Dimi owns final acceptance and external prerequisites.
- **Last updated:** 2026-10-13.
- **Actual preparation base:** `feature/funkspace-minimum-usable`, `2c545cd7cb3bc074a126fffa61166577f113cc7b`, clean on initial inspection; same as supplied historical baseline. Closure-time `git ls-remote` confirms the remote branch at that base before the authorized commit/push. No reset performed.
- **Previous handoff:** [FS-4.8/EPIC 4 closure](fs-4.8-scene-acceptance.md#fs-48-and-epic-4-closure--2026-10-13). EPIC 4 stays complete.
- **Related documentation:** [AGENTS](../../AGENTS.md), [architecture](../architecture.md), [AI workflow](../development/ai-workflow.md), [task template](../templates/task.md), [feature template](../templates/feature-plan.md), [EPIC 5 detail](https://github.com/DitmarF/funkspace-app/blob/07a75a713242a0b6b4d8fde336856b13a8033e44/docs/features/FunkSpace_EPIC_5_Detailed_Plan.md), [FS-0.5](fs-0.5-product-and-technical-decisions.md), [FS-1.5](fs-1.5-essential-form-primitives.md), [FS-2.4](fs-2.4-contact-footer-and-legal-structure.md).

## Requested outcome

Preserve the EPIC 5 detailed plan in the repository, link it from the authoritative feature plan and freeze a precise pure contact UI/server contract. Stop after FS-5.1; no delivery, validation or form implementation. The initial request authorized local preparation only. Dimi's later request accepts the consuming contract, removes pending Button/InlineStatus consumption, closes FS-5.1 and specifically authorizes committing/pushing its changes. Historical documents remain reference, not action permission.

### Acceptance criteria from the request

- [x] Inspect actual branch/revision/working tree, instructions, plans, task evidence and actual contact/navigation/legal/composition code; preserve newer/unrelated work.
- [x] Save the decision-complete detailed plan, source provenance and authoritative link, preserving six task IDs, ownership, dependencies and acceptance gates.
- [x] Freeze exact request strings, normalization/limits, typed envelopes/error codes, acceptance semantics, deadlines, deterministic payload/idempotency/manual retry behavior and in-memory draft/key policy.
- [x] Document separate server-only and existing browser composition, default-off configuration names without values, privacy/operating gates and proposed platform protection.
- [x] Check current official provider/platform documentation and distinguish actual facts from unverified account/settings/legal decisions.
- [x] Validate content, local links/anchors, formatting, dependency consistency, types and the final intentional diff; actual outcomes recorded below.
- [x] Provide actual base, changed files, accessible diff and receiving-chat access protocol.
- [x] Read-only Sites consumer review recorded against the actual candidate; its P2 duplicate-announcement finding resolved by Dimi's explicit presentation amendment, with review limitations retained below.
- [x] Dimi final acceptance — consuming contract accepted and FS-5.1 explicitly closed on 2026-10-13.

## Context and repository evidence

- **Inspected instructions/plans:** Root AGENTS (no nested AGENTS found), full AI workflow and templates; relevant architecture sections including browser composition; authoritative feature plan current amendments and EPIC 5/gates; FS-0.5, FS-1.5 and FS-2.4 records; EPIC 4 closure. Supplied Downloads plan read as reference, original SHA-256 recorded in the saved plan.
- **Inspected code/configuration:** `frontend/app/page.tsx`, `about/page.tsx`, `privacy/page.tsx`, `impressum/page.tsx`; contact content and shared destinations/navigation; header/tree/footer navigation and shell; `createServices`, `ServiceProvider`; appearance services/storage keys; package manifests, frontend TypeScript and Vitest coverage configuration; existing contact/legal E2E expectations.
- **Baseline behavior:** No contact page/endpoint/domain/use case/provider adapter at the preparation base. Homepage has Start/About only; Contact is disabled in shared header/tree data. Legal pages expose supplied Gmail email fallback and explicit drafts. Next.js is 15.5.24; existing backend is a stub. FS-5.1 adds only the pure typed contact contract.
- **Constraints:** Preserve inward dependency direction, shell/scene/navigation behavior and generated outputs. No source-sync edits, secrets, dependencies or runtime behavior changes.
- **Outdated guidance reconciled:** Parent provider/fields decisions were still provisional; current request settles them. Past homepage Contact and previous commit/push permission are historical. Saved reference plan's Plan-mode/save-pending claims and earlier verification claims are not carried forward as current evidence.

### Assumptions and open decisions

- **Safe assumptions:** Optional pure typed artifact is useful to later server/UI consumers; no speculative port or generic framework. The proposed server root documents the approved bounded Next.js contact path; it does not implement it or claim independent review.
- **Open decisions:** Actual account eligibility/configuration, verified sender DNS records, protection coverage, signed terms/DPA and complete operator/legal facts. Named owners and latest gates are in the detailed plan; no local implementation choice remains hidden behind these external prerequisites.

## Scope

### In scope

Detailed plan, authoritative decision/status/link amendments, documented composition, one pure contract and this task evidence/handoff.

### Out of scope

Validation logic, ports/use case/adapters, environment values, handler, page/form/navigation enabling, final legal copy, provider/account/DNS/firewall changes, live messages, merge/deployment or next-task implementation. Commit/push of these five FS-5.1 files is separately authorized by Dimi's closure request.

### Protected areas

- `frontend/app/`, `frontend/components/`, existing browser composition, styles/tokens/assets and game packages — accepted runtime behavior unchanged.
- Synced project `sources/` and original Downloads plan — read-only references, untouched.
- EPIC 4 acceptance and FS-G2/publication gates — no reopened or fabricated acceptance.

## Planned changes

| Path                                              | Status   | Change                                                  | Reason                               |
| ------------------------------------------------- | -------- | ------------------------------------------------------- | ------------------------------------ |
| `docs/features/FunkSpace_EPIC_5_Detailed_Plan.md` | New      | Preserve/reconcile plan and freeze detail               | Recoverable EPIC 5 decisions         |
| `docs/features/funkspace-minimum-usable.md`       | Existing | Link detail and update current contact decisions/status | Sole milestone authority             |
| `docs/architecture.md`                            | Existing | Document planned server/browser composition boundary    | Explicit construction responsibility |
| `frontend/domain/contact/ContactContract.ts`      | New      | Pure request/result/HTTP types and limits               | Shared consuming contract only       |
| `docs/tasks/fs-5.1-contact-contract.md`           | New      | Task-template evidence and handoff                      | Review/continuation provenance       |

### Implementation sequence

1. Inspect local baseline/code and reference plan; verify official documentation.
2. Save/reconcile detail, public types and authoritative composition/decision amendments.
3. Run narrow checks, self-review and produce complete uncommitted patch, including new files.

## Dependencies and risks

- **Internal:** FS-0.5, completed FS-1.5 and FS-2.4; existing shell/composition. All six task dependency gates retained, including FS-5.4/5.5 foundation dependencies from parent plan.
- **External:** No installed dependency or provider/platform action. Authorized Git delivery is separate from Resend/Vercel setup; account/legal/protection facts still require actual review before enabling.
- **Risks/mitigations:** Typed interfaces are not runtime validation; no live readiness inferred. Ambiguous delivery and provider key/payload changes stay explicit. Regional WAF limits do not guarantee a global send cap. Default off and named external gates prevent a planning document from claiming safe delivery.

## Validation plan

Use focused Prettier checks on the five changed files; full frontend strict type check with incremental writing disabled; focused ESLint on the pure TypeScript file; a read-only document/contract audit and final diff review. No build, Storybook, unit/browser suite, account check or live mail needed for inert types/documentation. Broader behavioral checks belong to their separately authorized tasks.

### Manual checks

1. Resolve relative links and fragments in the new docs and changed documentation hunks; identify inherited broken links separately.
2. Compare the contract's exact keys, limits, HTTP codes and field errors to the frozen prose and supplied request.
3. Confirm all six lead/counterpart/Dimi/dependency/acceptance gates and FS-G2 remain consistent.
4. Review the complete patch including untracked files; ensure no protected runtime file/secret/external state changed.

## Completion record

- **Outcome:** FS-5.1 complete by Dimi's explicit acceptance/closure, including the no-pending-controls/no-InlineStatus amendment. FS-5.2–FS-5.6 not started.
- **Files changed:** The five paths in Planned changes; no runtime entry point added or modified.
- **Acceptance evidence:** Frozen tables and `ContactContract.ts`; source hash/provenance; current parent decisions and composition paragraph; public-document facts with dated official source links and separate unverified settings register.
- **Validation results:** PASS `pnpm -F frontend exec tsc --noEmit --incremental false`; PASS `pnpm exec prettier --check` for all five changed files; PASS `pnpm -F frontend exec eslint domain/contact/ContactContract.ts --max-warnings=0`; PASS `git diff --check`. Read-only audit resolves 30 new/changed local links/fragments, preserves six IDs/leads/counterpart/Dimi/acceptance gates and every original dependency, checks all typed keys/codes against prose, and confirms exactly five intentional files with no contact page/handler or protected runtime changes. Self-review is not independent review. No application/Storybook build, unit/E2E suite, account inspection, deployment, DNS/firewall mutation or live email performed.
- **Deviations:** Reconciled source rather than verbatim archive, removing obsolete session-status/evidence assertions. External account/DNS bullets preserved as owned prerequisites, not performed under local-only scope. Minimal types only; validator/port creation deferred.
- **Remaining work:** Dimi-owned actual provider/hosting/terms/legal/sender/protection prerequisites before live enabling, and separately authorized later implementation tasks. No final legal completeness, new independent security approval or visual/device acceptance claimed.

## Consumer review, Dimi amendment and FS-5.1 closure — 2026-10-13

The user-invoked read-only Sites consumer review accessed `/Users/dimi/Projects/funkspace-app` on the actual branch/base above and confirmed the five-file candidate matched the complete patch (SHA-256 `57c2c6592b10d34bd1c410292de37a73964b8f8a47a014b31a89c78dde0a0fb6`). It inspected the plan/typed contract and actual fields, errors/status, Button, links, shared navigation and responsive shell. Wire outcomes, retry rules, non-JSON 429 handling, unavailable configuration and no-JavaScript email fallback were compatible. The review reported one P2: `Button.pending` adds a “Working…” status region, duplicating `InlineStatus`'s planned pending announcement. It did not issue an unqualified PASS or claim builds/tests, visual/device acceptance or independent security review.

Dimi then explicitly decided to use neither pending buttons nor the status primitive for contact, accepted the consuming contract, declared FS-5.1 done and requested commit/push. This supersedes the review's suggested InlineStatus-only option and resolves the finding by removing both contact-specific consumers. The shared primitives and wire types remain unchanged. Submission guards, read-only in-flight fields, deadlines, preserved drafts and honest outcome feedback still apply; ordinary field/result text and focus provide feedback without pending presentation or a live-status primitive. No additional counterpart PASS or physical-device result is invented from this acceptance.

The accepted scope is the five paths above, with the four documentation files updated for this decision. Dimi's Git delivery authorization covers this bounded task only; merge, deployment, provider/account/DNS/firewall changes, live messages and FS-5.2 remain separate requests.

**Closure validation:** Focused Prettier, new/changed local link/anchor audit, six-task ownership/dependency/gate audit, typed-contract/prose consistency, exact five-file scope and `git diff --check` all PASS. Initial strict types and focused ESLint evidence still applies to the unchanged contract. No application builds or new behavioral tests are needed for the documentation amendment. Remote branch verified at the preparation base before commit/push; the delivery artifact records the resulting commit and remote confirmation.

## Handoff

- **Repository actually read/written by this chat:** `/Users/dimi/Projects/funkspace-app`; origin `https://github.com/DitmarF/funkspace-app.git` verified locally and remote branch checked before authorized delivery.
- **Preparation base / delivery revision:** `2c545cd7cb3bc074a126fffa61166577f113cc7b`, branch `feature/funkspace-minimum-usable`. The containing FS-5.1 commit owns the accepted five-file delivery revision; use Git history/current HEAD and the delivery artifact rather than treating the preparation base as the new tip.
- **Previous task:** Completed FS-4.8/EPIC 4 closure linked above; preserve accepted homepage/scene.
- **Accessible artifacts:** The initial consumer-reviewed patch remains at `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.1-2026-10-13/fs-5.1.patch` as historical evidence. The closure-amended complete patch/checks and delivery revision are recorded under `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.1-accepted-2026-10-13/`. Use the accepted artifact or containing commit for continuation, not the earlier review patch.
- **Receiving chat access gate:** The consumer review above proved access to the actual local candidate. Every future separate chat/workspace must verify branch/HEAD/status and read this record, the detailed plan and `ContactContract.ts`; compare to the accepted commit/patch. A different Sites workspace must verify the same delivered branch/revision and contents; chats do not automatically share files. Do not infer a new chat's access from this review.
- **Frozen contract:** One exact five-string JSON POST; 32 KiB streamed body, 100/254/5,000 string-unit limits, UUID v4/empty trap; typed HTTP envelopes; matched `202` acceptance only; all HTTP `429` recognized; 8 s/15 s deadlines; deterministic fixed-header plain text, `contact/<submissionId>`; manual unchanged retry under 23 h, edits new key, memory only; default off and server-only secrets/composition.
- **Checks:** See Completion record and `checks.txt`; no application builds or live provider/account calls.
- **Next action:** FS-5.1 is closed. Await a separately scoped FS-5.2 request; preserve the accepted contact presentation amendment and all external prerequisites. The current request authorizes only FS-5.1 documentation finalization and Git delivery, not subsequent implementation, merge, deployment/settings or live mail.
