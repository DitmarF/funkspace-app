# Particle settings consolidation — 2026-09-29

## Requested outcome and scope

Dimi requests a typed, single authoring source for particle tuning, suitable for later customization controls. This is consolidation within the existing Domain boundary, not a new settings service, persistence authority or UI. Current local tuning is the baseline; no approval of its performance is inferred. Branch `feature/funkspace-minimum-usable`, HEAD `0eabf793240ec44e7352247c8160aa7f901de927`, plus the pre-existing uncommitted FS-4.4 candidate. Preserve WEB Black, theme/motion authorities and composition.

## Current tuning — 2026-09-30, R18 customization

Edit `frontend/domain/particles/ParticleSettings.ts` for authoring defaults and
limits; the detail-page controls consume that same metadata. Effective runtime
values come back from Domain normalization. Current defaults preserve count 200,
speed 0.4×, size 1× and distance 6×. The new connection cap defaults to 100, so it
does not restrict the ordinary default graph. Reload restores defaults.

| Control key                       | Default | Range / step | Meaning                                                                                         |
| --------------------------------- | ------- | ------------ | ----------------------------------------------------------------------------------------------- |
| `controls.count`                  | 200     | 10–1000 / 1  | Particle count                                                                                  |
| `controls.speed`                  | 0.4     | 0.1–2 / 0.1  | Multiplier on seeded 8–24 CSS px/s velocity                                                     |
| `controls.size`                   | 1       | 0.1–4 / 0.1  | Multiplier on seeded 1–3 CSS px radii                                                           |
| `controls.connectionsPerParticle` | 100     | 1–100 / 1    | Maximum degree at **both** endpoints, not a promise that every particle has this many neighbors |
| `controls.connectionDistance`     | 6       | 1–10 / 0.1   | Multiplier on the density-derived distance                                                      |

Connection engineering limits are now absolute: `connections.maxLines = 4800`
and `connections.maxCandidateChecks = 38400`, across at most 16 passes. These
retain the former 200-particle work/output ceilings even though count now permits 1000. `connections.distanceMultiplier` moved to `controls.connectionDistance`;
the old per-capacity budget fields are replaced by those absolute limits.
The requested distance is still the density formula below, initially limited by
the radius whose uniform-density estimate fits 4800 pairs. Dense patches may
require smaller-radius retries; exhausted work returns no partial prefix.
The effective cutoff can therefore plateau/shorten at high settings. The UI
explains this constraint rather than claiming a guaranteed line length.

Within the bounded candidate graph, pairs are selected shortest-first when a
degree cap is needed, with canonical spatial ties. Both endpoint degrees are
checked. Selection is deterministic, crosses bucket boundaries and does not
change particle positions/velocities/identities. If the cap is nonbinding, all
pairs inside the effective cutoff remain connected. The latest explicit cap
request supersedes the older no-degree-quota rule.

Line width remains 0.4 CSS px before size scaling [0.8, 1.5], opacity 1 before
distance fade, alpha ceiling 1. DPR 2, backing dimension 4096 px, backing area
4000000 px and delta 50 ms stay unchanged. Size/speed are independent.

