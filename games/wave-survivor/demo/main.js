import { createGame } from "../dist/index.js";

const canvas = document.querySelector("#game-canvas");
const viewport = document.querySelector("#game-viewport");
const wave = document.querySelector("#game-wave");
const health = document.querySelector("#game-health");
const kills = document.querySelector("#game-kills");
const announcement = document.querySelector("#game-announcement");
const restartButton = document.querySelector("#game-restart");
const upgradePanel = document.querySelector("#game-upgrades");
const upgradeOptions = document.querySelector("#game-upgrade-options");
const introPanel = document.querySelector("#game-intro");
const startButton = document.querySelector("#game-start");
const resultPanel = document.querySelector("#game-result");
const resultOutcome = document.querySelector("#game-result-outcome");
const resultScore = document.querySelector("#game-result-score");
const resultWave = document.querySelector("#game-result-wave");
const resultTime = document.querySelector("#game-result-time");
const replayButton = document.querySelector("#game-replay");

if (
  !(canvas instanceof HTMLCanvasElement) ||
  !(viewport instanceof HTMLElement) ||
  !(wave instanceof HTMLElement) ||
  !(health instanceof HTMLElement) ||
  !(kills instanceof HTMLElement) ||
  !(announcement instanceof HTMLElement) ||
  !(restartButton instanceof HTMLButtonElement) ||
  !(upgradePanel instanceof HTMLElement) ||
  !(upgradeOptions instanceof HTMLElement) ||
  !(introPanel instanceof HTMLElement) ||
  !(startButton instanceof HTMLButtonElement) ||
  !(resultPanel instanceof HTMLElement) ||
  !(resultOutcome instanceof HTMLElement) ||
  !(resultScore instanceof HTMLElement) ||
  !(resultWave instanceof HTMLElement) ||
  !(resultTime instanceof HTMLElement) ||
  !(replayButton instanceof HTMLButtonElement)
) {
  throw new Error("The Wave Survivor demo markup is incomplete.");
}

const canvasStyle = getComputedStyle(canvas);
const foreground = canvasStyle.color;
let previousPhase = null;
let selectionInProgress = false;
let selectedUpgradeTitle = null;
let restartInProgress = false;
const optionTitlesById = new Map();

const clearUpgradeOptions = () => {
  optionTitlesById.clear();
  upgradeOptions.replaceChildren();
};

const hideAndClearUpgradePanel = () => {
  upgradePanel.hidden = true;
  clearUpgradeOptions();
};

const setUpgradeButtonsDisabled = (disabled) => {
  for (const button of upgradeOptions.querySelectorAll("button")) {
    button.disabled = disabled;
  }
};

const renderUpgradeOptions = (options) => {
  clearUpgradeOptions();

  for (const option of options) {
    const button = document.createElement("button");
    const title = document.createElement("span");
    const description = document.createElement("span");

    button.type = "button";
    button.className = "upgrade-option";
    button.dataset.upgradeId = option.id;
    title.className = "upgrade-option-title";
    title.textContent = option.title;
    description.className = "upgrade-option-description";
    description.textContent = option.description;

    button.append(title, description);
    upgradeOptions.append(button);
    optionTitlesById.set(option.id, option.title);
  }

  upgradePanel.hidden = false;
  upgradePanel.scrollTop = 0;
  upgradeOptions.querySelector("button")?.focus({ preventScroll: true });
};

const clearResult = () => {
  resultPanel.hidden = true;
  resultOutcome.textContent = "";
  resultScore.textContent = "";
  resultWave.textContent = "";
  resultTime.textContent = "";
};

const showResult = (result) => {
  hideAndClearUpgradePanel();
  introPanel.hidden = true;
  restartButton.hidden = true;
  selectedUpgradeTitle = null;
  selectionInProgress = false;
  const outcome = result.outcome === "won" ? "You won!" : "You lost";
  // Format only the supplied duration; the UI owns no clock or score calculation.
  const elapsed = `${Math.floor(result.elapsedSeconds / 60)}:${String(Math.floor(result.elapsedSeconds % 60)).padStart(2, "0")}`;
  resultOutcome.textContent = outcome;
  resultScore.textContent = String(result.score);
  resultWave.textContent = String(result.waveReached);
  resultTime.textContent = elapsed;
  resultPanel.hidden = false;
  resultPanel.scrollTop = 0;
  canvas.tabIndex = -1;
  announcement.textContent = `${outcome} Score ${result.score}. Wave reached ${result.waveReached}. Elapsed time ${elapsed}. Replay is available.`;
  resultOutcome.focus({ preventScroll: true });
};

