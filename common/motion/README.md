# Motion core

This directory contains deterministic motion concepts shared by future
FunkSpace renderers. It owns easing, numeric interpolation, tween data, timeline
resolution, sampling, seeking, and delta-based advancement.

It deliberately does not own clocks, render loops, element lookup, style
mutation, input, lifecycle callbacks, or rendering. React, DOM, SVG, Canvas,
WebGL, `requestAnimationFrame`, and platform globals are forbidden here.

The existing frontend `AnimationTimeline` and `HTMLTimeline` remain unchanged
and continue to drive current animations. A later adapter task may consume this
core after `common` is activated as a workspace package and compatibility tests
protect the migration.

Use `index.ts` as the future public entry point. Keep renderer-specific property
application outside this directory.
