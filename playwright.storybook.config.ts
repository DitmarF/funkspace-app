import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e/storybook",
  workers: 1,
  retries: 0,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:6006",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "pnpm -F frontend exec storybook dev --ci --no-open -p 6006",
    url: "http://127.0.0.1:6006",
    reuseExistingServer: !process.env.CI,
  },
});
