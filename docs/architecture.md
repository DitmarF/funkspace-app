# FunkSpace Architecture

This document describes the clean architecture principles and layer boundaries for the FunkSpace application. See [`docs/architecture/packages.md`](architecture/packages.md) for repository workspace responsibilities and [`docs/architecture/design-tokens.md`](architecture/design-tokens.md) for the current and recommended design-token hierarchy.

## Architecture Overview

FunkSpace follows Clean Architecture principles with clear separation of concerns across four main layers:

1. **Domain Layer** - Pure business logic, entities, and rules
2. **Application Layer** - Use cases and orchestration
3. **Infrastructure Layer** - External concerns (DOM, storage, browser APIs)
4. **Presentation Layer** - UI components and React hooks

## Layer Structure

```
frontend/
  domain/              # Pure business logic, no framework dependencies
    animations/         # Animation entities and timing rules
    theme/             # Theme entities and validation
    ports/             # Interfaces for infrastructure (dependency inversion)

  application/         # Use cases and orchestration
    animations/         # Animation services and orchestrators
    theme/            # Theme management service
    scroll/            # Scroll progress service
    providers/         # React context providers for dependency injection

  infrastructure/      # External concerns and implementations
    motion/            # HTML/SVG renderer adapters and platform utilities
    dom/               # DOM manipulation utilities
    storage/           # Storage adapters (localStorage)
    services/          # Service factory

  components/          # Presentation layer - pure UI components
  hooks/               # React hooks (thin wrappers around services)
  app/                 # Next.js App Router pages

common/
  motion/              # Pure easing, interpolation, tween, and timeline core
  generated/           # Generated framework-neutral design tokens
```

## Dependency Rules

### Decorative-motion policy

FS-3.4 adds a provider-owned `MotionPolicyService` beside animation orchestration.
The pure domain resolver combines its immutable preference/environment snapshot
with each consumer's independent availability, opt-in, visibility, Pause and
runtime readiness. Permission never commands playback or resets local history.
`BrowserMotionEnvironment` owns media/document listeners and attaches them only
during provider lifecycle setup. The existing storage port persists one validated
preference best-effort; live intent remains authoritative after failed writes.
Consumers receive only snapshot/subscription/update methods and unsubscribe on
unmount. Provider cleanup releases its activation without terminal disposal so
Strict Mode can restart it. No motion registry, global scheduler or game-clock
dependency is introduced. See the [FS-3.4 record](tasks/fs-3.4-motion-policy-implementation.md)
for approved semantics, implementation evidence and later consumer boundaries.

FS-3.5 connects Motion settings and the existing logo to that same authority.
The subsequent homepage sequence uses a per-shell `HomeIntroBinding` and an
optional `LogoMotion.onPlaybackState` lifecycle callback; there is no global
animation coordinator. A route-local parser script serializes the same pure
policy resolver/validator for one-time startup eligibility. It reads the existing
key without writing or becoming a live authority. Browser effects and the
bounded fail-open timer belong to infrastructure; `HomeIntroScript` is the
startup composition boundary. The live logo controller drives completion or
static fallback. A fallback before playback starts retains a per-shell
cancellation latch and delivers it to the current logo even after late hydration.
`LogoMotionRef.cancelIntroduction()` retires automatic playback for that mount;
it preserves local Pause, shared preference and explicit permitted playback.
The logo's existing history retains this latch across Strict Mode setup. The
binding owns one cancellation subscriber with identity-guarded cleanup; detached
shell cleanup removes it. A new page mount has independent history. CSS uses the existing 400 ms token for the menu hex-button
fade, then the 800 ms token for the remaining content. The existing binding advances on actual
animation-end events. The launcher and footer links are separate targets within
the same footer; no second navigation owner or modal is introduced.
The shell preserves server-rendered children and native links; no-JS/blocked
inline script keeps them visible. No theme-bootstrap source or pipeline changes.
The Reduced-logo amendment adds an optional `supportsReducedMotion` capability
to the pure resolver; existing consumers default to static under Reduced. The
logo alone supplies the implemented whole-artwork fade. Its binding accepts
`prepare("draw" | "fade")`, deriving fade duration from the existing manifest
and reusing one timeline. The renderer's `:scope` target addresses the owned SVG
root for uniform opacity; geometry and per-part drawing remain unchanged.
`LogoMotion` retains React ownership and an instance-local playback history;
the application `LogoMotionController` combines intent with the pure resolver.
The browser-free `LogoMotionPort` separates it from `NativeLogoMotionBinding`,
which owns that SVG's observer, style changes and existing timeline. Composition
injects the existing orchestrator's manifest builder; no second manifest or
scheduler is introduced. The provider exposes a per-instance binding factory,
and each logo releases only its own resources. Only the homepage identity opts
in. Complete artwork is the initial and denied/error result; permission never
replays a completed introduction. See the [FS-3.5 handoff](tasks/fs-3.5-motion-settings-and-logo.md)
for public-method compatibility and outstanding human acceptance.

