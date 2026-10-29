# FS-4.3 — Canvas rendering and lifecycle adapter

## Current renderer checkpoint — 2026-09-29

The combined FS-4.2–FS-4.4 review and correction re-review are recorded in [FS-4.4 R2 closure](fs-4.4-svg-aperture.md#codex-r2-closure-and-authorized-delivery--2026-09-29). Codex returned PASS for F1–F3 against the exact candidate; all three findings are closed. [Current authoring settings](fs-4-particle-settings.md#current-tuning--2026-09-29-fs-44b-correction) supersede dated numeric amendments below. Earlier pending-review statements and measurements are historical. This does not confer Dimi visual acceptance, final device/performance acceptance or task/EPIC closure. The current instruction authorizes documentation reconciliation and commit/push of the reviewed candidate only.

## Documentation and commit/push authorization — 2026-09-28

Dimi explicitly requested: **“update the documentation, then commit and push the changes.”** This authorizes this documentation amendment and the complete 19-file connected-particle FS-4.3 candidate on `feature/funkspace-minimum-usable`. It does not approve the provisional connection styling/density, confer independent renderer-review PASS or visual acceptance, close FS-4.3, start FS-4.4, or authorize deployment.

Before this documentation-only amendment, all 19 files matched the validated connection candidate: source SHA-256 `95fe1870b387f2509c96f500ca04eaac5655f848f20bcd2102d65576ee706e5c`, full patch SHA-256 `4d756d103c72d2ac89968f9fa21ae539925ebf35695b796992af9122f7eedacc`. Implementation, tests and fixtures remain byte-identical. The recorded 1,707 tests, 88 production browser checks, types/lint/build/Storybook and Lighthouse evidence below remain applicable; they are retained results, not rerun claims. This amendment receives fresh documentation formatting/link/diff and scope checks.

The resulting Git commit identifies the final reviewable candidate including this record update. Exact commit, pushed branch verification, final hashes and diff are retained in [the commit packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.3-commit/). Independent renderer review, Dimi's connection tuning/visual feedback, trusted aperture assets and physical-device performance remain outstanding. Earlier no-commit/push statements below describe the original implementation requests and are superseded only by this explicit authorization.

## R4 proximity-connection amendment

Dimi's connection request adds temporary connections between close particles and supersedes the R3 no-links exclusion. See [FS-4.1 R4](fs-4.1-scene-contract.md#r4--temporary-proximity-connections) for the requested behavior and explicitly provisional visual settings. This session remains the sole writer. The initial connection request did not authorize commit/push; the subsequent authorization above applies to the complete candidate.

The amended candidate adds one pure derived-connection sampler shared by the Canvas draw and independent SVG still. Particles retain exactly the same state, movement and seeded identities. The sampler owns reusable scratch buffers, not another simulation or clock. A fixed-radius grid, 64 candidate visits per particle, degree 3 and 240-line caps bound work in dense layouts. Grid keys/map entries still allocate per sample; actual phone performance must be measured, not inferred from those limits. No new controls, force model, trails, homepage integration or aperture work.

All records below this amendment describe the original unconnected FS-4.3 candidate. Its hashes/results are retained and must not be presented as validation of the new connections. Fresh amended evidence and exact diff are kept in [the connection packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.3-connections/). Connection appearance and provisional numbers await Dimi review; the new request is not blanket acceptance of unshown defaults.

**Fresh connection validation:** 1,707 tests / 112 files pass, including five pure connection tests and two additional renderer cases. Strict frontend and ES-only core types pass. Repository lint passes. Both production builds and the Storybook build pass; static/motion/context-loss Storybook browser states pass. Production Chrome passes 44 checks per flag (88 total), including actual connection strokes and opaque particles at 320/1280 CSS px, independent SVG lines under denied preparation, and retained lifecycle/intro/navigation checks. No extra scene frame owner or shared-service lifecycle change is introduced. No test was weakened.

**Fresh bundle evidence:** Same-method initial `/` JS is 180,300 bytes On and 180,305 bytes Off gzip, respectively +2.486/+2.491 KiB over the FS-4.1B baseline. Eligible fixture lazy JS totals 2,042 bytes gzip; denied/Off/Reduced/system-reduce/disabled-build captures fetch no optional Canvas. These remain below existing 15/35 KiB ceilings. Three-run homepage Lighthouse evidence is retained in this packet separately from the earlier candidate; the existing On 0.82 warning remains. Actual connection callback/phone-frame performance is still unmeasured and must not be inferred from homepage Lighthouse.

Fresh Lighthouse LCP is 3075.404/3086.916/3097.927 ms On and 451.469/450.012/461.836 ms Off; CLS is zero throughout. Existing error assertions pass in both variants. Scores are 0.82 On (retained warning) and 1.00 Off. All owned local test servers were stopped.

**Exact handoff:** Review the amended `candidate.json`/`candidate.patch` against the same `afe0e720…` base; `amendment.patch` isolates this request from the previous FS-4.3 candidate. Review the pure grid/degree/work caps, no duplicate/wrap-seam links, distance opacity, restoration of full particle opacity, shared static derivation and draw-failure cleanup. Earlier source hash `c0f8b20…` below is historical only. Dimi visual acceptance, independent review and physical-device results remain pending. No commit, push or deployment.

## Task metadata — original unconnected candidate

- **Status:** Implementation candidate for the renderer checkpoint; no independent technical PASS, task closure or visual acceptance claimed.
- **Owner/date:** Sites workflow in this session, one writer; 2026-09-28.
- **Base/branch:** `afe0e720e22e11266a87baca2e1c12dd38a2e2bc`, `feature/funkspace-minimum-usable`; initially clean.
- **Source candidate:** `c0f8b20c9d800ccc3e01ba3aba0303a0347fb4f95723025885589003df9f1fc0` (SHA-256 of the sorted non-document file-hash map; full patch and document hashes in the final manifest).
- **Authority:** Dimi's explicit FS-4.3 request, [accepted FS-4.1 R3](fs-4.1-scene-contract.md), [FS-4.2](fs-4.2-particle-rules.md), [architecture](../architecture.md), [workflow](../development/ai-workflow.md), [feature](../features/funkspace-minimum-usable.md).

## Prerequisites and bounded scope

Inspected AGENTS, README/scripts, architecture/ADRs, workflow/task template, EPIC 3 closure and navigation hydration correction, current service composition, motion resolver, Dialog, Start, intro, and FS-4.2 rules/tests. The supplied plan is `/Users/dimi/Downloads/FunkSpace_EPIC_4_Detailed_Plan.md`, SHA-256 `9b910c45941989d599cd8bfe0109c17f0a4792d46cfec8ea8a1d68150cc57178`; sections 3, 5.2, FS-4.3 and 8 were inspected. Historical inspection commits are not reset targets.

FS-4.2 still feedback and renderer review remain pending. The plan places the renderer checkpoint after FS-4.3/4.4; Dimi's current explicit request authorizes FS-4.3 without inventing earlier review/visual acceptance. Approved written drift is the source; unseen videos/Figma are not matched. SPACE and second SVG exports remain later asset work.

Implement only a pure port, controller, lightweight browser observation and lazy Canvas adapter through existing composition, plus a button-started diagnostic fixture and lifecycle tests. No homepage integration, production aperture, customization dialog, shared settings authority, game import, dependency, generated edit, remote action, commit or push.

## Boundary and invariants

- One per-instance domain state; controller owns discrete configuration/reset, adapter borrows it for frame updates. No parallel preview simulation; static data uses the same pure rules. No per-frame React publication.
- Lightweight observation reports geometry/intersection/theme before Canvas loading. Existing provider-owned motion policy supplies document visibility and all four choices. No scene activation/disposal of shared services.
- Preparation uses R2's generation guard, including stale rejection. Cancellation returns to unprepared with intent/config intact; current failure is terminal for that mounted handle. Destroy invalidates before cleanup and attempts each independently owned release.
- Canvas owns one pending RAF, first/resumed delta zero, accepted delta bounded by pure rules. Visible local Pause permits one coalesced dirty still; hidden changes are deferred. Zero/disconnected geometry suspends.
- Mount into a positioned, padding-free reserved frame (the diagnostic fixture supplies one). One ResizeObserver caches content dimensions, one IntersectionObserver supplies visibility, and one rearmed resolution media query observes DPR. Theme/visibility events retain observed dimensions. No scene document-visibility listener, window-resize listener, polling or generic scheduler is added.
- CSS scene coordinates; effective DPR ≤2, sides ≤4096 pixels, total ≤4,000,000 backing pixels, flooring allocations and allowing scale below one. Reapply absolute transform every draw. No DPR physics.
- Independent static SVG and reserved geometry remain until valid draw. Failure removes Canvas. Missing Canvas/context, setup/draw/context-loss failures retain static without retry.
- Fixture has no intro or aperture: it explicitly declares those diagnostic readiness inputs. Actual homepage intro completion must be wired in FS-4.5, never inferred from a timer. Overlay coordination remains later work.

## Implemented paths and validation

New `frontend/domain/ports/ParticleScenePort.ts`, `frontend/application/animations/ParticleSceneController.ts`, `frontend/infrastructure/particles/`, and controlled `/sandbox/particles/lifecycle` fixture. Existing ServiceProvider/createServices composition exposes the typed factory; presentation imports no concrete adapter. Colocated lifecycle tests, production browser coverage, static/motion/context-loss stories and this feature-status update accompany the implementation.

Validate actual adapter frame/resource counts, repeated calls, stale work, hidden cycles, resize/DPR, failure cleanup and still redraw; run domain/regression tests, validation types, lint, production builds and focused browser checks. Record fresh measurements separately from FS-4.1 baseline, proposed scene targets and retained Lighthouse warning. No physical-phone results inferred.

## Validation evidence

Evidence packet: [FS-4.3 local artifacts](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.3/). Commands and output are paired `.json`/`.log` files; browser reports, HARs, screenshots, built manifests and Lighthouse HTML/JSON are retained. The final [candidate manifest](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.3/candidate.json) identifies every changed file, base and full diff. Transfer the packet if the reviewer cannot access local paths.

| Check                       | Result and interpretation                                                                                                                                                                                                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm test`                 | PASS: 111 files, 1,700 tests. Includes 64 unchanged pure-particle tests and 32 controller/actual-adapter/binding cases. Existing logo, motion, Dialog, theme and other tests remain intact.                                                                                                                                                |
| `pnpm typecheck:validation` | PASS, including fixture, stories and E2E.                                                                                                                                                                                                                                                                                                  |
| ES-only strict type check   | PASS: domain rules, scene port and controller compile with only `ES2020`, no ambient browser or Node types. The exact config and invocation are in `pure-types.json`.                                                                                                                                                                      |
| `pnpm lint`                 | PASS: bootstrap freshness, Next ESLint with zero warnings and repository Prettier check. Next's existing command-deprecation notice remains. The first sandboxed attempt could not write the lint cache; the authorized normal run passed.                                                                                                 |
| Flag-on/off `pnpm build`    | PASS in isolated `/tmp/fs43/on` and `/tmp/fs43/off` copies using existing dependencies; no repository generated output changes.                                                                                                                                                                                                            |
| Production Chrome           | PASS: 42 checks per flag, 84 total. Five scene checks per flag plus existing intro/navigation hydration cases. Actual Canvas start, visible Pause, exactly one still redraw, resize, offscreen/zero-size recovery, remount, null context, context loss and no-JS static output covered.                                                    |
| Storybook build and browser | PASS: static, motion and context-loss states in Chrome; results in `storybook-state-results.json`, command metadata in `storybook-browser.json`. Build passed with the existing large-chunk warning. A harness cleanup import error was corrected and its owned server stopped; it was not an application failure.                         |
| Optional loading            | Fresh cache-disabled Chrome captures: no optional Canvas chunk before Start; no optional chunk with Off, Reduced, system/device reduction or either explicit-On/denied choice in the disabled build. Explicit On plus available/visible readiness loads one optional renderer chunk. No unseen loading result inferred from a policy fake. |
| Source/docs                 | Final hash preservation, scoped diff, formatting and local-link checks recorded in `candidate.json` and `documentation-check.json`. No original domain, Start, header, intro, navigation, Dialog, tokens or generated bootstrap source changed.                                                                                            |

Actual adapter tests exercise scheduling/cancellation exceptions, setup/context/backing/draw failure, zero-size paused recovery, reentrant destroy during first readiness, context-loss terminality, repeated lifecycle calls and mount/cleanup/mount. Cleanup attempts all owned releases after invalidation even when one throws; a platform cleanup API that throws cannot be claimed to have physically removed its resource, but late callbacks remain inert. Controller tests independently cover stale resolve/reject, reeligibility, retained config/Pause and all preparation gates. Binding tests cover pre-Canvas observation, partial setup rollback, observer/theme/DPR release and no second document authority.

### Measurements and limits

Fresh bundle and Lighthouse values are recorded in `bundle-summary.json` and `performance-summary.json`. The baseline is the retained FS-4.1B pre-scene production evidence, not replaced by these measurements. Initial script comparison uses the same Python gzip level 9/mtime 0 and unique modern HTML script list. Lazy network inventory uses Node gzip level 9 and excludes already requested files. Homepage integration and the actual details route are absent; their eventual totals still require measurement.

| Fresh measurement                                      | On                      | Off                           |
| ------------------------------------------------------ | ----------------------- | ----------------------------- |
| Initial `/` modern JS gzip                             | 180,305 bytes           | 180,306 bytes                 |
| Increment over same-flag FS-4.1B 177,754-byte baseline | 2,551 bytes / 2.491 KiB | 2,552 bytes / 2.492 KiB       |
| Optional Canvas aggregate fetched by eligible fixture  | 1,308 bytes / 1.277 KiB | 0 fetched; preparation denied |

Both initial increments are below the accepted 15 KiB ceiling; eligible lazy bytes are below 35 KiB. This establishes the current bounded candidate's bundle result only. Lighthouse uses the existing desktop 1350×940/DPR 1, DevTools throttling, 150 ms latency, 9216 Kbps and 1× CPU protocol; three fresh runs per compiled flag. The On LCP values are 3085.117/3093.746/3098.777 ms, CLS 0 each and score 0.82 each. The 0.9 score warning is retained separately from passing LCP ≤5000 ms / CLS ≤0.1 error assertions. These homepage measurements contain no production particle scene and are not scene CPU results.

Off LCP values are 453.419/457.389/456.255 ms, CLS 0 each and score 1.00 each; existing assertions pass. Earlier runs before the geometry correction are retained in separate `lighthouse-*-before-geometry-fix` folders and are not pooled into the final results.

No particle callback CPU p95, frame-delivery threshold, GPU cost or physical-phone performance result is claimed. The accepted 6/10 ms phone callback targets, 20 ms default delivery target and three 30-second sampling protocol remain later performance work. This fixture's frame assertions establish ownership and suspension, not a frame-rate guarantee. Logo work is never counted as particle work.

Selected devices remain Sony Xperia XQ-CC54/Android 14 and MacBook Pro with Safari, Chrome and Firefox. This run uses installed desktop Chrome 154.0.8037.57 (Playwright 1.55.1); Node 22.22.0/pnpm 10.30.3. New Sony, Safari and Firefox tests are unavailable here and remain explicit follow-up. No physical-device or Dimi moving-scene acceptance inferred from screenshots, automated Chrome or the earlier still.

## Review handoff and remaining work

Review the exact candidate diff against `afe0e720e22e11266a87baca2e1c12dd38a2e2bc`; do not repair source during review. Inspect composition/import boundaries, single mutable state and frame ownership, R2 cancellation, observed geometry caching, terminal failure/cleanup, hidden/paused redraws, first-draw readiness and byte budgets. Return PASS, CHANGES REQUIRED or BLOCKED against that identity. The combined FS-4.3/4.4 checkpoint still needs trusted asset replacement proof; this task does not start FS-4.4.

For a controlled local preview, run the existing frontend development command with `NEXT_PUBLIC_ANIMATIONS_ENABLED=true`, open `/sandbox/particles/lifecycle`, choose On and explicitly Start. Local Pause, resize, population toggle, seeded reset and Destroy exercise this boundary. The homepage and existing large Start artwork remain unchanged until their separately authorized integration task. Do not treat the unmasked fixture as the accepted SPACE composition.

FS-4.4 needs Dimi's trusted initial/second exports and independent overlay/static composition; FS-4.5 must wire actual intro completion and shell-local occlusion without a guessed timeout. Product customization Reset and dialog coordination remain FS-4.6. Independent renderer review, Dimi feedback and representative device/frame measurements remain pending. No commit, push, PR, deployment or persistent environment change was performed.
