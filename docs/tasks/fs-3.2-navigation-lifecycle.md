# FS-3.2 — Navigation and focus lifecycle implementation

## Status and authorization — 2026-09-27

**Owner:** Sites. **Stage:** Complete — Dimi explicitly closed FS-3.2 after
Codex's technical approval and manual Firefox/Safari testing. See the completion
decision below; earlier candidate sections retain their historical evidence.
**Base/branch:** `c0cdda928cea38f12fc11db54ddab689f950a1e1` on
`feature/funkspace-minimum-usable`. No branch change, reset, commit or push.

Before implementation, the working tree contained only the feature-plan pointer
and the untracked FS-3.2 contract. Both were preserved. The accepted FS-3.1
handoff and prerequisites FS-1.6/FS-2.6 remain in force. Root AGENTS, workflow,
task template, architecture, actual source/tests/scripts, and supplied detailed
plan section 5 / N1–N9 were inspected. Historical SHAs were not reset targets.

Approval evidence is separate:

- **Codex contract review:** revision 3 was explicitly approved in this session:
  “Technical verdict: contract approved. No blocking findings remain.” Exact
  approved proposal is preserved in `artifacts/fs-3.2-contract/revision-3/`
  under the local project mirror; proposal patch SHA-256
  `fcd3f5b0f78e4d19a33388bd5a81771b5b6e6f910aea95b859c5d3f53ef11c74`.
- **Dimi Back decision:** “Follow normal page history and close the overlay
  (Recommended)”. No synthetic menu history entry or History API patch.
- **Dimi device acceptance:** explicitly supplied with the implementation request.
  No device/browser versions or individual new-candidate observations were
  supplied. Those details are not invented or substituted with automation.
- **Implementation authorization:** explicit request to implement FS-3.2 only.
  Independent implementation review subsequently approved the corrected
  candidate, as recorded below. **FS-G1 is not approved.**

## Delivered behavior and boundaries

The accepted shell already supplies one compact desktop navigation/settings
launcher and mobile placement. It remains one responsive invoker and one
controlled Dialog; no duplicate desktop modal or navigation state was added.
Safe areas, P2 short-height/Close clearance, footer access, title/Close behavior,
icon-only naming, ordinary hrefs, themes and fixture-only Motion are retained.

The generic Dialog port adds optional dismissal/navigation disposition,
fixed-body/document-overflow locking, release acknowledgment and explicit
teardown disposition. The hook adds a live disposition ref and opt-in opening
error handling. Existing consumers keep fixed-body dismissal defaults. Portfolio
opts into overflow-only locking, keeping document geometry/native history
coordinates intact. Navigation suppresses every custom restoration path
(return ref, opener, fallback) and old-coordinate replay; ordinary dismissal
uses the first usable return target/opener/main fallback. Hidden ancestors are
explicitly rejected even if CSS gives a hidden control dimensions. Portfolio
restoration also rejects invokers outside the viewport after breakpoint changes;
the existing generic fixed-body return-target behavior remains unchanged.

Desktop anchor coordinates are corrected by an owned `--dialog-page-scroll-y`
CSS value in the overflow lock. A per-cycle resize listener updates that value;
release/failed opening removes the listener and restores the previous value.
CSS clamps offscreen anchors to the safe top edge, keeping Close and the category
rail reachable when a scrolled mobile page becomes desktop. Visible invokers
still align with the overlay controls, including partially scrolled headers.
This extends the existing lock's owned style cleanup, not its public contract.
The ten-cycle adapter test verifies resize-listener removal and restoration of
the prior CSS value. Property ownership compares both the value and the actual
applied priority (the test DOM normalizes custom-property priority).

One inert-at-construction handoff adapter is injected by the existing provider.
It retains at most one accepted link receipt, distinguishes preferred-action
cancellation from eventual arrival, and resolves actual committed fragments
before main. Focus work is bounded to a cancellable frame and guarded by intent,
owner, URL, active modal and newer input. Root/subscriber cleanup is balanced;
no second modal/scroll manager, persisted preference, polling, route registry,
History patch or global autofocus was introduced. Browser operations remain in
Infrastructure; Domain contracts contain generic handles and plain data.

Shared destinations now include focus IDs. Next Link retains its default scroll
behavior and eligibility checks; modified clicks/downloads do not create an
intent. Static/footer anchors remain ordinary links. Failed opening reveals the
ordinary navigation tree. Full-document departure/BFCache and native history
clear pending work and close the overlay without departing-page restoration.

