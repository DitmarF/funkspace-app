# FunkSpace games workspace

The `games/` directory is the parent workspace for standalone FunkSpace game projects. Each future direct child may become an independent pnpm package:

```text
games/
  <game-slug>/
    package.json
```

There is no game package or game source code yet. This README does not make `games/` itself a package; pnpm will discover a future `games/<game-slug>` only when that child contains a `package.json`.

## Purpose

Use this workspace for games that need their own package boundary, dependencies, build, tests, or deployment lifecycle. Portfolio pages and small embedded experiments remain in `frontend` unless their feature plan justifies a standalone package.

Each game should own its:

- Manifest, dependencies, scripts, and build configuration.
- Domain rules, application/session control, infrastructure adapters, and presentation.
- Assets, tests, accessibility behavior, performance budget, and lifecycle cleanup.
- Feature plan and game-specific documentation.

Follow [`ADR-003`](../docs/decisions/ADR-003-interactive-experience-boundary.md) for isolation and [`ADR-004`](../docs/decisions/ADR-004-game-development-architecture.md) for the first game's lightweight engine.

## Isolation rules

- A game is a standalone product boundary, not a folder of components for the portfolio shell.
- Do not import private source files from `frontend`, `backend`, another game, or a future shared package.
- Do not let `frontend` import a game's private engine, renderer, state, or lifecycle code.
- Declare every runtime and development dependency in the game's own `package.json`; do not rely on hoisted or transitive dependencies.
- Keep game rules and state transitions deterministic and framework-free. Put rendering, input, audio, persistence, clocks, and randomness behind explicit boundaries.
- Keep real-time loops outside React render. Pause when inactive and release animation frames, observers, listeners, timers, and audio on teardown.
- Scope browser globals, storage keys, styles, and event handlers to the game.
- Preserve keyboard, pointer, and touch access where applicable. Provide understandable reduced-motion and non-animated states.
- Keep the first game's custom engine private. Shared game infrastructure requires a second real consumer and a separate architecture decision.
- A game may expose a deliberate public artifact or integration contract, but its internal source tree is never a public API.

## Relationship with `frontend`

`frontend` owns the portfolio, design-system presentation, and integrated web experiences. A standalone game may be linked from the portfolio or integrated through an explicit public build/runtime contract.

The boundary is directional:

```text
frontend -> link, embed contract, or deployed game
frontend -/-> game private source
game     -/-> frontend private source
```

Games must not import frontend components, hooks, services, Tailwind configuration, or application internals. If multiple applications need the same UI, extract a supported shared UI package only after reuse is demonstrated.

Shared visual and motion decisions still originate in the root `tokens/` sources according to [`ADR-002`](../docs/decisions/ADR-002-design-token-source-of-truth.md). A game feature plan must define a supported build-time consumption path without importing `frontend` internals. If multiple packages need versioned token artifacts, create a dedicated token package through a separate migration.

## Relationship with `common`

`common` is currently a placeholder directory, not a package. Games must not import from it today.

If `common` is activated later, a game may depend on its public API only when:

- At least two workspaces share the same stable contract or deterministic rule.
- `common` has its own manifest and explicit exports.
- The game declares a workspace dependency in its own manifest.
- The shared code remains environment-neutral and has no dependency on a game, `frontend`, or `backend`.

Game-specific simulation, rendering, controls, and orchestration remain inside the game. Do not use `common` as a general utility or engine directory.

## Adding a future game package

Before adding code:

1. Copy `docs/templates/feature-plan.md` to `docs/features/<game-slug>.md` and define scope, architecture, controls, accessibility, performance, tests, rollout, and rollback.
2. Create `games/<game-slug>/package.json` with a unique private package name and explicit scripts and dependencies.
3. Define the package's public integration contract, if one is needed.
4. Add targeted root/CI commands; the current root build intentionally builds only `frontend`.
5. Verify pnpm discovery, type checking, tests, production build, and any deployment configuration for the new package.

Do not add a framework, shared engine, backend dependency, or cross-package source import without the feature plan and applicable ADR review.
