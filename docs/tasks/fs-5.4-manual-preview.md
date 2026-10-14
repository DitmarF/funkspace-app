# Task FS-5.4 — Safe manual test preview

## Task metadata

- **Status:** Complete for local preview preparation; Dimi phone/accessibility manual acceptance recorded 2026-10-14; commit/push authorized
- **Task group or epic:** [EPIC 5](../features/FunkSpace_EPIC_5_Detailed_Plan.md), bounded FS-5.4 follow-up
- **Owner:** Sites local workflow; Codex checks; Dimi phone acceptance
- **Last updated:** 2026-10-14
- **Related documentation:** [instructions](../../AGENTS.md), [architecture](../architecture.md), [prior evidence](fs-5.4-contact-page.md), [manual guide](../development/contact-manual-preview.md)

## Requested outcome

Fix Storybook and prepare a safe phone preview of all form states, timeouts and
retry expiry. Keep live delivery disabled and do not start FS-5.5. The initial
request authorized local code/previews only. Dimi subsequently reported successful
phone/accessibility manual testing and explicitly authorized documentation updates,
commit and push on 2026-10-14; no publication/external configuration/live mail.

### Acceptance criteria from the request

- [x] Contact stories are discovered and build.
- [x] All outcomes, actual browser deadlines and retry expiry have phone-testable controls; Dimi's phone/accessibility acceptance is recorded below, without invented per-check results.
- [x] Fixture changes preserve draft/key; reset is explicit.
- [x] Delivery stays disabled and preview has no provider path.
- [x] Checks, limitations and phone procedure recorded; FS-5.5 not started.

## Context and repository evidence

