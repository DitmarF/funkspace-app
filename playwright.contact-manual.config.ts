import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { tmpdir } from "node:os";

const directory = process.env.CONTACT_STORYBOOK_DIR;
if (!directory || !isAbsolute(directory))
  throw new Error(
    "Set CONTACT_STORYBOOK_DIR to the isolated static Storybook build.",
  );
for (const file of ["index.html", "iframe.html", "index.json"])
  if (!existsSync(join(directory, file)))
    throw new Error(
      "Contact Storybook checks require a complete static build.",
    );

const root = __dirname;
const quote = (value: string) => "'" + value.replaceAll("'", "'\\''") + "'";
const command = [
  process.execPath,
  join(root, "scripts/serve-contact-preview.mjs"),
  "--dir",
  directory,
  "--host",
  "127.0.0.1",
  "--port",
  "33155",
]
  .map(quote)
  .join(" ");

export default defineConfig({
  testDir: "e2e/storybook",
  testMatch: "contact-manual.spec.ts",
  timeout: 35_000,
  expect: { timeout: 5_000 },
  retries: 0,
  workers: 2,
  outputDir: join(tmpdir(), "funkspace-fs54-manual-e2e-results"),
  reporter: [
    ["list"],
    ["json", { outputFile: join(tmpdir(), "funkspace-fs54-manual-e2e.json") }],
  ],
  use: {
    baseURL: "http://127.0.0.1:33155",
    contextOptions: { reducedMotion: "reduce" },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    cwd: root,
    command,
    url: "http://127.0.0.1:33155/index.json",
    reuseExistingServer: false,
    env: {
      CONTACT_ENABLED: "false",
      RESEND_API_KEY: "",
      CONTACT_FROM: "",
      CONTACT_TO: "",
    },
  },
});
