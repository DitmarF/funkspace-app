import { createGame } from "../dist/index.js";

const canvas = document.querySelector("#game-canvas");
const status = document.querySelector("#game-status");

if (
  !(canvas instanceof HTMLCanvasElement) ||
  !(status instanceof HTMLElement)
) {
  throw new Error("The Wave Survivor demo markup is incomplete.");
}

const canvasStyle = getComputedStyle(canvas);
const foreground = canvasStyle.color;
const game = createGame({
  canvas,
  theme: {
    colors: {
      background: canvasStyle.backgroundColor,
      player: foreground,
      enemy: foreground,
      projectile: foreground,
      effect: foreground,
    },
  },
});

game.start();
canvas.dataset.gameState = "started";
status.textContent = "Arena ready.";

window.addEventListener("pagehide", () => game.destroy(), { once: true });
