# Task WS-0 — Establish the implementation baseline

> Shared execution record for WS-0.3 through WS-0.6. WS-0.3 scaffold inspection, WS-0.4 package validation, and WS-0.5 frontend validation are complete; WS-0.6 remains pending.

## Task metadata

- **Status:** In progress
- **Task group or epic:** EPIC 0 — Establish the implementation baseline
- **Owner:** Dimi
- **Execution date:** 2026-08-23
- **Last updated:** 2026-08-23
- **Plan approval:** The user explicitly approved WS-0.2 and the implementation plan on 2026-08-23. The plan file's existing `Ready for review` metadata was not changed during WS-0.3 because this task is limited to the execution note.
- **Related documentation:**
  - [`AGENTS.md`](../../AGENTS.md)
  - [`Wave Survivor concept`](../features/wave-survivor.md)
  - [`Wave Survivor implementation plan`](../features/wave-survivor-implementation-plan.md)
  - [`Architecture`](../architecture.md)
  - [`Workspace package responsibilities`](../architecture/packages.md)
  - [`Design token hierarchy`](../architecture/design-tokens.md)
  - [`AI development workflow`](../development/ai-workflow.md)
  - [`ADR-002`](../decisions/ADR-002-design-token-source-of-truth.md)
  - [`ADR-003`](../decisions/ADR-003-interactive-experience-boundary.md)
  - [`ADR-004`](../decisions/ADR-004-game-development-architecture.md)

## Requested outcome

Record the actual Wave Survivor package and portfolio-integration baseline without changing runtime behavior, configuration, dependencies, generated output, or existing public contracts. Keep this note active through the remaining EPIC 0 validation and scope-audit tasks.

### Acceptance criteria from the request

- [x] The execution note exists.
- [x] It records repository identity and environment.
- [x] It records the current public API.
- [x] It records relevant scripts and tests.
- [x] It distinguishes existing foundations from missing gameplay.
- [x] It records verified mismatches with the approved concept.
- [x] It distinguishes verified facts from assumptions.
- [x] WS-0.3 left WS-0.4, WS-0.5, and WS-0.6 visibly pending at its completion.
- [x] WS-0.3 changes documentation only.
- [x] WS-0.4 package validation is complete.
- [x] WS-0.5 frontend validation is complete.
- [ ] WS-0.6 scope-firewall audit and EPIC 0 status are complete.

## Context and repository evidence

### Evidence labels

- **Verified fact:** observed directly in the repository, Git, or installed tool output on the execution date.
- **Approved direction:** established by the approved concept, approved implementation plan, or accepted ADR.
- **Pending:** deliberately not executed or decided during WS-0.3.
- **Assumption:** none was required for the scaffold inventory. Future implementation suggestions in the roadmap remain proposals until their task begins.

### Repository identity

| Item                    | Verified value                                                        |
| ----------------------- | --------------------------------------------------------------------- |
| Repository path         | `/Users/dimi/Projects/funkspace-app`                                  |
| Execution date          | `2026-08-23`                                                          |
| Branch                  | `feature/wave-survivor`                                               |
| HEAD                    | `3508d8900ba7e41ab55ff381b6cb83ae19adea1f`                            |
| Initial working tree    | Clean; `git status --short --untracked-files=all` returned no entries |
| Initial untracked files | None                                                                  |
| Node                    | `v22.22.0`                                                            |
| PNPM                    | `10.30.3`                                                             |

### WS-0.4 environment confirmation

| Item                        | Verified WS-0.4 value                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| Execution date              | `2026-08-23`                                                                                         |
| Branch                      | `feature/wave-survivor`; unchanged from WS-0.3                                                       |
| HEAD                        | `b0205d866a9ff3a68c52fdac1f82b63ff6cb2627`                                                           |
| HEAD change since WS-0.3    | Advanced from `3508d8900ba7e41ab55ff381b6cb83ae19adea1f` through the committed WS-0.3 execution note |
| Initial WS-0.4 working tree | Clean; no tracked or visible untracked changes                                                       |
| Node                        | `v22.22.0`; unchanged                                                                                |
| PNPM                        | `10.30.3`; unchanged                                                                                 |

### WS-0.5 environment confirmation

| Item                        | Verified WS-0.5 value                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| Execution date              | `2026-08-23`                                                                                         |
| Branch                      | `feature/wave-survivor`; unchanged from WS-0.4                                                       |
| HEAD                        | `64801a3020c87e6534640e5b12c3785d594e77cf`                                                           |
| HEAD change since WS-0.4    | Advanced from `b0205d866a9ff3a68c52fdac1f82b63ff6cb2627` through the committed WS-0.4 execution note |
| Initial WS-0.5 working tree | Clean; no tracked or visible untracked changes                                                       |
| Node                        | `v22.22.0`; unchanged                                                                                |
| PNPM                        | `10.30.3`; unchanged                                                                                 |

