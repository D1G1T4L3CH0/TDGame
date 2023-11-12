import * as Draw from "./draw.js";
import { handleClick, showUpgradeOptions } from "./helpers.js";
import { createDirector } from "./director.js";
import { createTower } from "./tower.js";

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
export let tower = createTower(canvas.width / 2, canvas.height / 2);
export const director = createDirector();
let animationId;
export let gameState = "mainMenu";
let deltaTime = 0;
export let startButton = {
  x: canvas.width / 2 - 100,
  y: canvas.height / 2,
  width: 200,
  height: 80,
};
export let pauseButton = {
  x: canvas.width / 2 - 100,
  y: canvas.height / 2,
  width: 200,
  height: 80,
};

export const soundEffects = {
  bgMusic: new Audio(
    "./assets/sounds/699762__bloodpixelhero__game-music-loop-15.mp3"
  ),
  pop: new Audio("./assets/sounds/249564__surn_thing__singleshot.mp3"),
  spawn: new Audio("./assets/sounds/249553__surn_thing__britspawn.mp3"),
  bang: new Audio("./assets/sounds/249563__surn_thing__splosion.mp3"),
};

soundEffects.bgMusic.loop = true;
soundEffects.bgMusic.volume = 0.25;

canvas.addEventListener("click", handleClick);

export function startGame() {
  gameState = "playing";
  soundEffects.bgMusic.play();
  animationId = requestAnimationFrame(update);
}
function update(timestamp) {
  switch (gameState) {
    case "mainMenu":
      Draw.mainMenu(startButton);
      break;
    case "playing":
      draw();
      director.update(deltaTime);
      if (tower.hp <= 0) {
        gameState = "stopped";
      }
      animationId = requestAnimationFrame(update);
      break;
    case "paused":
      Draw.pauseScreen(pauseButton);
      break;
    case "stopped":
      endGame();
      break;
  }
}

// Start the game
update();

// Stop the game
function endGame() {
  // Display "Game Over" message
  Draw.gameOverMessage();
  Draw.debugStats();
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
  Draw.displayTowerProperties();
  Draw.playerPoints();
  Draw.debugStats();
  Draw.drawHealthBar();
  Draw.displayMessage();
  Draw.displayKills();
  Draw.drawSpawnButtons();
  if (showUpgradeOptions) {
    Draw.upgradeOptions();
  }
}
