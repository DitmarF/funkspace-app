# Task FS-5.4 — Contact page and form

## Task metadata

- **Status:** Codex technical review PASS with F1 closed by independent re-review; documentation finalization and commit/push separately authorized. Dimi phone/design/wording/assistive-technology acceptance and external prerequisites remain pending. Live delivery remains locked off.
- **Task group or epic:** [EPIC 5](../features/funkspace-minimum-usable.md#epic-5--real-contact-delivery-privacy-and-failure-handling).
- **Owner/current writer:** Sites implementation, Codex independent technical review/re-review PASS and authorized documentation/Git delivery. Dimi owns pending phone/design/wording acceptance and external approvals.
- **Last updated:** 2026-10-13.
- **Actual implementation/review base:** `/Users/dimi/Projects/funkspace-app`, `feature/funkspace-minimum-usable`, `617f9c8f3103c58f148d54944d64a51a22282683`; clean on initial inspection. The containing commit identifies the delivered revision; exact local/remote verification belongs to the delivery artifact below. No reset or newer-work overwrite.
- **Previous-task handoff:** [FS-5.3](fs-5.3-contact-protection.md#handoff) delivered at this base with subsequent read-only local Codex technical PASS; actual repository/candidate access verified here. External protection remains pending.
- **Related documentation:** [AGENTS](../../AGENTS.md), [architecture](../architecture.md#contact-composition--fs-51), [workflow](../development/ai-workflow.md), [task template](../templates/task.md), [detailed plan](../features/FunkSpace_EPIC_5_Detailed_Plan.md), [UI/phone guide](../development/contact-ui.md), [server setup](../development/contact-server.md), [operations](../development/contact-operations.md).

## Requested outcome

Implement FS-5.4 only in the actual repository: plain `/contact`, shared shell/navigation, accessible fields/focused feedback, honest states/acceptance, page-memory retry identity, visible disabled fields with email fallback and controlled stories/tests/browser evidence. Dimi explicitly requested visible fields in the follow-up amendment below. No publication, live sending, server/provider contract changes or automatic next task.

### Acceptance criteria from the request

- [x] Actual source/branch/base and preceding instructions/contract/evidence verified; no unrelated Sites project created.
- [x] PortfolioShell, semantic tokens and shared field/button/email foundations reused; no decorative scene or new navigation system.
- [x] Contact enabled through shared destination/focus handoff; current-page disabling, Home Start/About and no `/#contact` retained.
- [x] Optional Name, required Email/Message, visible labels/help, autocomplete/email keyboard and shared validation.
- [x] Internal submitting guard/read-only fields; invalid/accepted/rate-limited/unavailable/rejected/uncertain states preserve input.
- [x] Exact matching validated 202 required; no mailbox-receipt promise, timers or production fake acceptance. Any 429 recognized before JSON.
- [x] Unchanged manual retry key/payload, edit-and-restore retirement, 23-hour cutoff, explicit reset, memory-only drafts and unmount cancellation.
- [x] Server-rendered public email fallback; honest no-JS/prehydration/delivery-disabled presentation.
- [x] Controlled stories and meaningful component/adapter/response/E2E checks with a fresh disabled server; stale disabled-Contact assertions updated.
- [x] Narrow/short/landscape, 200% text, themes, keyboard/error focus and static/reduced-motion evidence separated from physical-device acceptance.
- [x] Documentation, accessible complete diff and Dimi phone checklist supplied.
- [x] Codex independent local technical review and F1 correction re-review PASS — not inferred from author QA; no deployed protection acceptance.
- [ ] Dimi physical-phone, assistive-technology and wording acceptance — checklist supplied, not executed by proxy.

### Presentation clarification — explicit user decision

The copied brief mentioned InlineStatus/pending presentation, conflicting with the accepted FS-5.1 amendment. Dimi explicitly answered during FS-5.4: “Keep the accepted amendment: ordinary Button and plain focused field/result feedback; submitting stays internal.” This governs implementation; no silent redefinition or pending/InlineStatus UI.

## Context and repository evidence

- **Inspected paths:** Current instructions/architecture/workflow/templates, feature plans and FS-5.1–FS-5.3 records; frozen contract, validator/use case/server adapter/config/route/lock; client factory/provider; shell/fields/buttons/email/destinations/navigation/focus; Privacy draft, relevant stories/tests and manifests/Next/Vitest/Playwright setup; Sites skill/local preview reference.
- **Starting behavior:** Server contract/protections and closed release lock existed; no /contact/browser form. Header/tree Contact disabled; Home had Start/About only.
- **Reused abstractions:** Existing service composition and shared validation/focus mechanisms. Bounded browser response reading stays browser-local because the existing request/provider reader is server-only. No generic messaging/state framework.
- **Outdated guidance:** Disabled-Contact/no-page assertions and docs updated. Privacy's stale no-form sentence replaced with current disabled/draft-storage facts; legal completeness not claimed.
- **Access:** Actual local source and intentional changes verified. No Sites hosting registration, credentials, synchronization or publishing used for this local-only task.

### Assumptions and open decisions

Default /contact shows visible disabled Name, Email and Message fields, disabled Send message and clear availability text because server availability is false. The public email fallback remains. Full sending behavior is exercised through controlled ports/stories and HTTP responses. Browser tests mock only the safe availability boolean in the exact Contact document; the fresh server remains source-locked off with empty credentials and fetch denied. No production fixture switch/fake adapter. Phone/wording and actual account/platform/legal/live gates remain open.

## Scope

### In scope

Contact page/client form/styles; narrow browser port/adapter and pure response grammar; client composition and shared navigation extension; controlled form/current-page stories, tests/safe browser config; truthful Privacy draft correction; architecture/status/handoff/phone docs.

### Out of scope

Server/provider/public wire contract edits, live enabling/mail, account/DNS/firewall/settings/billing changes, deployment/publication, legal finalization, scene redesign, persistence/dependencies, merge or FS-5.5 work. Documentation finalization and commit/push are separately authorized below.

### Protected areas

`ContactContract.ts`, server validator/use case/adapter/route/composition/diagnostics and operating gates unchanged. Home/scene/navigation handoff internals, tokens/assets/games/manifests/lockfile and synced sources/original plans untouched. Shared Button/fields unchanged. Private build/Storybook snapshots exclude environment files and preserve active preview output; owned test servers stop after checks.

## Planned changes

| Area                    | Actual paths / responsibility                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Domain/browser boundary | New `ContactBrowserResponse.ts`/test and `ports/ContactSubmissionPort.ts`; exact envelope grammar and narrow effects               |
| Browser composition     | New `BrowserContactSubmission.ts`/test; existing `createServices.ts` and `ServiceProvider.tsx` extended through fixture convention |
| Page/form               | New `app/contact/page.tsx`, `features/contact/ContactForm.tsx`/CSS/test/stories; safe availability only                            |
| Navigation              | Existing destination/data/layout assertions/current-page stories; reuse focus handoff                                              |
| Browser checks          | New `e2e/contact-page.spec.ts`, `playwright.contact.config.ts`; affected header/current/scene assertions                           |
| Documentation           | README/layout guide, architecture, server/UI guide, preceding review/task record and feature plans; truthful Privacy sentence      |

### Implementation sequence

Inspect → clarify presentation → pure port/response/native adapter → form/page/navigation → controlled checks/cleanup → isolated builds/browser QA → evidence/phone checklist/artifact. No external setup.

## Dependencies and risks

- **Internal:** Accepted FS-5.1–FS-5.3 rules/types, shell/fields/buttons/composition/navigation. No new dependency.
- **External:** None contacted by routine tests; actual provider/WAF/legal/preview prerequisites required before enabling.
- **Risks:** Duplicate/uncertain delivery, lost drafts, ambiguous edge responses, focus/short-screen recovery, React button reuse and unverified deployed protection.
- **Mitigations:** Synchronous guard, bounded cancellation/deadline, strict identity/envelopes, immutable normalized retry snapshot/conservative sleep-aware cutoff, explicit reset activation cancellation, focused feedback/fallback and closed server lock.

## Validation plan

Dedicated Node contact tests/coverage, focused form/navigation components, full suite, frontend/E2E/story types, affected lint/format/links/scope. Production/Storybook builds in matching isolated snapshots, then fresh credential-free/source-locked/fetch-denied browser server. No live-server reuse or reliance solely on browser interception. Screenshot inspection is not physical-device/assistive-technology certification.

### Manual checks

Inspect dependency/client-server boundaries, accepted states/identity rules, complete diff including untracked files, SSR email actionability and controlled viewport/theme screenshots. Dimi's [phone checklist](../development/contact-ui.md#dimis-phone-checklist--pending) remains pending.

## Completion record

The check counts/build ID below record the initial candidate. The visible-fields
amendment and its fresh verification below supersede the earlier disabled-page
presentation; no prior review or device acceptance is inferred.

- **Outcome:** FS-5.4 local candidate ready for review; default /contact shows visible disabled fields and email fallback with delivery off. No publication, Git delivery or next task.
- **Files changed:** Exact paths/hashes and complete diff in artifact below.
- **Validation:** Dedicated Node suite PASS: 10 files/274 tests; coverage PASS (98.03% statements, 97.61% branches, 86.66% functions, 98.47% lines), unchanged thresholds. Focused form/navigation PASS: 5 files/45 tests. Full suite PASS: 134 files/2,207 tests and icon/theme-bootstrap freshness. Strict frontend, validation/E2E and focused story types PASS; affected ESLint PASS. Final format/link/scope/patch evidence in artifact checks.
- **Build/browser:** Isolated `pnpm build` PASS, Node 22.22.0/pnpm 10.30.3/Next 15.5.24, build ID `I4mIUmQsdWD-V46zbqdH4`. Storybook build PASS. Final Chromium route/navigation/legal/homepage suite PASS: 67 checks; static route suite PASS: 13; supplemental no-JS scene check PASS: one. Contact-only rerun after contrast correction: seven checks. Eighty-one distinct checks across those runs; overlapping contact checks are not counted twice. Desktop emulation: 320×360, 844×390, 390×844; four themes/normal and 200% text/axe; screenshots inspected. Three-run Lighthouse checks on the actual disabled Contact page PASS against existing performance thresholds: all four categories 100, LCP 475–479 ms and CLS zero. Results are local desktop lab measurements; enabled form behavior is covered separately by controlled browser checks. No physical-phone/VoiceOver/TalkBack/Safari/Firefox acceptance inferred.
- **Corrections:** Stale navigation/destination expectations updated. Page mock initially also matched API; narrowed to exact Contact document. Native reset could submit cleared fields during React button reuse; preventDefault fixed it and browser reset passed. Sleep-paused performance clocks could extend deadlines/retry windows; conservative wall/monotonic timing and wake checks now have regressions. Lighthouse found inadequate normal-size Privacy-link contrast in Dark; existing primary-text token fixes that local link, and normal/enlarged checks cover all themes. Storybook shared-cache sandbox error resolved with isolated cache. Story-specific types needed Next ambient declarations and a corrected fixture-map type. Playwright reduced-motion fixture corrected to context options/explicit emulation. ESLint needed its actual frontend flat config; root validation files are checked separately. No threshold lowering or live enabling.
- **Remaining:** Separate Codex counterpart review, Dimi phone/wording, actual account/terms/legal/sender/tracking/scoped config/WAF/all-alias/protected-preview/live gates. FS-5.5/5.6 not started.

## Visible-fields amendment — 2026-10-13

Dimi requested visible fields on `/contact`, a disabled sending action and a clear
availability message, with live delivery still disabled. The earlier email-only
presentation was an implementation choice, now superseded. Name, Email and Message
and the ordinary Send message button remain visible but natively disabled when
unavailable or before hydration, including without JavaScript. A plain message
associated with the form reads “Sending is currently disabled. Please contact me
by email.” The button is also non-submit before readiness; direct submission
events still hit the existing availability guard. No network call/UUID creation
occurs. Existing controlled enabled flows, email fallback and server release lock
remain intact. The existing DeliveryDisabled story now shows the complete form.

Fresh checks: 28 ContactForm tests; full suite 134 files/2,209 tests; 274 dedicated
contact tests; eight Contact browser checks including JS/no-JS visible disabled
fields, forced-submit rejection, short-screen/all-theme normal and enlarged text
and all controlled sending flows. Frontend/validation types, affected lint and
formatting are checked for this amendment. Production build and Storybook pass in
the separate credential-free/fetch-denied snapshot; build ID
`b2_dPE_rwfMuZUUvHnr2p`. Three fresh Lighthouse runs pass existing assertions:
all four categories 100, LCP 470–593 ms and CLS approximately 0.000038. These are
local desktop lab measurements. The original broader navigation evidence above
belongs to its original candidate; current amendment evidence is in the updated
artifact below. Physical-phone and counterpart acceptance remain pending.

## F1 correction — 2026-10-13

The independent read-only Codex review at actual HEAD `617f9c8` plus the visible-fields
candidate identified P2 F1: editing removed configuration-unavailable or 429
guidance while the blocking state remained. The original review and two failing
probes are retained in the separate `fs-5.4-review-2026-10-13/` artifact.
Dimi explicitly authorized the local correction, regression tests and documentation.

`ContactForm.edit` now preserves feedback while `deliveryUnavailable` or `retryAt`
is active. Transient feedback otherwise clears as before. Editing still retires
the attempt, preserves the draft, clears the edited field's error and leaves focus
on that field. Neither blocker is removed and no automatic retry occurs. After
cooldown, a manual submission uses the edited payload with a new UUID; unchanged
manual retry identity remains covered by existing tests. No new status component,
wire/server/provider behavior or delivery setting.

F1 changes only five paths relative to the visible-fields candidate: ContactForm,
its component tests, controlled Contact E2E, this task record and the UI/phone guide.
Thirty component tests and 274 dedicated contact tests pass; strict frontend/E2E
types and affected lint pass. The credential-free/fetch-denied isolated production
and Storybook builds pass; build ID `jgc9nWzszzt1bTlY7jBHj`.
New component and browser cases edit all three visible fields after configuration
unavailable and 429, verifying retained guidance/input/focus and blocked forced
submission. Component checks also prove post-cooldown explicit new identity.
All ten Contact browser checks pass on a fresh source-locked disabled server,
including both F1 regressions; evidence is supplied with the correction artifact below.

This bounded correction changes no layout, tokens or server boundary; prior full
suite/Lighthouse results remain tied to their recorded candidates and were not
claimed as fresh F1 checks. Author verification is not independent F1 closure:
request Codex re-review of the actual corrected candidate. Phone/wording and all
external gates remain pending. No commit/push, publication, live mail or next task.

## F1 re-review PASS and authorized Git delivery — 2026-10-13

Codex independently re-reviewed actual `617f9c8f3103c58f148d54944d64a51a22282683`
plus the complete corrected 37-file candidate. All hashes matched corrected patch
SHA-256 `3961a0a21a7f7a0de4999c0da36a081d32a01a5a4c8b28577863dc51c0fe2723`.
Result: **PASS; F1 closed in technical review; no additional actionable findings
in the bounded re-review.** Unavailable/cooldown guidance survives editing,
blocking states remain, input/focus are preserved, unchanged manual retries keep
their identity, and edited drafts use a new identity only on explicit submission.

Fresh re-review evidence: 30 component tests, five focused Chromium checks and
both original F1 reproductions PASS, plus strict frontend/validation types,
focused lint and whitespace checks. Runtime matched built candidate
`jgc9nWzszzt1bTlY7jBHj`. Source release lock remained false; tests used fresh
credential-free/fetch-denied servers, an actual request still returned unavailable,
and no live mail/external action occurred. The separate
`fs-5.4-f1-rereview-2026-10-13/` artifact retains the PASS and logs.

Dimi then explicitly authorized updating documentation and committing/pushing all
FS-5.4 changes on the existing branch. Final docs reconcile this PASS; runtime
remains the reviewed candidate. The containing commit identifies delivery, with
actual full revision and matching remote branch recorded after Git verification
in `delivery.txt` in the final artifact. This authorization does not close phone/
design/wording/assistive-technology acceptance or legal/account/sender/WAF/preview/
all-alias/live gates, enable delivery, authorize merge/publication or start another task.

## Handoff

- **Actual repository/base/delivery:** `/Users/dimi/Projects/funkspace-app`, `feature/funkspace-minimum-usable`, implementation/review base `617f9c8f3103c58f148d54944d64a51a22282683`. The containing commit identifies delivery; final `delivery.txt` records verified local/remote revision. Recheck actual HEAD/status before continuing.
- **Previous task:** FS-5.3 handoff/local technical PASS at that actual base linked above; external coverage remains pending.
- **Accessible artifact:** `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.4-delivery-2026-10-13/` contains the final complete patch/checksum, manifest, documentation checks and Git delivery verification. Earlier `fs-5.4-f1-2026-10-13/`, `fs-5.4-visible-2026-10-13/` and `fs-5.4-2026-10-13/` retain candidate-specific test/build evidence. `fs-5.4-review-2026-10-13/` retains F1, and `fs-5.4-f1-rereview-2026-10-13/` retains its technical PASS. Regenerate if changed.
- **Contract usage:** Exact five-string JSON POST through existing composition; shared rules and strict result/UUID grammar; any 429, whole-response 15s deadline, no retries/storage, unchanged manual key/edit retirement/23h cutoff and matching acceptance. Server/provider payload/key/eight-second deadline and release lock unchanged.
- **Receiving-chat access:** Verify actual branch/HEAD/status and every intentional file/hash or matching artifact before review. A separate Sites workspace must prove the actual same base/diff; chats do not automatically share files. No reset or secret transfer.
- **Phone/review:** Codex technical PASS/F1 closure recorded above. Dimi phone/design/wording/assistive-technology acceptance and deployed/legal/mailbox verification remain pending; checklist linked above.
- **Stop boundary:** Only FS-5.4 documentation and explicitly authorized commit/push. No publish/deploy, merge, provider/server change, external configuration, live email or automatic next task.
