paper.setup('myCanvas');

var circle = new paper.Path.Circle({
    center: new paper.Point(100, 100),
    radius: 50,
    fillColor: 'red'
});

var direction = 1; // 1 for right, -1 for left
var speed = 2; // Adjust the speed as needed

function animateCircle() {
    if (circle.position.x + circle.bounds.width / 2 >= paper.view.size.width) {
        direction = -1; // Change direction to left
    } else if (circle.position.x - circle.bounds.width / 2 <= 0) {
        direction = 1; // Change direction to right
    }

    circle.position.x += direction * speed; // Move the circle
    paper.view.update(); // Update the view
    requestAnimationFrame(animateCircle); // Repeat the animation
}

animateCircle(); // Start the animation