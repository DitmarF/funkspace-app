import {
  isProjectileStateValid,
  type ProjectileState,
} from "./ProjectileState.js";

/** Move one valid projectile in place using its creation-time velocity. */
export function moveProjectile(
  projectile: ProjectileState,
  deltaSeconds: number,
): void {
  if (!isProjectileStateValid(projectile)) return;
  if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return;

  const nextX = projectile.position.x + projectile.velocity.x * deltaSeconds;
  const nextY = projectile.position.y + projectile.velocity.y * deltaSeconds;
  if (!Number.isFinite(nextX) || !Number.isFinite(nextY)) return;

  projectile.position.x = nextX;
  projectile.position.y = nextY;
}
