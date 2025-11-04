## Animations — Setup & Verify

Run these in order. Approvals ON.

### 1) Install deps (workspace root)

```bash
pnpm install
```

### 2) Generate design tokens (Style Dictionary)

```bash
pnpm build:tokens
```

### 3) Lint & format check

```bash
pnpm lint
```

### 4) Typecheck frontend

```bash
cd frontend && pnpm exec tsc --noEmit && cd -
```

### 5) Build frontend

```bash
pnpm -F frontend build
```

### 6) Smoke Storybook (optional for local visual check)

```bash
pnpm -F frontend storybook:build
```

### Notes

- Verifies motion tokens, Tailwind bindings, and Motion components compile.
- Respects NEXT_PUBLIC_ANIMATIONS_ENABLED and prefers-reduced-motion.
