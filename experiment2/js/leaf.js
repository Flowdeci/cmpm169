// leaf.js - contains the class for the leaf, respobisble for the leaf's behavior and appearance
// Author: Cody Kariagaca
// Date:1/17/2024

class Leaf {
  constructor(x, y, size, leafImage=mapleLeaf) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = random(1, 3); // Falling speed (gravity)
    this.rotation = 0;
    this.rotationSpeed = random(0.01, 0.05); // Speed of rotation

    this.leafImage=leafImage;
    // Add velocities for wind and gravity
    this.vx = random(-1, 1); // Horizontal velocity (wind)
    this.vy = this.speed;    // Vertical velocity (falling down)
    this.windInfluence = random(0.5, 1.5); // Random sensitivity to wind
  }

  fall() {
    // Simulate gravity/vertical falling
    this.vy += 0.03; // Gravity effect: tweak to make falling feel heaver, add over time so that it isnt stationary

    // Apply wind force to horizontal and vertical velocity
    if (globalWindForce.mag() > 0) {
      // Wind gradually affects the leaf's horizontal and vertical velocities
      this.vx += globalWindForce.x * 0.005 * this.windInfluence;
      this.vy += globalWindForce.y * 0.005 * this.windInfluence;
    }

    // Apply some drag to prevent infinite acceleration
    this.vx *= 0.99; // Horizontal drag (air friction)
    this.vy *= 0.99; // Vertical drag (air friction)

    // Update the leaf's position based on its velocity
    this.x += this.vx;
    this.y += this.vy;


    this.rotation += this.rotationSpeed;// Rotate the leaf based on its rotation speed

    // Reset the leafs postion if it goes offscreen
    if (this.y > height) {
      //reset to top when it reaches the bottom
      this.y = random(-100, 0);
      this.x = random(width);
      this.vx = random(-1, 1); // Reset horizontal velocity
      this.vy = this.speed;    // Reset vertical velocity
    } else if (this.x > width) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = width;
    }else if (this.y < -height) {
      this.y+=100;
    }
  }

  display() {//keep redrawing the leaves
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    imageMode(CENTER);
    image(this.leafImage, 0, 0, this.size, this.size);
    pop();
  }
}