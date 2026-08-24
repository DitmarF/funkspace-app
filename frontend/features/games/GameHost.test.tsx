import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ThemeSubscriber } from "@/application/theme/ThemeService";
import {
  type GameModule,
  type GameModuleLoader,
  type HostedGameController,
} from "./GameLoader";
import { GameHost } from "./GameHost";

const { useServicesMock } = vi.hoisted(() => ({
  useServicesMock: vi.fn(),
}));

vi.mock("@/application/providers/ServiceProvider", () => ({
  useServices: useServicesMock,
}));

afterEach(() => {
  vi.restoreAllMocks();
  useServicesMock.mockReset();
});

function createThemeSource() {
  let subscriber: ThemeSubscriber | null = null;
  const unsubscribe = vi.fn();
  const themeService = {
    getCurrentTheme: vi.fn(() => "default" as const),
    subscribe: vi.fn((callback: ThemeSubscriber) => {
      subscriber = callback;
      callback({ selectedTheme: "default", resolvedTheme: "default" });
      return unsubscribe;
    }),
  };

  return {
    themeService,
    unsubscribe,
    notifyTheme(callbackState: Parameters<ThemeSubscriber>[0]) {
      if (!subscriber) throw new Error("Theme subscriber was not registered.");
      subscriber(callbackState);
    },
  };
}

function createController(): HostedGameController {
  return {
    start: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    restart: vi.fn(),
    setTheme: vi.fn(),
    destroy: vi.fn(),
  };
}

function createLoader(gameModule: GameModule): GameModuleLoader {
  return {
    load: vi.fn(async () => gameModule),
  };
}

describe("GameHost", () => {
  it("mounts a lazy game, forwards themes, and owns its lifecycle", async () => {
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    const theme = createThemeSource();
    useServicesMock.mockReturnValue({ themeService: theme.themeService });
    const controller = createController();
    const createGame = vi.fn(() => controller);
    const loader = createLoader({ createGame });

    const { unmount } = render(
      <GameHost loader={loader} className="game-placement" />,
    );
    const canvas = screen.getByLabelText("Wave Survivor game canvas");

    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(canvas).not.toHaveAttribute("width");
    expect(canvas).not.toHaveAttribute("height");
    expect(canvas.parentElement).toHaveClass("game-placement");
    expect(canvas.parentElement).toHaveStyle({
      overflow: "hidden",
      position: "relative",
    });
    expect(screen.getByRole("status")).toHaveTextContent("Loading game…");

    await waitFor(() => expect(createGame).toHaveBeenCalledOnce());

    expect(loader.load).toHaveBeenCalledWith("wave-survivor");
    expect(createGame).toHaveBeenCalledWith({
      canvas,
      viewport: canvas.parentElement,
      theme: {
        colors: {
          background: "#e6e6e6",
          player: "#3b47cc",
          enemy: "#cc3b3e",
          projectile: "#ccca3b",
          effect: "#3b47cc",
        },
      },
    });
    expect(controller.start).toHaveBeenCalledOnce();
    expect(screen.getByRole("status")).toHaveTextContent("Game ready.");

    act(() => {
      theme.notifyTheme({ selectedTheme: "dark", resolvedTheme: "dark" });
    });

    expect(controller.setTheme).toHaveBeenLastCalledWith({
      colors: {
        background: "#1a1a1a",
        player: "#3b94cc",
        enemy: "#cc686a",
        projectile: "#ccca68",
        effect: "#68ccbb",
      },
    });

    hidden.mockReturnValue(true);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(controller.pause).toHaveBeenCalledOnce();

    hidden.mockReturnValue(false);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(controller.resume).toHaveBeenCalledOnce();

    unmount();
    expect(theme.unsubscribe).toHaveBeenCalledOnce();
    expect(controller.destroy).toHaveBeenCalledOnce();
  });

  it("reports a lazy-load failure without creating a game", async () => {
    const theme = createThemeSource();
    useServicesMock.mockReturnValue({ themeService: theme.themeService });
    const loader: GameModuleLoader = {
      load: vi.fn(async () => {
        throw new Error("Game chunk unavailable");
      }),
    };

    render(<GameHost loader={loader} />);

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Game unavailable.",
    );
  });
});
