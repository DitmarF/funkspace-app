# Workspace package responsibilities

This document describes the repository's current workspace boundaries and the conditions for evolving them. It complements the internal Clean Architecture layers in [`docs/architecture.md`](../architecture.md) and the monorepo decision in [`ADR-001`](../decisions/ADR-001-monorepo-strategy.md).

## Current state

The root `package.json` and `pnpm-workspace.yaml` declare these workspace locations:

```text
frontend
backend
common
games/*
```

The configured locations are not all active packages. A pnpm workspace package requires its own `package.json`.

| Location        | Current state                                  | Manifest                | Runtime/build responsibility                                                                   |
| --------------- | ---------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| Repository root | Active private package                         | `package.json`          | Workspace tooling, token generation, tests, E2E, CI commands, and frontend build orchestration |
| `frontend/`     | Active private package                         | `frontend/package.json` | The complete web application and all current product runtime behavior                          |
| `common/`       | Active private package                         | `common/package.json`   | Generated TypeScript tokens and a pure, renderer-neutral motion core                           |
| `backend/`      | Placeholder directory                          | None                    | None                                                                                           |
| `games/*`       | Configured package collection; currently empty | No child manifests yet  | Future standalone game packages                                                                |

`pnpm list -r --depth -1` recognizes the root package, `frontend`, and `@funkspace/common`. `backend` remains a README-only placeholder. `games/` contains workspace guidance but no child package; a future direct child with a `package.json` will be discovered through `games/*`.

The current dependency shape is:

```text
root token sources -> generated styles/tokens.css   -> frontend
                   -> common/generated/*.ts
                                  |
                                  +-> @funkspace/common/motion
                                  +-> public token exports

frontend motion adapters -> @funkspace/common/motion
root tooling       -> frontend build, tests, Storybook, E2E, Lighthouse

common  [active private package; explicit motion and token exports]
backend [placeholder; no runtime or deployment]
games/* [configured collection; no game packages yet]
```

The root production build type-checks `common` before building the frontend. Repository tests cover the core and both frontend motion adapters. No current application code imports from `backend` or `games`.

## Package boundary contract

The following ownership model applies as inactive boundaries become installable packages. It defines dependency direction now so future implementation does not create conflicting patterns.

| Package    | Responsible for                                                                                                   | Not responsible for                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `frontend` | Next.js, React, routing, portfolio UI, accessibility, web metadata, and frontend-owned integration adapters       | Game simulation, game rendering engines, backend internals, or environment-neutral shared primitives                |
| `common`   | Pure TypeScript shared utilities, design-token sources/artifacts, and framework-neutral motion primitives         | React/Next.js, DOM or browser APIs, render loops, SVG/Canvas/WebGL manipulation, product UI, or game-specific logic |
| `games/*`  | Game simulation, rendering, game-specific rules and content, input/audio/persistence adapters, and game lifecycle | Portfolio routing/UI, frontend internals, or unrelated shared utilities                                             |
| `backend`  | Optional server-owned capabilities when justified                                                                 | Frontend presentation, game rendering, or shared browser code                                                       |

Shared token sources remain physically at the repository root. Pure motion concepts live in `common/motion/`; frontend SVG and HTML timelines consume them through the package's public motion export while keeping rendering and browser lifecycle concerns in `frontend/infrastructure/motion/`.

### Allowed dependency direction

```text
frontend -------------------------------> common
games/* --------------------------------> common
backend (if activated) -----------------> common

frontend integration adapter ----------> game public API/artifact
frontend presentation/application -----> frontend-owned adapter contract

games/* -/-> frontend
common  -/-> frontend, games/*, or backend
common  -/-> React, Next.js, DOM, or other browser frameworks/APIs
frontend -/-> game private source
```

The one permitted `frontend -> games/*` edge is an integration adapter. No other frontend module may import a game package directly.

## Root workspace responsibilities

The root is an orchestration and shared-foundation boundary, not a product runtime.

It currently owns:

- Workspace discovery and lockfile management.
- Shared development and CI tooling.
- Style Dictionary configuration and source tokens in `tokens/`.
- Generated token CSS in `styles/` and TypeScript token constants in `common/generated/`.
- Vitest, Playwright, and Lighthouse configuration.
- Root scripts that invoke the frontend build and Storybook.
- Repository-wide documentation and governance.

