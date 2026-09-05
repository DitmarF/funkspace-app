# Wave Survivor — Detailed Implementation Plan

> Intended repository path: `docs/features/wave-survivor-implementation-plan.md`

## Document metadata

- **Status:** In progress — EPICs 0–5 implemented; WS-6.1/6.2/6.3/6.6 candidates and WS-6.7 record boundary implemented; Gate 1 approved, Gate 2 pending
- **Owner:** Dimi
- **Product:** FunkSpace Wave Survivor
- **Planning level:** Epic and implementation-task roadmap
- **Last updated:** 2026-09-05
- **Concept source:** [`docs/features/wave-survivor.md`](./wave-survivor.md)
- **Game package:** `games/wave-survivor/`
- **Portfolio integration:** `frontend/features/games/`
- **Related decisions:**
  - [`ADR-002: Design tokens as the source of truth`](../decisions/ADR-002-design-token-source-of-truth.md)
  - [`ADR-003: Interactive experience boundary`](../decisions/ADR-003-interactive-experience-boundary.md)
  - [`ADR-004: First game development architecture`](../decisions/ADR-004-game-development-architecture.md)

## 1. Purpose

This document converts the approved Wave Survivor concept into an executable implementation roadmap. It defines the delivery order, epic boundaries, task IDs, expected system changes, dependencies, validation requirements, gate criteria, risks, and handoff rules for human or AI-assisted implementation.

The plan is intentionally organized around playable vertical slices. Each epic must produce an independently verifiable outcome. The sequence prevents architecture, content, polish, and portfolio integration from hiding an unproven gameplay loop.

This is not a schedule and does not prescribe a fixed duration. Work proceeds by completed evidence and gate approval, not by elapsed time.

## 2. Source precedence and planning assumptions

The following sources are authoritative in this order:

1. The approved game concept in `docs/features/wave-survivor.md`.
2. Accepted repository ADRs and current repository code.
3. This implementation plan.
4. Earlier concept audits and planning discussions.

The revised architecture decision to use a custom TypeScript and Canvas 2D micro-engine supersedes the earlier suggestion to use Phaser. No game framework may be introduced without a new, explicit architecture decision based on demonstrated requirements.

### Verified starting point

At the beginning of this roadmap, the repository already provides:

- a PNPM workspace entry for `games/*`;
- the standalone `games/wave-survivor/` package;
- a public `createGame()` lifecycle boundary;
- `start`, `pause`, `resume`, `restart`, `setTheme`, and `destroy` operations;
- an empty Canvas renderer boundary;
- a standalone demo;
- a lazy frontend game loader and `GameHost`;
- a portfolio-to-game theme adapter;
- generated game color tokens;
- pure shared motion utilities;
- package, frontend, Vitest, and Playwright foundations.

That list is the historical roadmap baseline. EPICs 1–5 have since delivered
simulation, controls, enemy behavior, combat drawing, waves, and upgrades.
WS-6.1 adds the finite candidate configuration; WS-6.6 adds the pure score
candidate. WS-6.7 adds the immutable public result type and internal factory.
WS-6.2 adds active charger behavior and combat fixtures; WS-6.3 integrates
production entry; WS-6.4 adds static action telegraphs and focused swept contact.
WS-6.5 now integrates terminal victory/loss and committed scores/results. Result
publication and standalone UI are now implemented by WS-6.8. Audio and persistence
remain unimplemented; see evidence below.

### Safe assumptions

- The logical arena is `360 × 640` game units.
- Mobile portrait is the primary presentation.
- The player controls movement only.
- Attacks are automatic.
- The first public version has one arena, one player, one boss, at most three normal enemy archetypes, and approximately six to eight upgrades.
- The first complete run targets approximately five to seven minutes, but measured playtesting may change the final value.
- React owns semantic application UI, while the game package owns per-frame simulation and Canvas rendering.
- The game remains independently runnable through its standalone demo.

## 3. Delivery principles

### 3.1 Vertical slices before frameworks

Each epic must end in observable working behavior. New abstractions are allowed only when they solve a problem already encountered in the current slice.

### 3.2 One source of game time

Each game instance owns exactly one main browser animation-frame loop. Simulation, cooldowns, spawning, effects, and rendering advance from that runtime. No individual effect, input adapter, or entity may create its own animation-frame loop.

### 3.3 Deterministic rules, replaceable adapters

Game rules must be testable without a real browser, Canvas, audio context, or uncontrolled randomness. Browser clocks, input, rendering, storage, visibility, audio, and randomness stay behind focused boundaries.

### 3.4 Presentation does not define gameplay

Canvas size, device-pixel ratio, final sprites, particles, screen shake, and UI animation must not alter collision shapes, movement speed, wave timing, or difficulty.

### 3.5 Reduce rather than multiply

Extend the existing lifecycle API, renderer boundary, theme adapter, and shared motion package. Do not introduce a second theme manager, alternate host API, parallel game loop, duplicate math library, generic ECS, or speculative shared engine.

### 3.6 Gate-based scope control

No later gate may be used to compensate for a failed earlier gate:

- Final art cannot compensate for weak movement.
- More enemies cannot compensate for weak combat.
- Audio cannot compensate for unclear damage.
- Portfolio UI cannot compensate for lifecycle leaks.
- Data-driven configuration cannot compensate for an incomplete run.

## 4. Target architecture

```text
Portfolio Presentation
Next.js / React / semantic DOM
        │
        │ public lifecycle, theme, settings, discrete events
        ▼
Wave Survivor Application
session state and phase orchestration
        │
        ▼
Wave Survivor Domain
pure state, rules, movement, collision, targeting,
spawning, waves, upgrades, score, deterministic transitions
        ▲
        │ ports / focused contracts
        │
Wave Survivor Infrastructure and Renderer
browser loop, keyboard/pointer input, Canvas 2D,
resize observation, visibility, audio, storage, seeded randomness
```

### Dependency rules

- Domain imports no browser APIs, Canvas types, React, Next.js, Tailwind, storage, or audio.
- Application coordinates Domain behavior through explicit contracts.
- Browser and Canvas implementations remain outside Domain.
- The frontend imports the game package only through its public package export and `frontend/features/games/`.
- The game package imports no frontend source.
- React receives only lifecycle state, UI-relevant snapshots, and discrete events. It never receives per-frame entity positions.
- Theme values are injected as resolved semantic values. The game never reads FunkSpace CSS variables or `ThemeService`.
- Shared motion utilities may shape visual effects but never determine gameplay balance.

## 5. Scope firewall

The following remain outside the first public version unless they replace an approved feature of comparable cost:

- backend or account system;
- online leaderboard;
- multiplayer;
- permanent statistical progression;
- unlock currencies or grinding;
- inventory, equipment, crafting, or loot rarity;
- campaign, quests, or world map;
- procedural or scrolling arena;
- multiple arenas or game modes;
- character roster;
- manual aiming or attack buttons;
- dynamic pathfinding;
- generic ECS;
- general physics engine;
- scene graph, editor, plugin API, or scripting language;
- WebGL renderer;
- monetization.

A proposed feature may enter only when it directly improves the core 30-second play loop or removes another approved feature.

## 6. Roadmap summary

| Epic        | Outcome                                                                | Gate                | Depends on      |
| ----------- | ---------------------------------------------------------------------- | ------------------- | --------------- |
| **EPIC 0**  | Approved baseline, documents, and clean validation starting point      | Preparation         | None            |
| **EPIC 1**  | Responsive portrait Canvas and fixed logical arena                     | Gate 1              | EPIC 0          |
| **EPIC 2**  | Deterministic runtime, virtual joystick, keyboard, and player movement | Gate 1              | EPIC 1          |
| **EPIC 3**  | Fair offscreen enemy entry and pursuit                                 | Gate 1              | EPIC 2          |
| **EPIC 4**  | Automatic combat, health, death, and clean restart                     | **Gate 1 complete** | EPIC 3          |
| **EPIC 5**  | Finite waves, upgrade choice, and phase flow                           | Gate 2              | Gate 1 approval |
| **EPIC 6**  | Boss, score, win state, and complete finite run                        | **Gate 2 complete** | EPIC 5          |
| **EPIC 7**  | Dedicated portfolio shell and accessible application UI                | Gate 3              | Gate 2 approval |
| **EPIC 8**  | Theme-aware effects, audio, settings, and persistence                  | Gate 3              | EPIC 7          |
| **EPIC 9**  | Device, performance, lifecycle, and accessibility hardening            | **Gate 3 complete** | EPIC 8          |
| **EPIC 10** | Capped data-driven content expansion and release documentation         | **Gate 4 complete** | Gate 3 approval |

## 7. Critical path

```text
EPIC 0
  ↓
EPIC 1
  ↓
EPIC 2
  ↓
EPIC 3
  ↓
EPIC 4 ── Gate 1 decision
  ↓
EPIC 5
  ↓
EPIC 6 ── Gate 2 decision
  ↓
EPIC 7
  ↓
EPIC 8
  ↓
EPIC 9 ── Gate 3 decision
  ↓
EPIC 10 ── Gate 4 / release candidate
```

EPICs 1–4 should not be parallelized because each one validates foundations required by the next. Visual exploration may occur separately, but final assets must not enter the production renderer before Gate 1 approval.

Current delivery status: EPICs 0–4 are complete and accepted. Gate 1 passed on
2026-08-30 after successful PC and real-smartphone manual reviews and the full
automated validation suite. EPIC 5 is the next implementation boundary.

---

# EPIC 0 — Establish the implementation baseline

## Goal

Place the approved concept and roadmap in the repository, inspect the current scaffold, and record a clean validation baseline before gameplay code changes.

## System value

This epic creates recoverable project context for future human and AI agents. It prevents accidental re-scaffolding, undocumented assumptions, and confusion between historical plans and current implementation.

## Dependencies

None.

## In scope

- Documentation placement.
- Inspection of existing package, host, theme, motion, scripts, and tests.
- Baseline validation.
- Confirmation of protected architecture and scope.

## Out of scope

- Gameplay behavior.
- File reorganization.
- Dependency upgrades unrelated to a failing baseline.
- New runtime abstractions.

## Work items

| ID         | Task                                              | Expected areas                                                                            | Acceptance criteria                                                                                                                             |
| ---------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **WS-0.1** | Add the approved game concept document.           | `docs/features/wave-survivor.md`                                                          | Document exists, links resolve, status and date are current, and no historical recommendation contradicts the approved custom-engine direction. |
| **WS-0.2** | Add this implementation plan.                     | `docs/features/wave-survivor-implementation-plan.md`                                      | Epics, gates, task IDs, scope, validation, and handoff rules are preserved.                                                                     |
| **WS-0.3** | Inspect current game and integration scaffolding. | `games/wave-survivor/`, `frontend/features/games/`, `common/`, `tokens/`, package scripts | An execution note records current public API, tests, scripts, existing abstractions, and any mismatch with the concept.                         |
| **WS-0.4** | Run baseline package validation.                  | Workspace commands                                                                        | Game typecheck, tests, build, and standalone demo build pass or exact pre-existing failures are documented.                                     |
| **WS-0.5** | Run baseline frontend integration validation.     | Frontend typecheck and affected tests                                                     | Existing loader, host, and theme-adapter tests pass or exact pre-existing failures are documented.                                              |
| **WS-0.6** | Confirm the scope firewall.                       | Documentation review                                                                      | No game framework, backend, generic engine, parallel theme system, or unrelated frontend refactor is introduced.                                |

## Validation

```bash
pnpm --filter @funkspace/wave-survivor typecheck
pnpm --filter @funkspace/wave-survivor test
pnpm --filter @funkspace/wave-survivor build
pnpm --filter @funkspace/wave-survivor demo:build
pnpm -F frontend exec tsc --noEmit
pnpm test
```

Use narrower affected frontend test commands when repository scripts support them.

## Epic exit criteria

- The concept and implementation plan are repository-visible.
- Existing scaffold behavior has not changed.
- Baseline failures, if any, are distinguishable from later implementation regressions.
- The next task can start without guessing current package boundaries.

---

# EPIC 1 — Responsive portrait arena and Canvas foundation

## Goal

Replace the temporary landscape presentation with a stable `360 × 640` logical arena that renders correctly across supported viewport sizes without changing game rules.

## System value

The arena coordinate system is the dependency root for movement, spawning, collision, targeting, rendering, touch controls, and difficulty. Correcting it first prevents device-specific balancing and future migration work.

## Dependencies

EPIC 0.

## In scope

- Logical arena constants and bounds.
- Pure viewport calculations.
- CSS display scaling.
- Device-pixel-ratio-aware backing resolution.
- Resize observation and cleanup.
- Background, arena border, and stationary player marker.
- Standalone and portfolio-host consistency.

## Out of scope

- Runtime loop.
- Player movement.
- Joystick.
- Safe-area UI polish.
- Enemies or combat.
- Final artwork.

