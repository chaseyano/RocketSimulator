import Stopwatch from "./stopwatch.js";
class Rocket {

    // m /s, m, N, m/s^2
    ANIMATION_STATES = ['PRE-LAUNCH','IS-LAUNCHING', 'IN-FLIGHT', 'WIN', 'LOST']
    ESCAPE_SPEED = 11200;
    ESCAPE_ALTITUDE = 160;
    SCALE = 1000000;
    ROCKET_WIDTH = 75;
    ROCKET_HEIGHT = 300;

    constructor(canvasId, material, fuelType) {
        this.rocketParts = []; // Array to hold references to rocket parts



        this.watch = new Stopwatch();
        this.animationFrameId = null; // Property to store the animation frame request ID

        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d'); // Initialize the context

        this.direction = 1; // -1 for up, 1 for down
        this.inFlight = false;
        this.hasLaunched = false;
 


        paper.setup(this.canvas);

        // Draw a blue rectangle with Paper.js
        var background = new paper.Path.Rectangle({
            point: [0, 0],
            size: [this.canvas.width, this.canvas.height],
            fillColor: 'blue'
        });
        // Canvas stuff
        this.context.fillStyle = 'blue';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.statusText = new paper.PointText(new paper.Point(this.canvas.width / 2, this.canvas.height - 150));
        this.statusText.content = 'Pre-launch';
        this.statusText.fillColor = 'black'; 

        this.animationState = this.ANIMATION_STATES[0];

        this.rocketWeight = 0.0;
        if (material === "titanium") {
            this.rocketWeight = 0.6 * this.SCALE;
        } else if (material === "aluminium") {
            this.rocketWeight = 50.0;
        } else if (material === "steel") {
            this.rocketWeight = 150.0;
        }
 
        this.speedText = new paper.PointText(new paper.Point(20, 20));
        this.speedText.content = 'Speed: 0';
        this.speedText.fillColor = 'black';

        this.stopwatchText = new paper.PointText(new paper.Point(20, 50));
        this.stopwatchText.content = 'Elapsed: 0';
        this.stopwatchText.fillColor = 'black';

        this.materialText = new paper.PointText(new paper.Point(20, 30));
        this.materialText.content = 'Material: ' + material;
        this.materialText.fillColor = 'black';

        this.fuelText = new paper.PointText(new paper.Point(20, 40));
        this.fuelText.content = 'Fuel: ' + fuelType;
        this.fuelText.fillColor = 'black';

        this.isLaunchingAnimationPlaying = false;  // Flag for tracking isLaunching animation


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
            this.force = 50 * this.SCALE;  // Example force value
            this.fuelWeight = 1.0 * this.SCALE; 
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
            this.weightLossConstant = 6500;
        }
        this.speed = 0.0;
        this.distance = 0.0;

