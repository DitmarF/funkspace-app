# ADR-001: Monorepo strategy

Date: 2026-08-20

## Status

Accepted

## Context

FunkSpace is intended to support a public portfolio, reusable interface foundations, animations, experiments, and games. These surfaces share design tokens, quality tooling, architectural rules, and release expectations, even when their runtime needs differ.

The repository already uses a pnpm workspace with an active `frontend` package and reserved `backend` and `common` packages. Root-level scripts coordinate token generation, type checking, tests, builds, end-to-end checks, and performance checks.

Splitting related work across repositories would make atomic changes, shared quality gates, and architectural discovery harder for maintainers and AI agents. Treating the entire codebase as one unstructured application would create a different problem: experiments and games could leak dependencies into the portfolio shell.

## Decision

FunkSpace will remain a pnpm monorepo.

- Root configuration owns workspace-wide tooling, design-token generation, CI orchestration, and shared documentation.
- Each deployable or independently evolving runtime belongs in an explicit workspace package when that boundary becomes necessary.
- `frontend` remains the active web application. `backend` and `common` remain reserved until a concrete feature and architecture decision gives them responsibilities.
- Package boundaries complement, rather than replace, the Clean Architecture layers documented in `docs/architecture.md`.
- Dependencies must be declared by the package that uses them. Code may cross a package boundary only through an intentional public API.
- Shared code is promoted into a shared package only after there is demonstrated reuse and a stable ownership model. Do not create a dumping-ground package for unrelated utilities.
- Changes that span tokens, shared contracts, and consumers should be made and reviewed atomically in this repository.

## Consequences

### Positive

- Agents can inspect architecture, implementation, tests, and documentation in one place.
- Cross-cutting changes remain atomic and use one review and CI flow.
- Design tokens and quality rules stay consistent across portfolio pages and interactive work.
- Future packages can evolve without forcing an early repository split.

### Trade-offs

- CI and dependency installation can grow as more packages are added.
- Package ownership and dependency direction must be actively maintained.
- A change in shared tooling can affect several project surfaces at once.
- Experiments still require strong boundaries inside the repository; monorepo membership does not authorize arbitrary cross-imports.

## Alternatives considered

### Keep only the frontend in one repository

Rejected because expected backend, shared, experiment, and game work would either be mixed into the frontend or moved elsewhere without a consistent foundation.

### Use one repository per portfolio surface, experiment, or game

Rejected for the current stage because it duplicates tokens and tooling, makes atomic changes difficult, and hides architectural context from agents. This can be reconsidered if a project gains an independent team, release lifecycle, or technology platform.

### Use a single application with no package boundaries

Rejected because it encourages unrelated runtime concerns to become coupled and makes future extraction more expensive.
