## Home Animations — One‑Pager Spec

> **Scope reconciliation — FS-0.4, 2026-09-12.** The [Minimum Usable Experience plan](funkspace-minimum-usable.md) is the single intended portfolio scope/status home; its source-publication limits remain explicit. This one-pager retains applicable motion guardrails, not a second delivery plan. The earlier entrance-animation/feature-card proposal and its section-animation acceptance are superseded for this milestone.

### Goals

- Deliver tasteful motion on the home page to improve perceived quality and comprehension.
- Maintain first‑class accessibility and performance by default; motion is progressive and optional.

### Scope

- Enhance a static, ordinarily scrolling Start/About/Contact site with the existing logo and one bounded Canvas scene behind a trusted replaceable SVG aperture.
- Keep content-driven section heights and a deliberate static scene alternative. No slide navigation, snapping, carousel, counter, dots, previous/next controls or visual editor.
- Reuse one decorative-motion preference for logo and scene when implemented in FS-3.4/3.5/4.5. This is planned work; the current OS-preference hook is not that service, and decorative settings never control gameplay time.

### Non‑Goals

- No heavy WebGL or large animation libraries.
- No navigation transitions or global route animations in this iteration.

### Guardrails (A11y & Performance)

- Keyboard and screen reader parity; animation must not block focus or reading order.
- Respect `prefers-reduced-motion: reduce` with an equivalent static experience.
- Avoid motion that can trigger vestibular disorders (no rapid parallax, no unexpected zooms).
- Zero layout shift caused by animations; pre‑allocate space and animate transform/opacity.
- For DOM motion, use CSS transforms/opacity and avoid layout-thrashing JS. The planned Canvas scene has separately measured draw/count/DPR and lifecycle limits in FS-4.1/4.7; this does not authorize layout animation.
- Code‑split any client‑only animation logic; prefer server components for static content.

### Rollout & Flag

- Feature flag: `NEXT_PUBLIC_ANIMATIONS_ENABLED` (string "true"/"false").
- Default off for initial rollout; enable in staging first.
- Graceful degradation: when disabled, the page renders identically without motion.

### Acceptance Criteria

- When the flag and approved motion policy permit playback, the assigned logo/scene consumers may animate within their own boundaries; section entrance animation is not a milestone requirement.
- Flag-disabled, unresolved-preference, Reduced and Off paths retain complete static content/logo/scene. Existing LogoMotion accepts an explicit enabled override; its default flag behavior does not prove every consumer is globally disabled today.
- Respect `prefers-reduced-motion: reduce`; environmental resume must not override the future scene's explicit Pause.
- No DOM reflow loops or console errors in production mode.
- No new accessibility issues per automated checks and manual keyboard traversal.

### KPIs & Targets

The values below are retained historical targets, not measured outcomes or new field-data collection requirements. FS-4.1 defines the scene's measurable budget; preserve the existing Lighthouse limits. FS-0.2/0.3 record local measurements and their limits, including that the current measured `/` has no animated-logo consumer.

- LCP delta vs baseline: ≤ +50ms (no statistically significant regression).
- INP (p75) delta vs baseline: ≤ +10ms.
- CLS: ≤ 0.1 at p75.
- Axe violations introduced: 0 (zero).

### Measurement Plan

- Establish performance baseline on current home page (LCP/INP/CLS) in CI and staging.
- Run Lighthouse with the flag set during each build, as recorded in the [tooling baseline](../tasks/fs-0.2-tooling-baseline.md). The earlier Web Vitals collection proposal does not authorize analytics, and local Lighthouse is not field p75 evidence.
- Acceptance requires zero violations in unfiltered Playwright/axe checks on the home route. Existing home/logo contrast filters remain an explicit limitation until atomic source-color/filter repair in FS-1.2; a filtered pass does not establish this requirement.

### Risks & Mitigations

- Risk: Animation code inflates bundle. Mitigation: dynamic import, tree‑shaking friendly utilities.
- Risk: Motion discomfort. Mitigation: respect `prefers-reduced-motion`, provide static fallbacks.
- Risk: Layout shift from late assets. Mitigation: reserve space; animate only transforms/opacity.

### Implementation Notes

- Co‑locate motion variants near components; extract shared tokens for durations/easings.
- Use Tailwind tokens and CSS variables; avoid inline styles except for dynamic transform values.
