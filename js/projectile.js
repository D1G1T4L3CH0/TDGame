import { tower } from "./game.js";

export let projectiles = [];

export function spawn(x, y, dx, dy) {
  // Create a new projectile object
  const projectile = {
    x: x, // x-coordinate of the projectile
    y: y, // y-coordinate of the projectile
    dx: dx, // x-component of the projectile's velocity
    dy: dy, // y-component of the projectile's velocity
    radius: tower.projectileRadius, // radius of the projectile
    speed: tower.projectileSpeed, // speed of the projectile
    damage: tower.damage, // damage inflicted by the projectile
  };

  // Add the projectile to the projectiles array
  projectiles.push(projectile);
}
