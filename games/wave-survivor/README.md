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

Production remains playable through the explicitly named application bridge
`createNextWaveScheduleUntilBossIntegration`. It uses finite normal successors,
then repeats the last normal wave at the boss boundary and beyond, retaining
the existing exhausted-pool recovery endpoint. WS-6.3 must remove this bridge
when real boss entry exists. Boss handoff and victory are **not implemented**
by WS-6.1; the finite model does not create a fake boss or empty-arena victory.
The public API, themes, renderer, and completion condition are unchanged:
queue empty plus no entering/active enemies, with dying artifacts cleaned up.

See the [candidate pacing record](../../docs/features/wave-survivor.md#106-ws-61-candidate-pacing-record--2026-09-05)
for counts, intervals, caps, and provisional review targets. Dimi's latest
explicit table sets enemy totals to `4 / 6 / 8 / 10` and entering/active caps to
`2 / 3 / 4 / 6`, superseding earlier tuning. Wave 3 uses groups of `4 + 4`;
Wave 4 uses `6 + 4` and retains its cap of 6. Group start offsets and intervals
are unchanged. The temporary bridge also uses the retuned last wave.
A reproducible session test (spawn seed 1, upgrade seed 2, stationary player,
`1/60s` updates, Rapid Fire after each completed wave) clears all four normal
waves in `6.95 / 8.58 / 10.48 / 11.88s`, totaling `37.90` simulation seconds
with 28 kills and 2 health remaining.
Earlier tuning measurements are historical. Measurements exclude choice time and the
absent boss; scheduled offsets alone exclude capacity waiting.
PC/phone pacing observations, structure approval, the original 5–7-minute
target, and Gate 2 approval remain pending with Dimi.

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
package root API, renderer, playable repeat bridge, and runtime counters are
unchanged. No live-score system, economy, time bonus, or persistence is added.
The formula remains a candidate pending Dimi's reward approval, not a
playtest-approved decision or Gate 2 completion.

## Public API

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
clearing Wave 16 therefore reaches this endpoint through the temporary bridge.
WS-6.3 removes that bridge; WS-6.5 owns runtime victory behavior.

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
