# Home header logo color — 2026-09-24

## Completion update — 2026-09-25

Included in the completed FS-3.1 change set. Dimi gives device acceptance,
confirms the P2 corrections are applied, and authorizes commit/push of all
current changes. See the [FS-3.1 acceptance record](fs-3.1-navigation-settings-overlay.md#dimi-device-acceptance-and-completion--2026-09-25).
Earlier pending-acceptance and review statements below describe their original
handoff dates; no new independent review or additional device detail is inferred.

## Reverted at Dimi's request

Current behavior: original theme-aware logo color restored. Removed the Home
opt-in, unused `logoTone` prop and scoped indigo CSS. The three implementation
files match their exact pre-indigo bytes; all other local work is preserved.
Sites is the single writer; branch/base remain those recorded below.
Evidence: sibling `artifacts/home-logo-revert/` contains input hashes, exact
incremental diff, file manifest and validation log. No new approval or independent
review is claimed. Dimi's next acceptance action is to inspect the restored logo.

Validation: focused shell/logo tests, lint and type checking are recorded in
the revert evidence. Production/Storybook builds and browser/Lighthouse checks
below describe the superseded indigo candidate and were not rerun for this
exact restoration.

## Superseded indigo candidate

- Request/owner: Dimi requests `--fs-color-indigo` only on the top-left home-page logo. Sites is the single implementation writer.
- Branch/base: `feature/funkspace-minimum-usable` / `b78a4169e15edf8f549f04717151efa043c09e01`. Existing local changes and 547 input files preserved; no commit/reset/deployment.
- Decision: optional `PortfolioShell.logoTone` presentation prop (`default | indigo`, default unchanged). Only Home opts into indigo. The CSS binding is scoped to that header SVG, retaining its unfilled outline and theme-specific indigo token values. Shared logo geometry, static/motion behavior, other pages, focus outline, body text, tokens and theme bootstrap are unchanged.
- Files: `frontend/app/page.tsx`, `frontend/components/Layouts/PortfolioShell.tsx`, `frontend/components/Layouts/PortfolioShell.module.css`, this record.
- Evidence root: `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/home-logo-indigo/`. Input hashes, exact incremental/full candidate patches, manifest, command logs and 320/1280px previews are retained there.

Actual checks in the isolated source copy
`/var/folders/mc/hyg7fvq95rz1vdfk_tkx3nsc0000gn/T/funkspace-navigation-tree-_fsl0af0`:

- `pnpm exec vitest run frontend/components/Layouts/PortfolioShell.test.tsx frontend/components/Logo/FunkSpaceLogoInline.test.tsx frontend/components/Logo/LogoMotion.test.tsx` — PASS, 27 tests.
- `pnpm lint`, `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build`, `pnpm -F frontend exec tsc --noEmit`, `pnpm storybook:build` — PASS. Existing Next lint deprecation and Storybook large-chunk advisories remain.
- `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/funkspace-home-logo.config.ts` — PASS, one temporary visual verification fixture exercising Home/About/Privacy/Impressum at 320/1280px in four themes. Computed filled/stroked logo paints match indigo only on Home; the unfilled outline remains unfilled. Fixture/config retained with evidence.
- `CHROME_PATH='/Users/dimi/Projects/funkspace-app/node_modules/.pnpm/playwright-core@1.55.1/node_modules/playwright-core/.local-browsers/chromium-1193/chrome-mac/Chromium.app/Contents/MacOS/Chromium' pnpm exec lhci autorun --config=/tmp/funkspace-home-logo-lighthouse.json` — PASS, three local runs against unchanged budgets; no upload.
- Focused Prettier / `git diff --check` — PASS. Exact patch replay and unchanged-input hash checks passed. Builds reused installed dependencies; no fresh install was attempted.

Author inspected the diff and 320/1280px screenshots, including the unchanged
large home-content logo. No duplicate component, listener, motion change or
generated drift. Task-owned preview servers stopped. Independent review is not
started. Dimi owns the next action: visual/device acceptance of the home-page
header logo; automated results are not Dimi's approval.
