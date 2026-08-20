# Design token hierarchy

This document audits the current FunkSpace token system and recommends a hierarchy that can serve the portfolio, standalone games, and future interactive applications. It does not change token sources, generated styles, or consumers.

Related decisions and boundaries:

- [`ADR-002: Design tokens as the source of truth`](../decisions/ADR-002-design-token-source-of-truth.md)
- [`Workspace package responsibilities`](packages.md)

## Audit scope

The audit covers:

- `tokens/fs.tokens.json`
- `tokens/fs.motion.tokens.json`
- `style-dictionary.config.mjs`, which the root `build:tokens` script executes
- `style-dictionary.config.ts`, an inactive alternate configuration
- Generated `styles/tokens.css`
- `frontend/tailwind.config.ts`
- Representative frontend CSS, components, stories, and sandbox usage

## Current source and build flow

```text
tokens/fs.tokens.json -----------+
                                  +-> Style Dictionary -> styles/tokens.css
tokens/fs.motion.tokens.json ----+
                                                |
                                                +-> frontend/app/globals.css
                                                +-> Storybook token docs/themes
                                                +-> Tailwind CSS-variable mappings
```

The JSON files use Design Tokens Community Group-style `$type` and `$value` fields. Tokens place the mode at the final path segment: `default`, `dark`, `muted`, or `dark-high-contrast`.

The active `style-dictionary.config.mjs` configuration:

1. Loads both JSON sources.
2. Selects tokens by the last path segment for each mode.
3. Flattens every token to `--fs-<base-name>`.
4. Emits `default` values under `:root`.
5. Emits other color modes under `[data-theme="dark"]`, `[data-theme="muted"]`, and `[data-theme="dark-high-contrast"]`.
6. Adds Storybook token-category comments for known groups.

The generated CSS currently contains 81 variables in `:root` and 43 color variables in each non-default theme block. `frontend/app/globals.css` imports that generated file directly, and Storybook imports the same global CSS and switches the `data-theme` attribute.

`style-dictionary.config.ts` is not invoked by any package script. It duplicates the formatter without the category metadata in the active `.mjs` file and can drift. It should be removed or made canonical in a later configuration task, not during this audit.

## Current token inventory

### Colors

The source contains 23 named primitive color slots across `FS-Primitive-Colors` and `FS-Primitive-Colors-extended`. Every slot has four mode values.

Examples include red, vermilion, orange, amber, yellow, green, cyan, blue, violet, magenta, greys, white, black, chartreuse, and indigo.

These are called primitives, but they are not stable raw palette values. Their values change by theme; for example, the token named `color-white` becomes black in dark modes, and `color-black` becomes white. They currently behave more like theme palette slots than immutable primitives.

### Existing semantic colors

There are 20 semantic color roles, also defined independently for all four modes:

| Group | Current roles |
| --- | --- |
| Surface | `background`, `elevation-1`, `elevation-2`, `overlay` |
| Content | `inverse`, `elevation-2`, `elevation-1`, `primary`, `disabled` |
| Action | `primary`, `hover`, `link`, `disabled` |
| Feedback | `success`, `warning`, `error`, `info` |
| Border | `subtle`, `strong`, `focus` |

The semantic tokens repeat RGBA literals. They do not reference primitive tokens, and no source token in either JSON file uses a token alias. The relationship between a primitive and a semantic role is therefore maintained manually.

### Spacing and typography

`fs.tokens.json` also contains:

- Nine spacing values from `space-3xs` through `space-3xl`.
- Two font-family values.
- Five font sizes.
- Four font weights.
- Three line heights.

These have only a `default` mode and are emitted under `:root`.

The spacing variables are generated but are not mapped into the current Tailwind spacing scale. The generated font-family tokens specify Inter and JetBrains Mono, while the frontend Tailwind configuration uses self-hosted Work Sans and Space Grotesk through Next.js font variables. This is a current source/consumer mismatch that a later token migration must resolve.

### Motion

`fs.motion.tokens.json` contains:

- Seven duration tokens.
- Five easing tokens.
- Three spring description tokens.

All motion tokens have only a `default` mode. Tailwind maps the duration and easing CSS variables. Spring values are generated as strings but are not mapped by Tailwind, and the active Style Dictionary metadata table has no Springs category entry.

### Component consumption

There is no source-level Component token group. Components compose Tailwind utilities and CSS variables directly.