### Authoritative sources

Authority is applied in this order for this execution record:

1. The user request and its acceptance criteria.
2. Root [`AGENTS.md`](../../AGENTS.md).
3. The approved [`Wave Survivor concept`](../features/wave-survivor.md).
4. Accepted ADR-002, ADR-003, and ADR-004.
5. Current code, manifests, workspace configuration, scripts, and tests.
6. The user-approved [`implementation plan`](../features/wave-survivor-implementation-plan.md).
7. Current architecture and workflow Markdown.

Historical PDFs and editor-specific material were not used as current authority.

### Inspected paths

- Root governance and tooling: `AGENTS.md`, `package.json`, `pnpm-workspace.yaml`, `vitest.config.ts`, and `style-dictionary.config.mjs`.
- Feature and architecture documentation: both Wave Survivor feature documents, `docs/architecture.md`, files under `docs/architecture/`, the AI workflow, task template, and ADR-002 through ADR-004.
- Package manifests: `frontend/package.json`, `common/package.json`, and `games/wave-survivor/package.json`.
- Game package: `games/wave-survivor/README.md`, all files under `games/wave-survivor/demo/` and `games/wave-survivor/src/`, and `games/wave-survivor/vitest.config.ts`.
- Frontend integration: all files and nearby tests under `frontend/features/games/`.
- Shared foundations: `common/generated/`, `common/motion/`, and their tests.
- Token source and generation: `tokens/fs.game.tokens.json` and the active Style Dictionary configuration.
- Usage searches: game-package imports, `GameHost` consumers, hard-coded `960 × 540` dimensions, browser-loop/input/audio/storage APIs, frontend imports from the game, and relevant test files.

### Current behavior

The repository contains a private, standalone TypeScript package and a frontend-owned lazy integration boundary. A controller can own a Canvas renderer reference and resolved theme values, but it advances no gameplay, schedules no frames, processes no input, and draws nothing. The frontend host can lazy-load and start that empty controller, forward live theme changes, pause or resume it on document visibility, and destroy it on cleanup. No application route currently renders `GameHost`.

## Current package boundary

### Workspace and package identity

| Concern                        | Verified baseline                                                    |
| ------------------------------ | -------------------------------------------------------------------- |
| Workspace membership           | Root `package.json` and `pnpm-workspace.yaml` both include `games/*` |
| Package name                   | `@funkspace/wave-survivor`                                           |
| Package status                 | Private ESM package, version `0.0.0`, `sideEffects: false`           |
| Runtime dependencies           | None                                                                 |
| Development dependencies       | TypeScript, Vite, and Vitest                                         |
| Public package export          | Root export `"."` only                                               |
| Runtime entry                  | `dist/index.js` after `tsc` build                                    |
| Type/development entry         | `src/index.ts`                                                       |
| Source-controlled build output | No; `dist/` is build output                                          |

The package keeps Domain, Application, Infrastructure, and Renderer folders separate. Only the root package export is public; the layer index files are not package export paths.

### Public package entry point

`games/wave-survivor/src/index.ts` exports:

- `createGame`;
- `GameController` as a type;
- `GameMountOptions` as a type;
- `GameTheme` as a type.

The current factory signature is:

```ts
createGame(options?: GameMountOptions): GameController
```

Mount options remain optional so lifecycle-only tests can create a controller without browser resources. When options exist, `createGame` composes a `CanvasGameRenderer` and passes it to `GameControllerImpl`.

### Public lifecycle

| Method            | Verified current behavior                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| `start()`         | Transitions `idle` to `running`; otherwise no effect                                                         |
| `pause()`         | Transitions `running` to `paused`; otherwise no effect                                                       |
| `resume()`        | Transitions `paused` to `running`; otherwise no effect                                                       |
| `restart()`       | Sets any non-destroyed controller to `running`; no gameplay state exists to reset                            |
| `setTheme(theme)` | Forwards the theme to the presentation port before destruction                                               |
| `destroy()`       | Transitions to `destroyed`, destroys the presentation once, clears its reference, and is terminal/idempotent |

`GameControllerImpl` additionally exposes `lifecycleState` internally as one of `idle`, `running`, `paused`, or `destroyed`. This state and implementation class are not exported from the package root.

### Mount and theme contracts

`GameMountOptions` contains:

- `canvas: HTMLCanvasElement`;
- `theme: GameTheme`.

