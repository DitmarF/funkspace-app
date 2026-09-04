# Wave Survivor — Game Concept

> Intended repository path: `docs/features/wave-survivor.md`

## Document metadata

- **Status:** Approved starting concept
- **Product stage:** Gate 1 approved / Gate 2 ready
- **Owner:** Dimi
- **Working title:** Wave Survivor
- **Target platform:** Modern web browsers
- **Primary form factor:** Mobile, portrait orientation
- **Secondary form factors:** Tablet and desktop
- **Last updated:** 2026-08-30
- **Game package:** `games/wave-survivor/`
- **Related decisions:**
  - [`ADR-002: Design tokens as the source of truth`](../decisions/ADR-002-design-token-source-of-truth.md)
  - [`ADR-003: Interactive experience boundary`](../decisions/ADR-003-interactive-experience-boundary.md)
  - [`ADR-004: First game development architecture`](../decisions/ADR-004-game-development-architecture.md)

## 1. Purpose of this document

This document is the living source of truth for the first FunkSpace browser game. It defines the approved game concept, experience goals, core rules, scope boundaries, responsive arena model, control scheme, wave and spawning principles, architectural constraints, development gates, and remaining design decisions.

It deliberately does not define the final story, visual theme, full content roster, or detailed balancing values. Those decisions should be added only when they become necessary for the next playable vertical slice.

At approval time, the repository already contains the standalone `games/wave-survivor/` package, its public lifecycle API, a Canvas ownership boundary, a standalone demo, a lazy portfolio host, and a FunkSpace theme adapter. Gameplay and drawing remain intentionally unimplemented, so this document defines the rules that should guide the first playable work.

## 2. Concept summary

Wave Survivor is a **portrait, single-screen, wave-based auto-fire survival game**.

The player controls movement only. Enemies enter a fixed arena in finite waves, while the player attacks automatically. After each cleared wave, the player chooses one upgrade. Pressure increases until a boss or final wave concludes the run. A run has a clear win or loss state and should support immediate replay.

The game is intentionally smaller than an endless open-world survivors-like. Its purpose is to create a complete, polished, portfolio-quality browser game while teaching the foundations of a custom real-time game engine.

### One-sentence pitch

> Move, avoid, survive, and build power through short waves until a final boss ends a compact portrait run.

## 3. Product goals

The project should achieve five outcomes:

1. **Create a finished game, not an expanding platform.** A finite run, one arena, and capped content provide a clear definition of done.
2. **Teach game-engine fundamentals.** The project should expose the game loop, fixed-step simulation, input, collision, spawning, targeting, lifecycle, rendering, effects, audio, persistence, and performance behavior.
3. **Feel natural on a phone.** The primary experience is portrait, touch-controlled, readable, and responsive across practical mobile resolutions.
4. **Demonstrate portfolio quality.** Completion, architecture, accessibility, responsiveness, performance, and game feel matter more than a large content count.
5. **Remain modular and independently runnable.** The game shares FunkSpace foundations through explicit contracts but does not depend on React, Next.js, Tailwind, or frontend internals.

## 4. Design pillars

### 4.1 Movement is the primary player skill

The player makes one continuous decision: where to move. There is no manual aiming in the first version. The challenge comes from positioning, avoiding contact, reading enemy entry points, and choosing when to take risks.

### 4.2 Short, finite runs

The game is wave-based rather than endless. The initial target is approximately **5–7 minutes**, with several normal waves followed by one boss or final survival wave. Exact duration and wave count remain tuning values.

### 4.3 Simple rules, meaningful pressure

The first game should derive most of its difficulty from a small set of leverage points:

- enemy speed;
- enemy health;
- spawn timing and active-enemy limits;
- player attack cooldown;
- upgrade frequency and strength.

### 4.4 Readable action before visual complexity

Characters begin as circles, rectangles, and simple effects. Art may become more elaborate later, but silhouettes, hitboxes, enemy states, warnings, and damage feedback must remain understandable.

### 4.5 Reuse through contracts, not coupling

The game may consume resolved semantic theme values and pure motion utilities. It must not import portfolio components, CSS-variable names, frontend services, or renderer-specific animation classes.

