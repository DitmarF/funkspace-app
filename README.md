# FunkSpace

[FunkSpace](https://funkspace.de/) is a personal portfolio and experimentation
space for accessible interfaces, animation and browser games. Its live portfolio
combines a responsive WEB animation, theme and motion controls, and a dedicated
contact page.

The repository is a pnpm workspace built with Next.js, React and TypeScript.
Shared design tokens feed both CSS and framework-neutral TypeScript; Storybook,
Vitest and Playwright support development and testing.

The first game, Wave Survivor, is a standalone TypeScript/Canvas package with its
own demo. Its dedicated portfolio play route is planned, not yet available.

## Requirements

- Node.js 22.22.0, the verified version in `.nvmrc` (package minimum: 22.13.1).
- pnpm 10.30.3, pinned in the root `packageManager` field.

## Install & run

From the repository root, in a shell compatible with POSIX environment syntax:

```bash
pnpm install --frozen-lockfile
pnpm build:tokens
CONTACT_ENABLED=false RESEND_API_KEY= CONTACT_FROM= CONTACT_TO= CONTACT_ALLOWED_ORIGINS= pnpm -F frontend dev
```

Open [http://localhost:3000](http://localhost:3000). The command explicitly
disables contact delivery and blanks its mail settings for that process; no
provider credentials are needed to browse locally. Local environment files and
inherited variables can otherwise change application behavior. See
[contact server setup](docs/development/contact-server.md) before working on
contact delivery.

Decorative animation is unavailable by default in a fresh setup, so the complete
static WEB artwork is shown. To enable the local animation feature, add
`NEXT_PUBLIC_ANIMATIONS_ENABLED=true` to the same command:

```bash
NEXT_PUBLIC_ANIMATIONS_ENABLED=true CONTACT_ENABLED=false RESEND_API_KEY= CONTACT_FROM= CONTACT_TO= CONTACT_ALLOWED_ORIGINS= pnpm -F frontend dev
```

Availability is separate from the visitor's System, On, Reduced or Off motion
selection and local Pause. The application retains static alternatives when
motion is unavailable or not permitted.

For Storybook, run `pnpm storybook` from the root and open
[http://localhost:6006](http://localhost:6006). The frontend dev and build
scripts generate the icon sprite and theme bootstrap automatically. When
changing theme-bootstrap source, follow the
[maintenance guide](docs/tasks/maintenance-theme-bootstrap.md) and do not edit
the generated module by hand.

## Project layout

```text
frontend/              Next.js app, UI, services and server-only contact route
games/wave-survivor/   Standalone Canvas game and demo
common/                Shared framework-independent tokens and motion utilities
tokens/                Design and motion token sources
styles/                Generated CSS tokens
e2e/                   Playwright browser tests
docs/                  Architecture, decisions, guides and task evidence
backend/               Reserved placeholder; not a separate running service
```

Read the [architecture overview](docs/architecture.md) for responsibilities
and dependency boundaries, and the [game plan](docs/features/wave-survivor-implementation-plan.md)
for the standalone game and its future portfolio integration.

## Testing & quality

```bash
pnpm lint
pnpm test
pnpm typecheck:validation
pnpm build
```

`pnpm coverage` adds Vitest coverage; contact layers also have a dedicated
`pnpm exec vitest run --config vitest.contact.config.ts --coverage` check.
Browser tests require an explicit Chromium installation via `pnpm setup:browsers`.
`pnpm e2e` uses the development server and may reuse an existing server outside
CI, so it is not evidence of a fresh or isolated candidate. Check the server
identity and use the relevant safe, delivery-off setup before running contact
or browser checks; do not use an unknown or live preview. The
[controlled contact fixture guide](docs/development/contact-manual-preview.md)
describes simulated states without sending mail.

The [CI workflow](.github/workflows/ci.yml) provisions dependencies and Chromium
then runs application checks in an isolated Linux environment with contact
delivery off. Local commands do not automatically reproduce that isolation.

## More information

- [Documentation index](docs/README.md) — current guides and historical evidence.
- [Contributing](CONTRIBUTING.md) — workflow and change checks.
- [Architecture](docs/architecture.md) and [package responsibilities](docs/architecture/packages.md).
- [Wave Survivor](games/wave-survivor/README.md) — standalone game and demo.
- [Contact operations](docs/development/contact-operations.md) — configuration,
  production operation and recovery.
- [Portfolio plan](docs/features/funkspace-minimum-usable.md) and
  [release record](docs/tasks/fs-6.5-public-rollout.md) — status and evidence.
- [AGENTS.md](AGENTS.md) — project instructions for coding agents.
