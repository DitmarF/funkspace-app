# FunkSpace

FunkSpace is a design-system-first web experience built as a PNPM workspace. The
repo houses a Next.js 15 frontend, shared design tokens generated with
Style Dictionary, Storybook documentation, Playwright end-to-end coverage, and a
Vitest suite for shared utilities.

The guiding principles for agents and contributors are captured in
`AGENTS.md`: use strict TypeScript, React function components, Tailwind tokens,
and optimize for accessibility and performance (respect dark mode and reduced
motion).

## Requirements

- Node.js 22.22.0 for the verified baseline (`.nvmrc`); package minimum 22.13.1.
- pnpm 10.30.3 (`packageManager` in the root manifest; CI uses this pin).

## Install & run

```bash
pnpm install --frozen-lockfile # installs every active workspace without resolving a new graph
pnpm build:tokens        # regenerate CSS and TypeScript token artifacts
pnpm -F frontend dev     # start the Next.js app on http://localhost:3000
```

- Storybook: `pnpm storybook` (opens on http://localhost:6006).
- Production build: `pnpm build` (tokens → common typecheck → game build → frontend build).
- Direct frontend builds require generated tokens first; use the root build for the complete prerequisite order.
- Baseline results, security limitations and the full command sequence: [FS-0.2 task record](docs/tasks/fs-0.2-tooling-baseline.md).

## Project layout

- `frontend/` – Next.js App Router UI, Tailwind themed with CSS variables from
  `styles/tokens.css`, Storybook configuration, and component library (Base,
  Controls, Modules, Layouts, Templates).
- `src/` – shared UI primitives consumed by Vitest demos (e.g. `Hello`).
- `tokens/` – source of truth for design and motion tokens.
- `styles/` – generated CSS custom properties for default, dark, muted, and
  high-contrast themes.
- `common/generated/` – generated, framework-neutral TypeScript token constants.
- `common/motion/` – pure easing, interpolation, tween, and timeline utilities.
- `e2e/` – Playwright tests; configuration lives in `playwright.config.ts`.
- `__tests__/` – Vitest suites run with React Testing Library.
- `backend/` – stub reserved for possible future server capabilities.
- `common/` – private framework-neutral package exporting generated TypeScript
  token artifacts and the shared motion core.
- `scripts/` – automation helpers (e.g. GitHub branch protection script).

### Theming

Tokens are transformed into CSS variables for the frontend and TypeScript
constants for framework-neutral consumers such as games. Frontend components
continue to consume CSS variables through Tailwind token utilities. The home
page opts into server components by default; the `ThemeSwitcher` is a small
client component that respects `system`, `default`, `dark`, `muted`, and
high-contrast modes by persisting the choice in `localStorage` and reacting to
system preference changes.

## Testing & quality

```bash
pnpm lint           # Next.js lint + prettier --check
pnpm test           # Vitest in CI mode
pnpm test:watch     # Vitest watch mode
pnpm coverage       # V8: 75% lines/functions/statements, 80% branches; configured exclusions apply
pnpm e2e            # Playwright end-to-end suite (Chromium only)
```

Vitest is configured to reuse the frontend React installation and loads
`vitest.setup.ts` for Testing Library matchers. Coverage thresholds are enforced
only in CI but can be run locally via `pnpm coverage`.

## Playwright browser downloads

Browser installation is explicit; dependency installation no longer downloads browsers.
CI and E2E use `PLAYWRIGHT_BROWSERS_PATH=0`, so they resolve the same project-local Chromium.
The locked Playwright 1.53.2 downloader has a certificate-verification advisory; the
FS-0.2 baseline used an already present browser. Review the dependency proposal in
the task record before a fresh download. After that prerequisite is resolved:

```bash
pnpm setup:browsers
pnpm e2e
pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config playwright.demo.config.ts
```

The default E2E configuration covers Desktop Chromium and excludes the standalone
game demo. The separate demo suite uses Chromium with its own Vite server. Neither
configuration establishes WebKit or real-device coverage. Keep ports 3000 and 5173
free when checking a particular candidate; local configurations may reuse servers.

For a dependency-only setup check, `pnpm install --frozen-lockfile --ignore-scripts`
skips lifecycle scripts deliberately. This is not proof that browser prerequisites
are installed. Add `--offline` only when the pnpm store already contains the locked graph.

Lighthouse commands set `NEXT_PUBLIC_ANIMATIONS_ENABLED` **during the build**:
`pnpm lhci:off`, then `pnpm lhci:on`. Both measure `/`; the current home route has no
animated logo, so these measurements do not establish an animation-on cost comparison.

## Deployment

Deploy the `frontend` workspace on Vercel. Set the install command to
`pnpm install --frozen-lockfile` so workspaces are linked correctly, and enable **Include source
files outside of the Root Directory** to access shared packages. Builds run
`pnpm build` from the workspace root.

## Further reading

- `CONTRIBUTING.md` – detailed workflow, branch strategy, and CI expectations.
- `AGENTS.md` – quick reference for coding agents.
- `frontend/README.md` – Create Next App defaults (superseded by this document
  but kept for reference).