## 5. Core loops

### 5.1 Moment-to-moment loop

```text
Move
  → avoid enemies
  → automatic attack targets an enemy
  → damage and defeat enemies
  → survive increasing pressure
```

### 5.2 Run loop

```text
Start run
  → survive wave
  → clear remaining enemies
  → choose one upgrade
  → begin harder wave
  → defeat boss or final wave
  → win or lose
  → replay
```

### 5.3 Feedback loops

**Power loop**

```text
Kills
  → upgrade choice
  → greater player power
  → faster or safer kills
```

**Pressure loop**

```text
Wave progression
  → faster, tougher, or more numerous enemies
  → reduced safe space
  → greater movement and positioning pressure
```

The game is balanced by tuning the relationship between these two loops. Player power should grow, but pressure should grow quickly enough that movement remains important.

## 6. Run structure and phases

The initial phase model is:

```ts
type GamePhase =
  | "idle"
  | "playing"
  | "wave-cleared"
  | "choosing-upgrade"
  | "paused"
  | "won"
  | "lost";
```

A normal run follows this sequence:

1. The start state explains movement and begins only after deliberate user input.
2. The player enters the arena with full health and the basic automatic attack.
3. A finite spawn schedule releases the current wave.
4. The wave ends when its spawn queue is empty and all entering or active enemies are gone.
5. The simulation pauses while the player chooses one upgrade.
6. The next wave begins with higher pressure.
7. A final boss or final wave determines victory.
8. The result state shows the outcome and allows immediate restart.

Restart must create the same clean initial state as the first run. No enemies, projectiles, timers, input state, observers, audio resources, or pending callbacks may survive between runs.

## 7. Arena and responsive presentation

### 7.1 Fixed logical arena

The game uses a fixed portrait world:

```ts
export const ARENA = {
  width: 360,
  height: 640,
} as const;
```

These are logical game units, not CSS pixels or device pixels. Movement speed, attack range, collision, spawn behavior, and difficulty are calculated in this fixed coordinate system on every device.

### 7.2 Responsive display

The logical arena is scaled to the available display area without stretching:

```ts
const scale = Math.min(
  availableWidth / ARENA.width,
  availableHeight / ARENA.height,
);
```

Presentation rules:

- A portrait phone uses as much of the safe viewport as practical.
- A tall phone centers the arena and may use remaining space for the shell or visual background.
- A tablet or desktop displays a centered portrait frame.
- Landscape mobile keeps the portrait world rather than revealing more gameplay space.
- The arena aspect ratio never changes.
- Resizing affects rendering only; it does not modify simulation coordinates or restart the run.
- The Canvas backing resolution follows the CSS display size and device-pixel ratio, capped initially at `2` for performance.

A practical desktop display cap is approximately `540 × 960` CSS pixels. This is a presentation limit, not a change to the logical world.

### 7.3 Visible, spawn, and despawn bounds

The game distinguishes three areas:

```text
Despawn bounds
┌───────────────────────────────────┐
│          Offscreen ring           │
│   ┌───────────────────────────┐   │
│   │       Visible arena       │   │
│   │                           │   │
│   │          Player           │   │
│   │                           │   │
│   └───────────────────────────┘   │
│          Offscreen ring           │
└───────────────────────────────────┘
```

- **Visible arena:** the fixed `360 × 640` space shown to the player.
- **Offscreen simulation ring:** space outside the visible arena in which enemies may be created and approach the border.
- **Despawn bounds:** a larger safety boundary after which escaped projectiles, effects, or invalid entities are removed.

The arena border is a movement boundary for the player, not a physical wall for enemies. Enemies cross it when entering the arena.

## 8. Controls

### 8.1 Mobile control

The primary mobile control is a **fixed virtual joystick** placed in the lower-left control area.

Initial ergonomic values, subject to real-device testing:

- base radius: approximately `48–56` CSS pixels;
- safe inset: approximately `16–24` CSS pixels;
- dead zone: approximately `10–15%` of joystick radius.

The joystick emits a normalized movement intention:

```ts
type MovementIntent = {
  readonly x: number;
  readonly y: number;
};
```

It never writes the player position directly. The movement system converts the intention into velocity and applies delta-time movement.

