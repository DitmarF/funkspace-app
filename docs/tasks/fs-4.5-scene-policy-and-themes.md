# FS-4.5 — Start scene policy and themes

## Task metadata

- Status: Implemented; latest Reduced/reveal correction has Codex R2 technical PASS (F1 closed). Final scene/device/performance acceptance remains open.
- Owner: Sites/Codex implementation; independent checkpoint review and Dimi acceptance remain separate.
- Started: 2026-09-29.
- Base: `41ec5d5109cf1edbd4aabbed70479b244b9c27ec`, clean `feature/funkspace-minimum-usable`.
- Prerequisites: [FS-4.1 contract](fs-4.1-scene-contract.md), [FS-4.3 runtime](fs-4.3-canvas-lifecycle.md), [FS-4.4 aperture](fs-4.4-svg-aperture.md), FS-4.4B R2 review (F1–F3 PASS).

## Requested outcome and scope

Integrate the reviewed WEB scene into Start with the provider-owned four-choice motion policy, semantic theme colors and persistent local Pause. Denied preparation, unavailable/failed runtime and no JavaScript retain complete static artwork. Preserve the header identity, existing introduction, navigation focus/hydration and game independence.

The implementation request authorizes FS-4.5 only. It does not authorize FS-4.6 customization, new preferences, dependencies, generated-file edits or deployment. Later user instructions authorize the retained tuning and, on 2026-09-29, documentation updates plus commit/push of this candidate; see the delivery record below. The earlier Start-static-only tests are superseded by the explicit homepage integration request; header identity remains protected.

## Inspected evidence and implementation plan

Inspected root AGENTS, README/package scripts, architecture/ADRs, AI workflow/template, milestone, EPIC 3 closure, FS-4.1–4.4 records, actual Start/shell/navigation, motion resolver/provider/composition, controller/binding/Canvas/aperture and associated tests. Supplied plan: `/Users/dimi/Downloads/FunkSpace_EPIC_4_Detailed_Plan.md`, sections 5.3–5.4 and FS-4.5. No unseen video is claimed as inspected or matched.

1. Add a narrow content-readiness callback to the existing intro binding, observing its actual root state including parser fail-open; no timer or second sequence.
2. Forward readiness and navigation occlusion through a per-shell presentation context. Dialog retains ownership and focus semantics.
3. Mount one service-created scene controller, reuse bounded pure static data and the existing WEB aperture, expose accessible Pause/Resume and actual resolver blockers.
4. Freeze resolved palette values at the infrastructure boundary. Preserve runtime identity, configuration and local intent through theme/policy/environment changes.
5. Validate actual homepage behavior in production On/Off builds plus focused units, types, lint and browser checks; record exact limits.

## Validation and handoff

Technical results, independent review, performance acceptance and Dimi visual acceptance are recorded separately. Existing Lighthouse limits/warnings are not new scene performance results. Safari and physical-device evidence from earlier checkpoints remain unavailable.

## Implemented contracts

The following initial integration contracts are historical where amended by R15/R16 below.

- `StartScene` replaces only the former large Start logo. Header identity and Start's semantic heading/copy remain. The WEB Black asset, fit, cover, circle-loading fallback and solid no-mask fallback are reused unchanged.
- `bindParticleScene` in the existing composition root continues to construct the controller/adapter. Start owns one handle and its subscription; it never activates/disposes ThemeService or motionPolicy. The controller consumes `decorativeMotionAvailable`, provider policy and the existing resolver. Its snapshot now exposes the resolver's blockers so UI explanations cannot imply that Resume overrides a hard restriction.
- Start opts into motion, with no reduced alternative. On overrides OS signals only. Pending/unavailable policy, Reduced/Off, flag-off, hidden document/scene, intro/cover readiness and local Pause retain their established gates. Failed preparation is terminal for the owned handle. Pause remains local, is never persisted and survives policy/theme/visibility changes.
- A ready paused runtime may redraw once after a visible palette/geometry change. Denied preparation uses the shared `ParticleStill` component from immutable bounded pure data; no Canvas is created for previews. React receives discrete snapshots only, not particle frames. The aperture's existing bounded mask-capability probe is distinct from scene runtime preparation.
- The intro binding's optional callback reports content visible only at the existing `visible` state (or absent intro). Its narrow attribute observer also catches parser fail-open/interaction. No sequence, delay or timer was added. The shell forwards readiness and navigation occlusion; navigation clears occlusion on Dialog release/open failure and preserves its existing focus/navigation tickets. Future customization coordination remains FS-4.6.
- Infrastructure resolves semantic background/primary values on observation/theme events, validates them without Canvas, rejects missing/invalid/unresolved/context-dependent colors, caches identical immutable pairs and passes colors to the existing runtime. No frame reads CSS. Theme changes do not reseed, reset, replace runtime or replay the intro.
- Controls are outside decorative `aria-hidden`/non-interactive layers. Server HTML contains complete solid WEB and readable copy without a dead scene button. The controls/status reserve space, fixing an observed 24px mobile height change at intro completion. Hard-denied controls are disabled with a reason; a retained Pause is stated explicitly.

