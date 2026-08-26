import { createGame } from "../dist/index.js";

const canvas = document.querySelector("#game-canvas");
const viewport = document.querySelector("#game-viewport");
const status = document.querySelector("#game-status");

if (
  !(canvas instanceof HTMLCanvasElement) ||
  !(viewport instanceof HTMLElement) ||
  !(status instanceof HTMLElement)
) {
  throw new Error("The Wave Survivor demo markup is incomplete.");
}

const canvasStyle = getComputedStyle(canvas);
const foreground = canvasStyle.color;
const game = createGame({
  canvas,
  viewport,
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
if (document.hidden) {
  game.pause();
}
canvas.dataset.gameState = "started";
status.textContent = "Arena ready.";

const handleVisibilityChange = () => {
  if (document.hidden) {
    game.pause();
  } else {
    game.resume();
  }
};

const destroyGame = () => {
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("pagehide", destroyGame);
  game.destroy();
};

document.addEventListener("visibilitychange", handleVisibilityChange);
window.addEventListener("pagehide", destroyGame, { once: true });
