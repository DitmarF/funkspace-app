# Wave Survivor — Game Concept

> Intended repository path: `docs/features/wave-survivor.md`

## Document metadata

- **Status:** Approved starting concept
- **Product stage:** Gate 1 approved / Gate 2 in progress; WS-6.1/6.2/6.3/6.6 candidates and WS-6.7 record boundary implemented
- **Owner:** Dimi
- **Working title:** Wave Survivor
- **Target platform:** Modern web browsers
- **Primary form factor:** Mobile, portrait orientation
- **Secondary form factors:** Tablet and desktop
- **Last updated:** 2026-09-05
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

The game is wave-based rather than endless. WS-6.1 establishes **four normal waves followed by one boss** as the provisional candidate, pending Dimi's approval and measured pacing review. The original **5–7 minute** target remains pending validation; the current normal-wave diagnostic is much shorter and content must not be padded to hit that target.

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
  readonly startOffsetSeconds: number;
  readonly enemyId: string;
  readonly count: number;
  readonly intervalSeconds: number;
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

The internal `RunDefinition` now explicitly configures the normal waves and a
final `{ kind: "boss" }` encounter. Its zero-based encounter lookup rejects
invalid or out-of-range indexes. Successor resolution requires one upgrade
after every normal wave, including Wave 4 before the boss at encounter index 4
(position 5). Completing the boss resolves run completion without an upgrade;
WS-6.5 now connects that progression rule to confirmed boss defeat and victory.

WS-6.3 removes the production repeat bridge. The fourth valid upgrade enters
one boss at encounter 5, with no normal-wave schedule or subsequent upgrade.
Normal-wave completion still requires an empty queue and no entering/active
enemies. WS-6.5 implements boss terminal handling; an empty boss arena is not
treated as victory or another normal-wave clear.

If every upgrade has reached its cap, completing the wave leaves the game
frozen in `wave-cleared`. The standalone demo displays “All upgrades maxed”
and offers Restart. With three five-level upgrades this occurs after clearing
Wave 16. This is a temporary recovery endpoint, not the final victory rule.

### 10.6 WS-6.1 candidate pacing record — 2026-09-05

Content remains in the existing `PROVISIONAL_EPIC_5_WAVES` definitions and is
validated when constructing `PROVISIONAL_RUN_DEFINITION`. All normal enemies
remain the existing basic type using random-perimeter spawning.

Dimi's latest explicit table sets totals `4 / 6 / 8 / 10` and entering/active
caps `2 / 3 / 4 / 6`, superseding the earlier tuning tables and percentage
adjustments. Existing groups are retained: Wave 3 uses `4 + 4`, and Wave 4
uses `6 + 4` enemies. Wave 4 retains its concurrent cap of 6.
Group start offsets, spawn intervals, combat stats, and upgrades are unchanged.

| Encounter        | Enemy count | Group start offsets / spawn intervals   |     Entering + active cap | Last scheduled spawn offset | Upgrade afterward | Provisional clear-time review target           |
| ---------------- | ----------: | --------------------------------------- | ------------------------: | --------------------------: | ----------------- | ---------------------------------------------- |
| Normal Wave 1    |           4 | `0.5s / 1s`                             |                         2 |                      `3.5s` | One               | About `7s`, diagnostic only                    |
| Normal Wave 2    |           6 | `0.5s / 0.85s`                          |                         3 |                     `4.75s` | One               | About `9s`, diagnostic only                    |
| Normal Wave 3    |       4 + 4 | `0.5s / 0.8s`; `4.5s / 0.7s`            |                         4 |                      `6.6s` | One               | About `10s`, diagnostic only                   |
| Normal Wave 4    |       6 + 4 | `0.5s / 0.7s`; `5s / 0.6s`              |                         6 |                      `6.8s` | One, before boss  | About `12s`, diagnostic only                   |
| Boss, position 5 | One charger | Top-center, 1.5s lead / 2.5s full entry | One boss, no normal queue |         Not a wave schedule | None after boss   | Active fixtures recorded; human review pending |

The clear-time review targets are provisional, not approved human pacing or
gameplay timers. Earlier diagnostic targets are superseded by this explicit
tuning and still need human pacing validation. Pressure rises through counts
`4 → 6 → 8 → 10` and caps `2 → 3 → 4 → 6`; overlapping spawn groups still
respect the existing queue and capacity rules. Human acceptance is pending.

