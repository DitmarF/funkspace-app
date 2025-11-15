## Animations — Setup & Verify

Run these in order. Approvals ON.

For CI, a11y, and performance targets, see `.cursor/rules/03-ci-cd.mdc`. For architecture and layering, see `.cursor/rules/05-architecture.mdc`.

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

### 7) Environment variable (for animation testing)

```bash
# Set NEXT_PUBLIC_ANIMATIONS_ENABLED=true to enable animations
export NEXT_PUBLIC_ANIMATIONS_ENABLED=true
pnpm -F frontend dev
```

### Notes

- Verifies motion tokens, Tailwind bindings, and Motion components compile.
- **NEXT_PUBLIC_ANIMATIONS_ENABLED**: Defaults to `false` (animations disabled). Must be set to `"true"` to enable animations. This flag gates all motion features.
- Respects `prefers-reduced-motion` when animations are enabled.
- For Storybook: animations are controlled by the same flag; set it before running `pnpm storybook`.
