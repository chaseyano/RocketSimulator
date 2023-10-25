
// // adds two numbers together and divides them by 2
// function addTogetherAndDivideByTwo(x, y) {
//     let sum = x + y;
//     let quotient = sum / 2;
//     return quotient;
// }

// console.log("result of (3 + 5) / 2" + addTogetherAndDivideByTwo(3,5));

providedInput = "spti"

function decideOnDinner(input) {
    if (input === "tacos") {
        console.log("let's eat tacos")
        return;
    }
    if (input === "spaghetti") {
        console.log("let's eat pasta");
        return;
    }
    console.log("i'm not hungry");
}
decideOnDinner(providedInput);