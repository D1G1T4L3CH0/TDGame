import * as Draw from "./draw.js";
import { handleClick, showUpgradeOptions } from "./helpers.js";
import { createDirector } from "./director.js";
import { createTower } from "./tower.js";

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
export let tower = createTower(canvas.width / 2, canvas.height / 2);
export const director = createDirector();
let animationId;
let gameState = "playing";
let lastTimestamp = performance.now();
let deltaTime = 0;

canvas.addEventListener("click", handleClick);

function update(timestamp) {
  draw();

  director.update(deltaTime);

  deltaTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  switch (gameState) {
    case "playing":
      animationId = requestAnimationFrame(update);
      break;
    case "stopped":
      endGame();
      break;
    case "paused":
      break;
  }
  if (tower.hp <= 0) {
    gameState = "stopped";
  }
}

// Start the game
update();

// Stop the game
function endGame() {
  // Display "Game Over" message
  Draw.gameOverMessage();
  Draw.stats();
  // Cancel the animation frame to stop the game loop
  gameState = "stopped";
  cancelAnimationFrame(animationId);
}

document.getElementById("resetButton").addEventListener("click", resetGame);

function resetGame() {
  // Reset the game state here. later i need to do a proper reset possibly with keeping high score and upgrades
  location.reload();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Draw.playerTower();
  Draw.playerPoints();
  Draw.stats();
  Draw.drawHealthBar();
  Draw.displayMessage();
  Draw.displayKills();
  Draw.drawSpawnButtons();
  if (showUpgradeOptions) {
    Draw.upgradeOptions();
  }
}
