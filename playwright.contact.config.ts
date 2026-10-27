import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { tmpdir } from "node:os";
import base from "./playwright.config";

// Require an isolated, built snapshot; never start/reuse the user's preview.
const workspace = process.env.CONTACT_E2E_WORKSPACE;
if (!workspace || !isAbsolute(workspace))
  throw new Error("Set CONTACT_E2E_WORKSPACE to the isolated built candidate.");
for (const directory of [workspace, join(workspace, "frontend")]) {
  for (const file of [
    ".env",
    ".env.local",
    ".env.production",
    ".env.production.local",
  ])
    if (existsSync(join(directory, file)))
      throw new Error(
        "Contact E2E snapshot must contain no environment files.",
      );
}
const egressPreloader = join(workspace, "deny-contact-egress.cjs");
if (!existsSync(egressPreloader))
  throw new Error(
    "Contact E2E snapshot requires the egress-denying preloader.",
  );

export default defineConfig({
  ...base,
  retries: 0,
  workers: 2,
  testMatch: [
    "contact-page.spec.ts",
    "main-navigation.spec.ts",
    "active-navigation.spec.ts",
    "contact-legal.spec.ts",
    "portfolio-navigation.spec.ts",
    "portfolio-sections.spec.ts",
    "about.spec.ts",
    "static-route-contract.spec.ts",
    "scene-customization.spec.ts",
  ],
  outputDir: join(tmpdir(), "funkspace-fs-5.4-e2e-results"),
  reporter: [
    ["list"],
    ["json", { outputFile: join(tmpdir(), "funkspace-fs-5.4-e2e.json") }],
  ],
  use: { ...base.use, baseURL: "http://127.0.0.1:33054" },
  webServer: {
    cwd: join(workspace, "frontend"),
    command: "node node_modules/next/dist/bin/next start -H 127.0.0.1 -p 33054",
    url: "http://127.0.0.1:33054/contact",
    reuseExistingServer: false,
    env: {
      CONTACT_ENABLED: "false",
      RESEND_API_KEY: "",
      CONTACT_FROM: "",
      CONTACT_TO: "",
      CONTACT_ALLOWED_ORIGINS: '["http://127.0.0.1:33054"]',
      NEXT_TELEMETRY_DISABLED: "1",
      NODE_OPTIONS: "--require=" + egressPreloader,
    },
  },
});
