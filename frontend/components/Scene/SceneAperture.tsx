"use client";

import { useEffect, useId, useState } from "react";
import { useServices } from "@/application/providers/ServiceProvider";
import {
  sceneApertures,
  type SceneApertureSelection,
} from "@/data/sceneApertures";
import { webPath, webViewBox } from "@/data/webApertureGeometry";
import styles from "./SceneAperture.module.css";

interface Props {
  selection?: SceneApertureSelection;
  onReady?(ready: boolean): void;
}
const circleHref =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="black"/></svg>',
  );
type LoadedAsset = { selection: SceneApertureSelection; href: string };

/** Full rectangular cover. Only the nested opening is contained/centered. */
export default function SceneAperture({
  selection = "circle",
  onReady,
}: Props) {
  const { apertureAssets } = useServices();
  const maskId = `fs-aperture-${useId().replace(/:/g, "")}`;
  const [supported, setSupported] = useState(false);
  const [asset, setAsset] = useState<LoadedAsset>();
  const [loaded, setLoaded] = useState<LoadedAsset>();
  const [failed, setFailed] = useState<LoadedAsset>();
  useEffect(() => apertureAssets.checkMask(setSupported), [apertureAssets]);
  useEffect(() => {
    let current = true;
    setAsset(undefined);
    if (selection === "circle") return;
    const release = apertureAssets.load(sceneApertures[selection], (href) => {
      if (current) setAsset(href ? { selection, href } : undefined);
    });
    return () => {
      current = false;
      release();
    };
  }, [apertureAssets, selection]);
  useEffect(() => {
    onReady?.(supported);
  }, [onReady, supported]);
  const href = asset?.selection === selection ? asset.href : undefined;
  const useAsset = Boolean(href && loaded === asset && failed !== asset);
  return (
    <svg
      className={styles.cover}
      aria-hidden="true"
      focusable="false"
      data-scene-aperture
      data-mask-ready={supported}
      data-aperture={useAsset ? selection : "circle"}
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="100%"
          height="100%"
          style={{ maskType: "luminance" }}
        >
          <rect width="100%" height="100%" fill="white" />
          <image
            x="10%"
            y="10%"
            width="80%"
            height="80%"
            preserveAspectRatio="xMidYMid meet"
            href={circleHref}
            onError={() => setSupported(false)}
            visibility={useAsset ? "hidden" : "visible"}
          />
          {href && (
            <image
              key={href}
              href={href}
              x="10%"
              y="10%"
              width="80%"
              height="80%"
              preserveAspectRatio="xMidYMid meet"
              visibility={useAsset ? "visible" : "hidden"}
              onLoad={() => setLoaded(asset)}
              onError={() => setFailed(asset)}
            />
          )}
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        className={styles.paint}
        mask={supported ? `url(#${maskId})` : undefined}
      />
      {!supported && (
        <svg
          x="10%"
          y="10%"
          width="80%"
          height="80%"
          viewBox={selection === "web" ? webViewBox : "0 0 100 100"}
          preserveAspectRatio="xMidYMid meet"
          data-aperture-fallback
        >
          {selection === "web" ? (
            <path
              d={webPath}
              fillRule="nonzero"
              className={styles.silhouette}
            />
          ) : (
            <circle cx="50" cy="50" r="50" className={styles.silhouette} />
          )}
        </svg>
      )}
    </svg>
  );
}
