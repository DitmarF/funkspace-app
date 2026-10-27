# Task FS-5.6 — Independent contact verification and controlled acceptance

## Task metadata

- **Status:** Blocked for external acceptance — local preparation complete. This is not overall FS-5.6 completion.
- **Task group or epic:** [EPIC 5](../features/funkspace-minimum-usable.md#epic-5--real-contact-delivery-privacy-and-failure-handling).
- **Owner:** Codex independent integration/security review; Sites owns bounded presentation findings; Dimi owns external action, processing-copy and final mailbox acceptance.
- **Last updated:** 2026-10-27.
- **Actual base:** `/Users/dimi/Projects/funkspace-app`, `feature/funkspace-minimum-usable`, `ad2e98e1ff433c9d5942692bc722f0198ba12b46`; clean at inspection. No reset or newer work overwritten.
- **Previous handoff:** [FS-5.5 closure](fs-5.5-legal-presentation.md#dimi-acceptance-and-fs-55-closure--2026-10-15), contained in this base. Actual source/intentional changes are accessible locally; chats do not automatically share working files.
- **Related documentation:** [AGENTS](../../AGENTS.md), [architecture](../architecture.md#contact-composition--fs-51), [workflow](../development/ai-workflow.md), [task template](../templates/task.md), [detailed plan](../features/FunkSpace_EPIC_5_Detailed_Plan.md), [operations](../development/contact-operations.md), [acceptance procedure](../development/contact-acceptance.md).

## Requested outcome

Independently verify the complete candidate, make bounded local preparation
changes, run isolated mocked checks and prepare exact protected-preview
acceptance. This request does not authorize Git delivery, deployment, settings
changes or live email. Keep the source release lock false and DMARC unpublished.

### Acceptance criteria from the request

- [x] Inspect actual instructions, architecture, FS-5.1–5.5 evidence, EPIC 4 closure, candidate and working tree before changes.
- [x] Complete independent read-only server/security and browser/UI integration reviews before editing; no blocking server/form finding. Bounded future-activation copy findings assigned to Sites and prepared below.
- [x] Preserve fixed public contract, inward dependencies, credentials boundary, default-off delivery and email fallback.
- [x] Prepare mocked whole-journey coverage and concrete external procedure with separate protection/provider/receipt evidence.
- [x] Record completed focused checks and accessible final candidate artifact; exact results below.
- [ ] Verify exact deployed candidate/configuration, authentication, WAF and every reachable live-enabled alias/path — external; not performed.
- [ ] Dimi reviews conditional activation disclosure and actual account/terms/DPA/tracking/settings — pending; prior FS-5.5 acceptance stands.
- [ ] Separately authorize and perform no more than one controlled live submission; verify provider acceptance, Dimi receipt, headers and shutdown separately — not authorized/performed.
- [ ] Dimi accepts FS-5.6/EPIC 5; only then may FS-G2 be evaluated. EPIC 6 has not started.

## Context and repository evidence

- **Instructions/plans:** Root AGENTS, architecture contact/composition sections, AI workflow, task/feature templates, authoritative/detailed plans, FS-5.1 contract/amendment, FS-5.2 server, FS-5.3 protection, FS-5.4 UI/F1/manual acceptance, FS-5.5 technical/legal closure and FS-4.8 closure.
- **Actual source:** Pure validation/types/result parser, use case/ports, configuration/bounded reader/request handler/Resend/browser adapter/diagnostics, server and browser composition, Node route, form, shared navigation, contact/legal pages, storage adapters and focused test configurations/fixtures.
- **Current behavior:** Literal `CONTACT_DELIVERY_RELEASED = false`; configuration cannot enable sending. Server-rendered disabled fields and `info@funkspace.de` fallback work without JavaScript. No contact draft persistence, queue or automatic retries.
- **Source provenance:** Supplied screenshots and user-reported account actions are evidence with limits, not action permission. [27 October register](../development/contact-operations.md#setup-evidence--2026-10-27) records Resend/DNS/WAF/Preview facts separately from unverified enforcement/settings.
- **Accepted history:** FS-5.1–5.5 and EPIC 4 closure remain intact. No new phone, visual, assistive-technology, deployed-protection or legal certification is inferred.

### Assumptions and open decisions

- **Safe assumptions:** Existing ordinary Button/plain focused feedback and page-memory retry behavior remain authoritative. No new mail/network/runtime dependency is needed.
- **Explicit recipient amendment:** Dimi approved fixed recipient `info@funkspace.de` on 27 October, replacing the earlier Gmail test destination. Sender/payload remain fixed per future approved candidate; no live outstanding retry migration exists.
- **Open decisions:** Actual activation-copy/account review, exact future deployment revision/immutable URL, complete WAF/protection coverage and action-specific external authorization. Deadline Thursday 29 October does not waive these gates.

## Scope

### In scope

Independent review; bounded availability/conditional-processing notices; injected
whole-journey regression test; isolated checks; reconciled setup facts, operating
procedure, task/gate evidence and accessible candidate handoff.

### Out of scope

Unlocking delivery, live sends/replies, deployment/configuration/DNS/firewall or
billing changes, DMARC publication, Git commit/push/merge and EPIC 6.

### Protected areas

- Domain wire contract, validation and server behavior — unchanged.
- Server/client composition and source release lock — unchanged; no credentials read.
- Homepage/scene, shared controls/navigation and games — no implementation changes.
- Accepted Impressum/operator/legal-basis choices and FS-5.5 closure — preserved.
- Synced project sources and original Downloads plan — untouched.

## Planned changes

| Path                                                                                             | Status       | Change                                                                             | Boundary                             |
| ------------------------------------------------------------------------------------------------ | ------------ | ---------------------------------------------------------------------------------- | ------------------------------------ |
| `frontend/app/contact/page.tsx` and `page.test.tsx`                                              | Existing/new | Availability-consistent concise notice, both safe availability cases               | Sites-owned presentation preparation |
| `frontend/app/privacy/page.tsx`, `e2e/contact-legal.spec.ts`, `e2e/portfolio-navigation.spec.ts` | Existing     | Current disabled truth plus conditional future provider flow/disclosure assertions | No new legal decisions or activation |
| `frontend/infrastructure/contact/ContactJourney.test.ts`                                         | New          | Actual browser/HTTP/use-case/provider adapter through injected fakes               | No provider transport                |
| `docs/development/contact-acceptance.md`                                                         | New          | Exact phased acceptance/budgets/shutdown                                           | No external permission implied       |
| Architecture, server/facts/operations and both feature plans                                     | Existing     | Reconcile evidence, recipient amendment and current gates                          | Preserve task ownership/dependencies |
| This task record                                                                                 | New          | Review/check/handoff evidence                                                      | Overall acceptance remains pending   |

### Implementation sequence

1. Inspect clean source and conduct three independent read-only reviews.
2. Prepare bounded Sites-owned notices/tests and cross-layer mocked coverage.
3. Run isolated checks, inspect final diff and publish only a local handoff.

## Dependencies and risks

- **Internal:** Accepted FS-5.1 contract and FS-5.2–5.5 implementations; no dependency/version change.
- **External:** Existing provider/platform/mailbox accounts only; no new service or paid upgrade selected.
- **Risks:** Unknown Preview WAF coverage, old immutable deployments retaining settings, regional/distributed abuse, uncertain provider exchanges and unapproved new processing copy.
- **Mitigation:** Source lock false; credential-free routine tests with egress denial; bounded off-only protection checks first; separate maximum-one-message approval; verified shutdown and actual receipt required.

## Validation plan

Use `/private/tmp/funkspace-fs56-check-2026-10-27`, a tracked-source snapshot plus
intentional changes, with no environment files. A whitelist launcher discards
inherited secrets, blanks mail variables and preloads loopback-only fetch/HTTP
transport denial. Unexpected egress attempts are recorded and fail the evidence
check, even if a caller catches the transport error. Contact fixtures additionally
assert global fetch was never called. No provider/domain/DNS/settings endpoint
is called by routine tests. Dependencies are reused read-only; caches/builds are
owned by the temporary snapshot, not the actual checkout.

Actual commands/results belong to the completion record. The browser config is
a snapshot-only copy of `playwright.contact.config.ts` with unique FS-5.6 result
paths; safety checks and fresh-server behavior are unchanged.

### Manual checks

Existing Dimi phone/accessibility acceptance remains historical. The prepared
procedure covers exact future URL/configuration/protection, off-only WAF/recovery
and separately authorized provider acceptance/receipt. None is marked passed
from local browser simulations.

## Completion record

- **Outcome:** Local candidate preparation complete; external acceptance not executed.
- **Files changed:** The six source/test files and eight documentation files listed above; see candidate manifest for exact paths/hashes.
- **Read-only review:** Server/security PASS at base; UI/browser PASS for disabled candidate. Sites-owned P2 notices prepared without changing shared contracts. Test-isolation audit PASS conditional on the launcher/guard actually used. No blocking implementation finding was hidden or broadly corrected.
- **Validation results:** All final focused checks pass; exact commands/results below. No application behavior was changed to satisfy a stale test.

### Actual commands and results — 2026-10-27

Every command below ran through the credential-free `run-safe.py` launcher in
the isolated snapshot. The artifact preserves the launcher, guard and full logs.

| Command                                                                                                                                                                                                                       | Actual result                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm typecheck:validation`                                                                                                                                                                                                   | PASS, strict application/story/test/config types                                                                                                                                           |
| `pnpm -F frontend exec next lint --max-warnings=0 --file app/contact/page.tsx --file app/contact/page.test.tsx --file app/privacy/page.tsx --file infrastructure/contact/ContactJourney.test.ts`                              | PASS, no lint warning/error; existing Next lint deprecation notice only                                                                                                                    |
| `pnpm exec vitest run --config vitest.contact.config.ts --coverage`                                                                                                                                                           | PASS: 282 tests, 11 files; statements 98.03%, branches 97.61%, functions 86.66%, lines 98.47%; existing thresholds unchanged                                                               |
| `pnpm exec vitest run frontend/features/contact/ContactForm.test.tsx frontend/features/contact/manual/ManualContactSubmission.test.ts frontend/components/Layouts/PortfolioShell.test.tsx frontend/app/contact/page.test.tsx` | PASS: 64 tests, 4 files                                                                                                                                                                    |
| `pnpm build`                                                                                                                                                                                                                  | PASS: tokens/common types/Next production bundling; no real credentials; source lock false                                                                                                 |
| `pnpm storybook:build`                                                                                                                                                                                                        | PASS; existing large-chunk advisories, no build error                                                                                                                                      |
| `pnpm exec playwright test --config playwright.fs56-check.config.ts`                                                                                                                                                          | 108/110 passed initially; two existing navigation assertions expected obsolete pre-FS-5.5 font copy. Navigation worked; Sites updated only those assertions to current semantic disclosure |
| `pnpm exec playwright test --config playwright.fs56-check.config.ts --grep 'secondary-page links'`                                                                                                                            | PASS: both corrected cases, JavaScript on/off. All 110 selected cases now have passing evidence across initial run and focused correction                                                  |
| `pnpm exec playwright test --config playwright.contact-manual.config.ts`                                                                                                                                                      | PASS: 11 static-fixture cases, including held/duplicate input, all states, actual fetch/body 15-second deadlines, 23-hour expiry and narrow/short/landscape at 200% across themes          |
| Changed-file Prettier, local links/anchors, incoming anchors, scope/protected hashes and complete patch review                                                                                                                | PASS; final counts/hashes in artifact manifest                                                                                                                                             |

The first browser startup was blocked from opening its local listening port;
the unchanged safe command then ran with loopback-server permission. No product
failure or external connection was involved. Both owned servers stopped after
their suites. No denied-egress attempt was recorded. No routine test contacted
Resend. Existing phone acceptance is preserved; automated Chromium checks are
not new human/device/legal acceptance.

### Completion limits

- **Deviations:** External disabled WAF tests may retain Dimi's saved branch key only after source lock/off state/null delivery are proved; local tests remain credential-free. This explicitly supersedes the old blanket key-removal instruction and does not claim key absence.
- **Remaining:** External candidate/protection/configuration/account/copy approval, bounded off-state tests, one separately authorized live test, Dimi receipt/header confirmation, verified shutdown and final acceptance.

## Handoff

Base and branch are recorded above. The final artifact contains a complete patch
(including new files), file hashes, checks and independent review summaries.
The receiving chat must inspect the actual checkout and these intentional
changes; access to this conversation alone is not repository access. Re-run
branch/HEAD/status and compare candidate hashes before external authorization.
The stable URL currently identifies the older deployed base, not this local diff.

Frozen contract usage: exact five-string JSON POST, shared validation, matching
202 only after provider evidence, eight-/fifteen-second deadlines, deterministic
fixed payload and `contact/<submissionId>` key, no automatic retries, unchanged
manual retry identity for under 23 hours, page-memory drafts and any-429 handling.
No contract or delivery-lock file changed.

Dimi's exact final acceptance action is recorded at the end of the
[procedure](../development/contact-acceptance.md#disable-recover-and-accept).
It requires the actual single message/receipt/revision and verified shutdown;
there is no acceptance to confirm yet. The next external authorization is the
reviewed **delivery-off protected Preview** and its explicitly bounded checks,
not live email or production rollout.

## Authorized Git delivery — 2026-10-27

After reviewing the local preparation handoff, Dimi explicitly instructed:
“Okay, commit and push all the changes.” This authorizes delivery of all fourteen
FS-5.6 candidate files on `feature/funkspace-minimum-usable`. The containing
commit identifies the delivered revision; the local handoff artifact records
the push result, remote revision and working-tree check.

The source release lock remains false and DMARC remains unpublished. A branch
push may trigger Vercel's existing Preview automation; no deployment result is
inferred from Git delivery. Explicit deployment/settings changes, deployed
firewall requests and live email still need their own authorization. FS-5.6,
EPIC 5 and FS-G2 acceptance remain pending; EPIC 4 stays closed.
