# Full-screen Animated Layout (Storybook Epic)

**reasoning_effort:** medium

## 1) Checklist (conceptual steps)

- Establish a native scroll + CSS Scroll Snap container and a reusable `SnapSection` primitive.
- Implement a minimal `useScrollProgress` hook (Intersection Observer + progress math).
- Extend the internal timeline API with `onEnter`/`onLeave` and `seek(progress)`.
- Scaffold two full-screen sections: **Hero** and **About**, with reduced-motion support.
- Wire per-section stories and a composite “stacked layout” story in Storybook.
- Validate a11y (focus, keyboard), mobile viewport units, performance budgets.

---

## 2) Scope & Assumptions

- **In scope:** Storybook-first development of a vertically stacked, full-viewport layout using Tailwind; internal animation engine only (no external GSAP/Framer). Sections snap by default; individual sections can opt out or relax snapping when they contain long, scrollable content.
- **Sections for this epic:** `Hero`, `About`.
- **Snap behavior:** Default `mandatory` at the scroller; per-section override to `proximity` or `none` where needed.
- **Motion policy:** Respect `prefers-reduced-motion`; animate only transform/opacity; no scroll hijacking.
- **Tokens:** Colors/typography already in tokens; extend with motion durations/easings.

---

## 3) Architecture Overview

### 3.1 Layout primitives

- **`FullscreenScroll`**: scroll container with Tailwind classes to enable snap and real viewport height.
  - Classes: `h-screen md:h-[100dvh] overflow-y-auto snap-y snap-mandatory scroll-smooth`.
  - Accepts `snapMode?: 'mandatory' | 'proximity' | 'none'` and maps to container classes.

- **`SnapSection`**: semantic wrapper for each full-screen panel.
  - Renders `<section role="region" tabIndex={-1}>` with `h-[100dvh] w-screen snap-start`.
  - Props: `id`, `ariaLabel`, `snap?: 'start' | 'center' | 'end' | 'none'`, `relaxSnap?: boolean`, `innerScrollable?: boolean`.
  - If `innerScrollable` is true, render an inner `div` with `overflow-y-auto` while allowing the outer container to relax to `proximity` to avoid trapping users.

### 3.2 Scroll trigger hook

- **`useScrollProgress(ref, options)`** returns `{ inView, progress }` for a section.
  - Uses Intersection Observer to derive `inView` with sensible thresholds (e.g. 0.2–0.8).
  - Computes `progress` with `getBoundingClientRect()` against viewport height: 0 at section top off-screen, 1 at bottom top boundary. Clamped to [0,1].
  - Accepts `root?: HTMLElement`, `thresholds?: number[]`, `onEnter?`, `onLeave?`.

### 3.3 Timeline integration

- Extend internal animation timeline with control methods:
  - `playFrom(start)`; `pause()`; `seek(progress: number)`; `reverse()`.
  - Hook wiring:
    - `inView` toggles `playFrom(0)` on enter and `pause()` or `reverse()` on leave.
    - `progress` (if `scrub=true`) calls `seek(progress)`.

  - All animations constrained to `transform` and `opacity` to avoid layout thrash.

### 3.4 Reduced motion & theming

- **Reduced motion:** If the user prefers reduced motion, timelines do not run; components render their end state. Provide CSS guardrails: `.motion-safe:*` utilities or `@media (prefers-reduced-motion: reduce)` overrides.
- **Theming:** Use CSS variables generated from design tokens (`styles/tokens.css`). Add motion tokens (durations/easings) and consume them in timelines.

### 3.5 Mobile viewport units

- Prefer `h-[100dvh]` over `h-screen` where possible to cope with dynamic browser UI on mobile. Provide a small fallback class for legacy browsers.

---

## 4) Storybook Plan

- **Per-section stories:** `Hero.stories.tsx`, `About.stories.tsx` with `parameters: { layout: 'fullscreen' }` so each panel fills the canvas.
- **Composite story:** `Layouts/FullscreenScroll.stories.tsx` rendering `<FullscreenScroll><Hero/><About/></FullscreenScroll>` for end‑to‑end validation.
- **Theme support:** Ensure `tokens.css` is loaded in `.storybook/preview`. Provide a theme switcher control (existing addon) to validate all four themes.
- **Controls:** Expose story controls for `snapMode` (mandatory/proximity/none), and for `innerScrollable` on About.

---

## 5) Micro‑tasks for Cursor (1 feature + 1 verification each)

### T1 — Snap container scaffold

**Feature:** Create `components/layout/FullscreenScroll.tsx` with container classes: `h-screen md:h-[100dvh] overflow-y-auto snap-y snap-mandatory`. Accept `snapMode` prop.
**Verify:** Temporary story renders two colored blocks; scrolling snaps reliably in Storybook fullscreen canvas.

### T2 — `SnapSection` primitive

**Feature:** Create `components/sections/SnapSection.tsx` rendering semantic `<section>` with `h-[100dvh] w-screen snap-start` and accessibility props.
**Verify:** Keyboard navigation reaches each section; page down/up places the next section at the viewport boundary.

### T3 — Reduced-motion baseline

