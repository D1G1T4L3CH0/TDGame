import { enemies } from "./enemy.js";
import { projectiles } from "./projectile.js";
import { canvas, ctx, frameCount, tower, player } from "./game.js";

export function playerTower() {
  const maxDashCount = Math.ceil(tower.maxHp); // Calculate the maximum number of dashes based on the tower's maximum HP
  const dashCount = Math.ceil(tower.hp); // Calculate the number of dashes based on the tower's current HP
  const dashLength = (Math.PI * 2) / maxDashCount; // Calculate the length of each dash based on the tower's maximum HP
  const gapLength = (Math.PI * 2 - dashLength * dashCount) / (dashCount - 1); // Calculate the length of each gap based on the number of dashes

  // Draw the tower's border with dashed lines
  ctx.beginPath();
  ctx.arc(tower.x, tower.y, tower.radius, 0, Math.PI * 2);
  ctx.strokeStyle = "#505050";
  ctx.lineWidth = 2;
  ctx.setLineDash([dashLength, gapLength]);
  ctx.lineDashOffset = -Math.PI / 2; // Start the dashes from the top
  ctx.stroke();
  ctx.closePath();

  // Draw the tower's range
  ctx.beginPath();
  ctx.arc(tower.x, tower.y, tower.range, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(0, 255, 0, 0.01)"; // Set the fill color with transparency
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 255, 0, 0.04)"; // Set the border color with transparency
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

export function allEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    const thisEnemy = enemies[i];
    ctx.beginPath();

    switch (thisEnemy.type) {
      case 0: // Circle
        ctx.arc(thisEnemy.x, thisEnemy.y, thisEnemy.radius, 0, Math.PI * 2);
        break;
      case 1: // Square
        ctx.rect(
          thisEnemy.x - thisEnemy.radius,
          thisEnemy.y - thisEnemy.radius,
          thisEnemy.radius * 2,
          thisEnemy.radius * 2
        );
        break;
      case 2: // Triangle
        ctx.moveTo(thisEnemy.x, thisEnemy.y - thisEnemy.radius);
        ctx.lineTo(
          thisEnemy.x - thisEnemy.radius,
          thisEnemy.y + thisEnemy.radius
        );
        ctx.lineTo(
          thisEnemy.x + thisEnemy.radius,
          thisEnemy.y + thisEnemy.radius
        );
        ctx.closePath();
        break;
      case 3: // Star
        const starAngle = (Math.PI * 2) / 10;
        ctx.moveTo(thisEnemy.x + thisEnemy.radius, thisEnemy.y);
        for (let i = 1; i < 10; i++) {
          const angle = starAngle * i;
          const radius =
            i % 2 === 0 ? thisEnemy.radius : thisEnemy.radius * 0.5; // Alternating radius for the spikes
          const x = thisEnemy.x + radius * Math.cos(angle);
          const y = thisEnemy.y + radius * Math.sin(angle);
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        break;
      case 4: // Diamond
        ctx.moveTo(thisEnemy.x, thisEnemy.y - thisEnemy.radius);
        ctx.lineTo(thisEnemy.x + thisEnemy.radius, thisEnemy.y);
        ctx.lineTo(thisEnemy.x, thisEnemy.y + thisEnemy.radius);
        ctx.lineTo(thisEnemy.x - thisEnemy.radius, thisEnemy.y);
        ctx.closePath();
        break;
      case 5: // Half Circle
        ctx.arc(thisEnemy.x, thisEnemy.y, thisEnemy.radius, 0, Math.PI);
        break;
      default: // Default to a circle if the type is not recognized
        ctx.arc(thisEnemy.x, thisEnemy.y, thisEnemy.radius, 0, Math.PI * 2);
        break;
    }

    ctx.fillStyle = thisEnemy.color;
    ctx.fill();
  }
}

export function allProjectiles() {
  for (let i = 0; i < projectiles.length; i++) {
    const projectile = projectiles[i];
    // Destructure projectile object for easier access
    const { x, y, radius } = projectile;

    // Begin a new path
    ctx.beginPath();

    // Draw a circle with the specified x, y, radius, start angle, and end angle
    ctx.arc(x, y, radius, 0, Math.PI * 2);

    // Set the fill style
    ctx.fillStyle = "white";

    // Fill the circle with the fill style color
    ctx.fill();
  }
}

/**
 * Draws buttons on the canvas.
 * @param {Object} config - The configuration object for the buttons.
 */
export function buttons(config) {
  // Destructure the properties from the config object
  const { labels, width, height, spacing } = config;

  // Calculate the starting position of the buttons
  const startX =
    (canvas.width - labels.length * (width + spacing)) / 2;
  const startY = canvas.height - height - 10;

  // Iterate over the button labels and draw each button
  for (let i = 0; i < labels.length; i++) {
    const x = startX + i * (width + spacing);
    const y = startY;
    const label = labels[i];

    // Draw the button background
    ctx.fillStyle = "#CCCCCC";
    ctx.fillRect(x, y, width, height);

    // Draw the button label
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + width / 2, y + height / 2);
  }
}

export function stats(fps = 0) {
  const fillStyle = "grey";
  const font = "12px Arial";
  const x = 10;
  let y = 20;

  ctx.fillStyle = fillStyle;
  ctx.font = font;
  ctx.textAlign = "left";

  const frameText = `Frame Count: ${frameCount} | ${fps}fps`;
  const entitiesText = `Entities: Enemies - ${enemies.length}, Projectiles - ${projectiles.length}`;
  const towerText = `Tower Stats:`;
  const hpPercentage = Math.floor((tower.hp / tower.maxHp) * 100);
  const hpText = `  HP: ${Math.floor(tower.hp)} (${hpPercentage}%)`;
  const maxHpText = `  Max HP: ${Math.floor(tower.maxHp)}`;
  const radiusText = `  Radius: ${tower.radius}`;
  const rangeText = `  Range: ${tower.range}`;
  const fireRateText = `  Fire Rate: ${tower.fireRate}`;
  const damageText = `  Damage: ${tower.damage}`;
  const projectileSpeedText = `  Projectile Speed: ${tower.projectileSpeed}`;
  const projectileRadiusText = `  Projectile Radius: ${tower.projectileRadius}`;

  ctx.fillText(frameText, x, y);
  y += 20;
  ctx.fillText(entitiesText, x, y);
  y += 20;
  ctx.fillText(towerText, x, y);
  y += 20;
  ctx.fillText(hpText, x, y);
  y += 20;
  ctx.fillText(maxHpText, x, y);
  y += 20;
  ctx.fillText(radiusText, x, y);
  y += 20;
  ctx.fillText(rangeText, x, y);
  y += 20;
  ctx.fillText(fireRateText, x, y);
  y += 20;
  ctx.fillText(damageText, x, y);
  y += 20;
  ctx.fillText(projectileSpeedText, x, y);
  y += 20;
  ctx.fillText(projectileRadiusText, x, y);
}

// Display "Game Over" message
export function gameOverMessage() {
  // Set the background to black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set the text properties
  ctx.font = "50px Arial";
  ctx.fillStyle = "white"; // Change the fill color to white
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw "Game Over" in the center of the canvas
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
}

// draw the xp value at the top center of the screen with black bold font and size of 24.
export function playerPoints() {
  ctx.fillStyle = "white";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(player.points, canvas.width / 2, 24);
}