## Validation evidence and distinctions

Accessible local packet: [FS-4.5 evidence](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.5/README.md). The packet includes commands, result JSON/logs, both build IDs, exact source/diff hashes and browser screenshots. It is local evidence, not uploaded; transfer the packet for review on another machine.

- Full Vitest suite: **1,777 passed across 116 files**. New consumer tests use the actual controller with fake environment/runtime ports: four preferences, unknown/unavailable OS, every On gate, retained Pause, failure, Strict Mode release and static fallback. Existing pure-domain/actual-adapter suites remain included. Unit fakes are not browser rendering evidence.
- Application and validation TypeScript, strict lint/formatting, trusted SVG validation, production flag-On/Off builds and Storybook build pass. Storybook retains its existing dependency/chunk warnings; no thresholds changed. Start stories reuse the existing service-fixture parameters.
- Chromium broad On run: **112 passing assertions**, including intro, logo, navigation hydration, settings, actual Canvas/aperture and native route/no-JS contracts. Its idle worker needed explicit cleanup after all tests; the finalized report exited 0. This teardown issue is retained in evidence, not silently called a clean runner shutdown.
- Final Chromium homepage run: **16/16 passed with clean exit**, including exact paused draw coordinates across all four themes (rounded to 0.0001 CSS px), resolved Canvas color, same Canvas identity, policy matrix, On/OS behavior, document/offscreen suspension, failure, blocked storage/missing signals, server/hydrated IDs, no-JS, reserved geometry and accessibility.
- Chromium Off run: **111/112 passed**, one 404 reload aborted (`net::ERR_ABORTED`). The unchanged route suite was rerun: **13/13 passed with clean exit**. No application repair or relaxed assertion was used for that browser navigation transient.
- Earlier failures were retained: mobile status height changed during the reveal (fixed by reserved geometry); the old second-tab test advanced 1.7s past the accepted 1s logo and into the 400ms menu fade (changed to 1.1s, preserving sequence/duration assertions); Axe cannot inject in JavaScript-disabled contexts (Axe remains enabled for JS cases; explicit no-JS semantics, focus, artwork and navigation checks remain).

Final Firefox homepage run: **16/16 passed with clean exit**, including real native masking, theme/paused-state preservation, policy gates, Canvas failure and no-JS. Lighthouse startup results are recorded below; they are not particle callback/frame-delivery measurements and cannot close FS-4.7.

## Protected bytes and remaining handoff

Particle rules/settings/connections, Canvas update/scheduling, trusted aperture/assets, shared resolver/policy/theme service, game sources, generated tokens/bootstrap and dependencies remain unchanged. The only pure port change exposes existing permission blockers; there is no new settings authority, scheduler or modal manager.

Already selected devices remain Sony Xperia XQ-CC54 / Android 14 and MacBook Pro with Chrome/Safari/Firefox. This session uses desktop automation and emulated viewports; no new physical-phone or human Safari result is claimed. Host OS: macOS 26.7 (25G229); exact model/chip was unavailable in the sandbox. No unseen YouTube/Figma visual match or Dimi moving-scene acceptance is claimed. Current repository tuning (200 particles, speed 0.5, size multiplier 3, connection distance multiplier 6) is preserved, not newly approved or retuned.

