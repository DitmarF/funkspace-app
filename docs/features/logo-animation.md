# Logo Timeline Animation — Feature Spec (Phase 2)

> Epic: Signature Logo Animation & Modular Timeline Engine (SVG-first)

## 1) Summary

Create a timeline-based animation for the **FunkSpace** SVG logo in which the **strokes draw first (path-by-path, staggered)** and the **fills fade in** on the same master timeline. Ship a small, modular **timeline engine** (GSAP‑style) with **play / pause / reverse / seek / speed** controls, a declarative **manifest**, and an **SVG DOM renderer**. Develop and demo the feature in **Storybook**, with **reduced‑motion** fallback and a **feature flag** for rollout.

## 2) Goals & Non‑Goals

- **Goals**
  - Path‑by‑path stroke “draw” → per‑path fill‑in via `fillOpacity` on one timeline.
  - Engine controls: play, pause, reverse, seek (scrub), setSpeed.
  - Config via a declarative **Animation Manifest** (TS/JSON) for order, delays, easings.
  - SVG DOM renderer; future renderers (Canvas/WebGL) remain possible via abstraction.
  - Storybook controls for live scrub/speed; unit + E2E + a11y checks.
  - Respect `prefers-reduced-motion`; ship behind `NEXT_PUBLIC_ANIMATIONS_ENABLED`.

- **Non‑Goals**
  - Heavy 3P libs (GSAP/Framer) or Canvas/WebGL visuals in v1.
  - Page‑wide transitions or unrelated animations.

## 3) Assets & File Map (proposed)

- **SVG**: `frontend/public/svg/fs/FunSpace_logo.svg` (will be inlined for IDs)
- **Components**:
  - `frontend/components/FunkSpaceLogoInline.tsx` — inline SVG with stable IDs
  - `frontend/components/LogoMotion.tsx` — timeline + controls wrapper

- **Engine**:
  - `frontend/utils/motion/timeline.ts` — `AnimationTimeline`, tweens, easing
  - `frontend/utils/motion/types.ts` — types for manifest/steps
  - `frontend/utils/motion/svg.ts` — helpers: path length, stroke-draw init

- **Data**: `frontend/data/logoManifest.ts` — ordered steps for paths/fills
- **Stories**: `frontend/components/LogoMotion.stories.tsx`
- **Tests**:
  - Unit: `frontend/utils/motion/timeline.test.ts`
  - Component: `frontend/components/LogoMotion.test.tsx`
  - E2E: `frontend/e2e/logo-animation.spec.ts`

## 4) Design Tokens (motion)

Expose in tokens → Style Dictionary → CSS vars → Tailwind:

```css
:root {
  --fs-motion-duration-100: 120ms;
  --fs-motion-duration-200: 200ms;
  --fs-motion-duration-400: 400ms;
  --fs-motion-duration-800: 800ms; /* path draw chunk */
  --fs-motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --fs-motion-ease-emph: cubic-bezier(0.05, 0.7, 0.1, 1);
}
```

Tailwind mapping (example):

```ts
// tailwind.config.js theme.extend
transitionTimingFunction: {
  standard: 'var(--fs-motion-ease-standard)',
  emph: 'var(--fs-motion-ease-emph)'
},
transitionDuration: {
  100: 'var(--fs-motion-duration-100)',
  200: 'var(--fs-motion-duration-200)',
  400: 'var(--fs-motion-duration-400)',
  800: 'var(--fs-motion-duration-800)'
}
```

## 5) Architecture

- **Engine core**: `AnimationTimeline`
  - Controls: `play()`, `pause()`, `reverse()`, `seek(ms)`, `setSpeed(f)`.
  - Internal rAF loop with delta time; idempotent start/stop; speed multiplier.
  - No layout thrash: animate **`strokeDashoffset`** and **`fillOpacity`** (and later transform/opacity only).

- **Tween**: numeric interpolation + easing over `duration`, with optional `delay` and `offset`.
- **Manifest**: declarative step list; resolves `target` selectors within an SVG root.
- **Renderer abstraction**: default **SVG DOM**; future adapters can implement the same tween interface for Canvas/WebGL.
- **A11y/Perf**: reduced-motion short‑circuit; fixed `viewBox`/`width`/`height` to avoid CLS.

