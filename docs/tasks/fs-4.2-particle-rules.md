# FS-4.2 — Pure particle state and update rules

## Task metadata

- **Status:** Implementation candidate ready for Codex renderer checkpoint and Dimi's still feedback. Technical checks passed; no task completion or moving-scene acceptance claimed.
- **Epic/owner:** EPIC 4; this session applies Sites guidance and is the sole writer. Codex's later review does not repair source.
- **Date:** 2026-09-28.
- **Base/branch:** `ed0ac9143193ec5efb5f6c3249513bc8e9ccb5f9`, `feature/funkspace-minimum-usable`; clean initial tree.
- **Authority:** Current FS-4.2 request; [accepted FS-4.1 contract](fs-4.1-scene-contract.md), [feature plan](../features/funkspace-minimum-usable.md), [workflow](../development/ai-workflow.md), [architecture](../architecture.md), ADR-003/004 and [EPIC 3 handoff](fs-3.6-integrated-validation.md#epic-4-implementation-handoff).

## Requested outcome and prerequisites

Implement only bounded, deterministic particle/configuration rules, tests and a reproducible still fixture. FS-4.1 R3 records technical PASS of R2 and Dimi acceptance of all product proposals. This new request authorizes FS-4.2; it supersedes the earlier record's historical absence of FS-4.2 authorization. SVG exports are required for later asset integration, not for pure rules or an unmasked diagnostic still. Videos remain unseen; use the accepted written drift behavior.

Inspected repository AGENTS, README/package scripts, architecture/ADRs, workflow/template, accepted contract, EPIC 3 handoff, existing MotionPolicy/AnimationTiming and common interpolation/timeline conventions. The actual supplied plan is `/Users/dimi/Downloads/FunkSpace_EPIC_4_Detailed_Plan.md` (SHA-256 `9b910c45941989d599cd8bfe0109c17f0a4792d46cfec8ea8a1d68150cc57178`), especially §5.1 and FS-4.2. Proposed paths were checked; no frontend particle domain module exists at this base. The game has its own random implementation; no game implementation is imported or extracted. Reuse the existing public `@funkspace/common/motion` clamp after explicit nonfinite rejection; clamp alone deliberately accepts Infinity and would not satisfy configuration rejection.

## Scope and plan

Create `frontend/domain/particles/ParticleScene.ts` plus colocated tests and this substantive record. Provide a deterministic still fixture derived from the same rules. No Canvas, browser observation/scheduling, React, controller/service composition, theme/mask inputs, game imports, package changes, generated output edits, public route or live preview. The initial implementation request did not authorize commit/push; Dimi's subsequent explicit authorization below applies to this bounded candidate.

1. Define typed state/configuration/bounds and the bounded mutation functions.
2. Implement seeded initialization/population changes, movement/wrap, resize and reset; expose independent still data.
3. Test the approved cases, verify pure dependencies/types/lint and produce a reproducible still and exact diff for review.

## Contracts and invariants

- **Ownership:** One caller owns each mutable `ParticleSceneState` created by the factory. Only module mutators change it; renderer code may borrow it synchronously, not mutate it. This avoids per-frame array/object allocation. There is no shared global state or React subscription. TypeScript's types do not defend against a caller deliberately corrupting internal state; runtime validation applies to the external bounds/configuration/seed/delta inputs, not repeated sanitization of every particle each frame.
- **Configuration:** Factory defaults are count 120, speed 1× and size 1×. Finite values clamp/snap to count 40–240 step 10, speed 0.25–2 step 0.05 and size 0.75–2 step 0.05. Nearest midpoint ties go upward with four machine-epsilon units of rounding-noise allowance. Malformed/nonfinite fields retain their last valid value (default on creation), independently of valid sibling fields. Unknown fields are ignored. `configureParticles` returns the exact immutable effective configuration stored in state; no stale requested/UI value is returned.
- **Seed/population:** Default unsigned 32-bit seed `0x46533431`; invalid/noninteger/out-of-range seeds fall back to it (seed is not a slider). A local Mulberry32 stream is keyed by seed and stable population-slot ID; only creation, added slots and Reset sample it. Direction, 8–24 CSS px/s base velocity and 1–3 CSS px base radius are independent seeded traits. IDs are `0..count-1`; shrinking removes the tail; later growth recreates removed slots at seeded initial positions in current bounds. Surviving particle objects, positions and traits are untouched. Removed particles' elapsed movement is not retained. There is no PRNG cursor requiring replay for survivors.
- **Movement:** Constant base velocity times the current speed multiplier and accepted seconds. Delta rejects malformed/nonfinite values, clamps negative to zero and finite excess to 50 ms, and drops excess rather than accumulating catch-up. Euclidean wrap keeps centers in `[0,width)` / `[0,height)`; no collisions, masks, trails, pointer forces or edge duplicates. Drawing/clipping belongs to the later renderer. The later frame owner must supply zero on first/resumed frame; this domain has no clock or visibility/Pause authority.
- **Bounds/resize:** Only finite positive CSS width/height are usable. Invalid initial bounds defer population creation; config/seed remain available. Invalid later bounds suspend advancement and retain last valid bounds/population. A later valid resize scales fractional positions from those last valid dimensions without changing traits; unchanged axes are exact no-ops. No physical/raster/DPR values enter state. Extreme positive finite dimensions must not create NaN/Infinity or an upper-edge coordinate through rounding.
- **Reset:** `resetParticles` recreates the initial seeded population at current configuration and last valid dimensions, preserving invalid-bounds suspension. It never restores default settings or starts anything. The later AnimationRuntime owner must stop advancement before calling it; pure state has no play flag, preference or scheduling to clear. User-facing default restoration and permission-controlled resume remain later application work.
- **Static data:** `getParticleStill` copies immutable `{id,x,y,radius}` data from the same state; radius applies the current size multiplier. Configuration and bounds are immutable owned values. Retained stills cannot change when the live state advances/resizes/configures/resets. This allocation is for discrete preview/export events, not a second simulation or required per-frame rendering API. Before any valid bounds, the still has no geometry/population; presentation must keep its independent fallback.
- **Determinism:** Same seed, valid configuration, initial bounds and ordered input/delta trace repeat. Equivalent unclamped timing partitions are compared within `1e-9` CSS px over the tested traces. Clamped 100 ms intentionally differs from two accepted 50 ms steps. Trigonometry/IEEE-754 precision is not a promise of cross-engine bit-identical pixels.

## Validation plan and review limits

Run focused domain tests in Node, frontend validation types, pure ES-only type checking, applicable lint/format/freshness and dependency inspection. Preserve the accepted contract and all unrelated sources. Provide a bounded reproducible still and exact candidate diff/hashes. No production consumer imports this module yet; browser/Storybook/production performance checks cannot establish a renderer that does not exist and are reserved for later tasks.

## Reproducible still and public domain API

Inspect the [two-panel SVG still](fixtures/fs-4.2/particle-still.svg) and [numeric fixture](fixtures/fs-4.2/particle-still.json). Both use the default seed/configuration at 640 × 360 CSS px. The first frame is initial state; the second applies 20 accepted 50 ms updates (1,000 ms simulated time). It is a bounded, **unmasked diagnostic field** with diagnostic colors, not approved SPACE typography, theme integration or a moving preview. No production asset is substituted and no React/RAF loop exists. Still feedback cannot establish moving-scene acceptance.

From the repository root, reproduce with the existing installed tools:

```bash
node docs/tasks/fixtures/fs-4.2/generate.mjs /tmp/fs-4.2-still
```

The [offline generator](fixtures/fs-4.2/generate.mjs) imports/bundles the actual pure module, captures `getParticleStill` before/after fixed deltas and records the module SHA-256. It writes SVG and formatted JSON; it is never imported by frontend code and uses no browser or clock. No tooling install or package change is required. Generated data is reviewed evidence, not a hand-maintained second rules implementation.

| API                                           | Contract                                                                         |
| --------------------------------------------- | -------------------------------------------------------------------------------- |
| `createParticleScene(bounds, config?, seed?)` | One owned state; invalid config/seed defaults; invalid bounds defer population   |
| `configureParticles(state, input)`            | Partial runtime validation; returns stored effective config; preserves survivors |
| `resizeParticleScene(state, input)`           | Returns whether bounds are usable; preserves last valid state through suspension |
| `advanceParticles(state, deltaMilliseconds)`  | In-place update; returns accepted 0–50 ms (zero when suspended); no scheduler    |
| `resetParticles(state)`                       | Same seed/current config/current or last valid geometry; preserves suspension    |
| `getParticleStill(state)`                     | Immutable independent numeric snapshot; not the renderer's per-frame API         |

## Completion record

- **Delivered:** One pure domain module, colocated tests, reproducible SVG/JSON still and offline generator, this record and the feature-plan status update. No production consumer or shared service changed. Commit/push is authorized by the follow-up below; no PR, merge or deployment is included.
- **Focused tests:** `pnpm exec vitest run frontend/domain/particles/ParticleScene.test.ts` — **64 passed**, Node environment. Covers defaults, seeds, rejected values, every approved step/midpoint and adjacent values, all finite extremes, both wrapping directions, delta rejection/clamping/partition tolerance, speed/size independence, object/survivor identity, deferred/invalid/extreme bounds, resize traces, reset and independent still snapshots.
- **Types:** `pnpm typecheck:validation` — PASS. A separate temporary config compiling the module and its dependencies with `lib:["ES2020"]`, `types:[]`, strict/noEmit and no DOM library — PASS. This proves browser types are unnecessary; it does not certify an unimplemented adapter.
- **Targeted lint/freshness:** `pnpm --filter frontend exec eslint domain/particles/ParticleScene.ts domain/particles/ParticleScene.test.ts --max-warnings=0` and `pnpm check:theme-bootstrap` — PASS. No bootstrap regeneration occurred. Final formatting/content/link/diff/preservation checks are recorded in the evidence packet.
- **Repository lint:** `pnpm lint` — PASS (bootstrap freshness, full Next ESLint and repository Prettier). The first sandboxed attempt could not write the existing ESLint cache; the authorized retry passed. The existing `next lint` deprecation notice remains; no tooling migration was made. The final record-only update also received a targeted format/link/diff check.
- **Boundary inspection:** The sole source import is the existing public `@funkspace/common/motion` entry. Its inspected graph is pure common motion/generated motion data; a neutral review bundle retains only the existing interpolation helper and this module. No DOM, Canvas, browser scheduling, clock, uncontrolled random, theme/mask or game runtime dependency was found. Review-bundle bytes are not a production bundle/performance result.
- **Fixture verification:** Generated from actual source, 120 particles per panel. Offline Chrome 154.0.8037.57 rendered the SVG for inspection with page network requests blocked; 240 circles total, labels/frame visible. No app page, Canvas, live motion or physical phone was tested. An initial screenshot attempt used an unavailable package alias; using the installed `playwright-core` resolved that. The sandboxed browser launch then failed; an authorized isolated launch succeeded and was closed after capture. No installation or persistent environment changes.
- **Evidence:** Accessible local packet `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.2/` contains exact full candidate patch/hash manifest, original-source preservation snapshot, command results, ES-only type config, dependency graph, fixture generation/reproduction evidence and PNG inspection image. Repository SVG/JSON/generator and this record remain usable without that local packet. Transfer the raw packet when a reviewer lacks access; do not treat an inaccessible path as evidence.
- **Not run:** Full application test suite, Storybook/production build, Lighthouse or production E2E; no existing consumer imports the new rules. No new scene CPU/frame/GPU/bundle-budget claim is made. Existing FS-4.1 baseline remains separate and unchanged.
- **Limits/remaining:** Mutable state is a trusted owned handle, not an untrusted deserialization format. Exact cross-engine trigonometric identity is not promised. Initial/second SVG exports remain outstanding for later integration. Codex's renderer checkpoint and Dimi's still feedback are pending; FS-4.2 completion and FS-4.3 authorization are not inferred.

### Documentation and commit/push authorization — 2026-09-28

Dimi explicitly requested: **“update the documentation then commit and push the changes.”** This authorizes this record update and the seven-file FS-4.2 candidate on `feature/funkspace-minimum-usable`. It does not constitute Codex renderer-checkpoint PASS, Dimi's still feedback, FS-4.2 completion, moving-scene acceptance or permission to start FS-4.3.

Before this record-only amendment, all seven file hashes matched the tested candidate packet (patch SHA-256 `617e82a82b94f616ec8df515ff93c4d0b930f7d2c4d6a68012466dd337c424ce`). The domain implementation, tests, generator and fixture remain byte-identical to their validated versions. Existing test/type/lint results above are retained evidence; only documentation formatting, links, exact diff/scope and preservation are rechecked for this amendment. The final commit identifies the reviewable candidate; exact commit/push verification and final diff/hashes are retained locally in `artifacts/fs-4.2-commit/`. No new performance or browser-behavior claim is made.

### Exact Codex renderer-checkpoint handoff

Review the FS-4.2 commit against the recorded base, including this documentation amendment; the original implementation patch/hashes and final commit packet are identified above. Do not repair source. Check validation/normalization (especially midpoint tolerance), seeded slot identity and shrink/regrowth semantics, no reseeding of survivors, extreme and invalid bounds, delta partition limits, reset under current configuration, mutation ownership and static-data independence. Confirm one later adapter can own this state without a duplicate store or per-frame snapshots. Keep frame ownership, preparation cancellation, intro readiness and browser resource lifecycle with the already approved FS-4.1 boundary for FS-4.3; those are not implemented here. Return PASS, CHANGES REQUIRED or BLOCKED against the exact candidate; no renderer or moving-visual acceptance can follow from the still alone.
