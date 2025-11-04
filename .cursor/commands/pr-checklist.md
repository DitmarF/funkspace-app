## PR Checklist — CI Parity

Run with Approvals ON before opening the PR.

### 1) Lint & Prettier

```bash
pnpm lint
```

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

### 6) Perf & A11y (manual checkpoints)

```bash
# Perf targets: CLS ≤ 0.1; minimal LCP/INP delta vs baseline
# A11y: zero axe violations on /
```

### 7) Content & Docs

```bash
# Verify docs/features/home-animations.md is current and accurate
# Confirm NEXT_PUBLIC_ANIMATIONS_ENABLED flow is documented
```
