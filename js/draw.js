import { canvas, ctx, tower, director } from "./game.js";
import { projectiles } from "./director.js";


let messageText = null;
let messageTime = null;

// Add a function to draw the health meter

export function playerTower() {
  drawTowerBorder();
  drawTowerRange();
}

function drawTowerBorder() {
  ctx.beginPath();
  ctx.arc(tower.x, tower.y, tower.radius, 0, Math.PI * 2);
  ctx.strokeStyle = "#505050";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.closePath();
}

function drawTowerRange() {
  ctx.beginPath();
  ctx.arc(tower.x, tower.y, tower.range, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(0, 255, 0, 0.01)";
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 255, 0, 0.04)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

export function setDisplayMessage(text) {
  messageText = text;
  messageTime = performance.now();
}

export function displayMessage() {
  if (!messageText) {
    return;
  }

  const fadeOutTime = 2000;
  const elapsedTime = performance.now() - messageTime;

  if (elapsedTime >= fadeOutTime) {
    messageText = null;
    return;
  }

  const alpha = 1 - elapsedTime / fadeOutTime;
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.font = "20px Arial";
  ctx.textAlign = "center";

  const posX = canvas.width / 2;
  let posY = canvas.height - 50;
  const maxWidth = canvas.width - 20;
  const lineHeight = 20;
  const words = messageText.split(" ");

  ctx.save(); // Save the current state of the canvas
  ctx.globalAlpha = alpha; // Set the global alpha value for the text

  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = `${line}${words[n]} `;
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, posX, posY);
      line = `${words[n]} `;
      posY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, posX, posY);

  ctx.restore(); // Restore the saved state of the canvas
}

export function stats(fps = 0) {
  const fillStyle = "grey";
  const font = "12px Arial";
  const x = 10;
  let y = 20;

  const texts = [
    `Frame Rate: ${fps}fps`,
    `Entities: Enemies - ${director.enemies.length}, Projectiles - ${projectiles.length}`,
    "Tower Stats:",
    `  HP: ${Math.floor(tower.hp)} (${Math.floor(
      (tower.hp / tower.maxHp) * 100
    )}%)`,
    `  Max HP: ${Math.floor(tower.maxHp)}`,
    `  Radius: ${tower.radius}`,
    `  Range: ${tower.range}`,
    `  Fire Rate: ${tower.fireRate}`,
    `  Damage: ${tower.damage}`,
    `  Projectile Speed: ${tower.projectileSpeed}`,
    `  Projectile Radius: ${tower.projectileRadius}`,
  ];

  ctx.fillStyle = fillStyle;
  ctx.font = font;
  ctx.textAlign = "left";

  texts.forEach((text) => {
    ctx.fillText(text, x, y);
    y += 20;
  });
}

// Display "Game Over" message
export function gameOverMessage() {
  // Set the background to black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set the text properties
  ctx.font = "50px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw "Game Over" in the center of the canvas
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  ctx.fillText("Game Over", x, y);
}

// draw the xp value at the top center of the screen with black bold font and size of 24.
export function playerPoints() {
  const x = canvas.width / 2;
  const y = 24;
  const color = "white";
  const font = "bold 24px Arial";
  const align = "center";

  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(director.points, x, y);
}

export function upgradeOptions() {
  const buttonTexts = ["Health", "Range", "Fire Rate", "Damage"];
  const buttonHeight = 20;
  const buttonSpacing = 5;
  const buffer = 50;

  const longestButtonText = buttonTexts.reduce((longest, text) => {
    return text.length > longest.length ? text : longest;
  }, "");

  const buttonWidth = ctx.measureText(longestButtonText).width + 20;
  const buttonX = tower.x - buttonWidth - buttonSpacing - tower.radius - buffer;
  const buttonY = tower.y - tower.radius - buttonHeight / 2;

  const drawButton = (text, x, y) => {
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(x, y, buttonWidth, buttonHeight);
    ctx.fillStyle = "rgba(10, 10, 10, 20.5)";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + buttonWidth / 2, y + buttonHeight / 2);
  };

  const numButtons = buttonTexts.length;
  const buttonYIncrement = buttonHeight + buttonSpacing;

  const numButtonsLeft = Math.ceil(numButtons / 2); // Use Math.ceil instead of Math.floor to always round up

  for (let i = 0; i < numButtonsLeft; i++) {
    const text = buttonTexts[i];
    const y = buttonY + i * buttonYIncrement;
    drawButton(text, buttonX, y);
  }

  for (let i = numButtonsLeft; i < numButtons; i++) {
    const text = buttonTexts[i];
    const y = buttonY + (i - numButtonsLeft) * buttonYIncrement;
    drawButton(text, tower.x + tower.radius + buttonSpacing + buffer, y);
  }
}

export function drawHealthBar() {
  const radius = tower.radius - 5;
  const x = tower.x;
  const y = tower.y;
  const maxHealth = tower.maxHp;
  const currentHealth = tower.hp;

  const startAngle = (Math.PI * 4) / 2;
  const endAngle = startAngle - (Math.PI * currentHealth) / maxHealth;

  ctx.strokeStyle = "green";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle, true);
  ctx.stroke();
}

export function displayKills() {
  const kills = director.getKills();
  const x = tower.x;
  const y = tower.y;

  ctx.font = "10px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText(kills, x, y);
}

export let spawnButtons = [];

export function drawSpawnButtons() {
  const buttonSpacing = 5;
  const buffer = 16;
  const buttonTexts = [
    "BasicEnemy",
    "FastEnemy",
    "HeavyEnemy",
    "PowerfulEnemy",
    "CunningEnemy",
  ];
  const buttonWidth = 85;
  const buttonHeight = 25;
  const buttonYIncrement = buttonHeight + 10;

  const buttonX = canvas.width - buttonWidth - buttonSpacing - buffer;
  const buttonY = 265;

  spawnButtons = buttonTexts.map((text, i) => {
    const y = buttonY + i * buttonYIncrement;
    return [text, buttonX, y, buttonWidth, buttonHeight];
  });

  spawnButtons.forEach((button) => {
    drawButton(...button);
  });
}

function drawButton(text, x, y, buttonWidth, buttonHeight) {
  const buttonFillStyle = "rgba(0, 0, 64, 0.10)";
  const buttonTextColor = "rgba(255, 255, 255, 0.45)";
  const buttonFont = "bold 10px Arial";

  ctx.fillStyle = buttonFillStyle;
  ctx.fillRect(x, y, buttonWidth, buttonHeight);

  ctx.fillStyle = buttonTextColor;
  ctx.font = buttonFont;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + buttonWidth / 2, y + buttonHeight / 2);
}
