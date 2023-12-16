import Rocket from "./rocket.js";

// Set canvas size and position
var canvasElement = document.getElementById('myCanvas');
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight - 50; // leaving 50px gap at the bottom for UI elements

document.getElementById('launchButton').addEventListener('click', () => {
    const myRocket = new Rocket('myCanvas', 'titanium', 'hydrogen');

    myRocket.launch();
});

document.getElementById('endButton').addEventListener('click', () => {
    myRocket.stopAnimation();
});

document.getElementById('resetButton').addEventListener('click', () => {
    myRocket.reset();
});