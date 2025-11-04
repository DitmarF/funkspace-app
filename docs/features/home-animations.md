## Home Animations — One‑Pager Spec

### Goals

- Deliver tasteful motion on the home page to improve perceived quality and comprehension.
- Maintain first‑class accessibility and performance by default; motion is progressive and optional.

### Scope

- Add entrance and subtle interactive animations for hero, feature cards, and CTA areas.
- Respect user preferences: `prefers-reduced-motion` must disable or simplify motion.

### Non‑Goals

- No heavy WebGL or large animation libraries.
- No navigation transitions or global route animations in this iteration.

### Guardrails (A11y & Performance)

- Keyboard and screen reader parity; animation must not block focus or reading order.
- Respect `prefers-reduced-motion: reduce` with an equivalent static experience.
- Avoid motion that can trigger vestibular disorders (no rapid parallax, no unexpected zooms).
- Zero layout shift caused by animations; pre‑allocate space and animate transform/opacity.
- Use CSS transforms/opacity and GPU‑friendly properties; avoid layout‑thrashing JS.
- Code‑split any client‑only animation logic; prefer server components for static content.

### Rollout & Flag

- Feature flag: `NEXT_PUBLIC_ANIMATIONS_ENABLED` (string "true"/"false").
- Default off for initial rollout; enable in staging first.
- Graceful degradation: when disabled, the page renders identically without motion.

### Acceptance Criteria

- When `NEXT_PUBLIC_ANIMATIONS_ENABLED="true"`, home page sections animate in using transform/opacity only.
- When the flag is missing or set to "false", no animation code runs; static render is unchanged.
- With `prefers-reduced-motion: reduce`, animations are disabled or replaced with non‑motion affordances.
- No DOM reflow loops or console errors in production mode.
- No new accessibility issues per automated checks and manual keyboard traversal.

### KPIs & Targets

- LCP delta vs baseline: ≤ +50ms (no statistically significant regression).
- INP (p75) delta vs baseline: ≤ +10ms.
- CLS: ≤ 0.1 at p75.
- Axe violations introduced: 0 (zero).

### Measurement Plan

- Establish performance baseline on current home page (LCP/INP/CLS) in CI and staging.
- Run Lighthouse CI and Web Vitals collection on both flag off/on variants.
- Playwright a11y step to assert zero axe violations on the home route.

### Risks & Mitigations

- Risk: Animation code inflates bundle. Mitigation: dynamic import, tree‑shaking friendly utilities.
- Risk: Motion discomfort. Mitigation: respect `prefers-reduced-motion`, provide static fallbacks.
- Risk: Layout shift from late assets. Mitigation: reserve space; animate only transforms/opacity.

### Implementation Notes

- Co‑locate motion variants near components; extract shared tokens for durations/easings.
- Use Tailwind tokens and CSS variables; avoid inline styles except for dynamic transform values.
