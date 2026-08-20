# ADR-003: Interactive experience boundary

Date: 2026-08-20

## Status

Accepted

## Context

FunkSpace will host portfolio content alongside animations, visual experiments, and games. Interactive work can introduce continuous loops, browser-only APIs, rendering backends, input handling, audio, persistence, and larger dependencies. Allowing those concerns to spread through the portfolio shell would increase bundle size, complicate server rendering, and create global lifecycle and accessibility risks.

The existing architecture separates Domain, Application, Infrastructure, and Presentation. Existing sandbox routes also demonstrate that an experiment can be reachable from the same application while remaining a distinct product surface.

## Decision

Every interactive experience or game must have a clear logical boundary inside the monorepo.

- Give the experience an explicit feature specification, owner, route or entry point, state model, lifecycle, performance budget, accessibility fallback, and test plan.
- Keep its implementation cohesive within the existing layers, for example `domain/<experience>`, `application/<experience>`, `infrastructure/<experience>`, and dedicated presentation components/routes. Do not create a new top-level structure without a separate decision.
- The portfolio shell may link to and host an experience, but it must not depend on the experience's internal engine, state, or renderer.
- Experiences may depend on stable shared foundations such as tokens, base components, and platform ports. They must not import internals from another experience.
- Load client-only engines and heavy renderers only at the experience boundary. Do not move the entire application to a Client Component to support one experience.
- Scope input handlers, animation frames, observers, timers, audio, storage keys, and DOM effects to the experience. Pause when inactive and release every resource on teardown.
- Keep rules and state transitions in Domain, orchestration in Application, browser/rendering implementations in Infrastructure, and controls/output in Presentation.
- Put renderers behind a boundary. Start with SVG for accessible DOM-driven scenes, move measured heavy 2D work to Canvas, and use WebGL only for justified 3D or scale requirements.
- Use feature flags or sandbox-only routes while an experience is incomplete or carries rollout risk. Its disabled or reduced-motion path must remain understandable and usable.
- Promote code from an experience into shared infrastructure only after a second real consumer demonstrates a stable abstraction.

Isolation is logical by default; it does not require a separate repository or workspace package. A package boundary may be added later when independent dependencies, builds, deployment, or ownership justify it.

## Consequences

### Positive

- Portfolio pages remain stable, server-friendly, and lightweight.
- An experiment can fail, pause, evolve, or be removed without destabilizing unrelated pages.
- Rendering technology and engine dependencies remain replaceable.
- Lifecycle, accessibility, and performance behavior can be tested at a defined boundary.
- Reuse happens through intentional contracts instead of accidental coupling.

### Trade-offs

- Experiences need small adapters and explicit integration points.
- Some code may remain local until reuse is proven.
- Shared navigation, theming, and telemetry require carefully defined contracts.
- Engineers and agents must resist convenient cross-feature imports.

## Alternatives considered

### Embed interactive logic directly in portfolio components

Rejected because it couples continuous client behavior and renderer dependencies to otherwise static pages.

### Create a separate repository for every experience

Rejected as the default because it duplicates the shared foundation and makes discovery and atomic changes harder. Independent repositories remain an option for projects with truly separate platforms or release lifecycles.

### Build one global engine used by every animation and game

Rejected because animations, experiments, and games have different lifecycle and simulation needs. Shared primitives should emerge from proven use rather than a speculative framework.

### Allow experiences to import from one another

Rejected because it creates an implicit dependency graph and makes removal, testing, and reuse difficult.