## Suggested implementation areas

- Existing: `games/wave-survivor/src/renderer/`
- Proposed: `games/wave-survivor/src/domain/arena/`
- Proposed: `games/wave-survivor/src/infrastructure/resize/`
- Existing: `games/wave-survivor/demo/`
- Existing: `frontend/features/games/GameHost.tsx`

Exact filenames should follow nearby conventions after inspection. Do not reorganize the package solely to match this suggestion.

## Work items

| ID          | Task                                                      | Planned behavior                                                                 | Acceptance criteria                                                                                  |
| ----------- | --------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **WS-1.1**  | Define logical arena and visible bounds.                  | Add immutable `360 × 640` logical dimensions plus pure rectangle helpers.        | No gameplay calculation reads CSS size, backing-buffer size, or device-pixel ratio.                  |
| **WS-1.2**  | Define future player, spawn, and despawn-bound contracts. | Provide minimal types or helpers without implementing spawning.                  | Bounds can be consumed later without changing the arena API; no speculative spawn system is created. |
| **WS-1.3**  | Implement pure aspect-fit calculations.                   | Calculate display width, height, scale, and offsets from available space.        | Tests cover small phone, tall phone, tablet, desktop cap, and zero/invalid dimensions.               |
| **WS-1.4**  | Add device-pixel-ratio calculation.                       | Cap initial DPR at `2` and calculate backing dimensions.                         | A DPR above `2` never creates a larger effective ratio; logical coordinates remain unchanged.        |
| **WS-1.5**  | Update the Canvas renderer transform.                     | Draw in logical units while Canvas backing size follows display and DPR.         | Arena is sharp, centered, and never stretched.                                                       |
| **WS-1.6**  | Add resize observation.                                   | Observe the game container or Canvas boundary and update presentation only.      | Resize does not restart the controller, reset theme, or alter player logical position.               |
| **WS-1.7**  | Implement renderer cleanup.                               | Disconnect observers and clear retained browser references on `destroy()`.       | Repeated mount/destroy does not accumulate observers.                                                |
| **WS-1.8**  | Draw the grey-box arena.                                  | Render background, visible border, and stationary player marker in theme colors. | All supported themes show a distinguishable arena and player.                                        |
| **WS-1.9**  | Update the standalone demo.                               | Replace temporary landscape sizing with the portrait arena.                      | Demo and portfolio host display the same logical world.                                              |
| **WS-1.10** | Update host sizing defaults.                              | Remove assumptions that the game is `960 × 540`.                                 | Host remains generic enough to mount the package without owning game rules.                          |

## Testing strategy

### Domain/unit

- Arena constants and bounds.
- Aspect-fit scale and offsets.
- DPR cap.
- Invalid or zero-size input handling.

### Infrastructure/renderer

- Resize updates backing dimensions.
- Resize does not replace game state.
- Destroy disconnects observers.
- Theme updates still reach the renderer after resize.

### Manual

1. Open the standalone demo on narrow portrait, tall portrait, and desktop viewports.
2. Resize repeatedly while the player marker remains fixed in logical space.
3. Confirm the arena keeps its aspect ratio and does not become physically enormous on desktop.
4. Navigate away from the hosted game and confirm no resize work continues.

## Epic exit criteria

- The game world is always `360 × 640` logical units.
- Physical display size can change without changing gameplay space.
- Standalone and hosted presentations agree.
- All resize resources are cleaned up.
- The stationary marker and arena are readable in every active theme.

---

# EPIC 2 — Deterministic runtime, input, and player movement

**Status:** Complete and accepted on 2026-08-26.

All eleven EPIC 2 work items are implemented. Desktop and smartphone review
approved deterministic keyboard and touch movement, arena bounds, interruption
reset, and the initial control feel for enemy testing. The current tuning
baseline is `120` logical units per second for player speed, with a `52` CSS-pixel
joystick base radius, `22` CSS-pixel knob radius, `20` CSS-pixel safe inset, and
`12%` dead zone. These remain balance values that later pursuit playtesting may
adjust without changing the runtime or input architecture.

## Goal

Create the first functional real-time slice: one bounded fixed-step loop, one player, touch joystick input, keyboard input, and deterministic movement.

## System value

Movement is the primary player skill and the highest-leverage source of game feel. This epic validates time, lifecycle, input normalization, interruption handling, and arena constraints before enemy systems depend on them.

## Dependencies

EPIC 1.

## In scope

- Minimal game state.
- Fixed-step loop.
- Lifecycle integration.
- Movement intention contract.
- Keyboard input.
- Fixed virtual joystick.
- Player movement and bounds.
- Input reset on interruption.

## Out of scope

- Enemies.
- Collision damage.
- Attacks.
- Floating or configurable joystick.
- Gamepad support.
- Final HUD.

## Suggested implementation areas

- Proposed: `games/wave-survivor/src/domain/state/`
- Proposed: `games/wave-survivor/src/domain/movement/`
- Existing: `games/wave-survivor/src/application/`
- Proposed: `games/wave-survivor/src/infrastructure/loop/`
- Proposed: `games/wave-survivor/src/infrastructure/input/`
- Existing: `games/wave-survivor/src/renderer/`

## Work items

| ID          | Task                                               | Planned behavior                                                                                                                                                                       | Acceptance criteria                                                                                                                           |
| ----------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **WS-2.1**  | Define minimal runtime state.                      | Store phase, simulation time, player position, player radius, speed, and movement intent.                                                                                              | State is plain TypeScript data and independent from browser APIs.                                                                             |
| **WS-2.2**  | Define clock and frame contracts.                  | Allow controllable time in tests and browser scheduling in production.                                                                                                                 | Domain/application tests advance without real `requestAnimationFrame`.                                                                        |
| **WS-2.3**  | Implement the bounded fixed-step loop.             | Use one RAF loop, an accumulator, a fixed update step, and clamped large frame gaps.                                                                                                   | Long tab suspension does not trigger unbounded catch-up updates.                                                                              |
| **WS-2.4**  | Wire runtime lifecycle to the existing controller. | `start`, `pause`, `resume`, `restart`, and `destroy` control the actual loop.                                                                                                          | Calls remain idempotent; `destroy()` is terminal.                                                                                             |
| **WS-2.5**  | Define `MovementIntent`.                           | Use normalized `x` and `y` intention independent from device input.                                                                                                                    | Neither input adapter mutates player coordinates.                                                                                             |
| **WS-2.6**  | Implement keyboard input.                          | Support WASD and arrow keys with simultaneous-key resolution.                                                                                                                          | Key release, blur, pause, and destroy clear input.                                                                                            |
| **WS-2.7**  | Implement the fixed virtual joystick.              | Map client positions through the displayed Canvas scale and translation, then use one primary pointer, pointer capture, a dead zone, clamped knob displacement, and normalized output. | Pointer leaving the original region does not break control; cancellation stops movement; Domain receives no CSS or backing-buffer dimensions. |
| **WS-2.8**  | Combine input sources safely.                      | Resolve active keyboard and joystick intentions without producing magnitude above one.                                                                                                 | Diagonal or combined input is normalized and predictable.                                                                                     |
| **WS-2.9**  | Implement player movement.                         | Apply speed × fixed delta and clamp the player circle inside the arena.                                                                                                                | Equal simulated time produces equal displacement at different render rates.                                                                   |
| **WS-2.10** | Draw player and joystick.                          | Render the player and mobile control using game theme roles or local neutral values.                                                                                                   | Joystick is readable but does not obscure core arena action.                                                                                  |
| **WS-2.11** | Reset input across lifecycle transitions.          | Clear input on pause, restart, visibility loss, blur, pointer cancel, and destroy.                                                                                                     | No ghost movement occurs after any interruption.                                                                                              |

## Testing strategy

### Domain/unit

- Movement normalization.
- Delta-based position update.
- Arena clamping.
- Equivalent displacement over equivalent time.
- Zero movement inside the dead zone.

### Application

- Start schedules one loop.
- Repeated start does not schedule another loop.
- Pause stops simulation updates.
- Resume restarts exactly once.
- Restart restores initial state.
- Destroy cancels scheduling and rejects future lifecycle effects.

### Infrastructure

- Keyboard keydown/keyup behavior.
- Pointer capture and release.
- Pointer cancellation.
- Client-to-logical coordinate mapping across display scales and translations.
- Blur and visibility reset.
- Listener cleanup.

### Manual

- Move on a real touch device with the thumb near the lower-left area.
- Compare diagonal and straight-line travel.
- Rotate or background the page while holding input.
- Return to the page and verify the player is stationary until new input occurs.

## Epic exit criteria

- Touch and keyboard control the same deterministic movement system.
- Movement feels responsive enough to begin enemy testing.
- Diagonal movement is not faster.
- Exactly one main loop exists.
- Pause, restart, and destroy leave no active movement or listeners.

---

# EPIC 3 — Enemy spawning, entry, and pursuit

**Status:** Complete and accepted on 2026-08-29.

All eleven EPIC 3 work items are implemented. Automated coverage verifies
seeded spawning, fairness, pursuit, activation, rendering snapshots, cleanup,
and deterministic lifecycle behavior. PC and smartphone manual review approved
offscreen entry, directional warnings, pursuit readability, visible-border
retention, pause and resume, restart, resizing, and the live-enemy cap.

## Goal

Introduce one enemy that is created outside the visible arena, enters with fair warning, becomes active at the border, and pursues the player deterministically.

## System value

This epic creates the pressure loop without combat complexity. It validates offscreen simulation, fairness constraints, seeded randomness, active-entity lifecycle, and readable pursuit.

## Dependencies

EPIC 2.

## In scope

- Seedable randomness.
- One basic enemy definition.
- Entering, active, and dying lifecycle states.
- Uniform expanded-perimeter spawning.
- Speed-based spawn offset.
- Minimum contact-time fairness.
- Direct pursuit.
- Entry warning.
- Despawn cleanup.

## Out of scope

- Enemy damage.
- Player health.
- Projectiles.
- Multiple enemy archetypes.
- Waves.
- Boss behavior.
- Pathfinding or steering framework.

## Suggested implementation areas

- Proposed: `games/wave-survivor/src/domain/random/`
- Proposed: `games/wave-survivor/src/domain/enemies/`
- Proposed: `games/wave-survivor/src/domain/spawning/`
- Proposed: `games/wave-survivor/src/domain/geometry/`
- Existing renderer and application runtime.

## Work items

| ID          | Task                                       | Planned behavior                                                                                        | Acceptance criteria                                                      |
| ----------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **WS-3.1**  | Define a randomness port.                  | Domain requests bounded random values without calling `Math.random()` directly.                         | Tests can reproduce the same spawn sequence from the same seed.          |
| **WS-3.2**  | Implement a seedable random source.        | Provide a small deterministic implementation suitable for gameplay tests.                               | Same seed and actions produce identical enemy positions.                 |
| **WS-3.3**  | Define the basic enemy.                    | Add radius, speed, health placeholder, and contact-damage placeholder.                                  | Definition contains no browser or rendering data.                        |
| **WS-3.4**  | Define enemy phases.                       | Use `entering`, `active`, and `dying`.                                                                  | Entering enemies cannot yet be targeted or damage the player.            |
| **WS-3.5**  | Implement expanded-perimeter sampling.     | Sample by total perimeter length of the spawn rectangle.                                                | Spawn density is not biased by choosing all four sides equally.          |
| **WS-3.6**  | Implement speed-based spawn offset.        | Calculate offset from radius, speed, and entry-lead duration.                                           | Faster enemies begin farther away for comparable warning time.           |
| **WS-3.7**  | Implement minimum-contact-time validation. | Reject or resample positions that reach the player too quickly.                                         | A player near an edge does not receive an immediately unavoidable spawn. |
| **WS-3.8**  | Implement direct pursuit.                  | Normalize vector toward player and apply fixed-step movement.                                           | Enemy speed is deterministic and frame-rate independent.                 |
| **WS-3.9**  | Activate at visible-arena intersection.    | Transition from entering to active when the enemy collision circle intersects the arena.                | Fully invisible enemies remain entering; partial entry becomes active.   |
| **WS-3.10** | Render entry warning and enemy.            | Show a restrained border marker before the enemy becomes visible.                                       | Warning identifies the entry edge without requiring color alone.         |
| **WS-3.11** | Implement despawn safety bounds.           | Remove invalid entities only after they cross the larger despawn boundary or are explicitly cleaned up. | Entities do not disappear at the visible border.                         |

## Testing strategy

### Domain/unit

- Seed reproducibility.
- Uniform perimeter coordinate mapping.
- Spawn position always outside visible bounds.
- Offset increases with speed.
- Contact-time rejection and bounded retry behavior.
- Entering-to-active transition.
- Pursuit direction and speed.

### Application

- Spawned enemy participates in update order after player movement.
- Restart clears enemies and resets deterministic seed policy.
- Pause freezes enemy movement.

### Manual

