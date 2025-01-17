// sketch.js - draw all leaves to screen and animate them
// Author: Cody Karigaca
// Date:1/16/2024


//gloabal variables
let leaves = [];
let canvasContainer;
let mapleLeaf;
let smallSize = 50;
let largeSize = 100;

//global wind variables
let windX = 0;
let windY = 0;
let globalWindForce;

function preload() {
  // Preload assets
  mapleLeaf = loadImage("assets/maple-leaf.png");
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
  for (let i = 0; i < 10; i++) {
    leaves.push(new Leaf(random(width), random(-height, 0), random(smallSize, largeSize)));
  }

  globalWindForce=createVector(windX, windY);
}

function draw() {
  background(200, 230, 255); // Sky color
  console.log(globalWindForce);
  // Display and animate leaves
  for (let leaf of leaves) {
    leaf.fall();
    leaf.display();
  }
}

function mouseDragged(){
  globalWindForce = createVector(mouseX - pmouseX, mouseY - pmouseY);
}

function mouseReleased(){
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