Input must reset on pointer release, pointer cancellation, blur, visibility loss, pause, restart, and destruction. Pointer capture should keep the gesture stable when the thumb moves beyond the initial joystick area.

### 8.2 Desktop and accessibility controls

Keyboard movement is available from Gate 1:

- `WASD`;
- arrow keys.

All control adapters produce the same `MovementIntent`, so simulation behavior does not depend on the physical input source. A future gamepad adapter may use the same contract if there is a demonstrated need.

### 8.3 Input exclusions

The first version has:

- no manual aim;
- no attack button;
- no dash button;
- no multi-touch combat controls;
- no configurable control editor.

These exclusions protect the clarity and mobile usability of the core loop.

## 9. Player and combat rules

### 9.1 Player movement

Player movement is delta-time based. Diagonal movement must be normalized so it is not faster than horizontal or vertical movement. The player is clamped inside the visible arena with padding based on its collision radius.

### 9.2 Automatic attack

The first attack automatically targets the nearest **active, visible** enemy within its targeting rules. Enemies that are still fully outside the arena are not valid targets.

The initial attack is a simple projectile with:

- a defined cooldown;
- speed;
- damage;
- collision radius;
- lifetime or despawn rule.

The game may later support two or three basic attack families, but one attack is sufficient for Gate 1 and the complete loop should be proven before content expansion.

### 9.3 Collision model

The MVP uses circle-based collision for:

- player versus enemy;
- projectile versus enemy;
- pickups, if introduced later.

Collision shapes are gameplay data and remain independent from final artwork.

### 9.4 Damage and invulnerability

Enemies deal contact damage. After receiving damage, the player receives a short invulnerability interval so overlapping enemies cannot apply damage every simulation step.

Initial tuning range:

```text
Player contact invulnerability: approximately 0.5–0.8 seconds
```

This value is a balance parameter and must be adjusted through playtesting.

### 9.5 Death and restart

The player loses when health reaches zero. The lose state pauses gameplay, communicates the result, and provides an immediate restart action.

## 10. Enemy lifecycle and spawning

### 10.1 Enemy phases

```ts
type EnemyPhase = "entering" | "active" | "dying";
```

**Entering**

- Exists in simulation outside or partly outside the visible arena.
- Moves toward its initial destination or the player.
- Is not targetable while fully invisible.
- Cannot damage the player while fully outside the arena.

**Active**

- Intersects or has entered the visible arena.
- Can be rendered, targeted, damaged, and collide with the player.

**Dying**

- No longer participates in combat.
- May briefly produce a presentation effect before cleanup.

### 10.2 Spawn position

Enemies spawn on the perimeter of an expanded rectangle around the visible arena. Random-perimeter spawning should sample uniformly by perimeter length rather than choosing each side with equal probability, because the portrait arena has longer vertical sides.

The first spawn pattern is:

```ts
type SpawnPattern = "random-perimeter";
```

Later waves may add isolated patterns such as top-only, paired sides, alternating sides, opposite-player, or boss entry. Each pattern must solve a concrete gameplay need rather than creating a general spawn framework.

### 10.3 Spawn distance

Spawn distance scales with enemy speed so fast enemies do not appear with less warning than slow enemies:

```ts
const spawnOffset = enemy.radius + enemy.speed * entryLeadSeconds;
```

Initial entry lead target:

```text
Approximately 0.75 seconds outside the visible arena
```

### 10.4 Fairness constraints

A candidate spawn must be rejected or resampled when its estimated time to reach the player is too short.

Initial minimum contact-time target:

```text
Approximately 1.25 seconds
```

Additional fairness tools:

- stagger enemy creation rather than releasing a complete group in one frame;
- cap simultaneous active enemies per wave;
- use a small border warning before entry;
- give elites and bosses stronger telegraphs;
- simplify or replace pulsing warnings in reduced-effects mode.

### 10.5 Wave definition

A wave is a finite schedule of spawn groups:

```ts
type SpawnGroup = {
  readonly atMs: number;
  readonly enemyId: string;
  readonly count: number;
  readonly intervalMs: number;
  readonly pattern: SpawnPattern;
};

type WaveDefinition = {
  readonly groups: readonly SpawnGroup[];
  readonly maxActiveEnemies: number;
};
```

