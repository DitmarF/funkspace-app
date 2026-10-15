# Task FS-5.5 — Technical facts and operating documentation

## Task metadata

- **Status:** Prepared — technical subtask only; FS-5.5 legal/publication acceptance pending
- **Task group or epic:** [EPIC 5](../features/FunkSpace_EPIC_5_Detailed_Plan.md)
- **Owner:** Codex technical preparation; Dimi factual/legal-copy approval; Sites later integrates approved copy
- **Last updated:** 2026-10-15
- **Actual repo/branch/base:** `/Users/dimi/Projects/funkspace-app`, `feature/funkspace-minimum-usable`, `9ba16f8d0ba7dcc5b24ff57383dc8631701b7185`; clean at inspection, actual source access verified, no reset
- **Preceding handoff:** [FS-5.4 phone/accessibility acceptance and preview delivery](fs-5.4-manual-preview.md#handoff), delivered at this base; F1 technical PASS and Dimi's reported manual acceptance retained. [FS-5.3](fs-5.3-contact-protection.md#handoff) has local PASS but no external protection evidence.
- **Related documentation:** [AGENTS](../../AGENTS.md), [architecture](../architecture.md), [workflow](../development/ai-workflow.md), [task template](../templates/task.md), [processing facts/checklist](../development/contact-processing-facts.md), [operations](../development/contact-operations.md), [server setup](../development/contact-server.md)

## Requested outcome

Prepare FS-5.5 technical/operating documentation only from actual implementation
and public provider/platform facts. Re-audit appearance storage and memory-only
contact drafts, describe processing/retention/diagnostics and selected cleanup,
prepare Dimi's factual legal-copy checklist. No live send, external settings,
public legal-copy edits, publication, commit/push or automatic next task.

### Acceptance criteria from the request

- [x] Actual journey, configuration/firewall/logging/legal pages/storage and preceding task evidence inspected.
- [x] Disabled current behavior distinguished from implemented but gated browser → Vercel → Resend → Gmail path, with fields and acceptance versus receipt.
- [x] Public provider retention/location, app/platform/provider logs and selected mailbox policy described without treating public defaults as actual account settings.
- [x] `theme` and `funkspace.motion.preference.v1` defaults/writes/lifetime/removal/failure/tab behavior re-audited; app does not persist contact drafts/keys.
- [x] Environment names only, secure scopes, sender verification, failure/quota, rotation, stable retry payload, disabling, fallback and rollback documented.
- [x] Concise Dimi checklist prepared without invented identity/address/legal basis/retention obligation/agreements or legal certification.
- [ ] FS-5.5 legal-copy approval/publication acceptance — outside this technical-only request and pending.

## Context and repository evidence

The original 2026-10-14 technical audit inspected AGENTS/workflow/templates/
architecture, authoritative/saved EPIC plans,
FS-5.1–5.4 records and actual Node route, configuration/composition, bounded parser,
validator/use case, Resend payload/error/deadline adapter, diagnostic projection,
browser adapter/form, storage/bootstrap/theme/motion services/tests, Privacy/
Impressum and metadata, fonts/scene storage references, tracked Vercel exclusions.
No environment files, live browser storage, provider/Vercel/Gmail accounts or
private log contents were read.

Current source locks delivery off, renders disabled visible fields/fallback and
has no application inbox or deletion automation. Configuration selects fixed
sender/recipient, not a hardcoded proof of actual account identities. Actual WAF,
preview/alias inventory and platform settings have no recorded verification.
Privacy correctly describes `theme` and disabled/no-draft contact, but omits motion
storage and complete hosting/mail facts. Impressum/operator metadata remains draft.

Public official Resend/Vercel/Google sources were checked 2026-10-14 by read-only
audits; critical current Resend GDPR and Vercel variable/rule pages were opened
directly. Sources are linked beside facts, with account status explicitly pending.
Resend pre-signed/signup DPA, provider body logs/backups/trust-safety processing,
Vercel Config/Secret terminology and Preview rule conditions are qualified public
facts, not signed-account/protection findings. Cached older protection snippets
were not substituted for current direct documentation.

### Assumptions and open decisions

- **Safe assumptions:** None about actual accounts/regions/logging/agreements. Selected Gmail fallback and six-month closed ordinary inquiry policy are settled decisions, not evidence of configured or executed processing.
- **Open decisions:** Dimi operator/legal basis/rights/copy approval; actual account/terms/retention/protection evidence; closure/deletion/exception process and separately authorized deployment/live acceptance.

## Scope

### In scope

Seven Markdown paths: existing operations/setup/architecture/plans and new facts/
checklist/task evidence. Link/content/source/scope/formatting validation.

### Out of scope

Runtime/UI/legal-page/metadata changes, external settings/account inspection,
DNS/firewall/billing, secret handling/rotation execution, mail/deployment/publication,
Git delivery and FS-5.6. No consent mechanism or retention automation added.

### Protected areas

All non-Markdown source/config/tests/manifests/generated assets; frozen contact
contract, release lock, accepted homepage/scene/navigation/form, shared storage
services and game boundaries. Both public legal pages remain truthful drafts.

## Planned changes

| Path                                                                                           | Status   | Change                                                     | Boundary                                        |
| ---------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------- | ----------------------------------------------- |
| `docs/development/contact-processing-facts.md`                                                 | New      | Actual flow/data/storage/provider facts and Dimi checklist | Technical input, no legal approval              |
| `docs/development/contact-operations.md`                                                       | Existing | Current-state corrections and operating procedures         | Keep external coverage pending                  |
| `docs/development/contact-server.md`, `docs/architecture.md`                                   | Existing | Link prepared technical/operating facts                    | Runtime unchanged                               |
| `docs/features/FunkSpace_EPIC_5_Detailed_Plan.md`, `docs/features/funkspace-minimum-usable.md` | Existing | Technical-prepared status and current handoff              | Preserve six IDs/leads/dependencies/legal gates |
| `docs/tasks/fs-5.5-contact-operations.md`                                                      | New      | Scope, evidence, limits and handoff                        | Technical subtask only                          |

### Implementation sequence

1. Read actual source and predecessor evidence; independently audit storage/legal and public provider/platform facts.
2. Prepare processing facts/checklist and update current operating procedures/status links.
3. Review docs against source, verify local links/anchors, formatting and Markdown-only diff; record prepared handoff.

## Dependencies and risks

- **Internal:** Reviewed FS-5.1/5.2 contract/server, FS-5.3 local protections/diagnostics and accepted FS-5.4 controlled UI; FS-1.5/FS-2.4 foundations unchanged.
- **External:** Original technical audit used public primary documentation only. The later Workspace follow-up records bounded mailbox/DNS evidence; account agreements/configuration/protection, retention operations and Resend remain unverified.
- **Risks/mitigations:** Future flow mistaken for live (source-lock/current-state distinction); content-free logging assumed across infrastructure (separate Vercel/Resend/Gmail facts); wrong preference defaults (source-specific table); cleanup treated as statutory/provider erasure (selected operator policy and provider delays separated); unsafe rollback/config (old URLs, stable payload and authorization gates).

## Validation plan

Content/source-reference review, official source attribution, local link/anchor
audit, Prettier and git whitespace/scope/base checks. Confirm no non-Markdown
changes and source lock unchanged. No application build, tests/server or live
probe is needed for this documentation-only task; preceding tests retain their
original candidate/date and are not claimed as fresh runs.

### Manual checks

Read-only inspection of actual behavior and public legal drafts, not proxy phone/
legal/account acceptance. Dimi completes the factual approval checklist later.

## Completion record

- **Outcome:** Technical facts/checklist and operating procedures prepared locally; FS-5.5 legal/publication acceptance remains pending and live delivery disabled.
- **Files changed:** Seven planned Markdown paths above.
- **Acceptance evidence:** Source inventory and independent storage/provider/platform audits; linked code and official facts; names-only configuration and unapplied coverage register; explicit legal checklist.
- **Validation results:** PASS Prettier for all seven Markdown files, 263 local links/anchors, whitespace/base/branch/scope and stage/repo hash checks. Six task IDs/titles/leads/dependency lists preserved. No non-Markdown changes; core runtime/contract, both public legal pages and preference services match actual base byte-for-byte. Names-only operating configuration has no variable assignments. Independent storage/legal-boundary, provider/Gmail-fact and platform/operating reviews PASS within their respective scopes; these are factual reviews, not legal/account/live certification. No application build, unit/browser suite, live probe or account/secret access performed for this documentation-only task.
- **Corrections:** Current operating guide no longer describes the implemented trap/form/429/fallback as future; saved EPIC handoff reconciles Dimi's reported phone/accessibility acceptance. Historical FS-5.3/5.4 evidence remains dated provenance.
- **Remaining:** Dimi identity/legal/copy/metadata/publication acceptance, actual hosting/provider/mailbox agreements/settings/logging, sender/scoped configuration/WAF/all-alias/protected-preview checks and FS-5.6 authorized acceptance/receipt. Delivery remains off; no external action or Git delivery.

## Workspace setup documentation follow-up — 2026-10-15

Dimi separately requested documentation of the verified Workspace aliases,
successful email tests and prepared DMARC record, explicitly keeping DMARC
unpublished and the contact form disabled. This follow-up records operator-led
account setup/manual sends and read-only evidence; it performs no external change.

- **Current revision:** Actual repository/branch/base remain as above. Nine intentional FS-5.5 Markdown changes were present at this follow-up's inspection and preserved; no reset or Git delivery.
- **Recorded facts:** `info@funkspace.de` alias/sending identity; completed receiving/reply/return-reply loop; `dmarc@funkspace.de` alias and successful receipt; outbound SPF/DKIM PASS for `funkspace.de` with selector `google`. Evidence levels and source links are in the [operating record](../development/contact-operations.md#workspace-aliases-and-prepared-dmarc--2026-10-15).
- **DMARC boundary:** The screenshot shows the exact prepared `_dmarc` TXT, TTL 60, no priority, `v=DMARC1; p=none; rua=mailto:dmarc@funkspace.de`, with Add unclicked. Fresh read-only queries to both authoritative Vercel nameservers returned no DMARC TXT. No DMARC PASS or publication is claimed; a later publication needs specific authorization after the recommended SPF/DKIM interval.
- **Files changed in this follow-up:** `docs/development/contact-operations.md`, `docs/development/contact-processing-facts.md`, `docs/development/legal-copy-draft.md`, this record and `docs/tasks/fs-5.5-legal-presentation.md`. Other existing documentation changes are preserved.
- **Protected outcome:** No public address, recipient/configuration, legal page, source lock, UI/test or runtime edit. The testing Gmail fallback remains; Workspace tests do not invoke Resend or constitute FS-5.6 acceptance. No account agreement, retention cleanup, deployed WAF/preview or legal acceptance is inferred.
- **Validation:** PASS 313 local links/anchors across all nine intentional Markdown paths, Prettier for the five updated documents, whitespace/base/branch/scope and 16 protected-source hashes. The four other pre-existing document hashes are preserved. Independent factual/scope review PASS with historical-audit wording clarified. Exact checks and candidate hashes are in the follow-up artifact below. No application build/test suite for Markdown-only edits; DNS reads and Dimi's earlier manual mailbox tests are separate evidence.

## Documentation finalization and authorized Git delivery — 2026-10-15

Dimi explicitly authorized committing and pushing **all current FS-5.5
documentation changes**, while keeping DMARC unpublished and the contact form
disabled. This supersedes the original technical-only request's Git restriction
for these nine Markdown paths only:

- `docs/architecture.md`
- `docs/development/contact-operations.md`
- `docs/development/contact-server.md`
- `docs/development/contact-processing-facts.md`
- `docs/development/legal-copy-draft.md`
- `docs/features/FunkSpace_EPIC_5_Detailed_Plan.md`
- `docs/features/funkspace-minimum-usable.md`
- `docs/tasks/fs-5.5-contact-operations.md`
- `docs/tasks/fs-5.5-legal-presentation.md`

The actual parent revision remains
`9ba16f8d0ba7dcc5b24ff57383dc8631701b7185` on
`feature/funkspace-minimum-usable`; the remote branch advertised that same
revision before delivery. The containing Git commit identifies the documentation
candidate. Final commit/push/upstream and clean-tree evidence is recorded in the
delivery artifact below; do not infer delivery from authorization alone.

All nine documents passed Prettier and the combined candidate passed independent
read-only factual/scope review. Final link/anchor, whitespace, Markdown-only scope
and protected-source checks accompany the artifact. No application test/build is
needed for documentation-only delivery, and earlier test evidence keeps its
original date/candidate. No provider, account, secret, DNS/firewall, merge,
deployment or mail action is authorized here. The latest recorded authoritative
DNS checks found no DMARC TXT; no publication is scheduled. The literal source
release lock remains false and the testing-Gmail public fallback is unchanged.
FS-5.5 legal/publication acceptance, external prerequisites and FS-5.6 remain pending.

## Handoff

Actual repository/branch and parent base are above; after authorized Git delivery,
the containing commit identifies the FS-5.5 documentation revision.
Previous delivered task is `9ba16f8d0ba7dcc5b24ff57383dc8631701b7185`; receiving
chats must verify actual source access, HEAD/status and matching diff/artifact.
Chats do not automatically share working files. No secret values or actual account
documents are transferred. Frozen contract/runtime unchanged; technical subtask
prepared does not close FS-5.5 legal/publication acceptance or authorize FS-5.6.

Accessible patch/manifest/checks:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.5-technical-2026-10-14/`.

Latest Workspace/DMARC documentation delta, combined candidate patch, manifest and checks:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.5-workspace-mail-2026-10-15/`.

Latest complete documentation candidate and authorized Git-delivery evidence:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.5-git-delivery-2026-10-15/`.
