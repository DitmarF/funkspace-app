## PR Checklist — CI Parity

Run with Approvals ON before opening the PR.

### 1) Standard CI sequence (canonical)

- Run the **full CI pipeline locally** as defined in `.cursor/rules/03-ci-cd.mdc` (lint, typecheck, unit, E2E, build, Lighthouse).
- Fix any failures before requesting review.

### 2) Typecheck (frontend)

```bash
cd frontend && pnpm exec tsc --noEmit && cd -
```

### 3) Unit tests

```bash
pnpm coverage
```

### 4) E2E tests

```bash
pnpm e2e
```

### 5) Tokens built and imported

```bash
pnpm build:tokens
```

### 6) Lighthouse CI (Performance)

```bash
pnpm lhci:ci
```

Runs Lighthouse CI with animations flag both OFF and ON. Validates:

- CLS ≤ 0.1 (p75)
- LCP ≤ 2500ms (p75)
- Performance score ≥ 0.9

### 7) A11y scan

- Run the a11y smoke suite (axe via Playwright), typically:

```bash
pnpm e2e:smoke
```

Verifies zero violations on key routes.

### 8) Environment variables

Verify `NEXT_PUBLIC_ANIMATIONS_ENABLED` is documented if animations are added/modified:

- Default: `false` (animations disabled)
- Set to `"true"` to enable animations
- Must be documented in feature docs when used

### 9) Content & Docs

```bash
# Verify docs/features/*.md files are current and accurate
# Confirm NEXT_PUBLIC_ANIMATIONS_ENABLED flow is documented if applicable
```
