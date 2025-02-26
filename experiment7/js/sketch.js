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
const numRings = 9;
let easingFactor = 0.1;


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
  let growthFactor = map(micLevel, 0, 1, -10, 200)

  background(color((frameCount * 0.1) % 360, 100, (frameCount * 0.1) %  360));
  



  for (let i = rings.length -1; i >= 0; i--) {
    let ring = rings[i];

    // Update the size based on mic input
    let targetSize = map(micLevel, 0, 0.1, 10, ring.baseSize);
    ring.dynamicSize += (targetSize - ring.dynamicSize) * easingFactor;

    //Add a small pulsing effect
    ring.dynamicSize += sin(frameCount * 0.1) * 0.5;
   
    ring.thickness = map(micLevel, 0, 1, 2, 20);

    // Draw the ring
    strokeWeight(ring.thickness);
    stroke(ring.color);
    ellipse(width / 2, height / 2, ring.dynamicSize);

    // Inner black ring
    noStroke();
    fill(color((frameCount * 0.1) % 360, 100, (frameCount * 0.1) %  360));
    ellipse(width / 2, height / 2, ring.dynamicSize - ring.thickness);
  }


  colorOffset += 0.5;

  noStroke();
  fill(255);
  textSize(20);
  text(`Mic Level ${micLevel.toFixed(2)}`, 0, 20);



}

