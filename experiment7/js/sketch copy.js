// sketch.js - a kaleidoscope that responds to sound.
// Author: Cody Karigaca
// Date:2/14/20255

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

let mic; // microphone input
let centerHorz, centerVert;
let canvasContainer;
let kaleidoscope;
let rings = [];
let colorOffset = 0;
const numRings = 10;


function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());

  if (kaleidoscope) {
    //Update the kalidescope center with the new canvas size
    kaleidoscope.x = centerHorz;
    kaleidoscope.y = centerVert;
  }
}

// setup() function is called once when the program starts
function setup() {
  // Place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  // Initialize the microphone input
  mic = new p5.AudioIn();
  mic.start();

  // Resize canvas if the page is resized
  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();


  colorMode(HSB, 360, 100, 100);
  noFill();

  // Initialize rings
  for (let i = 0; i < numRings; i++) {
    rings.push({
      baseSize: i * 50 + 50, 
      dynamicSize: i * 50 + 50, 
      color: color((i * 36) % 360, 80, 100), 
      thickness: map(i, 0, numRings - 1, 2, 10), 
    });
  }
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  // Get the microphone input level (volume)
  let micLevel = mic.getLevel();

  // Map mic level to rectangle size
  letterSize = map(micLevel, 0, 1, 40, 70);
  ringSize = map(micLevel, 0, 1, 0, 400);
  let pulseAmplitude = map(micLevel, 0, 1, 0, 50);
  let dynamicBrightness = map(micLevel, 0, 1, 50, 100);

  background(0, 100);

  if (micLevel > 0.02) {
    //create rings when mic input
    rings.push({
      x: width / 2,
      y: height / 2,
      baseSize: ringSize,//Initial size
      size: ringSize,//size that changes
      alpha: 255,
      color: color((colorOffset + frameCount) % 360, 80, 100),
      thickness: map(micLevel, 0, 1, 2, 50),
      growthSpeed: map(micLevel, 0, 1, 1, 10),
      brightness: map(micLevel, 0, 1, 50, 100),
    })
  }

  //Draw and update rings
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    
    //Update the ring size based on the mic level
    ring.size = ring.size + sin(frameCount * 0.1) * pulseAmplitude;

    // Update brightness dynamically
    
    ring.brightness = dynamicBrightness;

    //Outer Ring with brightness and alpha
    stroke(ring.color.levels[0], ring.brightness, ring.color.levels[2], ring.alpha);
    strokeWeight(ring.thickness);
    ellipse(ring.x, ring.y, ring.size);

    // Inner black ring
    fill(0);
    noStroke();
    ellipse(ring.x, ring.y, ring.size - ring.thickness * 2);

    ring.size += ring.growthSpeed;//Rings grow over time
    ring.alpha -= 1.5;//fades out over time

    if (ring.alpha <= 0) {
      rings.splice(i, 1);
      i--;
    }


  }


  colorOffset += 0.5;

  noStroke();
  fill(255);
  textSize(20);
  text(`Mic Level ${micLevel.toFixed(2)}`, 0, 20);



}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  // Code to run when mouse is pressed
}