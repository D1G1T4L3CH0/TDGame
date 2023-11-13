import * as Draw from "./draw.js";
import { handleClick, showUpgradeOptions } from "./helpers.js";
import { createDirector } from "./director.js";
import { createTower } from "./tower.js";
import { spawnButtons, upgradeButtons } from "./buttons.js";

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

const frameTimes = [];
let lastTimestamp = performance.now();
const maxFrameTimes = 30;
let frameRate = 0;

function calculateSmoothedFramerate(timestamp) {
  const frameTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  frameTimes.push(frameTime);

  if (frameTimes.length > maxFrameTimes) {
      frameTimes.shift();
  }

  const averageFrameTime = frameTimes.reduce((total, t) => total + t, 0) / frameTimes.length;
  const frameRate = 1000 / averageFrameTime;

  return frameRate;
}

function update(timestamp) {
  frameRate = calculateSmoothedFramerate(timestamp);
  switch (gameState) {
    case "mainMenu":
      Draw.mainMenu(startButton);
      break;
    case "playing":
      draw(frameRate);
      director.update();
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

function draw(frameRate) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Draw.playerTower();
  Draw.displayTowerProperties();
  Draw.playerPoints();
  Draw.debugStats(frameRate);
  Draw.drawHealthBar();
  Draw.displayMessage();
  Draw.displayKills();
  //Draw.drawSpawnButtons();
  if (showUpgradeOptions) {
  }
  upgradeButtons.draw();
  spawnButtons.draw();
}

let keyConfig = {
  h: "health",
  r: "range",
  f: "firerate",
  d: "damage",
  s: "projectilespeed",
  1: "BasicEnemy",
  2: "FastEnemy",
  3: "HeavyEnemy",
  4: "PowerfulEnemy",
  5: "CunningEnemy",
  " ": "pause",
  Escape: "pause",
};

let keyState = {};
let keyInterval = {};
let interval = 200;
let multiplier = 1;

function performAction(keyAction, multiplier) {
  switch (keyAction) {
    case "health":
    case "range":
    case "firerate":
    case "damage":
    case "projectilespeed":
      tower.upgrade(keyAction, multiplier);
      break;
    case "BasicEnemy":
    case "FastEnemy":
    case "HeavyEnemy":
    case "PowerfulEnemy":
    case "CunningEnemy":
      director.spawnEnemy(keyAction, multiplier);
      break;
    default:
  }
}

window.addEventListener("keydown", function (event) {
  let keyAction = keyConfig[event.key];
  if (keyAction && !keyState[keyAction]) {
    keyState[keyAction] = true;
    if (event.shiftKey) {
      multiplier = 2;
    } else if (event.ctrlKey) {
      multiplier = 10;
    }
    event.preventDefault();
    // Perform the action immediately
    performAction(keyAction, multiplier);
    // Start repeating the action every interval ms
    keyInterval[keyAction] = setInterval(
      performAction.bind(null, keyAction, multiplier),
      interval
    );
  }
});

window.addEventListener("keyup", function (event) {
  let keyAction = keyConfig[event.key];
  if (keyAction) {
    keyState[keyAction] = false;
    // Stop repeating the action
    clearInterval(keyInterval[keyAction]);
  }
  // Check if the released key is Control or Shift and reset the multiplier if it is
  if (event.key === "Control" || event.key === "Shift") {
    multiplier = 1;
  }
});
