import { readFileSync } from "node:fs";
import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { FunkSpaceLogoInline } from "./FunkSpaceLogoInline";
import { AnimationOrchestratorImpl } from "@/application/animations/AnimationOrchestrator";
import { AnimationTimeline } from "@/infrastructure/motion/timeline";

function Pair() {
  return (
    <>
      <FunkSpaceLogoInline />
      <FunkSpaceLogoInline />
    </>
  );
}

function serverPair() {
  const container = document.createElement("div");
  container.innerHTML = renderToString(<Pair />);
  return container;
}

describe("shared inline logo", () => {
  it("renders the complete trusted geometry, visible before any effects", () => {
    const svg = serverPair().querySelector("svg")!;
    const source = new DOMParser().parseFromString(
      readFileSync("frontend/public/svg/fs/FunSpace_logo.svg", "utf8"),
      "image/svg+xml",
    ).documentElement;
    const geometry = (root: Element) =>
      [...root.querySelectorAll("path, polygon, circle")].map((node) => ({
        tag: node.tagName,
        attributes: ["d", "points", "cx", "cy", "r"].map((name) =>
          node.getAttribute(name),
        ),
      }));
    expect(svg.getAttribute("viewBox")).toBe(source.getAttribute("viewBox"));
    expect(geometry(svg)).toEqual(geometry(source));
    expect(svg.querySelectorAll("path, polygon")).toHaveLength(10);
    expect(svg.querySelectorAll("circle")).toHaveLength(9);
    expect(
      svg.querySelectorAll(
        '[style], [opacity="0"], [fill-opacity="0"], [visibility="hidden"]',
      ),
    ).toHaveLength(0);
    // The trusted geometry has no paint-server or fragment references to retarget.
    expect(
      svg.querySelectorAll("[href], [clip-path], [mask], [filter]"),
    ).toHaveLength(0);
    expect(svg.innerHTML).not.toContain("url(#");
  });

  it("keeps every instance ID unique and identical through hydration", async () => {
    const container = serverPair();
    document.body.append(container);
    const ids = () =>
      [...container.querySelectorAll("[id]")].map((node) => node.id);
    const before = ids();
    expect(new Set(before).size).toBe(before.length);
    const recoverableError = vi.fn();
    const consoleError = vi.spyOn(console, "error");
    let root: ReturnType<typeof hydrateRoot> | undefined;
    try {
      await act(async () => {
        root = hydrateRoot(container, <Pair />, {
          onRecoverableError: recoverableError,
        });
      });
      expect(ids()).toEqual(before);
      expect(recoverableError).not.toHaveBeenCalled();
      expect(consoleError).not.toHaveBeenCalled();
    } finally {
      await act(async () => root?.unmount());
      container.remove();
      consoleError.mockRestore();
    }
  });

  it("resolves every real manifest target locally and animates one instance without changing its sibling", () => {
    const [first, second] = [...serverPair().querySelectorAll("svg")];
    const orchestrator = new AnimationOrchestratorImpl({
      getTokenDurationMs: (_name, fallback) => fallback,
      getPathLength: () => 100,
      getDistanceAlongPath: () => 50,
    });
    const manifests = [first, second].map((svg) =>
      orchestrator.buildLogoManifest(svg),
    );
    expect(manifests[0].steps).toHaveLength(28);
    for (const [index, manifest] of manifests.entries()) {
      const own = [first, second][index];
      const other = [second, first][index];
      for (const step of manifest.steps) {
        expect(own.querySelectorAll(step.target)).toHaveLength(1);
        expect(other.querySelector(step.target)).toBeNull();
      }
    }
    const timeline = new AnimationTimeline(first, manifests[0]);
    const siblingBefore = second.outerHTML;
    timeline.seek(0);
    expect(
      first.querySelector<SVGElement>('[data-logo-part="logo-path-6"]')?.style
        .fillOpacity,
    ).toBe("0");
    timeline.seek(timeline.duration);
    for (const path of first.querySelectorAll<SVGElement>("path, polygon")) {
      expect(path.style.strokeDashoffset).toBe("0");
      if (path.dataset.logoPart !== "logo-path-1")
        expect(path.style.fillOpacity).toBe("1");
    }
    for (const dot of first.querySelectorAll("circle"))
      expect(dot.style.opacity).toBe("1");
    expect(second.outerHTML).toBe(siblingBefore);
    timeline.destroy();
  });
});