`GameTheme` contains resolved string values for exactly five color roles:

- `background`;
- `player`;
- `enemy`;
- `projectile`;
- `effect`.

The type is renderer-neutral and readonly. It exposes no FunkSpace theme name, CSS variable, DOM attribute, token path, or frontend service.

### Renderer boundary

`CanvasGameRenderer` implements `GamePresentationPort`, which currently contains only `setTheme()` and `destroy()`. The renderer retains the mounted Canvas and current theme, accepts theme replacement while mounted, and clears both references on destruction. It has no draw, resize, update, scene, or frame-loop operation.

### Standalone demo

The framework-free demo:

- imports `createGame` from `../dist/index.js`;
- requires a Canvas and status element;
- uses a `960 × 540` Canvas;
- derives five resolved color strings from computed Canvas styles;
- creates and starts the empty game;
- sets `data-game-state="started"` and announces `Empty game started.`;
- destroys the controller once on `pagehide`.

The Canvas is CSS-responsive by width but keeps the temporary landscape backing dimensions and aspect ratio. The demo has no input, visibility pause/resume, gameplay status, or drawing.

## Current frontend integration

| Area                 | Verified behavior                                                                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lazy loading         | `GameLoader` uses an explicit importer map; `wave-survivor` resolves through `import("@funkspace/wave-survivor")` only when requested                                   |
| Host ownership       | `GameHost` is a client component that owns the Canvas ref, load status, game controller, theme subscription, and visibility listener                                    |
| Canvas handoff       | The host passes its actual Canvas plus the current resolved `GameTheme` to `createGame`                                                                                 |
| Start behavior       | The host calls `start()` after the lazy module resolves; it then pauses immediately if the document is hidden                                                           |
| Theme adaptation     | `FunkSpaceGameThemeAdapter` maps `ThemeService` resolved themes through generated `colors[theme].game` values                                                           |
| Live themes          | Theme subscriptions call `controller.setTheme()` after controller creation and keep the most recent theme for delayed creation                                          |
| Visibility lifecycle | `visibilitychange` calls `pause()` while hidden and `resume()` while visible                                                                                            |
| Cleanup              | Unmount removes the visibility listener, unsubscribes the theme adapter, destroys the controller once, and prevents late lazy-load completion from creating an instance |
| Failure behavior     | A rejected load produces the accessible status `Game unavailable.` and does not leave a controller                                                                      |
| React state          | React stores only `loading`, `ready`, or `error`; no per-frame entity or position state exists                                                                          |
| Current dimensions   | `GameHost` defaults to `width=960` and `height=540`; callers may override both                                                                                          |
| Current route use    | No route or component outside this feature currently renders `GameHost`                                                                                                 |

### Frontend-owned integration contracts

`frontend/features/games/` currently defines structural copies or subsets of game public contracts:

- `HostedGameController`;
- `GameMountOptions`;
- `GameModule`;
- `GameTheme`.

The loader itself is the only frontend code that imports the game package, and it imports only the public package entry. The copied shapes are currently compatible with the game package but can drift independently.

## Existing tests

| Exact test path                                                   | Current coverage                                                                                                                                              |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `games/wave-survivor/src/application/GameControllerImpl.test.ts`  | Factory returns lifecycle methods; idempotent start/pause/resume; restart from idle/paused; terminal repeated destroy; theme forwarding before destroy        |
| `games/wave-survivor/src/renderer/CanvasGameRenderer.test.ts`     | Canvas/theme ownership; theme replacement; clearing references on destroy; ignoring later theme changes                                                       |
| `frontend/features/games/GameLoader.test.ts`                      | Importer remains lazy; Wave Survivor loads through the public package entry                                                                                   |
| `frontend/features/games/GameHost.test.tsx`                       | Canvas handoff; initial theme; controller start; live theme updates; visibility pause/resume; theme unsubscribe; controller destroy; lazy-load failure status |
| `frontend/features/games/theme/FunkSpaceGameThemeAdapter.test.ts` | Five resolved roles; all four supported themes; frozen output; no CSS-variable values; current-theme mapping; subscription mapping and cleanup                |
| `common/motion/easing.test.ts`                                    | Renderer-neutral easing presets, custom Bézier parsing, fallbacks, and interpolation                                                                          |
| `common/motion/interpolation.test.ts`                             | Clamping and numeric interpolation                                                                                                                            |
| `common/motion/timeline.test.ts`                                  | Pure tween resolution, sampling, seek, and injected-delta advancement                                                                                         |

### Obvious uncovered baseline behavior