Semantic consumption exists in global styles and components, including surface, content, action, feedback, and border roles. However, components and stories also consume primitive colors directly through utilities such as `bg-fs-blue`, `bg-fs-violet`, and `text-fs-white`, or through variables such as `var(--fs-color-blue)`.

The effective current hierarchy is therefore:

```text
Primitive literals --manual duplication--> Semantic literals --> Component usage
        \-------------------------------------------------------> Component usage
```

This can be summarized as **Primitive → Semantic → Component**, but it is a conceptual convention rather than an enforced alias chain. The Component level is consumption, not a token layer.

## Current strengths

- Source token JSON is separate from generated CSS.
- One build command produces a deterministic CSS artifact.
- Semantic UI roles exist and cover core surface, content, action, feedback, and border needs.
- Default, dark, muted, and dark-high-contrast modes use one selector convention.
- Frontend and Storybook consume the same generated variables.
- Motion durations and easing values are centralized.
- Generated category comments support Storybook token documentation.

## Current limitations for multiple applications

1. **No Brand layer.** FunkSpace identity values are mixed into the primitive palette without explicit brand roles.
2. **No Application layer.** Portfolio, game, and experiment meanings cannot vary without adding global semantic roles or consuming raw colors.
3. **No Component token layer.** Component decisions are encoded in classes and props rather than named token contracts.
4. **No aliases.** Semantic changes require editing repeated literals, which can drift from the intended primitive or brand mapping.
5. **Theme-dependent primitives.** Raw-looking names do not guarantee stable values, making direct consumption misleading.
6. **All variables are globally exposed.** The generated artifact does not distinguish shared, portfolio, game, or component ownership.
7. **Flattened names can collide.** The formatter discards the source path and emits only the base name; future application/component groups could accidentally produce the same CSS variable.
8. **Mode selectors are global.** Every application would inherit the same `data-theme` contract even when it needs additional modes or a scoped theme.
9. **Consumer drift exists.** Typography sources and frontend fonts disagree, spacing tokens are not mapped, and primitive colors remain common in component/story usage.
10. **Duplicate configuration exists.** The inactive TypeScript Style Dictionary configuration can diverge from the active MJS configuration.

## Recommended hierarchy

Adopt this dependency direction before multiple applications begin consuming the token system:

```text
Primitive -> Brand -> Semantic -> Application -> Component
```

Every level may reference only levels to its left. Literal design values belong only in Primitive unless a format cannot express a reference. Circular or upward references are forbidden.

### 1. Primitive

Primitive tokens are stable raw scales without product meaning.

Examples:

- Palette steps and neutral ramps.
- Spacing and sizing scales.
- Font sizes, weights, and line heights.
- Durations, easing curves, radii, and opacity steps.

A primitive name must continue to mean the same value in every theme. A token called white must not become black. Theme switching happens in later layers.

### 2. Brand

Brand tokens express FunkSpace identity by selecting primitives.

Examples:

- Brand accent and supporting accent colors.
- Brand foreground/background palette choices.
- FunkSpace font families and typographic voice.
- Characteristic motion tempo or emphasis.

Brand modes may remap to different primitives for dark, muted, or high-contrast presentation while retaining the same brand meaning.

### 3. Semantic

Semantic tokens express shared intent independent of a particular application or component.

The existing Surface, Content, Action, Feedback, and Border roles belong here after they reference Brand or Primitive tokens rather than repeat literals. Semantic roles should be usable by standard UI in the portfolio, a game's menus, and future interactive controls.

Semantic names must describe purpose, not appearance. Prefer `content.primary` over `grey-dark-1` and `feedback.error` over `red`.

### 4. Application

Application tokens translate shared semantics into the vocabulary of one product surface.

Examples:

| Application | Example roles |
| --- | --- |
| Portfolio | hero background/accent, project-card surface, navigation indicator, case-study highlight |
| Game | world background, player, ally, enemy, hazard, collectible, HUD surface/content, score highlight |
| Interactive experiment | canvas background, data series, control surface, active selection, visualization emphasis |

Application tokens reference Semantic or Brand roles and may provide application-specific modes. They must be namespaced by application or game so a game theme cannot silently change the portfolio.

Simulation and business rules never branch on visual token values. Tokens belong to presentation and rendering.

### 5. Component

Component tokens describe the stable visual contract of a reusable component within an application context.

