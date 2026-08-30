# Wave Survivor

Wave Survivor is the first standalone FunkSpace game package. It exposes a
minimal lifecycle API for portfolio integration and currently renders a
responsive grey-box arena with deterministic player movement, keyboard and
virtual-joystick input, automatic projectile combat, health, enemy defeat,
loss, and clean restart.

The current gameplay slice uses seeded randomness to sample fair offscreen
spawn candidates by perimeter length. Entering enemies receive static
directional border warnings, become active when their collision circles first
intersect the visible arena, and then continue direct deterministic pursuit.
The runtime caps live enemies, rejects candidates with insufficient contact
time, and removes invalid or fully escaped enemies only beyond a larger logical
despawn boundary. Enemy runtime phases are `entering`, `active`, and `dying`.

## Public API

```ts
import { createGame, type GameStatusSnapshot } from "@funkspace/wave-survivor";

const onStatusChange = (status: GameStatusSnapshot) => {
  // Update semantic DOM only when phase, health, or kill count changes.
};
const game = createGame({ canvas, viewport, theme, onStatusChange });
game.start();
game.pause();
game.resume();
game.restart();
game.setTheme(nextTheme);
game.destroy();
```

`createGame()` returns a fresh `GameController`. Lifecycle calls are
idempotent. `restart()` starts a new session from any non-destroyed state, and
`destroy()` is terminal and safe to repeat. When mount options are supplied,
the factory composes the deterministic runtime, seeded random source, movement
input, and responsive Canvas renderer. A host supplies a canvas, an
independently sized viewport boundary, and resolved `GameTheme` values through
`GameMountOptions`; theme changes are forwarded with `setTheme()`.

Hosts may also supply `onStatusChange`. It receives immutable snapshots with
only `phase`, `currentHealth`, `maximumHealth`, and `killCount`. The callback
receives the initial idle state, then runs only when one of those discrete
values changes. Per-frame positions and entity state remain private to the game
and Canvas renderer.

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
```

Build output is emitted to `dist/` and is not source-controlled.

## Standalone demo

`demo/` is a framework-free HTML entry point that proves the game can run
without the portfolio or Next.js. The demo builds and imports the package's
public JavaScript entry point, creates a game controller, and renders the same
responsive 360 × 640 logical arena as the portfolio host. It has no separate
gameplay or renderer implementation. Semantic health and kill text accompany
the Canvas, loss is announced politely, and a native restart button appears
only after loss.
