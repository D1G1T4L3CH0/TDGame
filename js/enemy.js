import { ctx, tower, director } from "./game.js";
import { projectiles } from "./director.js";
import { checkCollision } from "./helpers.js";

class Enemy {
  constructor(
    x,
    y,
    speed,
    radius,
    hp,
    damage,
    type,
    color,
    attackRate,
    lastAttackTime,
    pointValue,
    cost
  ) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.radius = radius;
    this.hp = hp;
    this.damage = damage;
    this.type = type;
    this.color = color;
    this.attackRate = attackRate;
    this.lastAttackTime = lastAttackTime;
    this.pointValue = pointValue;
    this.cost = cost;
  }

  update() {
    const distance = this.checkDistanceToTower();
    if (distance && !this.checkCollisionWithTower()) {
      this.updatePosition(distance);
    } else {
      const currentTime = performance.now();
      if (currentTime - this.lastAttackTime >= this.attackRate) {
        this.attack();
        this.lastAttackTime = currentTime;
      }
    }
    this.checkCollisionWithProjectiles();
    this.checkEnemyHealth();
  }

  /**
   * Calculate the distance between the current position and the tower.
   *
   * @param {number} towerX - The x-coordinate of the tower.
   * @param {number} towerY - The y-coordinate of the tower.
   * @returns {number} The distance between the current position and the tower.
   */
  checkDistanceToTower() {
    const dx = tower.x - this.x;
    const dy = tower.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance;
  }

  /**
   * Updates the position of the object based on the distance from a tower.
   * @param {number} distance - The distance from the tower.
   */
  updatePosition(distance) {
    // Calculate the difference in x and y coordinates between the tower and the object
    const dx = tower.x - this.x;
    const dy = tower.y - this.y;

    // Calculate the step size in the x and y directions
    const xStep = ((dx / distance) * this.speed) / 1000;
    const yStep = ((dy / distance) * this.speed) / 1000;

    // Update the x and y coordinates of the object
    this.x += xStep;
    this.y += yStep;
  }

  checkCollisionWithProjectiles() {
    projectiles.forEach((projectile, index) => {
      if (checkCollision(this, projectile)) {
        this.hp -= projectile.damage;
        projectiles.splice(index, 1);
      }
    });
  }

  checkEnemyHealth() {
    if (this.hp <= 0) {
      director.enemyDies(this);
    }
  }

  checkCollisionWithTower() {
    return checkCollision(this, tower);
  }

/**
 * Draws the enemy shape on the canvas.
 */
draw() {
  ctx.beginPath();

  // Determine the type of enemy and draw the corresponding shape
  switch (this.type) {
    case "BasicEnemy":
      // Draw a circle
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      break;
    case "FastEnemy":
      // Draw a rectangle
      ctx.rect(
        this.x - this.radius,
        this.y - this.radius,
        this.radius * 2,
        this.radius * 2
      );
      break;
    case "HeavyEnemy":
      // Draw a triangle
      ctx.moveTo(this.x, this.y - this.radius);
      ctx.lineTo(this.x - this.radius, this.y + this.radius);
      ctx.lineTo(this.x + this.radius, this.y + this.radius);
      ctx.closePath();
      break;
    case "PowerfulEnemy":
      // Draw a star shape
      const starAngle = (Math.PI * 2) / 10;
      ctx.moveTo(this.x + this.radius, this.y);
      for (let i = 1; i < 10; i++) {
        const angle = starAngle * i;
        const radius = i % 2 === 0 ? this.radius : this.radius * 0.5;
        const x = this.x + radius * Math.cos(angle);
        const y = this.y + radius * Math.sin(angle);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    case "CunningEnemy":
      // Draw a diamond shape
      ctx.moveTo(this.x, this.y - this.radius);
      ctx.lineTo(this.x + this.radius, this.y);
      ctx.lineTo(this.x, this.y + this.radius);
      ctx.lineTo(this.x - this.radius, this.y);
      ctx.closePath();
      break;
    case "ToughEnemy":
      // Draw a semicircle
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI);
      break;
  }

  ctx.fillStyle = this.color;
  ctx.fill();
}

  getStats() {
    return Enemy.types[this.type];
  }

  /**
   * Checks if the entity can perform an attack based on the attack rate.
   * @returns {boolean} - True if the entity can attack, false otherwise.
   */
  canAttack() {
    // Get the current time in milliseconds
    const currentTime = performance.now();

    // Calculate the time difference between the current time and the last attack time
    const timeDifference = currentTime - this.lastAttackTime;

    // Check if the time difference is greater than or equal to the attack rate
    if (timeDifference >= this.attackRate) {
      return true;
    } else {
      return false;
    }
  }

  attack() {
    if (this.canAttack) {
      tower.removeHp(this.damage);
      this.lastAttackTime = performance.now();
    }
  }
}

export function createEnemy(x, y, speed, radius, hp, damage, type, color, attackRate, lastAttackTime, pointValue, cost) {
  return new Enemy(x, y, speed, radius, hp, damage, type, color, attackRate, lastAttackTime, pointValue, cost);
}