- Stand near each arena edge and observe repeated spawns.
- Confirm enemies are signaled before appearing.
- Confirm no enemy appears directly on the player.
- Confirm enemies can cross the visible border and continue moving normally.

## Epic exit criteria

- One or more enemies can be avoided through movement alone.
- Spawns originate outside the visible arena.
- Entry warning and timing feel readable.
- Entering enemies are inactive until visible intersection.
- Spawn and pursuit behavior are deterministic under tests.

---

# EPIC 4 — Automatic combat, health, death, restart, and Gate 1

## Goal

Complete the grey-box toy: the player moves, avoids enemies, attacks automatically, receives contact damage, dies, and starts a clean new run.

## System value

This is the first product gate. It validates the complete 30–60 second feedback loop before waves, upgrades, boss content, audio, or portfolio polish create additional dependencies.

## Dependencies

EPIC 3.

## In scope

- One automatic projectile attack.
- Nearest-active-enemy targeting.
- Projectile movement and cleanup.
- Circle collision.
- Enemy health and death.
- Player health and contact damage.
- Post-hit invulnerability.
- Minimal score or kill count.
- Lose state.
- Clean restart.
- Gate 1 playtest and tuning.

## Out of scope

- Finite waves.
- Upgrades.
- Boss.
- Final scoring formula.
- Final UI or art.
- Audio.
- Object pooling without measured need.

## Suggested implementation areas

- Proposed: `games/wave-survivor/src/domain/combat/`
- Proposed: `games/wave-survivor/src/domain/projectiles/`
- Proposed: `games/wave-survivor/src/domain/collision/`
- Existing application runtime and renderer.
- Minimal demo controls/status.

## Work items

| ID          | Task                                        | Planned behavior                                                                                                      | Acceptance criteria                                                                                |
| ----------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **WS-4.1**  | Define the basic attack.                    | Add cooldown, target eligibility, projectile speed, damage, radius, and lifetime.                                     | Values are game configuration, not design motion tokens.                                           |
| **WS-4.2**  | Implement nearest-active-enemy targeting.   | Select the closest valid active enemy.                                                                                | Fully offscreen entering enemies are ignored.                                                      |
| **WS-4.3**  | Implement attack cooldown.                  | Advance from simulation time and emit a projectile when ready and a target exists.                                    | Pause freezes the cooldown; restart resets it.                                                     |
| **WS-4.4**  | Implement projectile state and movement.    | Move projectiles with fixed delta and remove them after lifetime or despawn bounds.                                   | Movement is deterministic and does not allocate unnecessary per-frame objects.                     |
| **WS-4.5**  | Implement circle collision helpers.         | Support player-enemy and projectile-enemy overlap.                                                                    | Collision functions are pure and independent from renderer shapes.                                 |
| **WS-4.6**  | Apply projectile damage once.               | Resolve a hit, reduce health, and retire or mark the projectile.                                                      | One projectile cannot repeatedly damage the same enemy across updates.                             |
| **WS-4.7**  | Implement enemy defeat.                     | Remove combat participation, increment kill count, and optionally enter a brief dying effect state.                   | Defeated enemies cannot collide, target, or score twice.                                           |
| **WS-4.8**  | Implement player health and contact damage. | Active enemies deal configured damage on overlap.                                                                     | Entering enemies and dying enemies cannot damage the player.                                       |
| **WS-4.9**  | Implement post-hit invulnerability.         | Prevent repeated damage for an initial tunable `0.5–0.8` second interval.                                             | Overlapping enemies do not remove all health in consecutive fixed steps.                           |
| **WS-4.10** | Implement loss transition.                  | Health reaching zero changes phase to lost, clears input, and stops simulation progression.                           | Renderer and UI clearly communicate loss.                                                          |
| **WS-4.11** | Implement complete restart reset.           | Recreate initial run state and clear all transient entities and timers.                                               | A second and third run begin identically to the first without recreating the page.                 |
| **WS-4.12** | Add minimal status UI.                      | Show health, kill count or temporary score, loss, and restart.                                                        | UI is sufficient for testing but does not become final portfolio architecture.                     |
| **WS-4.13** | Conduct Gate 1 tuning.                      | Adjust player speed, enemy speed, enemy health, attack cooldown, spawn interval, contact damage, and invulnerability. | Moving, avoiding, hitting, dying, and restarting are worth repeating for approximately one minute. |

## Testing strategy

### Domain/unit

- Target ignores entering and dying enemies.
- Nearest target selection.
- Cooldown readiness and reset.
- Projectile movement and expiration.
- Circle collision edge cases.
- Damage once per projectile.
- Invulnerability timing.
- Health-to-lost transition.

### Application/lifecycle

- Loss stops updates.
- Restart clears enemies, projectiles, effects, cooldowns, immunity, input, and score.
- Repeated restart does not add loops or listeners.
- Destroy from lost state releases all resources.

### Manual Gate 1 review

Evaluate:

- Is movement precise and comfortable?
- Are enemy entries readable?
- Is the automatic attack understandable?
- Are hits and damage legible with geometric graphics?
- Is death perceived as fair?
- Does immediate restart feel reliable?
- Is the toy enjoyable without upgrades, lore, art, or audio?

Recorded evidence from 2026-08-30:

- PC manual Gate 1 review: PASS.
- Real-smartphone manual Gate 1 review: PASS.
- Movement, enemy entry, automatic combat, damage, invulnerability, loss, and
  restart were understandable and functional on both input families.
- Repeated restart and lifecycle checks passed without a reported surviving
  loop, listener, observer, entity, or timer.
- The full package and workspace validation suite passed.

## Gate 1 decision

Proceed only when all conditions are met:

- The grey-box toy supports approximately one minute of replayable interaction.
- Restart produces a clean run every time.
- Core feel problems can be solved by tuning current systems rather than adding features.
- No architecture leak or lifecycle defect remains known in the core loop.

If the gate fails, revise EPICs 1–4. Do not continue to waves or upgrades as a workaround.

### Accepted Gate 1 result — 2026-08-30

**Decision:** PASS. EPIC 4 and Gate 1 are complete; EPIC 5 is unblocked.

Accepted centralized tuning values:

| Relationship    | Accepted values                                                               |
| --------------- | ----------------------------------------------------------------------------- |
| Movement        | Player speed `120`; enemy speed `72`; player and enemy collision radii `12`   |
| Arena pressure  | First spawn `0.5s`; spawn interval `0.75s`; maximum live enemies `4`          |
| Entry fairness  | Entry lead `0.75s`; minimum contact time `1.25s`; maximum spawn attempts `12` |
| Kill rate       | Attack cooldown `1.5s`; enemy health `1`; projectile damage `1`               |
| Punishment      | Player health `3`; contact damage `1`; post-hit invulnerability `0.65s`       |
| Readability     | Projectile speed `320`; radius `4`; lifetime `2.5s`; dying duration `0.125s`  |
| Cleanup margins | Projectile despawn margin `32`; enemy extra despawn margin `64` logical units |

---

# EPIC 5 — Finite waves, upgrade choice, and phase flow

**Status:** Implementation complete. Dimi reported PC/smartphone gameplay and
standalone upgrade-flow checks PASS (recorded 2026-09-04). The follow-up review
fixes below have automated coverage; renewed real-device review of those fixes
and final sign-off remain pending. Gate 2 has not passed.

## Goal

Transform the approved grey-box toy into the central survivor loop: clear a finite wave, pause, select one upgrade, and begin a harder wave.

## System value

This epic connects the pressure and power feedback loops while preserving a small, deterministic state model.

## Dependencies

Gate 1 approval.

## In scope

- Typed wave definitions.
- Finite spawn scheduling.
- Active-enemy cap.
- Wave-completion detection.
- Wave-cleared and choosing-upgrade phases.
- Initial upgrade definitions.
- Deterministic choice generation.
- Upgrade application.
- Public event and upgrade-selection contract.
- Standalone demo support.

## Out of scope

- Boss.
- Final run length.
- Permanent progression.
- Rarity tiers, currencies, equipment, or inventory.
- Full content roster.

## Suggested implementation areas

- Proposed: `games/wave-survivor/src/domain/waves/`
- Proposed: `games/wave-survivor/src/domain/upgrades/`
- Existing application controller and public API.
- Existing demo plus minimal DOM upgrade interface.
- Existing frontend game host types only as required by public contract changes.

## Work items

| ID          | Task                                      | Planned behavior                                                                                          | Acceptance criteria                                                                                    |
| ----------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **WS-5.1**  | Define `SpawnGroup` and `WaveDefinition`. | Represent finite groups, offsets, intervals, enemy IDs, patterns, and active cap.                         | Definitions are validated or constructed so invalid counts and timing cannot silently enter runtime.   |
| **WS-5.2**  | Implement the wave scheduler.             | Release groups according to simulation time and configured intervals.                                     | Pause and upgrade phases freeze the schedule.                                                          |
| **WS-5.3**  | Enforce maximum active enemies.           | Delay queued spawns while entering plus active count reaches the wave cap.                                | Backlog resumes predictably without releasing an uncontrolled burst.                                   |
| **WS-5.4**  | Detect wave completion.                   | Complete only when queue is empty and no entering or active enemies remain.                               | Dying visual effects do not indefinitely block completion unless explicitly intended.                  |
| **WS-5.5**  | Extend the phase state machine.           | Support playing → wave-cleared → choosing-upgrade → playing.                                              | Invalid transitions are ignored or rejected deterministically.                                         |
| **WS-5.6**  | Define the first upgrade set.             | Start with three upgrades: `+10%` fire rate, `+10%` base movement speed, and `+1` maximum/current health. | Upgrades modify existing systems; no new economy or inventory layer is created.                        |
| **WS-5.7**  | Generate upgrade options.                 | Produce a small non-duplicate set from eligible definitions using seeded randomness.                      | Same seed and run state produce the same options.                                                      |
| **WS-5.8**  | Apply the selected upgrade.               | Update explicit run modifiers and reject invalid IDs or repeated selections when disallowed.              | Effect is observable in the next wave and isolated to intended stats.                                  |
| **WS-5.9**  | Extend public events.                     | Emit wave changes, upgrade request, health changes if required, and relevant phase changes.               | Events contain host-facing data only, not mutable internal state.                                      |
| **WS-5.10** | Extend `GameController`.                  | Add the smallest operation required, expected to be `chooseUpgrade(id)`.                                  | Existing lifecycle remains compatible and idempotent.                                                  |
| **WS-5.11** | Add standalone upgrade UI.                | Render accessible DOM buttons from emitted upgrade options.                                               | Standalone and portfolio integrations use the same public contract.                                    |
| **WS-5.12** | Clean transition artifacts.               | Clear completed-wave projectiles and dying states, reset input, and freeze the clean choice state.        | No enemy, projectile, cooldown, spawn timer, gameplay clock, or random stream advances while choosing. |

### Delivered transition policy

Wave completion clears projectiles and remaining dying presentation states,
then resets keyboard, joystick, and runtime movement intention through the
existing input lifecycle. The choice phase preserves player and run progress
but performs no fixed simulation work. Rendering and lifecycle no-ops do not
advance time, schedules, cooldowns, entities, health, or either seeded random
stream. A valid pending upgrade selection alone initializes the next wave and
restarts the existing loop.

### EPIC 5 review hardening — 2026-09-04

- Exhausting all three five-level upgrades intentionally stops at
  `wave-cleared` after Wave 16. The session publishes that status without an
  empty upgrade request; the demo announces “All upgrades maxed” and offers
  the existing Restart command. The application regression defeats the last
  enemy with capped upgrades and verifies cleanup, frozen state, zero random
  consumption, and fresh-run recovery. Controller coverage verifies loop
  suspension and exactly one frame after restart.
- Following mobile feedback, the demo choice panel overlays the game using
  absolute positioning, with a fixed overlay on short screens. Its width is
  independent of the portrait Canvas and content uses start alignment.
  Browser regressions verify unchanged Canvas/status geometry and page scroll
  across opening, scrolling, and selection in normal/short portrait, landscape,
  and at 200% text size. The heading and every full option remain reachable;
  keyboard selection and restart focus are covered.
  These are actual demo DOM tests with public-contract fixtures, not a
  sixteen-wave gameplay replay.
- Hosted type compatibility is delivered. The current React `GameHost`
  still lacks upgrade controls and cannot complete the flow by itself;
  the playable standalone demo and the deferred EPIC 7 portfolio shell are
  distinct deliverables.

Validation: 52 focused application tests, all 682 package tests, all 1,017
workspace tests, and five Chromium demo regressions passed. Package/frontend
type checks, package/demo production builds, workspace lint, and the full
portfolio production build passed. The earlier user-reported PC/smartphone
PASS is retained as human evidence; automated layout checks do not constitute
renewed real-device acceptance.

## Testing strategy

### Domain/unit

