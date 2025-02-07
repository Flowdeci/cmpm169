// sketch.js - Render the 3d cube
// Author: Cody Karigaca
// Date: 2/7/2025

// Globals
let canvasContainer;
let centerHorz, centerVert;

let cubeSize;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

// setup() function is called once when the program starts
function setup() {
  // Place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL); // add WEBGL mode for 3D
  canvas.parent("canvas-container");

  // Resize canvas when the page is resized
  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();

  cubeSize = 150;
  cube1 = new cube(0, 0, cubeSize);

}

function draw() {
  background(220);

  cube1.display(cubeSize);
}


function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    cubeSize -= 5;
  } else if (keyCode === RIGHT_ARROW) {
    cubeSize += 5;
  }
}