- No automated test builds or opens the standalone demo, verifies its status, or exercises `pagehide` cleanup.
- No integration test uses the real `createGame({ canvas, theme })` package implementation through the real `GameHost`; host tests use a fake module/controller.
- The default and overridden `GameHost` Canvas dimensions are not asserted.
- The host's initially-hidden lazy-load path is not directly asserted.
- No test asserts behavior for unmount while the lazy import is still pending.
- No route or end-to-end test covers a hosted game because no route currently renders the host.
- No drawing, resize, simulation, input, combat, wave, audio, or persistence tests exist because those systems are absent.
- WS-0.4 and WS-0.5 now record the passing package, focused integration, frontend typecheck, and full repository test baselines.

## Existing scripts and planned baseline commands

### Root scripts relevant to the game

| Script                 | Current command and role                                         |
| ---------------------- | ---------------------------------------------------------------- |
| `pnpm test`            | Runs root `vitest run`; includes repository unit/component tests |
| `pnpm lint`            | Runs frontend Next lint and repository Prettier check            |
| `pnpm build`           | Typechecks `@funkspace/common`, then invokes the frontend build  |
| `pnpm build:tokens`    | Runs Style Dictionary using `style-dictionary.config.mjs`        |
| `pnpm e2e`             | Runs Playwright; no current Wave Survivor route coverage         |
| `pnpm storybook:build` | Builds Storybook after token generation                          |

Root Vitest uses `jsdom`, excludes `e2e/**`, and discovers repository tests. The game package has its own Node-environment Vitest configuration for game source tests.

### Game package scripts

| Script         | Current command                        |
| -------------- | -------------------------------------- |
| `typecheck`    | `tsc -p tsconfig.json --noEmit`        |
| `test`         | `vitest run --config vitest.config.ts` |
| `build`        | `tsc -p tsconfig.json`                 |
| `demo`         | `pnpm build && vite demo`              |
| `demo:build`   | `pnpm build && vite build demo`        |
| `demo:preview` | `vite preview demo`                    |

### Frontend and common scripts relevant to the game

- `pnpm -F frontend exec tsc --noEmit` performs the planned frontend typecheck.
- `pnpm -F frontend build` first builds Wave Survivor and then runs `next build`.
- `pnpm -F frontend dev` first builds Wave Survivor and then starts Next on port 3000.
- `pnpm -F frontend build:tokens` delegates token generation to the workspace root.
- `pnpm -F @funkspace/common typecheck` typechecks the shared package.

### WS-0.4 planned package validation

These commands are recorded but were not run during WS-0.3:

```bash
pnpm --filter @funkspace/wave-survivor typecheck
pnpm --filter @funkspace/wave-survivor test
pnpm --filter @funkspace/wave-survivor build
pnpm --filter @funkspace/wave-survivor demo:build
```

### WS-0.5 frontend validation commands

These commands were recorded during WS-0.3 and later ran during WS-0.5:

```bash
pnpm exec vitest run \
  frontend/features/games/GameLoader.test.ts \
  frontend/features/games/GameHost.test.tsx \
  frontend/features/games/theme/FunkSpaceGameThemeAdapter.test.ts
pnpm -F frontend exec tsc --noEmit
pnpm test
```

The focused test command provides direct integration evidence. The broader root test remains part of the EPIC 0 baseline described by the approved plan.

## Existing abstractions and reusable foundations

### Application lifecycle

`GameControllerImpl` provides a small, idempotent lifecycle state machine and terminal destruction. It is an orchestration scaffold, not the approved gameplay phase model.

### Renderer boundary

`GamePresentationPort` keeps Canvas ownership outside the application controller. `CanvasGameRenderer` already accepts host resources and theme changes without exposing them to Domain code.

### Theme adapter and generated tokens

`FunkSpaceGameThemeAdapter` is the sole observed portfolio-to-game theme bridge. It consumes generated TypeScript colors rather than CSS variables and returns frozen five-role themes. `tokens/fs.game.tokens.json` aliases shared semantic values for default, dark, muted, and dark-high-contrast modes.

The active Style Dictionary configuration reads the game token source with the shared color and motion sources, then generates:

- `styles/tokens.css`;
- `common/generated/colors.ts`;
- `common/generated/motion.ts`;
- `common/generated/themes.ts`.

Generated files contain explicit do-not-edit headers and are exported through `@funkspace/common`.

### Pure motion utilities

`@funkspace/common/motion` publicly exports:

- easing functions and lookup/parsing;
- clamping and numeric interpolation;
- pure tween/timeline resolution, sampling, seeking, and injected-delta advancement;
- renderer-neutral motion types;
- the `AnimationRuntime` lifecycle type.

