import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { validateApertureExport } from "../frontend/infrastructure/particles/ApertureAssets.ts";
import { sceneApertures } from "../frontend/data/sceneApertures.ts";
import { webPath, webViewBox } from "../frontend/data/webApertureGeometry.ts";

const environment = new JSDOM("");
globalThis.DOMParser = environment.window.DOMParser;
try {
  for (const [key, asset] of Object.entries(sceneApertures)) {
    const source = readFileSync(
      new URL("../frontend/public" + asset.src, import.meta.url),
      "utf8",
    );
    validateApertureExport(source, asset.viewBox);
    if (key === "web") {
      const document = new DOMParser().parseFromString(source, "image/svg+xml");
      if (
        document.documentElement.getAttribute("viewBox") !== webViewBox ||
        document.querySelector("path")?.getAttribute("d") !== webPath ||
        document.querySelector("path")?.getAttribute("fill-rule") !== "nonzero"
      )
        throw new Error("WEB export and independent fallback differ");
    }
  }
  console.log(
    "Trusted aperture export profile passes; visual acceptance is separate.",
  );
} finally {
  environment.window.close();
  delete globalThis.DOMParser;
}
