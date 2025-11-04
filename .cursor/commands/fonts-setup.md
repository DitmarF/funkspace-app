# Fonts Setup — Quick QA

Run these in order. Approvals ON.

## 1) Lint & Prettier

```bash
pnpm lint
```

## 2) Typecheck (frontend)

```bash
cd frontend && pnpm exec tsc --noEmit && cd -
```

## 3) E2E Smoke (Playwright)

```bash
pnpm e2e
```

Notes:

- Expects fonts present under `frontend/public/fonts/**`.
- `/typography` can be opened manually to verify the weight ramp (100→900).
