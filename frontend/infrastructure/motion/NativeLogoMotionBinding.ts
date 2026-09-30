import type { AnimationManifest } from "@/domain/animations/AnimationManifest";
import type {
  LogoMotionBinding,
  LogoMotionEvents,
  LogoMotionVariant,
} from "@/domain/ports/LogoMotionPort";
import { createTimeline } from "@funkspace/common/motion";
import { AnimationTimeline } from "./timeline";
import { applyStrokeDrawInit } from "./svg";

/** Owns only this SVG's styles, viewport observer and existing local timeline. */
export function bindNativeLogoMotion(
  root: SVGSVGElement,
  buildManifest: (root: SVGSVGElement) => AnimationManifest,
  events: LogoMotionEvents,
): LogoMotionBinding {
  let active = true;
  let timeline: AnimationTimeline | undefined;
  let observer: IntersectionObserver | undefined;
  let framePrepared = false;
  let variant: LogoMotionVariant = "draw";
  const parts = () => root.querySelectorAll<SVGElement>("[data-logo-part]");
  const showStatic = () => {
    framePrepared = false;
    root.style.opacity = "1";
    for (const part of parts()) {
      part.style.opacity = "1";
      part.style.fillOpacity = "1";
      part.style.strokeDasharray = "none";
      part.style.strokeDashoffset = "0";
    }
  };
  showStatic();
  try {
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver((entries) => {
        if (!active) return;
        const entry = entries.find((item) => item.target === root);
        if (entry)
          events.visibility(
            entry.isIntersecting && entry.intersectionRatio > 0,
          );
      });
      observer.observe(root);
    }
  } catch {
    observer?.disconnect();
    observer = undefined;
  }
  if (!observer) events.visibility(false);
  const binding: LogoMotionBinding = {
    prepare: (nextVariant) => {
      if (!active) return;
      timeline?.destroy();
      timeline = undefined;
      showStatic();
      variant = nextVariant;
      const manifest = buildManifest(root);
      if (!manifest.steps.length) throw new Error("Empty logo manifest");
      timeline = new AnimationTimeline(
        root,
        variant === "fade"
          ? {
              steps: [
                {
                  target: ":scope",
                  property: "opacity",
                  from: 0,
                  to: 1,
                  duration: createTimeline(manifest.steps).duration,
                  easing: "linear",
                },
              ],
            }
          : manifest,
        () => {
          if (active) events.completed();
        },
        () => {
          if (active) events.failed();
        },
        (time, duration) => {
          if (active) events.position?.(time, duration);
        },
      );
      events.position?.(timeline.time, timeline.duration);
    },
    get duration() {
      return timeline?.duration ?? 0;
    },
    get time() {
      return timeline?.time ?? 0;
    },
    showStatic,
    play: () => {
      if (active) timeline?.play();
    },
    pause: () => timeline?.pause(),
    reverse: () => {
      if (active) timeline?.reverse();
    },
    seek: (ms) => {
      if (!active || !timeline) return;
      if (variant === "draw" && !framePrepared) {
        for (const part of parts()) {
          if (part.tagName.toLowerCase() === "circle") part.style.opacity = "0";
          else {
            applyStrokeDrawInit(part as SVGPathElement | SVGPolygonElement);
            part.style.opacity = "1";
            part.style.fillOpacity =
              part.dataset.logoPart === "logo-path-1" ? "1" : "0";
          }
        }
        framePrepared = true;
      }
      timeline.seek(ms);
    },
    setSpeed: (value) => {
      if (active && Number.isFinite(value)) timeline?.setSpeed(value);
    },
    destroy: () => {
      if (!active) return;
      active = false;
      try {
        observer?.disconnect();
      } finally {
        try {
          timeline?.destroy();
        } finally {
          showStatic();
          timeline = undefined;
        }
      }
    },
  };
  return binding;
}
