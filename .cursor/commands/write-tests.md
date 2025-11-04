# Write Tests

Use this playbook to craft or extend automated tests with consistent tooling and coverage expectations.

## Prerequisites

- Install deps: `pnpm install` at repo root.
- Ensure Playwright browsers are installed (handled by `postinstall`, or run `pnpm exec playwright install chromium`).
- Start from a clean git workspace to isolate changes.

## Test Authoring Steps

1. **Clarify intent**
   - Identify the behaviour, edge cases, and accessibility requirements being validated.
   - Prefer unit tests (Vitest + Testing Library) for logic/components; reach for Playwright only when the flow spans multiple components or routes.
2. **Locate files**
   - Co-locate tests next to source: `Component.tsx` → `Component.test.tsx` in the same folder.
   - Reuse shared helpers under `common/` when possible.
3. **Write the test**
   - For React: use `@testing-library/react`, assert via `screen` and user-oriented queries.
   - Mock network calls and timers to keep tests deterministic; avoid real network I/O.
   - Cover happy path, failure states, and a11y (focus, ARIA labels) scenarios.
   - Keep tests type-safe: no `any`, explicit expect types when needed.
4. **Run suites**
   - Unit: `pnpm test` (or `pnpm test --runInBand` for debugging).
   - Watch mode: `pnpm test:watch` with pattern filters (`p` command) for rapid iteration.
   - UI flows: `pnpm e2e --project=chromium` for headless, or `pnpm e2e:ui` for interactive runs.
5. **Evaluate coverage**
   - `pnpm coverage` to ensure meaningful lines/branches exercised; highlight intentional gaps.

## Submission Checklist

- Tests pass locally (attach command output when opening PRs).
- Snapshots reviewed and committed if used.
- Update docs or stories when behaviour changes.
- Record flaky or slow tests for follow-up (open an issue if >5s or non-deterministic).
