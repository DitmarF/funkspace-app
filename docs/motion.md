## Motion Rules — Accessibility and Performance

### Current portfolio scope

See the [Minimum Usable Experience plan](features/funkspace-minimum-usable.md) for scope/status and its publication limits. The portfolio uses ordinary scrolling and content-driven sections, one bounded Canvas scene and a deliberate static alternative. Historical slide/snapping or multi-scene controls are superseded for this milestone; the game arena remains separate.

One decorative-motion preference is planned in FS-3.4 for logo and scene. It is not an implemented service: existing `useReducedMotion` and `AnimationService` do not supply persisted preference/local Pause/environmental suspension policy. Its approved contract must keep those reasons distinct and never control gameplay time. Reuse the existing ThemeService, AnimationOrchestrator, CSS motion helpers and pure motion APIs rather than introducing parallel systems.

### Architecture boundary

- `common/motion/` owns pure easing, numeric interpolation, tween data, timeline
  resolution, sampling, seeking, and delta-based advancement.
- The common layer accepts identifiers and numbers only. It does not import
  React or access DOM, SVG, Canvas, WebGL, browser clocks, or render loops.
- Frontend infrastructure owns `requestAnimationFrame`, element lookup, style
  updates, cleanup, and application of sampled values to rendering targets.
- The SVG and HTML timeline classes are platform adapters over
  `@funkspace/common/motion`; they must not reimplement timeline timing or
  easing logic.
- Animation adapters implement `AnimationRuntime`: `update(delta)` advances an
  active runtime, `pause()` preserves state, `resume()` continues, `reset()`
  restores the initial state, and `destroy()` releases adapter-owned resources.
- Existing adapter-specific controls such as `play`, `playFrom`, `seek`,
  `reverse`, and `setSpeed` remain valid compatibility APIs.

### Reduced‑Motion Policy

- Honor `prefers-reduced-motion: reduce` across all animations.
- Provide static or simplified alternatives (opacity‑only or no motion).
- Never block focus, reading order, or keyboard navigation with motion.

### Performance Guardrails

- For DOM/CSS motion, animate transform and opacity. The planned Canvas scene uses bounded drawing and separately agreed count/DPR/frame-work budgets in FS-4.1/4.7; this is not permission to animate DOM layout.
- Reserve layout space; do not animate layout‑affecting properties (width, height, margin, etc.).
- Use GPU‑friendly CSS (transform/opacity) and avoid layout thrash.
- Keep bundle impact minimal; code‑split client‑only motion.

### Tokens & Tailwind

- Durations/easings from CSS vars: `--fs-motion-duration-*`, `--fs-motion-easing-*`.
- Tailwind bindings: `duration-{quick|normal|slow}`, `ease-{linear|ease-out|ease-in-out}`.
- Reduced‑motion utilities: `motion-reduce:*` (e.g., `motion-reduce:transition-none`).

### Feature Flag

- `NEXT_PUBLIC_ANIMATIONS_ENABLED` supplies the existing logo's default gate (OFF); explicit consumer overrides exist. It is not a current global policy service. Preserve complete static states and define its interaction with the planned decorative preference in FS-3.4. Public flag variants must be set during the build.

### Testing

- A11y acceptance requires zero violations in unfiltered Playwright + axe reports on required key routes. The current home/logo tests contain different 2.4 contrast filters, so their filtered passes do not establish that requirement. [Exact scope and limitations](tasks/fs-0.2-tooling-baseline.md#exact-contrast-suppression-and-coverage-limits) remain recorded until source repair and filter removal together in FS-1.2.
- Perf: preserve the existing Lighthouse budgets and record build, flags, environment and sample method. Local Lighthouse samples and its p75 assertion configuration do not establish field p75 or an animation-cost comparison when the measured route has no animated consumer.

### References

- MDN prefers-reduced-motion: https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion
- MDN transform/opacity performance: https://developer.mozilla.org/docs/Web/CSS/CSS_Animations/Animating_a_property
