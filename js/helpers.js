import {
  canvas,
  tower,
  director,
  gameState,
  startButton,
  pauseButton,
  startGame,
} from "./game.js";
import { spawnButtons } from "./draw.js";
export let showUpgradeOptions = false;

export let spawning = false; // Add a flag for tracking if a spawn is in progress

export function handleClick(event) {
  const { clientX, clientY } = event;
  const { left, top } = canvas.getBoundingClientRect();
  const clickedX = clientX - left;
  const clickedY = clientY - top;

  showUpgradeOptions = tower.clicked(clickedX, clickedY)
    ? !showUpgradeOptions
    : false;

  for (const button of spawnButtons) {
    const [type, buttonX, buttonY, buttonWidth, buttonHeight] = button;

    if (
      clickedX >= buttonX &&
      clickedX <= buttonX + buttonWidth &&
      clickedY >= buttonY &&
      clickedY <= buttonY + buttonHeight &&
      !spawning
    ) {
      spawning = true;
      director.spawnEnemy(type);
      setTimeout(() => {
        spawning = false;
      }, 50);
    }
  }

  if (gameState === "mainMenu") {
    const { x, y, width, height } = startButton;
    if (
      clickedX >= x &&
      clickedX <= x + width &&
      clickedY >= y &&
      clickedY <= y + height
    ) {
      startGame();
    }
  }
}

/**
 * Check collision between two entities.
 * @param {Object} entity1 - The first entity.
 * @param {Object} entity2 - The second entity.
 * @returns {boolean} - True if there is a collision, false otherwise.
 */
export function checkCollision(entity1, entity2) {
  const calculateDistance = (x1, y1, x2, y2) => {
    const xDistance = x1 - x2;
    const yDistance = y1 - y2;
    return Math.sqrt(xDistance ** 2 + yDistance ** 2);
  };

  if ("radius" in entity1 && "radius" in entity2) {
    return (
      calculateDistance(entity1.x, entity1.y, entity2.x, entity2.y) <=
      entity1.radius + entity2.radius
    );
  }

  if (
    "width" in entity1 &&
    "height" in entity1 &&
    "width" in entity2 &&
    "height" in entity2
  ) {
    const xDistance = Math.abs(entity1.x - entity2.x);
    const yDistance = Math.abs(entity1.y - entity2.y);
    return (
      Math.max(xDistance, yDistance) <=
      Math.max(entity1.width, entity1.height) +
        Math.max(entity2.width, entity2.height)
    );
  }

  const xDistance = Math.abs(entity1.x - entity2.x);
  const yDistance = Math.abs(entity1.y - entity2.y);
  const cornerDistance = calculateDistance(
    entity1.x,
    entity1.y,
    entity2.x,
    entity2.y
  );
  return (
    Math.max(cornerDistance, xDistance, yDistance) <=
    Math.max(entity1.radius, Math.max(entity2.width, entity2.height))
  );
}
