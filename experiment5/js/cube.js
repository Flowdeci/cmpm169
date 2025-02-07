class cube {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
    }

    display(size) {
        // Rotate the cube
        rotateX(frameCount / 100.0);
        rotateY(frameCount / 100.0);
        noStroke();

        // Size of the cube
        this.makeCube(size);

    }

    makeCube(s) {
        // Front face
        push();
        fill(255, 0, 0); // Red
        beginShape();
        vertex(-s / 2, -s / 2, s / 2);
        vertex(s / 2, -s / 2, s / 2);
        vertex(s / 2, s / 2, s / 2);
        vertex(-s / 2, s / 2, s / 2);
        endShape(CLOSE);
        pop();

        // Back face
        push();
        fill(0, 255, 0); // Green
        beginShape();
        vertex(-s / 2, -s / 2, -s / 2);
        vertex(s / 2, -s / 2, -s / 2);
        vertex(s / 2, s / 2, -s / 2);
        vertex(-s / 2, s / 2, -s / 2);
        endShape(CLOSE);
        pop();

        // Right face
        push();
        fill(0, 0, 255); // Blue
        beginShape();
        vertex(s / 2, -s / 2, s / 2);
        vertex(s / 2, -s / 2, -s / 2);
        vertex(s / 2, s / 2, -s / 2);
        vertex(s / 2, s / 2, s / 2);
        endShape(CLOSE);
        pop();

        // Left face
        push();
        fill(255, 255, 0); // Yellow
        beginShape();
        vertex(-s / 2, -s / 2, s / 2);
        vertex(-s / 2, -s / 2, -s / 2);
        vertex(-s / 2, s / 2, -s / 2);
        vertex(-s / 2, s / 2, s / 2);
        endShape(CLOSE);
        pop();

        // Top face
        push();
        fill(255, 0, 255); // Magenta
        beginShape();
        vertex(-s / 2, -s / 2, -s / 2);
        vertex(s / 2, -s / 2, -s / 2);
        vertex(s / 2, -s / 2, s / 2);
        vertex(-s / 2, -s / 2, s / 2);
        endShape(CLOSE);
        pop();

        // Bottom face
        push();
        fill(0, 255, 255); // Cyan
        beginShape();
        vertex(-s / 2, s / 2, -s / 2);
        vertex(s / 2, s / 2, -s / 2);
        vertex(s / 2, s / 2, s / 2);
        vertex(-s / 2, s / 2, s / 2);
        endShape(CLOSE);
        pop();
    }
}