        this.setPreLaunch();
    }
 

 
    animate() {
        this.checkIfWon();

        if (!this.inFlight) {
            console.log("NOT IN FLIGHT!");
            return;
            paper.view.update(); // Update the view
        }

        this.updateSpeedLabel();
        this.updateStopwatchLabel();


        this.loseWeight();
        if (this.distance >= 0) {
            console.log("position is above ground");
            console.log("A rocket shape position y -> " + String(this.distance) );
            console.log("this speed = " + String(this.speed));
            this.distance += this.speed; // Move the rocket vertically
            console.log("B rocket shape position y -> " + String(this.distance) );

        }
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this)); // Store the request ID

        paper.view.update(); 
    }
 
    startAnimation() {
        if (!this.inFlight) {
            this.inFlight = true;
            this.animate();
        }
    }
 
    drawRectangle(color) {
        // Assuming 'paper' is your drawing library and you have a 'canvas' defined
        let rect = new paper.Path.Rectangle({
            point: [this.canvas.width / 2 - 50, this.canvas.height / 2 - 25],
            size: [100, 50],
            fillColor: color
        });
        rect.position = new paper.Point(this.canvas.width / 2, this.canvas.height / 2);
    }

    drawRocket(x, y) {
        this.clearRocket();

        // Draw the body of the rocket
        let body = new paper.Path.Rectangle({
            point: [x, y + this.ROCKET_HEIGHT / 2],
            size: [this.ROCKET_WIDTH, this.ROCKET_HEIGHT / 2],
            fillColor: 'white'
        });
    
        const TOP_SHIFT = 54;
        // Draw the top of the rocket
        let top = new paper.Path.RegularPolygon({
            center: [x + this.ROCKET_WIDTH / 2, y + this.ROCKET_HEIGHT / 4 + TOP_SHIFT],
            sides: 3,
            radius: this.ROCKET_WIDTH / 2 * 1.185,
            fillColor: 'red'
        });

        let FIN_SHIFT = 18;
        // Draw the fins of the rocket
        let leftFin = new paper.Path({
            segments: [[x - FIN_SHIFT, y + this.ROCKET_HEIGHT], [x - FIN_SHIFT, y + this.ROCKET_HEIGHT * 3 / 4], [x - FIN_SHIFT + this.ROCKET_WIDTH / 4, y + this.ROCKET_HEIGHT]],
            closed: true,
            fillColor: 'grey'
        });
        let rightFin = new paper.Path({
            segments: [[x + this.ROCKET_WIDTH + FIN_SHIFT, y + this.ROCKET_HEIGHT], [x + this.ROCKET_WIDTH + FIN_SHIFT, y + this.ROCKET_HEIGHT * 3 / 4], [x + this.ROCKET_WIDTH * 3 / 4 + FIN_SHIFT, y + this.ROCKET_HEIGHT]],
            closed: true,
            fillColor: 'grey'
        });
    
        leftFin.scale(-1, 1, leftFin.bounds.center);
        rightFin.scale(-1, 1, rightFin.bounds.center);

        this.rocketParts.push(body, top, leftFin, rightFin);

    }
    clearRocket() {
        // Iterate over rocket parts and remove them
        this.rocketParts.forEach(part => part.remove());
        this.rocketParts = []; // Reset the array after clearing
    }
    
    stopSimulation() {
        this.watch.stop();
        this.inFlight = false;
        this.statusText.position = new paper.Point(this.canvas.width / 2, this.canvas.height - 150);
        this.drawRectangle('grey'); // Grey rectangle for 'STOPPED'
    }

    setPreLaunch() {
        this.statusText.content = 'PRE LAUNCH';
        this.statusText.position = new paper.Point(this.canvas.width / 2, this.canvas.height / 2);
        this.drawRocket(this.canvas.width / 2 - (this.ROCKET_WIDTH / 2) , this.canvas.height - this.ROCKET_HEIGHT); 
    }

    setIsLaunching() {
        this.clearRocket();
        this.statusText.content = 'IS LAUNCHING';
        this.statusText.position = new paper.Point(this.canvas.width / 2, this.canvas.height - 150);
        this.isLaunchingAnimationPlaying = true;
        this.drawRocket(this.canvas.width / 2 - (this.ROCKET_WIDTH / 2) , this.canvas.height / 2 - this.ROCKET_HEIGHT); 

        // Set a timeout to transition to inFlight after 1 second
        setTimeout(() => {
            if (this.isLaunchingAnimationPlaying) {
                this.setInFlight();
            }
        }, 1000); // 1 second delay
    }

    setInFlight() {
        if (!this.isLaunchingAnimationPlaying) {
            return; // Do not transition to inFlight if isLaunching animation is not playing
        }
        this.isLaunchingAnimationPlaying = false;
        this.statusText.content = 'IN FLIGHT';
        this.statusText.position = new paper.Point(this.canvas.width / 2, this.canvas.height - 150);
        this.drawRectangle('lightblue'); // Light blue rectangle for 'IN FLIGHT'
    }

    setWin() {
        this.statusText.content = 'WIN';
        this.statusText.position = new paper.Point(this.canvas.width / 2, this.canvas.height - 150);
        this.drawRectangle('gold'); // Gold rectangle for 'WIN'
    }

    setLoss() {
        this.statusText.content = 'LOSS';
        this.statusText.position = new paper.Point(this.canvas.width / 2, this.canvas.height - 150);
        this.drawRectangle('red'); // Red rectangle for 'LOSS'
    }
    launch() {
        if (!this.hasLaunched) {
            this.watch.start();
            const launchButton = document.getElementById('launchButton');
            launchButton.style.backgroundColor = 'gray';
            this.hasLaunched = true;
            this.setIsLaunching();
            setTimeout(() => {
                this.isLaunchingCallback();
            }, 1000); // Delay the isLaunchingCallback by 1 second (1000 milliseconds)
            this.startAnimation();
        }
    }
    
    isLaunchingCallback() {
        // Now this will be called after 1 second due to the change in launch()
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
 
    updateSpeedLabel() {
        console.log('before get speed, init speed = ' + String(this.speed));
        this.speed += this.calculateAcceleration();
        this.speed += this.calculateAcceleration();
        this.speedText.content = 'Speed: ' + Math.round(this.speed);
    }

    updateStopwatchLabel() {
        this.stopwatchText.content = 'Elapsed: ' + this.watch.time;
    }

    checkIfWon() {
        if (this.isLaunchingAnimationPlaying) {
            setTimeout(() => this.checkIfWon(), 100); // Check again after a short delay
            return;
        }

        if (this.distance >= this.ESCAPE_ALTITUDE && this.speed >= this.ESCAPE_SPEED) {
            this.setWin();
            this.stopSimulation();
        } else if (this.speed <= this.ESCAPE_SPEED && this.calculateAcceleration() <= 0) {
            this.setLoss();
            this.stopSimulation();
        }
    }

 }

 
export default Rocket; 