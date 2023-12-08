
class Rocket {

    ANIMATION_STATES = ['PRE-LAUNCH','IS-LAUNCHING', 'IN-FLIGHT', 'WIN', 'LOST']
    ESCAPE_SPEED = 1000;
    ESCAPE_ALTITUDE = 1000;
    constructor(canvasId, material, fuelType) {
        this.canvas = document.getElementById(canvasId);
        this.direction = 1; // -1 for up, 1 for down
        this.inFlight = false;
 
        paper.setup(this.canvas);

        this.statusText = new paper.PointText(new paper.Point(this.canvas.width / 2, this.canvas.height - 150));
        this.statusText.content = 'Pre-launch';
        this.statusText.fillColor = 'black'; 

        this.animationState = this.ANIMATION_STATES[0];

        this.rocketWeight = 0.0;
        if (material === "titanium") {
            this.rocketWeight = 100.0;
        } else if (material === "aluminium") {
            this.rocketWeight = 50.0;
        } else if (material === "steel") {
            this.rocketWeight = 150.0;
        }
 
        this.speedText = new paper.PointText(new paper.Point(20, 20));
        this.speedText.content = 'Speed: 0';
        this.speedText.fillColor = 'black';

      // Define the base costs (in dollars per kg)
      this.baseCosts = {
        'titanium': 5.50,
        'aluminium': 2.17,
        'steel': 0.548,
        'carbon': 21.5, // Lower end of the range
        'silica': 2.17,
        'hydrogen': 1.35, // Lower end of the range
        'kerosene': 0.73,
        'methane': 0.22,
        'helium3': 2750, // Price per liter
        'rp-1': 2.3,
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
          // Assume 1000 kg of each material and fuel type for simplicity
          this.budget -= this.costs[material] * 1000;
          this.budget -= this.costs[fuelType] * 1000;
  
          // Check if the budget has been exceeded
          if (this.budget < 0) {
              console.log('Budget exceeded!');
              return;
          }

 
        this.force = 0.0;
        this.fuelWeight = 0.0;

        if (fuelType === "hydrogen") {
            this.force = 2500;  // Example force value
            this.fuelWeight = 40.0; 
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
        this.checkIfWon();

        if (!this.inFlight) {
            console.log("NOT IN FLIGHT!");
            return;
            paper.view.update(); // Update the view
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
        if (!this.inFlight) {
            this.inFlight = true;
            this.animate();
        }
    }
 
    stopSimulation() {
        this.inFlight = false;
    }


    setPreLaunch() {
        this.statusText.content = 'PRE LAUNCH';
        this.statusText.position = new paper.Point(this.canvas.width / 2, this.canvas.height - 150);
    }

    setIsLaunching() {
        this.statusText.content = 'IS LAUNCHING';
        this.statusText.position = new paper.Point(this.canvas.width / 2, this.canvas.height - 150);
    }

    setInFlight() {
        this.statusText.content = 'IN FLIGHT';
        this.statusText.position = new paper.Point(this.canvas.width / 2, this.canvas.height - 150);
    }

    setWin() {
        this.statusText.content = 'WIN';
        this.statusText.position = new paper.Point(this.canvas.width / 2, this.canvas.height - 150);
    }
 
    setLoss() {
        this.statusText.content = 'LOSS';
        this.statusText.position = new paper.Point(this.canvas.width / 2, this.canvas.height - 150);
    }

    launch() {
        this.setIsLaunching();
        setTimeout(() => {
            this.isLaunchingCallback();
        }, 1);
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
            return this.getGravityForce() / (this.rocketWeight);
        }
    }
 
    getNewSpeed() {
        console.log('before get speed, init speed = ' + String(this.speed));
        this.speed += this.calculateAcceleration();
        this.speed += this.calculateAcceleration();
    this.speedText.content = 'Speed: ' + Math.round(this.speed);
    }

    checkIfWon() {
        if(this.distance >= this.ESCAPE_ALTITUDE && this.speed >= this.ESCAPE_SPEED) {
            this.setWin();
            this.stopSimulation();
        } else if (this.speed <= this.ESCAPE_SPEED && this.calculateAcceleration() <= 0){
            this.setLoss();
            this.stopSimulation();
        }
    }

 }

 
export default Rocket; 