// Particle.js - Defines the Particle class

class Particle {
    constructor(x, y, targetX, targetY) {
        this.pos = createVector(x, y); // Start position
        this.target = createVector(targetX, targetY); // Target position
        this.vel = createVector(random(-1, 1), random(-1, 1)); // Initial velocity
        this.acc = createVector(0, 0); // Acceleration
        this.maxSpeed = 5; // Maximum speed
        this.maxForce = 0.3; // Maximum steering force
        this.size = 5; // Particle size
        this.color = random(TEAM_COLORS); // Particle color
        this.offset = random(1000); // Noise offset for unique behavior
        this.scatterForce = random(200); // Force when scattering
        this.isScattered = false; // Whether the particle is scattered
    }

    // Attract particle to its target
    behavior() {
        let desired = p5.Vector.sub(this.target, this.pos); // Direction to target
        let distance = desired.mag(); // Distance to target
        desired.setMag(this.maxSpeed); // Scale to maximum speed

        // Apply slowing force as particle nears target
        if (distance < 50) {
            let m = map(distance, 0, 50, 0, this.maxSpeed);
            desired.setMag(m);
        }

        // Calculate steering force
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce); // Limit steering force
        this.applyForce(steer);
    }

    // Apply a force to the particle
    applyForce(force) {
        this.acc.add(force);
    }

    // Update particle position
    move() {
        if (!this.isScattered) {
            this.behavior(); // Attract to target if not scattered
        } else {
            this.scatter(); // Apply scatter behavior when scattered
        }

        this.vel.add(this.acc); // Update velocity
        this.pos.add(this.vel); // Update position
        this.acc.mult(0); // Reset acceleration

        let noiseX = noise(this.offset + frameCount * 0.01) * 2 - 1;
        let noiseY = noise(this.offset + 1000 + frameCount * 0.01) * 2 - 1;
        this.applyForce(createVector(noiseX, noiseY));
    }

    // Scatter the particle (move away from mouse)
    scatter() {
        let mouse = createVector(mouseX, mouseY);
        let direction = p5.Vector.sub(this.pos, mouse); // Move away from mouse
        direction.setMag(this.scatterForce / direction.mag()); // Scale force
        this.applyForce(direction);
    }

    // Check if the particle should scatter
    checkScatter() {
        let mouse = createVector(mouseX, mouseY);
        let distance = p5.Vector.dist(this.pos, mouse);

        // Scatter if the particle is close to the mouse
        if (distance < random(200)) {
            this.isScattered = true;
        } else {
            this.isScattered = false;
        }
    }

    // Display particle
    display() {
        fill(this.color); // White color
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.size);
    }
}