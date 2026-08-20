# Motion core

This directory contains deterministic motion concepts shared by FunkSpace
renderers. It owns easing, numeric interpolation, tween data, timeline
resolution, sampling, seeking, and delta-based advancement.

It deliberately does not own clocks, render loops, element lookup, style
mutation, input, lifecycle callbacks, or rendering. React, DOM, SVG, Canvas,
WebGL, `requestAnimationFrame`, and platform globals are forbidden here.

The frontend `AnimationTimeline` and `HTMLTimeline` consume this package through
`@funkspace/common/motion`. They own animation-frame scheduling, lifecycle,
element lookup, and SVG/HTML property application; those concerns must not move
into this directory.

`index.ts` backs the package's public `./motion` export. Keep renderer-specific
property application outside this directory.