const game = createGame({
  canvas,
  viewport,
  onStatusChange: (status) => {
    wave.textContent = `Wave: ${status.waveNumber}`;
    health.textContent = `Health: ${status.currentHealth} / ${status.maximumHealth}`;
    kills.textContent = `Kills: ${status.killCount}`;
    restartButton.hidden = status.phase !== "wave-cleared";
    canvas.dataset.gameState = status.phase;
    canvas.tabIndex = status.phase === "playing" ? 0 : -1;
    if (status.phase !== "choosing-upgrade" && !selectionInProgress) {
      hideAndClearUpgradePanel();
    }
    if (status.phase === "wave-cleared" && previousPhase !== "wave-cleared") {
      announcement.textContent = `Wave ${status.waveNumber} cleared. All upgrades maxed — restart to play again.`;
      restartButton.focus();
    }

    previousPhase = status.phase;
  },
  onEvent: (event) => {
    switch (event.type) {
      case "wave-started":
        if (event.encounterKind === "boss") {
          announcement.textContent =
            "Boss entering from the top. Move clear of the entry point.";
        } else if (selectedUpgradeTitle) {
          announcement.textContent = `${selectedUpgradeTitle} selected. Wave ${event.waveNumber} started.`;
        } else if (restartInProgress) {
          announcement.textContent = `New run started. Wave ${event.waveNumber}.`;
        } else {
          announcement.textContent = `Wave ${event.waveNumber} started.`;
        }
        return;
      case "wave-cleared":
        announcement.textContent = `Wave ${event.waveNumber} cleared.`;
        return;
      case "upgrade-choice-requested":
        renderUpgradeOptions(event.options);
        announcement.textContent = `Wave ${event.clearedWaveNumber} cleared. Upgrade choice available.`;
        return;
      case "run-finished":
        showResult(event.result);
        return;
    }
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

const handleStart = () => {
  introPanel.hidden = true;
  startButton.disabled = true;
  game.start();
  canvas.focus({ preventScroll: true });
};

const handleRestart = () => {
  restartInProgress = true;
  hideAndClearUpgradePanel();
  clearResult();
  introPanel.hidden = true;
  selectedUpgradeTitle = null;
  selectionInProgress = false;
  game.restart();
  restartInProgress = false;
  canvas.focus({ preventScroll: true });
};

const handleUpgradeSelection = (event) => {
  if (selectionInProgress || !(event.target instanceof Element)) return;

  const button = event.target.closest("button[data-upgrade-id]");
  if (
    !(button instanceof HTMLButtonElement) ||
    !upgradeOptions.contains(button)
  )
    return;

  const upgradeId = button.dataset.upgradeId;
  if (!upgradeId) return;

  selectionInProgress = true;
  selectedUpgradeTitle = optionTitlesById.get(upgradeId) ?? "Upgrade";
  setUpgradeButtonsDisabled(true);

  const accepted = game.chooseUpgrade(upgradeId);
  if (accepted) {
    hideAndClearUpgradePanel();
    canvas.focus({ preventScroll: true });
  } else {
    selectionInProgress = false;
    selectedUpgradeTitle = null;
    setUpgradeButtonsDisabled(false);
    button.focus({ preventScroll: true });
    announcement.textContent = "That upgrade is unavailable. Choose another.";
    return;
  }

  selectionInProgress = false;
  selectedUpgradeTitle = null;
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
  startButton.removeEventListener("click", handleStart);
  replayButton.removeEventListener("click", handleRestart);
  upgradeOptions.removeEventListener("click", handleUpgradeSelection);
  window.removeEventListener("pagehide", destroyGame);
  selectionInProgress = false;
  selectedUpgradeTitle = null;
  restartInProgress = false;
  hideAndClearUpgradePanel();
  clearResult();
  game.destroy();
};

document.addEventListener("visibilitychange", handleVisibilityChange);
restartButton.addEventListener("click", handleRestart);
startButton.addEventListener("click", handleStart);
replayButton.addEventListener("click", handleRestart);
upgradeOptions.addEventListener("click", handleUpgradeSelection);
window.addEventListener("pagehide", destroyGame, { once: true });
