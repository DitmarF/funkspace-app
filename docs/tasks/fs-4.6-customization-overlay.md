# FS-4.6 — Details-page customization and overlay coordination

## WEB fade duration follow-up — 2026-10-05

Dimi requests increasing WEB's fade-in duration by 100%: **400ms → 800ms**.
Select the existing `--fs-motion-duration-800` token in StartScene's shared
stylesheet for homepage and details. Easing, readiness gating, once-per-mount
reveal, local Pause and Reduced/Off/static behavior remain unchanged; no global
token values, generated files or runtime code change. This is a local authorized
visual adjustment, not independent approval or final EPIC acceptance.

Base: `737d5fa9147eb9f3cac0ce0f3f8edc3c73e3ae8c` plus preserved pending work.
Exact diff and checks: [fade evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/scene-fade-2026-10-05/README.md).

Fresh checks: **33/33** scene unit tests, types, lint, app and Storybook builds
PASS. **8/8** production browser checks PASS: computed duration **0.8s** and
browser animation timing **800ms** on both homepage/details, no fade for
Reduced/Off, and the existing delayed-draw/timeout regressions. Browser timing
checks are evidence-only files in the isolated checkout; no permanent new test
scaffold. Build: `R9ASfsBklg_lVu2z4IMHW`. No retries or skips.

Three fresh desktop/devtools Lighthouse samples pass existing LCP/CLS limits:
**3115.979–3129.41ms**, **CLS 0**. All three performance scores are **0.81**,
retaining the existing 0.9 warning. No field-p75 or complete scene-audit claim.
Diff/format/link checks pass; prior work and generated outputs are preserved.

