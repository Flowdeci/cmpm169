class Kaleidoscope {
  constructor(x, y, numShapes, rotationSpeed) {
    this.x = x; 
    this.y = y; 
    this.numShapes = numShapes; 
    this.rotationSpeed = rotationSpeed; 
    this.shapes = []; 
  }

  // Add a new shape to the kaleidoscope
  addShape(type, size, color, offset = 0, rotationOffset = 0) {
    this.shapes.push({ type, size, color, offset, rotationOffset });
  }

  // Display the kaleidoscope
  display() {
    push();
    translate(this.x, this.y); // Move to the center of the kaleidoscope

    // Loop through each shape and draw
    for (let i = 0; i < this.numShapes; i++) {
      for (let shape of this.shapes) {
        push();
        rotate(
          (TWO_PI / this.numShapes) * i +
            frameCount / this.rotationSpeed +
            shape.rotationOffset
        );

        // Offset shapes outward
        translate(0, shape.offset);

        // Set the color
        fill(shape.color);
        noStroke();

        // Draw the shape based on its type
        if (shape.type === "rect") {
          rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
        } else if (shape.type === "triangle") {
          triangle(
            0, -shape.size / 2, // Top point
            -shape.size / 2, shape.size / 2, // Bottom-left
            shape.size / 2, shape.size / 2 // Bottom-right
          );
        } else if (shape.type === "ellipse") {
          ellipse(0, 0, shape.size, shape.size);
        }
        pop();
      }
    }
    pop();
  }
}