## 6) Animation Manifest (TypeScript)

```ts
export type EasingName =
  | "standard"
  | "emph"
  | "linear"
  | `cubic-bezier(${string})`;

export interface AnimationStep {
  target: string; // '#logo-path-1'
  property: "strokeDashoffset" | "opacity";
  from: number;
  to: number;
  duration: number; // ms
  delay?: number; // ms
  easing?: EasingName;
}
export interface AnimationManifest {
  steps: AnimationStep[];
}
```

**Example (first 2 paths):**

```ts
const total1 = /* getTotalLength(#logo-path-1) */ 420;
const total2 = /* getTotalLength(#logo-path-2) */ 380;
export const logoManifest: AnimationManifest = {
  steps: [
    {
      target: "#logo-path-1",
      property: "strokeDashoffset",
      from: total1,
      to: 0,
      duration: 800,
      easing: "emph",
    },
    {
      target: "#logo-path-1",
      property: "fillOpacity",
      from: 0,
      to: 1,
      duration: 200,
      delay: 100,
    },
    {
      target: "#logo-path-2",
      property: "strokeDashoffset",
      from: total2,
      to: 0,
      duration: 800,
      easing: "emph",
      delay: 120,
    },
    {
      target: "#logo-path-2",
      property: "fillOpacity",
      from: 0,
      to: 1,
      duration: 200,
      delay: 220,
    },
  ],
};
```

## 7) Engine API Sketch

```ts
class AnimationTimeline {
  constructor(root: SVGSVGElement, manifest: AnimationManifest) {}
  play(): void {}
  pause(): void {}
  reverse(): void {}
  seek(ms: number): void {}
  setSpeed(multiplier: number): void {}
  get time(): number {
    return 0;
  } // current time (ms)
  get duration(): number {
    return 0;
  } // computed from steps
}
```

## 8) Component: `LogoMotion`

```tsx
"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { AnimationTimeline } from "@/utils/motion/timeline";
import { logoManifest } from "@/data/logoManifest";
import { FunkSpaceLogoInline } from "./FunkSpaceLogoInline";

export interface LogoMotionRef {
  play(): void;
  pause(): void;
  reverse(): void;
  seek(ms: number): void;
  setSpeed(f: number): void;
}
export interface LogoMotionProps {
  autoPlay?: boolean;
  speed?: number;
}

export const LogoMotion = forwardRef<LogoMotionRef, LogoMotionProps>(
  function LogoMotion({ autoPlay = true, speed = 1 }, ref) {
    const svgRef = useRef<SVGSVGElement>(null);
    const timelineRef = useRef<AnimationTimeline | null>(null);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enabled = process.env.NEXT_PUBLIC_ANIMATIONS_ENABLED === "true";

    useEffect(() => {
      if (!svgRef.current) return;
      if (!enabled || reduced) return; // show static final state
      const tl = new AnimationTimeline(svgRef.current, logoManifest);
      timelineRef.current = tl;
      tl.setSpeed(speed);
      if (autoPlay) tl.play();
      return () => tl.pause();
    }, [enabled, reduced, autoPlay, speed]);

    useImperativeHandle(ref, () => ({
      play: () => timelineRef.current?.play(),
      pause: () => timelineRef.current?.pause(),
      reverse: () => timelineRef.current?.reverse(),
      seek: (ms) => timelineRef.current?.seek(ms),
      setSpeed: (f) => timelineRef.current?.setSpeed(f),
    }));

    return <FunkSpaceLogoInline ref={svgRef} />;
  },
);
```

> Implementation note: The runtime component paints the logo's final static state before enabling the timeline. This guarantees the SVG is visible in Storybook Docs and any non-animated scenarios (feature flag off, reduced motion, or errors). The manifest clamps `pathCount` to the 10 available IDs and animates `fillOpacity` so stroke outlines stay visible while fills fade in.

## 9) Storybook: Controls & Demos

- Story: **Default** — plays automatically when enabled.
- Story: **Controls** — buttons (Play/Pause/Reverse), slider (Scrub), select (Speed 0.5×/1×/2×).
- Story: **Reduced Motion** — docs note + toggle to simulate `prefers-reduced-motion`.
- Story: **Flag Off** — demonstrates the static fallback.
- Docs args opt-in to the animation feature flag and apply a responsive width class so the SVG is always visible in Docs & Canvas.

