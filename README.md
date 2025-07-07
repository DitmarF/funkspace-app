# FunkSpace: GitHub + Slack bot

- This is a monorepo with a Next.js frontend 🚀
- The backend is a Slack-compatible API built in Next.js 🚀

# FunkSpace App

## Tests

Run unit tests without collecting coverage:

```bash
pnpm test
```

Generate a coverage report (used in CI):

```bash
pnpm coverage
```

## Playwright browser downloads

End-to-end tests use Playwright with only the Chromium browser. The `postinstall`
script installs this browser under `node_modules` so it can be cached in CI. On
Vercel the installation is skipped automatically:

```bash
pnpm install
```

If Playwright downloads fail due to network restrictions, point the installer at
an allow-listed mirror before running `pnpm install`:

```bash
export PLAYWRIGHT_DOWNLOAD_HOST=https://playwright.azureedge.net
```

When running outside of CI, you can skip Firefox and WebKit downloads by
installing only Chromium:

```bash
PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright install chromium --with-deps
```

If downloads remain impossible, use the official Docker image which already
contains all browsers:

```bash
docker run --rm -it mcr.microsoft.com/playwright:v1.53.2-jammy
```