Examples include button background/content/border states, card surfaces, navigation-item states, game HUD panels, meters, dialogs, and game controls.

Component tokens reference Application or Semantic roles. Add them only when they remove repeated decisions or support real variants; do not create a component token for every CSS declaration.

## Why games must not consume UI colors directly

Portfolio UI colors describe interface intent: actions, links, surfaces, feedback, borders, and content. A game has additional visual semantics such as player, opponent, hazard, terrain, collectible, targeting, damage, and HUD state.

Directly consuming UI or primitive colors would create several problems:

- A portfolio theme change could alter game-world legibility or gameplay cues.
- `action.primary` does not explain whether a color represents a player, enemy, selection, or reward.
- UI contrast requirements and game-scene contrast requirements are related but not identical.
- Games need color-blind-safe redundancy, high-contrast variants, and non-color cues for gameplay state.
- A game may need a distinct art direction without forking the FunkSpace foundation.
- Direct primitive use hard-codes appearance and prevents palette remapping.

A game should define application roles such as `game.<slug>.player` or `game.<slug>.hazard`, mapped to Brand/Semantic/Primitive layers. Standard menus and dialogs may reuse shared Semantic roles through the game application layer. Renderers consume game application or component tokens, never portfolio component tokens.

## Why application-specific tokens are required

The Semantic layer must stay small and universal. Adding every portfolio hero, game entity, HUD state, and experimental visualization role to the global Semantic layer would turn it into a catalogue of unrelated product details.

The Application layer provides:

- **Isolation:** portfolio changes do not unintentionally restyle games.
- **Vocabulary:** token names match the meaning developers and agents reason about in each application.
- **Independent modes:** a game can add scene or accessibility palettes without expanding every consumer's theme contract.
- **Stable components:** components depend on application roles while underlying brand/semantic mappings evolve.
- **Controlled reuse:** shared intent stays Semantic; product-specific intent stays local.
- **Migration safety:** applications can adopt the new hierarchy incrementally behind namespaced outputs.

## Recommended output and naming rules

Before adding layers, update the token build design so source paths remain visible in output names or are otherwise collision-checked.

Recommended rules:

- Use one canonical Style Dictionary configuration.
- Preserve explicit layer and application namespaces in CSS variables and other generated artifacts.
- Generate a platform-neutral artifact for `common` as well as CSS when a second application is activated.
- Keep root token JSON authoritative until the planned `common` migration is implemented atomically.
- Keep generated files read-only and reproducible.
- Validate unresolved aliases, duplicate output names, and circular references in CI.
- Generate only the token subsets each application is allowed to consume, or expose documented entry points by layer.
- Define theme/mode ownership per layer instead of relying on one global selector for every future application.

## Migration recommendations

No migration is performed by this task. A future feature plan should sequence the work as follows:

1. Define naming conventions, token reference syntax, mode ownership, and output collision checks.
2. Convert current color “primitives” into stable raw palette steps.
3. Add Brand mappings for FunkSpace identity and theme variants.
4. Convert current Semantic colors from duplicated literals to aliases.
5. Resolve typography ownership and align token sources with the self-hosted frontend fonts.
6. Decide how spacing and spring tokens are exposed and consumed.
7. Add namespaced Portfolio application tokens and migrate direct primitive usages.
8. Add game Application tokens only when the first game's visual requirements are known.
9. Add Component tokens only for repeated, stable component decisions.
10. Activate the `common` package and move token ownership only when at least two workspaces consume the artifacts.
11. Remove the inactive Style Dictionary configuration after choosing the canonical implementation.

Each migration step must regenerate CSS, inspect the diff, validate all four current themes, run Storybook checks, and verify accessibility contrast and reduced-motion behavior where relevant.

## Rules for AI agents

- Inspect token sources, generated output, and consumer mappings before proposing a token.
- Do not treat current semantic values as aliases; they are independent literals today.
- Do not hand-edit `styles/tokens.css`.
- Do not introduce Brand, Application, or Component values as hard-coded component styles while waiting for the hierarchy migration.
- Do not let games consume portfolio tokens or make simulation decisions from colors.
- State whether a proposed token is Primitive, Brand, Semantic, Application, or Component and identify the layer it references.
- Prefer the lowest shared layer that accurately expresses meaning; do not promote application-specific vocabulary into Semantic.
- Validate every new mode for contrast, focus visibility, non-color communication, and reduced-motion behavior as applicable.