Independent integrated policy/overlay review, later FS-4.6 customization/details work, final FS-4.7 budget/device audit and Dimi visual acceptance remain separate. This task does not commit, push, publish, deploy, upload, or start FS-4.6.

## Fresh production startup measurements

The existing three-run Lighthouse 12.6.1 desktop/DevTools-throttled configuration is retained: 1350×940, DPR 1, 150ms request latency, 9,216Kbps download/upload, CPU slowdown 1. System/no OS reduction, default theme, current scene defaults and WEB aperture. Dedicated free ports 3287 (On) / 3286 (Off) were checked before launch; hashed production chunk URLs were verified in all reports. Build IDs and exact configs are in the packet.

| Compiled flag | LCP samples (ms)               | CLS samples | Performance scores | Existing assertions                                     |
| ------------- | ------------------------------ | ----------- | ------------------ | ------------------------------------------------------- |
| On            | 3270.325 / 3261.361 / 3284.849 | 0 / 0 / 0   | 0.81 / 0.81 / 0.81 | LCP ≤5000 and CLS ≤0.1 pass; score <0.9 warning remains |
| Off           | 450.238 / 451.208 / 454.224    | 0 / 0 / 0   | 1.00 / 1.00 / 1.00 | Pass                                                    |

Fresh On startup is roughly 0.2s slower than the retained FS-4.1B pre-scene On capture (about 3.1s / score 0.82). Sequence duration assertions still pass; the new 0.81 score is explicitly a fresh warning, not relabeled as the historical 0.82 result. No budget was weakened. Callback CPU, frame delivery, bundle-delta and device/comfort acceptance remain FS-4.7 work.

One initial Lighthouse run used the default port 3000 and reached an already-running development server (unhashed `webpack.js?v=…` requests), producing 5.2s / 0.65. It is archived as `*-invalid-target`, excluded from candidate measurements and never used as evidence of a production regression or PASS. The unrelated server was left untouched. The dedicated-port recapture above is authoritative.

## Compact scene presentation amendment — 2026-09-29

Dimi requested removal of the scene's 1px border, a shorter animation frame and the existing outlined Pause/Resume button. The frame now uses `height: clamp(200px, 40vw, 400px)` in place of the former portrait/mobile and 3:2 desktop aspect ratios. This interprets the requested height as a responsive 200–400 CSS px frame; its width and independent WEB aperture fit remain unchanged. The control uses the existing `outlined` variant. Particle settings, runtime, motion policy and generated tokens are untouched by this amendment.

Exact four-file delta and fresh evidence: [compact scene packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.5-layout/README.md). This amendment updates the existing geometry assertion to the newly requested layout; it retains no-JS, accessibility, stable IDs and native navigation checks.

- Production flag-On build, application/validation types, lint/formatting and Storybook build pass. Storybook retains its existing dependency/chunk warnings.
- Focused Start/StartScene unit tests: **20/20 passed**. Production Chromium homepage checks: **16/16 passed**, including four-choice motion policy, retained Pause/themes, failure/visibility, no-JS and geometry.
- Browser geometry verifies 200px height at a 320px viewport, 400px height at a 1440px viewport and zero scene border. Desktop paused-scene and narrow static screenshots were visually inspected: complete WEB, compact borderless frame and outlined Resume control.
- Fresh three-run production On Lighthouse capture, using the same configuration above on dedicated port 3287: LCP **3299.628 / 3302.292 / 3297.299ms**, CLS **0 / 0 / 0**, performance **0.80 / 0.81 / 0.81**. Existing LCP/CLS limits pass; the performance-score warning remains. Hashed production chunks were verified. These are startup measurements, not a final frame-performance audit.
- Earlier Firefox, flag-Off and broad-suite results above predate this styling amendment; they were not rerun for these presentation-only changes. Safari/physical-device and Dimi visual acceptance remain open. No commit, push or deployment is part of this amendment.

