class Rocket {
    constructor(canvasId, material, fuelType) {
        this.canvas = document.getElementById(canvasId);
        this.direction = 1; // -1 for up, 1 for down
        this.isAnimating = false;
            console.log(this.canvas);

        paper.setup(this.canvas);

        this.rocketShape = new paper.Path.Rectangle({
            point: [this.canvas.width / 2 - 50, this.canvas.height - 150], // Positioned at the bottom and centered horizontally
            size: [50, 100],
            fillColor: 'green'
        });
        this.rocketWeight = 0.0;
        if (material === "titanium") {
            this.rocketWeight = 100.0;
        }

        this.force = 0.0;
        this.fuelWeight = 0.0;
        if (fuelType === "hydrogen") {
            this.force = 50;
            this.fuelWeight = 50.0;
        }

        this.weightLossConstant = 0.0;
        if (fuelType === "hydrogen" && material === "titanium") {
            this.weightLossConstant = 5.5;
        }
        this.speed = 0.0;
    }

    animate() {
        if (!this.isAnimating) {
            return;
        }

        //     // real rocket shouldn't bounce
        // if (this.rocketShape.position.y - this.rocketShape.bounds.height / 2 <= 0) {
        //     this.direction = 1; // Change direction to down
        // } else if (this.rocketShape.position.y + this.rocketShape.bounds.height / 2 >= paper.view.size.height) {
        //     this.direction = -1; // Change direction to up
        // }
        console.log("rocket shape position y -> " + String(this.rocketShape.position.y) );
        console.log("this.canvas.height - 150 -> " + String(this.canvas.height - 150 ));

        this.getNewSpeed();
        if (this.rocketShape.position.y >= this.canvas.height - 150) {
            console.log("position is above ground");
            this.rocketShape.position.y += this.direction * this.speed; // Move the rocket vertically
        }
        paper.view.update(); // Update the view
        requestAnimationFrame(this.animate.bind(this)); // Bind 'this' to ensure correct context

    }

    startAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animate();
        }
    }

    stopAnimation() {
        this.isAnimating = false;
    }

    launch() {
        this.startAnimation();
    }


    loseWeight() {
        this.fuelWeight -= this.weightLossConstant;
    }

    getGravityForce() {
        return -(this.rocketWeight + this.fuelWeight) * 9.8;
    }

    calculateAcceleration() {
        if (this.fuelWeight >= 0) {
            return (this.force + this.getGravityForce()) / (this.rocketWeight + this.fuelWeight);
        } else {
            return 
        }
    }

    getNewSpeed() {
        this.speed += this.calculateAcceleration();
    }
}


// FUNCTIONS?

// launch()
    // trigger the flying
    // set a threshold for leaving atmosphere in terms of 
    // displacement and velocity
    // if threshold is met while accelration is 0 or positive -> escapeAtmosphere()
    // we know it fails if its acceleration becomes negative -> failEscpae()

// escapeAtmosphere() SUCCESS CONDITION, WIN
    // if you reach teh correct position with the correct velocity, 
    // trigger a static animation that shows the ascent into space
    // YOU WIN
// failEscape()
    // if by that same time, you are NOT where you need
    // animate the rocket crashing YOU LOSE
    // TODO: hints?

// fly()
    // make the weight change of the rocket
    // determine the force exerted in that moment by the rockets -> convert from force to accel with calculateAcceleration()
    // these are fields of the class (accel and weight)

// calculateAcceleration()
    // this is the main driver
    // takes into account the user stuff
    // with acceleration, we know how to increment the speed?
    // needs to take into account (weight (fuel is burned constantly), )
// also needed -> how does the constructor take different values?
// how do different properties of the rocket change the fly() function

export default Rocket;
