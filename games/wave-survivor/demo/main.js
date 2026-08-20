import { createGame } from "../dist/index.js";

const canvas = document.querySelector("#game-canvas");
const status = document.querySelector("#game-status");

if (
  !(canvas instanceof HTMLCanvasElement) ||
  !(status instanceof HTMLElement)
) {
  throw new Error("The Wave Survivor demo markup is incomplete.");
}

const game = createGame();

game.start();
canvas.dataset.gameState = "started";
status.textContent = "Empty game started.";

window.addEventListener("pagehide", () => game.destroy(), { once: true });