## 10) Accessibility & Performance

- **Reduced motion**: do not animate when user prefers reduced motion; render fully drawn logo immediately.
- **CLS guard**: set fixed `viewBox` and dimensions; avoid layout‑affecting properties.
- **A11y**: SVG `role="img"` with descriptive `aria-label`; ensure keyboard focus isn’t hijacked by controls.
- **Perf**: code‑split engine; tween only `fillOpacity` and path `strokeDashoffset`; avoid expensive layout reads in the loop.

## 11) Testing Strategy

- **Unit (Vitest)**: timeline math (play/pause/reverse/seek/speed), easing, overlapping delays, zero duration.
- **Component**: `LogoMotion` renders static when flag off or reduced‑motion on; animates when enabled.
- **E2E (Playwright)**: load story, wait for end; assert `strokeDashoffset≈0` and `fillOpacity≈1`; run axe and fail on serious violations.

## 12) Rollout & Flags

- **Flag**: `NEXT_PUBLIC_ANIMATIONS_ENABLED` defaults **false**; set true for preview/staging.
- **Metrics**: watch LCP/INP/CLS on pages that include the logo; keep CLS ≤ 0.1.
- **Removal**: once stable and fast, consider enabling by default; keep reduced‑motion gate.

## 13) Acceptance Criteria

- Path strokes draw sequentially with visible, cohesive timing; fills fade in after each stroke.
- Controls: play/pause/reverse/seek/speed function in Storybook.
- `prefers-reduced-motion` renders static final logo; feature flag off renders static.
- Zero serious axe issues; no new CLS.
- Unit + component + E2E tests pass in CI.

## 14) Small Tasks (1 feature + 1 verification)

- T‑01 Inline SVG + IDs → Story shows static logo; path count is correct.
- T‑02 Motion tokens → tokens build; demo div uses `duration-800` + `ease-standard`.
- T‑03 Timeline API skeleton → Vitest: state toggles work.
- T‑04 rAF loop → Vitest: mock time advances; seek reflects elapsed.
- T‑05 Numeric tween → Vitest: 50% at mid‑time.
- T‑06 Stroke draw helper → Story: path draws from 100% → 0.
- T‑07 Fill opacity → Story: fill appears after stroke.
- T‑08 Manifest loader → Changing `delay` alters order; no code change.
- T‑09 Compose first 2–3 paths → Visible stagger; budget met.
- T‑10 Reduced motion → Force reduced: static.
- T‑11 Feature flag → Toggle flag in Storybook: static vs animated.
- T‑12 `LogoMotion` component → Mount plays; unmount cleans rAF.
- T‑13 Storybook controls → Play/Reverse/Scrub/Speed respond live.
- T‑14 Unit tests suite → timeline math covered; passing.
- T‑15 E2E + axe → No serious violations; final state asserted.
- T‑16 Full manifest → All paths sequenced; duration matches tokens.

## 15) Cursor Kickoff Snippet (paste in Agent Chat)

**Plan Mode:**

> Scan `docs/features/logo-animation.md`. Propose a step‑by‑step plan. Then:
>
> 1. Create branch `feat/logo-animation`.
> 2. Scaffold: `components/FunkSpaceLogoInline.tsx`, `components/LogoMotion.tsx`, `utils/motion/{timeline.ts,types.ts,svg.ts}`, `data/logoManifest.ts`.
> 3. Add motion tokens (durations/easings) + Tailwind entries; respect reduced‑motion.
> 4. Write Vitest for timeline utils + Playwright smoke + axe.
> 5. Ask before running commands; summarize diffs before applying.

**Allowed commands**: `pnpm`, `eslint`, `vitest`, `playwright`. Network off by default.

---

**Notes**

- Keep all timing/easing via tokens (CSS vars) for consistency.
- Avoid animating layout; prefer opacity and stroke dashoffset.
- Avoid animating layout; prefer fillOpacity and stroke dashoffset.
- Defer Canvas/WebGL; renderer interface keeps door open for v2.
