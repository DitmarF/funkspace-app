## QA Smoke — Lint, Types, Unit, E2E, Perf

Quick local confidence check. Approvals ON.

### 1) Core checks

- Lint & types:

```bash
pnpm lint
cd frontend && pnpm exec tsc --noEmit && cd -
```

- Unit tests (fast vitest run):

```bash
pnpm test
```

### 2) E2E & a11y

- Core E2E flows:

```bash
pnpm e2e
```

- A11y smoke (axe via Playwright):

```bash
pnpm e2e:smoke
```

Verifies zero violations on key routes.

### 3) Performance spot-check (optional)

- For perf‑sensitive changes, run Lighthouse CI as described in `.cursor/rules/03-ci-cd.mdc`:

```bash
pnpm lhci:ci
```

This validates CLS, LCP, and performance score with animations OFF and ON (set `NEXT_PUBLIC_ANIMATIONS_ENABLED=true` when testing motion).
