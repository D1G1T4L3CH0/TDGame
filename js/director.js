import { canvas, soundEffects, tower } from "./game.js";
import { createEnemy } from "./enemy.js";
import * as Draw from "./draw.js";

export let projectiles = [];

class Director {
  constructor() {
    this.enemyTypes = new Map([
      [
        "BasicEnemy",
        {
          speed: 200,
          radius: 5,
          hp: 2,
          damage: 1,
          color: "grey",
          attackRate: 100,
          pointValue: 6,
          cost: 5,
        },
      ],
      [
        "FastEnemy",
        {
          speed: 3000,
          radius: 7,
          hp: 2,
          damage: 1,
          color: "red",
          attackRate: 10,
          pointValue: 12,
          cost: 10,
        },
      ],
      [
        "HeavyEnemy",
        {
          speed: 500,
          radius: 10,
          hp: 5,
          damage: 5,
          color: "blue",
          attackRate: 250,
          pointValue: 18,
          cost: 15,
        },
      ],
      [
        "PowerfulEnemy",
        {
          speed: 700,
          radius: 8,
          hp: 3,
          damage: 10,
          color: "green",
          attackRate: 100,
          pointValue: 24,
          cost: 20,
        },
      ],
      [
        "CunningEnemy",
        {
          speed: 200,
          radius: 12,
          hp: 15,
          damage: 14,
          color: "yellow",
          attackRate: 300,
          pointValue: 30,
          cost: 25,
        },
      ],
    ]);

    this.enemies = [];
    this.gameTimer = 0;
    this.points = 5000;
    this.kills = 0;
  }

  update() {
    this.enemies.forEach((enemy) => {
      enemy.update();
      enemy.draw();
    });

    removeOutOfBoundsProjectiles();
    projectiles.forEach((projectile) => {
      projectile.update();
      projectile.draw();
    });

    tower.scanForEnemies(this.enemies);
  }

  getKills() {
    return this.kills;
  }

  addKill() {
    this.kills += 1;
  }

  resetKills() {
    this.kills = 0;
  }

  getCurrentPoints() {
    return this.points;
  }

  addPoints(amount) {
    this.points += amount;
  }

  subtractPoints(amount) {
    this.points -= amount;
  }

  resetPoints() {
    this.points = 0;
  }

  canAfford(cost) {
    return this.points >= cost;
  }

  spawnEnemy(type) {
    const stats = this.enemyTypes.get(type);
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    if (this.canAfford(stats.cost)) {
      const side = Math.floor(Math.random() * 4);
      let x, y;

      switch (side) {
        case 0: // Top
          x = Math.random() * canvasWidth;
          y = -10;
          break;
        case 1: // Right
          x = canvasWidth + 10;
          y = Math.random() * canvasHeight;
          break;
        case 2: // Bottom
          x = Math.random() * canvasWidth;
          y = canvasHeight + 10;
          break;
        case 3: // Left
          x = -10;
          y = Math.random() * canvasHeight;
          break;
      }

      const enemy = createEnemy(
        x,
        y,
        stats.speed,
        stats.radius,
        stats.hp,
        stats.damage,
        type,
        stats.color,
        stats.attackRate,
        stats.pointValue,
        stats.cost
      );

      soundEffects.spawn.currentTime = 0;
      soundEffects.spawn.play();
      this.enemies.push(enemy);
      this.subtractPoints(stats.cost);
    } else {
      Draw.setDisplayMessage(`Insufficient points. Enemy cost: +${stats.cost}`);
    }
  }

  enemyDies(enemy) {
    this.addPoints(enemy.pointValue);
    this.addKill(1);
    // Increase score by enemy's point value
    const index = this.enemies.indexOf(enemy);
    if (index !== -1) {
      this.enemies.splice(index, 1);
    }
    soundEffects.bang.currentTime = 0;
    soundEffects.bang.play();
  }
}

export function createDirector() {
  return new Director();
}

function removeOutOfBoundsProjectiles() {
  projectiles = projectiles.filter((projectile) => {
    const outOfBounds =
      projectile.x < 0 ||
      projectile.y < 0 ||
      projectile.x > canvas.width ||
      projectile.y > canvas.height;

    return !outOfBounds;
  });
}
