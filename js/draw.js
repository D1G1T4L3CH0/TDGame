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

export function debugStats(fps = 0) {
  const fillStyle = "grey";
  const font = "12px Arial";
  const x = 10;
  let y = 20;

  // Round fps to the nearest whole number
  const roundedFps = Math.round(fps);

  const texts = [
    `Frame Rate: ${roundedFps}fps`,
    `Entities: Enemies - ${director.enemies.length}, Projectiles - ${projectiles.length}`,
  ];

  ctx.fillStyle = fillStyle;
  ctx.font = font;
  ctx.textAlign = "left";

  texts.forEach((text) => {
    ctx.fillText(text, x, y);
    y += 20;
  });
}

export function displayTowerProperties() {
  const fillStyle = "grey";
  const font = "12px Arial";
  const x = canvas.width / 2;
  const y = canvas.height - 30;
  const maxWidth = canvas.width - 20;
  const lineHeight = 20;

  const texts = [
    `Health: [ ${tower.hp.toFixed(2)} ]`,
    `Damage: [ ${tower.damage.toFixed(2)} ]`,
    `Range: [ ${tower.range.toFixed(2)} ]`,
    `Fire Rate: [ ${tower.fireRate.toFixed(2)} ]`,
    `Projectile Radius: [ ${tower.projectileRadius.toFixed(2)} ]`,
    `Projectile Speed: [ ${tower.projectileSpeed.toFixed(2)} ]`,
  ];

  ctx.fillStyle = fillStyle;
  ctx.font = font;
  ctx.textAlign = "center";

  const half = Math.ceil(texts.length / 2);
  const firstLineTexts = texts.slice(0, half);
  const secondLineTexts = texts.slice(half);
  const lines = [firstLineTexts, secondLineTexts];

  let posY = y;

  lines.forEach((lineTexts) => {
    let line = "";
    lineTexts.forEach((text, i) => {
      const spacer = i !== 0 ? "   " : ""; // Add extra spaces between properties
      const testLine = `${line}${spacer}${text}`;
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth) {
        console.warn("A tower property line is too long for the canvas width.");
      }

      line = testLine;
    });

    ctx.fillText(line, x, posY);
    posY += lineHeight;
  });
}

export function mainMenu(startButton) {
  let { startButtonX, startButtonY, startButtonWidth, startButtonHeight } =
    startButton;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the game title
  ctx.font = "40px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("TDGame", canvas.width / 2, canvas.height / 2 - 50);

  // Draw the start button
  ctx.fillStyle = "green";
  ctx.fillRect(startButtonX, startButtonY, startButtonWidth, startButtonHeight);
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Start", canvas.width / 2, canvas.height / 2 + 40);

  // Draw the keyboard hotkeys
  ctx.font = "15px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillText("1: Spawn BasicEnemy", 10, canvas.height - 210);
  ctx.fillText("2: Spawn FastEnemy", 10, canvas.height - 195);
  ctx.fillText("3: Spawn HeavyEnemy", 10, canvas.height - 180);
  ctx.fillText("4: Spawn PowerfulEnemy", 10, canvas.height - 165);
  ctx.fillText("5: Spawn CunningEnemy", 10, canvas.height - 150);
  ctx.fillText("H: Upgrade Health", 10, canvas.height - 135);
  ctx.fillText("R: Upgrade Range", 10, canvas.height - 120);
  ctx.fillText("F: Upgrade Firerate", 10, canvas.height - 105);
  ctx.fillText("D: Upgrade Damage", 10, canvas.height - 90);
  ctx.fillText("S: Upgrade Projectile Speed", 10, canvas.height - 75);
  ctx.fillText("Space or Escape: Pause Game", 10, canvas.height - 60);
  ctx.fillText("Hold Shift: x2 Upgrade/Spawn", 10, canvas.height - 45);
  ctx.fillText("Hold Ctrl: x10 Upgrade/Spawn", 10, canvas.height - 30);
}

// Add a pause screen
export function pauseScreen(pauseButton) {
  let { buttonWidth, buttonHeight, buttonX, buttonY } = pauseButton;
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the "PAUSED" text
  ctx.font = "80px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2 - 50);

  ctx.fillStyle = "green";
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Resume", canvas.width / 2, buttonY + buttonHeight / 2 + 10);
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

