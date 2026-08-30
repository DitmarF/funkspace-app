import { createGame } from "../dist/index.js";

const canvas = document.querySelector("#game-canvas");
const viewport = document.querySelector("#game-viewport");
const health = document.querySelector("#game-health");
const kills = document.querySelector("#game-kills");
const announcement = document.querySelector("#game-announcement");
const restartButton = document.querySelector("#game-restart");

if (
  !(canvas instanceof HTMLCanvasElement) ||
  !(viewport instanceof HTMLElement) ||
  !(health instanceof HTMLElement) ||
  !(kills instanceof HTMLElement) ||
  !(announcement instanceof HTMLElement) ||
  !(restartButton instanceof HTMLButtonElement)
) {
  throw new Error("The Wave Survivor demo markup is incomplete.");
}

const canvasStyle = getComputedStyle(canvas);
const foreground = canvasStyle.color;
let previousPhase = null;
const game = createGame({
  canvas,
  viewport,
  onStatusChange: (status) => {
    health.textContent = `Health: ${status.currentHealth} / ${status.maximumHealth}`;
    kills.textContent = `Kills: ${status.killCount}`;
    restartButton.hidden = status.phase !== "lost";
    canvas.dataset.gameState = status.phase;

    if (status.phase === "lost" && previousPhase !== "lost") {
      announcement.textContent = "You lost. Restart is available.";
    } else if (status.phase === "playing" && previousPhase === "lost") {
      announcement.textContent = "New run started.";
    } else if (status.phase === "playing" && previousPhase === "idle") {
      announcement.textContent = "Arena ready.";
    }

    previousPhase = status.phase;
  },
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

const handleRestart = () => {
  game.restart();
};

const handleVisibilityChange = () => {
  if (document.hidden) {
    game.pause();
  } else {
    game.resume();
  }
};

const destroyGame = () => {
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  restartButton.removeEventListener("click", handleRestart);
  window.removeEventListener("pagehide", destroyGame);
  game.destroy();
};

document.addEventListener("visibilitychange", handleVisibilityChange);
restartButton.addEventListener("click", handleRestart);
window.addEventListener("pagehide", destroyGame, { once: true });
