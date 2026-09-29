import type { ApertureAsset } from "@/domain/ports/ApertureAssetPort";
import { webViewBox } from "./webApertureGeometry";

export const technicalDiamond = {
  src: "/scene-apertures/technical-diamond.svg",
  viewBox: "0 0 100 100",
} as const satisfies ApertureAsset;

export const webAperture = {
  src: "/scene-apertures/web-work-sans.svg",
  viewBox: webViewBox,
} as const satisfies ApertureAsset;

// Repository-authored exports authorized by Dimi; no Illustrator provenance claimed.
export const sceneApertures = {
  web: webAperture,
  "technical-diamond": technicalDiamond,
} as const;
export type SceneApertureSelection = "circle" | keyof typeof sceneApertures;