**Executed deterministic evidence:** `GameRuntimeSessionRun.test.ts` drives the
existing session at `1/60s`, with spawn seed `1`, upgrade seed `2`, zero movement,
unmodified health/combat, and Rapid Fire after each completed wave.
The stationary player clears all four normal waves in **6.95 / 8.58 / 10.48 /
11.88 simulation seconds**, totaling **37.90s**, with 28 kills and 2 health
remaining. The test verifies the configured concurrent caps throughout.
No injected kills or skipped spawn requests are used in this diagnostic. A separate
completed-queue transition fixture verifies all four upgrade opportunities and
the real boss handoff; it is not pacing or full-run gameplay evidence.

Historical comparison: the doubled-count/cap version cleared Wave 1 in 12.37s
with 2 health, then lost in Wave 2 at 23.68 total simulation seconds under the
same stationary seed/step/Rapid Fire policy. That loss describes the previous
tuning. The original-value sample cleared four waves in 37.93s without health
loss. The previous `6 / 9 / 12 / 16` table produced a Wave 3 loss at 32.42s.
These historical results do not describe the latest table. Human difficulty
acceptance remains pending.

**Measurement boundaries:** scheduled offsets are due times on the capacity-
gated wave schedule. At a full cap, that schedule waits while simulation time
and combat continue. Fairness retries and final enemy cleanup can add further
time. Last spawn offsets (or their `21.65s` sum) therefore do not measure run
duration. Simulated clear time includes that gameplay waiting, but excludes
paused/choice time and the absent boss. Human-observed start-to-result duration
must be recorded separately, with pause and upgrade-choice time identified.

**Pending manual acceptance — Dimi:** record PC and real-phone device/browser,
per-wave clear times, upgrade-choice time, pressure/readability observations,
and approve or revise the four-normal-plus-boss candidate. Measure full
start-to-result and boss duration after WS-6.3/5 integration. EPIC 5's recorded
PC/phone PASS contains no pacing measurements and does not approve this
candidate. The 5–7-minute target and Gate 2 approval remain pending. Do not add
waves or enemies solely to fill that duration.

### 10.7 WS-6.2 charger candidate

One charger is implemented in `domain/enemies/ChargerBoss.ts` and dispatched by
the existing session when a charger is active. Normal waves still spawn only
basic enemies. WS-6.3 now makes the boss reachable after the fourth upgrade;
the original WS-6.2 isolated fight diagnostics below remain historical fixtures.

The action cycle is **approach → wind-up → charge → recovery → approach**.
`EnemyState` distinguishes basic and charger bodies by kind. The charger adds
only its action/deadline and, during wind-up/charge, a locked unit direction.
Position, health, contact damage, dying deadline, and defeat count stay in the
same enemy/session fields used by normal combat. Entering/active/dying remains
the separate lifecycle; no boss action is a global game phase.

| Provisional value                  |                                 Setting |
| ---------------------------------- | --------------------------------------: |
| Maximum health                     |                                      24 |
| Collision radius / diameter        |                   24 / 48 logical units |
| Contact damage                     | 1, using existing 0.65s player immunity |
| Approach speed / duration          |                      48 units/s / 1.25s |
| Wind-up duration                   |                        0.8s, stationary |
| Charge speed / maximum duration    |                      280 units/s / 0.8s |
| Maximum unobstructed charge travel |                               224 units |
| Recovery duration                  |                          1s, stationary |
| Uninterrupted action cycle         |     3.85s; wall contact shortens charge |

The existing overall gameplay simulation time sets deadlines. Updates split
at action boundaries, so a charge cannot consume wind-up/recovery time.
Pausing the session freezes both the clock and action state. The first active
update starts approach; WS-6.3 entry uses its deliberate top-edge path without an action clock.
Active boss centers stay within the arena inset by their collision radius.

Wind-up locks aim toward the player's position clamped to that reachable inset;
moving afterward does not redirect the charge. Coincident aim falls back toward
arena center, then downward if both centers coincide. This avoids normalizing
zero and repeated outward charges at a wall. The charge stops at first wall
contact and begins recovery immediately, without sliding, reflecting, leaving
the arena, or waiting forever for an unreachable target. Boundary/fallback
handling is tested; WS-6.3 now supplies the production entry layout below.

All active actions remain targetable and contact-dangerous, including stationary
wind-up/recovery. Entering/dying bosses are ineligible. Existing nearest-target
selection, projectile damage, contact immunity, and active-to-dying handling
are reused; a projectile defeat increments the existing kill count once before
same-update contact resolution. There is no boss projectile, summon, damage
multiplier, separate health pool, or parallel combat path.

