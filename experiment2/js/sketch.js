// sketch.js - draw all leaves to screen and animate them
// Author: Cody Karigaca
// Date:1/16/2024


//gloabal variables
let leaves = [];
let windStreaks = []; // Array to hold wind streak particles
let canvasContainer;
let mapleLeaf;
let mapleLeafBackground;  // Background image for the leaf\\
let mapleLeaf2; // Second leaf image
let greenLeaf;
let smallSize = 50;
let largeSize = 100;
let numberOfLeaves = 15;
//global wind variables
let windX = 0;
let windY = 0;
let globalWindForce;

function preload() {
  // Preload assets
  mapleLeaf = loadImage("assets/maple-leaf.png");
  mapleLeafBackground = loadImage("assets/maple-leaf-background.png");
  mapleLeaf2 = loadImage("assets/mapple-leaf-2.png");
  greenLeaf = loadImage("assets/green-leaf.png");

}

function setup() {
  // Select the container where the canvas will be placed
  canvasContainer = $("#canvas-container");

  // Create a canvas to match the container size
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  // Handle window resizing
  $(window).resize(function () {
    resizeScreen();
  });

  resizeScreen(); // Initial resize to set up the scene

  // Generate some leaves
  for (let i = 0; i < numberOfLeaves; i++) {
    leaves.push(new Leaf(random(width), random(-height, 0), random(smallSize, largeSize), mapleLeaf));
  }
  //generate some green leaves
  for (let i = 0; i < numberOfLeaves; i++) {
    leaves.push(new Leaf(random(width), random(-height, 0), random(smallSize, largeSize), mapleLeaf2));
  }
  // Generate some green leaves
  for (let i = 0; i < numberOfLeaves; i++) {
    leaves.push(new Leaf(random(width), random(-height, 0), random(smallSize, largeSize), greenLeaf));
  }

  globalWindForce = createVector(windX, windY);
  console.log("p5 version:", p5.prototype ? p5.prototype.VERSION : "p5 not loaded");
}

function draw() {
  background(200, 230, 255); // Light blue background

  //image(mapleLeafBackground, 0, 0, width, height); // Ensure it scales to canvas size

  // Display and animate leaves
  for (let leaf of leaves) {
    leaf.fall();
    leaf.display();
  }

  // Update and display wind streaks
  for (let i = windStreaks.length - 1; i >= 0; i--) {
    let streak = windStreaks[i];
    streak.update();
    streak.display();

    // Remove streaks that have faded out
    if (streak.isDead()) {
      windStreaks.splice(i, 1);
    }
  }
}
function mouseDragged() {

  globalWindForce = (createVector(mouseX - pmouseX, mouseY - pmouseY));

  // Add a new streak or update the last streak
  if (windStreaks.length === 0 || windStreaks[windStreaks.length - 1].isDead()) {
    // Create a new streak if none exist or the last streak has faded
    let streak = new WindStreak(mouseX, mouseY);
    windStreaks.push(streak);
  }

  // Add the current mouse position to the most recent streak
  windStreaks[windStreaks.length - 1].addPoint(mouseX, mouseY);
}

function mouseReleased() {
  //if the player isnt draggin the mouse anymore set it to 0
  globalWindForce = createVector(0, 0);
}

// Resize screen function
function resizeScreen() {
  centerHorz = canvasContainer.width() / 2;
  centerVert = canvasContainer.height() / 2;
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());

  // Adjust leaves for the new screen size
  for (let leaf of leaves) {
    leaf.x = random(width);
    leaf.y = random(-height, 0);
    leaf.size = random(smallSize, largeSize); // Optionally adjust the size
  }

  // Redraw background or static elements if needed
  background(200, 230, 255);
}

