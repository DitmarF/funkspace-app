# Wave Survivor

Wave Survivor is the first standalone FunkSpace game package. It exposes a
minimal lifecycle API for portfolio integration and currently renders a
responsive grey-box arena with deterministic player movement, keyboard and
virtual-joystick input, automatic projectile combat, health, enemy defeat,
finite waves, between-wave upgrades, loss, and clean restart.

The current gameplay slice uses seeded randomness to sample fair offscreen
spawn candidates by perimeter length. Entering enemies receive static
directional border warnings, become active when their collision circles first
intersect the visible arena, and then continue direct deterministic pursuit.
The runtime caps live enemies, rejects candidates with insufficient contact
time, and removes invalid or fully escaped enemies only beyond a larger logical
despawn boundary. Enemy runtime phases are `entering`, `active`, and `dying`.
Finite schedules apply per-wave active-enemy caps, and seeded upgrade choices
offer Rapid Fire, Swift Movement, and Vitality between waves.

## Gate 1 status

Gate 1 passed on August 30, 2026 after successful PC and real-smartphone manual
reviews and the complete automated validation suite. The accepted grey-box loop
includes movement, enemy pressure, automatic projectile combat, enemy defeat
and kill count, player health and invulnerability, terminal loss, semantic
status, and clean restart.

### Current Gate 1 tuning

| Value                         | Accepted setting |
| ----------------------------- | ---------------: |
| Player speed                  |    `120 units/s` |
| Enemy speed                   |     `72 units/s` |
| Player health                 |              `3` |
| Enemy health                  |              `1` |
| Contact and projectile damage |              `1` |
| First spawn delay             |           `0.5s` |
| Spawn interval                |          `0.75s` |
| Maximum live enemies          |              `4` |
| Minimum contact warning       |          `1.25s` |
| Attack cooldown               |           `1.5s` |
| Projectile speed              |    `320 units/s` |
| Projectile radius             |        `4 units` |
| Player invulnerability        |          `0.65s` |
| Enemy dying display           |         `0.125s` |

## EPIC 5 implementation status

Implementation is complete. Dimi reported PASS for PC and smartphone gameplay
and the standalone upgrade flow (recorded September 4, 2026). The subsequent
EPIC 5 review identified upgrade exhaustion and short-viewport layout issues;
both now have fixes and automated regressions. Those follow-up fixes have not
had a new real-device review. Gate 2 is not yet passed.

## WS-6.1 finite run candidate

The internal `PROVISIONAL_RUN_DEFINITION` now specifies four existing normal
waves followed by one explicit boss encounter. Finite lookup rejects invalid
indexes instead of repeating a wave. Successor resolution requires one upgrade
after each normal wave (four choices, including before the boss), and no upgrade
after final encounter completion. Construction validates nested wave content
and rejects runs whose upgrade opportunities exceed the canonical 15 levels.
Tests cover all 81 legal four-choice paths without pool exhaustion.

WS-6.3 removes the production repeat bridge: the fourth upgrade now enters one
boss. The normal schedule is absent during that final encounter, preventing
additional normal waves or upgrades. Normal completion remains queue empty
plus no entering/active enemies. Victory and terminal stop remain WS-6.5;
an empty boss arena is not treated as victory.