**Deterministic active-fight evidence — 2026-09-05:** application fixtures use
the real session, attack, collisions, damage, and boss motion at `1/60s`, spawn
seed 1 / upgrade seed 2. Boss starts active at `(180,160)`; player starts at
`(180,480)`, with four levels of one upgrade and full effective health. Scripted
movement follows `(60,480) → (60,160) → (300,160) → (300,480)`, switching within
4 units. A far-future normal spawn request isolates the fight and prevents the
normal-wave completion path; it is not production boss progression or victory.

| Four-choice build | Effective cooldown / speed / max health | Simulated boss defeat | Player health at defeat | Ideal all-hit firing span (estimate) |
| ----------------- | --------------------------------------- | --------------------: | ----------------------: | -----------------------------------: |
| Rapid Fire ×4     | `1.5/1.4 ≈ 1.0714s` / 120 units/s / 3   |                30.82s |                       3 |                               24.64s |
| Swift Movement ×4 | 1.5s / 168 units/s / 3                  |                43.13s |                       3 |                               34.50s |
| Vitality ×4       | 1.5s / 120 units/s / 7                  |                46.00s |                       7 |                               34.50s |

The ideal estimate is `(24 − 1) × effectiveCooldown` from first shot to last,
assuming all 24 one-damage projectiles hit. It excludes first-shot delay, flight,
misses, fixed-step cooldown quantization, and entry. Fixture defeat times include
the actual attack pipeline and all active actions; they exclude production
entry, normal waves, choice time, and human reaction. They are not PC/phone
measurements or evidence of the 5–7-minute run target. The scripted route took
no damage across all three builds, which does not establish a fair or distinct
movement challenge for a person. No health padding was added to fill run time.

**Dependent acceptance:** WS-6.3 has integrated entry and finite handoff; WS-6.4
has added static action telegraphs; WS-6.5 now integrates terminal boss defeat
without normal-wave upgrade handling. WS-6.8 now delivers the result event/demo UI.
WS-6.10 owns final tuning. After entry and telegraphs exist, Dimi must evaluate
on PC/phone whether the charger tests positioning rather than merely adding a
large health pool, and assess timing, damage fairness, edge behavior, and build
durations. That human review and Gate 2 remain pending.

### 10.8 WS-6.3 deliberate boss entry

The last valid normal-wave upgrade resolves the existing finite successor and
creates exactly one charger. `RuntimeState.waveSchedule` is now nullable: its
normal schedule remains the progression authority; `null` explicitly marks the
final boss encounter. The displayed encounter is derived from the normal
schedule or `normalWaves.length + 1`, never stored in a second counter. The
production repeat-last-wave function is removed. No normal schedule, upgrade
selection, or normal-wave completion can follow the boss, even if the arena is
empty. WS-6.5 now finalizes confirmed boss defeat; no empty-arena victory is inferred.

Entry is provisional **top-center, straight downward**, without tracking the
player. The radius-24 boss starts at `(180,-96)` and moves at 48 units/s.
The warning precedes first visibility by **1.5 simulation seconds**, versus the
normal 0.75s lead. Entry ends after **2.5s**, at `(180,24)`, with the whole body
inside. All entering bosses are untargetable and cannot deal contact damage,
including while partially visible. On activation they use the existing attack
and contact rules; remaining at the entry point then becomes dangerous.

Entry start time belongs to the boss's existing enemy state; position and
lifecycle have no duplicate owner. It uses the overall gameplay clock and
freezes on pause. Player movement remains available. Completed-wave enemies
and projectiles are cleared; health (including the selected upgrade's normal
effect), upgrades, immunity deadline, kills, and overall run time carry forward.
Boss cleanup bounds are derived from its radius, speed, and entry lead: the
outer offset is 160 logical units. Generic validity and cleanup still apply;
the larger entry cannot be deleted merely for using normal-enemy bounds.

The renderer receives only an optional `entryWarning: "boss"` on the copied,
frozen enemy snapshot. It draws a static double chevron at the top and
**BOSS INCOMING / Move clear of the top entry** in existing semantic colors.
It also draws the partially visible body; actors stay above the warning so it
does not hide the player. The message and shape require neither animation nor
color discrimination. WS-6.4 now adds the active action telegraphs below.

For the concrete screen-reader/DOM announcement need, the existing
`wave-started` event adds optional `encounterKind: "normal-wave" | "boss"`.
Boss entry emits `{ type: "wave-started", waveNumber: 5, encounterKind: "boss" }`;
legacy normal events omit the field. No new event variant was added. The demo
and portfolio host announce “Boss entering from the top. Move clear of the
entry point.” The demo restores Canvas movement focus after upgrade choice;
the frontend loader mirrors the public type without exposing internals.

