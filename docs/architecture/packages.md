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

| Location | Current state | Manifest | Runtime/build responsibility |
| --- | --- | --- | --- |
| Repository root | Active private package | `package.json` | Workspace tooling, token generation, tests, E2E, CI commands, and frontend build orchestration |
| `frontend/` | Active private package | `frontend/package.json` | The complete web application and all current product runtime behavior |
| `common/` | Placeholder directory | None | None |
| `backend/` | Placeholder directory | None | None |
| `games/*` | Configured package collection; currently empty | No child manifests yet | Future standalone game packages |

`pnpm list -r --depth -1` currently recognizes only the root package and `frontend`. `backend` and `common` each contain only a README, while `games/` contains workspace guidance but no child package. A future direct child with a `package.json` will be discovered through `games/*`.

The current dependency shape is:

```text
root token sources -> generated styles/tokens.css -> frontend
root tooling       -> frontend build, tests, Storybook, E2E, Lighthouse

common  [placeholder; no imports or exports]
backend [placeholder; no runtime or deployment]
games/* [configured collection; no game packages yet]
```

CI type-checks, tests, builds, and deploys the frontend. No current application code imports from `backend`, `common`, or `games`.

## Root workspace responsibilities

The root is an orchestration and shared-foundation boundary, not a product runtime.

It currently owns:

- Workspace discovery and lockfile management.
- Shared development and CI tooling.
- Style Dictionary configuration and source tokens in `tokens/`.
- Generated token CSS in `styles/`.
- Vitest, Playwright, and Lighthouse configuration.
- Root scripts that invoke the frontend build and Storybook.
- Repository-wide documentation and governance.

Runtime feature code must not be added to the root merely because it is shared by tooling. If runtime code gains real consumers across packages, give it an intentional package and public API.

While both `package.json#workspaces` and `pnpm-workspace.yaml` declare workspace locations, keep them aligned. A future cleanup may choose one canonical discovery configuration, but this task does not change either file.

## `frontend`

### Current responsibilities

`frontend` is the only active application package. It owns:

- Next.js App Router pages, layouts, metadata, and public assets.
- The portfolio and all current user-facing routes.
- The design-system component implementation and Storybook stories.
- Theme and design-token consumption through `styles/tokens.css` and Tailwind.
- Interactive demonstrations and sandbox routes.
- The current Domain, Application, Infrastructure, and Presentation layers.
- Browser integrations for DOM, storage, animation, and motion.
- Frontend unit/component tests; root tooling supplies E2E and quality orchestration.

New portfolio pages, animations, and embedded experiments remain in `frontend` unless an extraction trigger in this document is met. Standalone games belong in a future `games/<game-slug>` package. Interactive work in either location must follow the isolation boundary in [`ADR-003`](../decisions/ADR-003-interactive-experience-boundary.md).

### Allowed dependencies

`frontend` may depend on:

- Dependencies declared in `frontend/package.json`. The current runtime dependencies are Next.js, React, React DOM, and Framer Motion.
- Its own modules when imports follow the layer rules in `AGENTS.md` and `docs/architecture.md`.
- Generated design-token CSS and other intentional root-owned build outputs.
- Root development tooling through workspace scripts; tooling must not become a browser runtime dependency.
- A future shared workspace package only after that package has a manifest, explicit exports, clear ownership, and is declared in `frontend/package.json` with the workspace protocol.
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
- Import from `common` by relative path while `common` is not a package with an explicit public API.
- Reach into another workspace package's private source files after packages are introduced.
- Rely on undeclared or transitively available dependencies.
- Import root CI/build implementation modules into application runtime code.
- Make the portfolio shell depend on an experiment's or game's private engine, renderer, state, or lifecycle.
- Import private source files from a package under `games/*`.
- Let one interactive experience import another experience's internals.
- Bypass the internal layer rules for convenience.

## `common`

### Current responsibilities

`common` has no current runtime responsibility. It is a reserved directory, not an installable package. No existing code depends on it.

Do not place code in `common` until at least two active workspaces need the same stable runtime contract. Reuse within `frontend` alone is not evidence for a cross-workspace package.

### Possible future responsibilities

If activated, `common` may contain a deliberately small set of environment-neutral contracts such as:

