// scripts.js
let counter = 0; // Initialize the counter

function incrementCounter() {
  counter++; // Increment the counter
//   counter = counter + 1;
  updateCounterDisplay(); // Update the display
}

function updateCounterDisplay() {
  const counterDisplay = document.getElementById('counter-display');
  counterDisplay.textContent = counter;
}