The utilities own no browser clock, `requestAnimationFrame`, DOM, Canvas, input, or rendering. Wave Survivor does not currently import them.

### Standalone demo

The Vite demo proves the package can build and start without React, Next.js, Tailwind, or frontend source. Its actual build result remains pending WS-0.4.

### Public package boundary

The frontend dependency on the game is declared in `frontend/package.json`; `frontend/next.config.ts` transpiles the package. The only observed runtime import is the explicit lazy importer in `frontend/features/games/GameLoader.ts`. No game source imports frontend code.

## Intentionally absent gameplay

| System                      | Verified current state                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Simulation loop             | Absent; no `requestAnimationFrame`, accumulator, fixed step, or clock adapter exists in the game package     |
| Gameplay phases             | Absent; only lifecycle states `idle`, `running`, `paused`, and `destroyed` exist                             |
| Movement                    | Absent; no player state, velocity, bounds, or movement rules                                                 |
| Input                       | Absent; no keyboard, pointer, joystick, blur, or visibility input adapter in the game                        |
| Enemy behavior              | Absent; no enemy state, spawning, pursuit, phase, or randomness implementation                               |
| Combat                      | Absent; no targeting, projectile, collision, health, damage, invulnerability, death, or score rules          |
| Waves                       | Absent; no wave definitions, scheduling, caps, or completion rules                                           |
| Upgrades                    | Absent; no definitions, option generation, public selection API, or phase flow                               |
| Boss                        | Absent                                                                                                       |
| Audio                       | Absent                                                                                                       |
| Persistence                 | Absent; no game storage adapter or stored state                                                              |
| Real drawing                | Absent; the renderer stores Canvas/theme references but never requests a context or issues a drawing command |
| Resize and DPR handling     | Absent                                                                                                       |
| Game-owned accessibility UI | Absent; current accessible status and Canvas label belong to the demo or frontend host                       |

## Verified mismatches with the approved concept

No observed mismatch blocks WS-0.4 or WS-0.5. All four requested checks are present and deferred rather than fixed.

| Observed mismatch                                             | Evidence                                                                                                         | Classification                                                                   | Roadmap disposition                                                   |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Temporary landscape dimensions versus approved portrait world | Demo Canvas and `GameHost` default to `960 × 540`; no `360 × 640` arena exists                                   | **Expected baseline; deferred roadmap work; not a blocker**                      | EPIC 1, especially WS-1.1 and WS-1.9–WS-1.10                          |
| Frontend-owned copies of public integration contracts         | `GameLoader.ts` and `theme/GameTheme.ts` duplicate/subset `GameController`, `GameMountOptions`, and `GameTheme`  | **Deferred roadmap work; architecture concern due to drift risk; not a blocker** | EPIC 7 WS-7.1 audits and consolidates public types                    |
| Lifecycle scaffold without approved gameplay phases           | Controller has `idle/running/paused/destroyed`, not `idle/playing/wave-cleared/choosing-upgrade/paused/won/lost` | **Expected baseline; deferred roadmap work; not a blocker**                      | EPIC 2 wires runtime lifecycle; EPIC 5 and EPIC 6 add gameplay phases |
| Canvas ownership without gameplay drawing                     | Renderer only stores Canvas/theme and clears references                                                          | **Expected baseline; deferred roadmap work; not a blocker**                      | EPIC 1 adds grey-box drawing; later epics add entity/effect rendering |

### Additional verified baseline observations

- No frontend route currently renders `GameHost`. This is expected pre-integration state and is deferred to EPIC 7.
- `GameHost` resumes whenever the document becomes visible; it does not yet distinguish a future manual pause from a visibility pause. No manual pause UI exists, so this is deferred lifecycle work for EPIC 7 rather than a current blocker.
- `docs/architecture/packages.md` contains an early current-state sentence saying no application code imports Wave Survivor, while the current `GameLoader` does import its public package entry and a later section of the same document describes that adapter. This is a documentation inconsistency, not a runtime boundary violation; the import occurs in the permitted frontend-owned adapter.
- The implementation plan metadata still says `Ready for review` even though the user approved the plan on 2026-08-23. WS-0.3 records the approval but does not modify the plan because the requested diff is limited to this execution note.

## Scope

### In scope

- Repository and environment inspection.
- A durable execution note shared by WS-0.3 through WS-0.6.
- Verified public API, package, integration, script, test, abstraction, and missing-gameplay inventory.
- Mismatch classification.
- Exact future validation-command inventory.

### Out of scope

- Running WS-0.4 or WS-0.5 validation commands.
- Gameplay, drawing, bug fixes, public API changes, type consolidation, host sizing, route integration, or file reorganization.
- Dependency, package, workspace, token, generated-output, configuration, or accepted-ADR changes.
- Resolution of open product decisions or deferred roadmap work.