The approved FS-3.5 On amendment extends the same preference union/key with
`on`. Only this explicit choice bypasses device-preference restrictions;
Follow system remains conservative when the signal is unavailable. Policy
readiness, availability, opt-in, visibility, runtime readiness and local Pause
remain independent restrictions. No new preference authority is introduced.

### Dependency Direction

The dependency rule states that **dependencies point inward**:

- **Domain**: No dependencies (pure TypeScript)
- **Application**: Depends only on Domain
- **Infrastructure**: Depends on Domain (ports/interfaces) and implements them
- **Presentation**: Depends on Application and Domain types

```
Presentation → Application → Domain ← Infrastructure
```

### Import Rules

1. **Domain** should never import from Application, Infrastructure, or Presentation
2. **Application** can import from Domain only
3. **Infrastructure** can import from Domain (ports) and the public
   `@funkspace/common` API, then implement platform adapters
4. **Presentation** can import from Application (services via hooks) and Domain (types)

### Examples

✅ **Valid:**

```typescript
// Application importing from Domain
import type { Theme } from "@/domain/theme/Theme";

// Infrastructure implementing Domain port
import type { StoragePort } from "@/domain/ports/StoragePort";
export class LocalStorageAdapter implements StoragePort { ... }

// Presentation using Application services through the provider
import { useServices } from "@/application/providers/ServiceProvider";
```

❌ **Invalid:**

```typescript
// Domain importing from Application (WRONG)
import { ThemeService } from "@/application/theme/ThemeService";

// Application importing from Infrastructure (WRONG)
import { LocalStorageAdapter } from "@/infrastructure/storage/LocalStorageAdapter";

// Domain importing from Presentation (WRONG)
import { useTheme } from "@/hooks/useTheme";
```

## Layer Responsibilities

### Domain Layer

- **Purpose**: Pure business logic and entities
- **Dependencies**: None (pure TypeScript)
- **Contains**:
  - Entity types (Theme, AnimationManifest)
  - Business rules (animation timing calculations)
  - Port interfaces (StoragePort, DOMPort, AnimationPort)
- **No**: Framework code, React, browser APIs

### Application Layer

- **Purpose**: Orchestrate use cases and business workflows
- **Dependencies**: Domain only
- **Contains**:
  - Services (ThemeService, AnimationService, ScrollService)
  - Orchestrators (AnimationOrchestrator)
  - Service providers (React Context)
- **No**: Direct DOM manipulation, localStorage access, browser APIs

### Infrastructure Layer

- **Purpose**: Implement external concerns
- **Dependencies**: Domain (ports/interfaces) and public `@funkspace/common`
  entry points
- **Contains**:
  - Adapters (LocalStorageAdapter, DOMAdapter, AnimationAdapter)
  - HTML/SVG renderer adapters, clocks, and platform manipulation utilities
  - Service factory
- **No**: Business logic, React components

### Presentation Layer

- **Purpose**: UI rendering and user interaction
- **Dependencies**: Application (via hooks) and Domain (types)
- **Contains**:
  - React components (pure presentation)
  - React hooks (thin wrappers around services)
  - Next.js pages
- **No**: Business logic, direct infrastructure access

## Service Injection

Services are injected via React Context:

```typescript
// The root layout establishes the provider boundary
<ServiceProvider>{children}</ServiceProvider>

// The provider creates services through the composition root,
// initializes ThemeService, and owns its cleanup.

// Presentation consumes via hooks
const { themeService } = useServices();
```

### Shared dialog binding

`Controls/Dialog` uses the thin `useDialog` hook and the existing provider's
`bindDialog` factory. The factory creates one native binding per mounted dialog;
it has no global open state or overlay stack. `createServices` injects
`NativeDialogBinding`, which owns modal operations, focus, document scroll/style
ownership and cleanup. Presentation never imports the concrete adapter.

