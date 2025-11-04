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

- Node.js 22+
- PNPM 10+

## Install & run

```bash
pnpm install -r          # installs every workspace (frontend, backend, common)
pnpm build:tokens        # optional: regenerate styles/tokens.css from tokens/fs.tokens.json
pnpm -F frontend dev     # start the Next.js app on http://localhost:3000
```

- Storybook: `pnpm storybook` (opens on http://localhost:6006).
- Production build: `pnpm build` (compiles the frontend).

## Project layout

- `frontend/` – Next.js App Router UI, Tailwind themed with CSS variables from
  `styles/tokens.css`, Storybook configuration, and component library (Base,
  Controls, Modules, Layouts, Templates) located in `frontend/src`.
- `tokens/` – source of truth for design tokens; build outputs to `styles/`.
- `styles/` – generated CSS custom properties for default, dark, muted, and
  high-contrast themes.
- `tests/` – quality suites; `tests/unit` for Vitest with Testing Library and
  `tests/e2e` for Playwright (configured by `playwright.config.ts`).
- `backend/`, `common/` – stubs reserved for future API and shared domain code.
- `scripts/` – automation helpers (e.g. GitHub branch protection script).

### Theming

Tokens are transformed into CSS variables for each theme. Frontend components
consume the variables through Tailwind token utilities. The home page opts into
server components by default; the `ThemeSwitcher` is a small client component
that respects `system`, `default`, `dark`, `muted`, and high-contrast modes by
persisting the choice in `localStorage` and reacting to system preference
changes.

## Testing & quality

```bash
pnpm lint           # Next.js lint + prettier --check
pnpm test           # Vitest in CI mode
pnpm test:watch     # Vitest watch mode
pnpm coverage       # Vitest with V8 coverage thresholds (80% global)
pnpm e2e            # Playwright end-to-end suite (Chromium only)
```

Vitest is configured to reuse the frontend React installation and loads
`vitest.setup.ts` for Testing Library matchers. Coverage thresholds are enforced
only in CI but can be run locally via `pnpm coverage`.

## Playwright browser downloads

The postinstall hook installs the Chromium browser under `node_modules` so CI
caches can reuse the artifact. On Vercel, downloads are skipped automatically.

```bash
pnpm install
```

If downloads are blocked, direct the installer to an allow-listed mirror before
installing dependencies:

```bash
export PLAYWRIGHT_DOWNLOAD_HOST=https://playwright.azureedge.net
pnpm install
```

To install only Chromium outside of CI:

```bash
PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright install chromium --with-deps
```

Or fall back to the official Docker image, which ships with browsers preloaded:

```bash
docker run --rm -it mcr.microsoft.com/playwright:v1.53.2-jammy
```

## Deployment

Deploy the `frontend` workspace on Vercel. Set the install command to
`pnpm install` so workspaces are linked correctly, and enable **Include source
files outside of the Root Directory** to access shared packages. Builds run
`pnpm build` from the workspace root.

## Further reading

- `CONTRIBUTING.md` – detailed workflow, branch strategy, and CI expectations.
- `AGENTS.md` – quick reference for coding agents.
- `frontend/README.md` – Create Next App defaults (superseded by this document
  but kept for reference).