Automated fixtures check one spawn, preserved progress, no successor, partial
visibility, cleanup retention, pause/resume, restart/destroy during entry, and
nine starting points: four corners, four edge midpoints, and center. At base
movement speed they escape without damage even after a 1.5s scripted reaction
delay. This is deterministic evidence of an escape route, not human acceptance.

**Pending manual acceptance — Dimi:** check warning visibility and escape
fairness on PC and a real phone, especially near the top entry and with
thumb/joystick occlusion. Check dark/high-contrast readability and reduced
motion. Human warning timing approval and Gate 2 remain pending. WS-6.4 provides
static action telegraphs; WS-6.5 owns victory and stopping terminal gameplay.

### 10.9 WS-6.4 static action telegraphs

**Implemented, provisional tuning:** `getBossActionTelegraph()` copies and freezes
only the active action phase, remaining simulation seconds, and optional charge
path into the existing enemy render snapshot. Its nested positions/direction are
frozen copies, not references to mutable runtime state. No new public event,
package export, theme role, timer, loop, or effects setting is introduced.

Wind-up and charge use the same Domain `chargeTravel()` calculation as actual
movement: locked direction, speed × remaining charge duration, and first contact
with the radius-inset arena bounds. Wind-up shows the entire forthcoming charge;
charge shows only its remaining travel. Aim never follows the player after the
wind-up starts. A wall-clipped charge begins recovery immediately at that wall.
No warning remains on entry, defeat/dying, restart, or destroyed-session redraw.

| Action   | Essential presentation                                                      |
| -------- | --------------------------------------------------------------------------- |
| Approach | Existing diamond body and `APPROACH` label                                  |
| Wind-up  | Inner ring, `WIND-UP` countdown, outlined capsule, endpoint direction arrow |
| Charge   | Remaining capsule/arrow with heavier outline and `CHARGE` label             |
| Recovery | Two stationary bars inside the body and `RECOVER` countdown                 |

Countdowns round remaining simulation time upward to tenths of a second. They
freeze on pause, as do movement and path geometry. Labels stay inside the arena;
endpoint arrows point along the supplied direction and sit inside the endpoint
so walls do not hide them. Warnings draw before actors. Existing background,
enemy, and effect semantic colors are sufficient. Static shapes and text carry
all meaning in monochrome and reduced motion, without flashing, opacity pulses,
screen shake, or optional effects. Resize/theme changes redraw the same snapshot.

**Width and clearance:** the capsule outlines the actual radius-24 boss body
swept along its center segment: 48 units wide, with circular ends. A radius-12
player needs its center **more than 12 units beyond that outline**, or more than
36 units from the center segment, to avoid collision. Tangency counts as contact.
The warning is not a damage beam or an enlarged hitbox. All active boss actions,
including wind-up and recovery, remain contact-dangerous; recovery means a
stationary positioning/shooting window, not permission to overlap the body.

**Collision evidence:** at the production `1/60s` step, a 280-unit/s charge moves
4.667 units. With four movement upgrades, opposite player movement can make
relative travel 7.467 units (7.667 at the canonical five-level cap). Small steps
alone do not exclude grazing misses. A deterministic fixture moves the boss from
`(100,200)` to `(104.667,200)` past a stationary player at `(102.333,235.99)`:
both endpoint distances exceed the combined radius 36, but the swept minimum is
35.99. Focused relative swept-circle checks now catch this case and exact tangent
contact; 36.01 clearance stays safe.

Boss advancement returns transient linear segments split at action deadlines and
first wall contact, including stationary wind-up/recovery portions. Contact math
interpolates the player's bounded fixed-step displacement over each segment's
time fraction and checks the closest relative point. This avoids a false single
chord through a stopped or waiting boss. Traces/contact IDs live only for that
update; they do not become another position/health authority. The shared contact
resolver still checks active eligibility, immunity, and lowest ID **after** all
projectile hits/defeats. Normal enemies retain their existing contact behavior.

The three recorded scripted fight fixtures still produce 30.82s / 43.13s /
46.00s and unchanged health with the focused sweep. They remain simulation
diagnostics, not human observations or tuning approval.

**Manual acceptance — 2026-09-05:** Dimi reports “all manual tests a PASS” for
the WS-6.4 handoff: smartphone anticipation/avoidance, recovery readability across
supported themes and simplified effects, thumb/joystick occlusion, and the
requested boundary/corner and PC readability checks. No device models, measured
durations, or additional observations were supplied. This is Dimi's acceptance
of those checks, separate from automated evidence. It does not approve the new
WS-6.5 terminal behavior, final tuning, or Gate 2.

### 10.10 WS-6.5 terminal completion

