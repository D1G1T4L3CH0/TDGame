import { canvas, checkCollision, tower, player } from "./game.js";
import { projectiles } from "./projectile.js";

export let enemies = [];

class Enemy {
  constructor(
    x = 0,
    y = 0,
    speed = 1,
    radius = 5,
    hp = 1,
    damage = 1,
    type = 0,
    color = "brown",
    attackRate = 200,
    pointValue = 1
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
    this.lastAttackTime = 0;
    this.pointValue = pointValue;
  }

  // Other properties and methods of the Enemy class...

  static types = {
    0: { speed: 1, radius: 5, hp: 1, damage: 1, color: "brown", attackRate: 200, pointValue: 1 },
    1: { speed: 0.5, radius: 10, hp: 5, damage: 5, color: "red", attackRate: 300, pointValue: 1 },
    2: { speed: 0.7, radius: 8, hp: 3, damage: 3, color: "blue", attackRate: 250, pointValue: 1 },
    3: { speed: 1.2, radius: 3, hp: 2, damage: 2, color: "green", attackRate: 150, pointValue: 1 },
    4: { speed: 0.25, radius: 15, hp: 10, damage: 10, color: "purple", attackRate: 1000, pointValue: 10 },
    5: { speed: 2, radius: 1.5, hp: 1, damage: 1, color: "yellow", attackRate: 50, pointValue: 5 }
  };

  getStats() {
    return Enemy.types[this.type];
  }

  canAttack() {
    const currentTime = Date.now();
    return currentTime - this.lastAttackTime >= this.attackRate;
  }

  attack() {
    // Perform the attack logic...
    tower.removeHp(this.damage);
    // Update the last attack time
    this.lastAttackTime = Date.now();
  }

  flash() {
    this.flashEndTime = Date.now() + this.flashDuration;
  }
}

//spawn enemies on random sides of the canvas
export function spawn() {
  // Generate a random number between 0 and 3 to represent the side
  const side = Math.floor(Math.random() * 4);

  let x, y;

  switch (side) {
    case 0: // Top
      // Set the x coordinate to a random value within the canvas width
      x = Math.random() * canvas.width;
      // Set the y coordinate just above the canvas
      y = -10;
      break;
    case 1: // Right
      // Set the x coordinate just outside the canvas
      x = canvas.width + 10;
      // Set the y coordinate to a random value within the canvas height
      y = Math.random() * canvas.height;
      break;
    case 2: // Bottom
      // Set the x coordinate to a random value within the canvas width
      x = Math.random() * canvas.width;
      // Set the y coordinate just below the canvas
      y = canvas.height + 10;
      break;
    case 3: // Left
      // Set the x coordinate just outside the canvas
      x = -10;
      // Set the y coordinate to a random value within the canvas height
      y = Math.random() * canvas.height;
      break;
  }
  // add enemy to enemies
  // Get the stats for the specified type
  // i want the select tag with the id of enemyType to control this
  const type = document.getElementById("enemyType").value;
  const stats = Enemy.types[type];
  

  // Create the enemy with the specified type and stats
  enemies.push(
    new Enemy(
      x,
      y,
      stats.speed,
      stats.radius,
      stats.hp,
      stats.damage,
      type,
      stats.color,
      stats.attackRate,
      stats.pointValue
    )
  );
}

export function update() {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (!checkCollision(enemy, tower)) {
      const dx = tower.x - enemy.x;
      const dy = tower.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const xStep = (dx / distance) * enemy.speed;
        const yStep = (dy / distance) * enemy.speed;

        enemy.x += xStep;
        enemy.y += yStep;
      }
    } else {
      if (enemy.canAttack()) {
        enemy.attack();
      }
    }

    for (let j = 0; j < projectiles.length; j++) {
      const projectile = projectiles[j];
      if (checkCollision(enemy, projectile)) {
        projectiles.splice(j, 1);
        enemy.hp -= projectile.damage;

        if (enemy.hp <= 0) {
          player.addPoints(enemyDies(i));
        }
        break;
      }
    }
  }
}

function enemyDies(index) {
  const pointValue = enemies[index].pointValue;
  enemies.splice(index, 1);
  return pointValue;
}
