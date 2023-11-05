import * as Enemy from "./enemy.js";
import * as Projectile from "./projectile.js";
import * as Draw from "./draw.js";

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
let animationId;
let gameOver;
let previousTime = 0;
export let frameCount = 0;
// Configuration object for the buttons
const buttonConfig = {
  labels: ["speed", "hp", "hp regen", "range", "damage", "fire rate"],
  width: 80,
  height: 30,
  spacing: 10,
  startX: null,
  startY: null,
};

//player class to keep track of points and upgrades.
class Player {
  constructor() {
    this.points = 0;
    this.upgrades = {
      // Add your upgrade properties here
    };
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

  // Add your upgrade methods here
}

export let player = new Player();

class Tower {
  constructor(
    x = canvas.width / 2,
    y = canvas.height / 2,
    radius = 25,
    hp = 100,
    maxHp = 100,
    range = 100,
    fireRate = 100,
    damage = 5,
    projectileSpeed = 1,
    projectileRadius = 1
  ) {
    this.x = x;
    this.y = y;
    this.minRadius = 10;
    this.maxRadius = 500;
    this.minHp = 0;
    this.maxHp = 100;
    this.minRange = 0;
    this.maxRange = 500;
    this.minFireRate = 50;
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
    this.setProjectileSpeed(this.projectileSpeed + valueToAdd);
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
}

export let tower = new Tower();

function update(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Draw.playerTower();
  Draw.buttons(buttonConfig);
  Draw.playerPoints();
  Draw.stats();
  Draw.allEnemies();
  Draw.allProjectiles();

  Enemy.update();

  for (let k = 0; k < Projectile.projectiles.length; k++) {
    const projectile = Projectile.projectiles[k];
    projectile.x += projectile.dx * projectile.speed;
    projectile.y += projectile.dy * projectile.speed;

    if (
      projectile.x < 0 ||
      projectile.y < 0 ||
      projectile.x > canvas.width ||
      projectile.y > canvas.height
    ) {
      Projectile.projectiles.splice(k, 1);
      continue;
    }
  }

  for (let l = 0; l < Enemy.enemies.length; l++) {
    const enemy = Enemy.enemies[l];
    const dx = tower.x - enemy.x;
    const dy = tower.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const currentTime = timestamp || performance.now(); // For compatibility

    if (
      distance <= tower.range &&
      currentTime - tower.lastFireTime >= tower.fireRate
    ) {
      const directionX = dx / distance;
      const directionY = dy / distance;
      Projectile.spawn(tower.x, tower.y, -directionX, -directionY);
      tower.lastFireTime = currentTime;
    }
  }

  if (frameCount % 100 === 0) {
    Enemy.spawn();
  }

  if (tower.hp <= 0) {
    endGame();
  }

  frameCount++;
  if (!gameOver) {
    animationId = requestAnimationFrame(update);
  }
}

// Start the game
update();

/**
 * Check collision between two circles.
 * @param {Object} entity1 - The first circle entity.
 * @param {Object} entity2 - The second circle entity.
 * @returns {boolean} - True if there is a collision, false otherwise.
 */
export function checkCollision(entity1, entity2) {
  // Calculate the distance between the two entities
  const xDistance = entity1.x - entity2.x;
  const yDistance = entity1.y - entity2.y;
  const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2);

  // Check if the distance is less than or equal to the sum of the radii
  return distance <= entity1.radius + entity2.radius;
}

// Stop the game
function endGame() {
  // Display "Game Over" message
  Draw.gameOverMessage();
  Draw.stats();
  // Cancel the animation frame to stop the game loop
  gameOver = true;
  cancelAnimationFrame(animationId);
}

// Assuming you have a function called resetGame that resets the game state
document.getElementById("resetButton").addEventListener("click", resetGame);

function resetGame() {
  // Reset the game state here. later i need to do a proper reset possibly with keeping high score and upgrades
  location.reload();
}

//// BUTTONS BEGIN ////
// Add an event listener to the canvas element
canvas.addEventListener("click", handleClick);

// Function to handle the click event
function handleClick(event) {
  // Get the mouse position relative to the canvas element
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Calculate the starting position of the buttons if not already calculated
  if (buttonConfig.startX === null) {
    buttonConfig.startX =
      (canvas.width -
        buttonConfig.labels.length *
          (buttonConfig.width + buttonConfig.spacing)) /
      2;
    buttonConfig.startY = canvas.height - buttonConfig.height - 10;
  }

  // Iterate over the button labels and check if the click event occurred within a button
  for (let i = 0; i < buttonConfig.labels.length; i++) {
    const x = buttonConfig.startX + i * (buttonConfig.width + buttonConfig.spacing);
    const y = buttonConfig.startY;

    // Check if the click event occurred within the bounds of the current button
    if (
      mouseX >= x &&
      mouseX <= x + buttonConfig.width &&
      mouseY >= y &&
      mouseY <= y + buttonConfig.height
    ) {
      // Handle the button click based on its label
      const label = buttonConfig.labels[i];
      handleButtonClick(label);
      break; // Exit the loop since we found the clicked button
    }
  }
}

// Function to handle the button click
function handleButtonClick(label) {
  // Handle the button click based on its label
  switch (label) {
    case "speed":
      // add 1 to projectile speed
      tower.addProjectileSpeed(1);
      break;
    case "hp":
      // add 1 to tower hp
      tower.addMaxHp(1);
      break;
    case "hp regen":
      // add 1 to tower hp regen
      //TODO
      break;
    case "range":
      // add 1 to tower range
      tower.addRange(1);
      break;
    case "damage":
      // add 1 to tower damage
      tower.addDamage(1);
      break;
    case "fire rate":
      // add 1 to tower fire rate
      tower.addFireRate(1);
      break;
    default:
      // do nothing
      break;
  }
}
//// Buttons END ////
