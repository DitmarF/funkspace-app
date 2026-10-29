# FS-4.4 — SVG aperture and replacement proof

## Larger mobile WEB — 2026-10-02

Dimi requests larger mobile artwork while retaining satisfactory tablet/desktop
sizing. [R22](fs-4.1-scene-contract.md#r22--larger-mobile-web--2026-10-02) records
the mobile-only fitting change: below 640 CSS px viewport width, scale the
centered 80% WEB opening by 1.2 to 96%. At 640 px and above it remains 80%.
The live SVG image and independent solid WEB each use the same small SVG group
and CSS transform around the outer viewport center. The full rectangular cover,
scene height, particle coordinates/configuration, Canvas and diagnostic diamond
are unchanged. This is presentation scaling, with no JS viewport listener,
extra particle markup or runtime recreation.

Scope: `SceneAperture.tsx`, `SceneAperture.module.css`, responsive regressions in
`e2e/particle-aperture.spec.ts`, and these existing task/contract records. Prior
uncommitted R20 defaults and R21 circle removal are preserved. Base remains
`737d5fa9147eb9f3cac0ce0f3f8edc3c73e3ae8c`; the
[local packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/web-mobile-size-2026-10-02/README.md)
pins the exact incremental files and complete pending diff.

Validation: 44 focused tests pass; frontend/validation types and lint pass.
Production On and Storybook builds pass. Chrome production aperture/static checks
pass 22/22; Storybook animation fixtures pass 4/4. New checks cover both homepage
and details, 320/375/639/640/768/1280 px widths, centered proportional fitting,
no clipping/overflow, matching live/static scaling and no-JavaScript fallback.
Existing replacement tests retain identical mounted Canvas/paused pixels.

The first CSS geometry approach did not enlarge nested static SVG consistently
and was replaced with the shared group transform. Test development also corrected
assumptions about unused mask bounds, content bounding boxes and differing SVG
computed-style representations. Failed attempts remain in the packet; final
assertions retain exact size, aspect, centering, containment and breakpoint checks.
Existing next-lint/chunk warnings remain. No fresh flag-off build, Lighthouse,
full coverage, Safari/Firefox/physical-phone or performance acceptance is claimed
for this CSS-only fitting change. No commit, push or deployment.

## Built-in WEB correction — 2026-10-01

**Implemented; bounded checks pass.** [Contract R21](fs-4.1-scene-contract.md#r21--built-in-web-aperture-no-circle--2026-10-01)
records Dimi's explicit circle removal request. The inspected screenshot is
`/Users/dimi/Desktop/Screenshot 2026-10-01 at 16.59.54.png`. Reproduction against
the pre-fix local details page with a failed WEB export request leaves visible
Canvas inside `data-aperture="circle"`, matching that screenshot. The compositor
used the circle while the fetched WEB asset was pending or failed.

The compositor now embeds existing trusted `webPath`/`webViewBox` as an SVG data
image. The same geometry supplies the independent solid fallback. WEB makes no
export request; circle is removed from the selection type and gallery. Optional
diagnostic diamond loading still validates assets, ignores stale completions and
falls back to WEB. Mask/decode failure still signals the consumer to retain
complete solid WEB and hide unsafe Canvas. Coverage, fitting, per-instance IDs,
transparent-overlay behavior and service ownership remain unchanged.

Source scope: `SceneAperture.tsx`, `sceneApertures.ts`,
`ParticleLifecycleFixture.tsx`; regressions in `SceneAperture.test.tsx` and
`e2e/particle-aperture.spec.ts`. No domain/controller/binding/Canvas-update or
generated geometry change. Existing uncommitted R20 defaults (286 / 0.2× / 0.1×)
and their documentation are preserved. Candidate base is
`737d5fa9147eb9f3cac0ce0f3f8edc3c73e3ae8c` on
`feature/funkspace-minimum-usable`; exact changes, hashes and commands are in the
[local evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/web-aperture-fix-2026-10-01/README.md).

Fresh validation:

- 224 focused tests / 12 files pass: scene controls/compositor, pure domain,
  controller and actual adapter, including WEB geometry parity/no fetch,
  cancellation, late image errors and retained runtime identity.
- Frontend and validation TypeScript checks, repository lint and formatting pass.
- Separately compiled On/Off production builds pass trusted-export parity and
  existing build prerequisites. Isolated build IDs: On `u8bN4sLCsLeArWNTcbWnC`,
  Off `VqyGrA8lhS8iiGxY99cf7`.
- Chrome **154.0.8037.92**: 40 production checks per flag, 80 total, zero retries.
  Includes homepage/details missing/delayed WEB export interception (zero requests),
  mounted WEB/diamond replacement with identical paused Canvas pixels, stale and
  rejected assets, mask/decode failure, theme/policy/Pause and no-JavaScript cases.
  Wide dark and narrow light captures were visually inspected: complete WEB,
  open counters and covered rectangle; no circle opening.
- Storybook build and all four animation-fixture browser checks pass, including
  mounted Canvas identity and unfiltered accessibility. Existing chunk-size and
  next-lint deprecation warnings remain.

Initial test-only XML matcher failure was corrected to native DOM attribute
checks; its log is retained. Initial sandbox-only local-port/cache failures were
rerun successfully with authorized access, without changing application code.
No full coverage, Lighthouse/frame-budget or fresh Firefox/Safari/physical-phone
result is claimed. Previous FS-4.7 samples remain pinned to their earlier candidate;
required device evidence and FS-4.8 acceptance remain open. This is implementation
evidence, not independent technical approval. No commit, push or deployment.

## FS-4.4B review corrections — 2026-09-29

**Status: Codex R2 PASS for F1–F3 correction scope; all three findings closed against the exact reviewed candidate.** Scope is F1/P2 static short-frame coverage, F2/P2 stale domain tests, and F3/P3 tuning documentation. Base: HEAD `0eabf793240ec44e7352247c8160aa7f901de927` plus the full reviewed patch SHA-256 `03e713428005b8ea0839bec81ae18abd3962967d7b9d11ba976eb51e5ff86b9d`. The existing local tuning is preserved, including 200 default/max particles, speed 0.5 and size 3. No new product approval, task/EPIC completion or remote action is inferred.

F1: static particle positions and connection endpoints now use percentages of their retained pure-data bounds in the SVG viewport. This preserves fractional position across short/wide/narrow frames before observation, under denied preparation, after destroy and after terminal failure. Radii and line widths remain CSS-pixel values without nonuniform scaling. The cover and aperture fitting are unchanged. No Canvas, observer, scheduler or second simulation is added. Before binding, the static snapshot retains its seeded connection graph/style; binding notifications can refresh those derived connections for measured bounds, as before. Gallery particles use the same fractional positioning convention.

F2: tests now exercise legal, distinct speed/size/count inputs and metadata-derived clamp endpoints. Successful connection-radius retry remains tested with a bounded dense patch; exhaustion uses an isolated test-only work budget so it cannot silently become a non-exhausting input when the authored particle cap changes. Exhaustive pair completeness, identity/survivors, timing/partition and malformed-input assertions remain. Particle rules, controller, binding, Canvas update code, assets and all numeric tuning values are unchanged.

F3: the [tuning guide](fs-4-particle-settings.md) records current values and derived limits; old results are explicitly historical. Inline comments explain formulas instead of duplicating drifting numeric totals.

Fresh validation: all 1,756 tests in 115 files pass (focused domain/controller/adapter/aperture subset: 152 pass). Strict validation types, repository lint/formatting, production On/Off builds and Storybook build pass. Storybook retains its existing large-chunk warning. Chrome 154 passes 20 production cases per flag; Firefox test browser 146 passes 12 aperture cases per flag, including the new short-frame and failed-runtime regressions. Mounted replacement retains Canvas identity/paused pixels. Initial Firefox geometry assertions exposed outward DOM-rectangle rounding; the final assertions use actual SVG geometry and screen transforms to verify unscaled radii. Initial logs remain retained; final runs exit 0.

Chrome/Firefox short-frame screenshots were inspected: complete W and B before Start and while Off, with zero scene Canvas and full-width particle positions. No mask/asset bytes changed. New regression checks are also exercised against the original candidate. No fresh Safari, physical-phone, homepage Lighthouse or final scene-performance claim is made; the correction changes diagnostic/static presentation and tests only.

Evidence: [exact patch, candidate hashes and raw logs](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4b-fixes/), [corrected Chrome still](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4b-fixes/chrome-short-before-start.png), [corrected Firefox still](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4b-fixes/firefox-short-before-start.png). Seven changed paths: fixture, two domain test files, aperture browser tests, settings comments and the two task records. All application rules/runtime/compositor/asset bytes and numeric settings are preserved. The R2 result below supersedes pending re-review statements for these exact bytes. Safari/physical-phone evidence and Dimi visual acceptance remain separate.

## Codex R2 closure and authorized delivery — 2026-09-29

Codex re-reviewed the exact correction and returned **PASS for F1–F3**, with no new actionable finding. F1 (short static WEB), F2 (19 stale domain tests) and F3 (tuning records/comments) are closed. The full candidate is HEAD `0eabf793240ec44e7352247c8160aa7f901de927` plus patch SHA-256 `a7b58972afdc996e65b92516affcc6d314d3bf76515e4f73cadf8c2b5e157483`; the seven-file correction hash is `6fe13351ca58fdf74bb43f5109976fcb151ea0a73b6a1dfced936405f03f84f7`. The review verified all 665 source files and preserved rules/runtime/compositor/asset bytes and numeric tuning.

Fresh R2 checks: 152 focused tests, strict validation types, repository lint/formatting/bootstrap consistency, 20 Chrome production cases per flag and 12 Firefox aperture cases per flag all pass with exit 0. Fresh visual inspection confirms full-width static WEB before Start and under Off with zero scene Canvas and unscaled radii. Production builds were reused after source verification; the earlier 1,756-test full suite and production/Storybook builds are retained implementation evidence, not rerun claims. The review was a separate read-only phase in the same chat, not a separately staffed reviewer.

[R2 report and closure evidence](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4b-r2-review/REVIEW.md). These raw artifacts are local and are not included in the Git push; another reviewer must receive the evidence packet or recapture it. The durable verdict, candidate hashes and verification limits are recorded here.

Dimi explicitly requests **“update the documentation then commit and push the changes.”** This authorizes delivery of the reviewed pending FS-4.4/particle-settings candidate plus this documentation reconciliation on `feature/funkspace-minimum-usable`. The containing Git commit identifies that delivery; exact commit and remote verification are retained in [the delivery packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-commit/). Runtime and particle settings remain byte-identical to the R2 candidate. Delivery also removes one redundant blank line at the end of the technical-diamond SVG, preserving its exact non-whitespace markup and silhouette; all other post-review changes are documentation.

This is technical correction acceptance, not full FS-4.4/EPIC completion, Dimi scene acceptance, final performance acceptance or permission to start FS-4.5. Safari on the selected MacBook Pro, the physical Xperia XQ-CC54/Android 14 and final target-browser/visual acceptance remain open. No merge, deployment, repository settings or live email is authorized. Earlier no-commit/push and pending-review statements below are historical, superseded only within this bounded delivery.

## WEB Black weight — 2026-09-29

Dimi requests a bolder WEB, specifically Black. [Contract R14](fs-4.1-scene-contract.md#r14--web-black-weight) changes `wght=700` to `wght=900` in the existing bundled Work Sans exporter. Regenerate both outlined SVG and matching mask-independent fallback; preserve native embedding, centered 80% fitting and current local particle tuning. No synthetic stroke or runtime font dependency. CoreText confirms `WorkSansRoman-Black`, `wght=900`. New viewBox `0 0 2347 660`; SVG 743 bytes (390 gzip), SHA-256 `cd34a4e9d226e4421d66962f10c2af254cb540a7e70607be0fcd97f98ca201e3`. The exporter remains the reproducible source; no runtime font loading or synthesized outline thickness.

Fresh validation: 40 focused tests, strict types, lint/formatting, both production builds with trusted-export/fallback parity checks, Storybook build and two mounted states pass. Direct Chrome captures complete successfully at 320/1,440 px viewports, preserving the same paused Canvas through WEB → diamond → WEB and showing the complete no-JS outline. Visual inspection confirms heavier W/E/B strokes with both B counters open. Protected particle-domain and Canvas adapter hashes match the pre-turn snapshot. The prior Playwright shutdown issue and stale lifecycle count expectations remain; the broad suite was not rerun for this asset-only amendment. No physical-phone, Firefox/Safari or moving-scene acceptance is claimed. Fresh homepage Lighthouse: three runs per flag pass existing LCP/CLS error assertions. On scores remain 0.82 in all runs (existing warning); Off scores are 1 in all runs. These are homepage regression measurements, not scene performance acceptance. [Raw results](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-web-black/lighthouse-summary.json). Storybook retains its existing large-chunk warning. Documentation links, formatting and final diff checks pass. No commit, push, deployment or homepage integration.

[Exact diff, hashes and logs](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-web-black/) · [Live Black preview](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-web-black/web-canvas-1440.png) · [Independent fallback](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-web-black/web-no-js.png) · [Capture measurements](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-web-black/capture-results.json).

## WEB aperture — 2026-09-29

Dimi requests WEB in place of SPACE. [Contract R13](fs-4.1-scene-contract.md#r13--web-aperture) supersedes the earlier word choice only. Retain bundled Work Sans Bold 700, outlined paths, native embedding, full cover and centered 80% contain fitting. The generator, asset, geometry module, descriptor, static fallback, fixture labels/selection and corresponding tests now name WEB. Old SPACE implementation files are replaced; prior evidence and historical decisions remain below.

Regenerate with `swift scripts/export-web-aperture.swift . .`, then format the generated geometry module. `pnpm check:scene-apertures` checks the trusted export profile and exact SVG/fallback geometry parity. No Illustrator provenance or unseen reference match is claimed. SHA-256 comparison confirms particle rules, connection settings and Canvas adapter remain byte-identical to the pre-turn candidate. WEB SVG: `0 0 2267.408 660`, 1,118 bytes (504 gzip), SHA-256 `1e2612a48c904a6c78482a3ee1a5e47813599b069cc1366feafb9eab4a1849ad`.

The pre-turn tree already contains newer local tuning: count/default ceiling 2,000, speed 1, size 2; connection distance cap 10,000, width 1, opacity 1 and maxLines 16,000. This task preserves those edits and does not mark them performance-accepted or reconcile their earlier contract/test expectations. Default and maximum counts now coincide, so the existing count toggle has no numerical effect.

Fresh validation: 40 focused tests, strict types, repository lint/formatting, both production builds (including trusted-export validation), Storybook build and two mounted Storybook states pass. The broader browser attempts stalled and were stopped after about 196 seconds; the Off log includes a Playwright internal step error. Their lifecycle tests still contain 1,600/3,200 expectations inconsistent with the pre-turn tuning. Neither broad run is reported PASS; logs are retained. Focused aperture reruns reported all ten cases successful per availability flag (20 total), including themes/layouts, mounted replacement, stale/invalid assets and no-JS fallback, but both runners stalled during shutdown and were terminated. No clean browser-suite exit is claimed. No assertions were weakened or repository tests skipped. A separate direct browser capture completed with exit 0: WEB at 320/1,440 px viewports, paused Canvas identity preserved through WEB → diamond → WEB, 2,000 static particles, and an independent no-JS outline. Visually inspected the live, Storybook static and no-JS captures: W/E/B silhouettes and B counters are correct. Visual inspection is not Dimi acceptance.

Fresh homepage Lighthouse: three runs per flag pass existing LCP/CLS error assertions; On scores 0.82 in all runs retain the below-0.9 warning; Off scores 1 in all runs. The On run overlapped the stalled browser processes. These measure the homepage, not scene or physical-phone performance. Storybook retains its existing large-chunk warning. No Safari/Firefox or physical-phone evidence is claimed. No commit, push, deployment or homepage integration.

[Exact incremental/candidate diffs, hashes and command logs](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-web/) · [WEB live preview](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-web/web-canvas-1440.png) · [No-JS fallback](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-web/web-no-js.png) · [Capture results](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-web/capture-results.json) · [Lighthouse results](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-web/lighthouse-summary.json). Owner of aperture delivery: Sites workflow in this session. Owner of remaining tuning/acceptance: Dimi, with later test/contract reconciliation after settings settle. Browser-runner shutdown remains an environment/tooling limitation to investigate separately.

## Half-width connections — 2026-09-29

Dimi requests 50% thinner connection lines. [FS-4.1 R12](fs-4.1-scene-contract.md#r12--50-thinner-connections) changes only base stroke width 2.4 →1.2 CSS px (effective 0.96–1.8). The shared rule applies to both Canvas and SVG stills. Connection reach, population, pair selection, opacity/fade and all other behavior remain unchanged. Fresh validation: 1,754 tests / 114 files, strict types, lint/formatting, both production builds, 36 Chrome aperture/lifecycle checks, Storybook build and two mounted states pass. Actual Canvas strokes span approximately 0.960–1.793 CSS px. Count changes retain the same Canvas and Pause. Visually inspected the unmasked large and SPACE captures; thinner links remain visible. No commit/push/deployment. [Exact diff, hashes and validation evidence](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-thinner-links/).

[Large preview](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-thinner-links/unmasked-1600-large.png) · [raw capture measurements](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-thinner-links/capture-results.json). These are rendering checks, not moving-scene acceptance or physical-phone performance evidence. Fresh homepage Lighthouse: three runs per flag pass existing LCP/CLS error assertions; On scores 0.82 in all runs retain the below-0.9 warning, Off scores 1 in all runs. [Raw Lighthouse summary](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-thinner-links/lighthouse-summary.json). The first On run overlapped brief browser/Storybook checks. Homepage measurements are separate from scene performance. Visual acceptance and physical-phone performance remain open.

## Double connection range and thickness — 2026-09-29

Dimi explicitly requests 2× longer and 2× thicker connections. [FS-4.1 R11](fs-4.1-scene-contract.md#r11--double-connection-range-and-thickness) doubles the actual density-adjusted distance (maximum 40 →80 CSS px) and stroke width (1.2 →2.4 CSS px base; effective 1.92–3.6). Preserve the complete-pair rule, size dependence, alpha and fading. The line cap increases 1,600 →6,400 because doubling reach admits roughly four times as many nearby pairs; retaining the old cap would cause the radius guard to cancel the requested change. The 204,800 total visit limit and bounded retries remain unchanged.

No particle count, 1–3 px radius, half-speed, position/velocity, Canvas lifecycle, aperture or fixture-layout change. Both live and static output consume the shared rule. Fresh validation: 1,754 tests / 114 files pass. Domain regression explicitly compares the effective cutoff with 2× the previous formula at both 1,600 and 3,200 and requires no guard reduction in those seeded scenes. Exhaustive pair checks, translation/order invariance and pathological bounds still pass. Width assertions now require 1.92–3.6 CSS px, including the actual adapter. Strict types, lint/formatting, both production builds, Storybook build and two mounted states pass.

Chrome 154.0.8037.58 passes 18 aperture/lifecycle cases per availability flag (36 total). Instrumented real Canvas strokes span approximately 1.920–3.586 CSS px; 1,600-particle stills contain 3,161 / 3,078 links in the captured narrow/standard geometries. Counts remain 1,600 / 3,200, with the same Canvas and retained Pause across changes. Visually inspected masked and unmasked large output: longer/thicker links form a denser network without the former grid-shaped grouping. [Updated large preview](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-double-links/unmasked-1600-large.png) · [raw measurements](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-double-links/capture-results.json). These are rendering checks, not performance acceptance. Physical-phone performance and visual acceptance remain open. No commit/push/deployment or FS-4.5 integration. [Exact diff, hashes, logs and captures](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-double-links/).

Fresh homepage Lighthouse: three runs per flag pass existing LCP/CLS error assertions. On scores 0.82, 0.82, 0.82 retain the existing below-0.9 warning; Off scores 1, 1, 1. [Raw summary](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-double-links/lighthouse-summary.json). These measure the homepage, not scene frame performance. The first On run overlapped brief browser/Storybook checks. Documentation links, formatting and final diff checks pass.

## Uniform nearby connections amendment — 2026-09-29

Dimi rejects the dense cell-shaped groups in the attached screenshot and explicitly selects connecting every pair within a shorter, density-adjusted distance. Inspected `/var/folders/mc/hyg7fvq95rz1vdfk_tkx3nsc0000gn/T/TemporaryItems/NSIRD_screencaptureui_K8fItC/Screenshot 2026-09-29 at 11.05.30.png`. Its recurring clusters correspond to the previous own-cell-first search plus degree cap. This is supplied screenshot provenance, not a YouTube/Figma comparison.

[FS-4.1 R10](fs-4.1-scene-contract.md#r10--every-nearby-pair-without-grid-grouping) restores 1–3 CSS px seeded radii and defines the shorter density-adjusted range, complete-pair rule and limits. The grid now only indexes candidates; no cell priority or degree quotas select connections. Ordinary results are checked against an exhaustive test oracle, including translated/reordered inputs. The line ceiling drops 2,400 → 1,600, with expected uniform-field counts near 800 / 1,000. Complete graphs that exceed the cap retry at half the cutoff; work is bounded by eight passes and 204,800 aggregate candidate visits. Guard exhaustion yields an empty result, never a partial spatially biased prefix. Pathological-input fallback is not promised visually continuous.

Canvas and SVG stills provide the same actual bounds and radius accessor. Canvas rendering/lifecycle is unchanged apart from passing bounds to the sampler; no engine, scheduling, force, particle position/velocity changes, new controls or aperture edits. Counts, half-speed and 320/640/1,280 fixture sizes remain. Fresh validation: 1,754 tests / 114 files pass. New tests compare every pair against an exhaustive test oracle, verify translation/input-order invariance in ordinary fields, full cross-cell connectivity without degree quotas, density/resize scaling, radius styling, dense retry completeness, deterministic state preservation and pathological work exhaustion without partial output. The resize test initially changed area without scaling positions; it now models actual fraction-preserving resize. A dense retry check exposed premature exhaustion under a population-sized work budget; retries now share the existing maximum 204,800 aggregate ceiling. Both failures and the successful final run are retained. Strict types, lint/formatting, both production builds, Storybook build and its two mounted states pass.

Chrome 154.0.8037.58 passes 18 aperture/lifecycle cases per availability flag (36 total). At 320/1,440 px viewports, draw instrumentation retains 1,600 / 3,200 particles, count toggling and the same Canvas across size changes. Observed 1,600-particle stills contain 807/808 connections, compared with about 2,400 in R9. These are shape/count observations, not scene performance measurements. Visually inspected unmasked large views at both counts and the SPACE view: the repeating grid clusters from [Dimi's supplied screenshot](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-uniform/supplied-reference.png) are gone; shorter links form natural local pairs/groups. Particle positions remain seeded random, not forced into equal spacing. [Updated unmasked 1,600 view](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-uniform/unmasked-1600-large.png) · [3,200 view](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-uniform/unmasked-3200-large.png) · [raw capture data](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-uniform/capture-results.json).

Phone performance, Safari and Dimi visual acceptance remain open; no commit/push/deployment or FS-4.5 integration.

[Exact diff, file hashes, logs and captures](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-uniform/).

Fresh homepage Lighthouse: three runs per flag pass existing LCP/CLS error assertions. On scores 0.82, 0.82, 0.82 retain the existing below-0.9 warning; Off scores 1, 1, 1. [Raw summary](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-uniform/lighthouse-summary.json). These measure the homepage, not scene frame performance. The first On run overlapped brief browser/Storybook checks. Documentation links, formatting and final diff checks pass; SPACE artwork remains unchanged.

## Connection balance and large fixture amendment — 2026-09-29

Dimi requests stronger connections, a larger resize option and less dominant large particles. [FS-4.1 R9](fs-4.1-scene-contract.md#r9--connection-prominence-smaller-particles-and-large-fixture) records the candidate formulas and limits. Default count 1,600, toggle 3,200 and 0.5× movement remain unchanged. Seeded radius narrows from 1–3 to 0.8–1.6 CSS px; positions/velocities consume the same samples and remain unchanged. Both static and live output inherit the new geometry.

The earlier 240-line cap and dense-cell traversal limited visible connections. Raising the cap alone exposed a regression fixture with only 96 links: earlier cell members consumed the per-particle visit budget. The corrected traversal starts after the current particle in its own cell, then scans adjacent cells, preserving 64 visits/particle, degree 3, deterministic order and unique pairs. The retained dense regression now requires more than 240 links while enforcing the new 2,400 cap and unchanged visit ceiling. Opacity increases and uses square-root distance fade; size dependence remains, with width 0.96–1.8 CSS px and alpha ≤0.95. No new scheduler, force or Canvas lifecycle change.

Resize cycles 640 → 320 → 1,280 → 640 px maximum widths; labels report standard/compact/large and each layout fits narrower screens. At full width, large is 1,280×720 CSS px. A production browser case checks the three transitions, retained Canvas identity, Pause, count and backing-pixel budget.

Fresh validation: 1,752 tests / 114 files and strict types, lint/formatting pass. Both production builds and Storybook build/two mounted states pass. Chrome 154.0.8037.58 passes 18 cases per flag (36 distinct flag/case combinations), including the new three-size cycle. Instrumented draws retain exactly 1,600 / 3,200 particles and the same Canvas while changing count/size. Default stills contain 2,392 and 2,363 links at narrow/standard captured geometries, within the 2,400 cap. The large fixture reaches 1,280 CSS px at a 1,440 px viewport and fits to 272 px at a 320 px viewport. Observed line alpha reaches about 0.933; widths remain within 0.96–1.8 CSS px. Chrome stores the minimum width as 0.9599999785, so the capture assertion uses a 0.000001 px numerical tolerance; application bounds were not changed. The initial capture failure and successful rerun are retained.

Visually inspected narrow, standard and 1,280-wide output: lines are now prominent relative to the smaller dots; larger layouts remain sparser because counts do not scale with area. [Standard preview](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-balance/space-1600-canvas-1440.png) · [Large preview](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-balance/space-1600-large-1440.png) · [raw measurements](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-balance/capture-results.json). Count/style checks are not performance results. Increased line drawing has a higher work ceiling; phone performance, Safari and visual acceptance remain open. No commit/push/deployment or FS-4.5 integration. [Exact diff, hashes, logs and screenshots](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-balance/).

Fresh homepage Lighthouse: three runs per flag pass existing LCP/CLS error assertions. On scores 0.82, 0.82, 0.82 retain the existing below-0.9 warning; Off scores 1, 1, 1. [Raw summary](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-balance/lighthouse-summary.json). These are homepage regressions, not scene performance approval. The first On run overlapped brief browser/Storybook checks. Documentation links and final diff/format checks pass. Canvas adapter and SPACE SVG remain byte-identical to the previous amendment.

## Density, speed and connections amendment — 2026-09-29

Dimi explicitly requests 1,600 default / 3,200 toggle, half default speed, and confirms thicker and brighter connections for larger particles. [FS-4.1 R8](fs-4.1-scene-contract.md#r8--denser-slower-particles-and-size-dependent-connections) records units, bounds and the candidate styling formula. Default speed is now 0.5×; seeded velocities and physics remain unchanged. The pure connection sampler uses a radius accessor and reused width/opacity output, so Canvas and static output share the rule without allocating new per-link objects per frame. The Canvas change is limited to passing effective radii and applying each derived line width. Lifecycle, scheduling, SVG artwork and aperture geometry are unchanged. Earlier byte-preservation statements describe prior requests; this request authorizes these bounded rendering changes.

The toggle retains Pause, current particle survivors and the runtime. The 240-line cap, degree 3 and 80 CSS px cutoff are unchanged. Maximum population is 3,200 and the theoretical visit ceiling is 204,800. No performance budget is relaxed. Fresh validation: 1,752 tests / 114 files pass, including half-speed displacement with unchanged seeded traits, 1,600 ↔ 3,200 survivor/reset behavior, radius-dependent thickness/alpha bounds and matching Canvas/static connection output at size 2×. An initial failure exposed a timing-equivalence test assuming the old 1× default; its fast trace was corrected from 10 ms to 5 ms to equal 20 ms at the new 0.5× default. The original equality assertion remains. Strict types, lint/formatting, both production builds, Storybook build and two mounted Storybook states pass. Chrome 154.0.8037.58 passes 17 aperture/lifecycle tests per flag (34 total).

Real Canvas instrumentation at 320/1280 px viewport widths confirms 1,600 arcs in eight completed frames and 3,200 in seven per width, with return to 1,600 and the same Canvas instance. Observed connection widths span approximately 0.796–2.241 CSS px and alpha reaches 0.674; both vary and stay inside the defined bounds. These are rendering checks, not frame-performance measurements. [Raw results](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-density/capture-results.json) · [3,200 narrow preview](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-density/space-3200-canvas-320.png). Visual inspection confirms denser narrow lettering and stronger links; wide 1,600 output retains gaps. Phone performance, Safari and Dimi visual acceptance remain open. No commit/push/deployment or FS-4.5 integration.

Fresh homepage Lighthouse: three runs per flag pass existing LCP/CLS error assertions. On scores 0.82, 0.82, 0.82 retain the existing below-0.9 warning; Off scores 1, 1, 1. [Raw summary](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-density/lighthouse-summary.json). These measure the homepage, not particle-scene performance. The first On run overlapped brief browser/Storybook checks. Documentation links, formatting and diff checks pass; SPACE SVG is unchanged.

[Exact amendment, combined candidate, file hashes, logs and screenshots](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-density/).

## 1,000 default / 2,000 toggle amendment — 2026-09-29

Dimi explicitly requests 1,000 default particles and 2,000 via “Toggle particle count”. [FS-4.1 R7](fs-4.1-scene-contract.md#r7--1000-default-and-2000-toggle) records the new range 40–2,000, step 10. The diagnostic button switches both ways between 1,000 and 2,000. Static previews and runtime share the effective configuration. Seeded Reset retains current configuration and Pause; eventual default-restoring Reset targets 1,000.

The existing shared connection capacity follows the new 2,000 ceiling. The 240-line cap, degree 3, 64 candidate visits per particle, speed/size, aperture and Canvas adapter are unchanged. The candidate-visit bound is 128,000; budgets are not relaxed or claimed achieved. Previous count amendments and their evidence below remain historical. No homepage integration, commit, push or deployment.

Fresh validation: 1,749 tests / 114 files, strict types, repository lint/formatting, both production flag builds, Storybook build and its two mounted states pass. Chrome 154.0.8037.58 passes 17 production aperture/lifecycle cases per flag (34 total). The lifecycle regression verifies 1,000 → 2,000 → 1,000 while paused, with one still redraw per change. Domain tests cover the expanded normalization range, survivor preservation, seeded Reset at both counts and connection eligibility for IDs 1998/1999. Oversized sampler input remains bounded.

At 320 px and 1280 px viewport widths, instrumented real scene draws contain exactly 1,000 arcs in eight completed frames and 2,000 arcs in seven completed frames per width; toggling back retains the same Canvas and restores 1,000 in the still. [Raw count evidence](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-count2000/capture-results.json) · [2,000 narrow preview](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-count2000/space-2000-canvas-320.png). Visually inspected: narrow 2,000-particle SPACE has a fuller silhouette; wide 1,000-particle composition retains visible gaps. No moving-scene approval is inferred. Count instrumentation is not a callback/frame benchmark. Physical-phone budgets and Safari remain unverified; no new Firefox result is claimed.

Fresh homepage Lighthouse: three runs per flag pass the existing LCP/CLS error assertions. On scores 0.81, 0.82, 0.82 retain the warning below 0.9; Off scores 1, 1, 1. [Raw summary](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-count2000/lighthouse-summary.json). These are homepage regression results, not particle-scene performance approval. The first On run overlapped short browser/Storybook validation activity; no new scene CPU or phone measurement is inferred. Documentation links and final whitespace checks pass. Canvas adapter and SPACE asset hashes match the previous candidate.

Exact diff, command logs and screenshots are retained in [this amendment packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-count2000/).

## 480-particle amendment — 2026-09-29

Dimi explicitly requests 480 particles. [FS-4.1 R6](fs-4.1-scene-contract.md#r6--480-particles) updates the effective default, maximum and default-restoring Reset target to 480 (minimum 40, step 10). Both the live runtime and independent still derive this same configuration. The diagnostic count toggle now compares 240 and 480; the initial status uses the domain default.

The connection sampler uses the domain ceiling rather than silently ignoring particles beyond 240. Its distance/style, degree 3, 240-line cap and 64 candidate visits per particle are unchanged. Maximum candidate visits become 30,720. No new frame owner, force, mask-dependent replenishment, size/speed change or higher line cap. The Canvas adapter and SPACE SVG remain byte-identical. The earlier domain-byte-preservation statements below describe the prior asset-only requests; this new explicit request authorizes the minimal count/configuration and sampler-capacity edits.

Added regressions cover growth from 240 to 480 with survivor identity/position preservation, deterministic 480 reset and a connection between IDs 478/479. Existing full-range normalization tests now cover the 480 ceiling; default/static/controller/browser expectations are updated without dropping assertions. Current validation and screenshots are retained in [the count amendment packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-count480/). Prior 120-particle screenshots and performance results are not fresh 480-particle evidence. Physical-phone performance, Safari verification and visual acceptance remain open. No commit, push, deployment or FS-4.5 integration.

**Fresh validation at 480:** 1,749 tests / 114 files pass; strict validation types and repository lint pass. Production builds with animation flags On and Off pass. Chrome 154.0.8037.58 passes 17 aperture/lifecycle checks per flag (34 total). Instrumented scene draws at 320 px and 1280 px viewport widths record exactly 480 arcs in each of eight observed completed frames, and both static representations contain 480 particles. This verifies the rendered count, not callback/frame performance. [Capture measurements](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-count480/capture-results.json) and [narrow live preview](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-count480/space-480-canvas-320.png) are retained. Visual inspection confirms the denser narrow SPACE composition; the wide still retains visible gaps. No fresh Lighthouse, phone, Firefox or Safari performance/compatibility result is claimed for this count change.

## Work Sans SPACE amendment — 2026-09-29

**Current candidate; supersedes missing-Illustrator prerequisites below.** Dimi requests a SPACE overlay using Work Sans and explicitly authorizes creating SVGs in the repository because Illustrator exports are unavailable. [FS-4.1 R5](fs-4.1-scene-contract.md#r5--repository-authored-work-sans-space) records this direction. The earlier circle/diamond record and its validation remain historical evidence, not results for this amendment.

Created `frontend/public/scene-apertures/space-work-sans.svg` from the existing `frontend/public/fonts/Work_Sans/WorkSans-VariableFont_wght.ttf`. Font SHA-256: `ba2b438482aa1635bd2fff7c30083570049fbdd8ced197a5dc87ca2d901804f7`; SVG SHA-256: `3e550468059a65a798f56d17773d8a22275710bcca321c8d0d9212528d4634c0`. The existing Work Sans OFL and source notice remain alongside the font. No remote font, new dependency, raster embedding, SVG text, Illustrator provenance or viewed-reference match is claimed.

Work Sans Bold **700** is the implementation choice for this candidate; Dimi chose the family, not an exact weight. CoreText reports `WorkSansRoman-Bold`, variation `wght=700`. The export uses native shaping/kerning, no added tracking, a tightly fitted `0 0 3163.604 680` viewBox, black outlined geometry and nonzero fill winding that preserves P/A counters. Asset size is 2,671 bytes. The existing cover still owns full-rectangle theme paint and independent 80% fitting.

`scripts/export-space-aperture.swift` reproduces the SVG and `frontend/data/spaceApertureGeometry.ts` from the bundled font using macOS CoreText; it does not install/register fonts or run during production builds. Regenerate with `swift scripts/export-space-aperture.swift . .`, then format the TypeScript output. Other platforms build from the checked-in outlines. Build validation checks all selected exports and verifies that SPACE's fallback path/viewBox/fill-rule exactly match the SVG. This new generated artwork is separate from protected generated design-token/bootstrap outputs.

The aperture fixture starts with SPACE and swaps to the existing repository-authored diamond without recreating the runtime. Circle remains the pending/rejected-asset fallback and a static diagnostic thumbnail. The same trusted SPACE outlines render a complete solid, mask-independent fallback for SSR/no-JS/masking failure. Homepage Start is still untouched; FS-4.5 was not started.

**Visual finding:** the outlined word, spacing and counters are clear in the solid/controlled-field previews. The existing 120-particle still is too sparse to read SPACE reliably, especially in the 240×400 frame. This is explicitly **not visual acceptance of the particle composition**. No mask-dependent replenishment, hidden particles or changes to approved count/size/speed were added. Later visual tuning needs a bounded proposal and Dimi's decision. Illustrator delivery is no longer a blocker; artwork/composition acceptance, Safari verification and independent renderer review remain open.

**Fresh validation:** 40 focused tests and 1,747 total tests / 114 files pass. Strict types and lint pass. Both production flag builds and Storybook build pass. Chrome On/Off and Firefox On each pass 10 aperture cases, including repeated mounted swaps, retained Pause/pixels, stale results, rejected exports and late failure. Two Storybook states pass. Sixty shape/theme/layout screenshots were captured; 30 SPACE coverage checks verify proportional bounds and five connected letters. P/A counters and the complete no-JS fallback were visually inspected. A one-dimensional column-gap heuristic was discarded because natural kerning overlaps the letters' horizontal projections; the connected-component check measures actual separation. No application assertion or geometry was weakened.

Previous Lighthouse and scene-frame numbers below are retained, not rerun for this asset-only amendment. There is no new phone or Safari evidence. ParticleScene, ParticleConnections and the complete Canvas adapter retain their previously recorded hashes. Shared motion/theme services, original Start/logo, navigation and generated tokens/bootstrap are unchanged. No commit, push or deployment.

[Current exact diff, file hashes, command logs and screenshots](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-space/) · [SPACE solid fallback](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-space/space-solid-fallback.png) · [actual particle still](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4-space/screenshots/chrome-Dark-wide-space.png). `amendment.patch` compares with the prior circle/diamond candidate; `candidate.patch` is the combined uncommitted change against `0eabf793…`.

## Original circle/diamond candidate — retained evidence

## Task metadata

- **Status:** Technical implementation candidate; **FS-4.4 acceptance remains open**.
- **Owner/date:** Sites workflow in this session, sole writer; 2026-09-29.
- **Base:** `0eabf793240ec44e7352247c8160aa7f901de927`, initially clean `feature/funkspace-minimum-usable`.
- **Contract:** [FS-4.1 R4](fs-4.1-scene-contract.md); R3 product proposals accepted, R4 proximity behavior requested with numeric styling still provisional.
- **Source SHA-256:** `ef786919ee96cb95c00e64e7aba9d9451eb1df09e1869eb0e30bfe8945adac8c` (canonical sorted non-document file/hash map).
- **Exact review packet:** [manifest, patch, hashes, logs and screenshots](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4/). `candidate.json` includes final document hashes; `candidate.patch` includes untracked new files.
- **Authority:** Dimi's current FS-4.4 request; [FS-4.3](fs-4.3-canvas-lifecycle.md), [architecture](../architecture.md), [workflow](../development/ai-workflow.md), [feature](../features/funkspace-minimum-usable.md). No commit, push, deployment or FS-4.5 authorization.

## Prerequisites and provenance

Inspected AGENTS, README/scripts, architecture/ADRs, workflow/template, feature plan, EPIC 3 closure/API handoff, actual composition and FS-4.2/4.3 code/tests. Supplied plan: `/Users/dimi/Downloads/FunkSpace_EPIC_4_Detailed_Plan.md`, SHA-256 `9b910c45941989d599cd8bfe0109c17f0a4792d46cfec8ea8a1d68150cc57178`; especially section 5.5 and FS-4.4. Historical commits are not reset targets.

FS-4.1 is accepted; FS-4.3 supplies the committed renderer candidate. The plan places the independent combined renderer checkpoint after FS-4.3/4.4. This request authorizes technical implementation without inventing technical PASS or visual acceptance.

No Dimi SPACE or second Illustrator SVG was found in the repository or Downloads. A local-path question remains pending while the expressly allowed developer fixture proceeds. The **developer-authored diamond with a counter** is neither Dimi's work nor an approved production shape. YouTube/Figma visuals remain unseen. Original Start/logo source and SVG remain unchanged. The newer accepted SPACE fallback direction supersedes the plan's old large-Start-logo error-artwork wording; this task does not integrate or remove that homepage artwork.

## Delivered behavior and boundaries

### Mask and fitting

`SceneAperture` covers the entire scene rectangle. The outer SVG has no letterboxed viewBox. The mask explicitly uses `maskUnits="userSpaceOnUse"`, `maskContentUnits="userSpaceOnUse"`, bounds `0,0,100%,100%` and `mask-type:luminance`. White keeps the cover; opaque black exposes particles. Cover paint uses `--fs-color-surface-background`; independent solid fallback uses `--fs-color-content-primary`.

Only the native SVG image is fitted: x/y 10%, width/height 80%, `preserveAspectRatio="xMidYMid meet"`. Intrinsic SVG viewBox supplies proportions. Circle diameter stays 80% of the smaller scene dimension; full cover gains no edge strips. The same component supplies live scene, independent still and thumbnails. Prefixed React `useId` scopes masks independently from each other and the logo. Decorative layers have no pointer interception.

The existing button-started fixture gains aperture mode at `/sandbox/particles/aperture`, with noindex metadata. Its shape button is developer-only. ThemeSwitcher/MotionChoices reuse existing authorities. No production homepage scene, public selector, upload or customization is added.

### Trusted assets and cancellation

Existing composition supplies the narrow, stateless `ApertureAssets` port. Browser infrastructure owns fetch, DOMParser validation, cancellation, timeout and mask pixel probing. Presentation never imports the concrete adapter. No persistent service lifecycle, frame owner or scheduler is added.

Paths are restricted to same-origin `/scene-apertures/<kebab-name>.svg`; credentials and redirects are excluded. The strict export profile allows SVG/groups and outlined geometry, finite matching viewBox/geometry values, opaque black fills and compound fill rules. It rejects scripts, event attributes, references/external resources, images/raster, foreignObject, text/fonts, animations, CSS/style, filters, unknown namespaces and forbidden declarations. Rejection is not sanitization; this is a bounded profile, not a general SVG editor/converter.

Validated bytes become a data URL for native SVG image embedding. No raw markup injection, SVG-to-React pipeline or second URL fetch occurs. Production and Storybook builds run `pnpm check:scene-apertures`; runtime validation separately handles failed responses. No dependency added.

Each load owns cancellation and a five-second failure deadline. Release invalidates before aborting; effect cancellation also ignores late results from non-cooperative transports. Decode readiness is tied to the exact asset object, so stale image events cannot approve newer loads. Loading/missing/rejected/decode-failed assets retain the circle.

### Static, failure and continuity

A bounded one-shot 4×2 pixel probe checks actual luminance alpha behavior. It owns no RAF, particle state or optional Canvas-runtime import and is not counted as scene frames. Absent context, load/draw failure or timeout keeps mask-independent solid-circle artwork. Production testing caught an initial readiness dependency on a load event that could fire before hydration; the correction uses the cancellable post-mount probe, with regression coverage.

Until readiness, the runtime wrapper has `opacity:0` and the controller receives `coverReady:false`; Canvas visibility cannot override parent opacity. Late built-in image failure restores solid artwork and hides/suspends an existing scene. No-JS retains solid artwork. The probe does not detect every possible future CSS/browser defect; actual browser and silhouette inspection remains necessary.

Static particles use existing pure still data, not another simulation. Selection never enters particle state, Canvas drawing or the scene mount effect. Mounted checks pause one scene, swap four times, assert the same Canvas node and byte-identical Canvas image contents, retain Pause, then resume and observe changed pixels. No reload comparison is represented as continuity.

## Files and protected scope

| Paths                                                                                      | Responsibility                          |
| ------------------------------------------------------------------------------------------ | --------------------------------------- |
| `frontend/components/Scene/SceneAperture.tsx`, CSS, tests, stories                         | Cover, IDs, loading/failure composition |
| `frontend/domain/ports/ApertureAssetPort.ts`                                               | Browser-free cancellable operations     |
| `frontend/infrastructure/particles/ApertureAssets.ts`, tests                               | Strict profile and browser effects      |
| `frontend/data/sceneApertures.ts`, `frontend/public/scene-apertures/technical-diamond.svg` | Trusted developer asset selection       |
| `frontend/app/sandbox/particles/aperture/page.tsx`, `e2e/particle-aperture.spec.ts`        | Mounted fixture/browser proof           |
| `scripts/check-scene-apertures.mjs`                                                        | Build-time export check                 |

Existing ServiceProvider/createServices add only the port binding. Existing ParticleLifecycleFixture/CSS add aperture mode, separate runtime wrapper, themes and concurrent previews. Root/frontend scripts wire export validation. Architecture/feature docs and this record reflect current status.

Protected before/after hashes are identical:

| File                                                       | SHA-256                                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------------ |
| `frontend/domain/particles/ParticleScene.ts`               | `2488b3087467e659750de0d41b76b74dd21323fddf19b73de601273afad8daff` |
| `frontend/domain/particles/ParticleConnections.ts`         | `3f8db99e3c2b95fc9ec8ec67ed32a097734ede15ebe63bbf4e8697829314522a` |
| `frontend/infrastructure/particles/CanvasParticleScene.ts` | `d17e957ce9d458d866fce33beb007f6cdb8d2c28c9adb5a230631285e56ce510` |

No game, generated token/bootstrap, shared policy, navigation, intro, original identity artwork or particle-controller/binding change. Builds ran in isolated copies `/tmp/fs44/on` and `/tmp/fs44/off`.

## Validation performed

| Check                        | Fresh evidence                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Focused aperture tests       | 39 pass: export exclusions, exact bytes, missing/rejected/timeout/cancellation/stale results, probe failure, IDs, hydration and decode regression |
| Full tests                   | `pnpm test`: 1,746 pass / 114 files                                                                                                               |
| Types/lint                   | Strict validation types and repository lint pass; no weakened assertions/type suppressions                                                        |
| Production builds            | On and Off pass, including trusted-export and standalone-game build checks                                                                        |
| Storybook                    | Build and static/mounted-replacement browser states pass, no page errors                                                                          |
| Chrome 154.0.8037.58         | 53 checks per flag plus one late-failure check per flag: 108 total; aperture/lifecycle/intro/navigation                                           |
| Firefox test browser 146.0.1 | Nine aperture checks plus late failure: 10 total                                                                                                  |
| Shape/theme/layout           | 60 captures: two engines × two shapes × five themes × 240×400, 640×360 and 640×160 CSS px                                                         |
| Pixel coverage               | All 60 controlled-field images pass centered proportional 80% bounds, covered edges and diamond counter                                           |
| Wrong/empty silhouettes      | Deliberate rectangle and off-artboard geometry captured and visually rejected; valid syntax does not prove correct art                            |
| Source/diff checks           | Matching protected hashes; generated/identity/particle/Canvas changes absent                                                                      |

The selected physical-device matrix remains Sony Xperia XQ-CC54 Android 14 and MacBook Pro Safari/Chrome/Firefox. **No physical-phone result is claimed.** Safari remains unverified: installed WebKit 2248 mismatched available Playwright drivers (1.55.1 protocol assertion, 1.62.1 stalled); native Safari automation timed out. Owned stalled processes were stopped. Firefox evidence uses the installed Playwright Firefox build, not a fabricated manual result. No browser installation/settings change.

Representative inspected images: [circle](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4/screenshots/chrome-Dark-wide-circle.png), [diamond](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4/screenshots/chrome-Dark-wide-technical-diamond.png), [short-frame counter/coverage](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4/screenshots/firefox-High-Contrast-short-technical-diamond-coverage.png), [wrong silhouette](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4/screenshots/chrome-wrong-silhouette.png), [empty silhouette](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.4/screenshots/chrome-empty-silhouette.png). Magenta is a test-only solid field exposing coverage errors, not product color.

### Performance evidence, separately

Fresh initial homepage JS is **182,022 bytes gzip for both flags**, +4.168 KiB over FS-4.1B's 177,754-byte pre-scene baseline, within +15 KiB. Method: unique modern initial HTML scripts, gzip level 9, excluding nomodule. Eligible fixture optional Canvas JS is 2,042 bytes gzip, within 35 KiB. Off/Reduced/system-reduce and disabled-build captures download no optional Canvas. Asset/HTML/CSS are separate from JS totals.

Fresh three-run homepage Lighthouse LCP: On 3091.614/3111.334/3095.223 ms; Off 451.895/451.487/455.187 ms. CLS zero throughout. Existing 5,000 ms LCP / 0.1 CLS error limits pass. On score 0.82 retains the warning; Off scores 1.00. This is homepage regression evidence without an integrated scene, **not scene frame-work or phone performance acceptance**. Existing next-lint deprecation and Storybook chunk-size warnings remain. Scene callback/delivery budgets and Dimi's connection tuning/moving appearance remain unmeasured/unaccepted.

## Practical Illustrator replacement walkthrough

1. Follow the [accepted export guide](fs-4.1-scene-contract.md#illustrator-aperture-export-guide--available-now). Preserve editable source, outline text/strokes, export opaque black openings on transparency, retain counters/margins, and supply the intended silhouette screenshot. No white artboard rectangle.
2. For this strict profile, use presentation attributes rather than CSS styles; remove metadata, IDs/references, text, filters and external resources. Supported geometry: path/rect/circle/ellipse/polygon/polyline and groups. Keep finite viewBox values. Review a legitimate unsupported construct before broadening the allowlist.
3. Add the reviewed SVG under `frontend/public/scene-apertures/`. Change the selected diagnostic descriptor's `src` and `viewBox` in `frontend/data/sceneApertures.ts`. Native embedding reads intrinsic proportions; particle rules and Canvas need no changes. The diamond slot/name remains a developer fixture, not future public SPACE identity.
4. Run `pnpm check:scene-apertures`, relevant tests/types/lint and the production fixture. Choose permitted On, Start, Pause, then Replace aperture without unmounting. Verify the same Canvas node/content and retained Pause; resume without reset.
5. Capture both shapes across themes/frame proportions and Safari/Chrome/Firefox. Compare actual silhouettes/counters against Dimi's screenshot; review minimum-count/size static readability for real SPACE. Syntax and load events alone cannot approve it.
6. Attach original/export filenames, screenshots, hashes and asset/descriptor-only diff. Compare protected hashes. Record Dimi's acceptance separately from independent technical review.

The packet's `asset-selection.patch` isolates developer asset/descriptor additions; `replacement-input.diff` records the exact mounted input change circle → technical diamond. `candidate.patch` is the full source diff against the Git base. These are technical fixture evidence, not fabricated before/after files from Dimi.

## Handoff and remaining acceptance

- **Delivered for review:** cover/native embedding, strict build/runtime validation, cancellation/fallbacks, mounted continuity, available-browser evidence and replacement walkthrough.
- **Dimi:** initial SPACE and second original export plus intended silhouettes; practical-workflow and appearance acceptance. Still feedback does not prove moving-scene acceptance.
- **Codex:** independent renderer checkpoint against this exact source hash/diff and FS-4.3; review probe limits, strict profile, stale guards, fallback and continuity.
- **Safari:** verify the selected MacBook Pro browser; do not infer PASS from Chrome/Firefox.
- **Later authorized work:** production SPACE static/error composition and homepage integration with actual intro readiness. FS-4.5 was not started.
- **Status:** passing checks are not independent technical PASS, Dimi approval or task completion. No commit, push, remote write or deployment.
