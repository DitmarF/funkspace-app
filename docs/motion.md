## Motion Rules — Accessibility and Performance

### Reduced‑Motion Policy

- Honor `prefers-reduced-motion: reduce` across all animations.
- Provide static or simplified alternatives (opacity‑only or no motion).
- Never block focus, reading order, or keyboard navigation with motion.

### Performance Guardrails

- Animate only transform and opacity.
- Reserve layout space; do not animate layout‑affecting properties (width, height, margin, etc.).
- Use GPU‑friendly CSS (transform/opacity) and avoid layout thrash.
- Keep bundle impact minimal; code‑split client‑only motion.

### Tokens & Tailwind

- Durations/easings from CSS vars: `--fs-motion-duration-*`, `--fs-motion-easing-*`.
- Tailwind bindings: `duration-{quick|normal|slow}`, `ease-{linear|ease-out|ease-in-out}`.
- Reduced‑motion utilities: `motion-reduce:*` (e.g., `motion-reduce:transition-none`).

### Feature Flag

- `NEXT_PUBLIC_ANIMATIONS_ENABLED` gates motion (default OFF). When disabled, render static states.

### Testing

- A11y: Playwright + axe must report zero violations on key routes.
- Perf: Lighthouse budgets – CLS ≤ 0.1 p75; minimal LCP/INP deltas vs baseline.

### References

- MDN prefers-reduced-motion: https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion
- MDN transform/opacity performance: https://developer.mozilla.org/docs/Web/CSS/CSS_Animations/Animating_a_property
