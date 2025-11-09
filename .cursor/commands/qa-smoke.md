## QA Smoke — Lint, Types, Unit, E2E, Perf

Run these in order. Approvals ON.

### 1) Lint & Prettier

```bash
pnpm lint
```

### 2) Typecheck (frontend)

```bash
cd frontend && pnpm exec tsc --noEmit && cd -
```

### 3) Unit tests (vitest)

```bash
pnpm test
```

### 4) E2E (Playwright)

```bash
pnpm e2e
```

### 5) Lighthouse CI (Performance)

```bash
pnpm lhci:ci
```

Runs Lighthouse CI with animations flag both OFF and ON. Validates:

- CLS ≤ 0.1 (p75)
- LCP ≤ 2500ms (p75)
- Performance score ≥ 0.9

Note: For animation testing, set `NEXT_PUBLIC_ANIMATIONS_ENABLED=true` before running.

### 6) A11y scan (axe via E2E)

```bash
pnpm e2e:smoke
```

Runs Playwright a11y smoke tests with axe-core. Verifies zero violations on key routes.