A wave is complete when:

```text
spawn queue is empty
AND
no entering or active enemies remain
```

When the active-enemy cap is reached, queued spawns wait. This prevents uncontrolled accumulation while preserving a finite wave.

As a temporary EPIC 5 fallback, wave numbers after the fourth provisional wave reuse Wave 4's definition while the displayed wave number continues increasing. EPIC 6 must replace this behavior with the final run length, pressure curve, and victory structure.

## 11. Upgrades and progression

### 11.1 Between-wave choice

After each normal wave, the player chooses one upgrade from a small set. The simulation remains paused until the choice is made.

The initial upgrade set modifies existing rules through three focused choices:

- **Rapid Fire:** increase fire rate by `10%` per level;
- **Swift Movement:** increase movement speed by `10%` of its original base value per level;
- **Vitality:** increase maximum health by `1` and immediately heal `1` health.

Each initial upgrade has five levels. Rapid Fire retains a safe minimum cooldown of `0.6s`. Damage, recovery-only, projectile-size, and additional-projectile upgrades are deferred until playtesting demonstrates that the three-choice set needs expansion.

### 11.2 No permanent power progression

The first public version stores no permanent statistical progression. Persistent unlock currencies, talent trees, equipment, and grind loops are excluded because they multiply menus, balancing, save migrations, and long-term dependencies.

Persistent data is limited to:

```ts
type PersistentState = {
  bestScore: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  reducedEffects: boolean;
};
```

A cosmetic unlock may be considered after the complete game works, but it is not part of the starting scope.

## 12. Initial content budget

The following values are production limits for the first complete version, not a promise that every item must be implemented before playtesting:

| Element                 |                                           Initial limit |
| ----------------------- | ------------------------------------------------------: |
| Arena                   |                                  1 fixed portrait arena |
| Playable characters     |                                                       1 |
| Primary input           |                                           Movement only |
| Manual aiming           |                                                    None |
| Basic attacks           | 1 for Gate 1; at most 2–3 in the first complete version |
| Normal enemy archetypes |                                               At most 3 |
| Bosses                  |                                                       1 |
| Upgrade definitions     |                                       Approximately 6–8 |
| Run length              |                               Approximately 5–7 minutes |
| Game modes              |                                                       1 |
| Persistent data         |                                 Settings and best score |
| Major screens/states    |                      Start, play, pause/upgrade, result |

New enemies, attacks, and upgrades should eventually be configuration plus small isolated behavior modules, not new global subsystems.

## 13. Visual direction and asset readiness

### 13.1 Grey-box first

Gate 1 uses geometric graphics only:

- player circle or simple polygon;
- enemy circle or simple shape;
- projectile circle or line;
- basic health display;
- restrained hit and death effects;
- visible arena border and entry warnings.

No final asset production should precede validation of the one-minute play loop.

### 13.2 Graphics replacement strategy

Simulation state identifies entity kinds and collision shapes. The renderer decides how each kind looks. Replacing a circle with a sprite or procedural illustration must not silently alter its gameplay hitbox.

Future supported visual approaches may include:

- procedural Canvas shapes;
- layered vector-like graphics;
- individual images;
- sprite sheets.

Assets belong to `games/wave-survivor/` and must work in both the standalone demo and the portfolio host. The game must not depend on portfolio asset paths.

### 13.3 Render order

The initial render order is:

```text
1. background
2. arena decoration
3. pickups
4. enemies
5. player
6. projectiles
7. gameplay effects
8. joystick and Canvas HUD elements
```

This fixed order is sufficient; the MVP does not require a general scene graph.

## 14. FunkSpace theme and motion integration

### 14.1 Theme values

The game receives immutable, resolved semantic colors through `GameTheme`. It does not read CSS variables, DOM theme attributes, Tailwind classes, or `ThemeService`.

The current minimum roles are:

```text
background
player
enemy
projectile
effect
```

Additional roles such as arena border, health, warning, pickup, elite, or joystick should be added only when the visual prototype demonstrates a real semantic need.

