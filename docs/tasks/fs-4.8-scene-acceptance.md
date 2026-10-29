# FS-4.8 — Integrated scene acceptance

## FS-4.8 and EPIC 4 closure — 2026-10-13

**COMPLETE — Dimi explicitly closes FS-4.8 and EPIC 4.** His decision is:
“FS-4.8 and EPIC 4 are done, update the documentation then commit and push all
changes.” This supersedes the pre-closure pending status below. The accepted
implementation remains `a43bbf0883ba2218511935ea5a14a087e56df799`, with no
post-review runtime, configuration or asset changes.

The accepted set is the WEB Work Sans Black aperture and settings recorded below:
286 particles, speed 0.2×, size 0.1×, 100 links, reach 6×, Full field Off and seed
`0x46533431`. On/Off builds remain `KjrafQG-kqcdKVfCguqkh` and
`ZPhT2a3xV2ue9gjrGfEF3`. A1–A5 are closed; final available checks pass, including
both flags' LCP/CLS, with the On performance score warning retained. No deferred
visual polish or unresolved source repair is nominated.

The unavailable raw phone timing/refresh/comfort packet remains an evidence
limitation, not a fabricated numeric PASS. Dimi's explicit closure resolves task
status despite that disclosed limit; earlier conditional review conclusions stay
historical. Budgets, assertions and the distinction between manual acceptance
and measured results are unchanged. No further FS-4.8 approval is pending.

Commit and push of all pending documentation are explicitly authorized by this
request. The containing Git commit identifies this documentation delivery; local
raw evidence remains outside the repository. No application code changes belong
to this delivery. **Next milestone work is EPIC 5 contact acceptance.** FS-G2
remains open until that contact journey is accepted. FS-G3, public launch, merge,
deployment and Wave Survivor integration are not approved by this closure.

## Acceptance and pre-closure status — 2026-10-13

Historical state before Dimi's explicit closure above; retained for provenance.

**Dimi ACCEPTED `a43bbf0` on 2026-10-13. EPIC 4 evidence-based closure remains
PENDING the required phone performance packet.** His actual decision is:
“`a43bbf0` candidate is accepted”. This is explicit acceptance of the presented
integrated candidate and its parameter/asset set, not inferred from preparation.
No post-review visual/configuration change was requested or made. Codex's FS-4.8B
revalidation below keeps technical evidence separate from Dimi's decision.