`RuntimePhase` includes `won`. `RuntimeState.result` starts null and holds one
frozen `RunResult` after completion; the internal session getter returns that
same object. Application owns one `finalizeRun()` path for both outcomes, reusing
the pure WS-6.6 score calculation and WS-6.7 constructor. It validates/calculates
the result, commits result/outcome/health and clears pending choices, then resets
movement and calls the existing discrete status observer. No score calculation
occurs in rendering or status. WS-6.8 now publishes the same committed record
before terminal status, as specified below; no second result schema is introduced.

Victory requires the existing valid active-to-dying transition for a charger in
the final encounter (null normal schedule), retained within boss cleanup bounds.
That transition increments the existing kill count once and reports a transient
confirmed-defeat flag for the current update. Missing/invalid/escaped bodies,
entering or already-dying bodies, normal encounters, and empty arenas cannot
substitute for this confirmation. There is no persistent duplicate defeat flag.

**Outcome precedence preserves combat ordering:** a player already defeated at
update start loses at the current clock without processing enemies. Otherwise
movement, projectile hits and enemy defeats precede contact, as before. A boss
killed by projectiles cannot deliver even an otherwise lethal contact that step.
If a different surviving enemy delivers lethal contact, loss wins precedence;
the confirmed boss kill still contributes to the loss score. After contact, the
overall clock is committed, then player defeat selects loss, otherwise confirmed
final boss defeat selects victory. The outcomes are mutually exclusive.

**Score/progress/time ownership:** kills come from `killCount`; normal clears are
derived from the current normal encounter number minus one, or the finite run's
normal count during the boss. Finalization only occurs from playing, so earlier
normal encounters necessarily passed completion and upgrade before this entry.
The current encounter is not credited as a normal clear merely for being reached.
The boss contributes one kill and zero normal clears. Effective maximum health
comes from upgrades. Result time samples the overall gameplay clock including
the completing step, capacity waiting, boss entry and wind-up; idle, pauses,
upgrade choice and terminal time are excluded. No wall clock or wave-local clock
is used. A win at 29 kills, four clears, and 5/7 health scores
`290 + 400 + 500 + floor(500/7) = 1261`; a wave-3 loss with 12 kills scores
`120 + 200 = 320`, with no victory/health bonus.

Terminal phases reject start/resume/choices and fixed updates, preserving clocks,
actors, health, attacks, progression and the result. The existing loop suspension
draws one terminal frame, then schedules no successor. The static Canvas terminal
marker supports WON as well as LOST; the existing demo announcement/restart
control supports both. These are minimal lifecycle feedback, not the WS-6.8
result screen. Theme/resize redraws remain usable without combat updates.

The committed result is visible internally before terminal status callbacks.
Callbacks may synchronously restart or destroy: finalization returns immediately
after notification, and the loop checks its existing generation after update and
render callbacks so an old frame cannot consume new-run time or suspend it.
Restart initializes all state, including a null result; previously retained result
references stay frozen and unchanged. Destroy remains terminal and leaves any
retained result intact while releasing runtime resources.

Automated coverage includes win/loss scores and time, final-upgrade entry and
wind-up, lethal ordering, false-win cases, duplicate updates, frozen state/result,
restart retention, status-callback restart/destroy, loop suspension, terminal
render/theme/resize and demo restart compatibility. WS-6.8 adds tested result
publication and standalone UI below; WS-6.9 owns comprehensive
fresh-run replay equivalence.

**Pending manual acceptance — Dimi:** confirm boss defeat visibly ends gameplay.
This new check is not covered by the preceding WS-6.4 manual PASS. Final tuning
and Gate 2 approval remain pending.

## 11. Upgrades and progression

### 11.1 Between-wave choice

After each normal wave, including the last one before the boss, the player chooses one upgrade from a small set. The candidate has four upgrade opportunities; victory never offers another upgrade. The simulation remains paused until the choice is made.

The initial upgrade set modifies existing rules through three focused choices:

- **Rapid Fire:** increase fire rate by `10%` per level;
- **Swift Movement:** increase movement speed by `10%` of its original base value per level;
- **Vitality:** increase maximum health by `1` and immediately heal `1` health.

Each initial upgrade has five levels. Rapid Fire retains a safe minimum cooldown of `0.6s`. Damage, recovery-only, projectile-size, and additional-projectile upgrades are deferred until playtesting demonstrates that the three-choice set needs expansion.

