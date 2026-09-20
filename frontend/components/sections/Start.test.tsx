import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ServiceProvider } from "@/application/providers/ServiceProvider";
import { AnimationOrchestratorImpl } from "@/application/animations/AnimationOrchestrator";
import Start from "./Start";

describe("portfolio Start", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("server-renders HTML copy and complete decorative branding", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(
      <ServiceProvider>
        <Start />
      </ServiceProvider>,
    );
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.querySelector("h1")?.textContent).toBe("FunkSpace");
    expect(container.querySelector("p")?.textContent).toBe(
      "FunkSpace is a design-system-first web experience built as a PNPM workspace.",
    );
    const logo = container.querySelector("[data-funkspace-logo]")!;
    expect(logo.querySelectorAll("path, polygon")).toHaveLength(10);
    expect(logo.querySelectorAll("circle")).toHaveLength(9);
    expect(logo.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(
      container.querySelector("h1")?.closest('[aria-hidden="true"]'),
    ).toBeNull();
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("never requests animation even with the feature flag on", () => {
    vi.stubEnv("NEXT_PUBLIC_ANIMATIONS_ENABLED", "true");
    vi.stubGlobal(
      "matchMedia",
      vi.fn((media: string) => ({
        media,
        matches: false,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
    const buildManifest = vi.spyOn(
      AnimationOrchestratorImpl.prototype,
      "buildLogoManifest",
    );
    render(
      <ServiceProvider>
        <Start />
      </ServiceProvider>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(buildManifest).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", {
        name: /next|previous|up|down|play|pause/i,
      }),
    ).not.toBeInTheDocument();
  });
});
