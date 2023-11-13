import { spawnProjectile } from "./projectile.js";
import { soundEffects, director } from "./game.js";
import { setDisplayMessage } from "./draw.js";

class Tower {
  constructor(
    x,
    y,
    radius,
    hp,
    maxHp,
    range,
    fireRate,
    damage,
    projectileSpeed,
    projectileRadius,
    target
  ) {
    this.x = x;
    this.y = y;
    this.minRadius = 10;
    this.maxRadius = 500;
    this.minHp = 0;
    this.maxHp = 100;
    this.minRange = 0;
    this.maxRange = 500;
    this.minFireRate = 10;
    this.maxFireRate = 5000;
    this.minDamage = 0;
    this.maxDamage = 1000;
    this.minProjectileSpeed = 1;
    this.maxProjectileSpeed = 100;
    this.minProjectileRadius = 1;
    this.maxProjectileRadius = 100;
    this.setRadius(radius);
    this.setHp(hp);
    this.setMaxHp(maxHp);
    this.setRange(range);
    this.setFireRate(fireRate);
    this.setDamage(damage);
    this.setProjectileSpeed(projectileSpeed);
    this.setProjectileRadius(projectileRadius);
    this.lastFireTime = 0;
    this.target = target;
  }

  setRadius(value) {
    this.radius = Math.max(this.minRadius, Math.min(value, this.maxRadius));
  }

  setHp(value) {
    this.hp = Math.max(this.minHp, Math.min(value, this.maxHp));
  }

  setMaxHp(value) {
    this.maxHp = Math.max(this.minHp, Math.max(value, this.hp));
  }

  setRange(value) {
    this.range = Math.max(this.minRange, Math.min(value, this.maxRange));
  }

  setFireRate(value) {
    this.fireRate = Math.max(
      this.minFireRate,
      Math.min(value, this.maxFireRate)
    );
  }

  setDamage(value) {
    this.damage = Math.max(this.minDamage, Math.min(value, this.maxDamage));
  }

  setProjectileSpeed(value) {
    this.projectileSpeed = Math.max(
      this.minProjectileSpeed,
      Math.min(value, this.maxProjectileSpeed)
    );
  }

  setProjectileRadius(value) {
    this.projectileRadius = Math.max(
      this.minProjectileRadius,
      Math.min(value, this.maxProjectileRadius)
    );
  }

  addRadius(valueToAdd) {
    this.setRadius(this.radius + valueToAdd);
  }

  removeRadius(valueToRemove) {
    this.setRadius(this.radius - valueToRemove);
  }

  addHp(valueToAdd) {
    this.setHp(this.hp + valueToAdd);
  }

  removeHp(valueToRemove) {
    this.setHp(this.hp - valueToRemove);
  }

  addMaxHp(valueToAdd) {
    this.setMaxHp(this.maxHp + valueToAdd);
  }

  removeMaxHp(valueToRemove) {
    this.setMaxHp(this.maxHp - valueToRemove);
  }

  addRange(valueToAdd) {
    this.setRange(this.range + valueToAdd);
  }

  removeRange(valueToRemove) {
    this.setRange(this.range - valueToRemove);
  }
  // fireRate functions have been reversed so it makes more logical since. fireRate is in ms.
  removeFireRate(valueToAdd) {
    this.setFireRate(this.fireRate + valueToAdd);
  }

  addFireRate(valueToRemove) {
    this.setFireRate(this.fireRate - valueToRemove);
  }

  addDamage(valueToAdd) {
    this.setDamage(this.damage + valueToAdd);
  }

  removeDamage(valueToRemove) {
    this.setDamage(this.damage - valueToRemove);
  }

  addProjectileSpeed(valueToAdd) {
    const percentageToAdd = valueToAdd / 100;
    const speedToAdd = this.projectileSpeed * percentageToAdd;
    const newSpeed = this.projectileSpeed + speedToAdd;
    this.setProjectileSpeed(newSpeed);
  }

  // Add a function for removing projectileSpeed
  removeProjectileSpeed(valueToRemove) {
    this.setProjectileSpeed(this.projectileSpeed - valueToRemove);
  }

  // Add a function for adding projectileRadius
  addProjectileRadius(valueToAdd) {
    this.setProjectileRadius(this.projectileRadius + valueToAdd);
  }