### Protected areas

- No game framework, WebGL renderer, generic engine, generic ECS, or speculative shared abstraction.
- No backend activation or server dependency.
- No parallel theme manager or direct game access to portfolio CSS variables, DOM theme state, or `ThemeService`.
- No frontend source imported by `games/wave-survivor/`.
- No per-frame game state in React.
- No hand edits to `styles/tokens.css` or `common/generated/`.
- No private-source import from the frontend; integration stays at the game package root.
- No unrelated frontend refactor.
- No runtime, public contract, package, dependency, configuration, or generated-file change during WS-0.3.

## Planned changes

| Path                                                   | Status    | Planned change                   | Boundary or reason                                        |
| ------------------------------------------------------ | --------- | -------------------------------- | --------------------------------------------------------- |
| `docs/tasks/ws-0-establish-implementation-baseline.md` | Existing  | Update and retain through WS-0.6 | Durable EPIC 0 inspection, validation, and handoff record |
| Runtime and configuration paths                        | Protected | No change                        | EPIC 0 remains baseline-only                              |

### Implementation sequence

1. Inspect authoritative documentation, Git/environment identity, manifests, implementation, tests, scripts, tokens, and shared foundations.
2. Record only verified baseline facts and explicitly label deferred work.
3. Run documentation-only formatting and diff checks.
4. Leave package/frontend validation and final scope audit pending.

## Dependencies and risks

- **Internal dependencies:** Approved concept, approved implementation plan, accepted ADRs, current package public API, frontend adapter boundary, token generation contract, and shared motion package.
- **External dependencies:** None.
- **Primary risks:** Recording plan statements as facts without code evidence; accidentally treating deferred work as a WS-0.3 fix; obscuring duplicated contracts; claiming unrun validation passed; allowing this note to become stale during WS-0.4 through WS-0.6.
- **Mitigations:** Path-level inspection, evidence labels, explicit mismatch classifications, pending validation sections, exact commands, and an overall `In progress` status.

## Validation plan

WS-0.3 runs documentation checks only:

```bash
pnpm exec prettier --check \
  docs/tasks/ws-0-establish-implementation-baseline.md
git diff --check
git status --short
```

### Manual checks

1. Confirm the final diff changes only this execution note.
2. Confirm repository identity, API signatures, lifecycle methods, mount/theme contracts, dimensions, test paths, and scripts match inspected files.
3. Confirm facts, approved direction, deferred work, and pending validation are distinguishable.
4. Confirm all links from this note resolve.
5. At WS-0.3 completion, confirm WS-0.4, WS-0.5, and WS-0.6 remain pending.

## WS-0.4 package validation — Complete

- **Status:** Complete.
- **Execution environment:** Branch `feature/wave-survivor`, HEAD `b0205d866a9ff3a68c52fdac1f82b63ff6cb2627`, Node `v22.22.0`, PNPM `10.30.3`.
- **Package baseline:** **PASS**
- **Failure reproduction:** Not applicable; all commands passed on their first attempt.

### Command results

Commands ran from the workspace root in the approved order.

| Exact command                                       | Result | Exit status | Relevant evidence                                                                                                                                    | Output and working-tree effect                                                                                                                                                                    | Classification |
| --------------------------------------------------- | ------ | ----------: | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `pnpm --filter @funkspace/wave-survivor typecheck`  | Pass   |         `0` | `tsc -p tsconfig.json --noEmit` completed with no diagnostic output                                                                                  | Emitted no files; `git status --short` remained empty                                                                                                                                             | pass           |
| `pnpm --filter @funkspace/wave-survivor test`       | Pass   |         `0` | Vitest `v3.2.4`: 2 test files passed, 7 tests passed; `CanvasGameRenderer.test.ts` 2 tests and `GameControllerImpl.test.ts` 5 tests; duration 178 ms | Emitted no repository output; `git status --short` remained empty                                                                                                                                 | pass           |
| `pnpm --filter @funkspace/wave-survivor build`      | Pass   |         `0` | `tsc -p tsconfig.json` completed with no diagnostic output                                                                                           | Refreshed 48 ignored files under `games/wave-survivor/dist/`; no tracked or visible untracked change                                                                                              | pass           |
| `pnpm --filter @funkspace/wave-survivor demo:build` | Pass   |         `0` | Re-ran the package build, then Vite `v7.0.2` transformed 8 modules and built in 38 ms                                                                | Refreshed `games/wave-survivor/demo/dist/index.html` (1.24 kB; gzip 0.61 kB) and `assets/index-OuOKItC6.js` (2.01 kB; gzip 0.90 kB), plus package `dist/`; no tracked or visible untracked change | pass           |

