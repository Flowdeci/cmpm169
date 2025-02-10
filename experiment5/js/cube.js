let rotationX = 0;
let rotationY = 0;
let cubeSize = 150;

let faceColors = [
    [255, 0, 0],    // front face: Red
    [0, 255, 0],    // back face: Green
    [0, 0, 255],    // right face: Blue
    [255, 255, 0],  // left face: Yellow
    [255, 0, 255],  // Top face: Magenta
    [0, 255, 255],  // Bottom face: Cyan
];

//maniuplation
function mouseDragged() {
    //Update rotation based on mousse movment
    //IDK why flipped but it feels better that way
    rotationX += movedY * 0.01;
    rotationY += movedX * 0.01;
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        cubeSize -= 5;
    } else if (keyCode === RIGHT_ARROW) {
        cubeSize += 5;
    } else {
        //change all the colors of the faces
        for (let i = 0; i < 6; i++) {
            faceColors[i] = [random(255), random(255), random(255)];
        }
    }
}

class cube {
    constructor(x, y) {
        this.x = x;
        this.y = y;

    }

    display(x, y, size = cubeSize, rX=rotationX, rY=rotationY) {
        //Translate cube before rotation
        translate(x, y);
        // Rotate the cube
        rotateX(rX);
        rotateY(rY);


        noStroke();
        console.log("Cube RotationX:", rX, "Cube RotationY:", rY);



        // Size of the cube
        this.makeCube(size);

    }

    makeCube(s) {
        // Front face
        push();
        fill(faceColors[0]);
        beginShape();
        vertex(-s / 2, -s / 2, s / 2);
        vertex(s / 2, -s / 2, s / 2);
        vertex(s / 2, s / 2, s / 2);
        vertex(-s / 2, s / 2, s / 2);
        endShape(CLOSE);
        pop();

        // Back face
        push();
        fill(faceColors[1]);
        beginShape();
        vertex(-s / 2, -s / 2, -s / 2);
        vertex(s / 2, -s / 2, -s / 2);
        vertex(s / 2, s / 2, -s / 2);
        vertex(-s / 2, s / 2, -s / 2);
        endShape(CLOSE);
        pop();

        // Right face
        push();
        fill(faceColors[2]);
        beginShape();
        vertex(s / 2, -s / 2, s / 2);
        vertex(s / 2, -s / 2, -s / 2);
        vertex(s / 2, s / 2, -s / 2);
        vertex(s / 2, s / 2, s / 2);
        endShape(CLOSE);
        pop();

        // Left face
        push();
        fill(faceColors[3]);
        beginShape();
        vertex(-s / 2, -s / 2, s / 2);
        vertex(-s / 2, -s / 2, -s / 2);
        vertex(-s / 2, s / 2, -s / 2);
        vertex(-s / 2, s / 2, s / 2);
        endShape(CLOSE);
        pop();

        // Top face
        push();
        fill(faceColors[4]);
        beginShape();
        vertex(-s / 2, -s / 2, -s / 2);
        vertex(s / 2, -s / 2, -s / 2);
        vertex(s / 2, -s / 2, s / 2);
        vertex(-s / 2, -s / 2, s / 2);
        endShape(CLOSE);
        pop();

        // Bottom face
        push();
        fill(faceColors[5]);
        beginShape();
        vertex(-s / 2, s / 2, -s / 2);
        vertex(s / 2, s / 2, -s / 2);
        vertex(s / 2, s / 2, s / 2);
        vertex(-s / 2, s / 2, s / 2);
        endShape(CLOSE);
        pop();
    }
}