### Measured implementation refinement for Codex

The approved proposal described synchronous reveal before returning from every
same-document activation. Browser testing exposed a history-capture regression:
scrolling a **changed hash** before Next commits can save the destination position
on the departing entry. The implementation releases the dialog immediately and
focuses without scrolling; Next owns the first changed-hash reveal. Only an
**identical current href** performs explicit immediate reveal, covering repeated
Contact/Home. The bounded correction remains focus-only. No new public API or
history mechanism was needed. This refinement is specifically handed to Codex
for implementation review; approval of a new review is not inferred.

Removing fixed-body displacement also exposed a selected theme button hover
selector conflict. A two-selector CSS correction preserves the existing selected
foreground/background on hover. No theme token, bootstrap source, persistence,
or ThemeService behavior changed; FS-3.3's storage follow-up remains separate.

## Changed areas

| Area               | Files / purpose                                                                                                                                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Existing dialog    | `frontend/domain/ports/DialogBindingPort.ts`, `frontend/hooks/useDialog.ts`, `frontend/infrastructure/dom/NativeDialogBinding.ts`; additive policy, owned release and failure behavior                                      |
| Bounded handoff    | New `frontend/domain/ports/PortfolioNavigationHandoffPort.ts`, `frontend/infrastructure/dom/PortfolioNavigationHandoff.ts`; existing provider/factory injection                                                             |
| Navigation         | Existing `PortfolioNavigation`, `PortfolioNavigationTree`, shared destinations and navigation story; keep Dialog mounted, wire same-tab intent and failure fallback                                                         |
| Theme presentation | `frontend/components/ThemeSwitcher.module.css`; retain selected-state contrast while hovered                                                                                                                                |
| Tests              | Native binding/handoff, destination and navigation tests; new lifecycle browser suite; existing transition assertion updated for the approved overflow lock; exact resize geometry assertions await browser layout settling |
| Redirect fixture   | `e2e/fixtures/navigation-redirect.spec.ts` and `navigation-redirect/page.tsx`; only used in an isolated build with `/about` replaced by Next's actual server redirect; ordinary Playwright excludes fixtures                |
| Documentation      | This record, approved-contract status/refinement, feature-plan handoff pointer and shared-dialog architecture description                                                                                                   |

## Automated evidence

