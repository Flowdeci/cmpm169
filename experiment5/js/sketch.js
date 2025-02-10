// sketch.js - Render the 3d cube, and handles all the ml5 js hand tracking
// Author: Cody Karigaca
// Date: 2/7/2025

// Globals
let canvasContainer;
let centerHorz, centerVert;
let video;
let handPose;
let hands = [];

let cubePlace = { x: 0, y: 0 }
let cubeRotationX = 0;
let cubeRotationY = 0;


function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

function preload() {
  handPose = ml5.handPose({
    maxHands: 1,
    flipped: true,
    runtime: "tfjs",
    modelType: "full",
    detectorModelUrl: undefined, //default to use the tf.hub model
    landmarkModelUrl: undefined, //default to use the tf.hub model
  });
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}

// setup() function is called once when the program starts
function setup() {  // Place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL); // add WEBGL mode for 3D

  canvas.parent("canvas-container");

  // Resize canvas when the page is resized
  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);

  cube1 = new cube(0, 0);
  this.canChangeColors = true;
}

function draw() {
  //background(220);


  push();
  //move to top Left corner
  translate(-width / 2, -height / 2);
  scale(-1, 1); // Flip the x axis
  image(video, -width, 0, width, height); // make sure the video fits the entire canvas
  pop();

  // Draw all the tracked hand points
  if (hands.length > 0) {
    //Green dots around hand
    drawHandKeypoints();

    //where to place cube
    cubePlace = getHandCenter(hands[0]);

    //how much to roate cube
    handleCubeRotation();
    //console.log(cubeRotationX);

    if (changeColors() < 90 && this.canChangeColors==true) {
      cube1.cubeColorChange();
      this.canChangeColors=false;
    }else if(changeColors() > 90 && this.canChangeColors==false){
      this.canChangeColors=true;
    }

    cube1.display(cubePlace.x, cubePlace.y, cubeHandSize(), cubeRotationX, cubeRotationY);
  } else {
    cube1.display(0, 0)
  }


}

function mousePressed() {
  console.log(hands)
}

function drawHandKeypoints() {
  if (hands.length > 0) {
    let hand = hands[0]; // Use the first detected hand
    for (let i = 0; i < hand.keypoints.length; i++) {
      let keypoint = hand.keypoints[i];
      // Convert hand landmarks from video (2D) to WEBGL coordinates
      let x = map(keypoint.x, 0, video.width, -width / 2, width / 2); // Map x from video to WEBGL
      let y = map(keypoint.y, 0, video.height, -height / 2, height / 2); // Map y from video to WEBGL

      // Draw the points as small spheres
      push();
      fill(0, 255, 0);
      noStroke();
      translate(x, y, 0); // Use the new WEBGL coordinates
      sphere(5);
      pop();
    }
  }
}

function getHandCenter(hand) {
  let centerX = 0;
  let centerY = 0;
  //Check if we have a hand, else return 0
  if (hands.length > 0) {
    for (let i = 0; i < hand.keypoints.length; i++) {
      centerX += hand.keypoints[i].x;
      centerY += hand.keypoints[i].y;
    }
    centerX /= hand.keypoints.length;
    centerY /= hand.keypoints.length;

    centerX = map(centerX, 0, video.width, -width / 2, width / 2);
    centerY = map(centerY, 0, video.height, -height / 2, height / 2);
  }
  return { x: centerX, y: centerY };
}

function cubeHandSize() {
  if (hands.length > 0) {
    let hand = hands[0];
    let thumb = hand.thumb_tip;
    let pinky = hand.pinky_finger_tip;
    let d = dist(thumb.x, thumb.y, pinky.x, pinky.y)

    let index = hand.index_finger_tip;
    let middle = hand.middle_finger_tip;
    let ring = hand.ring_finger_tip;
    let writst = hand.wrist;

    //console.log(hand)
    let wt = dist(writst.x, writst.y, thumb.x, thumb.y);
    let ti = dist(thumb.x, thumb.y, index.x, index.y);
    let im = dist(index.x, index.y, middle.x, middle.y);
    let mr = dist(middle.x, middle.y, ring.x, ring.y);
    let rp = dist(ring.x, ring.y, pinky.x, pinky.y);
    let pw = dist(pinky.x, pinky.y, writst.x, writst.y);

    let total = (wt + ti + im + mr + rp + pw) / 4;
    //console.log(total);

    //console.log(d);
    return d;
  } else { return 150; }

}

function getHandDepth() {
  let depth = 0;
  if (hands.length > 0) {
    let hand = hands[0];

    //Add the depth of all the keypoints
    for (let i = 0; i < hand.keypoints3D.length; i++) {
      depth += hand.keypoints3D[i].z;
    }

    depth /= hand.keypoints3D.length;
  }
  return depth;
}

let prevHandPosition = { x: 0, y: 0 };

function handleCubeRotation() {
  if (hands.length > 0) {
    let handCenter = getHandCenter(hands[0]);

    // Find the hand velocity
    let velocityX = handCenter.x - prevHandPosition.x;
    let velocityY = handCenter.y - prevHandPosition.y;

    // use velocity to roate the cub
    cubeRotationX += velocityY * 0.01;
    cubeRotationY += velocityX * 0.01;

    // save previous hand position
    prevHandPosition = handCenter;
  }
}

function changeColors() {
  if (hands.length > 0) {
    let hand = hands[0];

    let middle = hand.middle_finger_tip;
    let wrist = hand.wrist;

    let d = dist(middle.x, middle.y, wrist.x, wrist.y);
    return d;
  }
}