Run construction rejects more normal-wave upgrade opportunities than the
canonical pool's 15 available levels. Each legal selection consumes one level;
four choices cannot exhaust this pool. Exhaustive coverage of all 81 four-choice
paths confirms all three options remain available at each candidate choice,
including repeated selection of the same upgrade. WS-6.3 removed the temporary
Wave 16 exhaustion endpoint with the repeat bridge.

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

### 11.3 WS-6.6 score candidate

Earn **10 points per defeated enemy**, **100 per cleared normal wave**, and,
only on victory, **500 plus the rounded-down percentage of health remaining**.
These candidate rewards are implemented as pure arithmetic; Dimi's approval
of what the score rewards is pending, and the formula is not playtest-approved.
Dimi requested keeping the current values for now on 2026-09-05; this retains
the provisional candidate without recording final reward or playtest approval.

```text
score = 10 * enemiesDefeated
      + 100 * normalWavesCleared
      + (won ? 500 : 0)
      + (won ? floor(100 * currentHealth / effectiveMaximumHealth) : 0)
```

The internal `domain/score/CalculateScore.ts` module contains `ScoreInput`,
frozen `SCORE_WEIGHTS`, and `calculateScore()`. The function returns a number
without modifying its inputs or storing/accumulating points. Elapsed time is
not a score input; WS-6.7 may include it in results for later display, with no
time bonus or penalty. No live-score counter, persistence, currency, spending,
or leaderboard is introduced.