- Serializable types shared by a frontend and backend.
- Pure value objects and validation rules with identical meaning in both runtimes.
- API request/response schemas or event contracts.
- Deterministic helpers that are genuinely used by more than one workspace.

It must not become a general utility drawer. UI components, Tailwind configuration, backend services, browser adapters, game renderers, and product-specific orchestration do not belong in `common`.

### Purity requirements

Future `common` code must:

- Be strict TypeScript with deterministic behavior.
- Remain independent of React, Next.js, DOM APIs, browser storage, and Node-only APIs.
- Avoid file, network, database, environment-variable, clock, random, and other hidden I/O.
- Have no dependency on `frontend`, `backend`, or a game package.
- Expose explicit entry points instead of requiring deep source imports.
- Use serializable data at cross-runtime boundaries.
- Keep external dependencies minimal, environment-neutral, and justified.
- Include unit tests for behavior and compatibility tests for serialized contracts.

If future needs combine unrelated concerns, create narrowly named packages such as `contracts` or `simulation-core` instead of expanding an ambiguous `common` package. Renaming or replacing the directory requires a separate migration decision.

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

## Recommended dependency direction if all three become active

```text
frontend ---- declared public import ----> common <---- declared public import ---- backend
game packages ---- declared public import --> common
frontend ---- documented network API -------------------------------------------> backend

common  -/-> frontend
common  -/-> backend
backend -/-> frontend source
frontend -/-> backend source
games/* -/-> frontend or other games' private source
```

`common` would provide contracts, not orchestration. A network relationship between frontend and backend does not permit filesystem imports across their private implementations.

## Recommendations for future workspace structure

### Near term: keep the current layout

1. Keep `frontend`, `backend`, `common`, and the new `games/*` collection unchanged during the remaining architecture review.
2. Treat `backend` and `common` as inactive placeholders until a feature supplies a concrete responsibility.
3. Keep portfolio pages and embedded experiences in `frontend`; place future standalone games in direct `games/<game-slug>` packages.
4. Keep each game's source isolated and keep the first game's lightweight engine private to that game, as required by [`ADR-004`](../decisions/ADR-004-game-development-architecture.md).
5. Add automated package/import-boundary checks before the number of active workspaces grows.
6. Update root scripts and CI whenever a real package is activated; do not assume recursive commands cover a directory without a manifest.

### Extraction triggers

| Candidate boundary | Keep current placement until | Extract when |
| --- | --- | --- |
| Embedded interactive experience | It shares the frontend build, deployment, and dependency profile | It needs independent deployment, incompatible/heavy dependencies, distinct ownership, or hard runtime isolation; then create a package under `games/*` or another approved collection |
| Standalone game | Not applicable; `games/*` is already configured | Add a direct child package only after its feature plan defines ownership, build, tests, and integration |
| Design tokens | The frontend is the only runtime consumer | Multiple packages/apps need versioned token artifacts or independent builds |
| Reusable UI/design system | Components are consumed only by the frontend and its Storybook | A second application needs a stable, versioned component API |
| `common` contracts | Only one runtime uses the types/rules | At least frontend and backend need the same stable serialized contract |
| Backend | All behavior is public and browser-safe | Secrets, authoritative state, persistence, protected integrations, or server coordination are required |
| Shared game/simulation core | Only the first game needs its engine | A second real game proves compatible deterministic primitives and ownership |

### Possible later layout

If multiple independently built applications emerge, consider a conventional split such as:

```text
apps/
  web/                 # portfolio and integrated experiences
  api/                 # only when a backend is required
  <experience>/        # only for an independently built/deployed experience

packages/
  design-tokens/       # generated, versioned token artifacts
  ui/                  # proven cross-app components
  contracts/           # pure serialized frontend/backend contracts
  <shared-core>/       # only after demonstrated cross-app reuse
```

This is a direction, not an approved migration. Moving the current folders would affect scripts, imports, CI, deployment, token paths, and documentation, so it requires a dedicated feature plan and ADR.

## Rules for AI agents

- Verify the presence of a package manifest before treating a configured directory as a workspace package.
- Do not create code in a placeholder to make a planned architecture appear implemented.
- Prefer the current, simplest boundary until an extraction trigger is supported by repository evidence.
- Record new package responsibilities, public exports, dependency direction, tests, and ownership in this document when a workspace is activated.
- Report documentation/configuration mismatches instead of silently normalizing them in unrelated tasks.