`DialogBindingPort<TDialog, TFocus>` contains only generic handles, callbacks and
lifecycle methods. DOM types are supplied at the provider/adapter boundary, not
imported or constrained in Domain. ThemeService/bootstrap and game boundaries
remain unchanged. The [FS-1.6 record](tasks/fs-1.6-shared-dialog-primitive.md)
contains the reviewed consumer contract, lifecycle policy and browser evidence.

The FS-3.2 navigation consumer opts into `navigation` cleanup and the existing
binding's `document-overflow` strategy. Other consumers retain fixed-body locking
and dismissal restoration. Navigation suppresses all custom return targets and
saved-scroll replay; explicit release acknowledgment runs after owned cleanup.
A single `PortfolioNavigationHandoffPort` receipt in the existing provider bridges
outgoing/incoming portfolio owners. It retains Next/native routing and history,
resolves actual committed fragments, and schedules only bounded focus correction.
It is neither another modal manager nor an every-route focus framework. Root
cleanup cancels work; each owner removes its own browser listeners. See the
[FS-3.2 record](tasks/fs-3.2-navigation-lifecycle.md) for the measured changed-hash
ordering refinement, approved contract and validation limits.

## Testing Strategy

- **Unit Tests**: Test domain logic and application services in isolation
- **Integration Tests**: Test service interactions with infrastructure adapters
- **Component Tests**: Test presentation components with mocked services
- **E2E Tests**: Test full user flows

Tests should be colocated with source files (`*.test.tsx` next to source).

## Migration Notes

### Old Structure → New Structure

- `utils/motion/*` → `infrastructure/motion/*`
- `data/animations/logo.ts` → `application/animations/AnimationOrchestrator.ts`
- `hooks/useScrollProgress` → `hooks/useScrollProgressService` (wraps `ScrollService`)
- `components/ThemeSwitcher` delegates theme persistence and application to
  `ThemeService`; it owns only selection UI state.

ThemeService seeds its selected theme from validated storage on first
initialization, unless a user selection already exists. Later initialization,
subscriptions, current-theme reads and OS-change decisions retain that live
selection; denied writes cannot replace it with stale persisted data.
`getStoredTheme()` remains a storage query, including its System fallback for
missing/invalid/unreadable values. Cleanup releases listeners/subscribers but
retains the choice for provider effect replay. A new service after a full reload
reads storage again; persistence is not promised when storage is blocked.

`app/layout.tsx` renders `application/providers/ThemeBootstrapScript.tsx`, a thin
startup composition boundary alongside ServiceProvider. It imports only trusted
generated script data, not an executing browser initializer. The maintained
`infrastructure/theme/themeBootstrap.ts` reuses domain validation/storage key and
the small existing DOM/storage adapters. `scripts/build-theme-bootstrap.mjs`
compiles it into the tracked `frontend/generated/theme-bootstrap.ts`; normal
TypeScript imports do not run startup effects. No service factory, runtime manager
or new Presentation-to-Infrastructure import pattern is introduced.

The native inline `theme-script` executes once in the root HTML head, before the
parser reaches visible body content, without waiting for Next bootstrap chunks.
Storage read/media access failures fall back; normalization writes happen
independently after application. The generated payload and ownership are unchanged.
Dimi approved this bounded delivery correction on 2026-09-24; see the
[first-paint task evidence](tasks/maintenance-theme-first-paint.md). The earlier
[maintenance record](tasks/maintenance-theme-bootstrap.md) preserves historical
measurements of the superseded `beforeInteractive` queue and its light flash.
After hydration, `ThemeService` is
the sole runtime authority: it validates and persists selections, updates the
document theme, responds to system preference changes, and owns listener
cleanup through `ServiceProvider`. Consumers use `ThemeService.subscribe()` to
receive the selected and resolved themes immediately; polling and DOM mutation
observers are not part of the theme contract.

### Backward Compatibility

Some old imports may still work during migration, but new code should use the new architecture.

## Best Practices

1. **Keep Domain Pure**: No framework dependencies in domain layer
2. **Use Ports for Infrastructure**: Abstract external concerns behind interfaces
3. **Services via Hooks**: Components access services through React hooks
4. **Colocate Tests**: Keep tests next to source files
5. **Type Safety**: Use TypeScript strictly, avoid `any`
6. **Document Decisions**: Update this document when architecture changes

## Future Improvements

- [ ] Add ESLint rules to enforce import boundaries
- [ ] Consider feature-based organization for larger features
- [ ] Move design tokens to shared workspace if needed
- [ ] Add architecture decision records (ADRs) for major decisions
