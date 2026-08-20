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

// Presentation using Application service
import { useTheme } from "@/hooks/useTheme";
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
// Infrastructure creates services
const services = createServices();

// Application provides via Context
<ServiceProvider services={services}>
  {children}
</ServiceProvider>

// Presentation consumes via hooks
const { themeService } = useServices();
```

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
- `components/ThemeSwitcher` → Uses `useTheme` hook (wraps `ThemeService`)

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
