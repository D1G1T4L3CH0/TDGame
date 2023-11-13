import { canvas, ctx, director } from "./game.js";
import { tower } from "./game.js";

class Buttons {
  constructor(buttonType) {
    this.list = [];
    this.buttonType = buttonType;
  }

  addButton(button) {
    this.list.push(button);
  }

  draw() {
    this.list.forEach((button, index) => {
      button.draw(this.buttonType, index);
    });
  }
}

function createButtons(buttonType) {
  return new Buttons(buttonType);
}

class Button {
  constructor(x, y, width, height, label) {
    this.setVariables(x, y, width, height, label);
  }

  setVariables(x, y, width, height, label) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
  }

  isClicked(x, y) {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  onClick(type) {
    switch (type) {
      case "spawn":
        this.spawn();
        break;
      case "upgrade":
        this.upgrade();
        break;
      default:
        // do something
        break;
    }
  }

  spawn() {
    director.spawnEnemy(this.label + "Enemy");
  }

  upgrade() {
    // if this.label matches any of the strings in upgradeButtonTexts execute the tower method for completing that action
    if (upgradeButtonTexts.includes(this.label)) {
      tower.upgrade(this.label);
    }
  }

  draw(buttonType, index) {
    switch (buttonType) {
      case "upgrade":
        this.drawUpgradeButton(index);
        break;
      case "spawn":
        this.drawSpawnButton(index);
        break;
      // Add more cases for other button types
      default:
        // Draw default button UI here
        break;
    }
  }
  drawSpawnButton(index) {
    const buttonFillStyle = "rgba(0, 0, 128, 0.25)";
    const buttonTextColor = "rgba(255, 255, 255, 0.5)";
    const buttonFont = "bold 10px Arial";
    const rightMargin = 10; // adjust for the desired right margin
    const numButtons = spawnButtons.list.length;
    const gap = 6; // adjust for the desired gap between buttons

    // assuming canvas and ctx are globally accessible
    // calculate new x position
    const newX = canvas.width - this.width - rightMargin;

    // calculate total height of all buttons plus gaps
    const totalHeight = this.height * numButtons + gap * (numButtons - 1);

    // calculate new y position
    const newY =
      (canvas.height - totalHeight) / 2 + (this.height + gap) * index;

    // Set the variables of this
    this.setVariables(newX, newY, this.width, this.height, this.label);

    ctx.fillStyle = buttonFillStyle;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = buttonTextColor;
    ctx.font = buttonFont;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.label, this.x + this.width / 2, this.y + this.height / 2);
  }

  drawUpgradeButton(index) {
    const buttonFillStyle = "rgba(0, 100, 0, 0.25)"; // dark army green with opacity of 0.25
    const buttonTextColor = "rgba(255, 255, 255, 0.75)"; // white with opacity of 0.75
    const buttonFont = "bold 10px Arial";
    const leftMargin = 10; // adjust for the desired left margin
    const numButtons = upgradeButtons.list.length;
    const gap = 6; // adjust for the desired gap between buttons

    // calculate total height of all buttons plus gaps
    const totalHeight = this.height * numButtons + gap * (numButtons - 1);

    // calculate new x and y positions
    const newX = leftMargin;
    const newY =
      (canvas.height - totalHeight) / 2 + (this.height + gap) * index;

    // Set the variables of this
    this.setVariables(newX, newY, this.width, this.height, this.label);

    ctx.fillStyle = buttonFillStyle;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = buttonTextColor;
    ctx.font = buttonFont;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.label, this.x + this.width / 2, this.y + this.height / 2);
}
}

function createButton(x, y, width, height, label) {
  return new Button(x, y, width, height, label);
}

export let upgradeButtons = createButtons("upgrade");
export let spawnButtons = createButtons("spawn");

const upgradeButtonTexts = [
  "Health",
  "Range",
  "Fire Rate",
  "Damage",
  "Projectile Speed",
  "Projectile Radius",
];

const spawnButtonTexts = ["Basic", "Fast", "Heavy", "Powerful", "Cunning"];

upgradeButtonTexts.forEach((text, index) => {
  const button = createButton(10, 10 + index * 20, 100, 20, text);
  upgradeButtons.addButton(button);
});

spawnButtonTexts.forEach((text, index) => {
  const button = createButton(10, 10 + index * 20, 100, 20, text);
  spawnButtons.addButton(button);
});
