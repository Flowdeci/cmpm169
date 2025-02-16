// sketch.js - Render the 3d cube, and handles all the ml5 js hand tracking
// Author: Cody Karigaca
// Date: 2/7/2025

// Globals
let canvasContainer;
let centerHorz, centerVert;
let video;
let handPose;
let hands = [];

const positions = [
  "wrist",
  "thumb_cmc",
  "thumb_mcp",
  "thumb_ip",
  "thumb_tip",
  "index_finger_mcp",
  "index_finger_pip",
  "index_finger_dip",
  "index_finger_tip",
  "middle_finger_mcp",
  "middle_finger_pip",
  "middle_finger_dip",
  "middle_finger_tip",
  "ring_finger_mcp",
  "ring_finger_pip",
  "ring_finger_dip",
  "ring_finger_tip",
  "pinky_finger_mcp",
  "pinky_finger_pip",
  "pinky_finger_dip",
  "pinky_finger_tip"
];

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

function preload() {
  handPose = ml5.handPose({
    maxHands: 2,
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
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());

  canvas.parent("canvas-container");

  // Resize canvas when the page is resized
  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();

  video = createCapture(VIDEO, { flipped: true });
  video.hide();
  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
}

function draw() {
  //background(220);
  push();
  image(video, 0, 0, width, height);
  pop();


  // Draw all the tracked hand points
  if (hands.length > 0) {
    drawHandKeypoints();


    // use the box to influnce letter recognition
    getLetter();

  }
}


function drawHandKeypoints() {
  if (hands.length > 0) {
    let hand = hands[0];

    keypoints = preprocessKeypoints(hand);
    for (let j = 0; j < keypoints.length; j++) {
      let keypoint = keypoints[j];

      fill(color, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10)
    }
  }
}


function preprocessKeypoints(hand) {
  if (!hand.keypoints3D) {
    console.error("keypoints3D is undefined. Ensure the model is set to 'full'.");
    return [];
  }
  let mappedKeypoints = [];
  for (let i = 0; i < hand.keypoints.length; i++) {
    let keypoint = hand.keypoints[i];
    //map the keypoints
    let mappedX = map(keypoint.x, 0, video.width, 0, width);
    let mappedY = map(keypoint.y, 0, video.height, 0, height);

    mappedKeypoints.push({
      x: mappedX,
      y: mappedY,
      name: keypoint.name,
    })
  }
  return mappedKeypoints
}

function getLetter() {
  if (hands.length > 0) {
    let hand = hands[0];
    let keypoints = preprocessKeypoints(hand);

    // get kepoints
    //4->tip 3->beneath tip 2-> above bottom 1->bottom
    let wrist = keypoints[0];
    let thumbcmc = keypoints[1];
    let thumbmcp = keypoints[2];
    let thumbip = keypoints[3];
    let thumbtip = keypoints[4];
    let indexmcp = keypoints[5];
    let indexpip = keypoints[6];
    let indexdip = keypoints[7];
    let indextip = keypoints[8];
    let middlemcp = keypoints[9];
    let middlepip = keypoints[10];
    let middledip = keypoints[11];
    let middletip = keypoints[12];
    let ringmcp = keypoints[13];
    let ringpip = keypoints[14];
    let ringdip = keypoints[15];
    let ringtip = keypoints[16];
    let pinkymcp = keypoints[17];
    let pinkypip = keypoints[18];
    let pinkydip = keypoints[19];
    let pinkytip = keypoints[20];

    //letter A
    if (//all the fingers should be close to the wrsit and the thumb right next to index
      dist(pinkytip.x, pinkytip.y, wrist.x, wrist.y) < 70 &&
      dist(ringtip.x, ringtip.y, wrist.x, wrist.y) < 50 &&
      dist(middletip.x, middletip.y, wrist.x, wrist.y) < 70 &&
      dist(indextip.x, indextip.y, wrist.x, wrist.y) < 100 &&
      dist(thumbtip.x, thumbtip.y, indexpip.x, indexpip.y) < 40
    ) {
      console.log("Sign language A");
    } else if (//four fingers extended all the way
      dist(indextip.x, indextip.y, wrist.x, wrist.y) > 100 &&
      dist(middletip.x, middletip.y, wrist.x, wrist.y) > 100 &&
      dist(ringtip.x, ringtip.y, wrist.x, wrist.y) > 100 &&
      dist(pinkytip.x, pinkytip.y, wrist.x, wrist.y) > 100 &&
      //and thumb shoudl be near index base
      dist(thumbtip.x, thumbtip.y, pinkymcp.x, pinkymcp.y) < 25
    ) {
      console.log("Sign lanagnauge B");
    } else if (
      // Thumb and index finger tips are far apart (forming an open curve)
      dist(thumbtip.x, thumbtip.y, indextip.x, indextip.y) > 50 &&
      dist(thumbtip.x, thumbtip.y, indextip.x, indextip.y) < 120 &&
      // Other fingers are extended but not tightly curved
      dist(middletip.x, middletip.y, middlemcp.x, middlemcp.y) > 70 &&
      dist(ringtip.x, ringtip.y, ringmcp.x, ringmcp.y) > 70 &&
      dist(pinkytip.x, pinkytip.y, pinkymcp.x, pinkymcp.y) > 70 &&
      // Fingers should not overlap with the thumb (to distinguish from O)
      dist(middletip.x, middletip.y, thumbtip.x, thumbtip.y) > 50 &&
      dist(ringtip.x, ringtip.y, thumbtip.x, thumbtip.y) > 50 &&
      dist(pinkytip.x, pinkytip.y, thumbtip.x, thumbtip.y) > 50 &&
      // Thumb and index finger curvature (tips above MCP joints)
      thumbtip.y < thumbmcp.y &&
      indextip.y < indexmcp.y
    ) {
      console.log("Sign language C");
    } else if (
      //index finger pointed up
      dist(indextip.x, indextip.y, wrist.x, wrist.y) > 220 &&
      //all other fingers tips touching
      dist(thumbtip.x, thumbtip.y, middletip.x, middletip.y) < 40 &&
      dist(thumbtip.x, thumbtip.y, ringtip.x, ringtip.y) < 40 &&
      dist(thumbtip.x, thumbtip.y, pinkytip.x, pinkytip.y) < 40 &&
      dist(middletip.x, middletip.y, ringtip.x, ringtip.y) < 50 &&
      dist(ringtip.x, ringtip.y, pinkytip.x, pinkytip.y) < 50
    ) {
      console.log("Sign language D");
    } else if (
      // Thumb tip close to pinky tip
      dist(thumbtip.x, thumbtip.y, pinkytip.x, pinkytip.y) < 50 &&
      // All fingers are folded inward (fingertips below their MCP joints)
      indextip.y > indexmcp.y &&
      middletip.y > middlemcp.y &&
      ringtip.y > ringmcp.y &&
      pinkytip.y > pinkymcp.y &&
      // Fingers are close together (tightness of the folded hand)
      dist(indextip.x, middletip.x) < 30 &&
      dist(middletip.x, ringtip.x) < 30 &&
      dist(ringtip.x, pinkytip.x) < 30
    ) {
      console.log("Sign language E");
    } else if (
      // Thumb and index finger form a circle
      dist(thumbtip.x, thumbtip.y, indextip.x, indextip.y) < 30 &&
      // Other fingers are extended
      dist(middletip.x, middletip.y, middlemcp.x, middlemcp.y) > 80 &&
      dist(ringtip.x, ringtip.y, ringmcp.x, ringmcp.y) > 80 &&
      dist(pinkytip.x, pinkytip.y, pinkymcp.x, pinkymcp.y) > 80 &&
      // Other fingers' tips are above their MCP joints
      middletip.y < middlemcp.y &&
      ringtip.y < ringmcp.y &&
      pinkytip.y < pinkymcp.y
    ) {
      console.log("Sign language F");
    } else if (
      // Thumb and index finger extended sideways
      dist(thumbtip.x, thumbtip.y, wrist.x, wrist.y) > 120 &&
      dist(indextip.x, indextip.y, wrist.x, wrist.y) > 120 &&
      // Thumb and index finger are separated
      dist(thumbtip.x, thumbtip.y, indextip.x, indextip.y) > 80 &&
      // Thumb and index finger are roughly at the same height (sideways orientation)
      Math.abs(thumbtip.y - indextip.y) < 40 &&
      // Middle, ring, and pinky fingers are folded
      middletip.y > middlemcp.y &&
      ringtip.y > ringmcp.y &&
      pinkytip.y > pinkymcp.y &&
      // Index finger is sideways (x difference is larger than y difference)
      Math.abs(indextip.x - wrist.x) > Math.abs(indextip.y - wrist.y) &&
      //index above wrist
      indextip.y < wrist.y
    ) {
      console.log("Sign language G");
    } else if (
      // Index and middle fingers are extended
      dist(indextip.x, indextip.y, wrist.x, wrist.y) > 120 &&
      dist(middletip.x, middletip.y, wrist.x, wrist.y) > 120 &&
      // Index and middle fingers are close together
      dist(indextip.x, indextip.y, middletip.x, middletip.y) < 50 &&
      // Thumb, ring, and pinky fingers are folded
      thumbtip.y > thumbmcp.y &&
      ringtip.y > ringmcp.y &&
      pinkytip.y > pinkymcp.y &&
      //index above wrist
      indextip.y < wrist.y &&
      middledip.y < wrist.y

    ) {
      console.log("Sign language H");
    } else if (
      // Pinky finger extended
      dist(pinkytip.x, pinkytip.y, wrist.x, wrist.y) > 100 &&
      // Other fingers' tips are beneath their MCP joints
      indextip.y > indexmcp.y &&
      middletip.y > middlemcp.y &&
      ringtip.y > ringmcp.y &&
      // Other fingers' tips are touching each other
      dist(indextip.x, indextip.y, middletip.x, middletip.y) < 30 &&
      dist(middletip.x, middletip.y, ringtip.x, ringtip.y) < 30 &&
      // Thumb is close to the middle of the ring finger
      dist(thumbtip.x, thumbtip.y, ringpip.x, ringpip.y) < 40 &&
      // Pinky is pointing upward (above the wrist)
      pinkytip.y < wrist.y - 40
      //
    ) {
      console.log("Sign language I");
    } else if (
      // Pinky finger extended
      dist(pinkytip.x, pinkytip.y, wrist.x, wrist.y) > 120 &&
      // Other fingers folded
      indextip.y > indexmcp.y &&
      middletip.y > middlemcp.y &&
      ringtip.y > ringmcp.y &&
      // Other fingers' tips are touching each other
      dist(indextip.x, indextip.y, middletip.x, middletip.y) < 30 &&
      dist(middletip.x, middletip.y, ringtip.x, ringtip.y) < 30 &&
      // Thumb is close to the middle joint of the ring finger
      dist(thumbtip.x, thumbtip.y, ringpip.x, ringpip.y) < 40 &&
      // Sideways orientation (pinky is to the right of the wrist)
      pinkytip.x > wrist.x
    ) {
      console.log("Sign language J");
    } else if (
      // Index and middle fingers extended
      dist(indextip.x, indextip.y, wrist.x, wrist.y) > 200 &&
      dist(middletip.x, middletip.y, wrist.x, wrist.y) > 200 &&
      // Index and middle fingers are spread apart
      dist(indextip.x, indextip.y, middletip.x, middletip.y) > 50 &&
      // Thumb extended between index and middle fingers
      dist(thumbtip.x, thumbtip.y, indextip.x, indextip.y) < 100 &&
      dist(thumbtip.x, thumbtip.y, middletip.x, middletip.y) < 100 &&
      // Ring and pinky fingers folded
      ringtip.y > ringmcp.y &&
      pinkytip.y > pinkymcp.y
    ) {
      console.log("Sign language K");
    } else if (
      // Index finger extended upward
      indextip.y < indexmcp.y - 100 &&
      // Thumb extended outward
      thumbtip.x > wrist.x + 100 &&
      // Middle, ring, and pinky fingers are folded close to the wrist
      dist(middletip.x, middletip.y, wrist.x, wrist.y) > 100 &&
      dist(ringtip.x, ringtip.y, wrist.x, wrist.y) > 100 &&
      dist(pinkytip.x, pinkytip.y, wrist.x, wrist.y) > 100 &&
      // Fingertips of middle, ring, and pinky are touching
      dist(middletip.x, middletip.y, ringtip.x, ringtip.y) < 40 &&
      dist(ringtip.x, ringtip.y, pinkytip.x, pinkytip.y) < 40
    ) {
      console.log("Sign language L");
    } else if (
      // Index, middle, and ring fingers folded over the thumb
      dist(indextip.x, indextip.y, thumbtip.x, thumbtip.y) < 40 &&
      dist(middletip.x, middletip.y, thumbtip.x, thumbtip.y) < 40 &&
      dist(ringtip.x, ringtip.y, thumbtip.x, thumbtip.y) < 40 &&
      // Pinky finger slightly folded, not overlapping the thumb
      pinkytip.y > pinkymcp.y &&
      dist(pinkytip.x, pinkytip.y, thumbtip.x, thumbtip.y) > 50 &&
      // Thumb is beneath the folded fingers
      thumbtip.y > indextip.y &&
      thumbtip.y > middletip.y &&
      thumbtip.y > ringtip.y
    ) {
      console.log("Sign language M");
    } else if (
      // Index and middle fingers folded over the thumb
      dist(indextip.x, indextip.y, thumbtip.x, thumbtip.y) < 40 &&
      dist(middletip.x, middletip.y, thumbtip.x, thumbtip.y) < 40 &&
      // Ring finger is not overlapping the thumb
      dist(ringtip.x, ringtip.y, thumbtip.x, thumbtip.y) > 50 &&
      // Pinky finger folded but not necessarily overlapping the thumb
      pinkytip.y > pinkymcp.y &&
      // Thumb is beneath the folded fingers
      thumbtip.y > indextip.y &&
      thumbtip.y > middletip.y
    ) {
      console.log("Sign language N");
    } else if (
      // Thumb and index finger tips are very close
      dist(thumbtip.x, thumbtip.y, indextip.x, indextip.y) < 30 &&
      // Middle, ring, and pinky fingertips are close to the thumb and index tips
      dist(middletip.x, middletip.y, thumbtip.x, thumbtip.y) < 50 &&
      dist(ringtip.x, ringtip.y, thumbtip.x, thumbtip.y) < 50 &&
      dist(pinkytip.x, pinkytip.y, thumbtip.x, thumbtip.y) < 50 &&
      // All fingertips are close together, forming a compact circular shape
      dist(middletip.x, middletip.y, indextip.x, indextip.y) < 50 &&
      dist(ringtip.x, ringtip.y, indextip.x, indextip.y) < 50 &&
      dist(pinkytip.x, pinkytip.y, indextip.x, indextip.y) < 50 &&
      // Ensure all fingers are curved inward (tips below their MCP joints)
      indextip.y > indexmcp.y &&
      middletip.y > middlemcp.y &&
      ringtip.y > ringmcp.y &&
      pinkytip.y > pinkymcp.y &&
      // Thumb must not be beneath the folded fingers (to avoid confusion with M)
      thumbtip.y < indextip.y &&
      thumbtip.y < middletip.y &&
      thumbtip.y < ringtip.y &&
      thumbtip.y < pinkytip.y
    ) {
      console.log("Sign language O");
    } else if (
      // Index finger far from the wrist
      dist(indextip.x, indextip.y, wrist.x, wrist.y) > 150 &&
      // Middle finger lower than the wrist
      middletip.y > wrist.y &&
      // Thumb lower than the wrist and touching the middle fingertip
      thumbtip.y > wrist.y &&
      dist(thumbtip.x, thumbtip.y, middletip.x, middletip.y) < 30 &&
      // Ring and pinky fingers close to the wrist
      dist(ringtip.x, ringtip.y, thumbcmc.x, thumbcmc.y) < 50 &&
      dist(pinkytip.x, pinkytip.y, thumbcmc.x, thumbcmc.y) < 50
    ) {
      console.log("Sign language P");
    } else if (
      // Index finger and thumb pointing downward
      indextip.y > wrist.y &&
      thumbtip.y > wrist.y &&
      thumbtip.y > thumbip.y &&
      indextip.y > indexdip.y &&
      // Middle, ring, and pinky fingers folded close to the wrist
      dist(middletip.x, middletip.y, thumbcmc.x, thumbcmc.y) < 50 &&
      dist(ringtip.x, ringtip.y, thumbcmc.x, thumbcmc.y) < 50 &&
      dist(pinkytip.x, pinkytip.y, thumbcmc.x, thumbcmc.y) < 50
    ) {
      console.log("Sign language Q");
    } else if (
      // Index and middle fingers are extended upward
      indextip.y < indexmcp.y &&
      middletip.y < middlemcp.y &&
      // Index and middle fingers are crossed
      dist(indextip.x, indextip.y, middletip.x, middletip.y) < 40 &&
      // Ring and pinky fingers are folded close to the wrist
      dist(ringtip.x, ringtip.y, wrist.x, wrist.y) < 60 &&
      dist(pinkytip.x, pinkytip.y, wrist.x, wrist.y) < 60 &&
      // Thumb is folded inward near the base of the index and middle fingers
      dist(thumbtip.x, thumbtip.y, indexmcp.x, indexmcp.y) < 50 &&
      dist(thumbtip.x, thumbtip.y, middlemcp.x, middlemcp.y) < 50
    ) {
      console.log("Sign language R");
    }else{
      console.log(
        dist(indextip.x, indextip.y, middletip.x, middletip.y) < 40
      )
    }






  }

}


function getHandOrientation(keypoints) {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  // Loop through all keypoints to find the bounding box
  for (let i = 0; i < keypoints.length; i++) {
    const point = keypoints[i];
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }

  const width = maxX - minX;
  const height = maxY - minY;

  // Return orientation based on aspect ratio
  return width > height ? "forward" : "sideways";
}


function mousePressed() {
  console.log(hands[0]);
}