Exact commands, results, full diff, changed-file hashes, temporary runner configs,
logs and narrow/wide screenshots are retained in:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.2-implementation/`.

| Check                                                    | Result                                                                                                            |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `pnpm test` (includes theme-bootstrap freshness)         | PASS: 1,470 tests, 99 files                                                                                       |
| `pnpm -F frontend exec tsc --noEmit --incremental false` | PASS                                                                                                              |
| `pnpm lint`                                              | PASS: no lint errors/warnings; full Prettier check; Next reports its existing lint-command deprecation            |
| `pnpm build`                                             | PASS: production build; no generated source drift                                                                 |
| `pnpm storybook:build`                                   | PASS: existing large-chunk advisory remains                                                                       |
| Production navigation browser set                        | PASS: 63 cases, including real BFCache return                                                                     |
| Isolated actual Next client redirect build/browser cases | PASS: 4 cases; 320/1280px, retained/dismissed overlay, same document identity, Contact focus, next Tab and scroll |
| Production theme-bootstrap/no-flash suite                | PASS: 19 cases, including saved-dark startup/reload at 320/1280px                                                 |
| Shared Dialog Storybook browser suite                    | PASS: 16 cases, including default fixed-body behavior and embedded-document ownership                             |

### N1–N9 mapping

| ID  | Executed evidence / scope                                                                                                                                                                                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| N1  | Narrow/wide Close/Escape; actual invoker focus; hidden-invoker main fallback; scroll lock; shared-dialog fallback permutations                                                                                                                                                                   |
| N2  | About and both legal destinations via keyboard; existing primary/static/footer navigation; shared focus IDs                                                                                                                                                                                      |
| N3  | First and repeated Contact; manual scroll-away; changed-hash departing-position regression; no late Menu restoration                                                                                                                                                                             |
| N4  | Both legal source pages, held response, Close/Escape, narrow/wide Contact; destination interaction beats old work; real client redirect and hard-navigation redirect; failed route with Next hard-document fallback and Back recovery; final focus, next Tab and scroll assertions               |
| N5  | Back/Forward with overlay, native fragments and nonzero position; direct/reload/full-document departure; exact Back/Forward comparison against an unlocked nonzero control; external hash during an open overlay; simulated persisted events plus real persisted BFCache return in full Chromium |
| N6  | Existing modified-click/new-tab test, keyboard activation, native download keeps source overlay intact                                                                                                                                                                                           |
| N7  | At least ten browser open/close cycles per width, adapter listener accounting, native close, immediate reopen and old-release/cancel guards                                                                                                                                                      |
| N8  | Native showModal failure restores ordinary links; adapter rollback, competing-modal rejection and no false release acknowledgment                                                                                                                                                                |
| N9  | Existing full composition suite: narrow/wide/short, long labels, 200% text, reachable legal/Close/settings, both P2 geometry regressions; responsive change within one open cycle; scrolled invoker becomes offscreen, Close remains reachable and dismissal uses main                           |

Test-development failures were investigated rather than relabeled PASS: an old
exact destination-object assertion needed the approved focus IDs; changed-hash
scroll ordering lost history position; `hidden` was not rejected when CSS kept
a box; the selected-theme hover selector lost contrast. The scrolled breakpoint case also exposed CSS anchor scroll adjustment; a bounded owned offset corrects it. These were corrected.
A 307 fetch-response mock discarded the fragment in Next's fetch normalization;
client redirect evidence instead uses a genuine Next server redirect in an
isolated build. No production redirect route was added. The headless shell did not cache the page; full Chromium with BFCache enabled
passed the actual persisted-return assertion. That test observes history traversal
instead of waiting for a load event that cached returns do not emit. Full-document
restoration is compared exactly with an unlocked control: Chromium can adjust
the original pixel position during reload layout (300px became 298px in both
cases), which must not be confused with dialog-owned scroll restoration.

## Cleanup, limitations and next acceptance action

Source/diff review checks for one overlay owner, default compatibility, no old
scroll/focus replay, bounded frames/listeners, dependency direction, duplicate
managers, generated drift and unrelated changes. No customization, game work,
later-epic motion integration, deployment or external configuration is included.

Automated browser evidence is Chromium on this host; it does not establish
physical touch/Safari/Firefox behavior. The existing contract requires returning
to its checkpoint if a supported phone cannot block background scrolling using
the non-displacing strategy; no fixed-body fallback is silently substituted.
Dimi's supplied acceptance remains recorded independently of these limitations.

**Next:** Codex reviews the exact implementation candidate read-only, including
the measured same-document ordering refinement. Dimi receives narrow/wide
previews and any remaining platform observations. Do not start that review,
commit/push, a later task or FS-G1 automatically. FS-G1 remains unapproved.

## Query-removal regressions — 2026-09-27

**Owner:** Sites. **Scope:** the follow-up request adds regression coverage;
production lifecycle code is unchanged. Codex's read-only implementation review
returned P2 “Query-string navigation leaves the overlay open.” The preceding
candidate results remain historical evidence for the exact archived patch, not
approval of this unresolved case. FS-G1 remains unapproved.

Added `e2e/navigation-query-removal.spec.ts`: eight real-route cases covering
Contact, About, Privacy policy and Legal notice at 320px and 1280px. Sources
contain ordinary `utm_source`/`ref` queries; existing native destination hrefs
remove them. Tests use pointer/Enter activation, guard against a forced remount,
and inspect state after the handoff frame and queued native-close cleanup.

Assertions cover closed dialogs, released root/body styles (including the owned
scroll-offset property), actual destination focus/visibility, the next Tab
target, stable destination scroll, and exact saved positions across Back/Forward.
Nonzero source positions are used where the real content can scroll; the short
wide legal page may fit entirely. Contact is required to start at nonzero scroll.
Soft assertions let every phase run and attach its final-state evidence; they
still fail the test. No skip, expected-failure marker or weakened existing test
was added.

Validation against the unchanged reviewed production build:

- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-fs32-browser.config.ts --output /tmp/fs32-query-regressions e2e/navigation-query-removal.spec.ts e2e/navigation-lifecycle.spec.ts`
  — **FAIL: eight new regressions reproduce the open/locked overlay and incorrect
  destination/next-Tab focus; 29 existing lifecycle tests PASS.** All eight new
  cases reach their Back/Forward checks; those checks pass in this run. This is
  defect evidence, not an implementation PASS.
