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

### 5) Perf spot-check (manual/Lab)

```bash
# Lighthouse (manual if LHCI not configured):
# 1) Start preview locally, run Lighthouse in Chrome on /
# 2) Record LCP/INP/CLS; target: CLS ≤ 0.1; minimal LCP/INP delta
```

### 6) A11y scan (axe via Storybook or E2E route)

```bash
# If Storybook is available, open and run addon-a11y checks.
# Otherwise, run E2E a11y assertions (if implemented) on /
```
