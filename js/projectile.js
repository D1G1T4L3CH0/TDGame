import { ctx, tower } from "./game.js";
import { projectiles } from "./director.js";

class Projectile {
/**
 * Represents a projectile in the game.
 * @param {number} x - The x-coordinate of the projectile.
 * @param {number} y - The y-coordinate of the projectile.
 * @param {number} dx - The x-component of the projectile's velocity.
 * @param {number} dy - The y-component of the projectile's velocity.
 * @param {number} radius - The radius of the projectile.
 * @param {number} speed - The speed of the projectile.
 * @param {number} damage - The damage inflicted by the projectile.
 */
constructor(x, y, dx, dy, radius, speed, damage) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.speed = speed;
  this.damage = damage;
}

  update() {
    this.move();
  }

  move() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }
}

export function createProjectile(x, y, dx, dy, radius, speed, damage) {
  return new Projectile(x, y, dx, dy, radius, speed, damage);
}

/**
 * Spawns a projectile from a tower at a given position and velocity.
 * 
 * @param {number} x - The x-coordinate of the tower.
 * @param {number} y - The y-coordinate of the tower.
 * @param {number} dx - The x-component of the projectile's velocity.
 * @param {number} dy - The y-component of the projectile's velocity.
 */
export function spawnProjectile(x, y, dx, dy) {
  // Get the radius of the tower
  const radius = tower.radius;

  // Calculate the angle of the projectile
  const angle = Math.atan2(dy, dx);

  // Calculate the spawn position at the edge of the tower's radius
  const spawnX = x + Math.cos(angle) * radius;
  const spawnY = y + Math.sin(angle) * radius;

  // Create a new projectile object with the updated spawn position
  const projectile = new Projectile(
    spawnX, // x-coordinate of the projectile
    spawnY, // y-coordinate of the projectile
    dx, // x-component of the projectile's velocity
    dy, // y-component of the projectile's velocity
    tower.projectileRadius, // radius of the projectile
    tower.projectileSpeed, // speed of the projectile
    tower.damage // damage inflicted by the projectile
  );

  // Add the projectile to the projectiles array
  projectiles.push(projectile);
}

