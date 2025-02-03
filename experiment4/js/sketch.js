// sketch.js - purpose and description here
// Author: Cody Karigaca
// Date:2/1/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

let canvasContainer;
var centerHorz, centerVert;

let SOIL_TOP//height of the green soil
let plants = []
let waterParticles = []
let currentMode = "wind";


//Wind Force variables
let windForce = 0; // User-controlled wind force
let windAcceleration = 0.001; // acceleration of wind when holding a key
let isHoldingLeft = false;
let isHoldingRight = false;

// Day-Night Cycle Variables
let dayDuration = 20000; //time of a full cycle in mileseconds
let cycleStartTime = 0;
let elapsedTime;
let cycleProgress;
let phase;
let backgroundColor;
let celestialX;
let celestialY;
let celestialColor;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
  SOIL_TOP = height * 0.8
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();


  SOIL_TOP = height * 0.8

  //Start the day night cycle
  cycleStartTime = millis();
}

function draw() {
  // Calculate the time elapsed in the current cycle
  elapsedTime = millis() - cycleStartTime;
  cycleProgress = (elapsedTime % dayDuration) / dayDuration; // Value between 0 and 1

  updateWindForce();

  // Determine the phase of the cycle
  dayNightCycle();
  // set the background color
  background(backgroundColor);

  // Draw the celestial body (sun or moon)
  fill(celestialColor);
  noStroke();
  ellipse(celestialX, celestialY, 50);

  // Draw the ground
  let groundColor = lerpColor(color(40, 80, 40), color(100, 200, 100), sin(PI * cycleProgress)); // Dark green to bright green
  fill(groundColor);
  noStroke();
  rect(0, SOIL_TOP, width, height - SOIL_TOP);

  // Draw all plants
  for (let plant of plants) {
    plant.grow();
    plant.display();
  }

  //Water Particles
  if (currentMode == 'water') {
    for (let i = waterParticles.length - 1; i >= 0; i--) {
      let particle = waterParticles[i];
      particle.update();
      particle.display();
      for (let plant of plants) {
        if (particle.touchesPlant(plant)) {
          console.log("watering plant");
          plant.water()
          plant.stemGrowthRate +=0.01//speed up the plants growth rate

          if (plant.stemHeight >= plant.maxStemHeight) {
            plant.maxStemHeight += random(5, 10);//incerawse the maxiumum growth height if the plant is at
          }
          waterParticles.splice(i, 1)//remove the water particels
          break;
        }
      }
      // Remove particles that fall below the soil
      if (particle.y > height) {
        waterParticles.splice(i, 1);
      }
    }
  }

  // Display debugging information
  fill(0);
  textSize(16);
  text(`Mode: ${currentMode}`, 10, 20);
  text(`Wind Force: ${windForce.toFixed(3)}`, 10, 40);
  text(`Phase: ${phase}`, 10, 60);
  text(`Cycle Progress: ${cycleProgress.toFixed(2)}`, 10, 80);

}

function mousePressed() {
  // code to run when mouse is pressed
  if (currentMode === "wind") {
    // Plant a seed in wind mode
    if (mouseY > SOIL_TOP) {
      console.log("Planting a seed");
      plants.push(new Plant(mouseX, mouseY, SOIL_TOP));
    }
  }
}

function mouseDragged() {
  if (currentMode === "water" && mouseY < SOIL_TOP) {
    // ASpawn water particle waterParticle
    waterParticles.push(new WaterParticle(mouseX, mouseY));
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    isHoldingLeft = true; // Start accumulating wind to the left
  } else if (keyCode === RIGHT_ARROW) {
    isHoldingRight = true; // Start accumulating wind to the right
  } else if (key === "w") {
    currentMode = 'water'//switch to watering mode
  } else if (key === 'e') {
    currentMode = 'wind';//switch to wind mdoe
    waterParticles = []
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    isHoldingLeft = false; // Stop accumulating wind to the left
  } else if (keyCode === RIGHT_ARROW) {
    isHoldingRight = false; // Stop accumulating wind to the right
  }
}

// update the  windForce based on key presses and gradual reset
function updateWindForce() {
  //acumulate the wind force
  if (isHoldingLeft && currentMode=='wind') {
    windForce -= windAcceleration;
  } else if (isHoldingRight && currentMode=='wind') {
    windForce += windAcceleration;
  } else {
    // if no keys are pressed decrease the wind force
    if (windForce > 0) {
      windForce = max(0, windForce - 0.0002); // Reduce if positive
    } else if (windForce < 0) {
      windForce = min(0, windForce + 0.0002); // Increase if negative
    }
  }
}

function dayNightCycle() {
  if (cycleProgress < 0.2) {
    phase = "Night";
    backgroundColor = lerpColor(color(10, 15, 50), color(30, 40, 80), cycleProgress / 0.2);
  } else if (cycleProgress < 0.3) {
    phase = "Dawn";
    backgroundColor = lerpColor(color(30, 40, 80), color(135, 206, 235), (cycleProgress - 0.2) / 0.1);
  } else if (cycleProgress < 0.7) {
    phase = "Day";
    backgroundColor = color(135, 206, 235); // Bright blue
  } else if (cycleProgress < 0.8) {
    phase = "Dusk";
    backgroundColor = lerpColor(color(135, 206, 235), color(30, 40, 80), (cycleProgress - 0.7) / 0.1);
  } else {
    phase = "Night";
    backgroundColor = lerpColor(color(30, 40, 80), color(10, 15, 50), (cycleProgress - 0.8) / 0.2);
  }

  // Calculate the sun/moons position and color
  celestialX = width * cycleProgress; // Moves continuously across the screen
  celestialY = height * 0.5 - (1 - 4 * (cycleProgress - 0.5) ** 2) * (height * 0.4);

  if (phase === "Night") {
    celestialColor = color(200, 200, 255); // Pale moon
  } else if (phase === "Dawn") {
    celestialColor = lerpColor(color(200, 200, 255), color(255, 204, 0), (cycleProgress - 0.2) / 0.1); // Moon transitions to sun
  } else if (phase === "Day") {
    celestialColor = color(255, 204, 0); // Yellow sun
  } else if (phase === "Dusk") {
    celestialColor = lerpColor(color(255, 204, 0), color(200, 200, 255), (cycleProgress - 0.7) / 0.1); // Sun transitions to moon
  }
}