Shared visible roles originate in `tokens/fs.game.tokens.json` and are generated for non-CSS consumers. Purely local simulation constants remain inside the game.

### 14.2 Motion reuse

Shared motion utilities may be used for presentation effects such as:

- hit flashes;
- spawn warnings;
- scale pulses;
- death bursts;
- upgrade transitions;
- restrained screen-shake envelopes.

They must not control:

- player or enemy movement;
- projectile simulation;
- attack cooldowns;
- wave timing;
- invulnerability timing;
- scoring or balance rules.

The game owns one clock and one main update loop. Effects are advanced by that loop rather than scheduling independent animation-frame loops.

## 15. Architecture and portfolio integration

### 15.1 Technical direction

The first game uses:

```text
Custom strict-TypeScript game runtime
  + Canvas 2D renderer
  + browser input, timing, audio, and storage adapters
```

Phaser, PixiJS, Matter.js, Three.js, and other game engines are excluded unless a later documented requirement demonstrates a critical need.

The goal is a **game-specific micro-engine**, not a reusable general-purpose engine.

### 15.2 Layer responsibilities

```text
Presentation → Application → Domain ← Infrastructure
```

- **Domain:** deterministic state, rules, movement math, collision, damage, targeting, scoring, waves, and state transitions.
- **Application:** game session and lifecycle orchestration.
- **Infrastructure:** requestAnimationFrame loop, Canvas renderer, browser input, audio, persistence, clocks, and randomness adapters.
- **Presentation:** Canvas output inside the game and portfolio-owned React/DOM shell, menus, instructions, settings, and accessible overlays.

### 15.3 Standalone boundary

The game package must:

- import no React, Next.js, Tailwind, or portfolio source;
- run from its standalone HTML demo;
- expose only a small public lifecycle and host contract;
- own no unscoped globals;
- clean up every frame callback, listener, observer, timer, audio resource, and active input on `destroy()`;
- keep simulation testable without a real browser or Canvas renderer.

### 15.4 Portfolio host boundary

The portfolio host may:

- mount the Canvas;
- lazy-load the game package;
- supply the current resolved theme and reduced-effects preference;
- pause when the page becomes hidden;
- display semantic menus, upgrade choices, instructions, and results;
- receive occasional game events.

React must not store or render per-frame enemy, projectile, joystick, or position state.

## 16. Accessibility and user control

The complete portfolio version should provide:

- touch and keyboard movement;
- readable touch targets and safe-area handling;
- pause and resume controls;
- clear start, upgrade, win, lose, and restart states;
- visible focus indicators for DOM controls;
- dark and high-contrast theme support;
- sound and music controls;
- accessibility announcements for important phase changes;
- onboarding that explains movement and automatic attacks;
- no essential information communicated only through color.

Reduced-effects mode preserves gameplay movement but simplifies or removes nonessential motion such as:

- screen shake;
- excessive particles;
- strong flashes;
- large zoom transitions;
- pulsing background decoration;
- repeated animated warnings when a static warning is sufficient.

## 17. Performance principles

- Use exactly one main animation-frame loop per game instance.
- Use a bounded fixed simulation step so large frame gaps do not destabilize movement or collision.
- Pause when hidden or inactive.
- Cap device-pixel ratio and active entity counts where measurement justifies it.
- Avoid per-frame React updates and DOM layout work.
- Avoid speculative object pooling; introduce small pools only after profiling identifies allocation pressure.
- Test on an actual representative phone before declaring portfolio quality.
- Preserve a functional experience when the device cannot maintain the ideal rendering rate.

Specific entity-count and frame-time budgets will be recorded after the first measurable grey-box build.

## 18. Development gates

### Gate 1 — Grey-box toy

Contains:

- responsive `360 × 640` portrait arena;
- fixed virtual joystick and keyboard movement;
- one player;
- one enemy type;
- offscreen entry and direct chase behavior;
- one automatic projectile attack;
- health, contact damage, invulnerability, and death;
- restart;
- lifecycle cleanup.

**Exit condition:** moving, avoiding, hitting, dying, and restarting feel satisfying enough to repeat for approximately one minute. Restart produces a completely clean second run.

### Gate 2 — Complete game loop

Adds:

