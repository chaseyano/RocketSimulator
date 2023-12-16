import Rocket from "./rocket.js";

// Set canvas size and position
var canvasElement = document.getElementById('myCanvas');
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight - 50; // leaving 50px gap at the bottom for UI elements


const myRocket = new Rocket('myCanvas', 'titanium', 'hydrogen'); // this is just to clear the screen.

document.getElementById('launchButton').addEventListener('click', () => {
    // Get a reference to the select element
    const materialSelect = document.getElementById('material');
    const fuelSelect = document.getElementById('fuelType');

    // Get the selected value
    const material = materialSelect.value;
    const fuel = fuelSelect.value;
    const myRocket = new Rocket('myCanvas', material, fuel); 
    myRocket.launch();
});

document.getElementById('resetButton').addEventListener('click', () => {
    const myRocket = new Rocket('myCanvas', 'titanium', 'hydrogen'); // this is just to clear the screen.
    // won't get launched
});