## Menu responsiveness optimization — 2026-09-29

**Request:** Dimi reported menu-opening delay after tuning the animation and authorized optimization. Preserve the current appearance, all policy/fallback behavior and the existing single runtime owner. This bounded correction does not start customization or close the final FS-4.7 audit.

**Candidate context:** same base HEAD `41ec5d5109cf1edbd4aabbed70479b244b9c27ec`, with the existing uncommitted FS-4.5 integration and compact layout. Dimi's current settings are 600 particles (60–600, step 6), speed 0.25 (0.05–0.5, step 0.05), size 1 (0.5–2, step 0.1), radius 1–3 CSS px, distance multiplier 6 and base line width 0.3 CSS px. The earlier 200-particle evidence and settings table are historical, not measurements of this tuning. Preserve the actual settings file byte-for-byte.

**Inspection and plan:** inspected the actual consumer, shared static renderer, controller publication/getStill, menu coordination, Canvas drawing/ownership and connection sampler. The main-thread Canvas callback was about 2.4ms p95 on the measured desktop, while opening the menu regenerated a pure-data snapshot and reconciled thousands of hidden SVG elements. Optimize that discrete presentation work first, then measure the same production scenario and exercise the real policy/static/visibility contracts. No renderer replacement, frame cap, worker, new service or changed simulation rules is needed for this finding.

**Changes:** Start requests fresh static data only when its fallback needs to be visible; it defers copying while Canvas displays a valid frame or environmental visibility blocks the scene. When Off/Reduced/failure becomes visible, it still captures current pure data. `ParticleStill` memoizes its immutable SVG element tree as well as the connection calculation, so visibility-only updates reuse the artwork. Geometry/configuration changes still replace the data and redraw the static view. The shared fixture also benefits from the memoized renderer.

**Protected bytes:** particle author settings/domain implementation, Canvas adapter/update/scheduling, aperture assets, controller implementation, shared theme/policy/resolver, Dialog, navigation/intro, generated tokens and dependencies remain unchanged by this optimization. Existing services still suspend the sole frame chain on menu occlusion; no per-frame React state or preview simulation was added.

**Evidence and status:** [optimization packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.5-performance/README.md) records the exact delta/source hashes, before/after production measurements and validation. Technical measurements are local desktop evidence; human visual acceptance, physical Xperia/Safari checks and the final sustained device/frame-budget audit remain separate. No commit, push or deployment is authorized by this optimization request.

### Paired local production results

Chrome 154, 1280×900 CSS px, DPR 2, no CPU throttling, default theme, System/no OS reduction, compiled flag On. Same authored settings and dedicated port 3267 before/after. After initial readiness and 2s warm-up, each running/paused sample contains 3s idle and five menu open/close cycles with 250ms holds. The local harness wraps RAF callbacks only to time callbacks that actually draw the particle Canvas; it excludes header-logo callbacks. It also observes SVG mutations, main-thread long tasks and click-to-dialog-open timing. These short diagnostic samples are not the specified 3×30s device audit.

| Observation                                                | Before  | After                     |
| ---------------------------------------------------------- | ------- | ------------------------- |
| Running: median click-handler entry to dialog open         | 62.4ms  | 14.4ms                    |
| Running: median click-handler entry to two RAFs after open | 101.9ms | 34.9ms                    |
| Paused: median click-handler entry to dialog open          | 52.3ms  | 23.5ms                    |
| Running sample: SVG mutation records                       | 241,870 | 10 (root visibility only) |
| Running sample: long tasks                                 | 10      | 2                         |
| Paused sample: long tasks                                  | 10      | 0                         |
| Particle callback duration p95                             | 2.4ms   | 2.4ms                     |

The measured improvement is menu presentation work, not faster particle physics. Two RAFs are a scheduling proxy, not a measured pixel-presentation time or INP score. First-open processing remains 35.6ms in the optimized sample; no claim of zero delay on every device. Full WEB and the outlined Resume control were visually inspected in the optimized screenshot. Runtime/domain/settings bytes are unchanged.

### Validation and limits