**Feature:** Add CSS guardrails and a small `useReducedMotion()` util. Ensure components conditionally skip timelines.
**Verify:** With OS reduced motion enabled, content appears static; no missing content; no layout shifts.

### T4 — `useScrollProgress` hook

**Feature:** Implement hook with IO + progress math; return `{ inView, progress }`.
**Verify:** Demo story shows a top progress bar growing 0→1 during section scroll.

### T5 — Timeline enter/leave controls

**Feature:** Extend `lib/motion/timeline.ts` with `onEnter`/`onLeave` patterns and simple sequences for transform/opacity.
**Verify:** Demo heading fades/translates in on enter; resets on leave.

### T6 — Timeline scrubbing

**Feature:** Add `seek(progress)` to the timeline and a `scrub` option in section demos.
**Verify:** Slowly scrolling interpolates states smoothly; throttling keeps >50–60 fps on mid devices.

### T7 — Hero section

**Feature:** Scaffold `components/sections/Hero.tsx` with tokenized colors/typography and animated elements using the hook + timeline.
**Verify:** Hero alone (story) fills canvas; animation runs only when in view; focus lands on the first interactive element.

### T8 — About section with optional inner scroll

**Feature:** Scaffold `components/sections/About.tsx` with a controlled inner `overflow-y-auto` region on a prop. Relax outer snap to `proximity` when inner scrolling is enabled.
**Verify:** Long content scrolls inside About without fighting outer snap.

### T9 — Composite layout story

**Feature:** Add `stories/Layouts/FullscreenScroll.stories.tsx` composing Hero + About; add a toolbar control for `snapMode`.
**Verify:** Canvas truly fullscreen; snap works; quickly flicking the wheel still lands on boundaries.

### T10 — Mobile viewport sanity

**Feature:** Switch critical wrappers to `h-[100dvh]` and document rationale in code comments.
**Verify:** On mobile, sections fill actual viewport regardless of browser chrome; no unwanted gaps.

### T11 — Sticky pin demo (no hijacking)

**Feature:** Add a small sticky sub-element demo inside Hero using `sticky top-0` to validate pin-like behavior.
**Verify:** Element remains pinned until container end; keyboard focus unaffected.

### T12 — A11y & focus padding

**Feature:** If a sticky header appears later, add `scroll-padding-top` on the scroller and a `focusIntoSection(id)` helper for anchor jumps.
**Verify:** Programmatic navigation never lands behind sticky UI; snap still functions.

---

## 6) File Scaffold

```
frontend/
  components/layout/FullscreenScroll.tsx
  components/sections/SnapSection.tsx
  components/sections/Hero.tsx
  components/sections/About.tsx
  hooks/useScrollProgress.ts
  lib/motion/timeline.ts
  stories/Hero.stories.tsx
  stories/About.stories.tsx
  stories/Layouts/FullscreenScroll.stories.tsx
```

---

## 7) Motion Tokens (additions)

```jsonc
// tokens/motion.tokens.json (source-of-truth)
{
  "motion": {
    "duration": {
      "quick": { "value": "120ms" },
      "normal": { "value": "240ms" },
      "slow": { "value": "400ms" },
    },
    "easing": {
      "linear": { "value": "linear" },
      "out": { "value": "cubic-bezier(0.2, 0.8, 0.2, 1)" },
      "inOut": { "value": "cubic-bezier(0.4, 0.0, 0.2, 1)" },
    },
  },
}
```

- After Style Dictionary build, consume as CSS variables (e.g. `var(--fs-motion-duration-normal)`).

---

## 8) Acceptance Criteria / Definition of Done

- Sections snap by default; individual sections can relax snap without breaking keyboard navigation.
- `useScrollProgress` reliably reports `inView` and a monotonic `progress` [0..1].
- Timeline reacts to enter/leave and can be scrubbed by `progress`.
- Reduced motion honored: all stories render a static, readable state when enabled.
- Storybook stories exist for Hero, About, and a composite layout; theme switching works.
- Performance: animations use transform/opacity only; no measurable CLS introduced; smooth scrolling on mid devices.

---

## 9) QA & Test Plan

- **Unit:** math utilities inside `useScrollProgress`; timeline `seek()` behavior; reduced‑motion toggles.
- **Manual in Storybook:** keyboard navigation, focus order, snap behavior under fast/slow scroll, theme variants, inner scroll in About.
- **Perf sanity:** DevTools performance profile during scrub; ensure minimal main‑thread work and stable FPS.

---

## 10) Risks & Mitigations

- **Snap + long content can trap users** → use `proximity` or disable snap per-section; offer inner scroll only when necessary.
- **Mobile viewport instability** → prefer `100dvh` for section height; fallback to `h-screen` where necessary.
- **Too much motion** → strict reduced-motion guard; keep durations short and consistent with tokens.

---

## 11) Next Steps (Cursor /commands)

- `.cursor/commands/layout-setup.md` → scaffold files, add tokens, create stories, run lint/types.
- `.cursor/commands/qa-smoke.md` → lint, unit tests, Storybook build, basic axe checks.
- After merge: integrate the same primitives into the Next.js app route as the real page layout.
