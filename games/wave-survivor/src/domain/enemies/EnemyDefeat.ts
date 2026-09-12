import { isEnemyStateValid, type EnemyState } from "./EnemyState.js";

/** Provisional Gate 1 duration for the static dying-state presentation. */
export const PROVISIONAL_ENEMY_DYING_DURATION_SECONDS = 0.125;

/** Transition one defeated active enemy exactly once. */
export function transitionEnemyToDying(
  enemy: EnemyState,
  simulationTimeSeconds: number,
): boolean {
  if (
    !isEnemyStateValid(enemy) ||
    enemy.phase !== "active" ||
    enemy.currentHealth > 0 ||
    !Number.isFinite(simulationTimeSeconds) ||
    simulationTimeSeconds < 0
  ) {
    return false;
  }

  const removeAtSimulationSeconds =
    simulationTimeSeconds + PROVISIONAL_ENEMY_DYING_DURATION_SECONDS;
  if (!Number.isFinite(removeAtSimulationSeconds)) return false;

  enemy.phase = "dying";
  enemy.removeAtSimulationSeconds = removeAtSimulationSeconds;
  return true;
}

/** Remove a defeated enemy at its exact simulation-time deadline. */
export function hasEnemyDyingExpired(
  enemy: Readonly<EnemyState>,
  simulationTimeSeconds: number,
): boolean {
  return (
    enemy.phase === "dying" &&
    enemy.removeAtSimulationSeconds !== null &&
    Number.isFinite(enemy.removeAtSimulationSeconds) &&
    Number.isFinite(simulationTimeSeconds) &&
    simulationTimeSeconds >= enemy.removeAtSimulationSeconds
  );
}
