"use client";

import { useLayoutEffect, useRef } from "react";
import {
  bindSceneStartup,
  sceneStartupScript,
} from "@/infrastructure/particles/SceneStartup";

/** Startup composition boundary; effects remain in the infrastructure adapter. */
export function SceneStartupScript({ available }: { available: boolean }) {
  const script = useRef<HTMLScriptElement>(null);
  useLayoutEffect(() => {
    const root = script.current?.parentElement;
    if (root) return bindSceneStartup(root, available);
  }, [available]);
  return (
    <script
      ref={script}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: sceneStartupScript(available) }}
    />
  );
}
