
class Rocket {
    constructor(canvasId, material, fuelType) {
        this.canvas = document.getElementById(canvasId);
        this.direction = 1; // -1 for up, 1 for down
        this.isAnimating = false;
            console.log(this.canvas);
 
 
        paper.setup(this.canvas);
 
 
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
 

        // Define the costs
        this.costs = {
            'titanium': 10000000, // $10 million
            'aluminium': 5000000, // $5 million
            'steel': 7500000, // $7.5 million
            'hydrogen': 20000000, // $20 million
            'kerosene': 10000000, // $10 million
            'methane': 15000000, // $15 million
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
            this.force = 40;
            this.fuelWeight = 60.0;
        } else if (fuelType === "methane") {
            this.force = 45;
            this.fuelWeight = 55.0;
        }
 
 
        this.weightLossConstant = 0.0;
        if ((fuelType === "hydrogen" && material === "titanium") || (fuelType === "kerosene" && material === "aluminium") || (fuelType === "methane" && material === "steel")) {
            this.weightLossConstant = 5.5;
        }
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
        // Check if the rocket can reach the required altitude
        if (this.rocketShape.position.y <= 100) { // Assuming 100 is the required altitude
            console.log('You win!');
        } else {
            console.log('You lose!');
        }

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

 
export default Rocket; 