Focused rules/controller/actual-adapter/assets/Start tests: **167/167 PASS across nine files**. Nineteen initial failures came from unchanged tests assuming the former authored count/speed limits. Updated only test inputs/expected arithmetic to valid current values; the dense-graph fixture now actually exceeds the increased output capacity. Retained all pair-completeness, bounds, timing, survivor, cancellation and reset assertions. No production setting or guard was loosened.

The new consumer test proves no static copy while running/covered and a fresh size-correct static view when revealed under Off. The new production browser test proves three menu cycles do not mutate hidden particle geometry, cancel playback under occlusion and retain the same Canvas owner. The existing OS-transition test now waits for the actual restriction status before asserting zero further frames; media emulation can resolve before its change event is delivered. Initial failure logs (including a corrected test-matcher typo) remain in the evidence packet.

Production On build/application types, validation types, lint/formatting and Storybook build pass. Across production Chromium runs, all **37 distinct browser cases pass**: 20 aperture/adapter fixture cases, four static/no-JS homepage cases and a clean final **13/13** scene-policy/menu run. Earlier aggregate runs failed at the OS-transition timing/test-matcher issues described above; their results are retained, not called clean suite runs. The flag-Off production build, Firefox, Safari, physical phone and entire repository unit suite were not rerun for this correction. Prior results remain historical. Storybook's existing dependency/chunk warnings remain.

Fresh production On Lighthouse, same three-run startup configuration on dedicated port 3287: LCP **3655.506 / 3654.105 / 3664.795ms**, CLS **0.0007951** each, scores **0.78 / 0.79 / 0.78**. LCP ≤5000ms and CLS ≤0.1 error limits pass; score <0.9 remains a warning. Hashed production chunks were verified. This is a new 600-particle startup capture, not a paired optimization comparison against the earlier 200-particle 0.80–0.81 capture. Startup cost and sustained lower-power-device comfort remain follow-up work; the measured menu improvement does not close those items.

## Solid WEB homepage fallback — 2026-09-29