### Generated-artifact review

- `games/wave-survivor/dist/` existed before WS-0.4 and was already ignored. The build refreshed 48 JavaScript, source-map, declaration, and declaration-map files.
- `games/wave-survivor/demo/dist/` existed before WS-0.4 and was already ignored. The demo build refreshed two files.
- `git status --short --ignored` continued to report both output directories with `!!`; neither entered the tracked or visible untracked diff.
- No generated file was committed, promoted to source, or hand-edited.
- No output was removed because both directories predated WS-0.4 and are expected ignored package/demo build artifacts.

### Working-tree review

- The working tree was clean before the first command.
- `git status --short` remained empty after each of the four commands.
- After recording results, the only intended tracked change is this execution note.

### Package-baseline classification

**Package baseline: PASS**

The package typecheck, 7-test suite, TypeScript build, and standalone demo production build all pass on the recorded toolchain. There are no exceptions, blockers, reproducibility investigations, or repair scopes to carry forward from WS-0.4.

## WS-0.5 frontend validation — Complete

- **Status:** Complete.
- **Execution environment:** Branch `feature/wave-survivor`, HEAD `64801a3020c87e6534640e5b12c3785d594e77cf`, Node `v22.22.0`, PNPM `10.30.3`.
- **Frontend baseline:** **PASS**
- **Failure reproduction:** Not applicable; all commands passed on their first attempt.

### Command results

Commands ran from the workspace root in the approved order. The focused Vitest syntax was supported as supplied, so no substitute command was needed.

| Exact command                                                                                                                                                               | Result | Exit status | Relevant evidence                                                                                        | Working-tree effect                                       | Classification |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------: | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | -------------- |
| `pnpm exec vitest run frontend/features/games/GameLoader.test.ts frontend/features/games/GameHost.test.tsx frontend/features/games/theme/FunkSpaceGameThemeAdapter.test.ts` | Pass   |         `0` | Vitest `v3.2.4`: 3 test files passed, 8 tests passed; theme adapter 4, loader 2, host 2; duration 679 ms | `git status --short --untracked-files=all` remained empty | pass           |
| `pnpm -F frontend exec tsc --noEmit`                                                                                                                                        | Pass   |         `0` | TypeScript completed with no diagnostic output                                                           | `git status --short --untracked-files=all` remained empty | pass           |
| `pnpm test`                                                                                                                                                                 | Pass   |         `0` | Root Vitest `v3.2.4`: 24 test files passed, 341 tests passed; duration 1.97 s                            | `git status --short --untracked-files=all` remained empty | pass           |

### Required integration-behavior review

| Required baseline behavior                                 | Verified by existing coverage and inspection                                                                                           |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Game package is lazy-loaded                                | Yes. `GameLoader.test.ts` verifies the importer is not called before `load`, and `GameLoader.ts` uses an explicit dynamic import.      |
| Loading state is communicated                              | Yes. `GameHost.test.tsx` verifies the initial `Loading game…` status.                                                                  |
| Load failure is communicated                               | Yes. `GameHost.test.tsx` verifies rejected loading produces `Game unavailable.`.                                                       |
| Host supplies a Canvas and resolved theme                  | Yes. `GameHost.test.tsx` verifies both values passed to `createGame`.                                                                  |
| Controller starts once                                     | Yes. `GameHost.test.tsx` verifies one `start` call.                                                                                    |
| Theme changes are forwarded                                | Yes. `GameHost.test.tsx` verifies `setTheme` receives a resolved changed theme.                                                        |
| Document visibility pauses and resumes                     | Yes. `GameHost.test.tsx` verifies hidden and visible transitions.                                                                      |
| Unmount destroys the controller                            | Yes. `GameHost.test.tsx` verifies `destroy` on cleanup.                                                                                |
| Theme subscriptions are cleaned up                         | Yes. `GameHost.test.tsx` and the adapter test verify unsubscribe cleanup.                                                              |
| Every supported FunkSpace theme resolves to literal colors | Yes. The adapter test covers all four themes, five roles, hex literals, frozen results, and no `var(...)` values.                      |
| Frontend imports through the public package boundary       | Yes. `GameLoader.ts` dynamically imports `@funkspace/wave-survivor`, and `GameLoader.test.ts` verifies its public `createGame` export. |

### Documented coverage gaps

No tests were added in this baseline task. Follow-up coverage remains appropriate for the real `GameHost` with the real package controller, default and overridden Canvas dimensions, initially hidden loading, unmount while loading is pending, a hosted route/end-to-end path, and the standalone demo lifecycle.

