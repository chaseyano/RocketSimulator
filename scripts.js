import Rocket from "./rocket.js";
import { budget, materialPrices, fuelPrices } from './buyables.js';
var money = budget;

document.addEventListener('DOMContentLoaded', () => {
    // This code will run once the DOM is fully loaded
    function resizeCanvas() {
        const canvasElement = document.getElementById('myCanvas');

        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight - 50; // leaving 50px gap at the bottom for UI elements
        const myRocket = new Rocket('myCanvas', 'titanium', 'hydrogen');
    }

    // Initial resize
    resizeCanvas();

    // Resize canvas on window resize
    window.addEventListener('resize', resizeCanvas);

    const myRocket = new Rocket('myCanvas', 'titanium', 'hydrogen'); // this is just to clear the screen.

    document.getElementById('launchButton').addEventListener('click', () => {
        if (getUpdatedBudget() >= 0 && areAllSelected()) {
            const materialSelect = document.getElementById('material');
            const fuelSelect = document.getElementById('fuelType');
            const material = materialSelect.value;
            const fuel = fuelSelect.value;
            const myRocket = new Rocket('myCanvas', material, fuel); 
            myRocket.launch();
        } else {showModal("Negative budget or not all selected.")}
    });

    document.getElementById('resetButton').addEventListener('click', () => {
        const myRocket = new Rocket('myCanvas', 'titanium', 'hydrogen'); // this is just to clear the screen.
        // won't get launched
    });

    const budgetDisplay = document.getElementById('budgetAmount');
    budgetDisplay.textContent = budget.toString();

    const materialSelect = document.getElementById('material');
    const fuelSelect = document.getElementById('fuelType');

    // Event Listeners for Dropdowns
    materialSelect.addEventListener('change', updateBudgetDisplay);
    fuelSelect.addEventListener('change', updateBudgetDisplay);
    populateDropdown('material', materialPrices);
    populateDropdown('fuelType', fuelPrices);


    function populateDropdown(dropdownId, prices) {
        const select = document.getElementById(dropdownId);
        for (const [key, value] of Object.entries(prices)) {
            let option = document.createElement('option');
            option.value = key;
            option.text = `${capitalizeFirstLetter(key)} - $${value}`;
            select.appendChild(option);
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getUpdatedBudget() {
        let selectedMaterial = materialSelect.value;
        let selectedFuel = fuelSelect.value;
        let totalCost = 0;
        totalCost += selectedMaterial !== 'none' ? materialPrices[selectedMaterial] : 0;
        totalCost += selectedFuel !== 'none' ? fuelPrices[selectedFuel] : 0;

        let updatedBudget = budget - totalCost;
        return updatedBudget;
    }

    function areAllSelected() {
        let selectedMaterial = materialSelect.value;
        let selectedFuel = fuelSelect.value;
        return selectedMaterial !== 'none' && selectedFuel !== 'none';
    }

    function updateBudgetDisplay() {
        let updatedBudget = getUpdatedBudget();
        budgetDisplay.textContent = updatedBudget.toString();
    }

    const slider = document.getElementById("myRange");
    const output = document.getElementById("sliderValue");
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        output.innerHTML = this.value;
    }

    // Function to show the modal
function showModal(message) {
    let modal = document.getElementById("myModal");
    let span = document.getElementsByClassName("close")[0];
    let modalText = document.getElementById("modalText");

    modalText.textContent = message;
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

});