Runtime feature code must not be added to the root merely because it is shared by tooling. If runtime code gains real consumers across packages, give it an intentional package and public API.

While both `package.json#workspaces` and `pnpm-workspace.yaml` declare workspace locations, keep them aligned. A future cleanup may choose one canonical discovery configuration, but this task does not change either file.

## `frontend`

### Current responsibilities

`frontend` is the only active application package. It owns:

- The Next.js runtime and React application boundary.
- Next.js App Router pages, layouts, metadata, and public assets.
- Routing, navigation, the portfolio UI, and all current user-facing routes.
- Accessibility semantics, focus behavior, keyboard access, reduced-motion integration, and web-level performance.
- The design-system component implementation and Storybook stories.
- Theme and design-token consumption through `styles/tokens.css` and Tailwind.
- Interactive demonstrations and sandbox routes.
- The current Domain, Application, Infrastructure, and Presentation layers.
- Browser integrations for DOM, storage, animation, and motion.
- Frontend unit/component tests; root tooling supplies E2E and quality orchestration.

New portfolio pages, animations, and embedded experiments remain in `frontend` unless an extraction trigger in this document is met. Standalone games belong in a future `games/<game-slug>` package. Interactive work in either location must follow the isolation boundary in [`ADR-003`](../decisions/ADR-003-interactive-experience-boundary.md).

### Allowed dependencies

`frontend` may depend on:

- Dependencies declared in `frontend/package.json`. The current runtime dependencies are `@funkspace/common`, Next.js, React, React DOM, and Framer Motion.
- Its own modules when imports follow the layer rules in `AGENTS.md` and `docs/architecture.md`.
- Generated design-token CSS and other intentional root-owned build outputs.
- Root development tooling through workspace scripts; tooling must not become a browser runtime dependency.
- The public `@funkspace/common/motion` entry point for pure timing, easing, interpolation, and tween sampling.
- Other `@funkspace/common` entry points only when they are explicitly exported and the frontend has a real consumer.
- A game only through a frontend-owned integration adapter and the game's documented public API or deployed artifact.
- A future backend through a documented network contract and frontend-owned port/client adapter.

Within `frontend`, the package boundary does not override Clean Architecture:

- Domain remains framework-free.
- Application depends on Domain abstractions.
- Infrastructure implements external concerns.
- Presentation consumes Application behavior through hooks/providers and must not add direct dependencies on concrete Infrastructure implementations.
- Cross-layer construction remains in the composition root.

### Forbidden dependencies

`frontend` must not:

- Import files from `backend` by relative path or depend on backend runtime internals.
- Import server-only libraries, private credentials, privileged environment values, or deployment secrets into client code.
- Deep-import files from `common` or bypass its explicit package exports.
- Reach into another workspace package's private source files after packages are introduced.
- Rely on undeclared or transitively available dependencies.
- Import root CI/build implementation modules into application runtime code.
- Make the portfolio shell depend on an experiment's or game's private engine, renderer, state, or lifecycle.
- Import private source files from a package under `games/*`.
- Import a game package anywhere except its dedicated frontend integration adapter.
- Put game simulation, game-specific rendering, or game rules in portfolio components, routes, or hooks.
- Let one interactive experience import another experience's internals.
- Bypass the internal layer rules for convenience.

## `common`

### Current state

`common` is an active private workspace package. It exports the pure motion core and generated token modules through explicit entry points. The frontend declares a workspace dependency and consumes `@funkspace/common/motion` from its HTML and SVG adapters.

The motion core establishes the allowed handwritten boundary: deterministic easing, interpolation, tween data, and timeline state calculations. Adding public entry points or additional runtime utilities requires a feature plan that updates consumers, tests, and build validation.

### Responsibilities

`common` owns reusable, environment-neutral foundations shared by `frontend`, games, and a possible backend:

- Pure TypeScript utilities with at least two real workspace consumers.
- Design-token source data, token types, and portable generated artifacts.
- Motion primitives such as timing types, easing math, interpolation, geometry/vector math, manifests, and deterministic state transitions.
- Serializable types, value objects, validation rules, API schemas, and event contracts shared across runtimes.