- `pnpm -F frontend exec tsc --noEmit --skipLibCheck --target ES2022 --module NodeNext --moduleResolution NodeNext ../e2e/navigation-query-removal.spec.ts`
  — PASS: focused test/helper type check.
- Formatting, repository lint and final diff checks are recorded in the
  regression artifact manifest. No application rebuild is needed for these
  test/documentation changes; the reviewed runtime file hashes are preserved.

Exact test/documentation delta, file hashes, commands and test output are in
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.2-query-regressions/`.
The earlier implementation and contract artifacts remain unchanged.

**Next acceptance action:** Sites must correct same-route query-removal handoff,
then run these assertions and the existing lifecycle suite to green before
returning the implementation for Codex read-only review. No correction or
independent review is claimed by this test-only follow-up. Chromium is the only
browser exercised here; no physical-device acceptance is inferred.

## Query-removal correction — 2026-09-27

**Owner:** Sites. **Stage:** corrected implementation candidate for Codex's
separately requested read-only re-review. Dimi explicitly requested the handoff
fix and green regressions; this does not approve FS-G1 or any later task.
Branch/base and all pre-existing work remain preserved.

The defect classified a query-only change as a client route and waited for an
unmount that Next does not perform. `PortfolioNavigationHandoff.begin` now uses
same origin/path to select immediate release and focus for the supported static
portfolio routes. It does not equate URL equality with route ownership. Search
parameters still participate in the queued frame's committed-URL check, and
only an exactly repeated href performs explicit reveal. Next continues to own
query removal, history capture and the first changed-URL scroll.

No port or presentation API changed. There is no router watcher, History API
patch, forced reload/remount, timer, new lock or modal. Different-path navigation
retains the existing release/arrival handshake. The previous eight browser
regressions are unchanged; four adapter cases explicitly verify same-owner
Contact/About/legal query removal, destination focus and no premature scroll.

Current validation:

- Focused handoff/native-dialog/component checks — PASS, 38 tests / five files.
- `pnpm test` — PASS, 1,474 tests / 99 files, including theme-bootstrap freshness.
- `pnpm -F frontend exec tsc --noEmit --incremental false` — PASS.
- `pnpm build` — PASS, with no generated source drift.
- Production navigation browser set, including the eight unchanged query-removal
  regressions — PASS, 71 tests. Final focus, next Tab, released styles, source and
  destination scroll/history positions pass after queued cleanup. Existing
  dismissal, repeated hashes, secondary-page Contact, legal links, modified
  activation, BFCache, failed/repeated opens, no-JS and breakpoint checks pass.
- Additional delayed-query and genuine Next redirect results, plus final lint,
  are recorded in the correction artifact manifest.

Exact full candidate, delta from the pre-fix handoff, file hashes, commands,
results and final-state snapshots are retained in
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.2-query-fix/`.
The previous failing regression evidence and approved contract artifacts remain
unchanged. The historical sections above retain their original status/results.

**Next acceptance action:** Codex reviews this corrected candidate read-only.
This author handoff does not claim independent closure of the P2 or start the
review. Browser evidence is Chromium only; no new physical-device acceptance,
Safari/Firefox coverage, FS-G1 approval, commit, push or deployment is claimed.

## Approved implementation handoff — 2026-09-27

**Owner:** Sites records the handoff; Codex owns the independent technical
verdict; Dimi owns manual observations and product acceptance. This update
changes documentation only, preserving the existing working tree and branch.

### Exact reviewed candidate and technical verdict

Codex's separately requested read-only re-review concluded:
**“Technical verdict: approved. No blocking findings remain.”** The P2
query-removal finding is resolved. The review verified all 29 candidate file
hashes against the correction manifest and found dismissal defaults compatible,
navigation locks released, and destination focus/native history preserved
without late restoration.

- Base: `c0cdda928cea38f12fc11db54ddab689f950a1e1`.
- Branch: `feature/funkspace-minimum-usable`.
- Reviewed full candidate patch SHA-256:
  `73fb11601424f76d7bca49d86592a8a092930cebf237f901b71fa058a218c63b`.
- Exact patch, per-file hashes, correction delta and author evidence:
  `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.2-query-fix/`.

The hash identifies the candidate reviewed before this documentation update;
it is not a claim that the amended documentation has the same hash. No runtime,
test, public-contract or generated-file change is part of this handoff update.
The approved revision-3 contract and its documented implementation refinements
remain the integration boundary. Motion remains fixture-only; customization and
later-task implementation are excluded.

### Independent automated verification