**Authorization and scope:** Dimi explicitly accepted keeping the frozen ready Canvas and replacing the thousands of fallback SVG lines with the existing solid WEB artwork. [Contract R15](fs-4.1-scene-contract.md#r15--lightweight-homepage-fallback--2026-09-29) supersedes the homepage's earlier particle-static requirement. This is a presentation change in the existing FS-4.5 integration, not permission to begin FS-4.6 or publish.

**Implementation:** Start no longer imports `ParticleStill`, requests `getStill`, stores particle preview state or mounts a particle SVG. Its service-created runtime host stays mounted. A valid permitted live frame or locally paused frame uses the existing Canvas and aperture. SSR/no-JS, pending, unavailable, Reduced/Off/System reduction, flag-disabled and failed states use the existing fitted Work Sans Black WEB silhouette. The cover stays opaque behind that silhouette, preventing an empty aperture before the first valid draw. Canvas remains unprepared when permission denies it; local Pause remains separate from hard policy restrictions.

`SceneAperture.showStatic` selects its existing mask-independent artwork without changing mask-capability readiness, asset loading, stable IDs or native fitting. Readiness therefore cannot wait for Canvas and deadlock preparation. Default `showStatic=false` preserves the existing diagnostic fixture; its pure-data particle preview remains available for fixture work. This request does not choose a future customization thumbnail. No new asset, renderer, service, scheduler, storage or dependency was added.

**Protected bytes:** Dimi's 600-particle settings, connection rules/styles, simulation, controller, Canvas update/scheduling, service composition, semantic tokens, intro/navigation and trusted SVG asset bytes remain unchanged. The only production paths changed are `StartScene.tsx`, its CSS and `SceneAperture.tsx`; corresponding tests, this record, contract and architecture documentation record the accepted fallback change.

**Size evidence:** captured production HTML before/after is **1,957,350 → 63,248 uncompressed bytes** (about 96.8% smaller). The old 9,570 SVG lines and 600 particle circles are absent; nine header-identity circles remain. This compares built HTML bytes, not compressed network transfer or a performance score. The preceding candidate's build supplies the before file; exact hashes/diff, both HTML files, commands and fresh results are in the [solid-fallback packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.5-solid-fallback/README.md).

**Fresh validation:** 99 focused tests in seven files PASS (Start, aperture, controller, actual adapter and infrastructure). Production flag-On/Off builds, application/validation types, strict lint/formatting and Storybook build PASS. Chrome production On **38/38** and Off **18/18** browser checks PASS with clean exits. Coverage includes all four preferences, each applicable gate, same Canvas/paused coordinates across themes and policy transitions, repeated menu occlusion, denied preparation, first-draw/failure transitions, real Canvas context loss, no-JS, stable IDs, unchanged fixture aperture replacement and static fallback across narrow/wide layouts. Unit fakes verify that showing the silhouette never suppresses mask readiness and that preparation success alone cannot remove the fallback before a valid draw. Browser null-context/context-loss checks verify restoration of solid WEB with no particle SVG.

Narrow hydrated-reduced and wide no-JS screenshots were visually inspected: complete solid WEB with the existing fit, reserved geometry and semantic colors. Storybook retains its existing dependency/chunk warnings. Physical Xperia/Safari/Firefox and final sustained device/frame budgets were not recaptured; earlier evidence is historical. This accepted static appearance change is distinct from Dimi's final moving-scene acceptance. No commit, push or deployment.

Fresh three-run production On Lighthouse, same existing configuration and dedicated port 3287: LCP **3091.417 / 3072.507 / 3099.386ms**, CLS **0 / 0 / 0**, score **0.82** throughout. Existing LCP/CLS limits pass; the below-0.9 score warning remains. Production chunk URLs were verified. The preceding 600-particle fallback candidate measured about 3.66s LCP and 0.78–0.79; this capture measures about 3.09s with unchanged animation tuning. These desktop startup measurements do not establish physical-device or sustained frame-performance acceptance.

## Reduced still Canvas and WEB reveal — 2026-09-29

**Authority:** Dimi requests paused Canvas under explicit Reduced and confirms that the readiness fade applies to the main WEB animation, not navigation. [R16](fs-4.1-scene-contract.md#r16--reduced-still-canvas-and-web-readiness-reveal--2026-09-29) records the amendment. This implementation is not an independent review or final visual acceptance.

**Candidate/protected work:** inspected `41ec5d5109cf1edbd4aabbed70479b244b9c27ec` plus the existing uncommitted FS-4.5 work and current author tuning. No reset. Current actual defaults are 200 particles, speed 0.4, size 1; count range 20–200/step 2, speed 0.2–0.6/step 0.1, width 0.4 CSS px, distance multiplier 6. Preserve `ParticleSettings.ts`, pure simulation/connection sources, Canvas drawing/update bytes, composition, shared motion resolver, header and navigation. Earlier 600-particle measurements in this record are historical, not this candidate's baseline.

**Implementation:** the controller declares the implemented Reduced alternative via `resolveMotionPermission`; it prepares eligible still Canvas and calls pause rather than resume. Snapshot `reducedMotion` and `hold-frame` presentation keep the disabled action/status truthful while preserving independent local Pause. Existing Canvas owns the single dirty draw; changes to theme/geometry do not create a continuous chain. Off and System/OS-reduce still use independent solid WEB with no prepared scene.

Start conceals only its decorative scene during ordinary eligible startup, retains measured geometry, and latches the first valid draw into a 400 ms token-based fade. Reduced resolves instantly to a still. Pending policy cannot latch an unknown-System fallback. A restriction ends an in-flight fade immediately; policy/occlusion/recolor changes cannot replay it. No changes to the logo/menu/content intro sequence. `SceneAperture` distinguishes an unfinished capability probe from a settled false result so pending probing does not prematurely reveal fallback. A five-second infrastructure import deadline (same bound as aperture probing) returns solid WEB on a hung loader; completion after cancellation/timeout cannot create Canvas. Import timers release on settlement/destroy.

**Test maintenance:** the first expanded run exposed three pre-existing pure-domain failures caused by older 0.25/0.5 speed examples being snapped under the current 0.2–0.6/0.1 settings. Preserve the settings and use valid 0.2/0.4 test speeds, retaining exact half-speed/displacement assertions and explicit effective-value assertions. The first new reveal test also caught an initial false mask-readiness notification; pending now remains distinct until the probe settles. Original failed output is retained.

**Evidence:** local review packet at `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.5-reduced-reveal/` contains the captured source hashes, exact incremental diff/manifest and fresh command/browser evidence. Portable repository record: this section. Fresh validation: **236 focused tests across 13 files**, application/validation types, lint, production On/Off builds and Storybook all pass. Production Chromium **78/78 On** and **58/58 Off** cases pass with clean exits. These cover the four-choice matrix, a single still draw under explicit Reduced, visible resize/recolor without continuous playback, local Pause/Canvas identity, intro/navigation hydration, native SVG apertures, no-JS, first-frame reveal after delayed loading and terminal timeout/late completion. The initial new browser test used the uncompiled attribute spelling to identify a compiled chunk; its failure was retained and the test corrected to the actual module marker. That failed run required interruption during teardown; the full corrected On run exited cleanly. After the final pending-policy/restriction guards, both production builds, all 236 focused units, validation types and Storybook pass again; final Start browser cases pass **21/21 On + 21/21 Off**. All logs remain in the packet. The Reduced still screenshot was visually inspected: complete WEB, particle-filled silhouette, disabled action and explicit Reduced status.

**Limits:** explicit Reduced is the amended choice; Follow system plus OS reduction remains solid WEB. Existing no-JS and skipped fragment/history intro behavior is preserved. Firefox/Safari and physical-phone checks were not recaptured; no final sustained frame-budget acceptance is inferred. No commit, push or deployment.

Fresh final-build Lighthouse (same desktop/DevTools configuration, three runs, isolated local port 3287): LCP **3102.177 / 3103.819 / 3108.183 ms**, CLS **0 / 0 / 0**, score **0.81 / 0.81 / 0.81**. Existing LCP ≤5,000 ms and CLS ≤0.1 limits pass; the below-0.9 performance warning remains. Earlier capture before the final pending/restriction guards is retained separately. These are startup measurements of the current 200-particle candidate, not an improvement comparison to the old 600-particle build or acceptance of sustained scene budgets.

## F1 resolution proposal: rejected palette fallback — 2026-09-29

**Authority/status:** Dimi requests solid WEB when palette failure blocks preparation, a regression test and re-review. This resolves the implementation side of F1/P2 in the [R1 review](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.5-reduced-reveal-review-r1/REVIEW.md). The subsequent **Codex R2 technical PASS closes F1**, as recorded below. Contract R16 is unchanged. Implementation checks alone did not close F1; neither those checks nor technical review establish Dimi's final scene acceptance.

**Correction:** `ParticleSceneSnapshot.paletteUnavailable` distinguishes a measured, positive-size surface with a rejected/missing palette from temporary visibility or unmeasured geometry. Start settles its independent solid WEB immediately once policy has settled, with a truthful unavailable-colors status. The existing resolver gate still denies Canvas preparation; no runtime, import deadline or frame chain is started merely to show fallback. Valid color recovery follows existing binding observation and prepares only when all normal gates permit. The once-per-mount reveal remains settled, so recovery cannot replay the fade. A ready scene retains its owner and local Pause through palette loss/recovery.

**Scope/protected bytes:** three production files (port, controller snapshot, Start view), their controller/component/browser regression coverage, architecture note and this existing task record. Simulation, tuning, connection rules, Canvas adapter, palette validation, resolver, shared services, composition, intro/navigation, CSS and SVG artwork remain byte-identical to the reviewed candidate. No new dependency or product decision.

**Evidence/handoff:** [F1 correction packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.5-palette-fallback-f1/README.md) supplies the exact incremental diff, all-source before/after hashes, command results, browser screenshots and the re-review request against HEAD `41ec5d5109cf1edbd4aabbed70479b244b9c27ec` plus captured working-tree bytes. The original blank-scene reproduction remains untouched. New tests assert the corrected visible fallback rather than that known faulty state.

**Fresh checks:** 239 focused tests across 13 files, validation/application types, strict lint, production On/Off builds and Storybook pass. Chromium production checks pass **23/23 On and 23/23 Off** with clean process exits, including the new rejected-palette cases under On and Reduced, recovery without reveal replay, normal first-frame reveal, import timeout, policy transitions and narrow/wide no-JS content. Motion-only cases return early in Off; Off is fallback evidence. Component/controller fakes additionally verify no preparation on rejection and local Pause/owner preservation through later palette loss/recovery. The On failure screenshot was visually inspected: complete solid WEB, not the previous blank area. Firefox/Safari, physical-phone and sustained-frame checks were not recaptured. Existing Storybook warnings remain. No commit, push or deployment.

Fresh F1 production Lighthouse (three runs, unchanged desktop/DevTools configuration): LCP **3143.674 / 3131.421 / 3089.104 ms**, CLS **0 / 0 / 0**, performance **0.81 / 0.81 / 0.82**. Existing LCP ≤5,000 ms and CLS ≤0.1 limits pass; the below-0.9 performance warning remains. These startup measurements do not establish sustained scene/device performance acceptance.

## Codex R2 closure and authorized delivery — 2026-09-29

**Independent review:** [R2 report](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.5-palette-fallback-review-r2/REVIEW.md) returns **PASS for the submitted F1 correction**, closes F1/P2 and reports no new actionable findings in that increment. It reviewed HEAD `41ec5d5109cf1edbd4aabbed70479b244b9c27ec` plus the captured working tree; the eight-file correction patch SHA-256 is `18f2e58a1fc26d54d6bbdd42de2f81c68141363675095f7cdb2aa580e1a89b35`. All 672 captured source files were verified unchanged during review. This is the latest correction checkpoint, not a claim of final performance/device/visual acceptance or completion of every FS-4.5 requirement.

Fresh re-review evidence: **239/239 focused tests**, **23/23 production Chromium checks** and **three independent browser probes** pass. The probes verify visible solid WEB after six seconds of palette rejection with zero Canvas/draws, valid-color recovery without another fade, a single Reduced still draw, and retention of the same paused Canvas and rendered image through palette loss/recovery. Screenshots were inspected. The initial six-case runner stalled during cleanup and was interrupted with exit 130 after its assertions; it is retained as an unclean run. The sequential 23-case rerun and independent probes exited 0. Build/type/lint/Storybook/Off/Lighthouse evidence was inspected as retained evidence, not rerun by the reviewer.

**New documentation rule:** Dimi explicitly requests preventing costly SVG particle constructs. [AGENTS.md](../../AGENTS.md#design-accessibility-performance-and-security) and [architecture guidance](../architecture.md#particle-rendering-and-fallback-cost) now prohibit dense particle/connection SVG or DOM representations in production pages and their fallbacks, including hidden/memoized trees and oversized aggregate path data. Keep permitted rendering and eligible frozen frames in Canvas; use lightweight independent solid WEB when unavailable/denied. Small SVG identity artwork and aperture masks remain supported. Existing `ParticleStill` is a diagnostic sandbox representation, not permission to reintroduce it into Start or future production controls. Preserve the SSR/browser guards and measure HTML/DOM/bundle/interaction costs when this boundary changes.

**Delivery scope and authorization:** Dimi authorizes updating documentation, then committing and pushing the pending FS-4.5 candidate on `feature/funkspace-minimum-usable`. This includes the existing integration, retained author tuning, tests and R15/R16/fallback corrections; no application bytes change during this documentation update. The containing Git commit identifies the delivered candidate. Documentation content, links, formatting and diff checks apply to this increment; the immediately preceding exact-source implementation/re-review results remain applicable. Evidence packets are local-only: a reviewer on another machine must receive them or recapture evidence; the portable outcomes and limitations are summarized here.

**Still open:** the below-0.9 Lighthouse warning, final sustained performance/device checks, Safari/physical-phone evidence for the latest candidate and Dimi's final moving-scene acceptance. No new product approval, FS-4.6 work, merge, deployment or live email is authorized by this commit/push request.