- **Repo/branch/base:** `/Users/dimi/Projects/funkspace-app`, `feature/funkspace-minimum-usable`, `fd46474a1420d614dbb31c48fb16d9d6779d471e`; clean at start, no reset/new branch.
- **Previous handoff:** [FS-5.4 F1 re-review PASS and Git delivery](fs-5.4-contact-page.md#f1-re-review-pass-and-authorized-git-delivery--2026-10-13); technical PASS stands, phone/external gates pending.
- **Inspected:** AGENTS.md, architecture/workflow/templates, authoritative/EPIC plans, FS-5.1–5.4 evidence, actual form/contract/browser/server composition, shell/navigation/themes/fields/button, Storybook/Vitest/Playwright and package files.
- **Finding:** Earlier Storybook builds discovered only components. All eight contact stories under features/contact were absent; earlier build evidence did not verify their rendering. Discovery also exposed a missing @/ Vite alias. Both are corrected with index and browser checks.

### Assumptions and open decisions

- **Safe assumption:** Same-Wi-Fi local access; asynchronous network question offered. No public hosting inferred.
- **Open decisions:** None for this local delivery. Provider/legal/deployed gates and any remote protected hosting require separate work/authorization.

## Scope

### In scope

Story discovery/alias, Storybook-only fake transport, actual form/shell fixture,
theme/outcome/held/deadline/expiry controls, bounded static private-LAN server,
tests, credential-free previews and documentation.

### Out of scope

FS-5.5/legal approval, provider/live tests, WAF/alias/account configuration,
public deployment and production test flags/backends. Git delivery was separately
authorized after manual testing, as recorded below.

### Protected areas

Frozen contract, provider/server configuration and release lock, production
ContactForm/navigation/homepage/scene, shared primitives/tokens and game contracts.
Production graphs must exclude manual fixtures. Draft/key remain page memory only.

## Planned changes

| Path                                                                          | Status       | Change                                    | Boundary              |
| ----------------------------------------------------------------------------- | ------------ | ----------------------------------------- | --------------------- |
| `frontend/.storybook/main.ts`                                                 | Existing     | Contact discovery and frontend alias      | Storybook only        |
| `frontend/features/contact/ContactForm.stories.tsx`                           | Existing     | HTTP-LAN fixture UUIDs                    | Stories only          |
| `frontend/features/contact/ContactManualPreview.stories.tsx`                  | New          | Actual form/shell and controls            | Stories only          |
| `frontend/features/contact/manual/*`                                          | New          | Fake fetch/retry clock/metadata and tests | Stories/tests only    |
| `scripts/serve-contact-preview*`                                              | New          | Bounded static server and Node tests      | No API/provider       |
| `playwright.contact-manual.config.ts`, `e2e/storybook/contact-manual.spec.ts` | New          | Fresh browser checks                      | No live/reused server |
| Documentation                                                                 | Existing/new | Procedure, evidence, handoff              | No legal approval     |

### Implementation sequence

1. Discovery, stable fixture/controller and phone controls.
2. Isolated no-env snapshot; verify static and actual disabled previews.
3. Focused checks, production exclusion audit, documentation and local handoff.

## Dependencies and risks

- **Internal:** Existing ServiceProvider/createServices, ContactForm, BrowserContactSubmission, validation/tokens. No new dependencies.
- **External:** Same Wi-Fi/awake Mac; connectivity not inferred from desktop.
- **Risks/mitigations:** Simulation confused with delivery (permanent notice/static server); draft remount (stable factory/port); HTTP randomUUID unavailable (fixture-only v4 helper); deadline bypass (real browser adapter); accidental egress (fresh static server, source lock/empty config/fetch denial for actual Next preview).

## Validation plan

Fixture/form tests, Node static-server checks, strict frontend/validation types,
changed-path lint/format, fresh Storybook E2E, nine-entry index proof, credential-free
denied-fetch Storybook/production builds, production import/bundle/route exclusion,
actual disabled SSR/API smoke, documentation links and diff review. No unrelated
full-suite/Lighthouse rerun needed for Storybook-only changes.

### Manual checks

[Phone procedure](../development/contact-manual-preview.md#manual-procedure).
Automated viewports do not close keyboard/AT/sleep/design acceptance.

## Completion record

- **Outcome:** Static fixture at private address `192.168.0.179:33154`, actual disabled Next page at `192.168.0.179:33156/contact`; previews left running for Dimi. In-app browser rendered the simulation notice, controls, actual form, current Contact and public fallback. No phone connectivity/visual acceptance claimed.
- **Files changed:** Sixteen paths in the artifact manifest: Storybook discovery/alias, original/new stories, fixture/helper tests, static server/tests, dedicated browser config/test, manual guide/task and five linked existing documents.
- **Acceptance evidence:** Nine contact entries in built index; form validation/focus/acceptance/reset, held duplicate guards, preserved draft/key through response/theme controls, F1 blocked-edit feedback, expiry and no persistence/egress. Both actual 15-second fetch/body deadlines preserve text and show cleanup. Four themes at 320×360 and 844×390 with 200% text pass no-overflow/axe checks; these are desktop Chromium simulations.
- **Validation:** 24 fixture plus 30 ContactForm tests PASS; 274 dedicated contact tests PASS; seven native Node static-server tests PASS; eleven manual browser checks PASS across the main run and one corrected-test rerun, plus two fresh disabled Next checks (approved-origin API cannot send, visible disabled/no-JS/short-screen behavior). Strict frontend/validation types, affected/tooling lint, formatting, links and diff checks PASS. Credential-free/fetch-denied Storybook and production builds PASS; Next build ID `9EAVL9Iaiz1pQqJqYziw4`. Production static/server output contains no manual fixture class/banner/controls; route manifest adds no QA route and protected runtime sources match base byte-for-byte.
- **Review:** Read-only agent technical PASS for fixture/composition/deadline/clock/production boundaries; no actionable findings. Static-server author separately checked its code/tests; that portion is self-review. Dimi phone/design/wording/AT acceptance remains pending.
- **Corrections:** Discovery exposed missing alias; corrected before successful build. Exact select-label lookup stalled before any held request; explicit label/id associations fixed it. Next run passed ten checks, with a duplicate theme assertion stalled under the paused cooldown clock. Theme retention passes in native-clock held/retry cases; only that duplicate assertion was removed, then full 429 editing/blocking/cooldown/new-ID assertions passed on focused rerun. Failure logs are retained. Fresh-server config refused an orphaned test server after interruption; only our known owned PID was stopped. No threshold/contract/live change.
- **Deviations:** Local static Storybook plus actual disabled Next preview; prior discovery gap corrected explicitly.
- **Remaining:** Legal/account/domain/protected-preview/WAF/all-alias/live gates; FS-5.5/5.6 not started. See the later phone/accessibility acceptance below; earlier validation statements retain their original scope.

## Dimi manual acceptance and Git authorization — 2026-10-14

Dimi reported: “Phone/accessibility works well after manual testing.” This records
the human phone/accessibility acceptance for the supplied controlled preview based
on `fd46474a1420d614dbb31c48fb16d9d6779d471e` plus the verified 16-file candidate.
Device/OS/browser versions, assistive-technology mode, individual checklist results
and separate design/wording approval were not supplied; they are not invented.
This user report is distinct from automated Chromium and technical-review evidence.

Dimi explicitly requested updating documentation, then committing and pushing all
these changes. Only documentation is refreshed after testing; the nine executable/
configuration/test paths retain their verified manifest hashes. Delivery remains
source-locked off, the frozen server/provider contract is untouched, external and
live gates remain pending and FS-5.5/5.6 are not started. No merge/deployment/account/
DNS/firewall/live email action follows from this Git authorization.

The containing commit identifies final delivery. The final artifact's `delivery.txt`
records the full local/remote revision and clean working tree after push; the
earlier preview artifact retains candidate-specific tests and review.

After the reported manual acceptance, both owned temporary preview processes
were stopped as task cleanup. The documented local links require restarting the
isolated setup for further testing.

## Handoff

Actual repository `/Users/dimi/Projects/funkspace-app`, branch
`feature/funkspace-minimum-usable`, preparation/delivery base
`fd46474a1420d614dbb31c48fb16d9d6779d471e`. The containing commit identifies final
delivery; recheck actual HEAD/status before continuing.
Contract/production code unchanged; actual browser adapter with fake fetch only in
Storybook. Original test/review artifact:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.4-manual-preview-2026-10-14/`.
Receiving chats must verify actual repo/branch/HEAD/status and exact diff/hash;
they do not automatically share working files/previews. No secrets.

Final patch/manifest/documentation checks and Git verification:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-5.4-manual-delivery-2026-10-14/`.
