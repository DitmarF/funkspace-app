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

  it("server-renders HTML copy and complete decorative WEB artwork", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(
      <ServiceProvider>
        <Start />
      </ServiceProvider>,
    );
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.querySelector("h1")?.textContent).toBe("Aperture - 1");
    expect(container.textContent).not.toContain(
      "FunkSpace is a design-system-first web experience built as a PNPM workspace.",
    );
    const logo = container.querySelector("[data-aperture-fallback]")!;
    expect(logo.querySelectorAll("path, polygon")).toHaveLength(1);
    expect(logo.querySelectorAll("circle")).toHaveLength(0);
    expect(logo.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(
      container.querySelector("h1")?.closest('[aria-hidden="true"]'),
    ).toBeNull();
    expect(container.querySelector("canvas")).toBeNull();
    expect(
      container.querySelectorAll(
        "[data-start-scene] line, [data-start-scene] circle",
      ),
    ).toHaveLength(0);
    expect(container.querySelector("[data-particle-static]")).toBeNull();
  });

  it("does not animate the retired large logo; unavailable observation retains artwork", () => {
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
      screen.getByRole("button", { name: "Pause animation" }),
    ).toBeDisabled();
  });
});