- finite waves;
- one upgrade choice between waves;
- increasing pressure;
- one boss or final wave;
- explicit win and lose states;
- immediate replay.

**Exit condition:** the game is complete from start to result and can be won or lost without developer intervention.

### Gate 3 — Portfolio quality

Adds:

- final responsive portrait shell;
- pause and resume behavior;
- safe-area handling;
- polished touch targets and desktop support;
- onboarding;
- sound and music controls;
- theme integration and reduced-effects behavior;
- hit flashes, particles, and restrained screen shake;
- local best-score persistence;
- accessibility review;
- real-device and performance testing.

**Exit condition:** the game is stable, understandable, responsive, accessible, and presentable as a portfolio project.

### Gate 4 — Data-driven scaling

Only after the complete game works:

- add remaining capped enemy types;
- add remaining capped attacks and upgrades;
- define content through configuration;
- isolate behavior differences in small modules;
- profile before adding pooling or broader infrastructure.

**Exit condition:** new content can be added without creating new global systems or weakening the game boundary.

## 19. Scope firewall

The first public version excludes:

- account system or backend;
- online leaderboard;
- multiplayer;
- campaign map;
- scrolling or procedural world;
- tilemaps;
- quests;
- inventory, equipment, or crafting;
- permanent statistical progression;
- currencies and grinding;
- character roster;
- branching skill trees;
- daily challenges;
- multiple arenas or game modes;
- manual aiming;
- dynamic pathfinding;
- a generic ECS framework;
- scene editor or plugin system;
- general physics engine;
- WebGL renderer;
- monetization.

A new feature may enter the initial version only when it directly improves the core 30-second play loop or replaces an existing planned feature of comparable cost.

## 20. Success criteria

The concept succeeds when:

- a new player understands the main control and objective quickly;
- movement remains responsive across practical phone, tablet, and desktop sizes;
- enemy entry feels readable and fair despite offscreen spawning;
- the basic attack and damage feedback are understandable without final art;
- a one-minute grey-box session is worth immediately replaying;
- the finite run can be completed in a short sitting;
- the game starts, pauses, resumes, restarts, and destroys without lifecycle leaks;
- the standalone demo and portfolio host use the same public game package;
- themes can change without the game reading portfolio internals;
- reduced-effects mode remains fully playable;
- the first complete release stays inside the content and system budget.

## 21. Open decisions

These decisions are intentionally deferred and do not block Gate 1:

1. Final game title, fiction, setting, and player/enemy visual identity.
2. Exact number and duration of normal waves.
3. Final enemy archetype roster and boss behavior.
4. Final upgrade list and choice-generation rules.
5. Score formula and best-score presentation.
6. Sound and music direction.
7. Exact portfolio play route and case-study presentation.
8. Measured performance budget and active-entity cap.
9. Whether the final attack roster needs a second attack family or only upgrades to the primary attack.

Each deferred decision should be resolved immediately before the first development gate that requires it, using the smallest option that supports the current game.

## 22. Initial implementation slices

The responsive arena foundation below was completed in EPIC 1:

1. Replace the temporary landscape dimensions with a `360 × 640` logical world.
2. Add responsive CSS sizing without changing simulation coordinates.
3. Add device-pixel-ratio-aware Canvas backing resolution with an initial cap of `2`.
4. Draw the arena border and one stationary player marker.
5. Verify resize, pause, restart, and destroy do not recreate or leak host resources.

This established the coordinate and rendering contract required by every later
system. EPIC 2 then added the accepted deterministic runtime, keyboard and fixed
virtual-joystick input, bounded player movement, state-driven rendering, and
interruption cleanup. EPIC 3 added the accepted seeded spawning, bounded
contact-time fairness, offscreen entry warnings, direct pursuit, visible-border
activation, and despawn safety cleanup. Its PC and smartphone manual gate passed
on August 29, 2026. EPIC 4 then completed automatic projectile combat, player
and enemy health, contact damage, invulnerability, defeat and loss states,
discrete status UI, and deterministic restart. Gate 1 passed on August 30, 2026
after successful PC and real-smartphone manual reviews and the complete
automated validation suite. EPIC 5 is the next implementation boundary.
