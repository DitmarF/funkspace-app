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

The homepage introduction sequences the nominated logo, then a 400 ms menu
hex-button fade, then an 800 ms fade of the remaining content (existing tokens),
including explicit Reduced. Actual logo completion starts the menu; the menu's
animation-end event starts the content, without guessed delays. Off and unavailable motion keep
the page static. Eligible startup masks the identity logo before paint until
the controller has prepared its first drawing/fade frame; it never paints the
complete logo and then resets it to begin. This shell-only mask preserves logo
layout/visibility measurements and does not change other copies or the policy's
static initial snapshot. A newly opened background tab keeps the unstarted
introduction pending: the logo then content sequence begins when the tab is
first visible. The five-second fail-open deadline starts at that first visibility,
so background waiting does not consume it. Keyboard/pointer/scroll interaction,
fragments, history restoration, hiding after first visibility and runtime failure
reveal content immediately. A fallback while the logo has not started also
retires that mount's automatic introduction, including when hydration arrives
after the deadline or early interaction. Later readiness, visibility and
autoPlay prop changes cannot reset already-visible artwork. The additive
`cancelIntroduction()` ref method preserves Pause and preference; explicit
permitted playback remains available under the existing seek/play contract.
An already running introduction and normal logo/menu/content completion do not
trigger this cancellation. No-JS and
secondary pages retain native static content. Changing settings does not replay
the consumed page introduction. This is Dimi's requested FS-3.5 amendment, not
permission to gate page access on decorative playback.

- Follow system honors `prefers-reduced-motion: reduce`. The shared decorative policy also offers explicit On, which overrides the device preference by Dimi's decision on 2026-09-27. His subsequent Reduced-logo amendment permits a uniform fade of the complete logo over the normal introduction's duration. Explicit Reduced requires an implemented consumer alternative (`supportsReducedMotion`); consumers without it and Off remain static. Follow system with device reduction remains static. Neither alternative bypasses feature availability, pending initialization, visibility, runtime failure or local Pause. Unknown/unavailable system capability remains static for Reduced. This bounded change does not change unrelated CSS/legacy motion guards or game time.
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

- `NEXT_PUBLIC_ANIMATIONS_ENABLED` is the production availability gate (OFF unless explicitly true). The FS-3.4 shared policy and FS-3.5 logo/settings integration preserve it even for On or `enabled=true`. Controlled story/test composition may provide availability; it never clears preference restrictions or Pause. Public flag variants must be set during the build.

### Testing

- A11y acceptance requires zero violations in unfiltered Playwright + axe reports on required key routes. The current home/logo tests contain different 2.4 contrast filters, so their filtered passes do not establish that requirement. [Exact scope and limitations](tasks/fs-0.2-tooling-baseline.md#exact-contrast-suppression-and-coverage-limits) remain recorded until source repair and filter removal together in FS-1.2.
- Perf: preserve the existing Lighthouse budgets and record build, flags, environment and sample method. Local Lighthouse samples and its p75 assertion configuration do not establish field p75 or an animation-cost comparison when the measured route has no animated consumer.

### References

- MDN prefers-reduced-motion: https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion
- MDN transform/opacity performance: https://developer.mozilla.org/docs/Web/CSS/CSS_Animations/Animating_a_property
