
class Rocket {

    ANIMATION_STATES = ['PRE-LAUNCH','IS-LAUNCHING', 'IN-FLIGHT', 'WIN', 'LOST']

    constructor(canvasId, material, fuelType) {
        this.canvas = document.getElementById(canvasId);
        this.direction = 1; // -1 for up, 1 for down
        this.isAnimating = false;
 
        paper.setup(this.canvas);

        this.statusText = new paper.PointText(new paper.Point(this.canvas.width / 2, this.canvas.height - 150));
        this.statusText.content = 'Pre-launch';
        this.statusText.fillColor = 'black'; 

        this.animationState = this.ANIMATION_STATES[0];

        this.rocketShape = new paper.Path();
        this.rocketShape.add(new paper.Point(this.canvas.width / 2, this.canvas.height - 150)); // Bottom point
        this.rocketShape.lineTo(new paper.Point(this.canvas.width / 2 - 25, this.canvas.height - 100)); // Left point
        this.rocketShape.lineTo(new paper.Point(this.canvas.width / 2 + 25, this.canvas.height - 100)); // Right point
        this.rocketShape.closePath(); // Close the path to create the triangle
        this.rocketShape.fillColor = 'green'; // Fill the path with color
        this.rocketWeight = 0.0;
        if (material === "titanium") {
            this.rocketWeight = 100.0;
        } else if (material === "aluminium") {
            this.rocketWeight = 50.0;
        } else if (material === "steel") {
            this.rocketWeight = 150.0;
        }
 

        // Define the base costs
this.baseCosts = {
    'titanium': 10000000, // $10 million
    'aluminium': 5000000, // $5 million
    'steel': 7500000, // $7.5 million
    'carbon': 8000000, // $8 million
    'silica': 20000000, // $20 million
    'hydrogen': 20000000, // $20 million
    'kerosene': 10000000, // $10 million
    'methane': 15000000, // $15 million
    'helium3': 25000000, // $25 million
    'rp-1': 50000000, // $50 million
};

// Define the current costs (initially the same as the base costs)
this.costs = {...this.baseCosts};

// Then, whenever a player purchases a material or fuel type, increase its cost:
this.buy = function(item) {
    // Deduct the cost from the budget
    this.budget -= this.costs[item];

    // Increase the cost for the next purchase
    this.costs[item] *= 1.1; // Increase cost by 10%
};
        // Initialize budget
        this.budget = 100000000; // $100 million

        // Deduct the cost of the selected material and fuel type from the budget
        this.budget -= this.costs[material];
        this.budget -= this.costs[fuelType];

        // Check if the budget has been exceeded
        if (this.budget < 0) {
            console.log('Budget exceeded!');
            return;
        }

 
        this.force = 0.0;
        this.fuelWeight = 0.0;

        if (fuelType === "hydrogen") {
            this.force = 50;
            this.fuelWeight = 50.0;
        } else if (fuelType === "kerosene") {
            this.force = 400000;
            this.fuelWeight = 60.0;
        } else if (fuelType === "hydrazine") {
            this.force = 300000;
            this.fuelWeight = 70.0;
        }

      
        this.weightLossConstant = 0.0;
        if ((fuelType === "hydrogen" && material === "titanium") || 
            (fuelType === "kerosene" && material === "aluminium") || 
            (fuelType === "hydrazine" && material === "steel") ||
            (fuelType === "hydrogen" && material === "carbon_composites") ||
            (fuelType === "kerosene" && material === "inconel")) {
            this.weightLossConstant = 5.5;
        }

        this.speed = 0.0;
        this.distance = 0.0;
    


    }
 

 
    animate() {
        console.log("animate() called");
        this.checkIfEscaped();
        this.setAnimation();

        if (!this.isAnimating) {
            return;
        }

    
        
        console.log("rocket shape position y -> " + String(this.distance) );
        console.log("this.canvas.height - 150 -> " + String(this.canvas.height - 150 ));

        this.getNewSpeed();
        this.loseWeight();
        if (this.distance >= 0) {
            console.log("position is above ground");
            console.log("A rocket shape position y -> " + String(this.distance) );
            console.log("this speed = " + String(this.speed));
            this.distance += this.speed; // Move the rocket vertically
            console.log("B rocket shape position y -> " + String(this.distance) );

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

    setAnimation() {
        if (this.animationState === "PRE-LAUNCH") {
            this.setPreLaunch();
        }
    }

    setPreLaunch() {
        this.animationState = this.ANIMATION_STATES[0];
        this.statusText.content = 'PRE LAUNCH';
        this.statusText.position = new paper.Point(this.canvas.width / 2, this.canvas.height - 150);
    }

    setIsLaunching() {
        this.animationState = this.ANIMATION_STATES[1];

        this.statusText.content = 'IS LAUNCHING';
        this.statusText.position = new paper.Point(this.canvas.width / 2, this.canvas.height - 150);
    }

    setInFlight() {
        this.animationState = this.ANIMATION_STATES[2];

        this.statusText.content = 'IN FLIGHT';
        this.statusText.position = new paper.Point(this.canvas.width / 2, this.canvas.height - 150);
    }
 
    launch() {
        this.setIsLaunching();
        setTimeout(() => {
            this.isLaunchingCallback();
        }, 1000);
        this.startAnimation();
    }
 
    isLaunchingCallback() {
        this.setInFlight();
    }

    loseWeight() { 
        this.fuelWeight -= this.weightLossConstant;
    }
 
 
    getGravityForce() {
        return -(this.rocketWeight + this.fuelWeight) * 9.8;
    }
 

    calculateAcceleration() {
        console.log('get new acc');

        if (this.fuelWeight >= 0) {
            console.log('accel we calculate = ' + String((this.force + this.getGravityForce()) / (this.rocketWeight + this.fuelWeight)));

            return (this.force + this.getGravityForce()) / (this.rocketWeight + this.fuelWeight);
        } else {
            console.log("OUT OF FUEL");
            return this.getGravityForce() / (this.rocketWeight);
        }
    }
 
 
    getNewSpeed() {
        console.log('before get speed, init speed = ' + String(this.speed));
        this.speed += this.calculateAcceleration();
    }

    escape() { // WIN!
        // logic for rendering escape animation
        this.isAnimating = false;
        console.log("YOU WIN!")
    }

    fail(){
        this.isAnimating = false;
        console.log("YOU LOSE!")
    }

    checkIfEscaped() {
        let ESCAPE_SPEED = 1000;
        let ESCAPE_ALTITUDE = 1000;
        if(this.distance >= ESCAPE_ALTITUDE && this.speed >= ESCAPE_SPEED) {
            this.escape();
        } else if (this.speed <= ESCAPE_SPEED && this.calculateAcceleration() <= 0){
            this.fail();
        }
    }

    // Pre-launch (loop, maybe clouds flying by):
        // When the player is still choosing their object

    // Is-launching (1 sec fixed animation):
        // 1 second fixed animation
        // make sure that no matter whta parameters are set, the user can make it to the 
        // next animation (in-flight) BEFORE FAILING

    // In-flight (loop)
        // not LOSS and not WIN

    // Loss (loop with a restart button)
        // acceleration is negative is 0
        // speed < escape_speed AND
        // distance < escape_distance

    // Win (loop with restart button)
        // speed >= escape_speed AND distance >= escape_disance
        // acceleration >= 0
 }

 
export default Rocket; 