| Score input              | Authoritative owner / integration obligation                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enemiesDefeated`        | Existing `RuntimeState.killCount`, incremented once when `transitionEnemyToDying()` succeeds. WS-6.5 includes the defeated boss once through that same path; no parallel kill counter.                                                                                                                                                                                                                                        |
| `normalWavesCleared`     | Application derives completed **normal** encounters from the finite run's progression and existing `isWaveComplete()` boundary (queue empty and no entering/active enemies). A wave merely reached is not cleared; the boss is never a normal-wave clear. WS-6.5 derives this at terminal completion as current normal encounter minus one, or the finite normal count during the boss; no duplicate mutable scoring counter. |
| `won`                    | Authoritative terminal outcome from WS-6.5, not inferred from health, kills, an empty arena, or upgrade exhaustion. WS-6.5 now implements confirmed boss-defeat victory.                                                                                                                                                                                                                                                      |
| `currentHealth`          | Existing `RuntimeState.player.currentHealth` at the outcome boundary.                                                                                                                                                                                                                                                                                                                                                         |
| `effectiveMaximumHealth` | Existing `getEffectiveMaximumHealth(player.maximumHealth, state.upgrades)` at the same boundary, including Vitality; never use the unchanged base maximum alone.                                                                                                                                                                                                                                                              |

The WS-6.1 candidate still has four normal waves and one boss. Current normal
content totals 28 enemies, so a completed boss contributes enemy 29 while the
normal-wave count remains four. Boss counting is tested with numeric inputs;
it is not evidence of victory integration. WS-6.3 now enters the real boss at
encounter 5. Scoring is still not wired into runtime outcomes or the renderer.

| Example                                          | Calculation                        | Score |
| ------------------------------------------------ | ---------------------------------- | ----: |
| No progress, not won, full health                | `0 + 0`                            |     0 |
| Loss: 7 enemies, 1 normal wave                   | `70 + 100`                         |   170 |
| Loss to boss after 28 enemies and 4 normal waves | `280 + 400`                        |   680 |
| Win: 29 enemies, 4 normal waves, full health     | `290 + 400 + 500 + 100`            |  1290 |
| Same win at 2 / 3 health                         | `290 + 400 + 500 + floor(200 / 3)` |  1256 |
| Same win at 3 / 6 upgraded health                | `290 + 400 + 500 + 50`             |  1240 |

Equal health percentages earn the same bonus: `1/2`, `2/4`, and `3/6` all award
50 health points on victory. Loss awards neither victory nor health points,
even if supplied a valid nonzero health value. All numeric inputs are validated
on loss too: counts must be non-negative safe integers; maximum health must be
finite and positive; current health must be finite and within `[0, maximum]`.
Health need not be integral. Invalid numbers or an unsafe total throw
`RangeError`; a non-boolean `won` throws `TypeError`. There is no clamping or
silent repair. The result must be a non-negative safe integer. The arithmetic
does not validate whether the supplied outcome/progress is reachable; that
belongs to session integration.

**Integration:** WS-6.5 now supplies coherent application inputs and uses WS-6.7
result construction. WS-6.8 publishes the committed result and displays it in the demo.
Dimi must approve these rewards. Automated arithmetic tests do not provide
human scoring approval or Gate 2 acceptance.

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

### 15.5 WS-6.7 completion record

`RunResult` is a public package type owned by `domain/result/RunResult.ts`.
Hosts import it from `@funkspace/wave-survivor`; the frontend `GameLoader`
re-exports that same type instead of maintaining a second result schema.

```ts
interface RunResult {
  readonly outcome: "won" | "lost";
  readonly score: number;
  readonly waveReached: number;
  readonly elapsedSeconds: number;
}
```

- `outcome`: the authoritative terminal win/loss decision from application integration.
- `score`: the output of WS-6.6 `calculateScore()`, using authoritative kills, completed normal encounters, terminal outcome, and effective health after upgrades. Result construction does not recalculate or accumulate points.
- `waveReached`: the highest encounter actually entered, numbered from one. The boss follows all normal waves (`normalWaves.length + 1`, currently 5). Losing during wave 2 means wave reached 2, even with only one normal wave cleared; entering the boss means 5 reached and four normal waves cleared. An offered successor is not entered until gameplay resumes into it.
- `elapsedSeconds`: the existing overall `RuntimeState.simulationTimeSeconds` sampled at completion. Include gameplay waiting at enemy capacity and boss entry/wind-up. Exclude idle, pauses, upgrade selection, and time after the terminal boundary. Do not use wall-clock time or `waveSchedule.elapsedSeconds`, which resets per wave and pauses at capacity. Keep fractional seconds; formatting belongs to the future UI. Time does not affect score.

The internal pure `createRunResult()` validates and copies only those four
primitive values, then calls `Object.freeze()`. Neither later mutation of the
input nor future session state replacement can change that record; extra
properties are not copied. TypeScript `readonly` describes the public contract,
while construction supplies the runtime freeze. A host-created object that
merely satisfies the interface has no automatic freeze guarantee.

Invalid outcomes throw `TypeError`. Score must be a non-negative safe integer,
wave reached a positive safe integer, and elapsed seconds finite and
non-negative; invalid numeric values throw `RangeError`. Zero elapsed time is
valid, but encounter zero is not. The factory validates the record's numeric
shape, not whether a run could produce those values. Application integration
must validate actual finite progression and coherent terminal inputs; there is
no hard-coded five-encounter cap in this reusable record boundary.

**Implemented:** record construction/validation, runtime freeze, package type
export, and frontend type alias. `GameEvent` and `GameStatusSnapshot` are
unchanged. The factory is internal; hosts receive the type only for now.

**Integration:** WS-6.5 now commits terminal results using the gameplay clock and
actual encounter progression, including boss entry/wind-up. It tests preservation
of retained result references across restart. WS-6.8 now implements delivery/UI and
automated event acceptance; WS-6.9 adds replay equivalence tests. Dimi reports the
WS-6.8 newcomer/result-flow checks PASS (2026-09-05); Gate 2 is not approved.

### 15.6 WS-6.8 result publication and standalone flow

The public `GameEvent` union adds
`{ readonly type: "run-finished"; readonly result: RunResult }`. The package root
already exports both types; the frontend loader now aliases the whole package
event union, avoiding another schema. The portfolio host handles this variant
explicitly without rendering a result screen (EPIC 7 owns that UI).

**Completion notification order:** the shared terminal finalizer calculates and
commits outcome, immutable result and progress/time first, resets movement, sets
the session's per-run publication guard, then invokes `onEvent(run-finished)`.
The frozen event contains the exact frozen `session.result` reference, not a
recalculation or mutable runtime reference. Only after this event does terminal
`onStatusChange` run, and only if the session is not destroyed and still owns the
same completed state. Thus a completion-event callback can restart/destroy
without stale terminal status overwriting a new run. A terminal-status callback
can restart/destroy after the result is already delivered. Existing loop generation
checks stop obsolete frame work. Duplicate/reentrant updates cannot republish;
restart clears the guard for the next run. Abandoned restarts and destruction of
unfinished runs emit no completion. No generic event bus or extra scheduler exists.

**Standalone experience:** the game remains idle until the native Start button
is activated. Brief instructions explain WASD/arrows, the phone's lower-left
joystick, automatic firing, four waves/upgrades and the boss. Start focuses the
Canvas. Visibility changes only pause/resume through existing phase guards;
returning to the page cannot start an idle or terminal run.

The demo uses explicit cases for all four event variants. `run-finished` clears
stale upgrade options and shows a labelled semantic section with an outcome
heading, a definition list for score/wave reached/elapsed time, and a native Replay
button. All values come from the delivered `RunResult`; elapsed time is formatting
only (`floor(seconds/60):floor(seconds%60)`, seconds padded to two digits). There
is no DOM clock, score arithmetic, or per-frame update. Focus moves to the outcome
heading and Tab reaches Replay; a polite live region announces the summary.
Replay clears old panels/values, calls existing `restart()`, and focuses the Canvas.
Only the defensive exhausted-upgrade fallback uses the older Restart control.

The panels reuse the existing overlay/scroll layout, native controls and semantic
system colors. Short portrait/landscape panels fill the viewport and scroll from
the top; enlarged text can reach both headings and buttons. Essential content
requires no motion. Start, upgrade, result, and replay listeners are released on
page teardown. The portfolio remains unchanged in scope beyond event compatibility.

**Evidence separation:** real session/controller tests cover both outcomes,
exactly-once publication, frozen payloads, abandoned runs, multiple completed runs,
and event/status callbacks that restart/destroy. Browser result tests use a mock
public host and real DOM; they are UI evidence, not real boss defeat or score
verification. A separate browser test uses the actual runtime for idle/keyboard
Start and injected visibility changes. Keyboard/joystick adapters retain their
existing automated coverage; Start/Replay also have native touch/keyboard tests.

**Manual update — 2026-09-05:** Dimi reports WS-6.8 manual checks PASS: newcomer
Start, understandable outcome and reachable Replay. No device models or timing
measurements were supplied. This records human confirmation separately from
automation; it does not approve full-run tuning or Gate 2.

### 15.7 WS-6.9 immediate replay

`restart()` stops the existing loop, resets input and both seeded random streams,
replaces the session state using `createInitialRuntimeState()`, resets completion
publication, then starts that same loop. The initial-state source owns health,
upgrades/choices, score inputs, progression, clocks, IDs, attack/invulnerability
deadlines and empty enemy/projectile collections. Removing the old enemy collection
also removes boss entry/actions and all derived telegraphs. No reset service or
second controller exists. Production seeds and deterministic replay policy stay
unchanged. Frozen result references retained by observers remain valid.

The loop clears its accumulator and timestamp at restart; its generation guard
prevents old frames from continuing. Session restart now checks state identity
after the status callback before sending wave-started, preventing duplicate
notifications after a nested restart. The controller respects a callback that
pauses/destroys the replacement run. Terminal publication remains once per run.

The keyboard adapter ignores repeat keydown events: cleared input needs a new
press. Existing pointer reset releases capture; stale move/cancel events cannot
activate a new gesture. Adapters, listeners, Canvas, theme and resize observer are
preserved. The demo clears stale panels, uses existing restart, and restores focus.
A queued Start/Replay activation while hidden immediately pauses before any frame
can run and defers focus until visible. Visibility return cannot revive a terminal
or idle game; page teardown removes handlers and terminally destroys the controller.

**Automated evidence:** session fixtures compare full state and event/status/render
sequences across fresh wins/losses and three replays, including spawn randomness,
upgrade order, four choices and all boss actions. They inject normal-enemy defeats
and player invulnerability to isolate lifecycle behavior; they are not unassisted
full-fight/pacing evidence. Separate boss-state reset fixtures cover entry,
approach, wind-up, charge and recovery. Controller/input/renderer tests cover
accumulator reset, paused/upgrade states, callback restart/pause/destroy, held keys,
pointer cancellation, listener/observer reuse and final teardown. Browser tests
separate actual-runtime hidden activation from mocked alternating result/UI checks.

**Pending manual handoff:** Dimi repeats Replay at least three times on PC and
smartphone, including wins and losses; verifies fresh health/upgrades, no stale
boss/projectiles/results and usable focus/joystick; interrupts held keyboard or
touch input, releases/cancels and confirms neutral movement; switches tabs/apps
around Replay and checks for hidden progression or a return-time jump. This new
task's real-device confirmation, final tuning and Gate 2 remain pending.

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
2. Approval and measured pacing of the WS-6.1 four-normal-wave candidate; boss duration and the original 5–7-minute target remain pending.
3. Final enemy archetype roster and boss behavior.
4. Final upgrade list and choice-generation rules.
5. Approval of the WS-6.6 score candidate; result integration and best-score presentation remain pending.
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
automated validation suite. EPIC 5 finite waves, deterministic upgrade choices,
public events, controller selection, standalone upgrade UI, and frozen
between-wave transition cleanup are now implemented. Dimi reported PC and
smartphone gameplay checks PASS (recorded September 4, 2026). The follow-up
review's upgrade-exhaustion and short-viewport fixes have automated regression
coverage; renewed real-device review of those fixes remains pending.
Gate 2 has not passed. The portfolio host shares the API but its upgrade UI
remains deferred to EPIC 7.