The JSON token files in root `tokens/` remain authoritative under [`ADR-002`](../decisions/ADR-002-design-token-source-of-truth.md). Activating the package does not move or duplicate token sources. A future source migration must move the build contract atomically so there is still exactly one source of truth.

Motion primitives in `common` stop before environment integration. `requestAnimationFrame`, DOM reads/writes, React hooks, SVG element manipulation, Canvas/WebGL renderers, audio, and input listeners belong to `frontend` or the owning game.

`common` must not become a general utility drawer. Code belongs here only when its semantics are shared and stable; game-specific simulation and frontend-specific behavior stay with their owners.

### Purity requirements

`common` code must:

- Be strict TypeScript with deterministic behavior.
- Remain independent of React, Next.js, browser frameworks, DOM APIs, browser storage, and Node-only APIs.
- Avoid file, network, database, environment-variable, clock, random, and other hidden I/O.
- Have no dependency on `frontend`, `backend`, or a game package.
- Expose explicit entry points instead of requiring deep source imports.
- Use serializable data at cross-runtime boundaries.
- Keep external dependencies minimal, environment-neutral, and justified.
- Include unit tests for behavior and compatibility tests for serialized contracts.

Organize exports by explicit areas such as `tokens`, `motion`, `utilities`, and `contracts`. If those areas later require different tooling, versioning, or ownership, splitting `common` requires a separate ADR and migration.

## `games/*`

### Current state

`games/*` is a configured workspace collection with no game package yet. The parent [`games/README.md`](../../games/README.md) defines creation and isolation requirements.

### Responsibilities

Each `games/<game-slug>` package is responsible for its complete game product boundary:

- Deterministic simulation state, rules, scoring, collision/math, and state transitions.
- Session lifecycle such as start, pause, resume, reset, completion, and teardown.
- Game-specific rendering and renderer selection.
- Input, audio, persistence, clock, randomness, and platform adapters.
- Game-specific UI, content, assets, accessibility behavior, reduced-motion behavior, and performance budgets.
- Its own manifest, dependencies, build, tests, documentation, and deployment configuration.

The first game follows [`ADR-004`](../decisions/ADR-004-game-development-architecture.md): its lightweight engine remains private to that game until a second real consumer proves a shareable primitive.

### Allowed dependencies

A game may depend on:

- Its own declared runtime and development dependencies.
- The public `@funkspace/common` API for tokens, pure utilities, motion primitives, and stable contracts.
- A backend only through a documented network adapter and API contract.
- Root tooling through explicit workspace scripts that do not become runtime dependencies.

### Forbidden dependencies

A game must not:

- Import `frontend`, its components, hooks, routes, services, Tailwind configuration, or private source.
- Import another game's private source or engine.
- Put game-specific simulation, rendering, or orchestration into `common`.
- Depend on undeclared, hoisted, or transitive packages.
- Expose internal state or renderer details as its public integration contract.

### Frontend integration adapters

`frontend` consumes a game through an adapter it owns. The adapter is the only frontend module permitted to depend on the game's public integration surface.

An adapter may:

- Link or navigate to a separately deployed game.
- Embed a public game artifact or communicate through a documented messaging contract.
- Import an explicit game package entry point when the game is built for in-process integration.
- Translate frontend concerns such as navigation, theme values, reduced-motion preferences, lifecycle, errors, and analytics into the game's public contract.

Portfolio routes and components depend on a frontend-owned adapter interface, not on game types. The adapter must provide teardown and must not expose the game's engine, renderer, or mutable state to the rest of `frontend`.

## `backend`

### Current purpose

`backend` is a placeholder for possible server-owned capabilities. It has no `package.json`, source code, tests, build, CI job, deployment, or API contract.

### Is it currently required?

No. The current FunkSpace site builds, tests, runs, and deploys from the root and `frontend` packages. Removing the `backend` directory is outside this task, but agents must not invent a backend dependency or describe it as an active service.

Keeping the placeholder is reasonable only as a visible reservation while server requirements are being evaluated. If no server-owned requirement emerges, a later cleanup task should reconsider whether the directory and workspace entry provide value.

### Future possibilities

Activate a backend only for behavior that should not or cannot run safely in the browser, for example:

- Private API credentials or server-side integrations.
- Persistent accounts, save data, scores, or leaderboards.
- Authoritative multiplayer/session coordination or anti-cheat-sensitive rules.
- Content administration or a backend-for-frontend API.
- Webhooks, scheduled work, background jobs, or asset processing.
- Server-side validation, rate limiting, and protected data access.

Activation requires an explicit feature plan and, when the boundary is significant, an ADR. The change must define:

- A package manifest, runtime, scripts, and supported Node version.
- API/event contracts and their ownership.
- Authentication, authorization, validation, privacy, and threat boundaries.
- Persistence and migration strategy, if any.
- Unit, integration, and contract tests.
- Local development, CI, deployment, observability, and rollback behavior.
- How frontend clients depend on the service through ports rather than backend source imports.

## Backend dependency direction

```text
frontend ---- documented network API ----> backend
games/* ---- documented network API -----> backend
backend ---- declared public import ------> common

backend -/-> frontend source
frontend -/-> backend source
backend -/-> game source
games/* -/-> backend source
```

Network relationships do not permit filesystem imports across private implementations. Shared request/response contracts may live in `common` when they satisfy its purity rules.

## Recommendations for future workspace structure

### Near term: keep the current layout

1. Keep the configured `frontend`, `backend`, `common`, and `games/*` workspace locations; do not rename or remove them during the remaining architecture review.
2. Treat `backend` as an inactive placeholder and keep `common` limited to its pure, explicitly exported foundation responsibilities.
3. Keep portfolio pages and embedded experiences in `frontend`; place future standalone games in direct `games/<game-slug>` packages.
4. Keep each game's source isolated and keep the first game's lightweight engine private to that game, as required by [`ADR-004`](../decisions/ADR-004-game-development-architecture.md).
5. Extend automated package/import-boundary checks when the first game package is activated.
6. Update root scripts and CI whenever a real package is activated; do not assume recursive commands cover a directory without a manifest.

### Extraction triggers

| Candidate boundary              | Keep current placement until                                                                        | Extract when                                                                                                                                                                          |
| ------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Embedded interactive experience | It shares the frontend build, deployment, and dependency profile                                    | It needs independent deployment, incompatible/heavy dependencies, distinct ownership, or hard runtime isolation; then create a package under `games/*` or another approved collection |
| Standalone game                 | Not applicable; `games/*` is already configured                                                     | Add a direct child package only after its feature plan defines ownership, build, tests, and integration                                                                               |
| Design tokens                   | Root remains the physical source; CSS and TypeScript artifacts are generated for different runtimes | Migrate token sources only when ownership/build benefits justify it; keep the move atomic                                                                                             |
| Reusable UI/design system       | Components are consumed only by the frontend and its Storybook                                      | A second application needs a stable, versioned component API                                                                                                                          |
| `common`                        | Motion and token contracts cover current shared needs                                               | A real consumer requires another stable, environment-neutral public contract                                                                                                          |
| Backend                         | All behavior is public and browser-safe                                                             | Secrets, authoritative state, persistence, protected integrations, or server coordination are required                                                                                |
| Shared game/simulation core     | Only the first game needs its engine                                                                | A second real game proves compatible deterministic primitives and ownership                                                                                                           |

### Possible later layout

The intended near-term structure is:

```text
frontend/              # Next.js, React, routing, portfolio UI, accessibility
common/                # pure TypeScript utilities, tokens, motion primitives
games/
  <game-slug>/         # simulation, rendering, game-specific logic
backend/               # optional server capabilities
```

Only `frontend` is an active application package today; `common` is an active private library package with no independent runtime or deployment. Activating the other boundaries affects scripts, imports, CI, deployment, token paths, and documentation, so each activation requires a dedicated feature plan. Additional package splits require demonstrated reuse and an ADR.

## Rules for AI agents

- Verify the presence of a package manifest before treating a configured directory as a workspace package.
- Do not create code in a placeholder to make a planned architecture appear implemented.
- Prefer the current, simplest boundary until an extraction trigger is supported by repository evidence.
- Enforce `games/* -/-> frontend` and `common -/-> browser frameworks` in every plan and review.
- Permit `frontend -> games/*` only inside a frontend-owned adapter that consumes a documented public integration surface.
- Record new package responsibilities, public exports, dependency direction, tests, and ownership in this document when a workspace is activated.
- Report documentation/configuration mismatches instead of silently normalizing them in unrelated tasks.
