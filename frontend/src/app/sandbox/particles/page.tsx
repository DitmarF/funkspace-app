"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";

type RendererMode = "SVG" | "Canvas";

export default function ParticlesSandboxPage() {
  const prefersReduced = useReducedMotion();
  const [renderer, setRenderer] = useState<RendererMode>("SVG");

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Particles Sandbox</h1>
        <div className="flex items-center gap-3">
          <label htmlFor="renderer" className="text-sm">
            Renderer
          </label>
          <select
            id="renderer"
            value={renderer}
            onChange={(e) => setRenderer(e.target.value as RendererMode)}
            className="rounded border px-2 py-1 bg-fs-surface-background text-fs-content-primary border-fs-border-subtle"
          >
            <option value="SVG">SVG</option>
            <option value="Canvas">Canvas</option>
          </select>
        </div>
      </header>

      <section className="space-y-4">
        <p className="text-sm text-fs-grey-dark-3">
          This page is a lab for heavy scenes and fallbacks. When reduced motion
          is enabled, the scene simplifies or becomes static.
        </p>

        <div className="rounded-lg border border-fs-border-subtle p-4">
          {prefersReduced ? (
            <StaticFallback />
          ) : renderer === "SVG" ? (
            <SvgPlaceholder />
          ) : (
            <CanvasPlaceholder />
          )}
        </div>

        <p className="text-xs text-fs-grey-dark-3">
          Tip: Toggle system reduced motion in your OS settings to verify the
          fallback. Tailwind also applies motion-reduce utilities automatically.
        </p>
      </section>
    </main>
  );
}

function StaticFallback() {
  return (
    <div className="flex h-64 items-center justify-center bg-fs-surface-elevation-1 motion-reduce:transition-none">
      <span className="text-sm">Reduced motion: static preview</span>
    </div>
  );
}

function SvgPlaceholder() {
  return (
    <div className="flex h-64 items-center justify-center motion-reduce:transition-none">
      <svg
        width="240"
        height="120"
        viewBox="0 0 240 120"
        className="text-fs-action-primary"
        aria-label="SVG particles placeholder"
      >
        <circle cx="40" cy="60" r="8" fill="currentColor" />
        <circle cx="120" cy="40" r="6" fill="currentColor" />
        <circle cx="200" cy="80" r="10" fill="currentColor" />
      </svg>
    </div>
  );
}

function CanvasPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Canvas particles placeholder"
      className="flex h-64 items-center justify-center bg-fs-surface-elevation-1 motion-reduce:transition-none"
    >
      <span className="text-sm">Canvas placeholder (to be implemented)</span>
    </div>
  );
}
