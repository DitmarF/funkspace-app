# FunkSpace

FunkSpace is a design-system-first web experience built as a PNPM workspace. The
repo houses a Next.js 15 frontend, shared design tokens generated with
Style Dictionary, Storybook documentation, Playwright end-to-end coverage, and a
Vitest suite for shared utilities.

The guiding principles for agents and contributors are captured in
`AGENTS.md`: use strict TypeScript, React function components, Tailwind tokens,
and optimize for accessibility and performance (respect dark mode and reduced
motion).

## Current milestone and entry points

Start with [FunkSpace — Minimum Usable Experience](docs/features/funkspace-minimum-usable.md) for the single intended portfolio plan, current statuses and publication limits. It preserves 44 tasks; final source reconciliation remains pending. The [FS-0.1 baseline](docs/tasks/fs-0.1-inventory-real-starting-point.md) owns reuse/inspection evidence, [FS-0.2](docs/tasks/fs-0.2-tooling-baseline.md) owns tooling/command evidence, and [FS-0.3](docs/tasks/fs-0.3-branch-integration-decision.md) records the approved integration and validated portfolio base. Substantial tasks follow the [AI workflow](docs/development/ai-workflow.md).

The portfolio milestone plans ordinary scrolling, content-driven sections and one bounded Canvas scene with a static alternative. These are future portfolio behavior, not claims about the current homepage. Game continuation remains [Wave Survivor EPIC 7](docs/features/wave-survivor-implementation-plan.md#epic-7--portfolio-play-shell-and-accessible-application-ui), after portfolio acceptance.

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
- Frontend dev/build generate the tracked inline theme bootstrap before Next starts. When editing its entry or shared imports, also run `pnpm watch:theme-bootstrap` in a second terminal; stop it with Ctrl-C when finished. Next watches the generated module. Ordinary component/Storybook work does not need this watcher.
- Before regenerating a reviewed checkout, run `pnpm check:theme-bootstrap` to detect stale output. Lint, tests and CI enforce freshness. Recover missing/stale output with `pnpm build:theme-bootstrap`, review its diff, then run types/tests. Do not hand-edit `frontend/generated/theme-bootstrap.ts`.
- Theme validation: `pnpm test:theme-bootstrap` checks source, shipped code, generator/watch behavior and dedicated 100% startup/DOM-adapter coverage. After `pnpm build` and browser setup, `pnpm e2e:theme-bootstrap` runs the production route on port 3100 with first-paint timing, delayed-framework-script checks at narrow/wide widths, reloads and a negative control. The existing `pnpm e2e` still uses the development server on port 3000.
- Portfolio production validation: check `pnpm check:theme-bootstrap` before generation, then run `pnpm build` (tokens → common types → game build → Next build) and `pnpm e2e:production`. The production configuration starts `next start` on port 3000 and refuses to reuse another server; stop your local preview first. It inherits the existing Chromium project only, not Safari/Firefox or physical-device coverage. `pnpm e2e` retains its development-server behavior.
- File flow and evidence: [typed theme bootstrap maintenance](docs/tasks/maintenance-theme-bootstrap.md). TypeScript source becomes generated script text; the small server-rendered wrapper delivers it inline in the HTML head. ThemeService takes over after startup. The [approved first-paint correction](docs/tasks/maintenance-theme-first-paint.md) replaces the earlier queued delivery. Runtime persistence consistency remains deferred to FS-3.3.
- Baseline results, security limitations and the full command sequence: [FS-0.2 task record](docs/tasks/fs-0.2-tooling-baseline.md).
- Current dependency versions, branch integration, validation and remaining security findings: [dependency maintenance record](docs/tasks/2026-09-12-branch-and-dependabot-review.md#authorized-integration-continuation). This later evidence supersedes the original FS-0.2 dependency inventory where explicitly recorded.

## Project layout

- `frontend/` – Next.js App Router UI, Tailwind themed with CSS variables from
  `styles/tokens.css`, Storybook configuration, and component library (Base,
  Controls, Modules, Layouts, Templates).
- `games/wave-survivor/` – accepted standalone TypeScript/Canvas game and demo; portfolio hosting remains separate work.
- `tokens/` – source of truth for design and motion tokens.
- `styles/` – generated CSS custom properties for default, dark, muted, and
  high-contrast themes.
- `common/generated/` – generated, framework-neutral TypeScript token constants.
- `common/motion/` – pure easing, interpolation, tween, and timeline utilities.
- `e2e/` – Playwright tests; configuration lives in `playwright.config.ts`.
- Colocated `*.test.ts`/`*.test.tsx` – Vitest suites; dedicated game tests also have a separate Node configuration.
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
when coverage runs. CI enables coverage by default; `pnpm coverage` also enables it locally.

## Playwright browser downloads

Browser installation is explicit; dependency installation no longer downloads browsers.
CI and E2E use `PLAYWRIGHT_BROWSERS_PATH=0`, so they resolve the same project-local Chromium.
Playwright is locked to the reviewed 1.55.1 release, which fixes the earlier
downloader certificate-verification advisory. Browser installation and both
Chromium suites passed in the dependency maintenance record:

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
files outside of the Root Directory** to access shared packages. With Root Directory
`frontend`, the verified Build Command override is `pnpm --workspace-root build`;
the root build performs tokens, common typecheck, game build and Next build.
FS-0.3 records the approved settings and deployment at its exact revision. Recheck
the target and obtain action-specific approval before later deployment/settings changes.

## Further reading

- `CONTRIBUTING.md` – detailed workflow, branch strategy, and CI expectations.
- `AGENTS.md` – quick reference for coding agents.
- `frontend/README.md` – Create Next App defaults (superseded by this document
  but kept for reference).
