# ADR-002: Design tokens as the source of truth

Date: 2026-08-20

## Status

Accepted

## Context

FunkSpace is design-system-first and must present a coherent visual and motion language across portfolio pages, Storybook components, experiments, and games. It supports multiple themes and reduced-motion behavior.

The repository defines shared design values in `tokens/fs.tokens.json`, motion values in `tokens/fs.motion.tokens.json`, and game application roles in `tokens/fs.game.tokens.json`. Style Dictionary transforms those sources into `styles/tokens.css`, and Tailwind maps shared UI utilities to generated CSS custom properties.

If components or experiences define competing colors, spacing, typography, durations, or easing values, themes drift and global changes become risky. Generated CSS is also unsuitable as an authoring source because regeneration overwrites manual edits.

## Decision

The JSON files in `tokens/` are the source of truth for shared visual and motion decisions.

- Edit `tokens/fs.tokens.json` for shared color, spacing, and typography values.
- Edit `tokens/fs.motion.tokens.json` for shared duration and easing values.
- Edit `tokens/fs.game.tokens.json` for game application roles that reference shared semantic tokens.
- Generate `styles/tokens.css` with `pnpm build:tokens`; never hand-edit the generated file.
- Tailwind configuration and component styles must consume generated CSS variables rather than duplicate token values.
- Prefer semantic tokens such as content, surface, action, feedback, and border roles in product code. Primitive values belong at the token-definition layer.
- Reusable components, portfolio pages, and interactive experiences use the same shared token contract.
- A value may remain local when it is truly internal to one experiment or simulation and has no design-system meaning. Promote it to a token when it becomes shared, theme-dependent, or part of the visible FunkSpace language.
- Token changes must include regenerated output and validation of affected themes, components, stories, and reduced-motion states.

## Consequences

### Positive

- Themes and experiences share a consistent visual language.
- Global design changes are explicit, reviewable, and mechanically generated.
- Storybook, Tailwind, and application CSS use the same values.
- Agents have one authoritative place to inspect before introducing a design value.

### Trade-offs

- Token changes require a generation step and review of generated output.
- Poorly named or overly specific tokens can make the system harder to use.
- Experimental values require judgment: promoting everything creates noise, while keeping shared values local creates drift.
- A token change can have a broad visual impact and therefore needs proportionate visual and accessibility review.

## Alternatives considered

### Hardcode values in components

Rejected because it creates visual drift, weakens theming, and makes global changes expensive.

### Treat generated CSS as the source of truth

Rejected because generated files are outputs and will be overwritten by Style Dictionary.

### Define the design system only in Tailwind configuration

Rejected because it couples the design language to one styling consumer and makes non-Tailwind renderers harder to support.

### Maintain separate tokens for each experiment or game

Rejected as the default because it fragments the FunkSpace identity. An isolated experience may add local simulation constants, but shared design decisions remain in the repository token sources.
