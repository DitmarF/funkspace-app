# Review Code

Use this command when you need a fast but thorough sweep of a change set before sign-off.

## Prerequisites

- `pnpm install` at repo root (workspace uses pnpm workspaces).
- Node `>=22` (see `.nvmrc`).
- Pull the latest `main` branch so comparisons are up to date.

## Workflow

1. **Sync context**
   - `git status` to confirm a clean tree or note local edits.
   - `git fetch origin && git rebase origin/main` (or merge) on the feature branch.
2. **Static analysis**
   - Run `pnpm lint` at repo root (covers `frontend` Next.js lint + Prettier check).
   - Fix any reported issues or annotate intentional exceptions.
3. **Unit tests**
   - Run `pnpm test` for Vitest coverage of shared/frontend logic.
   - If scope touches tokens or utilities, run targeted suites: `pnpm -F frontend test` or `pnpm -F common test` when they exist.
4. **Visual & a11y quick pass**
   - Storybook: `pnpm --filter frontend run storybook` (if UI touched) and inspect updated stories.
   - Confirm accessible names, focus order, and dark mode behaviour for changed components.
5. **E2E spot checks**
   - For user flows, run `pnpm e2e` (Playwright) or `pnpm e2e --project=chromium` for targeted runs.
6. **Performance validation**
   - Run `pnpm lhci:ci` to validate Lighthouse CI targets (CLS ≤ 0.1, LCP ≤ 2500ms, performance ≥ 0.9).
   - Check both animation flag states if motion code changed.
7. **Code review checklist**
   - **Architecture layers**: Verify imports follow dependency rules:
     - Domain: no dependencies (pure TypeScript)
     - Application: imports Domain only
     - Infrastructure: implements Domain ports/interfaces
     - Presentation (components/hooks): uses Application services via hooks, not direct imports
   - **Service injection**: Components should use hooks (e.g., `useTheme`, `useScrollProgressService`) to access services, not import from `infrastructure/` or `application/` directly.
   - **Type safety**: Verify props/state types stay strict (no `any`).
   - **Design system**: Ensure tokens and Tailwind classes respect design system + responsive behaviour.
   - **Security**: Confirm no secrets/logging leaks, and new APIs validate inputs.
   - **Definition of Done**: build ready, tests green, a11y addressed, documentation updated.

## Reporting

- Summarize findings with severity, affected files, and suggested fixes.
- Call out missing tests or docs as follow-ups.
- Attach relevant command outputs (lint/test) when flagging regressions.