Prerequisite: [FS-4.7 closure](fs-4.7-scene-performance-review.md#fs-47-closure-and-authorized-delivery--2026-10-13).
Dimi closed that task after A1–A5 correction PASS and the no-change FS-4.7B
disposition. Its disclosed measurement limitations remain; this task does not
reopen FS-4.7 or turn those limitations into numeric PASS results.

## Exact candidate and accessible previews

- Commit: `a43bbf0883ba2218511935ea5a14a087e56df799`.
- Branch: `feature/funkspace-minimum-usable`; clean at preparation start.
- This task's diff: acceptance documentation only; no runtime/test/asset changes.
- On production build: `KjrafQG-kqcdKVfCguqkh`, existing :3001 preview.
- Disabled production build: `ZPhT2a3xV2ue9gjrGfEF3`, isolated copy at
  `/private/tmp/fs47-rereview-off`, started on :3002 for this session.
- Builds predate the documentation-only closure commit; all 656 tracked
  non-Markdown files match the isolated build copy, and the reviewed runtime
  patch is unchanged. These are the already compiled true/false variants,
  not a runtime setting pretending to disable the build flag.

| Purpose                                | On this Mac                                                          | Phone on the same local network                                          |
| -------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Real homepage, animation-enabled build | [Homepage](http://localhost:3001/)                                   | [Homepage](http://192.168.0.179:3001/)                                   |
| Details and customization              | [Web Aperture](http://localhost:3001/animations/aperture)            | [Web Aperture](http://192.168.0.179:3001/animations/aperture)            |
| Separately compiled disabled build     | [Static homepage](http://localhost:3002/)                            | [Static homepage](http://192.168.0.179:3002/)                            |
| Replacement demonstration only         | [Aperture fixture](http://localhost:3001/sandbox/particles/aperture) | [Aperture fixture](http://192.168.0.179:3001/sandbox/particles/aperture) |

Keep this Mac awake and both servers running. The LAN address is the address
observed during preparation and can change on another network. `0.0.0.0` is a
server bind address, not the phone destination. These private-network links are
not a deployment or public release. HTTP checks from the Mac confirm availability;
phone reachability still needs Dimi's actual check. The :3000 development preview
is preserved but is not the pinned acceptance target.

## Accepted candidate configuration and aperture

Authority: [FS-4.1 amendments](fs-4.1-scene-contract.md), especially R20–R26;
[current authoring settings](../../frontend/domain/particles/ParticleSettings.ts);
[details/customization maintenance](maintenance-aperture-details.md) and the
subsequent Web Aperture naming/compact-controls amendments in the feature plan.
Earlier SPACE/circle names, older default counts and older maximum settings are
historical. Use the current effective settings below for this candidate.

| Setting            | Default / Reset |                                      Maximum control value |
| ------------------ | --------------: | ---------------------------------------------------------: |
| Particles          |             286 |                                                      1,000 |
| Speed              |            0.2× |                                                         2× |
| Size               |            0.1× |                                                         4× |
| Links per particle |             100 |                                                        100 |
| Reach              |              6× |                                                        10× |
| Full field         |             Off | On reveals the unmasked field; it is not a numeric maximum |

Seed: `0x46533431`. Reset restores the five defaults, seeded layout and Full field
Off without clearing local Pause or changing theme/motion preference. Edits are
temporary to the mounted scene; they are not saved presets. Test maximum controls
on the real details page, where customization is available; do not expect a
separate homepage mount to inherit them.

The selected production aperture is **WEB**, outlined Work Sans Black 900,
viewBox `0 0 2347 660`. It reveals a Canvas particle/connector field through a
native SVG mask. The centered opening fits 96% below 640 CSS px and 80% at larger
widths. The independent solid WEB preserves complete static/error/no-JS artwork.
The homepage has Play/Pause and More; the details opening has the same scene with
Customize instead of More. Scene status remains accessible without visible
extra copy underneath. Theme colors and existing controls are retained.

All four motion choices remain: System follows the OS, explicit On overrides the
OS preference for this decorative scene, and Reduced/Off stop continuous scene
motion while allowing the accepted still presentation. Reduced may retain the
separately approved logo fade. A disabled build keeps static content and usable
navigation/customization without starting Canvas. Local Pause survives temporary
visibility/dialog/theme changes within the mount; playback resumes only when
explicitly requested and permitted.

Engineering limits remain 4,800 output lines, 38,400 candidate checks across at
most 16 passes, DPR ≤2, each backing side ≤4,096 px, total backing pixels
≤4,000,000, and accepted delta ≤50 ms. Final appearance acceptance does not relax
the FS-4.1 performance budgets or establish missing timing measurements.

### Selected asset identity

| Asset                                                   | SHA-256                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| `frontend/public/scene-apertures/web-work-sans.svg`     | `cd34a4e9d226e4421d66962f10c2af254cb540a7e70607be0fcd97f98ca201e3` |
| `frontend/data/webApertureGeometry.ts`                  | `229bdf93e7e2b480070b36f14c0ad756cc9a76ff6adab34babfc64d66e3978d3` |
| `frontend/public/scene-apertures/technical-diamond.svg` | `59125ca39981ae1b43314bd6a63e8f1815ddcdcc7c0860029c0fb6a64a9d52d5` |

WEB uses built-in trusted geometry shared with its fallback; its export is checked
for parity but is not fetched to make the production WEB opening. The diamond is
a repository-authored second export used for diagnostics, not Dimi's original
Illustrator file or an approved replacement for production WEB. R5 authorized
repository-authored assets; the old Illustrator prerequisite is superseded.

## Short manual checklist

Use the real homepage and details page for rows 1–6. The diagnostic fixture in
row 7 proves only replacement workflow, not integrated appearance acceptance.
Report PASS / FAIL / NOT TESTED per row, with the actual actions and observations.

1. **Phone and desktop layout:** view defaults on both devices, then phone
   landscape/short height and desktop enlarged text or 200% zoom. Record which
   enlargement method was used. WEB, controls, explanations and dialogs remain
   readable and reachable, without clipping or blocked ordinary scrolling.
2. **Default and maximum appearance:** on details, inspect defaults, set all five
   sliders to the maximum values above, close customization and inspect the
   moving scene. Report clarity, stutter, input delay and comfort for both sets.
   Check the homepage at its own defaults as well.
3. **Pause sequence:** select On, Pause, scroll away/back, background the browser
   and return, then change theme. The scene remains paused through every step;
   Resume restarts only when visible and permitted. Repeat on phone and desktop.
4. **Motion alternatives:** try System with OS reduction, explicit On, Reduced
   and Off. WEB remains complete when still. Open the separately disabled build
   and check homepage, More/details, Customize and navigation; no scene animation
   should start even if On is selected. The two ports have separate saved settings.
5. **Customization and Reset:** change each setting and Full field, close/reopen,
   then Reset. Verify the table defaults and Full field Off, retained local Pause
   and unchanged theme/motion. Mobile taps must not leave Reset/Full field with
   a stuck hover accent. Dialog content remains scrollable on a short screen.
6. **Menu, focus and scrolling:** open/close menu and customization; navigate
   Home → More → details and About → Home. Check ordinary touch/wheel scrolling,
   tablet/desktop smart-header access and phone controls. With keyboard, use
   Tab/Shift-Tab and Escape: focus is visible, contained while modal, then returns
   sensibly. Pointer navigation should not add the unwanted Safari content ring.
7. **Replacement practicality:** perform the WEB/diamond walkthrough below and
   confirm the process is understandable. Record any specific export feedback.

## Second-export replacement walkthrough

1. Open the On replacement fixture. Choose Motion **On**, then **Start scene**
   and **Pause scene**. In **Aperture**, choose **Diamond**, then **WEB**.
   Repeat without Destroy/Start. Only the opening changes; Pause remains and
   Resume continues the existing field. The diagnostic diamond retains its
   transparent counter. Production WEB and particle rules are unchanged.
2. For a future supplied SVG, retain the editable original and an intended-shape
   screenshot. Follow the [export guide](fs-4.1-scene-contract.md#illustrator-aperture-export-guide--available-now):
   outlined geometry, opaque black openings on transparency, preserved counters,
   finite nonzero viewBox; no text/fonts, scripts, external resources, raster,
   filters or white artboard rectangle. Validation rejects unsupported markup.
3. In an explicitly assigned asset-only revision, add the reviewed export under
   `frontend/public/scene-apertures/` and update the diagnostic diamond descriptor
   in `frontend/data/sceneApertures.ts` with its exact path/viewBox. Run
   `pnpm check:scene-apertures` and the mounted replacement regression. Do not
   change simulation, controller, Canvas, scheduling or shared motion policy.
4. Compare the same mounted Canvas and paused pixels before/after, then Resume.
   Record original/export filenames, hashes, intended silhouette, actual result
   and the exact asset/descriptor diff. Submit it to Codex for affected checks.
   Promoting a new production opening is a separate explicit choice: editing the
   external WEB file alone cannot replace the built-in geometry/fallback pair.

No new export or production aperture change is requested or made in this pass.

## Dimi's actual acceptance results

**Decision: ACCEPTED**, explicitly naming `a43bbf0`. The prior general
smartphone/Safari/Firefox manual PASS is retained with its FS-4.7 provenance;
the implementation has not changed since that review. The new acceptance does
not invent per-action outcomes or numeric measurements. Earlier device selection
was Xperia XQ-CC54 / Android 14 and MacBook; current device/OS/browser versions,
refresh conditions and the individual FS-4.8 checklist actions were not supplied.

| Session       | Actual device / OS / browser                                      | Build / conditions                                                       | Actions and outcomes                                                     |
| ------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Dimi phone    | Prior aggregate smartphone PASS; current versions not supplied    | Candidate accepted; viewport/DPR/refresh and text size not reported      | Individual checklist actions and measured samples NOT REPORTED           |
| Dimi desktop  | Prior aggregate Safari/Firefox PASS; manual versions not supplied | Candidate accepted; viewport and zoom method not reported                | Individual checklist actions NOT REPORTED                                |
| Dimi decision | ACCEPTED on 2026-10-13                                            | `a43bbf0883ba2218511935ea5a14a087e56df799`, configuration/aperture above | Explicit “`a43bbf0` candidate is accepted”; no deferred polish nominated |

## FS-4.8B — final revalidation and closure disposition — 2026-10-13

This is the technical review before the explicit closure decision above. Its
missing evidence remains disclosed; its pending task disposition is superseded.

**Visual/product acceptance: RECORDED. Available technical checks: PASS, with
the retained Lighthouse score warning. Evidence-based EPIC 4 closure: PENDING
required physical-phone performance evidence.** No source repair is identified
or performed. There is no post-review parameter, aperture or presentation diff
to return to Sites; only acceptance/status documentation changes in this pass.

### Final candidate and evidence scope

HEAD remains `a43bbf0883ba2218511935ea5a14a087e56df799`. All 656 tracked
non-Markdown files match the FS-4.8A candidate manifest. Initial script hashes
and both build IDs match the reviewed On/Off inventory exactly. The build pair
listed above is reused; no rebuild, source substitution or live flag override
occurred. Dimi's explicit acceptance therefore applies to this final candidate.

| Area                                       | Result and provenance                                                                                                                                                                                                                                                                        |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Defaults, maxima and aperture              | Accepted set above is unchanged; source and asset hashes checked in FS-4.8B. Current normalization/count/raster/connection bounds retain existing tests.                                                                                                                                     |
| Initial/lazy JavaScript budgets            | Retained current-candidate initial growth: 2.11 KiB On / 1.71 KiB Off against 15 KiB. Built initial asset hashes reverified now. Prior optional Canvas aggregate is 2,721 B against 35 KiB, retained with its original measurement scope. No new dependencies or runtime imports.            |
| One bounded runtime / lifecycle            | Retained FS-4.7A 1,906-test coverage gate includes domain/controller/actual-adapter guards and cleanup. Prior scene-owned resource probes remain dated to their candidate; no new sustained resource capture is claimed here. No post-review lifecycle source changes.                       |
| Motion and local Pause                     | Retained reviewed regressions plus FS-4.8A's 18 actual-build checks: System/On/Reduced/Off, both OS preferences and retained paused Canvas replacement. No consumer acquires shared-service ownership.                                                                                       |
| Customization, Reset, navigation and focus | Retained 170-check FS-4.7A browser gate includes current On/Off route/dialog/touch/focus, Firefox and Storybook evidence. The UI, control permissions and input-focus repair remain unchanged.                                                                                               |
| Static / no-JS / error / disabled paths    | Retained final On/Off startup and failure checks, including throwing media API access, blocked storage and no-JS; FS-4.8A freshly verifies the compiled disabled build. These are automated results, not Dimi's per-device answers.                                                          |
| Independent aperture replacement           | FS-4.8A's exact mounted Canvas/pixel continuity test passes for WEB ↔ repository-authored diamond. FS-4.1 R5 explicitly supersedes the original Illustrator-delivery prerequisite. No original SVG supplied by Dimi was available for a separate export trial; do not claim one was tested. |
| Actual device acceptance                   | Dimi's prior aggregate phone/Safari/Firefox PASS and new explicit `a43bbf0` acceptance are recorded. Current versions, individual actions and raw timing data were not supplied.                                                                                                             |
| Final LCP/CLS                              | Fresh FS-4.8B six-sample Lighthouse gate PASS, detailed below.                                                                                                                                                                                                                               |
| Phone callback/frame budgets               | NOT VERIFIED: required actual-device timing/refresh evidence is unavailable. This is the remaining closure blocker, not a reproduced runtime defect or cosmetic item.                                                                                                                        |

### Fresh final-build Lighthouse check

Three serial samples per flag, On followed by Off after functional tests ended.
Actual installed Chrome 154.0.8037.98, Lighthouse 12.6.1, local macOS host;
desktop preset with DevTools throttling, 150 ms request latency and 9,216 Kbit/s
up/down, unchanged repository settings. Existing :3001/:3002 builds were reused;
each flag has a separate evidence working directory, config and output reports.
Only preview URL/server management and local report paths differ from repository
Lighthouse configuration. No source or performance threshold changed.

| Flag | LCP samples (ms)                  | CLS samples | Performance scores | Gate                                 |
| ---- | --------------------------------- | ----------- | ------------------ | ------------------------------------ |
| On   | 3,121.974 / 3,130.158 / 3,112.140 | 0 / 0 / 0   | 81 / 81 / 82       | LCP/CLS PASS; existing score warning |
| Off  | 450.700 / 441.274 / 445.195       | 0 / 0 / 0   | 100 / 100 / 100    | PASS                                 |

Both commands exited 0. LCP ≤5,000 ms and CLS ≤0.1 use the configured local
three-run p75 aggregation; this is not field p75. The score threshold remains
0.9 and still warns on On. These numbers supersede the missing final-candidate
Lighthouse rerun; they do not supply phone callback/delivery timings or attribute
the homepage introduction's cost to Canvas.

Commands: `CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
/Users/dimi/Projects/funkspace-app/node_modules/.bin/lhci autorun --config=../lighthouse-on.json`,
then the corresponding `lighthouse-off.json`, run from separate `on`/`off`
directories in the [FS-4.8B evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.8b-revalidation-2026-10-13/).
The packet retains logs, raw reports, assertions, exact configs, source hashes and
summary. Documentation links, formatting, status consistency and full diff are
checked separately. No full unit/browser rerun is claimed in FS-4.8B: source
identity makes the preceding candidate-specific gates applicable without a new
behavioral change requiring another run.

### Precise remaining condition

Supply the actual phone packet for this candidate: device/OS/browser/build,
viewport/DPR and measured refresh; defaults and current maxima; three 30-second
samples per condition after the approved warm-up, callback update/draw submission
separate from delivery/paint/compositing; raw data/traces and comfort-session
duration/observations. The contract's phone callback p95 ceilings remain 6 ms at
defaults and 10 ms at maxima, with default delivery p95 ≤20 ms under measured
60 Hz conditions. The general manual PASS and explicit appearance acceptance
cannot establish these numbers. No waiver was supplied in FS-4.8B.

Dimi's acceptance needs no repetition for this unchanged candidate. FS-4.7's
explicit closure also stands. This conditional FS-4.8B request requires evidence
before full EPIC closure, so the feature plan records accepted product scope
with technical closure pending, rather than fabricating measurements. No deferred
polish is nominated and no required repair is handed off. FS-G2 remains pending
EPIC 5 contact acceptance; FS-G3, public launch and game integration stay separate.
No commit, push, merge or deployment is performed.

## Preparation validation and evidence — FS-4.8A history

Source/hash comparison confirms the isolated Off copy matches all 656 tracked
non-Markdown files in the committed candidate. Local/LAN On/Off homepage and
details/replacement route HTTP checks return 200. These are Mac-host availability
checks, not physical-phone results. No build was replaced and existing previews
remain running.

The existing browser smoke checks exercise all four preferences against both OS
preferences and mounted WEB/diamond replacement on each actual compiled flag.
**9/9 On and 9/9 Off PASS**, installed Chrome 154.0.8037.98 with Playwright
1.55.1, one worker and zero retries. `pnpm check:scene-apertures` also passes.
Their output and exact external configurations are retained at
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.8a-preparation-2026-10-13/`.
Results are preparation evidence only; they do not supply Dimi's manual answers.
Documentation receives content/link/format/diff checks. No fresh full suite,
Lighthouse, phone measurement or independent re-review is claimed by this pass.

## Historical feedback and conditional handoff — before closure

The following conditional handoff preceded Dimi's explicit FS-4.8/EPIC 4 closure.
It does not keep the completed tasks pending or revoke the later push authority.

- **Acceptance recorded:** Dimi explicitly accepts `a43bbf0`. No new technical
  defect or visual revision has been assigned.
- **Evidence closure pending:** required phone callback/frame/refresh evidence
  and recorded comfort-session conditions are unavailable. FS-4.8B cannot certify
  those requirements or invent a waiver. FS-4.7 stays closed by Dimi's decision;
  its administrative closure is not a new phone measurement.
- **Deferred polish:** none nominated. Only Dimi can identify acceptable polish
  to defer; lifecycle, performance, accessibility or static-failure defects stay
  technical findings.
- **Revision rule:** agree the few concrete parameters or presentation details
  for each feedback cycle before changing them. Pin each new diff/build, preserve
  unrelated work and send the bounded handoff to Codex for affected lifecycle,
  performance and accessibility checks before requesting acceptance again.
- **Scope:** no new behavior, trails, pointer system, editor, redesign, game
  integration, commit/push or public release. No source changes are needed until
  concrete feedback is supplied.

Dimi's candidate and selected parameter/asset set are accepted above. No deferred
polish was nominated. Complete the remaining evidence packet before marking the
EPIC 4 technical closure complete; no further visual approval is requested for
this unchanged candidate. FS-G2 still requires EPIC 5 contact acceptance. FS-G3,
public launch and Wave Survivor integration are not implied.