Status-copy amendment: [quiet scene status](#quiet-scene-status--2026-10-05)
implements Dimi's follow-up under contract R26. Earlier C7/R2
approval applies to its recorded candidate, not automatically to this amendment.

## Quiet scene status — 2026-10-05

Dimi requests removing all extra text beneath WEB because it disrupts the layout,
including the waiting message. Use the existing `sr-only` treatment for every
StartScene status on homepage and details, removing the obsolete three-line
status reservation. Preserve live-region text and the playback button's
`aria-describedby`; customization-dialog explanations remain in the active modal.
No policy, runtime, Pause, reveal or shared-service behavior changes. R26 in the
[scene contract](fs-4.1-scene-contract.md#r26--no-visible-web-status-copy--2026-10-05)
supersedes the previous visible restriction/failure-copy decision.

Base: `737d5fa9147eb9f3cac0ce0f3f8edc3c73e3ae8c` plus preserved pending work on
`feature/funkspace-minimum-usable`. Exact incremental diff, candidate hashes and
checks: [local evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/scene-quiet-status-2026-10-05/README.md).
This is a local implementation update; independent review and human visual
acceptance are separate. No commit, push or deployment is authorized.

Fresh checks: **43/43** focused unit tests and **27/27** production browser checks
PASS, plus types, lint, app and Storybook builds. Browser coverage includes all
four motion choices, OS changes, delayed loading, palette/context failures,
visibility, local Pause, action layout and no-JavaScript content. Waiting status
behind customization and the no-JavaScript description retain a 1px accessible
box with absolute positioning, taking no row space. Failure-state and mobile
screenshots were inspected. Build: `ELk6jTZwuioS0WDF2exkG`.

The first browser run passed 26/27: after removing the status height, scrolling
to Contact at 720px leaves a thin strip of Canvas onscreen, so the animation
correctly continues. The existing offscreen test now uses a 600px viewport and
asserts Canvas bottom < 0 before retaining its exact stopped-frame assertion.
The full rerun passes without retries or skips. No runtime correction was needed.
Physical devices, Safari/Firefox and a fresh flag-off build were not exercised.

Final three-sample desktop/devtools Lighthouse: LCP **3129.075–3134.52ms** and
CLS **0** pass the existing 5000ms/0.1 limits. Scores **0.81/0.81/0.82** retain
the existing 0.9 warning. These local samples are not field p75 or a full scene
performance certification. Final diff/format/link checks and candidate hashes
are in the packet; unrelated pending work is preserved.

## Small playback follow-up — 2026-10-05

Latest refinement: Dimi requests one-size smaller Play/Pause icons and another
1px left shift. Render existing 24px SVG artwork at 16px through HexButton's
existing size override (now accepting 16); do not invent a new icon export.
Retain the 48px hex/52px native target and Play's internal 1px right correction.
The whole scene playback wrapper is now 2px left of its original grid position.
Playback Storybook matches the icon size; other controls keep their defaults.
Checks and exact candidate: [icon-size evidence](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/scene-icon-size-2026-10-05/README.md).

Subsequent optical refinement: Dimi requests moving the whole Play/Pause button
1 CSS px left on both pages. Translate only the scene's playback wrapper; retain
the small target, icon-only Play correction, right-side action and focus behavior.
The existing responsive browser assertion now checks the requested -1px offset.
Validation is recorded in the [offset evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/scene-button-offset-2026-10-05/README.md).

Dimi requests restoring small Play/Pause and removing “Animation paused here.”
from below WEB. StartScene and the Playback story use the existing small variant;
the row reserves its 52px native target. Both ordinary playing and local-Pause
messages are screen-reader-only with no space beneath the row. Restrictions and
failures remain visible. Play's 1px offset, left-aligned dialog and removed Start
development paragraph remain. No runtime, policy, shared preference or modal
behavior changes. Paused-message removal applies to the WEB action area; dialog
restrictions/explanations remain available inside the active modal.

Base `737d5fa9147eb9f3cac0ce0f3f8edc3c73e3ae8c` plus prior pending work. Exact
candidate, changed-byte validation and evidence are recorded in the
[local packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/scene-small-playback-2026-10-05/README.md).
Validation: 51 focused tests, frontend/validation types, lint, both production
builds and Storybook PASS. Production action/static checks pass 7/7 per flag
variant, including keyboard Pause/Resume, 52px targets, hidden paused status,
responsive layout, no-JS and restriction fallbacks. Paused mobile screenshot
inspected. Exact build IDs/hashes and preserved work are pinned in the packet.
Fresh Lighthouse/physical-device checks not run for this small follow-up; earlier
results remain historical. No independent approval, commit, push or deployment.

## Playback and copy refinements — 2026-10-05

Dimi requests four bounded refinements to the R23 action layout: use one-size
larger playback controls with Play shifted 1px right; left-align all customization
text; remove the visible playing status; remove the Start development paragraph.
Use existing medium HexButton on both routes and in its Playback story. Apply
the optical correction to Play only; the source SVG exports remain untouched.
The dialog now explicitly owns left alignment (including button text), avoiding
inheritance from its right-aligned trigger container. Keep the playing status
screen-reader-only with no reserved space; other explanations remain visible.
Remove the paragraph and unused CSS, retaining the site metadata description.

Candidate: `737d5fa9147eb9f3cac0ce0f3f8edc3c73e3ae8c` plus preserved prior pending
work and this refinement. Presentation/styles, the existing Playback story,
affected Start/static/action tests and contract/task records only. No simulation,
service, policy, intro or dialog-lifecycle edits. Existing current instructions,
architecture/workflow/template, plan sections 5.3–5.6, current contract and actual
consumer/control/tests inspected. The older plan's policy proposals do not reopen
accepted decisions. Source SVGs and generated token/bootstrap outputs preserved.

The [local evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/scene-polish-2026-10-05/README.md)
records exact incremental/full diffs, candidate/source hashes, commands, logs and
screenshots. Focused Start/scene/customization/Hex tests **53/53**, types,
validation types and full lint PASS. Production On/Off builds and Storybook PASS;
the affected production suites each pass **67/67** and shared Hex browser checks
pass **12/12**. Visual inspection then refined only the dialog's button-content
alignment (`justify-content: flex-start`); both production builds and Storybook
were rebuilt and the affected On actions/scrolling **5/5** and Off actions **3/3**
passed. No retry/skip used. Final build IDs: On `3ANq32g_qyg_I_oT4G7Ot`,
Off `Ph3TZawQiJTXTYEv2Oz1d`.

Fresh Lighthouse samples retain the existing desktop/devtools method, three runs
per separately compiled flag variant, LCP <=5000ms / CLS <=0.1 assertions and
performance >=0.9 warning. Both variants PASS LCP/CLS; On retains the 0.82
score warning and Off scores 1.00. Exact measurements and Chrome version are
in the packet; local sample aggregation is not field p75 or complete
scene performance certification. The initial two-state suites preceded only the
last CSS alignment refinement; final affected checks cover those changed bytes.
Mobile homepage/details and final dialog screenshots were inspected. Physical
phone/Safari/Firefox, independent review and final Dimi acceptance remain open.
No commit, push, deployment, runtime/policy change or threshold relaxation.

## Paired scene actions — 2026-10-05

Dimi supplies `/Users/dimi/Desktop/scr_01.png` and requests left-aligned hexagonal
Play/Pause beneath WEB, with More on the right on the homepage. The details page
uses the same layout with Customize and the Playground icon in place of More.
[R23](fs-4.1-scene-contract.md#r23--paired-web-scene-actions--2026-10-05) records
this bounded presentation change. The wireframe is an inspected visual reference;
its counters/dots/corner marks do not add a carousel or new scene selection.

The existing small outlined HexButton gains Play/Pause icon support and a
Storybook Playback example. StartScene owns one responsive action row; its left
control calls the unchanged scene pause/resume handle, with the existing dynamic
accessible names and status description. The right side renders the native More
ButtonLink with its More icon, or the existing SceneCustomization trigger with
Playground and visible label Customize (accessible name Customize animation).
The dialog title, actual-invoker ref, release/restore behavior and inline failure
feedback stay intact. Only this trigger's empty live-region reservation is
removed so it does not offset the row; the live region stays mounted.

More moves out of the Start section's separate block into that row and remains
server-rendered without JavaScript. No dead playback/customization button is
rendered before the consumer exists. Status explanations stay below the row.
Both actions can wrap at narrow widths/enlarged text without clipping focus.
Heading, WEB sizing, defaults, simulation/runtime, resolver, shared services,
intro, navigation and modal ownership are unchanged.

Candidate base: `737d5fa9147eb9f3cac0ce0f3f8edc3c73e3ae8c`, branch
`feature/funkspace-minimum-usable`, plus preserved pending WEB/icon work and this
action-layout patch. Paths: HexButton component/story, StartScene component/CSS,
SceneCustomization component/CSS, Start section, new scene-actions browser test,
the existing customization regression test and these two task/contract records.
The [local evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/scene-actions-2026-10-05/README.md)
pins exact hashes, incremental/full diffs, builds, commands, screenshots and logs.

Regression maintenance: the broad suite exposed five Reset cases still expecting
pre-R20 defaults 200/0.4/1. They now assert the existing shared default configuration
(286/0.2/0.1), preserving all state/RAF/runtime assertions. The focus spy records
the accessible label before text so route-departure checks remain meaningful
with the shorter visible Customize label. No policy/runtime fix or threshold
relaxation is included.

Validation: focused StartScene, SceneCustomization and HexButton tests **51/51**;
frontend types, validation types and full lint PASS. Separate production builds
PASS with animations enabled (`mMl0CgF5waNi0htuk3txn`) and disabled
(`kVWuySZzfTTUZJfpON612`); each passes **54/54** production browser checks for
scene actions, customization, policy and static/no-JavaScript behavior, with no
retries or skips. Storybook build PASS and existing hex-button browser checks
**12/12**, including four-theme accessibility, keyboard, touch-emulated targets,
enlarged labels and forced colors. The new paired-action checks exercise 320,
375, 768 and 1280 CSS px, 200% text, icon identity, keyboard pause/resume, native
More navigation and Customize dismissal/focus. Final settled 375px homepage and
details screenshots were visually inspected. Installed Chrome version and exact
commands are recorded in the evidence packet; touch emulation is not phone proof.

Initial runs exposed an unnamed Storybook render hook, the empty trigger-status
line's vertical offset, and the five stale Reset expectations. These were fixed
and the affected full checks rerun; initial failing logs remain available. The
first homepage test screenshot was taken during intro readiness, so the packet
also includes an explicitly settled capture after playback becomes available.
No Safari/Firefox/physical-device certification, fresh Lighthouse/performance
audit, independent review or Dimi visual acceptance is claimed. Existing FS-4.7
and FS-4.8 limits remain open. No commit, push or deployment in this task.

## Task metadata

- Status: C7 / contract R19 has Codex R2 technical PASS; F1–F3 closed. Firefox precision follow-up, FS-4.7 performance and FS-4.8 human acceptance remain open.
- Owner: Sites implementation; Codex R2 review and documentation handoff recorded below.
- Base: `01afc3fbe1a59804e690a31984f765ae76b44f1f`, clean `feature/funkspace-minimum-usable`.
- Started: 2026-09-29.
- Scope: FS-4.6 and its recorded amendments. Dimi authorized documentation, commit and push on 2026-09-30 after R2; deployment is not authorized.

The initial scope and dated implementation entries below are historical. R18/R19
and the R2 closure at the end of this record describe the current candidate;
there is no dialog thumbnail and the ready scene remains frozen behind it.

## Requested outcome and reconciled prerequisites

Dimi requests FS-4.6 controls/overlay coordination and explicitly keeps customization off the main homepage WEB animation. Add a real button-styled **More** link to the accepted `/animations/aperture` details route. Retain homepage Pause/Resume. The details page owns its own temporary scene and a **Customize animation** dialog with density, speed, size and Reset; Dimi supplies the educational description later.

Inspected AGENTS, README/package scripts, architecture/ADRs, AI workflow/template, milestone, FS-3.6 closure/API, current FS-4.1 R16 and FS-4.5 closure, actual shell/navigation/Dialog/useDialog, scene/controller/settings and tests. Supplied plan located at `/Users/dimi/Downloads/FunkSpace_EPIC_4_Detailed_Plan.md`; sections 5.1, 5.6 and FS-4.6 inspected. Historical references are not reset targets. FS-4.5's latest correction has Codex R2 technical PASS; final visual/device/performance acceptance remains open and is not invented by this next-task authorization.

Accepted D11 selects a details-page shared Dialog and static thumbnail; D12 selects shell-local coordination for navigation/customization. Dimi's newer [lightweight representation rule](../architecture.md#particle-rendering-and-fallback-cost) supersedes dense particle-SVG previews: reuse the existing solid WEB silhouette for the modal thumbnail, label it as static artwork, and explain that configuration applies to the same scene on closing. No thumbnail Canvas or secondary simulation. Count/speed/size defaults, limits and units come from current `ParticleSettings`, not the older plan's numbers. No new design-source inspection or unseen-video match is claimed.

## Plan and contracts

1. Add the details route and native homepage link; reuse the existing scene consumer with details-only customization enabled. No settings transfer to/from the homepage, storage or URL.
2. Add a narrow details-shell context for only `none`, `navigation` and `customization`. Keep the closing owner until Dialog release, retain only the latest requested destination, and clear queued work on departure/unmount. Gate customization until native navigation has safely handed over after becoming idle. Keep original navigation tickets and fallback semantics.
3. Use existing Dialog, Button and field conventions with native labeled ranges. Display effective normalized Domain values and units. User Reset configures defaults then restores the seeded state; local Pause, shared policy/theme and runtime identity remain unchanged.
4. Keep one scene runtime. Modal ownership is an environmental suspension, not Pause. Existing paused/Reduced still redraws apply when visible; denied/failed states keep lightweight artwork and never prepare solely for a preview.
5. Test controls/normalization/Reset, one-modal release ordering, failed open, departure/cancellation, native hydration, focus/scroll, no persistence, accessibility and responsive/text layouts. Run relevant types/lint/tests/builds/Storybook and production browser checks; record limits.

## Inspected/proposed paths

- Existing: `StartScene`, `Start`, `PortfolioShell`, `PortfolioNavigation`, scene controller/port, typed destinations and their tests/stories.
- Proposed: `app/animations/aperture/page.tsx`, details-only `SceneCustomization`, narrow `PortfolioOverlayScope`, focused tests and browser specification.
- Protected: particle tuning/rules, Canvas update/scheduling, shared policy/theme, Dialog binding, navigation handoff adapter, generated assets/tokens, game packages and dependencies. Extend only if actual tests establish a necessary bounded change.

## Evidence and handoff

Exact before/after source hashes, diff and command/browser outputs are retained locally under `artifacts/fs-4.6/` in the task workspace. Results, deviations and outstanding review/acceptance are recorded below as work completes. Implementation checks do not constitute an independent technical review or Dimi product acceptance.

## Delivered behavior and ownership

- Homepage: existing presentation/Pause/Resume plus native outlined **More** link. No Customize button, ranges or dialog there. The details module is dynamically loaded only for the details consumer.
- Details route: its own scene, **Customize animation**, shared Dialog, native ranges, effective outputs/help, Reset and lightweight static WEB thumbnail. Detailed educational description remains future Dimi copy. Values are per scene mount: close/reopen retains them; route departure/reload returns defaults. No transfer to the homepage or writes to preferences/storage/URL.
- `PortfolioOverlayScope` is enabled only by the details shell. It knows two owners, stores one latest pending owner and delegates focus/locks to Dialog. The closing owner remains until `onReleased`; the parent also acknowledges cancellation before native acquisition, after child Dialog sync. Stale/wrong-owner releases are ignored. Departure sets the shared navigation disposition before either dialog closes and clears the queue; unmount disables retained actions and releases the subscription.
- Existing navigation tickets, dismiss versus navigation, actual invokers, native links, history, visible fallback and idle native-disclosure handover remain intact. Customization stays unavailable until handover completes. Failed Customize opening gives inline feedback; failed navigation enhancement restores ordinary links and prevents competing customization.
- Modal ownership is environmental occlusion. It preserves the scene handle/Canvas and local Pause, stops frame work while covered, and resumes only if previously eligible. Edits call existing Domain normalization through `configure`, with effective snapshots driving the UI. No new rules, scheduler, storage, preferences or renderer.
- User Reset calls default `configure` followed by low-level seeded `reset`; it does not call Resume or modify shared services. Off/failure retain solid WEB, explicit Reduced remains still, Pause remains set. The thumbnail owns no Canvas and does not claim to preview configuration. Permitted scene changes appear after closing.
- Early navigation failure while Canvas loading: the details consumer settles to independent solid WEB when covered, without preparing/resuming a denied runtime or replaying reveal. A browser test first reproduced opacity 0 after native fallback dismissal, then verifies opacity 1, no Canvas and no frames. Homepage reveal remains unchanged because this branch requires the details-only `customizable` option.
- The dialog scrolls as one panel. Visual inspection caught an enlarged heading consuming most of a 375×320 window; the final layout permits scrolling past it and the regression requires Reset to be fully in view, not merely intersecting the viewport.

### Effective input contract

Current author tuning is preserved from `frontend/domain/particles/ParticleSettings.ts`; the UI reads those values directly.

| Control | Default | Range / step  | Units and semantics                                                             |
| ------- | ------- | ------------- | ------------------------------------------------------------------------------- |
| Density | 200     | 20–200 / 2    | Particle count; surviving identities retained by existing rules                 |
| Speed   | 0.4     | 0.2–0.6 / 0.1 | Velocity multiplier; affects motion only when permitted                         |
| Size    | 1       | 0.5–2 / 0.1   | Radius multiplier; 1–3 CSS px at default size, displayed effective radius range |

Finite out-of-range calls clamp and normalize to approved steps in Domain. Malformed/nonfinite fields retain their previous effective values; the UI does not introduce a competing validation policy. Reset uses current settings defaults, not historical plan numbers. Connection tuning, motion authority, palette resolution, pure simulation and Canvas updates are unchanged.

## Validation evidence

Evidence packet: [FS-4.6 handoff and command outputs](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.6/README.md). It contains the exact patch, before/after manifests, reproducible command records, browser JSON results and screenshots. Local evidence paths require this workspace; the summary and test sources remain in the repository.

| Check                                    | Result / scope                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full Vitest                              | 1,805 tests / 118 files PASS. The full run preceded the two final details-only presentation corrections; affected tests were rerun below. Initial failure was the destination contract missing the newly authorized route; corrected the expectation.                                                                                                          |
| Final affected tests                     | 50 tests / 6 files PASS after the scrolling and early-navigation fallback corrections; controller/port fakes are identified in source. New scope/control coverage is 14 tests.                                                                                                                                                                                 |
| Types                                    | `pnpm typecheck:validation` PASS; production builds also type-check application sources.                                                                                                                                                                                                                                                                       |
| Lint/format                              | PASS, zero ESLint warnings/errors; Prettier and generated-bootstrap freshness pass.                                                                                                                                                                                                                                                                            |
| On/Off production builds                 | Both PASS; actual build-time flag variants, existing aperture validator and generated-token/bootstrap freshness checks retained.                                                                                                                                                                                                                               |
| Storybook                                | Build PASS; Available/Unavailable/Narrow customization stories added. Existing large-chunk build warning retained.                                                                                                                                                                                                                                             |
| Existing Chrome production regressions   | 119 PASS: navigation/hydration, intro/logo, policy/theme, scene, aperture/lifecycle and static routes. This run preceded the final details-only scrolling and covered-startup fallback corrections, subsequently covered below.                                                                                                                                |
| Final customization and scene, Chrome On | 38 PASS (19 customization + 19 homepage scene): native keyboard limits, effective values, Canvas identity, Pause/Reset matrix, storage-write baseline, close/reopen/reload, one modal/release ordering, failed opens, route/history cleanup, delayed hydration and no-JS.                                                                                      |
| Final Chrome Off                         | 44 PASS: 19 customization + 19 existing scene cases + 6 navigation-hydration cases. No Canvas preparation under the disabled build. Early-return On-only cases in the existing suite are not claimed as Off runtime evidence.                                                                                                                                  |
| Final Firefox On                         | 19 customization cases PASS using the installed Firefox engine.                                                                                                                                                                                                                                                                                                |
| Unfiltered accessibility                 | Zero axe violations on closed details page and open dialog in Default, Dark, Muted and High Contrast; 320×568, 812×375, 375×320 at 200% text, and 1280×800 at 200% text. No rule exclusions; Chrome On/Off and Firefox On.                                                                                                                                     |
| Visual inspection                        | Chrome screenshots of details page, modal top, narrow portrait and short 200% text inspected. Entire Reset button reachable; no horizontal overflow. This is implementation QA, not Dimi acceptance.                                                                                                                                                           |
| Lightweight representation               | Fresh Chrome 154 probe, Follow system + OS reduce: homepage HTML 64,099 B, details HTML 51,618 B (uncompressed). Each scene has one 626-character WEB path, zero particle circles/lines and zero Canvas. Hydrated DOM 350 / 358 nodes respectively; opening the modal adds no particle graph. Homepage does not request the customization chunk; details does. |

Test authoring failures (theme startup storage baseline, exact High Contrast label, native Home `/` destination, thumbnail-aware selector and explicit TypeScript annotations) are preserved in earlier logs; final runs pass. The storage assertion compares all writes after startup rather than suppressing scene-key failures. No production test or accessibility threshold was weakened.

### Reproduction

Use the repository's dependencies and scripts. Keep builds separate for `NEXT_PUBLIC_ANIMATIONS_ENABLED=true` and `false`; do not change a flag only on the server after building. Evidence `run.py` records exact commands and timestamps. `browser-run.py` serves isolated On/Off builds on 3267/3266, refuses occupied ports, uses one worker/no retries and records JSON/screenshots. Set `FS35_AVAILABLE` to match the actual build. The normal production Playwright config may be used with equivalent local settings; the no-JS test resolves its URL from that configuration rather than a hardcoded helper port. The evidence helper paths point to `/tmp/fs45/on` and `/tmp/fs45/off`; recreate those from the exact candidate before reusing them.

```sh
pnpm typecheck:validation
pnpm lint
pnpm test
NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm build
pnpm storybook:build
# Against that On production build, then repeat against an independently built Off copy:
FS35_AVAILABLE=true pnpm exec playwright test --config playwright.production.config.ts e2e/scene-customization.spec.ts
```

The retained Lighthouse configuration uses the existing desktop preset, 150 ms latency, 9,216 Kbps throughput, three runs per URL, LCP ≤5,000 ms and CLS ≤0.1 at p75; performance score ≥0.9 remains a warning. Local helper ports and explicit Chrome path are the only environment substitutions; the new details URL is included. Fresh results are summarized in the evidence packet and below. These are startup checks, not the FS-4.7 frame/interaction/physical-device audit.

### Final C2 startup measurements

Three fresh runs per URL and actual build flag, after the final fallback correction. All LCP/CLS error assertions pass. The homepage On performance-score warning is retained; these results do not close FS-4.7 or Dimi scene acceptance.

| Build | Route                  | LCP range (ms) | CLS    | Performance score |
| ----- | ---------------------- | -------------- | ------ | ----------------- |
| On    | `/`                    | 3102.9–3117.5  | 0.0000 | 0.81              |
| On    | `/animations/aperture` | 456.6–459.7    | 0.0092 | 1.00              |
| Off   | `/`                    | 451.1–454.6    | 0.0000 | 1.00              |
| Off   | `/animations/aperture` | 454.7–458.7    | 0.0092 | 1.00              |

## Review handoff and open acceptance

Candidate **FS46-C2**, based on `01afc3fbe1a59804e690a31984f765ae76b44f1f`; exact application/test source manifest aggregate SHA-256 `2a468e95543cb098c51550a602705e1e014c4254be392c6f08cd774d59688cdf`. The evidence packet records all changed paths, complete diff and hashes. Application/Domain/Infrastructure sources, trusted SVG assets, generated outputs, dependencies and game sources retain their baseline bytes; changes are Presentation, destination data, tests/stories and documentation.

Codex review should inspect the exact candidate's two-consumer release/departure ordering, native handover gating, effective input/reset behavior and unchanged runtime identity; then review the production evidence without treating port fakes as native-browser proof. Dimi should review the details-page placement, labels and static-thumbnail explanation. No extra homepage settings or invented educational copy was added.

Safari and nominated physical phones are not exercised in this task. Dimi's final visual/motion acceptance, educational copy and FS-4.7 performance audit remain open. No commits, pushes, PRs, remote changes or deployment are part of this task. No shared services are initialized or disposed by these new consumers.

## C3 — details startup flash correction — 2026-09-30

Dimi reports solid WEB flashing before the detail-page animation. Inspection
found that the pre-hydration `pending` selector was homepage-only, while the
details shell's initial navigation-not-ready gate was also treated as settled
occlusion and latched static artwork. This correction is bounded to that startup
handoff; prior C2 validation remains historical, not evidence for the new bytes.

The details scene now composes a small trusted parser/CSR startup adapter through
`SceneStartupScript`. It reuses the pure resolver and current preference key for
one-time eligibility, without preference writes, a second frame chain or shared
service lifecycle changes. Eligible SSR artwork stays concealed until the first
valid Canvas frame; Reduced reveals its permitted still. Scene geometry remains
observable. Denied policy, feature-off, no-JS, palette/mask/runtime failure and a
bounded 5 s startup deadline retain complete solid WEB. The deadline is terminal
for that mount: late hydration may recover Canvas but cannot hide/re-fade the
already visible artwork. Startup observer/timer ownership is transferred to the
hydrated composition and released on completion/unmount.

The shell records that navigation handover has succeeded before allowing
occlusion to settle this first reveal. Later modal/navigation failure behavior,
native fallback, local Pause, effective settings and runtime identity are
preserved. Header/navigation do not wait for the scene. Domain particles, Canvas
update/drawing, assets, generated output and the separately edited Storybook
controls are unchanged.

Validation and exact incremental candidate hashes are recorded in the local
`artifacts/aperture-startup-fix` evidence packet. New checks exercise pre-paint
concealment, delayed Canvas loading/reload under On and Reduced, bounded
pre-hydration failure and late recovery, plus the existing details/homepage
regressions. This is a startup correctness fix, not FS-4.7 performance or Dimi
visual acceptance. No commit, push or deployment is authorized here.

C3 validation: **59 focused tests passed** (startup adapter, StartScene,
customization, shell and overlay scope); **72 Chromium production tests passed**
with no retries/skips, including the new On/Reduced load/reload paint probes
(zero visible fallback frames before Canvas), the delayed-hydration deadline,
navigation failure during loading, no-JS, all motion choices, palette/context
failure, and four unfiltered accessibility/layout checks. Types, lint,
production On build and Storybook build pass. The timer-count test setup was
corrected to isolate scene-owned timers from jsdom storage-event timers; no
production behavior assertion was removed. Flag-off is covered by the startup
unit contract; no new Off production build, physical-device or cross-browser
result is claimed. Exact logs and before/after hashes are in the
[local C3 evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/aperture-startup-fix/README.md).

## C4 — expanded customization — 2026-09-30

Implements Dimi's six requested controls from [R18](fs-4.1-scene-contract.md#r18--expanded-customization--2026-09-30).
Density 10–1000, speed 0.1–2×, size 0.1–4×, maximum connections per particle
1–100, connection distance 1–10×, and transparent WEB overlay On/Off. All numeric
values share immutable metadata and Domain normalization; malformed/nonfinite
fields retain prior effective values, finite values clamp/snap. Existing defaults
remain, with maximum degree 100. All inputs stay local and temporary.

The pure graph sampler reads effective connection settings without altering
simulation state. Shortest eligible pairs take priority when degree constraints
bind, with both endpoint degrees enforced and no bucket/input-prefix bias.
Candidate/output buffers and retry work remain bounded by the previous absolute
limits, now explicitly independent of the expanded count limit. A density-based
budget estimate avoids costly retries that are already known to exceed those
limits. Distance can plateau/shorten under limits; the control explains this.

Overlay transparency is presentation-only state: change the existing cover's
opacity over a ready Canvas, retain the mask instance and runtime, and keep
solid WEB in unavailable/denied states. Reset restores opaque WEB alongside all
five defaults and seeded state, retaining local Pause, themes and restrictions.
The production thumbnail remains lightweight solid artwork, not a particle DOM
graph. No new preferences, services, frame owner or homepage controls.

This candidate builds on HEAD `01afc3fbe1a59804e690a31984f765ae76b44f1f` plus
the existing uncommitted FS-4.6/startup and Storybook work. Exact incremental diff,
source hashes, checks and browser evidence are in the local
`artifacts/aperture-controls-expanded` packet. Final validation is recorded there;
FS-4.7, physical-device performance and Dimi visual acceptance remain separate.
No commit, push or deployment is authorized.

C4 validation: **119 test files / 1,827 tests passed**, including the expanded
normalization, both-endpoint degree caps, stable graph ordering, survivor identity,
paused adapter redraw and overlay/fallback contracts. The final focused selection
also passed **152 tests**. Types, lint, production On build and Storybook build
pass. **63 Chromium production checks** and **4 Storybook checks** passed with
no retries/skips, covering all five keyboard ranges, close/reopen/reload, Reset in
all motion states, retained Canvas identity/pixels on transparent-overlay changes,
failure/no-JS, modal coordination and four unfiltered accessibility/layout checks.
Wide and narrow dialog captures were visually inspected, including the scrolled
switch/Reset area; the panel scrolls without horizontal overflow.

At all numeric maxima, a local instrumented production sample recorded 52 draws,
up to 4,604 lines, median 2.3 ms, p95 2.5 ms and maximum 3.2 ms for the sampled
Canvas command interval. This excludes full frame work/compositing and is not a
device performance acceptance result. Opening navigation stopped scene playback.
No fresh flag-off production build, physical-phone or cross-browser result is
claimed. The exact incremental candidate, hashes, screenshots, raw draw sample
and logs are in the [C4 evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/aperture-controls-expanded/README.md).

## C5 — wheel and touch scrolling — 2026-09-30

Dimi reports customization only scrolling through scrollbar dragging. The panel
uses block layout so its header and controls scroll together, but the shared
inner content retained `overflow: auto` and `overscroll-behavior: contain`.
That inner non-overflowing scroll container consumed wheel/touch gestures before
they reached the outer panel. Previous programmatic visibility/keyboard checks
did not exercise gesture scrolling and therefore missed this regression.

Keep the existing whole-panel scroll owner. The shared content overflow defaults
to `auto` through a CSS property; only customization overrides it to `visible`,
removing its inner scroll container. The dialog itself retains overflow and
overscroll containment. Native modal locking, focus restoration, navigation,
Canvas, settings and lifecycle code are unchanged. No input interception or
manual scroll handler is introduced.

Add production regressions that scroll over content padding using actual wheel
input and Chromium touch-event sequences, in both directions, to reach Reset.
Assert background scroll stays fixed at the bottom boundary and dismissal
restores focus and releases the document lock. These are browser-emulated touch
gestures, not physical-phone evidence.

Both gesture regressions failed against the unchanged C4 production build
(dialog scroll offset remained zero). With the CSS correction, **26 production
browser checks** and **16 shared-dialog Storybook checks pass**, including both
gesture directions, Reset reachability, boundary containment, dismissal focus,
no-JS, navigation coordination and narrow/short/200% accessibility checks.
**33 focused component/binding tests**, validation types, lint, production On
build and Storybook build pass. The retained Storybook large-chunk warning is
unrelated to this CSS correction. No physical phone or Safari result is claimed;
no Lighthouse run is needed for this scoped overflow fix. The source change is
limited to two stylesheets plus regression coverage and this record; no commit,
push or deployment was performed. Exact candidate and logs:
[C5 evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/aperture-scroll-fix/README.md).

## C6 — Aperture - 1 and retained Canvas — 2026-09-30

Implements Dimi's six requests from the attached 13.06.38 screenshot and R19 of
the [scene contract](fs-4.1-scene-contract.md). The dialog removes its duplicate
WEB artwork and begins with Reset then overlay transparency. Five controls and
explanations follow; C5 whole-panel scrolling is preserved. The current Canvas
remains visible and paused behind the modal. No second image/simulation is
created. Event-driven redraws can reflect edits while continuous scheduling stops.

The shared pure resolver adds an optional Off-still capability, default false.
The particle controller and startup adapter declare it; Off may prepare a still
under the same environmental/availability gates as Reduced, but never grants
playback. Async eligibility probes `mayPrepare` rather than `mayRun`, retaining
cancellation and stale-result guards. Modal suspension is separate from frame
visibility; no Canvas adapter or particle update code changes. Eligible Off
startup waits for the valid frame without a motion fade. Failures retain solid
WEB. This supersedes the older no-Canvas-under-Off scene contract; logo/game
behavior and shared preference values stay intact.

The homepage/details title, metadata and first Animations menu link now name the
scene Aperture - 1. Existing native destination/handoff behavior and URL stay in
place. Appearance Default becomes Light; motion Follow system becomes System.
Only display labels change. Tests scope duplicate System buttons by their groups.
No commit, push or deployment is authorized.

C6 validation: **119 files / 1,833 unit tests passed**; validation types, lint,
production builds with the animation flag On and Off, and Storybook build pass.
The initial 90-case production run passed 78 cases. Eleven failures reflected
superseded label/link/fallback assertions; their corrected checks plus the added
Off recolor/resize case passed in a 13-case rerun. Thus **90 distinct production
checks pass; one existing alignment check remains failing**. Six Storybook checks
and all eight actual flag-Off motion/OS combinations pass. Off draws one still
and never continuously runs; denied flag startup creates no Canvas. Tests verify
the same frame/pixels behind customization, no preview, action order, native
destination navigation, persisted-value compatibility, no startup fallback blink,
Reset, both scroll gestures, accessibility and local-Pause preservation.

The remaining navigation test observes menu Close at y=0 after opening versus
the captured trigger y=12. A fresh build from all **unchanged starting sources**
reproduces the identical mismatch. It is a pre-existing shared navigation issue,
not repaired in parallel with this scene task; the original assertion is retained.
No independent review or all-green browser-suite claim is made. Desktop/narrow
dialog captures were visually inspected. Physical phones, Safari/Firefox and
final performance acceptance remain outstanding. Evidence, exact incremental
diff and source hashes: [C6 packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/aperture-one-refinement/README.md).

## C7 — FS-4.6B review corrections — 2026-09-30

Addresses the three findings in the [Codex R1 review](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.6b-review-r1/REVIEW.md),
against C6 / contract R19. Product decisions are unchanged. This is the Sites
correction candidate for independent re-review, not a declaration that Codex has
closed the findings or that Dimi has accepted the scene.

- F1: desktop navigation now derives one viewport top from its existing header
  offset and the shared Dialog binding's owned scroll snapshot. Both the rail
  and smaller Close use that coordinate. Safe-area clamping remains; mobile
  horizontal anchoring is preserved. Removing the mixed vertical anchor/scroll
  calculation also fixes the mismatch after mobile-to-desktop resizing. No new
  observer, DOM measurement, scheduling or shared Dialog lifecycle is introduced.
- F2: the four static-homepage cases expect the approved `Aperture - 1` heading.
  Their remaining artwork, IDs, geometry, keyboard and accessibility checks stay
  intact.
- F3: the existing browser helper gains an opt-in current-position click for the
  alignment and query-removal tests. It requires the launcher to be fully in the
  viewport, then sends real pointer input at its center without locator scrolling.
  Other callers retain ordinary locator clicks. All scroll, focus, history and
  alignment assertions are preserved; the alignment setup explicitly settles at
  20 CSS px before capturing its expected position.

Changes are limited to the navigation stylesheet, existing browser helper, three
browser specifications and this record. Particle rules, Canvas, controller,
motion policy, aperture, service construction and shared Dialog code retain their
C6 bytes. Exact incremental diff, source hashes, logs and before/final alignment
captures are in the [C7 evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.6b-corrections/README.md).

Fresh validation: **103/103 Chrome production checks pass**, including the exact
alignment case, all eight query-removal journeys and all four static-homepage
cases, plus navigation lifecycle/hydration/transitions, customization, actual
wheel/emulated touch scrolling and unfiltered accessibility. **104 focused unit
tests**, validation types, lint/formatting and the production On build pass.
The first narrow run passed 12 cases but exposed a further header/rail mismatch
after resizing; the final coordinate correction passes that retained assertion.
Final 1280/320/768 captures were inspected and retain the launcher's exact box.

Firefox 146.0.1 passes **27/30** checks, including the corrected alignment and
four static cases. Three strict numeric assertions remain: two mobile Home-link
heights report 47.999992 CSS px against 48, and mobile Privacy Forward reports
799.866638 instead of 800 CSS px. These are recorded as precision-sensitive test
limitations; their assertions and tolerances were not changed. No all-green
cross-browser claim is made. Safari, physical phones, a fresh flag-Off build and
Storybook were not exercised for this CSS/test correction. Independent Codex
re-review remains required; FS-4.7 and FS-4.8 stay separate. No commit, push or
deployment was performed.

## Codex R2 closure and authorized delivery — 2026-09-30

**PASS — technical checkpoint for C7 / contract R19.** The separate read-only
[R2 re-review](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.6b-review-r2/REVIEW.md)
closes F1 (scrolled desktop alignment), F2 (four obsolete homepage headings) and
F3 (automatic locator scrolling in navigation test setup). No new blocking source
defect was found. This records the review outcome, not Dimi's final visual
acceptance or EPIC 4 completion.

The reviewed base is `01afc3fbe1a59804e690a31984f765ae76b44f1f` plus the captured
working tree. The six-file C7 correction SHA-256 is
`1a2dd961a0644eae4011a05e8ed0531bd4c31629c9ebd2f37e8fc32979aa5412`.
All 688 captured files matched the review manifest before this documentation
handoff; all 75 pending paths belonged to that candidate. Application sources
remain unchanged during this handoff. The containing Git commit identifies the
delivered candidate, including these documentation status updates.

Fresh R2 evidence: **103/103 Chrome production checks**, **9 files / 104 focused
unit tests**, validation TypeScript and diff checks pass. Firefox is **27/30**:
two mobile Home-link boxes report 47.999992 CSS px against 48 and one Privacy
Forward position reports 799.866638 against 800. R2 classifies these as a
non-blocking P3 test-portability follow-up, owned by Sites/navigation tests.
Define narrowly justified subpixel comparisons while preserving minimum-size,
focus, lock, route and history checks; do not skip tests. No tolerance was changed
by the review or this handoff.

R2 reused the byte-matched C7 production On build
`i8z2yUXkLsBhlHSFURJQu`. C7 lint/build results and earlier actual flag-Off,
full-policy and Storybook evidence remain attributed to those runs, not new R2
measurements. Documentation handoff checks cover content, links, formatting and
diff whitespace; application tests/builds need no duplicate run for prose alone.
Evidence packets are local files linked above, not published remote artifacts.

Dimi explicitly requested documentation, commit and push after the PASS. This
authorizes delivery on `feature/funkspace-minimum-usable`; it does not authorize
deployment or imply FS-4.7 performance certification, FS-4.8 human acceptance,
Safari/WebKit or physical-phone validation. Those limits remain open.
