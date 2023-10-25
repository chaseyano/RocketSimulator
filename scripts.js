import Rocket from "./rocket.js";

// Set canvas size and position
var canvasElement = document.getElementById('myCanvas');
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight - 50; // leaving 50px gap at the bottom for UI elements


// Example Usage:
const myRocket = new Rocket('myCanvas');

document.getElementById('startButton').addEventListener('click', () => {
    myRocket.startAnimation();
});

document.getElementById('endButton').addEventListener('click', () => {
    myRocket.stopAnimation();
});