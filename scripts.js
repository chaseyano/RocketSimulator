import Rocket from "./rocket.js";

// Set canvas size and position
var canvasElement = document.getElementById('myCanvas');
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight - 50; // leaving 50px gap at the bottom for UI elements


// Example Usage:
var myRocket = new Rocket('myCanvas', 'titanium', 'hydrogen');

document.getElementById('launchButton').addEventListener('click', () => {

    myRocket.launch();
});

document.getElementById('resetButton').addEventListener('click', () => {
        myRocket = new Rocket('myCanvas', 'titanium', 'hydrogen');

});