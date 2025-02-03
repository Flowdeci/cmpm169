class Plant {
    constructor(x, y, stem_min_height) {
        this.x = x;
        this.y = y;
        this.seedSize = 10; // Size of the seed
        this.color = color(random(100, 255), random(100, 255), random(100, 255)); // Random seed color

        // Stem properties
        this.stemHeight = 0; // Starting height of the stem
        this.maxStemHeight = random(50, 150);
        this.maxStemHeight += y - stem_min_height; // Adjust for soil height
        this.initialMaxStemHeight = this.maxStemHeight; //save hte intial stem height for later
        this.stemGrowthRate = random(0.01, 0.1); // Speed of growth
        this.stemColor = color(random(50, 200), random(100, 255), random(50, 200)); // Random green stem color
        this.stemStrokeWeight = random(3, 5); // Thickness of the stem

        // Leaves
        this.leafCount = Math.floor(random(5, 9)); // # of leaves around the blossom
        this.leafSize = random(10, 20); // size of leaves
        this.leafColor = color(random(50, 200), random(150, 255), random(50, 200)); // greenish leaves

        // Wind effect
        this.windOffset = random(1000); //random offset for Perlin noise
        this.windStrength = random(0.02, 0.05); //ind strength variation per plant

        // Blossom properties
        this.blossomColor = color(random(200, 255), random(100, 200), random(100, 200)); // Random blossom color
        this.blossomSize = random(15, 40); // Blossom size
        this.isBlossomOpen = false; // Whether the flower is open

        // Interaction
        this.watered = false;
    }

    grow() {
        // Gradually grow the stem until it reaches the maximum height
        if (cycleProgress >= 0.3 && cycleProgress <= 0.7 || this.watered) {
            if (this.stemHeight < this.maxStemHeight) {
                
                this.stemHeight += this.stemGrowthRate;
            }
            this.watered = false;
        }


        // Open the blossom and reveal leaves during the day
        if (cycleProgress >= 0.3 && cycleProgress <= 0.7) {
            this.isBlossomOpen = true;
        } else {
            this.isBlossomOpen = false; // Hide leaves and close blossom at night
        }
    }

    display() {
        // Calculate dynamic wind sway angle
        let windAngle = map(noise(frameCount * this.windStrength + this.windOffset), 0, 1, -0.2, 0.2) + windForce;

        // Draw the seed
        fill(this.color);
        noStroke();
        ellipse(this.x, this.y, this.seedSize);

        // Draw the stem
        stroke(this.stemColor);
        strokeWeight(this.stemStrokeWeight);
        line(
            this.x, // Start at the seed's center
            this.y,
            this.x + this.stemHeight * sin(windAngle), // Apply wind sway
            this.y - this.stemHeight // Grow upwards
        );

        // Draw the blossom if the plant is fully grown
        if (this.stemHeight >= this.initialMaxStemHeight) {
            fill(this.isBlossomOpen ? this.blossomColor : color(150, 50, 50)); // Open or closed flower
            noStroke();
            let blossomX = this.x + this.stemHeight * sin(windAngle);
            let blossomY = this.y - this.stemHeight;
            ellipse(blossomX, blossomY, this.blossomSize); // Draw blossom

            // draw leaves around the blossom only when its open
            if (this.isBlossomOpen) {
                for (let i = 0; i < this.leafCount; i++) {
                    // Calculate the angle for each leaf
                    let angle = (TWO_PI / this.leafCount) * i;

                    // find the base position of each leaf
                    let leafBaseX = blossomX + cos(angle) * (this.blossomSize / 2);
                    let leafBaseY = blossomY + sin(angle) * (this.blossomSize / 2);

                    // Draw the leaf with the base attached to the blossom's edge
                    this.drawLeaf(leafBaseX, leafBaseY, angle);
                }
            }
        }

    }

    drawLeaf(baseX, baseY, angle) {
        // Draw a single leaf with its base positioned at (baseX, baseY)
        push();
        translate(baseX, baseY); // Move to the base position
        rotate(angle + HALF_PI); // Rotate the leaf to radiate outward

        fill(this.leafColor);
        noStroke();

        // Create a tapered leaf shape, with the base touching the blossom
        beginShape();
        vertex(0, 0); // Base of the leaf (attached to the blossom)
        vertex(-this.leafSize / 2, -this.leafSize); // Left tip
        vertex(0, -this.leafSize * 1.5); // Top tip
        vertex(this.leafSize / 2, -this.leafSize); // Right tip
        endShape(CLOSE);

        pop();
    }

    water() {
        // Mark the plant as watered to allow growth at night
        this.watered = true;
    }


}