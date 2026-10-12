# FS-4.7 — Independent scene performance and failure review

## FS-4.7 closure and authorized delivery — 2026-10-13

**Status: COMPLETE — Dimi explicitly closed FS-4.7 on 2026-10-13.** His instruction
was: “FS-4.7 are done, update the documetation then commit and push all changes.”
This is the current task-status authority and supersedes the earlier BLOCKED
status and return-to-measurement instructions below. Those entries retain their
historical candidate, results and limitations.

The [Codex correction re-review](#fs-47a-correction-re-review--2026-10-13) closes
A1–A5; [FS-4.7B](#fs-47b--bounded-correction-disposition--2026-10-13) requires no
additional correction. Dimi reports all manual smartphone, Safari and Firefox
tests PASS. The reviewed implementation remains HEAD
`749342717ddac85b67a3275d669363ef9bf86d2e` plus patch SHA-256
`777659cbba4b81d64e417d84596ffdbbf23cf63ee6e63478b30652dee978342b`;
all 46 non-documentation files retain their reviewed bytes before delivery.

Closure is Dimi's task decision, not an invented measurement result. The missing
raw phone performance/refresh/comfort packet and absence of a final-candidate
Lighthouse rerun remain disclosed evidence limits. Earlier numerical budgets,
LCP/CLS assertions and the On score warning are unchanged. Neither historical
measurements nor Dimi's general manual PASS are relabeled as fresh numeric PASS.
These limits no longer keep FS-4.7 open under Dimi's explicit closure instruction.

Delivery includes all pending reviewed corrections, regression tests, generated
icon delivery, preview isolation, touch/Safari focus fixes and their documentation
on `feature/funkspace-minimum-usable`. Commit and push are now explicitly
authorized; prior prohibitions below describe earlier task stages. Raw evidence
packets linked in this record remain local artifacts outside the repository.

**Next task: FS-4.8 — Dimi's final scene acceptance.** It remains separate and has
not been performed or inferred from FS-4.7 closure. No PR, merge, deployment or
publication is authorized by this delivery request.

Subsequent 2026-10-13 handoff: Dimi accepts delivered `a43bbf0` and explicitly
[closes FS-4.8 and EPIC 4](fs-4.8-scene-acceptance.md#fs-48-and-epic-4-closure--2026-10-13).
That record owns the final-build Lighthouse results, accepted asset/settings and
retained phone-measurement limits. FS-4.7 stays closed; its historical missing
final Lighthouse rerun is superseded by FS-4.8B, not rewritten as an old PASS.
FS-G2 still requires EPIC 5 contact acceptance.

## FS-4.7B — bounded correction disposition — 2026-10-13

**No additional correction needed for the supplied findings.** The requested
Sites correction checkpoint was checked against the
[current Codex re-review](#fs-47a-correction-re-review--2026-10-13), which closes
A1–A5. Historical CHANGES REQUIRED entries below do not reopen those findings.
No new scene/UI/runtime defect was assigned in this request.

Candidate remains branch `feature/funkspace-minimum-usable`, HEAD
`749342717ddac85b67a3275d669363ef9bf86d2e`, plus non-documentation patch SHA-256
`777659cbba4b81d64e417d84596ffdbbf23cf63ee6e63478b30652dee978342b`.
The current pending file set and all 46 file hashes match the accessible FS-4.7A
evidence manifest. This checkpoint adds only this documentation section; there
is no new implementation/test diff, build or independent approval claim.

| Supplied finding               | Current reviewed disposition                                       | FS-4.7B action                                  |
| ------------------------------ | ------------------------------------------------------------------ | ----------------------------------------------- |
| A1 — initial JavaScript        | Closed; measured growth below 15 KiB in both flags.                | None; retain current delivery and budget.       |
| A2 — media API setup crash     | Closed; optional setup/cleanup and production failure cases pass.  | None; retain static fallback.                   |
| A3 — contracts / contrast      | Closed; approved UI contracts and contrast gate retained.          | None; no shared-policy handoff needed.          |
| A4 — Storybook scan/readiness  | Closed; unfiltered scan and readiness checks pass.                 | None; retain regression coverage.               |
| A5 — browser/focus regressions | Closed; automated checks and Dimi's reported manual PASS recorded. | None; retain focus, Pause and pointer behavior. |

Validation for this documentation-only disposition: candidate file-set/hash
comparison, review/contract consistency, section link, Prettier and
`git diff --check`. All pass. Defect reproduction and new regression tests are
not applicable because no unresolved defect is assigned; unit/browser/build and
performance checks were not rerun. The preceding re-review's 1,906 tests and 170
browser checks remain evidence from that review, not new results from this step.

**Return to Codex / FS-4.7A:** no corrected source requires another independent
re-review. Continue the outstanding measured-evidence work against this exact
candidate: P01 phone traces/conditions and P02 current-candidate Lighthouse and
final measurement packet. Missing measurements are not reclassified as cosmetic
or silently passed. H01 / FS-4.8 remains open; no final acceptance is attempted.
Dimi's manual PASS remains accepted for its stated scope.

Unrelated pending work, shared motion policy and all running previews are
preserved. No commit, push, PR, deployment or external handoff message was made.

## FS-4.7A correction re-review — 2026-10-13

**Current correction verdict: PASS; A1–A5 closed for the pending patch. No new
actionable source finding. Dimi-reported manual smartphone/Safari/Firefox tests:
PASS. Overall FS-4.7 remains BLOCKED on the measured evidence listed below;
FS-4.8 acceptance remains open.** This dated entry supersedes the correction
handoff and missing manual-confirmation status below, without rewriting their
historical results.

### Request, candidate and review scope

Dimi reports: “I done all manual tests on my smartphone, safary and firefoxe,
all test pass” and requests documentation and re-review of all changes required
for `7493427`. This closes the outstanding user-reported usability confirmation,
including the subsequent touch-hover and Safari focus repairs. It is a manual
result supplied by Dimi, not a Codex-observed device session. No per-case checklist,
current phone/browser/OS versions, viewport/DPR/refresh, timings or trace files
accompany the report. Do not infer numeric budget compliance, a specific screen
reader result, a timed comfort session or formal FS-4.8 acceptance from it.

Reviewed branch: `feature/funkspace-minimum-usable`; HEAD:
`749342717ddac85b67a3275d669363ef9bf86d2e`. The complete pending
non-documentation patch includes 46 tracked/new implementation, configuration,
generated-asset and test files. SHA-256:
`777659cbba4b81d64e417d84596ffdbbf23cf63ee6e63478b30652dee978342b`.
The [re-review evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.7a-rereview-2026-10-13/README.md)
contains this patch, per-file hashes, exact external test configurations, results
and current bundle inventory. Documentation has its own final snapshot/hashes.

Codex performed this source-read-only review in the same chat as implementation;
it is not a second human reviewer. Only the five current status/task documents
were edited. The full pending diff and new files were inspected against the
current contract, prior finding resolutions and architecture checklist: icon
source/delivery/geometry, optional header setup and cleanup, navigation focus
ownership, offscreen Pause permission, hover/contrast, build isolation and test
contract changes. Domain/controller/Canvas renderer, shared-service ownership,
tokens and game integration remain unchanged by these corrections. No new
dependency, scheduler, settings authority, engine or relaxed threshold was found.

### Finding dispositions

| Finding                         | Re-review disposition | Evidence                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1 — initial JavaScript         | **PASS / closed**     | Current On growth 2.11 KiB and Off 1.71 KiB, below the approved 15 KiB. Sprite transfer remains separately counted; source/export geometry and current Firefox pixels pass.                                                                                                                                                                       |
| A2 — media API setup crash      | **PASS / closed**     | Optional setup is contained and partial cleanup is idempotent; current full adapter suite and production throwing getter/call, missing media, storage and no-JS cases pass in both compiled flags.                                                                                                                                                |
| A3 — stale contracts / contrast | **PASS / closed**     | Assertions match Dimi's recorded spacing, typography, current-page, compact status and footer amendments. The existing 4.5:1 settings-text gate is preserved; no assertion is weakened to accept low contrast. Prior complete correction checks remain identified below.                                                                          |
| A4 — Storybook scan/readiness   | **PASS / closed**     | One explicit unfiltered Axe owner, violation negative control and font/layout readiness; fresh form-field, essential-set and sticky-header browser checks pass.                                                                                                                                                                                   |
| A5 — browser/focus regressions  | **PASS / closed**     | Pointer targets retain their position, keyboard clearance and offscreen Pause retain focus, and exact paint assertions remain. Current On/Off navigation lifecycle/focus/touch checks and Firefox focus/icon checks pass; Dimi reports manual browser/phone PASS. Earlier responsive/hydration delivery checks retain their own candidate labels. |

The later preview repair uses separate `.next-dev`/`.next` output. Touch hover
depends on pointer capability; Safari focus styling follows existing captured
input without changing actual focus. Keyboard cues recover immediately and
overlapping navigation owners release their resources. Their task records now
include Dimi's manual confirmation rather than leaving it pending.

### Current build and validation evidence

| Flag | Production build ID     | Homepage modern gzip JS | Growth from same-flag 177,754 B baseline |
| ---- | ----------------------- | ----------------------: | ---------------------------------------: |
| On   | `KjrafQG-kqcdKVfCguqkh` |               179,919 B |                       2,165 B / 2.11 KiB |
| Off  | `ZPhT2a3xV2ue9gjrGfEF3` |               179,501 B |                       1,747 B / 1.71 KiB |

Method: unique initially required modern scripts in generated HTML, gzip level 9,
mtime 0; compatibility scripts listed separately. Details-route initial JS is
179,900 B On / 179,482 B Off. Sprite remains 52,285 B raw / 22,456 B gzip;
removing executable artwork does not eliminate its network transfer. On is the
existing final focus-repair production build at :3001; Off was freshly compiled
from the current source in `/private/tmp/fs47-rereview-off`, tested on isolated
:3797. All 46 pending non-documentation file hashes match that copy. Existing
development and production previews were preserved.

Fresh checks for this review:

- `pnpm coverage --maxWorkers=2`: **123 files / 1,906 tests PASS**. Statements
  87.48%, branches 85.37%, functions 86.37%, lines 89.64%; existing thresholds.
- Frontend `tsc --noEmit`, `pnpm typecheck:validation`, `pnpm lint`: **PASS**,
  including icon/bootstrap freshness, ESLint and repository formatting.
- `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm --dir /private/tmp/fs47-rereview-off build`:
  **PASS**, including token generation, common types, aperture checks and required
  standalone game compilation. On and Storybook builds are the successful latest
  focus-repair builds, reused without claiming a new build in this review.
- Production Chromium: **64/64 On and 64/64 Off PASS**, one worker, zero retries.
  Each run includes 43 route/dialog/touch/focus cases and 21 startup cases.
- Firefox: **10/10 PASS**, five exact icon/fallback cases and five pointer/keyboard
  route/dialog focus cases, one worker, zero retries.
- Static Storybook: **32/32 PASS**, form-fields, essential-set and sticky-header,
  isolated :3798, one worker, zero retries.
- Documentation links/content, formatting and `git diff --check`: **PASS**.
  Source hashes remained unchanged throughout this documentation/review task.

Local environment: Node 22.22.0, pnpm 10.30.3, Playwright 1.55.1, installed Chrome
154.0.8037.98 and automated Firefox 146.0.1 on the previously recorded macOS host.
The manual Safari/Firefox versions in Dimi's new report are unspecified. No
Safari automated run is claimed here. Prior full production suites, standalone
browser checks, import graph, resource probes and Lighthouse results are retained
with their original candidate and are not silently counted as fresh executions.

### Remaining measured gate and FS-4.8 handoff

The original section 7 matrix below belongs to clean `7493427`. Its A1–A5 failures
are resolved by the correction evidence above; its absent general phone/Safari
manual result is superseded by Dimi's report. It is not a newly measured complete
acceptance matrix for this changed candidate.

- **P01 remains BLOCKED** for the required current phone default/maximum callback
  CPU and frame-delivery evidence: device/browser/build/viewport/DPR/refresh,
  three 30-second samples after warm-up, raw samples/traces, separate paint and
  compositing, and the recorded comfort-session conditions. The JS sub-budget
  passes. Dimi's existing measurements can supply this packet; no failed phone
  behavior or need to repeat completed manual tests is inferred.
- **P02 current-candidate rerun: NOT RUN in this review.** The prior On/Off
  Lighthouse LCP/CLS PASS and On score warning remain historical, with unchanged
  5,000 ms / 0.1 assertions and 0.9 warning. A final measured packet must bind
  those checks and sustained/resource evidence to its exact candidate; local
  sample aggregation is never field p75.
- **H01 / FS-4.8 remains open.** After the measured packet is complete, present
  the exact candidate and any remaining limitations for Dimi's explicit EPIC
  acceptance. The manual report is accepted for its stated scope; no unrelated
  release, legal, export or remote-action approval is inferred.

No implementation repair, commit, push, PR or deployment occurred in this review.

## FS-4.7A correction — implementation and validation — 2026-10-12

**Technical correction verdict: PASS for the locally validated A1–A5 scope.**
This is a changed candidate for independent re-review, not independent closure or
Dimi acceptance. Required physical Xperia / MacBook Safari evidence remains
**BLOCKED**, as directed by Dimi; FS-4.8 remains not started.

Dimi explicitly requested fixing all current findings. That authorizes these
bounded implementation changes after the read-only review, not commit, push or
deployment. One writer; pre-existing review/feature documentation and unrelated
work were preserved. Base: `749342717ddac85b67a3275d669363ef9bf86d2e`, branch
`feature/funkspace-minimum-usable`. The complete non-documentation correction
patch (including generated and new files) has SHA-256
`ecbbcf1ef2ed5bcec85b42fd4c1ff025ff7a51e6278ac9df649caa61853d7f19`.
All 35 implementation/test/generated files match both final build copies and
the repository; no commit was created. Documentation is recorded separately.

[Accessible correction evidence](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.7a-corrections-2026-10-12/README.md)
contains the exact patch, per-file hashes, build IDs, commands/configurations,
raw reports, failures, screenshots and traces. Builds are isolated under
`/private/tmp/fs47fix/delivery-on` and `delivery-off`; existing :3000 / :3391 previews
and the earlier review builds remain untouched. Actual local environment remains
Mac17,2 / Apple M5, macOS 26.7, Chrome 154.0.8037.98, Firefox 146.0.1,
Playwright 1.55.1, Node 22.22.0 and pnpm 10.30.3. Headless desktop results do not
establish phone performance, physical refresh, Safari support or comfort.

### Bounded corrections and retained contracts

- **A1:** the 11 category/social icon families now use a generated same-origin
  SVG sprite (33 authored sizes). Inline control icons, public Icon props,
  accessible titles, Figma geometry and semantic colors remain intact. The
  source registry feeds `build:icons`; `check:icons` detects drift. Development,
  production and Storybook builds generate the asset. Exact PNG comparisons
  across all four themes and three sizes test external references against inline
  artwork in Chrome and Firefox; original export geometry is also checked.
  Missing sprite leaves named navigation operable. No engine, dependency,
  renderer migration, threshold relaxation or delayed navigation was introduced.
- **A2:** sticky-header setup now contains media API getters/calls and partial
  setup failures. Its idempotent cleanup releases every acquired resource even
  if one disposer throws, removes enhancement attributes and preserves the
  usable static header/homepage. Actual production throwing-getter/call cases
  are exercised in both compiled flags. Existing anchor clearance is retained.
- **A3:** updated stale assertions to the approved 96px section gap, 500 button
  weight, screen-reader Motion status, disabled current destination, stationary
  Off header and Privacy policy label. Appearance/Motion hover text keeps
  primary contrast; the border supplies the semantic hover accent. A conflicting
  navigation test was strengthened from 3:1 to the existing 4.5:1 settings gate.
  No accessibility rule, native navigation, focus or no-JavaScript check was removed.
- **A4:** form-field fixtures select manual addon mode before rendering; their
  explicit unfiltered Axe scan is the sole owner. A deliberately unnamed button
  proves violations are detected, then is removed before the clean scan. Sticky
  Storybook measurements wait for fonts and delivered layout frames rather than
  a fixed sleep. The implicated suites are repeated without retries.
- **A5:** pointer focus no longer scrolls a button between press/release, fixing
  Firefox's missed Pause click; keyboard clearance remains. The menu launcher
  retains a consistent compositing origin across hydration; exact paint checks
  retain zero tolerance. Enlarged mobile footer targets gain one semantic spacing
  increment of menu clearance. Hydration tests reveal the approved hidden header
  before clicking. Firefox geometry uses the painted path's screen transform and
  declared mask geometry; target minima use native integer layout dimensions.
  Chromium-only CDP touch is explicitly excluded from Firefox evidence.
  Additional Firefox landscape checks exposed partially clipped native keyboard
  focus at the viewport bottom. The existing adapter now clears that lower edge
  on tablet/desktop, including when a tall header disables stickiness. Pointer
  targets remain untouched. Two adapter cases cover enabled/oversized headers;
  original browser geometry assertions are retained (a polling-only experiment
  did not fix the issue and was removed).
- **Additional A5 regression discovered during correction:** at 320×568 / 200%
  text, tabbing to Pause scrolls the artwork offscreen; disabling that focused
  control lost keyboard focus (three unchanged repeats failed). A ready scene
  now accepts local Pause/Resume intent while offscreen, with intro/cover/occlusion
  and hard-policy restrictions retained. The controller still forbids hidden
  playback. A real-controller unit regression verifies focus, Pause persistence,
  hidden Resume suppression and Off disabling; the original browser focus/geometry
  assertions are unchanged. Only scene presentation changed; simulation,
  controller, renderer and scheduling remain untouched.

### Fresh budget and build evidence

| Compiled flag | Build ID                | Initial modern gzip JS | Growth over same-flag 177,754-byte baseline | Approved ceiling |
| ------------- | ----------------------- | ---------------------: | ------------------------------------------: | ---------------: |
| On            | `FIl1YqNWzN4N8GEQgY8uA` |              179,379 B |                          1,625 B / 1.59 KiB |           15 KiB |
| Off           | `O1fKPQWDjbKx-rETOLBvj` |              179,381 B |                          1,627 B / 1.59 KiB |           15 KiB |

Method is unchanged: unique modern initial scripts from generated route HTML,
gzip level 9 / mtime 0; no-module compatibility payload listed separately. The
sprite is **52,285 B raw / 22,456 B gzip**, separately requested and cached. This
moves artwork out of executable JavaScript and shortens HTML; it does not claim
that all removed JS bytes disappear from network transfer. Per-route script,
HTML and sprite hashes/bytes are in `bundle-delivery.json`. Homepage runtime
import graph: 83 local files / 201 edges; zero game paths/imports. Lazy Canvas and
game isolation remain separately checked; shared services retain their owners.

### Validation performed

| Check                            | Result and candidate scope                                                                                                                                                                                                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Full unit/coverage               | **PASS**, 123 files / 1,905 tests on delivery, two workers; statements 87.41%, branches 85.17%, functions 86.37%, lines 89.57%. Existing thresholds/exclusions unchanged.                                                                                                                                                |
| Types / lint / generated checks  | **PASS**: frontend + validation TypeScript, ESLint, Prettier, icon/bootstrap freshness; build checks aperture assets.                                                                                                                                                                                                    |
| Production / Storybook builds    | **PASS**, separately compiled delivery On/Off plus Storybook.                                                                                                                                                                                                                                                            |
| Full Chrome production           | **367/367 On + 367/367 Off PASS** on the immediately preceding candidate, before the final lower-edge adapter correction.                                                                                                                                                                                                |
| Final affected production        | **91/91 On PASS, clean exit** on delivery; **112/112 Off PASS, clean exit** combines the same 91 affected cases with 21 startup cases in one worker. Six affected suites include hydration, exact paint, keyboard, scene, native fallback and stationary/moving headers.                                                 |
| Final startup fault matrix       | **21/21 On PASS, clean exit**; all 21 Off startup cases pass in the clean 112-case run. Includes actual throwing media getter/call, blocked storage and no-JS.                                                                                                                                                           |
| Firefox                          | **109/109 portable scene/navigation/icon checks PASS** before final lower-edge correction; final **12/12 PASS**, three repeats each of short-landscape 100/200%, mobile 200% Pause focus and actual Pause/OS lifecycle, original strict assertions, clean exit. Chromium-only touch excluded, not counted PASS.          |
| Storybook browsers               | **171/171 PASS**, then **96/96** threefold repeats for form-fields/essential-set/sticky; final adapter receives new build and **15/15** sticky repeats. No retries/rule filtering.                                                                                                                                       |
| Standalone game                  | **PASS**, types + compiled demo; **18/18** browser regressions using existing unbundled mock/runtime fixture. No game imports in homepage graph.                                                                                                                                                                         |
| Cold resources / optional bundle | **PASS**, five fresh contexts per flag, zero page errors. Optional Canvas aggregate **2,721 B gzip**, under 35 KiB; no optional scene request for denied System/reduce or no-JS, or any flag-Off sample. Explicit Reduced/Off still preparation remains the accepted contract.                                           |
| Lighthouse                       | **PASS** LCP/CLS in both compiled flags, three serial samples each: On LCP 3,117–3,207 ms, Off 444–448 ms; CLS 0 in all six. On performance 80/82/81 retains the ≥90 warning; Off 100/100/100. Same desktop DevTools latency/throughput and local p75 aggregation; not field p75. No intro cost is attributed to Canvas. |

Sprite network body is **22,014 B encoded / 52,285 B decoded** in local Next
responses (different compressor from the standardized gzip-9 inventory); a later
cached reference has zero body bytes. The cold-load screenshots retain the current
WEB/nav artwork; the default On capture was visually inspected. These samples do
not replace sustained performance/device measurements.

Earlier correction iterations remain in the evidence packet: the first full
scoped run had five stale hover assertions in each flag, plus the real enlarged
Pause focus failure in On. Corrected contrast journeys passed 18/18 per flag;
the unmodified failing focus journey reproduced three times before the source
correction. Initial broader sprite experiments and interrupted runs are diagnostic
history, not final passes. No failed run is silently relabeled green. The final On affected run completed
naturally with exit 0. Final Off affected/startup runs passed all 91/21 assertions
but stalled after browser shutdown and were interrupted (exit 130); their clean
rerun is recorded separately. A full coverage run under concurrent browser load
had one fixture timeout; the complete unchanged gate passes with two workers.
One theme command omitted the required test flag, and a game harness initially
used bundled preview instead of its unbundled interception fixture; corrected
commands and failed raw logs are retained, not inferred application defects.

### Limits and independent re-review handoff

Re-review this exact changed patch/build pair for A1–A5. The original acceptance
matrix below records the clean `7493427` review and is historical for this changed
candidate; correction checks do not silently rewrite all rows to PASS. No fresh
three-by-30-second defaults/maxima CPU, frame delivery, paint/compositing or
physical-device session is claimed in this implementation pass. The particle
loop/domain/controller/renderer are unchanged; the prior timing packet remains
identified with its original candidate. Current phone/browser/refresh, comfort
and Safari evidence still block the required device rows. Dimi's acceptance and
FS-4.8 remain separate; no export or approval is invented.

## FS-4.7A — current candidate review — 2026-10-12

Historical review of clean `7493427`, before the authorized correction above.
Its verdict and matrix remain attached to that original candidate.

**Technical verdict: CHANGES REQUIRED. Required device evidence: BLOCKED.**
The available local FS-4.7A review is complete; FS-4.7 acceptance is not complete
and FS-4.8 is not ready. Dimi requests a fresh measured review after the
extra maintenance tasks. Pinned clean source:
`749342717ddac85b67a3275d669363ef9bf86d2e` on
`feature/funkspace-minimum-usable`; no implementation patch. Existing findings
and measurements below remain historical, not current passes. The scene source
is protected throughout review; only review documentation and bounded evidence
artifacts may change. No commit, push or deployment is authorized for this task.

The supplied `/Users/dimi/Downloads/FunkSpace_EPIC_4_Detailed_Plan.md` sections
4/7/9, accepted FS-4.1 resource table and later R18–R26 amendments govern this
review. Current defaults are 286 / 0.2× / 0.1× / 100 links / 6× reach; maxima are
1000 / 2× / 4× / 100 / 10×. WEB is built in; R5 repository-authored assets and
R21 circle removal supersede the original export/circle prerequisites. No
original Illustrator export or physical-device observation is invented.

Plan: verify source/import graph and prior resolutions; run prerequisite order,
types/lint/coverage, independently compiled On/Off builds, Storybook and
production regressions; then serial cold-load/Lighthouse, sustained timing and
resource/failure probes. Retain three 30-second samples after five-second warm-up
for desktop and explicitly emulated mobile defaults/maxima. Map every section 7
row and return bounded owner findings. Existing preview is preserved through
isolated `/private/tmp/fs47a/on` and `/private/tmp/fs47a/off` copies and ports.

Evidence packet:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.7a-review-2026-10-12/`.
Source hashes, full pre-scene-to-current diff and measurement harnesses are
retained there. Dimi explicitly directs missing current Xperia and MacBook
Safari evidence to remain **BLOCKED**, while available local work proceeds.

### Current candidate and fresh checks

Full historical comparison: 248 files; SHA-256
`01d62b2a4bc4d28b6c81bacac2671810056d7a08ed1e71c464cd8d728377478d`.
Supplied plan SHA-256:
`9b910c45941989d599cd8bfe0109c17f0a4792d46cfec8ea8a1d68150cc57178`.
Independent production build IDs: On `FIC54XLNZn67t_HSlQo0U`, Off
`-rKoUN5NPo40W1qFYm3wd`. Both use actual compiled flags and identical source;
generated files match the pinned candidate. No implementation/test patch.

Actual local environment: Mac17,2 / Apple M5 / arm64, macOS 26.7 (25G229),
Chrome 154.0.8037.98, Firefox 146.0.1, Playwright 1.55.1, Node 22.22.0,
pnpm 10.30.3. Headless delivery is not physical refresh. Built-in display refresh
was not reported; external displays report 50/60Hz. Xperia browser/version/
viewport/DPR/refresh and current Safari observations remain missing.
Existing :3000 and occupied :3391 previews were preserved; On tests used :3591.

The [accessible local evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.7a-review-2026-10-12/README.md)
retains exact commands, results, hashes, traces, screenshots and review-only
harnesses. Artifacts are outside Git; remote reviewers need the packet or a
reproduction. Baseline files were actually read and copied with hashes.

Reviewed the full diff inventory, runtime/shared-boundary deltas, affected tests,
prior resolutions and current amendments. Resolved homepage/layout graph:
82 files / 199 edges, including the lazy Canvas edge, no game-runtime import.
Domain stays pure; scheduling/geometry stay in adapters; construction stays in
`createServices`. No per-frame React state or competing preference authority;
scene consumers do not initialize/dispose shared services. Historical F1–F7
remain closed for their original candidate; later changes need fresh evidence.
The new scan collision below is outside the corrected essential-set fixture.
The previously fixed initial-anchor clearance is not reopened.

| Check                                                           | Fresh result                                                                                                                                                                                                |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prerequisite order and types                                    | PASS: bootstrap freshness before generation; tokens; common types; game build before frontend consumers; frontend and validation types.                                                                     |
| Focused Domain/controller/actual-adapter/shared regressions     | PASS: 35 files / 516 tests.                                                                                                                                                                                 |
| Full tests and configured coverage                              | PASS: 123 files / 1,897 tests; statements 87.36%, branches 85.02%, functions 86.27%, lines 89.54%. Unchanged denominator/gates; not every tested layer is in coverage.                                      |
| Dedicated bootstrap coverage                                    | PASS: 5 files / 61 tests; 100% of its configured scope.                                                                                                                                                     |
| Lint                                                            | PASS; existing lint-command deprecation remains.                                                                                                                                                            |
| Separate On/Off app builds, Storybook build, aperture validator | PASS; existing Storybook chunk advisory remains.                                                                                                                                                            |
| Full Chrome production On                                       | FAIL: 348 pass / 14 fail / 362; no skips/retries.                                                                                                                                                           |
| Full Chrome production Off                                      | FAIL: 344 pass / 18 fail / 362; no skips/retries.                                                                                                                                                           |
| Dedicated theme startup On / Off                                | FAIL: each 19 pass / 2 fail, media-call/media-access crash. Storage access/read/write and absent-media cases pass.                                                                                          |
| Full Storybook Chrome                                           | FAIL: 164 pass / 6 fail / 170; four weight expectations, Axe collision, sticky-header hide observation.                                                                                                     |
| Unchanged form-fields / sticky-header repeats                   | 52 pass / 2 Axe failures / 54; all 15 sticky-header cases pass. Cleanup stalled after cases; interrupted exit 130, not a clean suite pass.                                                                  |
| Supplemental BFCache                                            | PASS once per flag with actual persisted pageshow. External copy changes only module resolution/installed-Chrome launch; every assertion retained. Original bundled-browser setup failures remain recorded. |
| Selected Firefox regressions                                    | FAIL: 95 pass / 10 fail / 105; two subpixel targets, six SVG bounds, unsupported mobile/CDP fixture, one Pause interaction. Pause case fails 3/3 unchanged repeats; see A5.                                 |
| Installed WebKit                                                | BLOCKED before page creation: Playwright 1.55.1 / WebKit 2248 protocol error, “Only page targets are expected … frame”. No Safari result inferred.                                                          |
| Standalone game                                                 | PASS: types, 58 files / 920 tests, demo build, 18 Chrome browser checks. No game source changes; shared/composition changes justify regression.                                                             |

`browser-gates.json` retains individual outcomes, including direct routes,
navigation/theme/logo, controls, delayed hydration and no-JS. No threshold,
scan rule, assertion or retry policy was weakened. The external BFCache copy's
exact change is `bfcache-harness.patch`, SHA-256
`f61a5c0016c6bc6c61e698df0f758a15e71a4b77fd887498bdb3658ef7a5f935`;
it does not change product identity.

### Lifecycle, failures and replacement

Twenty navigation cycles provide 141 snapshots; document origins show full
departures, so these alone are not same-document leak proof. Twenty additional
same-document mount/replacement/Reset/destroy cycles (101 snapshots), plus
20 actual-composition subscription cycles, provide complementary evidence.
Mounted maxima: one Canvas, one pending scene RAF, one ResizeObserver, one
IntersectionObserver, one context-loss listener, one resolution listener and
one theme/motion consumer subscription each. Settled paused/hidden RAF is zero;
destroyed scenes retain zero owned Canvas/listeners/observers/subscriptions.
These counts exclude logo/shared resources. Visibility is explicitly injected,
not described as a physical background-tab test.

Actual homepage fillRect, arc, setTransform, stroke, append and removal-after-
native-removal faults all leave solid WEB, no Canvas, settled scheduling and
usable navigation. The removal probe does not certify permanently hostile DOM
removal. Current adapter/controller/browser tests cover delayed/rejected prepare,
late resolution after destruction, null/lost Canvas, missing palette, missing/
delayed/rejected assets and late image errors. Off/no-JS retain independent art.

WEB/diamond replacement retains the existing handle/Canvas. Domain and Canvas
update modules have no aperture-geometry dependency. Trusted export validation
passes. R5 supersedes Illustrator delivery; R21 supersedes circle fallback.
These are repository-authored assets, not Dimi originals. Practical replacement
and visual acceptance remain distinct FS-4.8 evidence.

### Bounded findings and owners

1. **A1 — P2, initial JavaScript budget FAIL; Sites integration owner.** Unique
   modern initial gzip: **201,193 bytes On / 201,195 Off**, versus same-flag
   pre-scene **177,754**. Growth **23,439 / 23,441 bytes (22.89 KiB)** exceeds
   the approved **15 KiB** by 8,079 / 8,081 bytes. This is whole-candidate growth,
   including navigation/icons/shared maintenance, not all Canvas. Inspect initial
   dependencies and bounded loading/splitting, then remeasure both flags. Keep
   the approved budget; no engine/worker/WebGL migration.
2. **A2 — P2, fail-open homepage regression; Sites sticky-header owner.**
   `frontend/infrastructure/dom/StickyHeaderBinding.ts:12–15` reads/calls
   `matchMedia` outside failure containment. A throwing getter or call escapes
   the shell effect and replaces the page with Next's client exception screen
   in both builds. Existing theme-startup tests and traces reproduce both.
   Preserve the static page/header on failed setup, clean up anything acquired,
   add bounded adapter coverage and rerun both existing fault cases. This is
   separate from the closed anchor-clearance finding.
3. **A3 — P2, integrated validation drift; navigation/control test owners.**
   Reconcile recorded approvals with stale expectations: About gap 192→96px;
   button weight 700→500; visually hidden Motion status; disabled current About;
   stationary sticky header in Off; “Privacy policy” versus “Privacy”. Preserve
   native/focus/no-JS/accessibility coverage. Light Motion hover still fails the
   existing 4.5 project assertion at **3.0204** (24px/600). Large-text semantics
   differ, but this review neither relaxes the gate nor invents approval. The
   shared accessibility owner must reconcile the actual current contract.
4. **A4 — P2, scan ownership; Storybook validation owner.** Explicit scans in
   `e2e/storybook/form-fields.spec.ts:26` collide with the addon: once in the full
   run and twice in three repeats. Apply the established single-owner pattern;
   retain unfiltered scans and a negative control. No swallowed error/fixed sleep.
   Review readiness for the first sticky-header light failure; 15 repeat passes
   do not erase that failure or the cleanup interruption.
5. **A5 — P2, unresolved interaction/paint gates; navigation/scene UI owners.**
   Desktop hydration click timeouts, exact trigger PNG differences and Off
   390×844/200% focus failure remain open. Some assumptions predate sticky
   behavior; reproduce real journeys before choosing source/test correction,
   preserving accepted hydration/focus behavior. Firefox's repeated Pause case
   is **not loss of a confirmed Pause**: diagnostic clicks miss the button and
   status remains “playing” before the OS change. Resolve click/scroll/layout
   readiness, then rerun unchanged lifecycle assertions. Its SVG tests measure
   mask definitions/nested viewport bounds; painted-path captures match Chrome
   closely. Make measurements portable without merely widening tolerances.
   CDP/isMobile supplies no Firefox touch evidence; retain the older subpixel
   target follow-up separately. Not all ten failures are product defects.

Sites owns bounded corrections; Codex independently rechecks the changed
candidate. This is the owner handoff, not permission to repair/commit/push or
begin FS-4.8.

### Sustained performance and approved budgets

Each of four conditions retained **three 30-second traces after five seconds of
warm-up**, nearest-rank per-run/pooled p95, unthrottled installed headless Chrome,
System/OS-allow, visible page, built-in WEB, default seed `0x46533431`. Defaults
use the actual homepage; maximum uses the details page and native End-key slider
changes to 1000 / 2× / 4× / 100 / 10×. No concurrent review test/build/Lighthouse
work ran during these samples. Ordinary host activity is not controlled.

| Condition                | Viewport / DPR | Callback p95, runs 1/2/3 (ms) | Draw-submission subset p95 (ms) | Delivery interval p95 (ms) | Frames, runs 1/2/3 |
| ------------------------ | -------------- | ----------------------------- | ------------------------------- | -------------------------- | ------------------ |
| Desktop defaults         | 1280×720 / 1   | 0.8 / 0.8 / 0.8               | 0.8 / 0.8 / 0.8                 | 16.8 / 16.8 / 16.7         | 1801 / 1800 / 1800 |
| Desktop maximum          | 1280×720 / 1   | 1.3 / 1.3 / 1.3               | 1.3 / 1.3 / 1.3                 | 16.7 / 16.7 / 16.7         | 1800 / 1800 / 1801 |
| Emulated mobile defaults | 390×844 / 3    | 0.9 / 0.8 / 0.9               | 0.8 / 0.8 / 0.9                 | 16.8 / 16.7 / 16.7         | 1800 / 1800 / 1801 |
| Emulated mobile maximum  | 390×844 / 3    | 1.4 / 1.4 / 1.4               | 1.4 / 1.4 / 1.4                 | 16.7 / 16.8 / 16.8         | 1800 / 1800 / 1800 |

21,603 callbacks retained. No sampled long task or interval above 1.5× each
run's median. Per-frame non-draw remainder p95 is about 0.1ms in every run;
it includes update, transforms, scheduling and instrumentation, not pure Domain
CPU. Draw subset starts at fillRect; quantiles cannot be subtracted to derive
update cost. Raw precision and per-run/pooled samples remain in the packet.
These Mac results do **not** pass the required Xperia ≤6ms default / ≤10ms
maximum CPU or default ≤20ms delivery budget at verified 60Hz. Those remain
BLOCKED on real-device/browser/refresh evidence.

Traces separately contain Blink paint-update p95 **0.006–0.007ms**, compositor
commit **0.001–0.002ms**, DirectRenderer draw **0.009–0.047ms**, and presentation-
event interval p95 **17.06–17.50ms**. Events belong to different threads/processes
and may overlap; they are not added to callback CPU or called physical paint/GPU
latency. Generic Paint/RasterTask names are absent, not zero-cost proof. Raw
traces and `trace-analysis.json` retain counts/durations/GC observations.

Actual desktop raster is **1184×400 = 473,600 pixels**. Emulated mobile uses
CSS 319×200, raster **638×400 = 255,200 pixels**, proving the DPR-3 input is capped
at 2. Both remain below 4,000,000 pixels / 4096px sides. Observed particle counts
are 286/1000; CSS radii approximately 0.1003–0.2995 / 4.0077–11.9918px.
Observed line counts desktop 3810/4464, mobile 4171/4534, below 4800. Adversarial
Domain tests establish ≤38,400 candidate visits / ≤16 passes; these are not
claimed as browser counters. Raster/count guards PASS locally; phone heat,
stutter, input delay and comfort session remain NOT RUN.

Initial JS fails A1. Unique additional Canvas chunk is
`37.fdb5db788c83205a.js`: **6,206 raw / 2,721 gzip bytes (2.66 KiB)**, below the
35 KiB aggregate optional-runtime budget, with already-initial dependencies
excluded. It is fetched for enabled System/Reduced/Off; no optional chunk or
Canvas for System+OS-reduce, no-JS, or any disabled-build choice. All ten cold
captures have no page error; no-JS fetches no application scripts.
Actual enabled-System JS encoded/transfer bytes: **204,625 / 208,225**; denied
System: **201,897 / 205,197**; disabled build: **201,901 / 205,201**.
These transport totals include server compression/headers and are separate from
the identical Python gzip-9/mtime-0 budget calculation, independently reproduced.
Details-route initial gzip is 201,175/201,177 bytes; no pre-scene details route
exists for a like-for-like delta.

Homepage HTML raw/gzip On: **112,833 / 30,169**, baseline **68,658 / 16,458**;
Off: **112,835 / 30,170**, baseline **68,659 / 16,461**. This growth is recorded,
not assigned an invented byte ceiling. Settled default DOM counts are 454 On /
457 Off, with zero per-particle SVG circle/line nodes in Start. Asset selection
and masks remain independent of these DOM counts.

Twenty real menu clicks (ten defaults, ten maxima) at 1280×900 give p95 input
delay **1.0 / 0.6ms**, dialog-open mutation **3.8 / 2.0ms**, and two-RAF opportunity
**31.4 / 31.5ms**. Retained Event Timing maxima are 32/24ms. This is bounded local
responsiveness evidence, not field INP, physical paint latency or phone comfort.

### Lighthouse and pre-scene comparison

Both separately compiled builds PASS the unchanged three-run desktop DevTools
LCP≤5000ms and CLS≤0.1 local-p75 error assertions. Conditions: 1350×940 DPR 1,
150ms request latency, 9216 Kbit/s up/down, CPU multiplier 1. The score≥0.9
warning remains unchanged. Local sample aggregation is not field p75.

| Build | Current LCP, three runs (ms)   | CLS       | Scores                      | Accessible pre-scene comparison        |
| ----- | ------------------------------ | --------- | --------------------------- | -------------------------------------- |
| On    | 3138.821 / 3166.655 / 3130.983 | 0 / 0 / 0 | 0.81 / 0.81 / 0.82; warning | 3081.097–3093.192ms, CLS 0, score 0.82 |
| Off   | 447.822 / 443.310 / 443.875    | 0 / 0 / 0 | 1 / 1 / 1                   | 455.000–462.171ms, CLS 0, score 1      |

Baseline is the actual FS-4.1B capture at `1ab13095…`, retained with its original
date, same flag/profile and Chrome 154.0.8037.57; current Chrome is .98. It was
read, not rerun. Baseline hardware probes were restricted. Timing differences
are not a controlled causal estimate of Canvas alone.
Current unthrottled cold On capture reaches intro-visible at 2328.2ms, first
scene draw at 2344.8ms, and text-paragraph LCP at 2348ms. This is separate from
throttled Lighthouse and supports keeping intro/scene attribution distinct.
Real-clock Reduced second-tab waiting/menu/fading/visible phases also passed.

### Section 7 acceptance mapping — current candidate only

PASS below is scoped to the stated fresh local evidence. An overall row with a
required missing device/manual part is BLOCKED, even where local checks pass.
FAIL can identify an unfulfilled validation gate without claiming every failed
assertion is a product defect. Current amendments supersede stale plan wording.

| Row | Status  | Evidence and limits                                                                                                                                                                                                                                  |
| --- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S01 | PASS    | Pure deterministic seed/config/delta, reset and clamp regressions; current full suite.                                                                                                                                                               |
| S02 | PASS    | Invalid/extreme configuration tests, 1,000-count ceiling, radius/speed normalization and actual raster guards. Current source retains ≤4,800 lines, ≤38,400 candidate checks, ≤16 passes.                                                            |
| S03 | PASS    | Domain identity/relative-resize and actual-adapter DPR tests; browser resize behavior. DPR changes raster, not simulation physics.                                                                                                                   |
| L01 | PASS    | Actual-adapter tests and scene-owned probes: ≤1 pending RAF; settled Pause/destroy zero. Firefox failed click does not establish a paused controller violation.                                                                                      |
| L02 | PASS    | Delayed/rejected preparation, teardown generation and late disposal tests; real delayed import/route cases.                                                                                                                                          |
| L03 | PASS    | 20 same-document mounts and actual-composition subscription cycles, plus separate 20 route cycles; bounded counts above. No heap-retention certification beyond measured resources.                                                                  |
| L04 | BLOCKED | Chrome document/offscreen/overlay suspension and Pause preservation pass; Xperia real background/foreground and comfort observations missing. Injected visibility is labeled.                                                                        |
| A01 | BLOCKED | WEB/diamond local themes/aspects exercised; Safari/Dimi visual evidence missing, Firefox geometry-test portability unresolved. Circle wording NOT APPLICABLE under R21; Dimi-original-export prerequisite superseded by R5.                          |
| A02 | PASS    | Current concurrent-instance/ID/cover browser checks and SceneAperture tests; no logo-ID collision or exposed-strip failure in local checks.                                                                                                          |
| A03 | PASS    | Actual built-in WEB, rejected/missing/delayed second asset, mask capability and late-image failure coverage; complete fallback. Firefox mask-definition bounds failures are not accepted as painted-geometry evidence.                               |
| A04 | PASS    | Replacement changes selection/asset geometry, not Domain/Canvas updates; same mounted handle/Canvas retained in probe. Repository-authored provenance recorded, no invented Dimi export.                                                             |
| M01 | FAIL    | Normal pending/unknown/reduced/off/flag-off behavior passes, but throwing media API crashes the homepage via sticky setup (A2). Explicit Reduced/Off still-Canvas preparation is allowed by later amendments; denied System/flag-off remains static. |
| M02 | PASS    | Actual On override and independent feature/readiness/visibility/Pause gates pass in Chrome and current controller tests.                                                                                                                             |
| M03 | BLOCKED | Chrome Pause/theme/preference/environment/Reset checks pass. Firefox repeat fails before Pause activation (A5); required Dimi/device confirmation missing.                                                                                           |
| T01 | PASS    | Recolor-in-place and blocked storage access/read/write cases pass; no second settings authority. Separate media API crash is retained under M01/A2.                                                                                                  |
| C01 | PASS    | Current labels/effective values/help, native keyboard ranges, extrema and live control tests; maxima set through native End keys for measurements.                                                                                                   |
| C02 | PASS    | Stable Canvas/handle across sliders and Reset, retained local/global restrictions; no second preview loop.                                                                                                                                           |
| C03 | PASS    | Reopen retains local values, reload/new mount restores R20 defaults; no scene storage writes in regression coverage.                                                                                                                                 |
| O01 | PASS    | One-modal ownership, release-before-switch, opening failures, route teardown and scroll-lock tests.                                                                                                                                                  |
| O02 | FAIL    | Broad current focus gate remains red: old scrolled-invoker assumption, desktop hydration click and Off enlarged focus cases require bounded owner resolution (A3/A5). Earlier isolated passes do not close the gate.                                 |
| O03 | FAIL    | Native continuity cases exercised, but desktop hydration completion journeys and exact trigger paint checks fail (A5). Keep accepted focus/hydration contract; no relaxed screenshot assertion.                                                      |
| F01 | PASS    | Actual homepage Canvas failures retain complete art and stop scheduling; six additional exception probes plus null/context-loss regressions. A2 concerns a different shell failure and remains blocking.                                             |
| F02 | PASS    | Current no-JS artwork, semantic content and native navigation/controls pass. Broad legal-journey test has stale Privacy label; no-JS runtime is not called an overall full-suite pass.                                                               |
| P01 | FAIL    | Initial-JS delta exceeds approved budget (A1). Local sustained/raster evidence is recorded separately; required physical phone CPU/delivery/comfort evidence remains BLOCKED.                                                                        |
| P02 | PASS    | Actual separate On/Off builds pass unchanged Lighthouse LCP/CLS criteria; On score warning retained. Cold traces distinguish intro/scene work. Local comparison limitations above, no field-p75 claim.                                               |
| U01 | FAIL    | Current Chrome scene-control, forced-color and short/enlarged cases pass; broad Off focus and contrast gates remain unresolved. Manual/assistive/device parts BLOCKED, not replaced by Axe.                                                          |
| G01 | PASS    | Resolved import graph excludes game runtime; fresh standalone types/920 tests/demo build/18 browser cases pass after shared/composition changes.                                                                                                     |
| H01 | BLOCKED | Dimi has not accepted this exact candidate under FS-4.8. Technical failures and required device evidence remain open.                                                                                                                                |

### Technical handoff and FS-4.8 prerequisites

**CHANGES REQUIRED** for A1–A5; **BLOCKED** for required Xperia/Safari and human
acceptance. Local measurement completion is not technical PASS, Dimi acceptance
or EPIC completion. Complete bounded owner corrections, independently review
their exact diff and rerun affected gates/budgets; preserve thresholds and all
four motion choices. Record current Xperia XQ-CC54 browser/Android version,
actual viewport/DPR/refresh, three warmed default/max samples and comfort/input/
heat observations; obtain current MacBook Safari functional/visual evidence.
Then Dimi can review the exact homepage build, WEB appearance, static modes,
controls, practical replacement and phone readability for FS-4.8.

Only this task record and the feature-plan status change in the repository.
Application/test/generated sources remain unchanged. Documentation formatting,
local links, acceptance-row coverage, diff and final source integrity are checked
at handoff; exact review-document patch/hash is in the local packet. No commit,
push, PR, deployment, publication or source repair was performed.

### Earlier review history

Latest functional handoff: the [2026-10-05 pending-candidate review](#pending-candidate-review-and-authorized-delivery--2026-10-05) returns **PASS for the reviewed change scope**, with no actionable regression found. [Codex R3](#codex-r3--f7-correction-re-review--2026-09-30) previously closed F7; F1–F6 remain closed by R2. Overall FS-4.7 is **BLOCKED** on required Xperia/Safari evidence; FS-4.8 acceptance remains outstanding.

**Later tuning — 2026-10-01:** [R20 defaults](fs-4.1-scene-contract.md#r20--web-animation-defaults--2026-10-01) change count/speed/size to 286 / 0.2× / 0.1×. This review and its performance samples remain tied to the pinned earlier candidate (200 / 0.4× / 1×); no performance PASS for the new defaults is inferred. Required future default measurements must use R20.

**Later aperture correction — 2026-10-01:** [R21 implementation](fs-4.4-svg-aperture.md#built-in-web-correction--2026-10-01) removes the circle and bundles the trusted WEB opening to eliminate request-dependent wrong-mask rendering. Its focused tests and production/Storybook checks are functional evidence for a changed candidate, not new performance certification or closure of required device evidence. Future measurements must include this correction and R20 defaults.

## Pending-candidate review and authorized delivery — 2026-10-05

Dimi requested review of all uncommitted work, then explicitly authorized updating
documentation, committing and pushing it. The review left application sources
unchanged and returned **PASS for the bounded change scope**, not performance
certification, final visual acceptance or EPIC completion.

Candidate: `feature/funkspace-minimum-usable`, HEAD
`737d5fa9147eb9f3cac0ce0f3f8edc3c73e3ae8c`, plus all 76 pending files (including
16 untracked files). Complete pending patch SHA-256:
`9f695c976ee0640c45af8e4a70935117e7f4bfc818984960f838795277c8201e`.
The [review report and local evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/uncommitted-review-2026-10-05/review.md)
retain the complete diff, per-file hashes, exact commands, results and captures.
All candidate hashes were verified unchanged before this documentation update;
the delivery diff adds only this handoff and the feature-plan entry.

Reviewed scope: approved R20 particle defaults; built-in WEB/circle removal and
mobile fitting; scene action layout, icons, hidden status and slower reveal;
shared button typography; responsive navigation/settings sizes, secondary
appearance, headings and 4rem tablet/desktop section spacing; associated tests,
stories, asset provenance and decision records. No actionable regression was
found. Existing controller, policy and Canvas ownership remain intact.

Fresh checks on isolated copies of the exact candidate:

- `pnpm coverage`: 120 files / **1,850 tests PASS**. Configured coverage:
  statements 87.47%, branches 84.60%, functions 86.34%, lines 89.58%. These
  percentages cover the configured denominator, not every tested layer.
- `pnpm typecheck:validation` and `pnpm lint`: **PASS**.
- Separately compiled flag-On and flag-Off `pnpm build`, plus
  `pnpm storybook:build`: **PASS**. On build `8HiZA4Arzzw888KKyTx8y`;
  Off build `UJpbuW4s-rFbzE78PTVnl`.
- Chrome **154.0.8037.95**: **108 On + 58 Off + 58 Storybook = 224 browser
  checks PASS**, zero skips, unexpected failures or flaky outcomes; retries 0.
  Existing flag-dependent test branches remain distinct. Coverage includes
  navigation/focus, policy/Pause/customization, aperture fallback/replacement,
  responsive controls, accessibility and no-JavaScript routes.
- Mobile scene controls and desktop accessibility captures were visually
  inspected. Diff whitespace and source integrity checks pass; owned ports were
  released. Tests ran concurrently and supply functional, not timing, evidence.

No new Lighthouse, sustained frame/CPU, transfer or physical-device measurements
were made. Earlier measurements retain their own candidate/conditions and score
warning; Safari/Firefox and Xperia were not rerun. Required FS-4.7 evidence and
FS-4.8 human acceptance remain open. Existing lint-deprecation/chunk warnings and
two pre-existing historical FS-1.4 links to the removed story stylesheet are
recorded in the report. Commit/push authorization does not authorize deployment,
PR creation, merging or repository settings changes.

## Candidate and scope

- Owner/current writer: Codex review; Sites owns scene/UI/test corrections. Shared navigation/foundation owners retain their boundaries.
- Review revision: **R1, 2026-09-30 — CHANGES REQUIRED**, with required device/browser evidence also **BLOCKED**. This is not FS-4.8 acceptance.
- Candidate: `4e46dd1f7ce10c58362fc7b693816d0c602233f9`, `feature/funkspace-minimum-usable`, initially clean. No implementation patch.
- Full EPIC 4 diff: historical pre-scene `1ab13095edb3cf0c9b38897ddcbb75a16d0ff498` to candidate, 110 files; SHA-256 `c5e0d37e78f43d7b9c7c818b4f38d407669e01bf8fa6e9c13e8eab507bcab4da`. The historical reference was not a reset target.
- Contract: [FS-4.1 R19](fs-4.1-scene-contract.md), including R18 controls and the later explicit Reduced/Off-still, WEB Black, no-thumbnail and lightweight-fallback amendments. [FS-4.6 C7 / R2](fs-4.6-customization-overlay.md#codex-r2-closure-and-authorized-delivery--2026-09-30) closed its three original findings; that does not certify this wider audit.
- Supplied plan actually inspected: `/Users/dimi/Downloads/FunkSpace_EPIC_4_Detailed_Plan.md`, especially sections 4, 7 and 9. Its proposal-era restrictions are superseded only by explicit recorded amendments.
- Evidence: [local review packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.7-review/README.md). Candidate/source hashes, full diff, commands, reports, traces and screenshots are retained locally; no publication is implied.

Goal: independently measure and review the complete candidate, preserve application bytes, map every integrated acceptance row and hand bounded corrections to the responsible owner. No implementation repair, threshold change, new renderer, dependency installation, commit, push or deployment belongs to this review.

## Inspection and execution plan

Read repository AGENTS, README/package scripts, architecture/ADRs, workflow/task template, milestone, FS-3.6 closure/API handoff, current contract and prior review resolutions. Inspect the full diff, actual rules/controller/binding/Canvas/compositor/startup/overlay and their tests. Capture source hashes before generation; use isolated `/tmp/fs47/on` and `/tmp/fs47/off` checkouts from the exact commit with existing dependencies and separate caches/ports.

Check generated-bootstrap freshness first, then tokens → common types → standalone game build → frontend and validation types. Run focused and full tests, coverage, lint, both actual flag builds, Storybook and production journeys. Finish functional jobs before CPU/Lighthouse sampling. Keep callback CPU, browser frame delivery, compositor activity, resource counts, transfer, Lighthouse and human comfort evidence distinct.

## Environment and interpretation

Actual host: Mac17,2 / Apple M5, macOS 26.7 (25G229), Node 22.22.0, pnpm 10.30.3. Chrome 154.0.8037.92 is used headlessly for primary browser/measurement work. Installed automated Firefox is 146.0.1; it is distinct from a manual Safari/Firefox desktop session. Installed WebKit build 2248 cannot create a page through the repository's Playwright 1.55.1 protocol (`Only page targets are expected in WebKit, received: frame`). Its attempted cases are **NOT RUN**, not application failures or Safari PASS.

The selected physical device remains Sony Xperia XQ-CC54, Android 14; no substitute device was invented. Fresh phone OS/browser, CSS viewport/DPR/refresh and comfort/trace evidence have not been supplied. Headless 390×844 / DPR 3 is explicitly desktop emulation. Host displays include 60 Hz and 50 Hz external displays; headless callback cadence does not establish which physical display would present frames.

Build-time flags are compiled separately, not changed on an already-built server:

| Variant | Build ID                | Source guard                                                  |
| ------- | ----------------------- | ------------------------------------------------------------- |
| On      | `rXwyvMvwGWp5O4Z9FlF_B` | All 688 captured files match the pinned candidate after build |
| Off     | `MbUptQdcjT_izDJeJtnqw` | All 688 captured files match the pinned candidate after build |

The existing preview was not reused or stopped. Evidence-only scripts/configurations live outside the application tree. The subscription probe compiles the actual composition/controller/adapters into a review-owned browser harness; it is separately identified from the production consumer. It does not become an application module or a second production authority.

## Source and prior-resolution assessment

The runtime import graph from homepage/layout contains 80 project files and 182 edges, including dynamic imports, with no game path or game-package import. Domain remains pure and seeded; theme, mask, DPR and clocks do not become physics inputs. Current rules normalize all five controls, preserve survivors and relative resize coordinates, drop excess delta and distinguish seeded low-level reset from user defaults. One adapter owns frame scheduling; controller cancellation generations and terminal cleanup remain at their reviewed boundaries.

The shared resolver remains the single policy. Explicit Reduced/Off may prepare an opted-in still; System+reduction, unavailable/unknown policy, disabled flag and failure retain independent solid WEB. A ready scene freezes behind customization; there is no modal thumbnail or second loop. Original header identity and the introduction remain. No production particle-SVG graph was reintroduced.

The inspected historical FS-4.4 `asset-selection.patch` changes only the trusted descriptor and diagnostic SVG. Its protected rule/Canvas hashes remain in that packet. Fresh mounted WEB↔diamond replacement checks operate on the same current Canvas; current Domain/Canvas bytes are unchanged throughout this audit. Repository-authored assets were explicitly authorized by R5; an Illustrator export is no longer a technical prerequisite. Neither those exports nor unseen YouTube/Figma visuals are claimed to be Dimi's original visual evidence.

## Measurement protocol

Current defaults are count 200, speed 0.4×, size 1×, maximum degree 100 and distance 6×. Current maximum controls are 1,000 / 2× / 4× / 100 / 10×. Seed `0x46533431`, Light theme, opaque WEB Work Sans Black, System with no OS reduction and visible foreground document are held constant. Historical 3,200-particle rows do not override R18; no CPU/frame/bundle threshold is relaxed.

For desktop 1280×720 / DPR 1 and emulated mobile 390×844 / DPR 3, capture three 30-second traces per configuration after 5 seconds of warm-up. Defaults use the actual homepage; maxima use the actual details-page controls. Per-run and pooled nearest-rank p95 are retained. Each run must meet the applicable target; pooled success cannot hide a failing run. Instrumentation overhead is included, not subtracted.

Scene callback timing begins before its RAF callback and ends after draw submission/rescheduling. It is identified by the owned Canvas marker, excluding logo callbacks. A draw subset begins at `fillRect` and therefore excludes the preceding transform. Callback intervals measure delivery; Chromium compositor trace events and paint lifecycle durations are separate. They are not physical display latency, GPU-memory certification or field p75/INP. Count/radius instrumentation runs outside timed samples.

The approved phone targets remain p95 ≤6 ms at defaults and ≤10 ms at current maxima, plus default frame delivery p95 ≤20 ms under a measured 60 Hz condition. Desktop measurements cannot pass the missing phone requirement. The 20-cycle resource checks and 10-minute Xperia comfort session remain distinct.

## Technical verdict and bounded handoff

**CHANGES REQUIRED against the exact candidate above.** No new scene-runtime or shared-policy defect was reproduced in the available production journeys. The wider validation gate is not green: branch coverage fails and several checked-in browser assertions do not describe the accepted candidate or stable measurement conditions. Phone performance/comfort and Safari evidence remain unavailable. Earlier checkpoint PASS decisions remain historical facts; this review does not reopen EPIC 3/FS-G1 or infer final scene acceptance.

Locations below refer to the pinned source, not an implementation patch. Sites is the next correction writer; Codex does not repair its source in parallel.

| ID / severity                   | Location                                                                                                                                                  | Consequence and evidence                                                                                                                                                                                                                                                                          | Smallest correction / owner                                                                                                                                                      |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1 — P2, validation gate        | `vitest.config.ts:62–69`; coverage report                                                                                                                 | All 1,833 tests pass, but branches are **78.48% (744/948)** against unchanged **80%**. The coverage command exits 1. Scene diagnostic fixtures contribute uncovered branches; existing exclusions mean this metric is not a certificate for Domain/adapters.                                      | Add meaningful behavior coverage for uncovered paths, then rerun coverage. Do not lower thresholds or hide files. **Sites / test owner**.                                        |
| F2 — P2, stale assertions       | `e2e/home.spec.ts:7`; `e2e/portfolio-navigation.spec.ts:75–77`; `e2e/static-route-contract.spec.ts:14`; `e2e/theme-bootstrap/startup.spec.ts:334,341,398` | Five general production cases per flag and five dedicated theme cases still seek the old FunkSpace homepage heading. R19 correctly renders **Aperture - 1**. This prevents the full gates from passing; it is not evidence that the accepted heading is wrong.                                    | Update the obsolete expected heading while preserving semantic/no-JS/theme assertions. **Sites**.                                                                                |
| F3 — P2, flag-off test contract | `e2e/scene-customization.spec.ts:447–449`                                                                                                                 | The transparent-overlay journey unconditionally expects an invisible cover and visible Canvas after selecting Off, even in the separately compiled unavailable build. Fresh flag-off startup has no Canvas and retains solid WEB, as required.                                                    | Branch the final assertions on compiled availability: disabled build must retain solid artwork and zero Canvas; enabled explicit Off must retain the permitted still. **Sites**. |
| F4 — P2, Storybook gate         | `e2e/storybook/essential-set.spec.ts:246–247`                                                                                                             | `dialog > div` now matches header and content. Three viewport cases fail strict-mode selection before proving the intended scroll/reflow contract. The shared Dialog structure predates this candidate; do not infer a new layout defect.                                                         | Select the actual dialog content/scroll element and retain the original reflow/a11y checks. **Shared-control test owner / Sites**.                                               |
| F5 — P3, test-clock reliability | `e2e/home-intro.spec.ts:100,136`                                                                                                                          | Reduced second-foreground-tab test misses the transient `menu` phase under the installed fake clock and sees `fading`/`visible`. Cold real-clock Reduced startup retains waiting → menu → fading → visible, with first scene draw after visible. No new sequence/readiness defect is established. | Reconcile the fake-clock/WAAPI observation with the actual sequence; retain ordering and no-early-start assertions. **Motion/navigation test owner**.                            |
| F6 — P3, measurement stability  | `e2e/navigation-visual-regressions.spec.ts:100–117`                                                                                                       | On `/about` at nominal 375×720, raw `Page.captureScreenshot` is followed by a traced viewport change to **500×633**. The launcher moves from `(289.828,628)` to `(414.828,541)` with the viewport. Comparing those boxes does not prove a hydration alignment regression.                         | Keep viewport invariant across the screenshot/box comparison and rerun the failing narrow case. Preserve alignment/artwork assertions. **Navigation test owner**.                |
| B1 — required evidence blocked  | FS-4.1 resource/device decision; P01/L04/A01/U01/H01 below                                                                                                | No fresh selected Xperia trace/comfort results, physical 60 Hz confirmation, or supported Safari run. Desktop emulation cannot supply these results. Installed WebKit cannot create a page.                                                                                                       | Capture the explicit device/browser packet below on this candidate or the next pinned correction. **Dimi provides access/observations; Codex/testing owner measures**.           |

The three previously recorded Firefox subpixel assertions remain a **P3 non-blocking portability follow-up**: `navigation-composition.spec.ts:142` (320/375 widths, 47.999992 vs 48) and `navigation-query-removal.spec.ts:172` (799.866638 vs 800). Keep that prior disposition distinct from new evidence blockers. A Firefox mobile-context test cannot run because `isMobile` is unsupported; that is not a product failure. A concurrent Storybook Axe invocation also failed once with “Axe is already running”; an unchanged isolated rerun passed. Retain the raw failure rather than silently declaring the whole suite green.

## Measured results

### Callback CPU, frame delivery and browser trace work

Each entry is the three independent run p95 values in milliseconds, not a field percentile. Every run contains 1,800 or 1,801 observed scene callbacks. Raw samples and twelve compressed Chromium traces are in the packet.

| Condition                                | Callback update + submission p95 | Draw-submission subset p95 | Callback interval p95 | Non-draw remainder p95 |
| ---------------------------------------- | -------------------------------- | -------------------------- | --------------------- | ---------------------- |
| Desktop defaults                         | 3.3 / 3.3 / 3.5                  | 3.3 / 3.3 / 3.5            | 16.7 / 16.7 / 16.8    | 0.1 / 0.1 / 0.1        |
| Desktop maximum numeric controls         | 2.7 / 2.6 / 2.8                  | 2.7 / 2.6 / 2.8            | 16.8 / 16.8 / 16.7    | 0.1 / 0.1 / 0.1        |
| Emulated mobile defaults                 | 3.1 / 3.3 / 3.5                  | 3.1 / 3.3 / 3.4            | 16.7 / 16.7 / 16.8    | 0.1 / 0.1 / 0.1        |
| Emulated mobile maximum numeric controls | 2.7 / 2.9 / 3.0                  | 2.6 / 2.8 / 3.0            | 16.7 / 16.8 / 16.7    | 0.1 / 0.1 / 0.1        |

The non-draw remainder is calculated per callback before percentile aggregation; it includes updates, transforms, rescheduling and instrumentation. Timer quantization limits its interpretation. It is not a pure-domain microbenchmark or a subtraction of two p95 values. Defaults and maxima use different route geometry, so their CPU difference cannot be attributed solely to count. Maximum transparent-overlay rendering was not a separate timed condition; all numeric maxima above retain opaque WEB.

All twelve runs have zero observed long tasks and zero callback intervals above 1.5× their median interval. This satisfies the default ≤20 ms interval target in this **headless desktop sample only**. Phone ≤6/≤10 ms targets and measured physical-refresh certification remain **BLOCKED**, even though local CPU numbers fall below those numeric limits. A brief review-side JSON inspection occurred during the sampling window; no concurrent test/build/browser workload was run. Instrumentation/trace overhead and ordinary host activity remain included.

Actual trace event names were inspected instead of interpreting absent legacy event names as zero cost. Across runs, p95 `Blink.Paint.UpdateTime` is 0.011–0.020 ms; `Blink.CompositingCommit.UpdateTime` 0.002–0.005 ms; `DirectRenderer::DrawFrame` 0.018–0.133 ms. `AnimationFrame::Presentation` event-interval p95 is 17.191–18.244 ms. These process/thread events may overlap and are not added to callback time. They do not establish physical presentation latency or isolated GPU raster memory. Minor GC is present (185–458 events/run); maximum conditions also show 2–4 MajorGC events/run. No allocation-free or heap-growth certification is inferred. See `trace-analysis.json`; the older generic `Paint`/`RasterTask` zero counts in `measurements.json` mean those event names were absent.

### Raster, population and resource bounds

| Condition                | CSS scene → backing pixels | Pixel count | Observed particles / connection strokes |
| ------------------------ | -------------------------- | ----------- | --------------------------------------- |
| Desktop defaults         | 1184×400 → 1184×400        | 473,600     | 200 / 3,028                             |
| Desktop maximum          | 1232×400 → 1232×400        | 492,800     | 1,000 / 4,519                           |
| Emulated mobile defaults | 319×200 → 638×400          | 255,200     | 200 / 2,847                             |
| Emulated mobile maximum  | 358×200 → 716×400          | 286,400     | 1,000 / 4,589                           |

Input DPR 3 is capped to effective 2. Actual sampled radii are 1.007–2.995 CSS px at default size and 4.008–11.992 at size 4×, within the current base 1–3 px multiplier contract. Counts/strokes remain below 1,000/4,800; the source bounds candidate checks to 38,400 total and 16 passes. Actual-adapter tests cover the 4,000,000-pixel, 4,096-side, DPR and zero/disconnected bounds, transform reset and failure paths. These current-viewport samples are not a measured claim of GPU memory at the absolute raster ceiling.

Fresh ownership probes distinguish scene resources from the logo:

- Twenty production details-page Pause/configuration/Reset/dialog/visibility/native-route cycles: maximum one pending scene RAF; pause/hidden states settle to zero. Native route departures create new documents, so that test alone is not same-document leak proof.
- Twenty same-document fixture mount/destroy cycles: 101 observations, constant document time origin, no growth. Active scene owns one ResizeObserver, one IntersectionObserver, one context-loss listener and one resolution listener; terminal counts/Canvas/RAF return to zero. WEB↔diamond replacement retains the same Canvas; Reset does not recreate it.
- Twenty actual-composition harness cycles: real `createServices`, controller, binding and Canvas; one scene ThemeService subscription and one MotionPolicy subscription while active, zero after destroy. The harness owns/initializes its own services; the production consumer does not initialize/dispose shared services. This is separate evidence from the production-page resource instrumentation.

`resource-samples.json`, `mount-resources.json` and `subscription-counts.json` preserve all rows. Fake-port tests separately exercise cancellation, setup/draw/cleanup throws and terminal callbacks; they are not relabeled browser resource measurements.

### Bundles, transfer and baseline comparison

Initial assets are unique modern script URLs, excluding the `nomodule` legacy fallback, recompressed with the same Python gzip level 9 / mtime 0 method as the retained pre-scene baseline. Both flags contain **189,381 bytes** initial gzip JS, an increase of **11,627 bytes (11.354 KiB)** over their same-flag baseline: **PASS ≤15 KiB**. The details route has 189,190 initial gzip bytes; it has no pre-scene route counterpart, so no invented route delta is given.

Cold network evidence confirms exactly one newly fetched Canvas chunk, `static/chunks/37.fdb5db788c83205a.js`: **6,206 raw / 2,721 gzip bytes (2.657 KiB)**, with its required shared modules already initial. **PASS ≤35 KiB aggregate optional runtime**. System+OS reduction and every flag-off preference fetch no Canvas chunk and create no Canvas. Explicit Reduced/Off in the on build load that same optional chunk for their approved still. No-JS fetches no scripts. No production particle SVG line/circle graph is present.

Actual cold production script transfer is recorded separately: on/System 196,638 bytes including response overhead, encoded body 193,038; denied on/System-reduce 193,610 / 190,310; off/System 193,609 / 190,309. Server compression/header totals differ from deterministic level-9 gzip accounting and are not substituted for it. `bundle-inventory.json` retains raw/gzip HTML and assets; `network-summary.json` retains all preference variants and URLs. The homepage/layout runtime graph has no game imports, and the build/chunk scan has no game-runtime inclusion.

HTML is accounted separately from JS: On raw/gzip bytes change from 68,658/16,458 to 67,271/17,516; Off from 68,659/16,461 to 67,273/17,522. Current cold CSS encoded bodies total 12,485 bytes across four files; the trusted WEB SVG is 743 bytes. These are payload observations, not a new CSS/HTML budget or a claim of zero-cost static UI.

The retained pre-scene candidate is `1ab13095…`, with no scene callback cost to compare. Baseline Chrome 154.0.8037.57 differs from this run's 154.0.8037.92; host and configured Lighthouse conditions match. Both use three fresh desktop DevTools runs, 1350×940 / DPR 1, 150 ms latency, 9216 Kbps download/upload, 1× CPU, local `p75` LCP/CLS assertions. Lighthouse's emulated network user-agent is not the installed browser version.

| Build | Pre-scene LCP ms (three runs)  | Current LCP ms (three runs)    | Current CLS | Score / criteria                                                                 |
| ----- | ------------------------------ | ------------------------------ | ----------- | -------------------------------------------------------------------------------- |
| On    | 3090.026 / 3081.097 / 3093.192 | 3105.076 / 3097.863 / 3108.189 | 0 / 0 / 0   | 0.82 each; **LCP ≤5000 and CLS ≤0.1 PASS**, existing score <0.9 warning retained |
| Off   | 462.171 / 458.438 / 455.000    | 457.084 / 454.004 / 448.689    | 0 / 0 / 0   | 1.00 each; assertions PASS                                                       |

This is local sample aggregation, **not field p75**. On LCP is roughly 3.10 s in both generations; the accepted intro remains a contributor. Cold traces and observed intro phases distinguish its cost from the scene: default first Canvas draw follows intro `visible` (about 2349 ms versus 2333 ms in the unthrottled phase probe); Reduced similarly draws after visible. Do not blame the historical intro warning on Canvas, or treat a warning as a new passing score. Exact configs, raw HTML/JSON reports, cold traces and baseline links are in the packet.

### Responsiveness and usable failure

Ten real pointer-driven menu opens per condition on the actual details page yield p95 capture-phase input delay **1.9 ms defaults / 0.5 ms maximum**, and click-to-dialog-open mutation **5.8 / 2.6 ms**. Two-RAF opportunity p95 is 36.1 / 30.7 ms; observed Event Timing maximum duration is 40 / 32 ms. This small local sample is not physical paint latency, field INP or a phone result. Opening the modal intentionally suspends the scene without changing local Pause.

Six extra homepage fault probes throw in scene `fillRect`, `arc`, `setTransform`, `stroke`, Canvas append, and removal after resource release. Each shows solid WEB, the unavailable explanation, zero retained Canvas and no further draws during the observation window; navigation still opens/closes. Fresh production tests additionally cover absent/null context, context loss, loading failure, invalid palette, delayed/stale asset/preparation completion, rejected/missing assets, blocked storage and denied motion. Static fallback screenshots were visually inspected; maximum-size particles can make WEB look nearly solid on a narrow view, which is product/comfort evidence for Dimi, not automatic visual approval.

## Validation ledger

Exact command arrays, cwd, timestamps, durations and exit codes are in packet `*.json` sidecars and `*.log` files. Bootstrap freshness preceded generation/build; generated application outputs remained byte-identical. No new dependency or persistent environment setting was installed.

| Check                                                                                   | Fresh result and limits                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prerequisites                                                                           | PASS: `check:theme-bootstrap`, token generation, common typecheck, standalone game build, frontend `tsc --noEmit --incremental false`, validation types, in that order.                                                         |
| Focused Domain/controller/actual adapter/aperture/policy/controls/navigation/theme/logo | PASS: 25 files, 439 tests. Fake clocks/ports and jsdom are distinguished from production rendering.                                                                                                                             |
| Full unit suite                                                                         | PASS: 119 files, 1,833 tests.                                                                                                                                                                                                   |
| Coverage                                                                                | **FAIL:** all tests pass, but branches 78.48% <80%; statements 83.29%, functions 79.52%, lines 85.41%. HTML report retained.                                                                                                    |
| Dedicated bootstrap unit gate                                                           | PASS; 100% statements/branches/functions/lines in its dedicated scope.                                                                                                                                                          |
| Lint/format                                                                             | PASS: existing `pnpm lint` (ESLint and Prettier).                                                                                                                                                                               |
| Production builds                                                                       | PASS: independent compiled On/Off builds and pinned IDs above.                                                                                                                                                                  |
| Storybook build                                                                         | PASS; existing large-chunk warning retained, not an application initial-JS budget failure.                                                                                                                                      |
| General production E2E On                                                               | Original **293/303** pass; targeted unchanged reruns resolve browser-path/localhost harness issues: **296 distinct cases verified, 7 unresolved** (five F2, F5, F6). No whole-suite PASS.                                       |
| General production E2E Off                                                              | Original **294/303** pass; targeted unchanged reruns: **297 distinct cases verified, 6 unresolved** (five F2, F3). On-only early-return cases do not establish enabled-renderer behavior.                                       |
| Dedicated production theme startup                                                      | **16/21** pass; five F2 stale-heading failures. Assertions were not weakened.                                                                                                                                                   |
| Storybook browser/a11y                                                                  | Original **113/117** pass; unchanged isolated Axe rerun passes, giving **114 distinct cases verified, 3 unresolved F4**. No filtered accessibility scan substituted.                                                            |
| Firefox targeted production                                                             | **95/99** pass; three retained subpixel failures and one unsupported mobile-context setup. Actual scene/aperture cases otherwise pass.                                                                                          |
| WebKit/Safari                                                                           | **NOT RUN:** all 16 selected attempts fail to create a page due to installed runner/protocol incompatibility; no app verdict from those attempts. Safari unavailable.                                                           |
| Standalone game                                                                         | PASS: types, 58 files / 920 tests, game build/demo build and **18/18 actual browser checks** through its required Vite development harness. Initial preview-mode mock import failure was corrected only in the external runner. |
| Extra review probes                                                                     | PASS: 12 timed samples, 20 production route cycles, 20 same-document mounts, 20 actual-composition subscription cycles, six homepage fault cases, cold preference/network probes, and actual menu input samples.                |

Full tests/coverage are justified by shared resolver, composition, intro, navigation and Dialog changes across the 110-file EPIC diff. They expose broader validation failures not exercised by the narrower FS-4.6 closure. Local runner corrections used existing installed dependencies, isolated cache directories, localhost origin and the game's intended development server; they did not alter application/test assertions. Initial failures and corrected-run configs are retained.

## Detailed-plan section 7 acceptance matrix

PASS means the stated source/automated evidence passes in its disclosed environment; it is not cross-browser/manual certification. BLOCKED identifies required evidence still absent. The literal proposed plan is interpreted through R19 and explicit amendments, especially Reduced/Off stills, repository-authored WEB and removed modal thumbnail.

| ID  | Result  | Evidence / remaining boundary                                                                                                                                                                                                                                   |
| --- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S01 | PASS    | Seed/trace repeatability, partition tolerance and intentionally clamped-time differences in fresh focused/full Domain tests.                                                                                                                                    |
| S02 | PASS    | Invalid/nonfinite rejection, finite clamp/step normalization, effective config and work/raster ceilings in rules/actual-adapter tests; live extrema measured above.                                                                                             |
| S03 | PASS    | Identity/relative resize, zero/disconnected bounds, transform reset and DPR-only resolution tests; live DPR 3→2 cap.                                                                                                                                            |
| L01 | PASS    | Actual-adapter/browser repeated resume/pause/destroy and review counters: maximum one pending scene RAF, terminal zero.                                                                                                                                         |
| L02 | PASS    | Controller/actual-adapter late preparation, stale completion, cancellation/rearming and throwing cleanup regressions. Controlled browser delayed/failed preparation passes.                                                                                     |
| L03 | PASS    | Twenty same-document mounts, twenty production routes and twenty actual-composition subscription cycles; no growth, separate ownership and terminal counts retained.                                                                                            |
| L04 | BLOCKED | Automated hidden/offscreen/occluded and Pause persistence pass; selected-phone suspension/resume/comfort evidence missing. Browser visibility overrides are simulated input, not physical tab/phone evidence.                                                   |
| A01 | BLOCKED | Circle/WEB/diagnostic asset, themes and narrow/wide/short browser checks pass in Chrome/Firefox. R5 authorizes repo-authored assets; original Illustrator export requirement is superseded, not fabricated. Safari and Dimi visual/device confirmation missing. |
| A02 | PASS    | Stable per-instance IDs, concurrent instances/logo coexistence, full rectangular cover and fitting regressions pass in available browsers.                                                                                                                      |
| A03 | PASS    | Trusted validator, delayed/missing/rejected asset and stale completion regressions; browser fallback and hidden unsafe Canvas. No claim of Safari support.                                                                                                      |
| A04 | PASS    | Retained asset-only selection diff/protected hashes inspected; mounted current WEB↔diamond preserves the same Canvas; no Domain/Canvas implementation change in this review.                                                                                   |
| M01 | PASS    | R19 interpretation: denied paths show solid WEB and load no runtime; opted-in Reduced/Off may prepare a still. Both actual flag cold probes confirm it. F3 is an obsolete test expectation, not permission to initialize flag-off Canvas.                       |
| M02 | PASS    | Shared resolver/actual-consumer full matrix; On overrides OS preference only, other blockers remain.                                                                                                                                                            |
| M03 | PASS    | Pause persists through config, Reset, themes, preferences and environmental transitions in production regressions; human comfort belongs to H01.                                                                                                                |
| T01 | PASS    | In-place palette/theme/invalid-palette and blocked-storage tests; no second preference authority; subscription lifecycle measured. Dedicated startup suite still has F2 heading failures.                                                                       |
| C01 | PASS    | Current five native ranges, units/effective values/limits and keyboard calls pass; maximum inputs exercised via real controls.                                                                                                                                  |
| C02 | PASS    | Configuration/default Reset retain runtime identity, local Pause and shared restrictions; domain reset remains distinct.                                                                                                                                        |
| C03 | PASS    | Close/reopen retains local values; reload/new mount restores defaults; no scene preference persistence in production checks.                                                                                                                                    |
| O01 | PASS    | Two-consumer release-before-open, one modal/lock, failed-open recovery and repeated dialog tests/counters. No thumbnail/second loop exists.                                                                                                                     |
| O02 | PASS    | Actual-invoker/destination focus, native links/history, route cleanup and stale-callback regressions. Known Firefox precision cases remain recorded, not silently passed.                                                                                       |
| O03 | BLOCKED | Most delayed-script/open/focused-native-disclosure cases pass; F6's `/about` 375px geometry comparison must be repeated under invariant viewport conditions before full-row closure.                                                                            |
| F01 | PASS    | Actual homepage absent/lost Canvas, palette/preparation/setup/draw/cleanup fault probes retain usable solid WEB and stop scene scheduling.                                                                                                                      |
| F02 | PASS    | Actual On/Off no-JS content/artwork/navigation verified; no dead scene controls. Correct accepted heading is present; obsolete F2 text assertions still need correction.                                                                                        |
| P01 | BLOCKED | Local raster/frame/bundle measurements retained and within local numerical targets. Required Xperia callback targets/60 Hz and comfort evidence unavailable; desktop emulation cannot pass them.                                                                |
| P02 | PASS    | Both separately compiled flag builds pass unchanged Lighthouse LCP/CLS criteria with 3 reports each; On score warning retained. Intro and scene work explicitly separated.                                                                                      |
| U01 | BLOCKED | Production keyboard, wheel/touch simulation, forced-colors and 200% text checks pass where executed. Storybook scroll/reflow gate has F4 selector failures; selected-browser/device manual accessibility evidence missing.                                      |
| G01 | PASS    | Runtime graph/chunk inspection excludes games; standalone types/unit/build/demo and 18 browser regressions pass.                                                                                                                                                |
| H01 | NOT RUN | Dimi has not accepted this exact measured homepage/detail candidate, phone comfort/readability and controls for FS-4.8. Prior product proposals are not final acceptance.                                                                                       |

No row is marked NOT APPLICABLE solely to hide missing evidence. Superseded proposal details are stated within their rows.

## Re-review and FS-4.8 entry requirements

1. Sites/test owners resolve F1–F4 and stabilize F5/F6 within their existing boundaries. Record exact changed bytes and results, then request Codex re-review. No worker/WebGL migration, engine, second policy, threshold relaxation or broad refactor is indicated by these measurements.
2. Provide a supported Safari run on the selected MacBook Pro and record Safari/macOS versions, build ID, native SVG mask and lifecycle/policy/overlay results. A compatible automation runner may supplement that evidence; this review did not install one.
3. On the selected Xperia XQ-CC54, record actual Android/browser version, CSS viewport, DPR, refresh condition, power/thermal state, build ID and settings. After five-second warm-up, retain three 30-second default and three maximum numeric-control samples, separating scene callback CPU, delivery and rendering work. Apply ≤6/≤10 ms CPU and default ≤20 ms at confirmed 60 Hz without substituting this Mac's samples. Repeat Pause/menu/customization/theme/visibility/route actions and a ten-minute heat/stutter/input-delay/comfort observation. Capture narrow/landscape/text and static-failure readability. Dimi supplies observations or access; no phone result was invented.
4. Recheck corrected candidate hashes, affected tests and any measurements invalidated by source changes. A docs/test-only correction does not automatically require rerunning unaffected CPU samples; changed runtime/configuration/Canvas/cover or production bundles do.
5. Only after the technical/evidence blockers close, FS-4.8 records Dimi's exact scene/aperture/control/comfort acceptance and any explicit deferrals. No current review result authorizes publication, remote actions or EPIC closure.

## R1 documentation handoff

Only this substantive record and the feature-plan status/link are changed in the repository. Application, tests, configuration and generated outputs remain unchanged. Evidence scripts/reports stay in the accessible local packet, with their own hash inventory and full command records. Documentation formatting, local links, the 28-row matrix and the final repository diff/source guard are checked separately from the measured candidate. No commit or push is performed.

## Sites correction C1 — 2026-09-30

Status: corrections implemented against `4e46dd1` plus the R1 documentation above; validation and handoff below identify the correction candidate. Dimi explicitly assigned this chat sole ownership of F1–F6. The existing temporary correction draft was inspected and adopted, then strengthened and freshly validated; prior draft logs are not represented as this pass's fresh results. The preceding independent review and measured candidate remain historical evidence; this section records implementation-owner work, not independent closure.

Scope: F1–F6 only. Add diagnostic-fixture behavior coverage; align the four stale-heading files and explicit flag-off expectations; select the actual Storybook dialog content; pause the actual menu/content CSS animations while the fake JS clock advances, then inspect/finish them through the existing animation API assertions; use Playwright-owned screenshots and assert invariant viewport around both captures. Application/runtime sources, thresholds, exclusions, dependencies, generated outputs and product choices stay protected. Existing isolated compiled flag builds are reusable because only tests/docs change. Re-run full coverage, affected production/Storybook/theme journeys, types and lint. Preserve raw failures and exact correction diff. Xperia/Safari evidence remains outstanding and no remote action is authorized.

### Correction details

| Finding | Bounded correction                                                                                                                                                                                                                                                                                                                | Preserved contract                                                                                                                                                                                                                   |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| F1      | Add four colocated `ParticleLifecycleFixture.test.tsx` cases covering opt-in mount, controls and Pause/Reset delegation, repeated release, aperture/frame/shared choices without handle replacement, unavailable-state stills, rejection of a bounds-less preview with changed coordinates, and diagnostic static geometry/reuse. | Public handle doubles exercise presentation behavior; pure Domain data is reused. No fixture/renderer implementation, coverage exclusions or threshold changes. These are unit tests, not new browser or motion-acceptance evidence. |
| F2      | Replace only the obsolete homepage heading expectations in home, portfolio navigation, static route and theme-startup tests with exact `Aperture - 1`.                                                                                                                                                                            | Page title, header identity, About text, links, no-JS and theme assertions remain.                                                                                                                                                   |
| F3      | Branch the final explicit-Off transparency assertions on compiled availability. Enabled builds retain the connected original paused Canvas; unavailable builds require zero Canvas and a visible solid WEB path.                                                                                                                  | Check effective cover opacity, fallback count, stopped frames and reset-on-reload in both builds. Off is not permission to prepare a disabled runtime.                                                                               |
| F4      | Select the dialog's direct content container by its descendant `Run local preview` button and require exactly one match.                                                                                                                                                                                                          | Keep content height, horizontal fit, reachable action, enlarged-text, focus-return and unfiltered accessibility assertions.                                                                                                          |
| F5      | Pause only the menu/content CSS reveal animations in the second-tab fixture while advancing Playwright's JS clock. Existing assertions then sample actual opacity/duration and finish the real animation.                                                                                                                         | No fake `animationend`, dropped phase assertion, changed duration or production scheduling. The test no longer races an uncontrolled CSS wall clock; the separate R1 real-clock sequence remains recorded.                           |
| F6      | Replace the independent raw CDP screenshot session with `page.screenshot` and assert exact viewport dimensions before/after both captures.                                                                                                                                                                                        | Scripts stay held for the native fallback capture; exact pre/post-hydration launcher geometry and PNG bytes still match. No added visual tolerance or application layout change.                                                     |

The test-only patch is retained separately from documentation in the [owned correction evidence](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.7-corrections/owned-pass/README.md). Candidate identity is base `4e46dd1` plus that exact patch; its hash and final file manifest identify this correction rather than the earlier temporary iterations.

### Fresh correction validation

| Check                         | Result                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New diagnostic behavior tests | 4/4 pass.                                                                                                                                                                                                                                                                                                                                            |
| Full coverage run             | 120 files, **1,837/1,837 tests pass**; branches **84.59% (802/948)** against unchanged 80%. Statements 87.65%, functions 86.17%, lines 89.80%. No coverage configuration change.                                                                                                                                                                     |
| Types                         | Frontend `tsc --noEmit --incremental false` and `typecheck:validation` pass.                                                                                                                                                                                                                                                                         |
| Lint                          | Existing `pnpm lint` passes bootstrap freshness, ESLint and Prettier.                                                                                                                                                                                                                                                                                |
| Affected production journeys  | **94/94 On and 94/94 Off** pass using the already separately compiled, hash-verified builds. Covers all six affected general E2E files, not a claimed fresh full 303-case suite.                                                                                                                                                                     |
| Dedicated theme startup       | **21/21 On and 21/21 Off** pass, including delayed scripts, storage failures and no-JS.                                                                                                                                                                                                                                                              |
| Storybook essential set       | **11/12** in the initial run, including all three corrected reflow cases. The remaining unchanged reduced-motion case hit the already-recorded concurrent Axe error; **1/1 passes on isolated unchanged rerun**. All 12 distinct cases are verified, but the initial suite is not relabeled clean. No accessibility rule was filtered or suppressed. |
| F5/F6 stability               | **30/30** pass: all ten second-tab/trigger capture cases repeated three times in the enabled production build, with zero retries.                                                                                                                                                                                                                    |

Application files and initial production chunks for both routes/flags match the measured candidate. On build `rXwyvMvwGWp5O4Z9FlF_B`, Off `MbUptQdcjT_izDJeJtnqw` and the existing Storybook output were reused; builds, Lighthouse, CPU traces and game regressions were not repeated because this correction changes tests/documentation only. R1 remains the source of those measurements and their limits. One initial runner attempt refused an occupied port; new isolated ports preserved the existing preview. All command/config/result files are retained in the owned-pass packet.

### Remaining handoff

F1–F6 have implementation responses and fresh affected checks; **independent re-review is still required** before changing the R1 verdict/acceptance matrix. The Storybook automatic/manual Axe collision remains a separate recorded test-runner follow-up, not a scene defect and not silently fixed by the isolated pass. The prior Firefox precision follow-up and B1 Xperia/Safari evidence remain open. No FS-4.8 acceptance, performance certification, commit, push or deployment is inferred.

## Codex R2 — correction re-review — 2026-09-30

**F1–F6: PASS / closed against C1. Overall: CHANGES REQUIRED; required device/browser evidence remains BLOCKED.** This fresh review pass inspected all corrected bytes and the actual tested components/assertions without repairing implementation. It occurred in the same chat as C1 and is not a second human review. The [R2 report and raw evidence](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.7-r2/REVIEW.md) records finding-by-finding conclusions, locations and remaining owners.

Reviewed base remains `4e46dd1f7ce10c58362fc7b693816d0c602233f9`; C1 test patch SHA-256 is `4fd95449d5672b6375445de0552abea2cced0b601ec16d01951c8ebdb279b2cb`, complete correction patch `49ab23d43682b67539d311cfd25e82e7f657d7b566cef999332971b08504bdab`. All ten C1 files matched the handoff manifest before review. Application/configuration/generated bytes remain unchanged in the repository and both isolated compiled builds; the evidence packet preserves the reviewed pre-R2 documentation and diff.

Fresh checks: 1,837/1,837 tests in 120 files; branch coverage 84.70% (803/948), above unchanged 80%; frontend/validation types and lint pass. Affected production On/Off pass 94/94 each; theme startup On/Off pass 21/21 each. The completed serial Storybook run passes 9/12, including all three corrected F4 reflow cases; three other cases reproduce the known `Axe is already running` collision. Initial concurrent Off-theme/Storybook runs logged passing cases but stalled at cleanup and were interrupted (exit 130); they are not clean suite passes. Raw logs, serial reruns and the unconfirmed cleanup limitation are retained.

**F7 — P2, Storybook validation reliability:** `e2e/storybook/essential-set.spec.ts:30–35` invokes explicit unfiltered Axe scans while the a11y addon is loaded at `frontend/.storybook/main.ts:12`; failures occur in default composition, forced colors and reduced-motion cases. Sites / the Storybook test-infrastructure owner must coordinate scan ownership/completion and repeat the essential set without filtering rules, swallowing errors or fixed sleeps. No shared-policy or scene-runtime change is requested. This is the already-recorded Axe follow-up, now explicit as a remaining gate; F4's selector correction stays closed.

Existing On/Off build IDs and R1 CPU/Lighthouse/bundle/game evidence were reused, not remeasured. C1's 30/30 repeated stability run remains prior evidence; R2 reran its affected full files. O03's F6 automated viewport blocker and U01's F4 selector blocker are resolved in Chrome; manual/device portions and B1 Xperia/Safari remain open. The original acceptance matrix remains historical. FS-4.8 is not started, and no final performance/visual acceptance, commit, push or deployment is inferred.

## Sites correction C2 — F7 scan ownership — 2026-09-30

**Implemented and validated; independent re-review pending.** F7 only: the essential-set browser fixture now passes Storybook's supported `a11y.manual:!true` global before rendering, giving its existing explicit AxeBuilder calls sole scan ownership for those visits. Normal Storybook visits remain automatic; no addon, global configuration, scan target, rule or assertion is removed. Actual installed Storybook 10.5.10 parser/addon code confirmed the option and URL syntax. No fixed sleep, retry or exception suppression was introduced.

The new negative-control regression adds an unnamed button, requires the unfiltered scan to report `button-name` for that exact element, removes it in `finally`, then requires the restored fixture to pass. All existing theme, motion, focus, layout and accessibility assertions remain intact. Only `e2e/storybook/essential-set.spec.ts` and this record change relative to R2; earlier F1–F6 edits and unrelated work are preserved.

Fresh unchanged-candidate reproduction: 32/36 cases pass with four Axe collisions over three predetermined repetitions. Fresh corrected candidate: **39/39 pass**, all 13 cases repeated three times, zero retries/skips/unexpected cases and successful runner exit. Frontend/validation types and existing lint pass. The same existing local Storybook build was used before/after; its sources/configuration and production sources remain unchanged. No new production build, CPU/Lighthouse sampling, full unit coverage or physical-device result is claimed.

Candidate: base `4e46dd1f7ce10c58362fc7b693816d0c602233f9` plus R2-reviewed C1 and the F7 test patch SHA-256 `bad417182610b2cde6fd4718a0badcbfcdba7d6c7091627e644917da3a6c6228`. The [C2 correction packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.7-f7/README.md) retains the exact incremental diff, manifests, before/after commands, raw results and failures. Codex must independently re-review these changed bytes before closing F7. Xperia/Safari and FS-4.8 remain outstanding. No commit, push or deployment was performed.

## Codex R3 — F7 correction re-review — 2026-09-30

**PASS for F7; F7 closed. F1–F6 remain closed. Overall FS-4.7: BLOCKED on required Xperia/Safari evidence.** The [R3 review and raw results](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.7-r3/REVIEW.md) record a fresh source review and browser execution without implementation or test repairs. This is a separate review pass in the same chat as C2, not a second human reviewer.

Candidate remains base `4e46dd1f7ce10c58362fc7b693816d0c602233f9` plus R2-reviewed C1 and C2. Verified F7 test patch SHA-256 `bad417182610b2cde6fd4718a0badcbfcdba7d6c7091627e644917da3a6c6228`, complete C2 patch `314c9dd07275372ceeb58feb66d6e8e039979daa6f0b79802764ba7645c595b5`, and exact repository/isolated-copy test bytes. Production sources, configuration and all other corrections remain unchanged.

Installed Storybook parser/addon inspection confirms the supported per-visit manual global prevents the competing automatic scan before render. All explicit scans in the affected file use that fixture; normal visits keep the unchanged automatic default. Existing unfiltered scan targets and assertions remain intact. The new negative control requires the exact unnamed-button violation, removes the test defect, and checks the clean fixture again. No scan-rule filter, fixed sleep, exception suppression, retry or weakened assertion was added.

Fresh actual Chrome validation: **39/39 pass**, all 13 essential-set cases repeated three times, zero retries/skips/unexpected/flaky results, no runner-level errors and exit 0. C2's earlier type/lint passes apply to identical test bytes; they were inspected, not relabeled fresh R3 checks. R3 documentation, links, hashes and diff checks pass. Existing compiled Storybook output was reused; no new production build, full coverage, performance sample or physical-device result is claimed.

No further F7 correction is requested. R1 measurements and historical acceptance rows remain preserved; missing Xperia/Safari, the recorded Firefox follow-up and FS-4.8 human acceptance remain explicit. No commit, push or deployment was performed.

## Authorized delivery — 2026-09-30

Dimi explicitly authorized updating documentation, committing and pushing the reviewed changes after R3. The containing Git commit packages the F1–F7 test corrections and this measured-review record on `feature/funkspace-minimum-usable`; application/runtime/configuration bytes remain unchanged. Final delivery checks compare every corrected test against its reviewed hash and validate documentation formatting, links and staged diff. Earlier execution results retain their original dates and scope; this documentation update is not a new performance run.

All F1–F7 correction findings are closed. FS-4.7 remains BLOCKED on the required Xperia/Safari evidence, and FS-4.8 has not started. This authorization does not approve deployment, scene acceptance, evidence substitutions or relaxed budgets. Raw traces, screenshots, logs and hash inventories linked above are local artifacts outside the repository and are not included in this push; a reviewer on another machine must obtain those packets or reproduce the checks before relying on the raw evidence. The substantive findings, measurements, commands/results and remaining capture requirements are retained in this versioned record.
