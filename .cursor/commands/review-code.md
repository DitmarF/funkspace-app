# Review Code

Use this command when you need a fast but thorough sweep of a change set before sign-off.

## Reasoning mode (systematic 80/20 review)

- Clarify the **scope and risk** of the change (user flows, domains, layers touched).
- Scan for **high-impact issues first**:
  - Architecture & layering (see `.cursor/rules/05-architecture.mdc`).
  - a11y, performance, and security concerns (see `.cursor/rules/00-foundation.mdc`).
- Then verify:
  - Tests and CI coverage are appropriate (see `.cursor/rules/02-testing.mdc` and `.cursor/rules/03-ci-cd.mdc`).
  - Documentation and stories reflect the new behavior.
- For agents: briefly summarize findings and suggested fixes, grouped by severity.

## Prerequisites

- `pnpm install` at repo root (workspace uses pnpm workspaces).
- Node `>=22` (see `.nvmrc`).
- Pull the latest `main` branch so comparisons are up to date.

## Workflow

1. **Sync context**
   - `git status` to confirm a clean tree or note local edits.
   - `git fetch origin && git rebase origin/main` (or merge) on the feature branch.
2. **Static analysis & tests (CI parity)**
   - Run the **standard CI sequence** as defined in `.cursor/rules/03-ci-cd.mdc` (lint, typecheck, unit, E2E, build, Lighthouse).
   - For small, low-risk changes, you may run a focused subset (lint + unit + targeted E2E), but PRs should be CI-clean before merge.
3. **Visual & a11y quick pass**
   - Storybook: `pnpm --filter frontend run storybook` (if UI touched) and inspect updated stories.
   - Confirm accessible names, focus order, and dark mode behaviour for changed components.
4. **Code review checklist**
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
