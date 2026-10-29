# FunkSpace frontend

This workspace contains the Next.js portfolio application, reusable UI
components and the server-only contact endpoint. It uses React, TypeScript,
Tailwind utilities and generated semantic design tokens.

Start from the [root README](../README.md) for pnpm installation, local
mail-disabled development, optional animation and checks. No provider
credentials are required for ordinary local browsing.

Key directories:

- `app/` — public routes, root layout and the contact API route.
- `components/` and `features/` — presentation components and integrations.
- `domain/`, `application/` and `infrastructure/` — application boundaries,
  services and browser/server adapters.
- `data/` — declarative content and configuration.
- `.storybook/` — Storybook setup.

The frontend uses the self-hosted Work Sans and Space Grotesk fonts. The
[architecture overview](../docs/architecture.md),
[contact server guide](../docs/development/contact-server.md) and
[theme-bootstrap maintenance guide](../docs/tasks/maintenance-theme-bootstrap.md)
describe the main integration and operational boundaries.
