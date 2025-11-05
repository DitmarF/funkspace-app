/**
 * Logo animation manifest
 * Defines the sequence of animations for the FunkSpace logo paths
 *
 * To change animation order, modify the `delay` values in the steps.
 * No code changes needed - just update the manifest!
 */

import type { AnimationManifest } from "@/utils/motion/types";

// Path lengths will be resolved at runtime via getTotalLength()
// These are placeholder values for documentation
const pathLengths = {
  path1: 420, // logo-path-1 (polygon)
  path2: 380, // logo-path-2 (s)
  path3: 350, // logo-path-3 (p)
  path4: 400, // logo-path-4 (a)
  path5: 360, // logo-path-5 (c)
  path6: 340, // logo-path-6 (e)
  path7: 320, // logo-path-7 (f)
  path8: 330, // logo-path-8 (u)
  path9: 310, // logo-path-9 (n)
  path10: 300, // logo-path-10 (k)
};

/**
 * Example manifest for first 2 paths
 * This demonstrates the pattern: stroke draw → fill fade
 */
export const logoManifestExample: AnimationManifest = {
  steps: [
    // Path 1: Stroke draw
    {
      target: "#logo-path-1",
      property: "strokeDashoffset",
      from: pathLengths.path1, // Will be resolved at runtime
      to: 0,
      duration: 800,
      easing: "emph",
    },
    // Path 1: Fill fade (after stroke)
    {
      target: "#logo-path-1",
      property: "opacity",
      from: 0,
      to: 1,
      duration: 200,
      delay: 100, // Starts 100ms after stroke begins
    },
    // Path 2: Stroke draw (staggered)
    {
      target: "#logo-path-2",
      property: "strokeDashoffset",
      from: pathLengths.path2, // Will be resolved at runtime
      to: 0,
      duration: 800,
      easing: "emph",
      delay: 120, // Starts 120ms after timeline start
    },
    // Path 2: Fill fade
    {
      target: "#logo-path-2",
      property: "opacity",
      from: 0,
      to: 1,
      duration: 200,
      delay: 220, // Starts 220ms after timeline start
    },
  ],
};

/**
 * Full manifest for all 10 logo paths
 * This will be populated with actual path lengths at runtime
 */
export const logoManifest: AnimationManifest = {
  steps: [
    // Path 1
    {
      target: "#logo-path-1",
      property: "strokeDashoffset",
      from: pathLengths.path1,
      to: 0,
      duration: 800,
      easing: "emph",
    },
    {
      target: "#logo-path-1",
      property: "opacity",
      from: 0,
      to: 1,
      duration: 200,
      delay: 100,
    },
    // Path 2
    {
      target: "#logo-path-2",
      property: "strokeDashoffset",
      from: pathLengths.path2,
      to: 0,
      duration: 800,
      easing: "emph",
      delay: 120,
    },
    {
      target: "#logo-path-2",
      property: "opacity",
      from: 0,
      to: 1,
      duration: 200,
      delay: 220,
    },
    // Additional paths can be added here following the same pattern
    // Change delay values to reorder animations without code changes
  ],
};
