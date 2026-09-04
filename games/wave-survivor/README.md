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
clearing Wave 16 therefore reaches this endpoint. EPIC 6 owns the final run
length and victory behavior.

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
