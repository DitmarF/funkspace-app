# Common

`common` is the boundary for framework-neutral assets shared by FunkSpace
applications. It is not an installable workspace package yet; it currently
contains generated TypeScript design-token modules only.

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
and rebuild. When `common` becomes an installable package, expose these modules
through explicit package exports rather than introducing deep imports.