  // Add a function for removing projectileRadius
  removeProjectileRadius(valueToRemove) {
    this.setProjectileRadius(this.projectileRadius - valueToRemove);
  }

  clicked(x, y) {
    let clicked = false;
    // Calculate the distance between the clicked position and the center of the tower
    const distance = Math.sqrt(
      Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
    );

    // Check if the clicked position is within the bounds of the tower
    if (distance <= this.radius) {
      clicked = true;
    }
    return clicked;
  }

  scanForEnemies(enemies) {
    let closestEnemy = null;
    let closestDistance = Infinity;

    for (const enemy of enemies) {
      const distance = Math.sqrt(
        Math.pow(this.x - enemy.x, 2) + Math.pow(this.y - enemy.y, 2)
      );

      if (distance < closestDistance && distance <= this.range) {
        closestEnemy = enemy;
        closestDistance = distance;
      }
    }

    this.target = closestEnemy;

    if (this.target) {
      this.fire();
      this.target = null;
    }
  }

  fire() {
    const currentTime = performance.now();
    const timeSinceLastFire = currentTime - this.lastFireTime;

    if (timeSinceLastFire >= this.fireRate) {
      const { x, y } = this.target;
      const deltaX = x - this.x;
      const deltaY = y - this.y;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      const projectileSpeed = this.projectileSpeed;
      const velocityX = (deltaX / distance) * projectileSpeed;
      const velocityY = (deltaY / distance) * projectileSpeed;

      spawnProjectile(this.x, this.y, velocityX, velocityY);
      soundEffects.pop.play();

      this.lastFireTime = currentTime;
    }
  }

  upgrade(type, multiplier = 1) {
    // Define the costs for each upgrade
    const costs = {
      health: 5 * multiplier,
      range: 5 * multiplier,
      firerate: 5 * multiplier,
      damage: 5 * multiplier,
      projectilespeed: 5 * multiplier,
      projectileradius: 5 * multiplier,
    };
    const addHpValue = 10 * multiplier;
    const addMaxHpValue = 10 * multiplier;
    const addRangeValue = 10 * multiplier;
    const addFireRateValue = 100 * multiplier;
    const addDamageValue = 1 * multiplier;
    const addProjectileSpeedValue = 1 * multiplier;
    const addProjectileRadiusValue = 1 * multiplier;

    function normalizeType(type) {
      return type.toLowerCase().replace(/\s+/g, "");
    }

    const normalizedType = normalizeType(type);

    // Check if there are enough points for the upgrade
    if (director.points >= costs[normalizedType]) {
      // Subtract the cost from the points
      director.points -= costs[normalizedType];

      // Implement the upgrade
      switch (normalizedType) {
        case "health":
          this.addMaxHp(addMaxHpValue);
          this.addHp(addHpValue);
          setDisplayMessage(`Health increased by ${addHpValue}`);
          break;
        case "range":
          this.addRange(addRangeValue);
          setDisplayMessage(`Range increased by ${addRangeValue}`);
          break;
        case "firerate":
          this.addFireRate(addFireRateValue);
          setDisplayMessage(`Fire rate increased by ${addFireRateValue}`);
          break;
        case "damage":
          this.addDamage(addDamageValue);
          setDisplayMessage(`Damage increased by ${addDamageValue}`);
          break;
        case "projectilespeed":
          this.addProjectileSpeed(addProjectileSpeedValue);
          setDisplayMessage(
            `Projectile speed increased by ${addProjectileSpeedValue}`
          );
          break;
        case "projectileradius":
          this.addProjectileRadius(addProjectileRadiusValue);
          setDisplayMessage(
            `Projectile radius increased by ${addProjectileRadiusValue}`
          );
          break;
      }
    } else if (director.points < costs[normalizedType]) {
      setDisplayMessage(`Not enough points! Needed: ${costs[normalizedType]}`);
    }
  }
}

export function createTower(
  x,
  y,
  radius = 25,
  hp = 100,
  maxHp = 100,
  range = 100,
  fireRate = 1000,
  damage = 1,
  projectileSpeed = 1,
  projectileRadius = 1,
  target = null
) {
  return new Tower(
    x,
    y,
    radius,
    hp,
    maxHp,
    range,
    fireRate,
    damage,
    projectileSpeed,
    projectileRadius,
    target
  );
}
