# Common

`common` is the private workspace package for framework-neutral assets shared by
FunkSpace applications. It exports generated TypeScript design-token modules
and the pure motion core through explicit package entry points.

## Motion core

`motion/` contains strict, deterministic TypeScript for easing, interpolation,
tween data, timeline resolution, sampling, seeking, and delta-based advancement.
It has no renderer, clock, lifecycle, or platform dependencies. Its dedicated
`tsconfig.json` intentionally excludes DOM libraries so React, DOM, SVG, Canvas,
and browser APIs cannot enter the core unnoticed.

Frontend SVG and HTML timelines consume this core and retain only platform
clocks, lifecycle, element lookup, and rendering. See
[`motion/README.md`](motion/README.md) for the adapter boundary.

## Generated tokens

Run `pnpm build:tokens` from the repository root to generate:

- `generated/colors.ts` — resolved primitive, semantic, and game colors grouped
  by theme.
- `generated/motion.ts` — duration, easing, and spring constants.
- `generated/themes.ts` — supported theme names and the default theme.

These files contain readonly data and TypeScript type aliases only. They are
intended for non-CSS consumers such as game renderers and build tooling. The
color modules contain resolved values so consumers do not need a DOM or CSS
custom-property resolver.

Do not edit files in `generated/` directly. Edit the JSON sources in `tokens/`
and rebuild. Handwritten code belongs in an explicit area such as `motion/`, not
beside generated artifacts. Consumers must use the public exports declared in
`package.json` rather than deep-importing package files.