Transparent WEB overlay is presentation state in `StartScene`, default Off. It
conceals the cover only over a ready Canvas, keeping failure/denied static WEB
complete. It never enters particle configuration or changes the runtime. User
Reset restores all five controls, opaque WEB and the seeded composition while
retaining Pause/theme/shared restrictions. Low-level reset still keeps the
current configuration. See [FS-4.6 C4](fs-4.6-customization-overlay.md#c4--expanded-customization--2026-09-30).

## Historical tuning — 2026-09-29, FS-4.4B correction

This table records the local authoring values inspected for the renderer checkpoint, preserved during F1–F3 corrections. It supersedes the older consolidation table; it does not imply a new performance or visual approval. Defaults now yield 200 particles, radii 3–9 CSS px and speeds 4–12 CSS px/s. The fixture count toggle is 200 ↔ 100.

## Historical consolidation tuning guide — superseded by R18

Edit `frontend/domain/particles/ParticleSettings.ts`, then reload the fixture. `ParticleSettings` describes the immutable authoring object `PARTICLE_SETTINGS`. Derived legacy exports remain compatible; do not edit defaults in consumers.

| Section                                                         | Meaning and current values                                                                                                          |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `controls.count`                                                | Default 200; allowed 20–200, step 2                                                                                                 |
| `controls.speed`                                                | Default multiplier 0.5; allowed 0.05–1, step 0.05                                                                                   |
| `controls.size`                                                 | Default radius multiplier 3; allowed 1–6, step 0.5                                                                                  |
| `particles.radiusCssPx`                                         | Seeded radius range [1, 3]; multiplied by size, so current visible radii are 3–9 CSS px (allowed effective range 1–18)              |
| `particles.speedCssPxPerSecond`                                 | Seeded speed range [8, 24]; multiplied by speed                                                                                     |
| `particles.seed`                                                | Reproducible uint32 seed; changing it changes initialization, not ongoing random forces                                             |
| `connections.maxDistanceCssPx` / `distanceMultiplier`           | Maximum cutoff 10,000 CSS px / density-distance multiplier 6                                                                        |
| `connections.densityTargetLines` / `densityTargetPerParticle`   | Formula inputs 1,000 and 0.5; not actual output quotas                                                                              |
| `connections.lineBudgetPerParticle`                             | 24 × count.max = 4,800 maximum output/buffer capacity; based on capacity, not active count                                          |
| `connections.widthCssPx` / `opacity`                            | Base line width 1.2 CSS px and alpha 1, then radius scaling and distance fade                                                       |
| `connections.referenceRadiusCssPx` / `sizeScale` / `maxOpacity` | Reference radius 2; width scaling [0.8, 1.5]; final alpha ceiling 1                                                                 |
| `connections.candidateVisitsPerParticle` / `maxPasses`          | 192 × count.max = 38,400 total visits across at most 16 passes; engineering work limits, NOT connections-per-particle degree quotas |
| `connections.retryDistanceMultiplier`                           | Halve radius on overflow; retain complete-pair semantics, never a biased truncated prefix                                           |
| `simulation.maxDeltaMs`                                         | 50 ms cap; dropped excess time, no catch-up                                                                                         |
| `raster`                                                        | Adapter-enforced DPR 2, dimension 4,096 px, total 4,000,000 backing pixels; no effect on physics                                    |

The existing density formula remains `min(maxDistance, distanceMultiplier * sqrt(2 * min(densityTargetLines, N * densityTargetPerParticle) * area / (pi * N * (N-1))))`. Increasing distance can increase work sharply. Keep budget fields separate from prospective visitor-facing controls. There is deliberately no degree quota because Dimi selected all nearby pairs.

Domain normalization still rejects malformed/nonfinite runtime count/speed/size inputs, clamps finite values and snaps steps; returned effective config is authoritative. Future controls read `controls` metadata and call the existing `configure` handle, never mutate the frozen source. Initialization-only radius/velocity ranges and connection/raster budgets are authored settings for now, not new live-update API fields. Extending those runtime fields later needs explicit identity/update semantics; this task does not invent them. Low-level reset preserves current effective config and seed; later user-facing Reset restores derived defaults without clearing Pause/preferences.

Theme colors, permission, Pause, aperture/font geometry and fixture layout remain with their existing owners. A single particle tuning source is not a second application settings authority. Browser scheduling/DOM remain in the existing adapter; no per-frame React state or new scheduler.

## Review status — 2026-09-29

Codex R2 closes the stale-test and tuning-documentation findings (F2/F3), alongside the static-preview correction (F1). Numeric settings are unchanged. [Exact candidate, fresh review checks and authorized commit/push](fs-4.4-svg-aperture.md#codex-r2-closure-and-authorized-delivery--2026-09-29). Technical PASS is separate from scene appearance and performance acceptance.

## Historical consolidation implementation and validation

The results below describe the earlier 2,000-particle consolidation candidate, not the current local tuning. FS-4.4B subsequently found 19 stale test expectations; its correction evidence is recorded in [FS-4.4](fs-4.4-svg-aperture.md#fs-44b-review-corrections--2026-09-29).

`ParticleScene`, `ParticleConnections`, and the Canvas adapter consume the shared settings. Live and static views already share those rules. The fixture count toggle uses half capacity when default equals maximum, so tuning both to 2,000 no longer makes the diagnostic button a no-op. Normalizing settings remains in Domain. Tests preserve exhaustive pair checks, state/identity, timing, invalid-input, range and lifecycle assertions; stale 1,600/3,200 and earlier line-style expectations are reconciled with the current source. Explicit behavioral test inputs remain independent of defaults where needed.

Fresh checks: 1,756 tests in 115 files PASS; strict types, repository lint/formatting, both production builds, Storybook build and its two mounted states PASS. The 18 production browser cases in each availability build all report success (36 total), including restored count-toggle behavior, same-runtime replacement, one still redraw, denied motion, resize and fallback. Both test runs still exit 1 because the runner times out during suite teardown/reporting at the external harness's 90-second bound. This is the previously observed runner limitation; no clean E2E exit is claimed and the bounded-run logs are retained. Assertions are unchanged in strength; no test is skipped. Direct Chrome 154 capture PASS (exit 0): 320/1,440 px viewports, 2,000 ↔ 1,000 count toggle, retained Pause and same Canvas through shape replacement, complete no-JS fallback. Visually inspected WEB output; no appearance change is intended or observed. Fresh homepage Lighthouse: three runs per flag pass existing LCP/CLS error assertions; On scores 0.82 throughout retain the below-0.9 warning, Off scores 1 throughout. The first On run overlapped browser/Storybook checks. These are homepage regressions, not fresh scene performance acceptance. Storybook retains its existing large-chunk warning. [Raw Lighthouse results](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4-settings/lighthouse-summary.json). Final scope, link, formatting and diff checks pass.

No new package/service/composition boundary; the authoring interface contains only plain TypeScript data. Raster limits are consumed by the adapter, not physics. No generated token/bootstrap edits. The current range and retry contracts remain complete-pair-or-empty, and all work limits derive from the same count capacity.

Evidence packet: [incremental diff, combined candidate, hashes and logs](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4-settings/). The `before/` directory distinguishes this consolidation from the earlier uncommitted FS-4.4 work. WEB Black and original identity artwork are untouched. Source inspection and deterministic output checks do not replace moving-scene or physical-device acceptance. Before/after deterministic trace hashes match exactly and cover counts 40, 240, 1,000 and 2,000, movement, resizing, effective config, sampled pairs/style/work and static data. Technical checks are separate from Dimi visual acceptance. No commit, push, deployment, remote action or later-epic controls.