See the [candidate pacing record](../../docs/features/wave-survivor.md#106-ws-61-candidate-pacing-record--2026-09-05)
for counts, intervals, caps, and provisional review targets. Dimi's latest
explicit table sets enemy totals to `4 / 6 / 8 / 10` and entering/active caps to
`2 / 3 / 4 / 6`, superseding earlier tuning. Wave 3 uses groups of `4 + 4`;
Wave 4 uses `6 + 4` and retains its cap of 6. Group start offsets and intervals
are unchanged. The old repeat bridge has been removed by WS-6.3.
A reproducible session test (spawn seed 1, upgrade seed 2, stationary player,
`1/60s` updates, Rapid Fire after each completed wave) clears all four normal
waves in `6.95 / 8.58 / 10.48 / 11.88s`, totaling `37.90` simulation seconds
with 28 kills and 2 health remaining.
Earlier tuning measurements are historical. Measurements exclude choice time and the
absent boss; scheduled offsets alone exclude capacity waiting.
PC/phone pacing observations, structure approval, the original 5–7-minute
target, and Gate 2 approval remain pending with Dimi.

## WS-6.2 charger candidate

`src/domain/enemies/ChargerBoss.ts` defines one provisional charger and its
deterministic **approach → wind-up → charge → recovery** cycle. The existing
session dispatches active charger movement, reusing normal targeting, projectile
hits, contact damage/immunity, and exactly-once defeat counting. Boss actions
are separate from entering/active/dying and add no second body or health owner.

Candidate tuning: 24 health, radius 24, contact damage 1; approach at 48 units/s
for 1.25s; stationary wind-up 0.8s; charge at 280 units/s for at most 0.8s/224
units; stationary recovery 1s. Direction locks at wind-up. First wall contact
ends charge immediately; the body stays inside the arena, and zero-length aim
has a deterministic inward fallback. All active actions remain damage-eligible.
Action deadlines use the existing gameplay simulation clock and freeze on pause.

Real-session fixtures with an already-active boss and a scripted rectangular
route defeated it in **30.82s / 43.13s / 46.00s** for four Rapid Fire / Swift
Movement / Vitality upgrades respectively, without taking damage. These are
simulation diagnostics, not human gameplay, production-entry, or fairness
acceptance. See the [definition and evidence](../../docs/features/wave-survivor.md#107-ws-62-charger-candidate)
for exact configuration, fixture setup, and ideal all-hit duration estimates.

Production entry and static action telegraphs are implemented by WS-6.3/6.4.
Terminal integration belongs to WS-6.5. During entry/telegraph validation,
Dimi evaluates whether the boss offers a distinct positioning challenge on
PC/phone. Final balance is WS-6.10; manual acceptance and Gate 2 are pending.

## WS-6.3 boss entry

After the fourth upgrade, one boss enters straight down from `(180,-96)` at
48 units/s. The warning lasts 1.5s before first visibility and 2.5s until the
full body is inside at `(180,24)`. Player movement remains available; entry
is untargetable and contact-harmless even while partly visible. Pause freezes
entry on the overall simulation clock. Boss-specific cleanup bounds retain
the larger entry safely. Health/upgrades and overall time are preserved.

A static double chevron and text announce the top entry using semantic colors.
The existing `wave-started` event adds optional `encounterKind`; boss entry
sets it to `"boss"`. Both demo and portfolio host announce the boss without a
new event variant. Normal events retain their existing payloads. See the
[entry contract and acceptance record](../../docs/features/wave-survivor.md#108-ws-63-deliberate-boss-entry).

No normal schedule or upgrade follows the boss. Defeating it currently leaves
gameplay running, pending WS-6.5 terminal handling; no victory is inferred from
an empty arena. Action telegraphs are implemented below. Dimi's PC/phone warning and escape
review, including thumb/joystick occlusion, remains pending.

## WS-6.4 static boss action telegraphs

Active boss snapshots carry a copied, frozen `bossAction`: phase, remaining
simulation seconds, and the Domain-calculated charge corridor during wind-up
and charge. The same bounded travel calculation drives movement and warning;
the renderer never predicts a target or endpoint. Direction stays locked after
wind-up begins. Wall contact shortens the charge and immediately starts recovery.

Approach has its label and existing diamond; wind-up adds an inner ring,
countdown, outlined corridor, and endpoint arrow; charge keeps the remaining
corridor/arrow with a heavier outline; recovery shows two bars and a countdown.
All cues are static shapes/text using existing semantic colors, with no flashing,
pulsing, shake, or optional-effects dependency. Pause freezes the countdown/path;
theme and size changes only redraw. Entry/death/restart remove action warnings.

The outlined capsule is the boss's physical **48-unit-wide swept body**, including
rounded ends. The player center needs **more than 12 units beyond its outline**
to avoid contact (combined radii 36); touching counts as contact. Recovery is a
stationary repositioning opportunity, not contact immunity. All active actions
remain contact-dangerous. Focused relative swept-circle checks use actual boss
movement segments and the player's bounded fixed-step displacement; this catches
grazes missed by endpoint sampling while retaining projectile-before-contact
defeat, shared immunity, and normal-enemy behavior.

See the [telegraph contract and collision evidence](../../docs/features/wave-survivor.md#109-ws-64-static-action-telegraphs).
**Pending with Dimi:** smartphone anticipation/avoidance, readable recovery across
themes and simplified effects, thumb/joystick occlusion, and Gate 2. Automated
geometry and rendering checks do not establish perceived fairness. WS-6.5 still
owns terminal handling; WS-6.10 owns final tuning.

## WS-6.6 score candidate

The internal `src/domain/score/CalculateScore.ts` provides a readonly
`ScoreInput`, frozen `SCORE_WEIGHTS`, and pure `calculateScore()` function:

```text
10 * enemiesDefeated + 100 * normalWavesCleared
  + (won ? 500 + floor(100 * currentHealth / effectiveMaximumHealth) : 0)
```

A defeated boss counts as one enemy, never an additional normal wave. Use the
existing kill count, completed finite normal encounters, terminal outcome,
player health, and `getEffectiveMaximumHealth()` after upgrades as inputs.
Counts must be non-negative safe integers; health values must be finite, with
a positive maximum and current health within bounds. Invalid numeric inputs
or unsafe totals throw `RangeError`; a non-boolean win flag throws `TypeError`.
Repeated evaluation is stateless and never accumulates points. Time is not an
input, and losses earn neither victory nor remaining-health bonuses.

For example, a loss with 7 kills and one normal clear scores **170**. A future
win with 29 kills, four normal clears, and full health scores **1290**; at
3/6 upgraded health it scores **1240**. These are arithmetic examples, not
implemented boss/victory results. See [input ownership and examples](../../docs/features/wave-survivor.md#113-ws-66-score-candidate).

WS-6.5 owns session integration (including normal-clear progress, which is not
yet tracked as a terminal score input); WS-6.7 owns result construction. The
scoring rule adds no live-score system, economy, time bonus, or persistence.
The formula remains a candidate pending Dimi's reward approval, not a
playtest-approved decision or Gate 2 completion.

## Public API

`RunResult` is also exported as a type from the package root:

```ts
import type { RunResult } from "@funkspace/wave-survivor";
// { readonly outcome: "won" | "lost"; readonly score: number;
//   readonly waveReached: number; readonly elapsedSeconds: number; }
```

WS-6.7 defines this minimal completion record and the internal pure
`createRunResult()` factory. The factory validates, copies just the four
primitive fields, and freezes the new object at runtime. It rejects invalid
outcomes with `TypeError`, and invalid numeric values with `RangeError`: score
must be a non-negative safe integer, wave reached a positive safe integer,
and elapsed seconds finite and non-negative. Readonly types alone do not
freeze arbitrary objects created by a host.

Wave reached means the highest encounter entered (one-based), including the
boss at `normalWaves.length + 1`, currently 5; it is distinct from normal waves
cleared for scoring. Score comes from `calculateScore()`. Elapsed seconds come
from the overall gameplay simulation clock, including capacity waiting and
boss entry/wind-up, excluding idle, pauses, upgrade selection, and terminal
time. The per-wave schedule clock is unsuitable because it pauses at capacity.

See [field ownership and integration requirements](../../docs/features/wave-survivor.md#155-ws-67-completion-record).
The frontend loader aliases the package type. Result events/UI (WS-6.8),
terminal integration (WS-6.5), and emitted-result preservation across restart
(WS-6.5/9) remain pending. No result is currently emitted or displayed; the
boss entry does not itself complete the run. Dimi's review of
the result information remains pending.

```ts
import {
  createGame,
  type GameEvent,
  type GameStatusSnapshot,
} from "@funkspace/wave-survivor";

const onStatusChange = (status: GameStatusSnapshot) => {
  // Update semantic DOM when phase, wave, health, or kill count changes.
};
const onEvent = (event: GameEvent) => {
  // Announce wave milestones or render event.options for an upgrade choice.
};
const game = createGame({ canvas, viewport, theme, onStatusChange, onEvent });
game.start();
game.pause();
game.resume();
game.restart();
game.chooseUpgrade(selectedUpgradeId);
game.setTheme(nextTheme);
game.destroy();
```

`createGame()` returns a fresh `GameController`. Lifecycle calls are
idempotent. `restart()` starts a new session from any non-destroyed state, and
`destroy()` is terminal and safe to repeat. `chooseUpgrade(id)` returns `true`
only when the ID is a valid pending option; a successful choice applies once
and resumes the existing game loop. When mount options are supplied, the
factory composes the deterministic runtime, seeded random source, movement
input, and responsive Canvas renderer. A host supplies a canvas, an
independently sized viewport boundary, and resolved `GameTheme` values through
`GameMountOptions`; theme changes are forwarded with `setTheme()`.

Hosts may also supply `onStatusChange`. It receives immutable snapshots with
only `phase`, `waveNumber`, `currentHealth`, `maximumHealth`, and `killCount`.
The callback receives the initial idle state, then runs only when one of those
discrete values changes. Per-frame positions and entity state remain private to
the game and Canvas renderer.

A published `wave-cleared` status with no subsequent upgrade request is the
temporary exhausted-upgrade endpoint. Hosts should offer `restart()` here.
The demo announces “All upgrades maxed” and focuses its Restart button. The
session stays frozen, keeps the cleared wave number, and emits no empty
upgrade-choice request. The three five-level upgrades allow 15 selections;
this defensive exhaustion endpoint is unreachable in the finite four-choice
run. The old Wave 16 repeat endpoint was removed by WS-6.3. WS-6.5 owns runtime
victory behavior.

The optional `onEvent` callback receives frozen `wave-started`, `wave-cleared`,
and `upgrade-choice-requested` events. Upgrade-choice events contain a frozen
array of copied `{ id, title, description }` option DTOs; effect definitions,
runtime entities, scheduler state, and random sources remain private.

Wave completion establishes a clean transition boundary: completed-wave
projectiles and dying presentation states are removed, movement input is reset,
and the gameplay clock, schedule, cooldowns, entities, health, and random
streams remain frozen while an upgrade choice is pending. Player position,
health, invulnerability deadline, kills, simulation time, and accumulated
upgrades carry into the next wave. Only a valid `chooseUpgrade(id)` initializes
that wave and resumes the existing loop.

The game clears all movement input on pause, restart, window blur, document
visibility loss, pointer interruption, and destruction. Hosts pause and resume
the controller when their page visibility changes so hidden time is never
simulated on return; both the portfolio `GameHost` and standalone demo follow
that lifecycle contract.

## Package boundaries

- `src/domain/` owns deterministic game state, rules, actions, and port
  contracts. It must remain independent of browser and rendering APIs.
- `src/application/` coordinates the game session and lifecycle through Domain
  contracts.
- `src/infrastructure/` implements browser clocks, input, persistence, audio,
  randomness, and other external adapters.
- `src/renderer/` owns game-specific drawing and renderer implementations.
- `src/index.ts` is the only package entry point. Export public integration
  contracts deliberately; internal layers remain private.

The frontend loader mirrors the event and selection contract, but the current
React `GameHost` does not render upgrade controls. The standalone demo is the
playable upgrade flow; the portfolio shell remains EPIC 7 work.

The package uses project-owned TypeScript modules and browser primitives. It
does not use React, Next.js, Phaser, or another game engine, and it must not
import frontend source.

## Commands

From the repository root:

```bash
pnpm --filter @funkspace/wave-survivor typecheck
pnpm --filter @funkspace/wave-survivor test
pnpm --filter @funkspace/wave-survivor build
pnpm --filter @funkspace/wave-survivor demo
pnpm --filter @funkspace/wave-survivor demo:build
pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config playwright.demo.config.ts
```

Build output is emitted to `dist/` and is not source-controlled.

## Standalone demo

`demo/` is a framework-free HTML entry point that proves the game can run
without the portfolio or Next.js. The demo builds and imports the package's
public JavaScript entry point, creates a game controller, and renders the same
responsive 360 × 640 logical arena as the portfolio host. It has no separate
gameplay or renderer implementation. Semantic wave, health, and kill text
accompany the Canvas. A keyboard- and pointer-operable DOM upgrade panel uses
the public event and controller contracts. Its scrollable panel overlays the
game with absolute positioning and a width independent of the portrait Canvas.
On short screens it uses a fixed overlay with screen-edge margins. Opening,
scrolling, and closing the panel leave the game layout and page scroll unchanged.
Loss and upgrade exhaustion are announced politely and expose a native Restart
button. Browser regressions use public-contract fixtures with the actual demo
markup and handlers, checking normal/short portrait, landscape, 200% text, full
heading/option reachability, layout stability, selection focus, and
exhausted-pool restart.
