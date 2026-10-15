# Task FS-5.5 — Approved legal content presentation

## Task metadata

- **Status:** Technical disclosure/input draft prepared; public presentation blocked pending Dimi's facts and approved copy
- **Task group or epic:** [EPIC 5](../features/FunkSpace_EPIC_5_Detailed_Plan.md)
- **Owner:** Sites presentation; Dimi supplies/approves factual legal copy and final legal acceptance
- **Last updated:** 2026-10-15
- **Actual repo/branch/base:** `/Users/dimi/Projects/funkspace-app`, `feature/funkspace-minimum-usable`, `9ba16f8d0ba7dcc5b24ff57383dc8631701b7185`; actual source access verified, no reset
- **Preceding handoff:** [FS-5.5 technical preparation](fs-5.5-contact-operations.md#handoff), seven intentional uncommitted Markdown paths preserved with matching artifact hashes
- **Related documentation:** [AGENTS](../../AGENTS.md), [architecture](../architecture.md), [workflow](../development/ai-workflow.md), [task template](../templates/task.md), [authoritative feature plan](../features/funkspace-minimum-usable.md), [technical facts and approval checklist](../development/contact-processing-facts.md), [operating guide](../development/contact-operations.md), [operator questionnaire and technical-copy draft](../development/legal-copy-draft.md)

## Requested outcome

Integrate Dimi's supplied and approved legal/privacy copy into the existing
Impressum and Privacy pages, metadata and concise contact Privacy notice. Preserve
the accepted UI, fallback and frozen contract; leave final legal acceptance
explicit. No deployment or FS-5.6.

Follow-up authorization: Dimi asked to prepare the missing Impressum/Privacy copy,
identify exactly what information is needed and draft technical disclosures from
verified facts, keeping live delivery disabled. This permits draft preparation;
it is not approval of the resulting text for the public pages.

### Acceptance criteria from the request

- [x] Actual repository access, instructions, predecessor handoff, pages, metadata, contact notice and affected tests inspected.
- [x] Missing approved input identified without inventing operator identity, legal basis, account facts or public legal wording.
- [x] Follow-up: exact operator/account/policy questionnaire, Impressum skeleton, technical Privacy paragraphs and concise contact notice drafted for review from source/public facts.
- [ ] Supplied approved copy integrated; draft placeholders replaced, approved hosting/contact/storage/retention disclosures and concise form notice consistent.
- [ ] Relevant formatting/types/component/build and legal/contact E2E checks run against implemented copy.
- [ ] Dimi's final legal acceptance recorded explicitly after presentation review.

## Context and repository evidence

- **Inspected paths:** [Impressum](../../frontend/app/impressum/page.tsx), [Privacy](../../frontend/app/privacy/page.tsx), [Contact](../../frontend/app/contact/page.tsx), [shell tests](../../frontend/components/Layouts/PortfolioShell.test.tsx), [legal E2E](../../e2e/contact-legal.spec.ts), [route/metadata E2E](../../e2e/static-route-contract.spec.ts), [contact E2E](../../e2e/contact-page.spec.ts), [safe contact test configuration](../../playwright.contact.config.ts), preceding task records/plans and technical checklist.
- **Current behavior:** Both legal pages and descriptions explicitly remain drafts. Impressum lines 23–25 state that operator legal name/postal address have not been supplied. Privacy lines 48–52 already describe an available contact page, disabled form delivery and no browser draft storage; no obsolete no-contact-form statement remains. Contact lines 34–39 link the existing Privacy page. [Server composition](../../frontend/infrastructure/services/createContactServerServices.ts) retains the literal delivery release lock set to false.
- **Relevant constraints:** Integrate approved copy only; technical preparation is not legal-copy approval. Keep ordinary Button/plain feedback, existing shell/tokens/navigation, email fallback and delivery lock. Do not add a compulsory consent checkbox or change provider/legal decisions.
- **Reference audit:** No final approved Impressum/Privacy copy or approval provenance was found in repository documentation/content or the synced historical planning reference. The [technical approval checklist](../development/contact-processing-facts.md#dimi-legal-copy-approval-checklist) is unchecked. [FS-2.4](fs-2.4-contact-footer-and-legal-structure.md) records the earlier instruction to use placeholders until Dimi supplies the information; that is historical reference, not approval of replacement copy.

### Assumptions and open decisions

- **Confirmed operator/purpose facts:** Dimi reports an individual in Germany/Thuringia, presenting only his own hobby projects, with no paid services offered or wanted now. Possible future freelance/company status is not current. These facts are recorded in the review draft; street address is not requested merely to continue drafting. Hobby-site name/address applicability remains open; public accessibility alone is not the §18 MStV test. No final exemption, privacy exemption or legal approval is inferred.
- **Account reports and follow-up, 2026-10-15:** Dimi reports Vercel Hobby deployment to owned `www.funkspace.de`, Workspace Business Starter and sole inquiry access; no listed extra features. Gmail is testing-only. Later screenshots, public DNS checks and Dimi's manual reports establish the tested `info@funkspace.de` alias/sending identity and incoming `dmarc@funkspace.de` report alias. DMARC is prepared and unpublished; SPF/DKIM passed, with no DMARC PASS established. Resend is still planned, without an account; the separate hosting role, actual agreements/retention and deployed protection remain unverified. No code/contact-target migration is authorized or performed here. See the [bounded Workspace evidence](../development/contact-operations.md#workspace-aliases-and-prepared-dmarc--2026-10-15).
- **Safe assumptions:** None about public legal identity, address, legal basis, rights language, actual account/processor settings or approval.
- **Required input:** Complete Dimi-approved legal/privacy text, actual operator identity/contact information as applicable and approved processing/storage/retention disclosures, with clear approval provenance. Resolve whether a postal address is required for the confirmed hobby purpose before requesting it or asserting an exemption. Include any specifically approved contact notice/metadata wording; otherwise derive them faithfully from the approved text within this task. Resolve any conflict with verified current behavior before integration.
- **Open acceptance:** Dimi's final legal/presentation acceptance remains pending even after implementation; no legal certification is claimed.

## Scope

### In scope

Source/reference and test-impact inspection, required-input clarification, the
authorized questionnaire/technical-copy draft and this bounded task/handoff
record. Later public implementation stays within the requested legal/contact
presentation once the approved input is available.

### Out of scope

Inventing missing copy, editing public pages or draft assertions before input,
external account/settings access, live email, deployment, Git delivery and FS-5.6.

### Protected areas

All application code/tests/configuration remain unchanged. The original draft
work preserved the seven preceding technical Markdown changes; the separately
requested Workspace follow-up updates only the records listed below. No operator details are inferred from account,
Git or project names. Existing public drafts remain accurately marked incomplete;
the new non-public review draft is not treated as approved copy.

## Planned changes

| Path                                      | Status              | Change when input is available                     | Boundary                         |
| ----------------------------------------- | ------------------- | -------------------------------------------------- | -------------------------------- |
| `frontend/app/impressum/page.tsx`         | Existing; untouched | Approved operator copy and metadata                | Supplied approved facts only     |
| `frontend/app/privacy/page.tsx`           | Existing; untouched | Approved privacy copy and metadata                 | Current disabled behavior honest |
| `frontend/app/contact/page.tsx`           | Existing; untouched | Approved concise notice and consistent link        | No new consent requirement       |
| Legal/contact/shell tests above           | Existing; untouched | Approved-content assertions and safe checks        | No live provider egress          |
| `docs/tasks/fs-5.5-legal-presentation.md` | New; blocker record | Inspection evidence and receiving handoff          | Does not complete FS-5.5         |
| `docs/development/legal-copy-draft.md`    | New; review draft   | Exact input questionnaire and technical paragraphs | No public copy approval inferred |

### Implementation sequence

1. Completed: verify actual source access and technical handoff; inspect approved-copy availability and current presentation/tests.
2. Completed follow-up: prepare input questionnaire and technical disclosure draft. Public integration remains blocked until Dimi supplies remaining facts and approves complete text matching actual behavior.
3. Pending: update affected assertions, run requested safe checks and record candidate evidence for Dimi's final acceptance.

## Dependencies and risks

- **Internal dependencies:** Reviewed FS-5.1 contract, FS-5.2 server, FS-5.3 local protection/operations, accepted FS-5.4 UI and prepared FS-5.5 technical facts.
- **External dependencies:** Approved legal input and unresolved actual account/terms/logging facts identified in the technical checklist. No external setting is changed by this task.
- **Primary risk:** Removing draft notices could falsely imply legal completeness; describing the future mail chain as live would conflict with the source lock.
- **Mitigation:** Stop presentation changes at the explicit user condition: “If approved facts/copy are missing or conflict with actual behavior, identify the specific blocker; do not complete the text by guessing.” The blocker comes from the requested scope, not a new approval requirement inferred from the Sites skill.

## Validation plan

For this documentation-only draft/record: review source/public facts and legal
input boundaries, then check formatting, local links/anchors, whitespace, actual
base/branch, predecessor technical artifact hashes and absence of runtime changes.
Application checks are pending implementation; no unnecessary build or browser
server is started for an unchanged application.

### Manual checks

The original presentation inspection checked source, metadata and test assertions
only. The later Workspace follow-up records Dimi's manual mailbox tests and
supplied screenshots/headers, plus Codex's read-only public DNS queries. These do
not establish visual/device acceptance, legal certification, complete account
verification or deployed-form/Resend acceptance.

## Completion record

- **Outcome:** Original presentation inspection identified missing approved copy. Authorized follow-up prepares the exact input questionnaire, Impressum skeleton and technical Privacy/contact disclosure draft; public presentation remains blocked. No public legal/contact text or metadata changed.
- **Files changed:** This task record and `docs/development/legal-copy-draft.md`; preceding seven technical documentation changes preserved.
- **Acceptance evidence:** Actual public drafts, unchecked approval checklist, earlier placeholder decision, repository/reference search and re-audited source/public facts. Draft separates actual disabled behavior, conditional enabled path, public provider policies and unverified accounts/legal decisions. Vercel's public DPA Pro/Enterprise scope is explicitly qualified, not assumed to cover Hobby.
- **Operator clarification evidence:** Dimi's supplied Germany/Thuringia, individual, own-hobby-only/no-paid-services facts preserved. Current TLM legal text §18 rechecked; no case-specific exemption determination found. An older TLM educational PDF citing superseded TMG/RStV was not used to settle current applicability. Accepted About/homepage preserved; no company details or address requirement inferred.
- **Account clarification evidence:** Official Vercel/Google/Resend sources rechecked 2026-10-15. Hobby fits stated personal/noncommercial use and published technical capabilities, while actual agreement/WAF/coverage still need review. Workspace Starter's domain-verified retention controls are distinct from Vault and message-age deletion is distinct from the selected closure-based policy. Draft includes a proposed manual due-date workflow, without claiming it is adopted or configured. Resend is a future additional mail provider; current recipient/public fallback still match the unchanged test candidate. The later tested Workspace alias has not been migrated into the application.
- **Public routing limitation:** Web-tool reads of apex/www were unavailable/cache-miss; no conclusion about site uptime, deployed revision or protection was made. The later Workspace follow-up adds public mail DNS checks and a supplied Vercel attachment screenshot; these do not verify the complete web-processing chain. Dimi performed the account/DNS setup and manual mailbox sends; Codex did not operate those accounts or perform a live application send.
- **Validation results:** Documentation formatting, local links/anchors, whitespace/base/scope, prior technical hashes and independent source/provider/legal-input reviews recorded in the current artifact below. Application type/component/build/E2E checks remain pending public implementation, not reported as passing. Some direct EUR-Lex opens were bot-blocked; official indexed text/Commission explanations and official German statutes were used, with no legal certification claimed.
- **Deviations from plan:** Public integration could not start because the request's required approved input is absent.
- **Remaining work:** Dimi supplies operator/account/policy answers and approves complete copy; Sites integrates and validates it; Dimi reviews final legal presentation. A factual unknown remains unknown rather than being filled by a public default. External prerequisites, delivery activation and FS-5.6 remain separately pending.

## Workspace evidence and unpublished DMARC follow-up — 2026-10-15

Dimi requested this documentation update after reporting the complete
`info@funkspace.de` receiving/reply loop and successful receipt at the saved
`dmarc@funkspace.de` alias. The [operating record](../development/contact-operations.md#workspace-aliases-and-prepared-dmarc--2026-10-15)
preserves screenshot/header/public-DNS provenance, the exact prepared Vercel TXT
and the distinction between outbound SPF/DKIM PASS and unverified DMARC PASS.
The prepared form remains unsubmitted; both authoritative DNS checks found no
DMARC TXT. DMARC publication is not authorized by this update.

Five Markdown records are refreshed: the operating guide, processing facts,
legal-copy draft and both FS-5.5 task records. This supersedes their earlier
"Workspace setup not ready" statements without changing public copy/contact
targets or the frozen contract. The nine pre-existing documentation changes are
preserved. Current documentation checks and protected-source evidence accompany
the artifact below. No application build/test rerun or further mailbox send is
claimed. Delivery remains source-locked off; legal/publication acceptance,
retention/account/protection prerequisites and FS-5.6 remain pending.

## Handoff

Actual base/branch above plus nine intentional Markdown changes, including this
record and the non-public technical-copy draft, with the scoped Workspace updates
recorded above. Receiving chats must inspect
actual repository access, HEAD/status and the intentional diff; chats do not
automatically share working files. Runtime, public legal pages, metadata, tests and
delivery-disabled behavior are unchanged. The technical subtask and review draft
are prepared; legal integration/acceptance is not complete.

Initial blocked-inspection patch, manifest and checks:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.5-legal-presentation-2026-10-14/`.

Current draft-preparation patch, manifest, reviews and checks:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.5-legal-draft-2026-10-14/`.

Latest operator/hobby clarification patch, manifest and checks:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.5-hobby-clarification-2026-10-14/`.

Latest account/test-address/Workspace clarification patch, manifest and checks:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.5-account-facts-2026-10-15/`.

Latest verified Workspace aliases/tests and unpublished DMARC patch, manifest and checks:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.5-workspace-mail-2026-10-15/`.