- Wave schedule timing.
- Active-cap behavior.
- Completion condition.
- Valid and invalid phase transitions.
- Deterministic, non-duplicate upgrade choices.
- Upgrade modifier application and caps.

### Application/integration

- Wave events.
- Upgrade-request event payload.
- Invalid upgrade ID behavior.
- No simulation advancement during upgrade selection.
- Next wave begins only after valid selection.

### Manual

- Complete several waves with different upgrade choices.
- Confirm power increase is noticeable but movement remains necessary.
- Confirm no hidden enemy or projectile damages the player while choosing.
- Confirm the standalone demo can complete the flow without React.

## Epic exit criteria

- A finite wave can be cleared.
- Gameplay pauses for one explicit upgrade choice.
- The selected upgrade affects later combat.
- Pressure increases between waves.
- Standalone and hosted consumers share the same API.

---

# EPIC 6 — Boss, scoring, complete run, and Gate 2

**Status:** WS-6.1 finite candidate and WS-6.6 pure score candidate implemented
with automated regressions (2026-09-05). Dimi's structure/pacing and scoring
reward approvals remain pending. WS-6.7 record construction and public type are
implemented and integrated by WS-6.5. WS-6.2 active charger behavior is implemented with deterministic
combat fixtures; WS-6.3 production entry and WS-6.4 static action telegraphs are
implemented. Dimi reports WS-6.4 manual checks PASS. WS-6.5 terminal completion
is implemented. WS-6.8 delivers the completion event and standalone Start/result/Replay
flow; Dimi reports WS-6.8 manual checks PASS. WS-6.9 replay hardening and
deterministic equivalence checks are implemented. Repeated replay on real devices,
full-run tuning and Gate 2 remain pending.

## Goal

Create a complete finite game with a beginning, escalating middle, final boss or final wave, explicit victory, explicit defeat, score, and immediate replay.

## System value

Gate 2 establishes that the project is already a finished small game before portfolio polish or content expansion begins.

## Dependencies

EPIC 5.

## In scope

- Measured run structure.
- One boss.
- Boss entry and action telegraphs.
- Victory transition.
- Final score model.
- Result data and public event.
- Immediate replay.
- Complete-run balancing.

## Out of scope

- Final art and sound.
- Multiple bosses.
- Online scoring.
- Permanent progression.
- Additional game modes.
- Full normal-enemy roster unless required for the minimal complete run.

## Suggested implementation areas

- Proposed: `games/wave-survivor/src/domain/boss/`
- Existing waves, enemies, combat, score, application phase handling.
- Public result event and demo result UI.

## Work items

| ID          | Task                                      | Planned behavior                                                                                                            | Acceptance criteria                                                                                                       |
| ----------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **WS-6.1**  | Resolve the minimal run structure.        | Implemented provisional four normal waves + boss, finite lookup/successors, wave validation, and upgrade-capacity safety.   | Configuration and pacing evidence recorded; Dimi's PC/phone pacing and candidate approval pending.                        |
| **WS-6.2**  | Define one boss.                          | Implemented provisional charger cycle with locked aim, bounded charge, recovery, and existing combat.                       | Active Domain/session fixtures pass; entry/telegraphs integrated by WS-6.3/6.4; Dimi's movement-challenge review pending. |
| **WS-6.3**  | Implement boss entry.                     | Implemented single top-center boss after fourth upgrade; repeat bridge removed, static warning and host announcement added. | Automated handoff, escape, eligibility, cleanup, and lifecycle checks; Dimi's PC/phone fairness review pending.           |
| **WS-6.4**  | Implement boss action telegraphing.       | Implemented static action cues, shared charge geometry and swept contact.                                                   | Automated checks pass; Dimi reports all task manual checks PASS (2026-09-05).                                             |
| **WS-6.5**  | Implement victory.                        | Confirmed final-boss defeat commits won through shared win/loss finalization with frozen score/result.                      | Terminal suspension and callback safety tested; Dimi's visible-end check pending. Result publication is WS-6.8.           |
| **WS-6.6**  | Define score calculation.                 | Implemented pure 10/100/500/100 candidate; WS-6.5 integrates authoritative terminal inputs.                                 | Numeric safety and integrated win/loss scores tested; final reward approval pending.                                      |
| **WS-6.7**  | Define `RunResult`.                       | Implemented validated/frozen public record, committed by WS-6.5 and published by WS-6.8.                                    | Value/immutability/public compatibility tests pass; Dimi's result-information review pending.                             |
| **WS-6.8**  | Implement result event and UI.            | One guarded frozen completion event; deliberate Start, semantic result fields and Replay in the standalone demo.            | Automated checks pass; Dimi reports task manual checks PASS (2026-09-05).                                                 |
| **WS-6.9**  | Implement immediate replay.               | Existing fresh-state replay extended for callback, held-key and hidden-page safety.                                         | Fresh/replay state and output equivalence tested; repeated PC/phone replay confirmation pending.                          |
| **WS-6.10** | Balance the full run.                     | Tune enemy speed, health, spawn timing, attack cooldown, upgrade strength, and upgrade frequency.                           | Player power grows, but movement remains important through the boss.                                                      |
| **WS-6.11** | Add deterministic full-run test fixtures. | Use controlled seed and time to cover win and loss paths where practical.                                                   | Critical transitions do not depend on flaky real-time tests.                                                              |

### WS-6.9 implementation and dependent acceptance

Replay retains the controller, Canvas, renderer/theme, adapters and one loop.
The authoritative initial-state factory already resets all gameplay state, and
both streams already reset under the unchanged seed policy. Added focused guards
for nested restart notifications, callback pause, held-key repeat and hidden demo
activation. Hidden Start/Replay immediately pauses and defers focus until visible.
No Domain/public contract, seed, dependency, token, or result schema changes.