Codex independently executed the following checks during re-review, separately
from the earlier Sites author validation:

```bash
pnpm check:theme-bootstrap
pnpm exec vitest run frontend/infrastructure/dom/PortfolioNavigationHandoff.test.ts frontend/infrastructure/dom/NativeDialogBinding.test.ts frontend/components/Controls/Dialog.test.tsx frontend/components/Layouts/PortfolioNavigation.test.tsx frontend/components/Layouts/PortfolioNavigationTree.test.tsx
PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-fs32-browser.config.ts --output /tmp/fs32-rereview-browser e2e/navigation-query-removal.spec.ts e2e/navigation-lifecycle.spec.ts e2e/navigation-bfcache.spec.ts e2e/navigation-transition.spec.ts e2e/navigation-composition.spec.ts e2e/portfolio-navigation.spec.ts
PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-fs32-redirect.config.ts --output /tmp/fs32-rereview-redirect
git diff --check
```

Results: **PASS**, 38 focused tests across five files, 71 Chromium browser cases
(including all eight unchanged query-removal regressions), four actual Next
client-redirect cases, theme-bootstrap freshness and diff whitespace checks.
Browser assertions cover final focus, next Tab, released locks, scroll and
Back/Forward after queued cleanup. Re-review logs and runner configurations are
preserved in the local `artifacts/fs-3.2-handoff/` directory alongside this
documentation delta. Full-suite/type/lint/build results above remain author
evidence; they are not relabeled as independent reruns.

### Dimi's manual observation

After the technical re-review, Dimi reported: **“I tested it in firefox, all
works fine.”** This is a positive manual Firefox observation supplied on
2026-09-27, separate from Chromium automation and the previously recorded
device acceptance. Firefox version, operating system, device, viewport and
individual test steps were not supplied. No physical-phone, assistive-technology,
automated Firefox or Safari/WebKit coverage is inferred. The review host had no
Firefox/WebKit executables; that automated coverage limitation remains.

Dimi's Back decision remains **“Follow normal page history and close the
overlay (Recommended)”**; neither the fix nor this handoff changes it.

### Handoff status and next acceptance action

FS-3.2 is technically approved with no blocking review finding remaining, and
Dimi's Firefox result is recorded. Sites has completed the requested handoff
documentation. Dimi retains the decision to close the task or authorize the
next stage; this record does not invent an explicit completion instruction.
FS-3.3 may consume the reviewed navigation boundary when separately requested.
FS-G1 remains unapproved; later appearance/motion and FS-3.6 acceptance work
remain separate. No next task, commit, push or deployment was started.

Documentation validation: content/evidence and local-link review, focused
Prettier check, `git diff --check`, and comparison with pre-update file hashes.
Only this task record and the feature-plan status are changed by this update;
application tests/builds are not rerun for documentation alone.

## Dimi completion and commit/push authorization — 2026-09-27

Dimi supplied the browser versions for the completed manual testing:

- **Firefox 156.0.1 (64-bit)** — the earlier report states “all works fine.”
- **Safari 27.0 (21625.1.29.18.28)** — testing confirmed in the completion request.

Dimi explicitly stated **“the FS 3.2 is done”** and requested documentation
updates followed by **commit and push of all changes**. FS-3.2 is therefore
**Complete**. This decision follows the independent Codex approval and resolved
query-removal P2 recorded above. Browser versions are now known; device models,
operating-system versions, viewports and individual manual steps remain
unspecified. These are Dimi's manual results, not automated Firefox/WebKit runs.
The prior Back decision and contract remain unchanged.

The authorized commit includes the full existing 29-file FS-3.2 implementation,
contract, regression tests and documentation candidate, plus these completion
updates, on `feature/funkspace-minimum-usable`. The source/test files are checked
against the independently approved candidate hashes before commit; only the three
handoff/status/contract documents have changed since that review. Earlier candidate
hashes continue to identify their exact historical diffs, not this final commit.

Final validation is documentation formatting, link/content and diff review,
candidate hash comparison and staged-file inventory. Existing passing runtime
checks remain applicable because runtime/tests are unchanged. Commit and push
results are reported in the session handoff; no success is claimed before Git
confirms it.

**Next:** FS-3.3 may use this accepted navigation boundary when Dimi requests
that task. No next task starts as part of closure. FS-G1 remains pending;
appearance/motion integration and FS-3.6 acceptance retain their own gates.
No PR, merge, deployment or external configuration change is authorized here.
