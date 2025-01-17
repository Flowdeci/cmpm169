// leaf.js - contains the class for the leaf, respobisble for the leaf's behavior and appearance
// Author: Cody Kariagaca
// Date:1/17/2024

class Leaf {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speed = random(1, 3); // Falling speed
      this.rotation = random(TWO_PI); // Current rotation angle in radians
      this.rotationSpeed = random(-0.05, 0.05); // Speed of rotation (positive or negative for clockwise/counterclockwise)
    }
  
    fall() {
      this.y += this.speed; // Move the leaf down
      this.rotation += this.rotationSpeed; // Rotate the leaf based on the speed
  
      if (this.y > height) {
        // Reset to the top when it reaches the bottom
        this.y = random(-100, 0);
        this.x = random(width);
      }
    }
  
    display() {
      // Save the current transformation state
      push();
  
      // Translate to the leaf's position
      translate(this.x, this.y);
  
      // Rotate the canvas by the leaf's current rotation angle
      rotate(this.rotation);
  
      // Draw the leaf image (centered at the leaf's position)
      imageMode(CENTER); // Set image mode to center
      image(mapleLeaf, 0, 0, this.size, this.size);
  
      // Restore the previous transformation state
      pop();
    }
  }