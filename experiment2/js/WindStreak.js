// windStreak.js- contains the class for the wind streak, responsible for the wind streak's behavior and appearance
// Author: Cody Kariagaca
// Date:1/20/2024

class WindStreak {
    constructor(x, y) {
        this.points = [];
        this.maxLength = random(10, 20); // Random length for the streak
        console.log("Max length for streak:", this.maxLength); // Debug
        this.lifespan = 300; // Lifespan for fading effect
        this.width = random(5, 15); // Random width for the streak
        this.color = color(200, 200, 255, this.lifespan); // Light blue color
        this.addPoint(x, y);
    }

    addPoint(x, y) {
        //console.log("Adding point:", x, y); 

        //add some randomness to the streak 
        this.points.push({ x, y });
        //console.log("Current points:", this.points); 
    }

    update() {
        // Gradually reduce the lifespan to fade the streak
        this.lifespan -= 5;
        this.color = color(200, 200, 255, this.lifespan); // Update color opacity
    }

    display() {
        if (this.points.length < 3) {
            // Not enough points to render a curve
            return;
        }

        noFill();
        stroke(this.color); // Use the streak's color with fading opacity
        strokeWeight(this.width); // Use the streak's width
        beginShape();

        // Use `curveVertex()` to draw smooth curves through the points
        for (let p of this.points) {
            curveVertex(p.x, p.y);
        }
        endShape();

        //draw some 
    }

    isDead() {
        // Check if the streak has faded out completely
        return this.lifespan <= 0;
    }
}