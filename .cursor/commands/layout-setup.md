# Layout Setup — Fullscreen Scroll Layout

Use this command when developing fullscreen scroll layouts with snap sections and scroll-triggered animations.

For architecture and clean code rules, see `.cursor/rules/05-architecture.mdc`. For CI and perf targets, see `.cursor/rules/03-ci-cd.mdc`.

## Prerequisites

- `pnpm install` at repo root
- Node `>=22` (see `.nvmrc`)
- Design tokens built: `pnpm build:tokens`

## Workflow

### 1) Scaffold layout components

Create layout primitives following clean architecture:

- **Presentation layer**: `frontend/components/Layouts/FullscreenScroll.tsx` (container)
- **Presentation layer**: `frontend/components/sections/SnapSection.tsx` (section wrapper)
- **Presentation layer**: `frontend/components/sections/*.tsx` (section components like Hero, About)
- **Hooks**: `frontend/hooks/useScrollProgress.ts` (wraps ScrollService from application layer)
- **Stories**: `frontend/components/Layouts/*.stories.tsx` and `frontend/components/sections/*.stories.tsx`

**Architecture notes:**

- Components in `components/` are presentation layer.
- Use hooks (e.g., `useScrollProgressService`) to access services, not direct imports from `application/` or `infrastructure/`.
- Keep components pure; business logic lives in application and domain services (see `.cursor/rules/05-architecture.mdc` for details).

### 2) Build design tokens

```bash
pnpm build:tokens
```

Ensures motion tokens (durations, easings) are available as CSS variables.

### 3) Create Storybook stories

For each section and the composite layout:

```bash
# Create stories with fullscreen layout
# Use parameters: { layout: 'fullscreen' } in story config
```

Stories should:

- Test snap behavior (mandatory/proximity/none)
- Validate keyboard navigation and focus order
- Test with `innerScrollable` prop when applicable
- Include theme switcher controls

### 4) Lint & typecheck

```bash
pnpm lint
cd frontend && pnpm exec tsc --noEmit && cd -
```

### 5) Build frontend

```bash
pnpm -F frontend build
```

### 6) Visual verification (Storybook)

```bash
pnpm storybook
```

Open stories and verify:

- Sections snap correctly
- Keyboard navigation works (Page Up/Down, arrow keys)
- Focus order is logical
- Reduced motion is respected
- Mobile viewport units (`100dvh`) work correctly

### 7) E2E smoke test

```bash
pnpm e2e:smoke
```

Validates a11y (axe-core) on key routes.

## Architecture Guidelines

- **Dependency rules**: Components should not import from `infrastructure/` or `application/` directly
- **Service access**: Use hooks that wrap application services (e.g., `useScrollProgressService` wraps `ScrollService`)
- **Layer boundaries**: See `docs/architecture.md` for detailed dependency rules

## Notes

- Use `h-[100dvh]` for section heights (mobile-friendly viewport units)
- Respect `prefers-reduced-motion`; provide static fallbacks
- Animate only `transform` and `opacity` for performance
- Snap behavior: default `mandatory`; allow per-section override to `proximity` or `none`
- For animations: set `NEXT_PUBLIC_ANIMATIONS_ENABLED=true` when testing motion
