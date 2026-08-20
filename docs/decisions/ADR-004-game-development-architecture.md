# ADR-004: First game development architecture

Date: 2026-08-20

## Status

Accepted

## Context

The first FunkSpace game is intended to be a focused interactive portfolio experience, not the start of a general-purpose game platform. The repository already contains strict TypeScript, Clean Architecture boundaries, motion primitives, feature flags, and browser-oriented test tooling.

A full game framework would add its own scene model, lifecycle, rendering assumptions, asset pipeline, and dependency surface before the first game proves those capabilities are needed. Driving a real-time game through React rendering would create a different mismatch: simulation ticks and per-frame drawing do not belong in React's render cycle.

## Decision

The first game will use a custom lightweight engine built from browser primitives and project-owned TypeScript modules instead of adopting a game framework.

The engine will be limited to capabilities required by the game:

- A deterministic Domain state model with explicit actions, rules, scoring, and state transitions.
- An Application-level session/controller that coordinates start, pause, resume, reset, and end states.
- An Infrastructure loop driven by an injected clock and `requestAnimationFrame`, with bounded time-step behavior and explicit start/stop cleanup.
- Input, renderer, audio, persistence, clock, and randomness behind ports or focused adapters.
- A renderer selected according to [ADR-003](./ADR-003-interactive-experience-boundary.md): SVG for suitable DOM-driven scenes, Canvas for measured heavy 2D work, and no WebGL without demonstrated need.
- React used for the route shell, menus, instructions, settings, status, and accessible controls, not as the per-frame simulation engine.
- Seedable randomness and controllable time so core behavior can be reproduced in unit tests.
- Shared design and motion values consumed according to [ADR-002](./ADR-002-design-token-source-of-truth.md).

The custom engine is private to the first game. Do not turn it into a shared game framework or merge it with the existing animation timeline unless real reuse and compatible contracts are demonstrated.

A game-framework proposal requires a new ADR. It must show that game requirements such as complex physics, scene editing, asset streaming, multiplayer/netcode, advanced rendering, or multiple games outweigh bundle, accessibility, integration, and maintenance costs.

## Consequences

### Positive

- The first game ships only the runtime capabilities it needs.
- Domain rules remain deterministic, framework-free, and straightforward to test.
- FunkSpace retains control over lifecycle, input, accessibility, rendering, and bundle cost.
- Renderer and browser integrations remain replaceable behind ports.
- Agents can understand the complete engine from repository code and documentation.

### Trade-offs

- The team owns loop behavior, state coordination, collision/math utilities, debugging support, and lifecycle correctness.
- Framework-provided editors, asset pipelines, physics, and plugins are unavailable.
- Scope discipline is required to prevent the lightweight engine from becoming an unmaintained internal framework.
- More advanced future games may justify migration or a different engine.

## Alternatives considered

### Adopt a browser game framework immediately

Rejected for the first game because the framework cost and architecture would be chosen before requirements demonstrate a need. Framework adoption remains possible through a later ADR.

### Use React state and effects as the game engine

Rejected because per-frame simulation and rendering would couple game timing to UI reconciliation and make performance and deterministic testing harder.

### Extend the existing animation timeline into a game engine

Rejected because a declarative animation timeline and an interactive simulation have different state, input, collision, and lifecycle responsibilities. Individual utilities may be reused when their contracts fit.

### Build the first game outside FunkSpace

Rejected because the game should share the portfolio's tokens, accessibility standards, testing, and deployment foundation while remaining isolated according to ADR-003.
