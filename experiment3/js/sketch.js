// sketch.js - purpose and description here
// Author: Cody karigaca
// Date: 1/23/

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Globals Variables
//canvas variables
let canvasContainer;
var centerHorz, centerVert;

//particles
let particles = []; // Store particles
let TEAM_COLORS;
let font;
let textPoints = []; // Points for the current letter
let inputText = '';
let fontSize = 200; // Font size

function preload() {
  TEAM_COLORS = [
    color(0, 51, 153), // Blue
    color(189, 32, 49), // Red
  ];

  // Load font
  font = loadFont('assets/SMESH.ttf');
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  $(window).resize(function () {
    console.log("Resizing...");
    resizeScreen();
  });
  resizeScreen();



  // Generate particles and text points
  generateTextPoints(inputText);
  createParticles();

}

function draw() {
  background(203, 195, 227); // Light blue background

  // Display and update particles
  // Update and display particles
  for (let particle of particles) {
    particle.checkScatter(); // Check for mouse scattering
    particle.behavior(); // Attract to target
    particle.move(); // Move particle
    particle.display(); // Display particle
  }
}

function generateTextPoints(text) {
  textPoints = []; // Clear existing points
  let xOffset = 50; // Spacing from the left edge
  let yOffset = fontSize; // Start slightly below the top edge
  let lineHeight = fontSize + 20; // Vertical spacing between lines

  for (let i = 0; i < text.length; i++) {
    let letter = text[i];
    let letterWidth = font.textBounds(letter, 0, 0, fontSize).w;

    // Check if the letter would exceed the canvas width
    if (xOffset + letterWidth > width) {
      xOffset = 50; // Move to the start of the next line
      yOffset += lineHeight; // Move down by one line
    }

    // Generate points for the letter
    let points = font.textToPoints(
      letter,
      xOffset,
      yOffset,
      fontSize,
      { sampleFactor: 0.2 } // Density of points
    );

    // Add points for this letter
    textPoints = textPoints.concat(points);

    // Update xOffset for the next letter
    xOffset += letterWidth + 50; // Add letter width and spacing
  }
}

// Create particles for each point in the letter
function createParticles() {
  particles = []; // Clear existing particles
  for (let pt of textPoints) {
    particles.push(new Particle(random(width), random(height), pt.x, pt.y));
  }
}

// Change the letter when a key is pressed
function keyPressed() {
  if (key.length === 1) {
    inputText += key.toUpperCase(); // Add the pressed key to the text
    generateTextPoints(inputText); // Generate new points
    createParticles(); // Recreate particles
  } else if (keyCode === BACKSPACE || keyCode === DELETE) {
    inputText = inputText.slice(0, -1); // Remove the last character
    generateTextPoints(inputText); // Generate new points
    createParticles(); // Recreate particles
  } else if (keyCode === UP_ARROW) {
    fontSize = constrain(fontSize + 10, 50, 500); // Increase font size, max 500
    generateTextPoints(inputText);
    createParticles();
  } else if (keyCode === DOWN_ARROW) {
    fontSize = constrain(fontSize - 10, 50, 500); // Decrease font size, min 50
    generateTextPoints(inputText);
    createParticles();
  }
}
function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  generateTextPoints(inputText); // Regenerate text points for the new canvas size
  createParticles(); // Recreate particles
}
