# Contributing to FunkSpace

FunkSpace is a pnpm workspace. The [README](README.md) provides prerequisites,
safe local setup and a project map; the
[architecture overview](docs/architecture.md) describes package and layer
boundaries.

## Working on a change

1. Create a descriptive branch from the appropriate current base and inspect
   the existing implementation, documentation and tests.
2. Keep changes focused. Reuse existing components, services and tokens; protect
   accessible navigation, theme and motion behavior, and the standalone game
   boundary.
3. Update relevant documentation and add proportionate tests when behavior
   changes. Preserve historical task evidence instead of rewriting earlier
   decisions as current facts.
4. Review the complete diff, then open a pull request explaining the problem,
   the change and its validation. Follow the repository's actual checks and
   review requirements for the proposed target.

Use the [AI development workflow](docs/development/ai-workflow.md) for detailed
planning, review, testing and handoff guidance. Commit messages should be short
and descriptive; prefixes such as `feat:`, `fix:` and `docs:` are useful.
`git commit -s` adds a sign-off line; cryptographic commit signing is a separate
Git configuration and operation.

## Local setup and checks

Use the root README's `pnpm install --frozen-lockfile`, token generation and
mail-disabled dev command. There is no required root `.env.example` for ordinary
local browsing. Do not put credentials in tracked files.

Typical checks from the workspace root are:

```bash
pnpm lint
pnpm test
pnpm typecheck:validation
pnpm build
```

Choose additional browser, accessibility, game and contact checks according to
the change. The [CI workflow](.github/workflows/ci.yml) shows the hosted checks.
Local `pnpm e2e` may reuse an already running development server; it does not
provide CI's isolated, mail-off environment. For contact and browser testing,
use a fresh credential-free, delivery-off setup and the existing
[controlled fixture guidance](docs/development/contact-manual-preview.md).
Never send real mail as part of routine checks.

## Release and configuration

Changes to deployment targets, environment settings or DNS are operational
actions and should be coordinated separately from a code review. A merge to the
production branch can trigger a deployment. Review the
[release and recovery guide](docs/development/portfolio-release.md) and
[contact operations](docs/development/contact-operations.md) before changing
release or mail behavior; do not add credentials to issues, pull requests or
documentation. The checked-in `.github/branch-protection.json` is a snapshot,
not proof of current repository settings.