### Working-tree review

- The working tree was clean before the first command.
- `git status --short --untracked-files=all` remained empty after the focused tests, frontend typecheck, and root test suite.
- The commands generated no tracked or visible untracked output.
- After recording results, the only intended tracked change is this execution note.

### Frontend-baseline classification

**Frontend baseline: PASS**

The focused integration tests, frontend typecheck, and full repository test suite all pass on the recorded toolchain. There are no documented exceptions, blockers, reproducibility investigations, or repair scopes from WS-0.5.

## WS-0.6 final scope-firewall audit and EPIC status — Pending

- **Status:** Pending.
- **Audit targets:**
  - no game framework;
  - no backend;
  - no generic engine or ECS;
  - no parallel theme system;
  - no frontend source imported by the game;
  - no per-frame React state;
  - no hand-edited generated token output;
  - no unrelated frontend refactor.
- **EPIC 0 completion rule:** Keep this note `In progress` until WS-0.4 and WS-0.5 evidence is recorded and the final scope audit passes.

## Completion record

### WS-0.3 outcome

The current scaffold has been inspected and recorded. It provides the approved package and integration boundaries but intentionally lacks gameplay and drawing. The observed landscape dimensions, copied frontend contracts, lifecycle-only states, and no-drawing Canvas renderer are deferred roadmap work and were not fixed.

### WS-0.4 outcome

The Wave Survivor package baseline passes without runtime, test, manifest, dependency, TypeScript, Vite, or configuration changes. Expected ignored build outputs were refreshed and reviewed; they created no tracked or visible untracked change.

### WS-0.5 outcome

The frontend Wave Survivor integration baseline passes without frontend, game, test, manifest, dependency, TypeScript, Vitest, or configuration changes. Existing tests verify every behavior required by WS-0.5; the known deeper-integration gaps remain follow-up work rather than hidden changes.

### Files changed

- `docs/tasks/ws-0-establish-implementation-baseline.md`

### Acceptance evidence

- Repository and environment identity: repository identity table.
- Current public API and boundaries: package-boundary and frontend-integration sections.
- Scripts and tests: exact inventory and planned-command sections.
- Existing versus absent behavior: abstraction and intentionally-absent tables.
- Concept mismatches: classified mismatch table.
- Pending work: dedicated WS-0.6 section.
- Protected scope: protected-areas section plus final Git review.
- Package validation: complete WS-0.4 command table, generated-artifact review, and `Package baseline: PASS` classification.
- Frontend validation: complete WS-0.5 command table, behavior-coverage review, working-tree review, and `Frontend baseline: PASS` classification.

### Validation results

- Initial `pnpm exec prettier --check docs/tasks/ws-0-establish-implementation-baseline.md`: failed because the new Markdown needed formatting.
- `pnpm exec prettier --write docs/tasks/ws-0-establish-implementation-baseline.md`: passed and changed formatting only.
- Final `pnpm exec prettier --check docs/tasks/ws-0-establish-implementation-baseline.md`: passed.
- `git diff --check`: passed.
- `git status --short`: showed only the new `docs/tasks/` path.
- Manual content, link, and scope review: passed; only this execution note changed.
- At WS-0.3 completion, WS-0.4 and WS-0.5 package/frontend commands were not run, as required.
- WS-0.4 package commands: all four later ran successfully and are recorded in the WS-0.4 section.
- Initial WS-0.4 result-recording Prettier check: failed because the expanded Markdown tables needed formatting.
- WS-0.4 result-recording Prettier write and final check: passed.
- Final WS-0.4 `git diff --check`: passed.
- Final WS-0.4 `git status --short`: showed only this modified execution note.
- WS-0.5 focused integration tests: passed, 3 test files and 8 tests.
- WS-0.5 frontend typecheck: passed with no diagnostics.
- WS-0.5 root test suite: passed, 24 test files and 341 tests.
- Initial WS-0.5 result-recording Prettier check: failed because the expanded Markdown tables needed formatting.
- WS-0.5 result-recording Prettier write: passed and changed formatting only.
- Final WS-0.5 `pnpm exec prettier --check docs/tasks/ws-0-establish-implementation-baseline.md`: passed.
- Final WS-0.5 `git diff --check`: passed.
- Final WS-0.5 `git status --short`: showed only this modified execution note.

### Deviations from plan

None. No runtime, configuration, or documentation file other than this shared execution note was changed.

### Remaining work

WS-0.6 remains pending. Do not begin EPIC 1 until its final scope-firewall audit is recorded and EPIC 0 is complete.
