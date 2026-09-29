"use client";

import { createContext, useContext } from "react";

/** Per-shell presentation gates, never a motion preference or modal owner. */
export const ScenePresentationContext = createContext({
  introReady: true,
  occluded: false,
});

export const useScenePresentation = () => useContext(ScenePresentationContext);