New deterministic fixtures compare full state and event/status/render traces
through four upgrades and the boss cycle for fresh wins/losses and three replays.
They use injected normal-enemy defeats and invulnerability, not human fight
measurements. Boss entry/all actions reset; old results remain frozen. Existing
and extended tests cover paused/upgrade/terminal replay, stale frames, repeated
activation, callbacks, keys, pointer cancellation and resource reuse/teardown.
See [replay rules and evidence](./wave-survivor.md#157-ws-69-immediate-replay).

Executed WS-6.9 validation (2026-09-05):

- `pnpm --filter @funkspace/wave-survivor typecheck` and
  `pnpm --filter @funkspace/wave-survivor exec tsc -p /private/tmp/ws63-tests.tsconfig.json`:
  package and strict source/test types pass (temporary config extends the package
  config and includes tests).
- `pnpm --filter @funkspace/wave-survivor test`: **892 tests / 57 files** pass.
  Focused replay/controller/input run: **66 tests / 3 files** pass. Coverage
  includes existing observer/theme/Canvas reuse and stale-accumulator tests.
- `pnpm --filter @funkspace/wave-survivor demo:build`: package TypeScript and
  standalone Vite production builds pass.
- `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config playwright.demo.config.ts`:
  **18 browser tests** pass, including the final hidden-return focus checks.
  Actual-runtime hidden Start/replay and teardown are separate from mocked
  alternating result events, which verify DOM cleanup only.
- Scoped `pnpm exec eslint --config frontend/eslint.config.mjs` with
  `--max-warnings=0` passes for every changed executable file. `pnpm lint`
  checks frontend ESLint and repository formatting; the corrected final run
  passes. `git diff --check` passes after scope/lifecycle/dead-code review.
- Public contracts are unchanged; frontend types/host tests are not rerun for
  this task. No portfolio behavior changes.

The first repository lint run passed frontend ESLint but failed Prettier on the
new session guard's line wrapping; formatting was corrected before the final run.
Existing Next-lint deprecation, root React/pages discovery and Playwright color
environment notices remain non-failing. No commits, deployment or settings changes.

**Pending with Dimi:** repeat at least three replays on PC and smartphone,
including win and loss; verify fresh gameplay state, one result and usable
Replay/focus/joystick. Interrupt held keyboard/touch input, release/cancel, replay,
and check neutral movement. Switch tabs/apps around Replay and check no hidden
progress or time jump. No new real-device confirmation or Gate 2 approval is
inferred from automated fixtures or the prior WS-6.8 PASS.

### WS-6.8 implementation and dependent acceptance

Implemented one frozen `run-finished` event per completed win/loss, carrying the
already committed frozen result. A per-run guard is set before host callbacks.
Order is commit → reset input → completion event → terminal status. If the event
callback restarts/destroys, old terminal status is suppressed; existing loop
generation checks prevent obsolete frames. Abandoned runs publish nothing and
restart resets the guard. The frontend loader aliases the package event type;
the portfolio consumer explicitly ignores completion pending EPIC 7 UI.

The standalone demo starts idle with brief controls/auto-fire instructions and a
native Start button. It explicitly handles all event variants, displays supplied
outcome/score/wave/time in semantic DOM, and uses existing restart for Replay.
Outcome focus, a polite summary, stale-panel cleanup, keyboard/touch activation,
and scrolling full-viewport panels on short screens are implemented. No UI clock,
score calculation, result schema, framework, dependency, or effects system is added.
See [contract and evidence](./wave-survivor.md#156-ws-68-result-publication-and-standalone-flow).

Executed WS-6.8 validation (2026-09-05), final checks all exit 0:

- `pnpm --filter @funkspace/wave-survivor typecheck`.
- `pnpm --filter @funkspace/wave-survivor test`: **879 tests / 56 files**,
  including seven additional completion/publication/controller cases. These use
  the actual runtime, score/result factory, and loop with deterministic fixtures.
- `pnpm --filter @funkspace/wave-survivor exec tsc -p /private/tmp/ws63-tests.tsconfig.json`:
  strict source/test checking via the existing temporary config that extends the
  package tsconfig and clears test exclusions.
- `pnpm --filter @funkspace/wave-survivor demo:build`: package TypeScript build
  and standalone Vite production build pass.
- `pnpm -F frontend exec tsc --noEmit` and
  `pnpm exec vitest run frontend/features/games/GameHost.test.tsx frontend/features/games/GameLoader.test.ts`:
  types pass; **6 tests / 2 files** pass, including exact event/result type
  compatibility and explicit portfolio handling without result UI.
- `pnpm lint`: frontend lint and repository-wide Prettier pass. Scoped ESLint
  with `frontend/eslint.config.mjs` and `--max-warnings=0` also passes on the four
  changed game TypeScript files, demo `main.js`, and the demo browser spec.
- `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config playwright.demo.config.ts`:
  **16 browser tests** pass. Actual runtime idle/keyboard Start and visibility
  gating are separate from mocked win/loss result delivery. UI cases cover
  supplied fields/time formatting, keyboard/touch Start/Replay, focus, hidden
  upgrades/results, short portrait/landscape, enlarged text, and existing themes.
- `git diff --check` passes. Reviewed scope, type ownership, callback ordering,
  stale notifications, listener teardown, and absence of duplicate clocks/scores.

The first browser attempt had **8 passes / 8 failures**: the new UI fixture used
a plain DOM Event instead of a CustomEvent carrying result data, and a reused
local server stopped before the last checks. The fixture now dispatches typed
CustomEvent data; reruns used a Playwright-owned server and passed all 16 tests.
Screenshot review then prompted full-viewport short-screen panels to eliminate
background text peeking around enlarged content; the final 16-test rerun passes.
Inspected final Start/result screenshots in portrait, landscape and enlarged text.
They are browser UI evidence, not newcomer or real-device acceptance.

Existing Next-lint deprecation, root ESLint React/pages discovery notices, and
Playwright color-environment notices remain non-failing. No generated tokens,
dependencies, commits, deployments, or repository settings were changed.

**Manual update — 2026-09-05:** Dimi reports WS-6.8 manual checks PASS: newcomer
can start, understand the outcome and find Replay without coaching. No device
models or timing measurements were supplied. Runtime event tests and UI-only
mocked event tests remain separate evidence. WS-6.9 adds replay automation above;
new repeated-replay device confirmation, final tuning and Gate 2 remain pending.

### WS-6.5 implementation and dependent acceptance (historical baseline before WS-6.8)

Implemented `won` and one shared win/loss finalizer. It commits one frozen result
with final score, progress and overall simulation time before input reset and
status callbacks. Normal clears come from finite progression, not a new counter.
Only a confirmed valid final-charger defeat can win; empty/invalid/escaped or
already-dying boss states do not. Projectile-before-contact ordering remains;
a surviving enemy's lethal contact takes loss precedence over a boss kill.

Terminal runs reject updates, choices and start/resume. The existing loop renders
once then suspends. Its generation guard now prevents callback-driven restart or
destroy from continuing the old frame. Restart clears new per-run result state;
retained results remain immutable. Existing Canvas/DOM terminal feedback and the
demo restart control now support won. No result event or result-field UI is added.
See [terminal rules](./wave-survivor.md#1010-ws-65-terminal-completion).

Executed WS-6.5 validation (2026-09-05), all exit 0:

- `pnpm --filter @funkspace/wave-survivor typecheck`.
- `pnpm --filter @funkspace/wave-survivor test`: **872 tests / 56 files**,
  including 19 added completion/controller/loop/renderer cases.
- `pnpm --filter @funkspace/wave-survivor exec tsc -p /private/tmp/ws63-tests.tsconfig.json`:
  strict checking also includes all test files via the existing temporary config
  that extends the game tsconfig and clears its test exclusions.
- `pnpm --filter @funkspace/wave-survivor demo:build`: package TypeScript and
  standalone Vite production builds pass.
- `pnpm lint`: frontend lint and repository-wide formatting pass. Scoped ESLint
  with `frontend/eslint.config.mjs` on all 8 changed game TypeScript files,
  `games/wave-survivor/demo/main.js` and `e2e/wave-survivor/demo.spec.ts`, with
  `--max-warnings=0`, also passes.
- `pnpm -F frontend exec tsc --noEmit` passes. The frontend's imported
  `RuntimePhase` already includes won without a duplicate phase declaration.
- `pnpm exec vitest run frontend/features/games/GameHost.test.tsx frontend/features/games/GameLoader.test.ts`:
  **6 tests / 2 files** pass.
- `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config playwright.demo.config.ts`:
  **13 browser tests** pass, including won announcement/restart under reduced
  motion and existing action-theme, entry and mobile upgrade checks. The terminal
  DOM fixture exercises host compatibility; real boss combat/loop termination
  is covered by application fixtures, not claimed as a browser playtest.
- `git diff --check` passes. Diff review found no duplicate scoring authority,
  new resource lifetime, dependency, generated-token change, or result event.

Existing Next-lint deprecation, root ESLint React/pages discovery, and Playwright
color-environment notices remain non-failing. No human victory judgment or
run-finished publication acceptance is inferred from automated checks.

**Pending with Dimi:** confirm boss defeat visibly ends gameplay. WS-6.8 owns
result publication/UI and exactly-once event acceptance; WS-6.9 owns comprehensive
replay verification. Final tuning and Gate 2 remain pending.

### WS-6.4 implementation and dependent acceptance (completed before WS-6.5)

**Manual update — 2026-09-05:** Dimi reports all WS-6.4 manual tests PASS, including
smartphone anticipation/avoidance, recovery readability across themes/simplified
effects and thumb/joystick occlusion. The pending list below is the historical
handoff now satisfied for this task. No measured durations or device details were
provided. This does not constitute WS-6.5 acceptance or Gate 2 approval.

The active boss snapshot now contains copied/frozen Domain action timing and,
during wind-up/charge, a bounded physical charge path. Movement and warning use
the same wall-stop calculation and locked direction. Static labels, a wind-up
ring, corridor/arrow, heavier charge outline, and recovery bars/countdown work
without effects or color discrimination. Existing semantic theme roles suffice;
there are no public-contract changes or new events. Pause freezes all warning
information; resize/theme changes affect presentation only.

The capsule represents the 48-unit-wide boss body sweep. The player center needs
more than its 12-unit radius beyond the outline; all active phases still cause
contact damage. A focused relative swept-circle calculation uses actual boss
movement segments, split at deadlines and wall stops, to catch grazing contact
that `1/60s` endpoint sampling can miss. It reuses the shared contact resolver
after projectile defeats; normal contact behavior is unchanged. No motion trace
or contact counter persists between updates.

See [WS-6.4 geometry and evidence](./wave-survivor.md#109-ws-64-static-action-telegraphs)
for field ownership, exact clearance example, unchanged scripted fight results,
and presentation meanings.

Executed WS-6.4 validation (2026-09-05), all exit 0:

- `pnpm --filter @funkspace/wave-survivor typecheck`.
- `pnpm --filter @funkspace/wave-survivor test`: **853 tests / 55 files**,
  including 22 new telegraph/sweep/session/renderer assertions. The first
  affected run passed 89 tests / 6 files before the full suite.
- `pnpm --filter @funkspace/wave-survivor exec tsc -p /private/tmp/ws63-tests.tsconfig.json`:
  supplementary strict checking of all game source and test files; the temporary
  config extends the game tsconfig, includes `src/**/*.ts`, and clears its test
  exclusions. No repository compiler configuration was changed.
- `pnpm --filter @funkspace/wave-survivor demo:build`: package TypeScript build
  and Vite demo production build both pass.
- `pnpm lint`: frontend lint and repository-wide Prettier pass. Scoped ESLint
  using `frontend/eslint.config.mjs` on the 10 changed game TypeScript files and
  `e2e/wave-survivor/demo.spec.ts`, with `--max-warnings=0`, also passes.
- `pnpm -F frontend exec tsc --noEmit`; `pnpm exec vitest run frontend/features/games/GameHost.test.tsx frontend/features/games/GameLoader.test.ts`:
  frontend types pass, **6 tests / 2 files** pass.
- `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config playwright.demo.config.ts`:
  **12 tests** pass. Four actual Canvas action frames are distinct in each of
  default, dark, muted, dark-high-contrast, and monochrome themes under reduced
  motion at a 390×844 browser viewport; existing entry/upgrade/focus checks pass.
- `git diff --check`: clean.

Visual inspection of browser screenshots confirms visible wind-up text, arrow,
and corridor in all five palettes, plus distinguishable approach/charge/recovery
in monochrome. These are static renderer fixtures with no gameplay loop, not
real-phone playtests. Screenshots are local ignored test artifacts. Existing
Next-lint deprecation, root ESLint React/pages discovery notices, and Playwright
color-environment notices do not fail these checks.

**Pending with Dimi:** real-phone anticipation and avoidance, readable recovery
across supported themes and simplified effects, thumb/joystick occlusion, and
PC/corner readability. Automated fixtures and browser screenshots are not human
fairness approval. WS-6.5 terminal handling, WS-6.10 tuning, and Gate 2 remain
pending. No victory flow or extra boss behavior was added.

### WS-6.3 implementation and dependent acceptance (historical baseline before WS-6.4)

The final valid normal upgrade now resolves one real boss through the existing
finite run model. The production repeat function is removed. A null normal
schedule denotes the final boss; the encounter number is derived, not stored
in a duplicate progression counter. Boss entry creates one enemy body, clears
completed-wave entities/projectiles, and preserves earned progress and overall
simulation time. No normal spawn, normal completion, or upgrade follows it.

The [entry contract](./wave-survivor.md#108-ws-63-deliberate-boss-entry) records
the provisional fixed top-center approach, 1.5s warning before visibility, 2.5s
until full-body activation, combat eligibility, and derived cleanup bounds.
Movement remains available and pause freezes entry. Renderer snapshots add
only a boss-entry marker for static double-chevron/text information. Existing
semantic colors are reused, without relying on color or animated motion alone.

The concrete accessible host announcement uses an optional `encounterKind`
field on `wave-started`, not a new event variant. Demo and portfolio consumers
handle the boss marker explicitly. Normal events remain compatible. Normal-only
test fixtures now assert a present schedule; final-encounter tests assert null.
The former Wave 16 exhaustion test is an explicitly artificial normal-wave
defensive fixture, not a reachable finite-run endpoint.

Tests cover the fourth-upgrade handoff, one spawn, preserved health/upgrades/time,
nine starting positions with a 1.5s reaction delay, entry visibility/contact,
cleanup, pause/resume, restart/destroy, and no successor or inferred victory.
The boss can be fought, but its defeat leaves gameplay running until WS-6.5
implements terminal handling. WS-6.4 still owns visible action telegraphs.
Dimi's PC/phone warning visibility and escape-fairness review, including
thumb/joystick occlusion, remains pending; Gate 2 is not approved.

Executed WS-6.3 validation (2026-09-05):

- `pnpm --filter @funkspace/wave-survivor typecheck` — passed.
- `pnpm --filter @funkspace/wave-survivor exec tsc -p /private/tmp/ws63-tests.tsconfig.json` — passed; temporary configuration extends strict package settings and includes all package tests, checking every nullable-schedule fixture.
- Focused entry/handoff checks — 28 tests passed across `GameRuntimeSessionBossEntry`, `GameRuntimeSessionRun`, and `GameRuntimeSessionUpgrade`.
- `pnpm --filter @funkspace/wave-survivor test` — 53 files, 831 tests passed. The initial run exposed two obsolete repeat-wave assertions; these now assert a single boss and no successor.
- `pnpm --filter @funkspace/wave-survivor demo:build` — package and standalone production builds passed.
- `pnpm -F frontend exec tsc --noEmit` — passed.
- `pnpm exec vitest run frontend/features/games/GameHost.test.tsx frontend/features/games/GameLoader.test.ts` — 2 files, 6 tests passed.
- `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config playwright.demo.config.ts` — 7 browser tests passed, including boss announcement/focus, actual Canvas warning rendering, portrait/short/landscape/enlarged-text upgrade layout, and defensive exhaustion restart.
- Visual inspection of the actual renderer's monochrome reduced-motion browser fixture — readable entry text and visible player at the top edge. This is not real-device or gameplay acceptance.
- `pnpm lint` and direct ESLint using `frontend/eslint.config.mjs` with `--max-warnings=0` over affected game TypeScript and browser-test files — passed; existing Next lint deprecation and React/pages discovery notices remain.
- `git diff --check` and scope review — passed. No second progression counter, loop, timing source, generated-source edit, or result event/UI. Existing normal-wave fixtures use non-null assertions only where a normal schedule is part of their setup.

No live PC/phone playtest was performed. Dimi owns warning/escape acceptance,
thumb/joystick occlusion review, and Gate 2 approval. Action telegraphs and
terminal results remain dependent work rather than approved behavior.

### WS-6.2 implementation and dependent acceptance (historical baseline before WS-6.3)

One `charger` kind adds action state to the existing enemy body, preserving its
lifecycle, position, health, contact damage, and defeat authority. The session
dispatches its active movement through the existing fixed update and gameplay
clock. Normal pursuit/spawn behavior, combat pipeline, public API, and renderer
contracts are unchanged. There is no generic behavior registry or second engine.

The [charger candidate](./wave-survivor.md#107-ws-62-charger-candidate) records
health, geometry, speeds, exact action timing, direction fallback, boundary
recovery, and three upgrade-build diagnostics. Active scripted fights take
30.82s / 43.13s / 46.00s for Rapid Fire / Swift Movement / Vitality ×4. Ideal
all-hit spans are estimates, separately labeled. No human fight duration or
fairness approval is inferred from fixtures; the route takes no damage.

WS-6.3 owns production entry, replacing the repeat bridge and establishing the
real finite boss handoff. WS-6.4 owns visible action telegraphs; WS-6.5 owns
terminal boss defeat rather than treating it as a normal-wave upgrade boundary.
Fixtures inject an active boss and a far-future normal queue to isolate combat;
they do not implement boss entry or claim a complete win flow. After entry and
telegraphs exist, Dimi evaluates whether positioning matters rather than merely
shooting a large health pool. Final balance belongs to WS-6.10; human PC/phone
acceptance and Gate 2 remain pending.

Executed WS-6.2 validation (2026-09-05):

- `pnpm --filter @funkspace/wave-survivor typecheck` — passed.
- `pnpm --filter @funkspace/wave-survivor exec tsc -p /private/tmp/ws62-tests.tsconfig.json` — passed; temporary configuration extends strict package settings and includes enemy and session test files normally excluded from production compilation.
- `pnpm --filter @funkspace/wave-survivor test src/domain/enemies/ChargerBoss.test.ts src/application/GameRuntimeSessionBoss.test.ts` — 34 tests passed, covering action boundaries, aim lock, zero aim, wall recovery, pause in every action, shared damage/immunity, automatic projectile hits, and exactly-once defeat.
- `pnpm --filter @funkspace/wave-survivor test` — 52 files, 816 tests passed, including normal-enemy and earlier finite-run/scoring/result regressions plus the three scripted fight diagnostics.
- `pnpm --filter @funkspace/wave-survivor demo:build` — package TypeScript build and standalone Vite production build passed.
- `pnpm lint` — passed, including repository formatting; existing Next lint deprecation notice remains.
- `pnpm exec eslint --config frontend/eslint.config.mjs games/wave-survivor/src/domain/enemies/EnemyDefinition.ts games/wave-survivor/src/domain/enemies/EnemyState.ts games/wave-survivor/src/domain/enemies/ChargerBoss.ts games/wave-survivor/src/domain/enemies/ChargerBoss.test.ts games/wave-survivor/src/application/GameRuntimeSession.ts games/wave-survivor/src/application/GameRuntimeSessionBoss.test.ts --max-warnings=0` — exit 0; existing React/pages discovery notices remain.
- `git diff --check` and scope review — passed. No new lifecycle resources, dependencies, duplicated combat pipeline, public-contract changes, generated source edits, or unrelated tuning.

Frontend type/host checks were not rerun because public contracts did not
change. Manual boss gameplay is pending production entry and visible telegraphs;
no PC/phone measurement or approval is claimed by this task.

### WS-6.7 implementation and dependent acceptance

The pure Domain `RunResult` and internal `createRunResult()` own the completion
record boundary. Only the type is exported from the package root; the frontend
loader re-exports it without a duplicate schema. The [completion record contract](./wave-survivor.md#155-ws-67-completion-record)
documents all fields, validation, primitive copying, and runtime freezing.
No result event, UI, scoring change, or session counter is added.

Encounter reached is the highest encounter entered, one-based, including the
boss at position 5 in the current candidate. It is not the number of normal
waves cleared. The application must supply the existing overall simulation
clock, including boss entry/wind-up and capacity waiting, excluding idle,
pauses, upgrade selection, and terminal time. The per-wave capacity-paused
schedule clock cannot provide run duration.

Tests cover win/loss records, scoring/finite encounter fixtures, numeric
invariants, input mutation isolation, runtime immutability, and exact package
and frontend type compatibility. These fixtures do not establish runtime boss
or terminal integration. WS-6.5 owns coherent terminal inputs and result
construction at completion; WS-6.8 owns result delivery/UI; emitted-result
preservation after restart is explicitly deferred to WS-6.5/9. Dimi's review of
the information for a result screen and Gate 2 remain pending.

Executed WS-6.7 validation (2026-09-05):

- `pnpm --filter @funkspace/wave-survivor typecheck` — passed.
- `pnpm --filter @funkspace/wave-survivor test src/domain/result/RunResult.test.ts` — 31 tests passed.
- `pnpm --filter @funkspace/wave-survivor exec tsc -p /private/tmp/ws67-tests.tsconfig.json` — passed; temporary configuration extends the package's strict settings and includes the result test/public-type assertions excluded from production compilation.
- `pnpm --filter @funkspace/wave-survivor test` — 50 files, 782 tests passed.
- `pnpm --filter @funkspace/wave-survivor demo:build` — package TypeScript build and standalone Vite production build passed; built declarations include the public result type.
- `pnpm -F frontend exec tsc --noEmit` — passed, including loader type compatibility.
- `pnpm exec vitest run frontend/features/games/GameLoader.test.ts frontend/features/games/GameHost.test.tsx` — 2 files, 5 tests passed.
- `pnpm lint` — passed, including repository formatting; existing Next lint deprecation notice remains.
- `pnpm exec eslint --config frontend/eslint.config.mjs games/wave-survivor/src/domain/result/RunResult.ts games/wave-survivor/src/domain/result/RunResult.test.ts games/wave-survivor/src/index.ts --max-warnings=0` — exit 0; existing React/pages discovery notices remain.
- `git diff --check` and scope review — passed. No runtime/lifecycle changes, new dependencies, generated source edits, or duplicate result schema.

Manual result-information confirmation remains pending with Dimi. Runtime
restart preservation and boss timing have not been exercised by this task.

### WS-6.6 implementation and dependent acceptance

The internal `domain/score/CalculateScore.ts` contains the smallest readonly
score-input contract, centralized immutable weights, and pure calculation.
No runtime or public API integration is included. The [score candidate](./wave-survivor.md#113-ws-66-score-candidate)
records the exact formula, examples, numeric validity, and ownership of every
input. Dimi's approval of what the formula rewards remains pending; it is not
playtest-approved.
Dimi requested retaining the current candidate values for now on 2026-09-05.

The existing session kill count is authoritative, including the future boss
once defeated; effective maximum health comes from the existing upgrade helper.
Normal-wave completion must come from finite encounter progression, excluding
the boss and waves merely reached. This is a pending WS-6.5 integration duty:
the current runtime lacks a terminal completed-normal-wave input. No duplicate
mutable counters are added here. WS-6.7 constructs results after coherent
terminal inputs are available; elapsed time may be displayed but never affects
the score. The temporary repeat-wave endpoint is not a victory result.

Tests cover zero progress, losses, completed normal waves, one boss kill,
victory/health bonuses, rounding, equal health ratios, upgraded maximum health,
invalid fields, safe-integer overflow, finite health extremes, and repeated
calculation without mutation or accumulation. Boss/victory examples are pure
numeric fixtures, not evidence of runtime boss integration or Gate 2 approval.

Executed WS-6.6 validation (2026-09-05):

- `pnpm --filter @funkspace/wave-survivor typecheck` — passed.
- `pnpm --filter @funkspace/wave-survivor test src/domain/score/CalculateScore.test.ts` — 51 scoring tests passed.
- `pnpm --filter @funkspace/wave-survivor test` — 49 files, 751 tests passed.
- `pnpm --filter @funkspace/wave-survivor exec tsc -p /private/tmp/ws66-tests.tsconfig.json` — passed; temporary configuration extends the package's strict settings and includes the new test file, which the production typecheck excludes.
- `pnpm lint` — passed, including repository formatting. Existing Next lint deprecation notice remains.
- `pnpm exec eslint --config frontend/eslint.config.mjs games/wave-survivor/src/domain/score/CalculateScore.ts games/wave-survivor/src/domain/score/CalculateScore.test.ts --max-warnings=0` — exit 0; existing React/pages discovery notices remain.
- `git diff --check` and scope review — passed. Prior WS-6.1 changes preserved; no new mutable counters, dependencies, lifecycle resources, or cross-layer imports.

Package/demo builds and frontend host/type checks were not rerun for this
isolated arithmetic module: runtime, renderer, and public contracts are unchanged
by WS-6.6. Manual reward approval and Gate 2 remain pending with Dimi; retaining
the candidate values for now is not recorded as playtest acceptance.

### WS-6.1 implementation and dependent acceptance (historical baseline before WS-6.3)

`RunDefinition` is internal Domain configuration: existing normal-wave content
followed by one explicit boss. `getRunEncounter` uses zero-based finite indexes
and throws for invalid lookup; `resolveNextEncounter` requires an upgrade after
every normal wave, including before the boss, and resolves completion without
an upgrade after the boss. Initial state and normal-wave progression consume
this configuration. Nested data is validated and frozen; runs cannot require
more choices than the existing canonical upgrade pool supplies.

Only `createNextWaveScheduleUntilBossIntegration` in the application retains
the production repeat-last-normal-wave behavior. Later displayed wave numbers
are temporary bridge labels, not finite encounter indexes. Existing loop,
clocks, random streams, combat, upgrade application, completion, and exhausted-
pool restart behavior are preserved. No public-contract or renderer change,
boss implementation, victory, or scoring is delivered here.

The [candidate pacing record](./wave-survivor.md#106-ws-61-candidate-pacing-record--2026-09-05)
contains counts, group timing, caps, four upgrade opportunities, boss position,
and provisional clear-time review targets. Dimi's explicit table supersedes
the earlier doubled/restored percentage adjustments: current totals are
`4 / 6 / 8 / 10`, with caps `2 / 3 / 4 / 6`. Wave 3 uses `4 + 4` enemies;
Wave 4 uses `6 + 4`, retaining the existing groups, offsets, intervals, and
Wave 4 cap of 6. The stationary seeded diagnostic clears all four normal waves
in 37.90 simulation seconds, with 28 kills and 2 health remaining. Earlier tuning results
are historical, not human run-duration measurements. PC/phone difficulty
acceptance and the 5–7-minute goal remain pending.

Automated scope includes finite ordering, last-normal successor, invalid
indexes/configuration, immutable configuration, upgrade-budget boundary,
all 81 legal four-choice paths, real seeded wave clears with configured concurrent
caps, and a separate completed-queue transition fixture with four upgrade
requests. The transition fixture verifies the temporary bridge after the
fourth choice, not gameplay pacing, a boss, or victory. Real boss
handoff is pending WS-6.3, victory WS-6.5, full-run balance WS-6.10, and Gate 2
approval remains Dimi's decision.

Current 4/6/8/10 totals and 2/3/4/6 caps validation (2026-09-05):

- `pnpm --filter @funkspace/wave-survivor typecheck` — passed.
- `pnpm --filter @funkspace/wave-survivor test` — 48 files, 700 tests passed, including exact totals/caps and the 37.90s four-wave diagnostic.
- `pnpm --filter @funkspace/wave-survivor build` and `pnpm --filter @funkspace/wave-survivor demo:build` — passed.
- `pnpm lint` and direct ESLint on the six affected game TypeScript files using the existing frontend config with `--max-warnings=0` — passed; existing config-discovery notices remain.
- `git diff --check` and scope review — passed. Existing WS-6.1 work preserved; no public API, renderer, timing, or upgrade changes.

Manual PC/phone acceptance remains pending. No commit, push, merge, deployment,
or repository-setting change was made.

Historical 6/9/12/16-table validation (2026-09-05):

- `pnpm --filter @funkspace/wave-survivor typecheck` — passed.
- `pnpm --filter @funkspace/wave-survivor test` — 48 files, 700 tests passed; exact totals/caps and the seeded Wave 3 loss are covered.
- `pnpm --filter @funkspace/wave-survivor build` and `pnpm --filter @funkspace/wave-survivor demo:build` — passed.
- `pnpm lint` — passed. Direct ESLint on the six affected game TypeScript files using the existing frontend config and `--max-warnings=0` — exit 0, with the same configuration-discovery notices described below.
- `git diff --check` and scope review — passed. Existing WS-6.1 changes preserved; no public API or renderer changes.

These settings were superseded by the latest 4/6/8/10 table above. No commit,
push, merge, deployment, or repository-setting change was made.

Historical 50%-reduction validation, superseded by Dimi's explicit table (2026-09-05):

- `pnpm --filter @funkspace/wave-survivor typecheck` — passed.
- `pnpm --filter @funkspace/wave-survivor test` — 48 files, 700 tests passed, including the restored 37.93s stationary four-wave diagnostic and concurrent-cap checks.
- `pnpm --filter @funkspace/wave-survivor demo:build` — package and standalone demo production builds passed.
- `pnpm lint` — passed, including workspace formatting. Direct ESLint on the six affected game TypeScript files using the existing frontend config and `--max-warnings=0` also passed (same configuration-discovery notices noted below).
- `git diff --check` and scope review — passed; existing WS-6.1 work preserved. No public-contract, renderer, spawn-timing, upgrade, or lifecycle change.

That restored-original tuning was superseded by Dimi's explicit table above.
No commit, push, merge, deployment, or repository-setting change was made.

Historical difficulty-increase validation (2026-09-05):

- `pnpm --filter @funkspace/wave-survivor typecheck` — passed.
- `pnpm --filter @funkspace/wave-survivor test` — 48 files, 700 tests passed.
- `pnpm --filter @funkspace/wave-survivor build` and `pnpm --filter @funkspace/wave-survivor demo:build` — passed.
- `pnpm lint` — passed, including workspace formatting.
- Direct ESLint on the six affected game TypeScript files with the existing frontend config and `--max-warnings=0` — exit 0; same configuration-discovery notices noted below.
- `git diff --check` and scope review — passed. Earlier WS-6.1 work preserved; no public API or renderer changes.

The first tuning test run exposed old enemy-count expectations, a test fixture
coupled to the production count, and floating-point schedule comparison. These
were corrected; at that stage the stationary diagnostic asserted the measured
loss and retained all four transition checks in a separate fixture. Dimi's
subsequent too-difficult feedback superseded that tuning with the reduction above.

Initial WS-6.1 validation before the difficulty increase (2026-09-05):

- `pnpm --filter @funkspace/wave-survivor typecheck` — passed.
- Strict TypeScript check of all five changed/new test files using the package options and a temporary include-only configuration — passed.
- `pnpm --filter @funkspace/wave-survivor test` — 48 files, 699 tests passed.
- `pnpm --filter @funkspace/wave-survivor build` — passed.
- `pnpm --filter @funkspace/wave-survivor demo:build` — package and demo builds passed.
- `pnpm lint` — passed, including workspace formatting. The existing `next lint` deprecation notice remains.
- Direct ESLint on the changed game TypeScript files using `frontend/eslint.config.mjs` and `--max-warnings=0` — exit 0, no rule violations; that shared Next/React config prints root-directory React/pages discovery notices.
- `git diff --check` and scope/architecture review — passed.

The first sandboxed test launch could not write Vite's temporary config cache;
rerunning with authorized repository write access passed. No dependency or
configuration workaround was needed. Public contracts and host files are
unchanged, so frontend type/host-loader checks were not required for this task.
No browser/device gameplay review, full portfolio build, Storybook, or
Lighthouse run was performed; package/demo builds cover the changed runtime
bundle. No commit, push, merge, deployment, or repository-setting change.

## Testing strategy

### Domain/unit

- Finite run ordering, successor rules, validation, and upgrade-capacity safety.
- Boss state and action timing.
- Boss damage and defeat.
- Score formula.
- Won transition.
- Result data.

### Application/integration

- Complete deterministic loss path.
- Complete deterministic win path.
- Result event emitted once.
- Immediate replay.
- Boss cleanup on restart and destroy.

### Manual Gate 2 review

- Can a new player start without developer explanation?
- Does the run escalate clearly?
- Do upgrades create meaningful choices?
- Does the boss test skills learned during normal waves?
- Is the result clear?
- Is replay immediate and reliable?
- Is the run compact enough for a portfolio visitor?

## Gate 2 decision

Proceed only when:

- The game can be won or lost without developer intervention.
- Start-to-result flow is complete.
- The boss concludes the run.
- Replay is reliable.
- Remaining work is polish, accessibility, persistence, performance, or capped content—not missing game structure.

---

# EPIC 7 — Portfolio play shell and accessible application UI

## Goal

Host the complete game in a dedicated, mobile-first portfolio experience with semantic menus, overlays, focus management, loading states, and discrete event integration.

## System value

This epic combines the independent game with FunkSpace without coupling React to simulation. It makes the project usable, understandable, and presentable while preserving the standalone package.

## Dependencies

Gate 2 approval.

## In scope

- Consolidated public host types.
- Reduced-effects option and public event contract.
- Dedicated play route.
- Deliberate start screen.
- DOM HUD and overlays.
- Loading and failure states.
- Focus management.
- Accessibility announcements.
- Safe-area and orientation shell.
- Visibility and route-cleanup behavior.

## Out of scope

- Final case-study page.
- Audio and persistence.
- Final visual effects.
- Per-frame React state.
- Portfolio-wide navigation redesign.

## Suggested implementation areas

- Existing: `frontend/features/games/`
- Proposed: `frontend/app/play/wave-survivor/page.tsx`
- Proposed components under `frontend/features/games/wave-survivor/` only when current organization justifies it.
- Existing game public API.

## Work items

| ID          | Task                                                 | Planned behavior                                                                                     | Acceptance criteria                                                                           |
| ----------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **WS-7.1**  | Audit and consolidate public types.                  | Prefer game-package exports for controller, theme, events, and mount options.                        | Frontend does not duplicate contracts that can be imported safely from the package root.      |
| **WS-7.2**  | Add `reducedEffects` and `onEvent` to mount options. | Host supplies immutable settings and receives discrete events.                                       | No per-frame snapshot or internal `GameState` crosses the boundary.                           |
| **WS-7.3**  | Add the dedicated play route.                        | Provide a server-friendly shell with the smallest client game boundary.                              | Portfolio home and unrelated pages do not eagerly load the game runtime.                      |
| **WS-7.4**  | Implement deliberate start.                          | Game begins only after a user activates a Start control.                                             | Audio-ready user activation and onboarding are supported; game does not auto-start on import. |
| **WS-7.5**  | Implement start instructions.                        | Explain joystick/keyboard movement, automatic attack, waves, and upgrades.                           | Instructions are concise, visible, and available without Canvas-only text.                    |
| **WS-7.6**  | Implement semantic HUD.                              | Show health, wave, pause control, and essential status through DOM where appropriate.                | React updates only on discrete changes, not every frame.                                      |
| **WS-7.7**  | Implement pause overlay.                             | Pause from a visible control and resume deliberately.                                                | Focus is moved into the overlay and restored appropriately.                                   |
| **WS-7.8**  | Implement upgrade overlay.                           | Present upgrade choices as keyboard- and touch-operable controls.                                    | Simulation remains paused until a valid choice.                                               |
| **WS-7.9**  | Implement result overlay.                            | Present outcome, score, best score placeholder, replay, and exit.                                    | Focus lands on a sensible result action.                                                      |
| **WS-7.10** | Implement loading and error fallback.                | Communicate lazy-load status and failed module initialization.                                       | Failure leaves navigation and retry/exit behavior usable.                                     |
| **WS-7.11** | Implement accessibility announcements.               | Announce ready, paused, wave cleared, upgrade available, victory, and defeat.                        | Rapid combat events are not announced individually.                                           |
| **WS-7.12** | Implement safe-area and orientation shell.           | Use dynamic viewport units, safe-area insets, and centered portrait framing.                         | Small phones remain usable and landscape provides an understandable fallback.                 |
| **WS-7.13** | Preserve theme and visibility behavior.              | Live theme updates continue; hidden document pauses; visible document resumes only when appropriate. | Manual pause is not accidentally overridden by visibility resume.                             |
| **WS-7.14** | Harden route cleanup.                                | Destroy controller and subscriptions on unmount or navigation.                                       | No frames, listeners, or observers survive route exit.                                        |

## Testing strategy

### Component

- Loading, ready, error.
- Start button.
- Pause/resume.
- Upgrade choices.
- Result and replay.
- Keyboard operation.
- Focus movement and restoration.
- Accessible names and announcements.

### End-to-end

- Navigate to play route.
- Start with keyboard.
- Pause and resume.
- Trigger or fixture upgrade state and choose an option.
- Trigger win/loss fixture if supported.
- Restart.
- Navigate away and confirm cleanup.

### Manual

- Test with touch and keyboard.
- Inspect focus at every overlay transition.
- Test high-contrast themes.
- Test browser back navigation during play.
- Test narrow portrait and landscape orientation.

## Epic exit criteria

- The complete run is playable through the portfolio.
- The package remains independently runnable.
- React does not own per-frame state.
- All major UI states are keyboard and touch operable.
- Loading, error, pause, upgrade, and result states are understandable.
- Route navigation reliably destroys game resources.

---

# EPIC 8 — Theme-aware effects, audio, settings, and persistence

## Goal

Add clarity, satisfaction, user control, and local continuity without changing the core game structure.

## System value

This epic improves feedback loops and portfolio quality while keeping gameplay rules separate from presentation and local settings.

## Dependencies

EPIC 7.

## In scope

- Audit of real semantic color roles.
- Hit, death, warning, pulse, and restrained shake effects.
- Shared pure motion reuse where appropriate.
- Reduced-effects behavior.
- Browser audio adapter.
- Sound and music controls.
- Versioned local settings and best-score persistence.
- Asset loading only when first real assets exist.

## Out of scope

- New gameplay systems.
- Permanent progression.
- Large asset pipeline.
- Voiceover or localization system.
- Unmeasured particle volume.

## Suggested implementation areas

- Existing: `tokens/fs.game.tokens.json`
- Generated output through existing token build.
- Proposed: game effect modules under Domain or renderer according to whether they are timing state or drawing application.
- Proposed: `games/wave-survivor/src/infrastructure/audio/`
- Proposed: `games/wave-survivor/src/infrastructure/storage/`
- Portfolio settings UI in the game feature boundary.

## Work items

| ID          | Task                                        | Planned behavior                                                                                      | Acceptance criteria                                                                               |
| ----------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **WS-8.1**  | Audit implemented visual roles.             | Identify only semantic values now required, such as border, warning, health, boss, or joystick.       | No speculative large game palette is introduced.                                                  |
| **WS-8.2**  | Add and regenerate game tokens when needed. | Edit token source and run token generation.                                                           | Generated files are not hand-edited; all themes remain readable.                                  |
| **WS-8.3**  | Implement a small effect state model.       | Represent hit flash, death burst, spawn warning, pulse, and shake envelope.                           | Effects advance from the main game loop and clean up deterministically.                           |
| **WS-8.4**  | Reuse shared motion utilities selectively.  | Use easing/interpolation for presentation sampling.                                                   | No gameplay movement, cooldown, wave timing, or immunity uses design motion tokens.               |
| **WS-8.5**  | Implement reduced-effects mode.             | Disable or reduce shake, excessive particles, strong flashes, large transitions, and repeated pulses. | Player, enemy, and projectile motion remain fully functional and feedback remains understandable. |
| **WS-8.6**  | Implement the browser audio adapter.        | Load and play effects/music after explicit user interaction.                                          | No audio begins before Start or another valid activation.                                         |
| **WS-8.7**  | Define audio lifecycle.                     | Pause, resume, mute, restart, and destroy audio resources consistently.                               | Route exit and destroy release or disconnect active audio resources.                              |
| **WS-8.8**  | Add sound and music controls.               | Expose independent settings only when both audio categories exist.                                    | Controls are keyboard operable and current state is announced.                                    |
| **WS-8.9**  | Define versioned persistent state.          | Store best score, sound, music, and reduced-effects preferences.                                      | Invalid, partial, or future data falls back safely.                                               |
| **WS-8.10** | Implement best-score update.                | Compare completed result with stored best and persist the new value.                                  | A failed storage write does not block result presentation or replay.                              |
| **WS-8.11** | Add an asset loader only for actual assets. | Provide ready and failure states for the first image or audio dependency.                             | Standalone and hosted builds resolve identical package-owned assets.                              |
| **WS-8.12** | Test live theme changes during play.        | Apply theme values without restarting simulation.                                                     | Theme update does not modify game state or read DOM variables inside the package.                 |

## Testing strategy

### Domain/unit

- Effect advancement and expiration.
- Reduced-effects configuration.
- Best-score comparison.
- Persistent-state validation and migration fallback.

### Infrastructure

- Audio starts after activation.
- Mute and resume.
- Storage unavailable or malformed.
- Destroy cleans audio and storage subscriptions.
- Asset failure produces a controlled error.

### Visual/manual

- Compare every theme.
- Compare full and reduced effects.
- Confirm hits, invulnerability, warnings, and boss attacks remain legible without shake or particles.
- Reload and verify settings and best score.

## Epic exit criteria

- Combat and phase feedback are clear without relying on final art.
- Reduced-effects mode is fully playable.
- Audio obeys browser activation and user controls.
- Settings and best score persist safely.
- Theme changes do not couple the game to portfolio internals.

---

# EPIC 9 — Device, performance, lifecycle, and accessibility hardening

## Goal

Turn the complete, integrated game into a stable portfolio-quality release candidate through measurement, representative-device validation, leak testing, and accessibility review.

## System value

This epic closes the feedback loop between implementation assumptions and real browser/device behavior. It determines measured limits rather than adding speculative optimization.

## Dependencies

EPIC 8.

## In scope

- Lightweight instrumentation.
- Measured entity and DPR budgets.
- Profiling before pooling.
- Representative browser/device tests.
- Interruption and lifecycle hardening.
- Repeated-run leak testing.
- Accessibility review.
- Production validation.
- Performance and architecture documentation.

## Out of scope

- New content to hide performance problems.
- General profiling framework.
- Premature rewrite to WebGL.
- Broad portfolio performance refactor unrelated to the game route.

## Work items

| ID          | Task                                       | Planned behavior                                                                                         | Acceptance criteria                                                                           |
| ----------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **WS-9.1**  | Add development-only performance counters. | Measure update duration, render duration, clamped frame gaps, and entity counts.                         | Instrumentation is lightweight and excluded or disabled in normal production behavior.        |
| **WS-9.2**  | Establish measured budgets.                | Record maximum active enemies, projectiles, effects, and effective DPR.                                  | Budgets are derived from representative tests rather than guesses.                            |
| **WS-9.3**  | Profile allocation behavior.               | Observe garbage collection and high-churn entity creation.                                               | Pooling is introduced only when a measured problem exists.                                    |
| **WS-9.4**  | Add the smallest justified pool if needed. | Pool one proven high-churn type, likely projectiles or particles.                                        | Pooling preserves behavior and cleanup; no generic entity framework appears.                  |
| **WS-9.5**  | Test representative viewport classes.      | Small phone, tall phone, tablet, and desktop.                                                            | Arena, joystick, overlays, safe areas, and text remain usable.                                |
| **WS-9.6**  | Test representative engines.               | Chromium and WebKit/Safari-representative behavior, plus supported desktop browser path.                 | Touch, pointer capture, audio, visibility, storage, and Canvas sizing behave acceptably.      |
| **WS-9.7**  | Harden interruption behavior.              | Cover visibility, blur, tab suspension, orientation, resize, pointer cancellation, and route navigation. | No catch-up explosion, ghost input, duplicate resume, or leaked resource occurs.              |
| **WS-9.8**  | Perform repeated-run leak testing.         | Run many start/pause/resume/result/restart/destroy cycles.                                               | Frame callbacks, listeners, observers, audio resources, and entity counts return to baseline. |
| **WS-9.9**  | Complete accessibility review.             | Verify keyboard UI, focus, touch targets, contrast, announcements, non-color cues, and reduced effects.  | Critical flow is understandable and operable within the game’s real-time constraints.         |
| **WS-9.10** | Run full affected validation.              | Execute package, frontend, E2E, and production builds appropriate to the final diff.                     | All checks pass or exact limitations are documented without weakening assertions.             |
| **WS-9.11** | Document budgets and known limitations.    | Update feature and architecture docs with measured behavior.                                             | Future agents can recover constraints without relying on conversation history.                |

## Validation commands

Use repository scripts confirmed during inspection. Expected coverage includes:

```bash
pnpm --filter @funkspace/wave-survivor typecheck
pnpm --filter @funkspace/wave-survivor test
pnpm --filter @funkspace/wave-survivor build
pnpm --filter @funkspace/wave-survivor demo:build
pnpm -F frontend exec tsc --noEmit
pnpm lint
pnpm test
pnpm e2e
pnpm build
```

Storybook or additional visual checks should run only when reusable visual components or stories are affected.

## Gate 3 decision

Proceed to content scaling only when:

- The game is stable on representative mobile and desktop conditions.
- Touch, keyboard, theme, contrast, reduced-effects, audio, and persistence paths work.
- Repeated runs and route navigation do not leak resources.
- Performance budgets are documented and met.
- The dedicated portfolio route is ready for public presentation.

---

# EPIC 10 — Data-driven scaling and release documentation

## Goal

Expand the proven complete game within its approved content budget, keep new content mostly declarative, remove unnecessary abstractions, and prepare the portfolio case study and release candidate.

## System value

This epic demonstrates scalable design without turning the first game into a general engine or endless content project.

## Dependencies

Gate 3 approval.

## In scope

- Typed and validated definitions for proven content.
- Up to three normal enemy archetypes total.
- Approximately six to eight meaningful upgrades total.
- Optional second or third attack family only if playtesting proves the need.
- Final balance pass.
- Abstraction and duplication cleanup.
- Portfolio case study.
- Release checklist and rollback notes.

## Out of scope

- Exceeding approved content limits.
- Generic engine extraction.
- Shared game infrastructure without a second consumer.
- Deployment, commit, push, or release action without explicit authorization.

## Suggested implementation areas

- Existing or proposed game definition modules.
- `docs/features/wave-survivor.md`
- `docs/features/wave-survivor-implementation-plan.md`
- Proposed project case-study route/content.
- Release checklist under existing repository documentation conventions.

## Work items

| ID           | Task                                               | Planned behavior                                                                                                                         | Acceptance criteria                                                                 |
| ------------ | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **WS-10.1**  | Formalize validated enemy definitions.             | Move proven stats and identifiers into typed definitions.                                                                                | Adding an enemy primarily adds data plus a small isolated behavior where necessary. |
| **WS-10.2**  | Formalize validated wave definitions.              | Represent final pressure curve through configuration.                                                                                    | Wave data remains understandable and does not encode arbitrary scripts.             |
| **WS-10.3**  | Formalize attack and upgrade definitions.          | Consolidate proven modifiers and descriptions.                                                                                           | Definitions do not expose renderer or frontend internals.                           |
| **WS-10.4**  | Add the remaining normal enemy archetypes.         | Add only clear roles such as standard, fast/fragile, and slow/durable.                                                                   | Total normal archetypes do not exceed three; each changes player decisions.         |
| **WS-10.5**  | Complete the upgrade roster.                       | Reach approximately six to eight meaningful choices if needed.                                                                           | No filler upgrades, currency, rarity, or inventory system is added.                 |
| **WS-10.6**  | Decide whether another attack family is necessary. | Use playtesting evidence to add or reject additional attacks.                                                                            | The maximum budget is not treated as a requirement to fill every slot.              |
| **WS-10.7**  | Complete the final balance pass.                   | Tune power growth, pressure growth, boss difficulty, and run length.                                                                     | Movement remains relevant from first wave through boss.                             |
| **WS-10.8**  | Review duplication and abstraction.                | Remove unused experiments, duplicate rules, unnecessary exports, and lifecycle debt.                                                     | No shared engine is extracted without a second real consumer.                       |
| **WS-10.9**  | Prepare the portfolio case study.                  | Explain problem, concept, custom engine, arena scaling, touch input, fair spawning, deterministic tests, accessibility, and performance. | Case study reflects delivered code and measured evidence.                           |
| **WS-10.10** | Prepare release checklist.                         | Record route, metadata, screenshots, controls, support, validation, limitations, rollback, and deployment prerequisites.                 | Checklist distinguishes preparation from authorized deployment.                     |
| **WS-10.11** | Perform final documentation audit.                 | Align concept, implementation plan, ADRs, README, public API, and actual behavior.                                                       | No document claims unsupported features or outdated architecture.                   |

## Gate 4 / release-candidate criteria

- New content is primarily configuration plus isolated behavior.
- The content budget is not exceeded.
- The game remains independently runnable.
- No generic ECS, editor, backend, permanent progression, or new engine framework has emerged.
- Architecture, performance, controls, and case-study documentation match the implementation.
- The repository has a clear, validated release candidate awaiting explicit deployment authorization.

---

## 8. Cross-epic validation matrix

| Concern                        | Earliest epic | Required evidence                                           |
| ------------------------------ | ------------- | ----------------------------------------------------------- |
| Logical coordinate consistency | EPIC 1        | Pure viewport tests and resize manual verification          |
| One-loop lifecycle             | EPIC 2        | Clock/loop tests, repeated lifecycle calls, destroy cleanup |
| Touch cancellation             | EPIC 2        | Pointer-cancel, blur, visibility, and pause tests           |
| Spawn fairness                 | EPIC 3        | Seeded spawn tests and edge-position playtest               |
| Collision correctness          | EPIC 4        | Pure geometry tests and damage-once tests                   |
| Restart cleanliness            | EPIC 4        | Repeated-run lifecycle tests                                |
| Wave determinism               | EPIC 5        | Scheduler, cap, completion, and transition tests            |
| Upgrade validity               | EPIC 5        | Deterministic options and invalid-selection tests           |
| Complete run                   | EPIC 6        | Win/loss integration flows and replay                       |
| React boundary                 | EPIC 7        | Event-only integration review and component tests           |
| Focus and announcements        | EPIC 7        | Testing Library and manual keyboard review                  |
| Theme/reduced effects          | EPIC 8        | Token review, effect tests, visual comparisons              |
| Audio/storage failure          | EPIC 8        | Adapter failure-path tests                                  |
| Mobile/WebKit behavior         | EPIC 9        | Representative manual/device evidence                       |
| Performance budgets            | EPIC 9        | Recorded measurements and documented caps                   |
| Data-driven scaling            | EPIC 10       | Definition review and absence of new global systems         |

## 9. Risk register

| Risk                                                    | Likelihood | Impact | Leverage point / mitigation                                                                | Verification                                 |
| ------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------ | -------------------------------------------- |
| Scope expands before core feel is proven.               | High       | High   | Enforce Gate 1 and scope firewall; reject art, lore, upgrades, or content before approval. | Gate review and diff audit.                  |
| Responsive scaling changes difficulty across devices.   | Medium     | High   | Fixed `360 × 640` logical world; display-only scaling.                                     | Unit tests and multi-viewport manual tests.  |
| Multiple loops or listeners survive restart/navigation. | Medium     | High   | One composition root, idempotent lifecycle, terminal destroy, repeated-run tests.          | Lifecycle instrumentation and leak test.     |
| Touch pointer cancellation causes ghost movement.       | Medium     | High   | Pointer capture plus reset on cancel, blur, pause, visibility, restart, and destroy.       | Infrastructure tests and real-device review. |
| Offscreen spawning feels unfair.                        | Medium     | High   | Speed-based offset, minimum contact time, entry warnings, active cap.                      | Seeded tests and edge-position playtest.     |
| React becomes coupled to per-frame state.               | Medium     | High   | Discrete events only; no entity snapshots in React.                                        | API review and component render profiling.   |
| The custom engine becomes a general framework.          | Medium     | High   | No abstraction without current use; no shared engine without second consumer.              | Epic diff and architecture review.           |
| Premature pooling complicates logic.                    | Medium     | Medium | Profile first; pool one proven high-churn entity only.                                     | EPIC 9 measurement evidence.                 |
| Final art changes hitboxes or readability.              | Medium     | Medium | Collision remains gameplay data; renderer maps kind to appearance.                         | Visual/collision comparison tests.           |
| Audio violates autoplay rules or leaks resources.       | Medium     | Medium | Initialize after Start; explicit adapter lifecycle.                                        | Browser manual test and destroy test.        |
| Reduced-effects mode removes necessary feedback.        | Medium     | High   | Preserve gameplay motion and non-color cues; simplify only nonessential effects.           | Comparative accessibility review.            |
| Content balancing becomes open-ended.                   | High       | Medium | Cap archetypes, upgrades, attacks, and run length; tune five leverage points first.        | Content-budget audit and complete-run tests. |
| Repository documentation diverges from code.            | Medium     | Medium | Update docs with public-contract or architecture changes; final audit in EPIC 10.          | Documentation diff review.                   |

## 10. Open decisions and resolution timing

| Decision                                    | Resolve in                                          | Decision rule                                                                                 |
| ------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Final title, fiction, and visual identity   | After Gate 1, before final assets                   | Choose a theme that fits proven mechanics without changing hitboxes or scope.                 |
| Exact wave count and durations              | WS-6.1 candidate; manual review and WS-6.10 pending | Four normal waves + boss provisionally; validate human pacing without padding to 5–7 minutes. |
| Boss behavior                               | EPIC 6                                              | Reuse existing systems and test learned movement skills.                                      |
| Final upgrade roster                        | EPIC 5, finalized EPIC 10                           | Prefer modifiers to current rules; reject filler.                                             |
| Score formula                               | WS-6.6 candidate implemented; Dimi approval pending | Reward defeats, normal clears, victory, and victory health percentage; no time or currency.   |
| Sound/music direction                       | EPIC 8                                              | Match available feedback needs and asset budget.                                              |
| Portfolio route and case-study presentation | Route in EPIC 7; case study in EPIC 10              | Keep playable route dedicated and game lazily loaded.                                         |
| Entity and frame budgets                    | EPIC 9                                              | Derive from representative measurements.                                                      |
| Additional attack family                    | EPIC 10                                             | Add only if the single attack plus upgrades cannot provide sufficient variety.                |
| Object pooling                              | EPIC 9                                              | Add only after profiling demonstrates allocation pressure.                                    |

## 11. Rollout and rollback

### Development rollout

- EPICs 1–6 remain available through the standalone demo and an internal or unlinked host surface.
- Do not publicly promote the portfolio play route before Gate 3.
- Gate 1 and Gate 2 builds may be retained as tagged demos or screenshots for case-study evidence, but they are not separate production systems.
- The final route should lazy-load the game so unrelated portfolio pages remain unaffected.

### Rollback

- A gameplay epic should be reverted as a bounded change without removing the package scaffold.
- If the hosted integration causes regressions, disable or unlink the play route while retaining the standalone game package.
- Persistent-state changes must tolerate older or invalid versions and fall back without data loss beyond noncritical local settings/score.
- A theme-token regression should be rolled back at the token source and regenerated; generated artifacts must not be manually patched.
- No rollback requires backend migration because the first version has no server-side data.

## 12. Definition of done for every task

A task is complete only when:

- relevant `AGENTS.md`, feature docs, ADRs, package scripts, current code, and nearby tests were inspected;
- the requested scope is implemented without unrelated refactoring;
- Domain remains deterministic and framework-free;
- lifecycle and cleanup are explicit;
- tests cover observable behavior and risk;
- the narrowest relevant validation passes;
- broader typecheck, lint, build, or E2E checks run when the change affects their surface;
- generated files are regenerated from source rather than hand-edited;
- standalone and portfolio boundaries remain valid;
- documentation is updated when behavior, architecture, or public contracts change;
- the final diff is reviewed for duplication, unused code, per-frame allocations, unbounded counts, and leaks;
- the implementation report contains exactly:
  - files changed;
  - main decisions;
  - validation performed;
  - remaining risks or follow-up work.

## 13. Task execution format for ChatGPT Sites

Each work item should normally become one independently reviewable Sites request. Closely coupled subtasks may be combined only when splitting would create an unusable intermediate state.

Use this structure:

```text
Goal
- State the observable outcome of this task.

Repository context
- Read root AGENTS.md.
- Read docs/features/wave-survivor.md.
- Read docs/features/wave-survivor-implementation-plan.md.
- Read relevant ADRs, package scripts, current code, and nearby tests.

Scope
- List the exact behavior to implement.
- List protected behavior and areas that must remain unchanged.

Architecture constraints
- Preserve Presentation → Application → Domain ← Infrastructure.
- Keep one game loop.
- Keep React outside per-frame state.
- Do not add a framework or speculative abstraction.
- Keep the game standalone.

Acceptance criteria
- Express independently observable outcomes.

Validation
- Name the narrow tests and broader checks required.

Handoff
- Report files changed, main decisions, validation performed,
  and remaining risks or follow-up work.
```

## 14. Recommended first execution task

Begin with **WS-0.1 through WS-0.5** as one documentation-and-baseline task if the repository does not yet contain the approved documents. After the baseline is clean, execute **WS-1.1 through WS-1.4** as the first code task: logical arena constants and pure viewport calculations only.

Do not begin joystick, runtime-loop, or movement implementation until the coordinate and display contract is tested and approved.
