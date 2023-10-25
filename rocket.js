class Rocket {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.direction = -1; // -1 for up, 1 for down
        this.isAnimating = false;
        console.log(this.canvas);


        paper.setup(this.canvas);

        this.rocketShape = new paper.Path.Rectangle({
            point: [this.canvas.width / 2 - 50, this.canvas.height - 150], // Positioned at the bottom and centered horizontally
            size: [100, 50],
            fillColor: 'blue'
        });
    }

    animate() {
        if (!this.isAnimating) {
            return;
        }

        const speedElement = document.getElementById('speedInput');
        if (speedElement) {
            let speed = Number(speedElement.value);

            if (this.rocketShape.position.y - this.rocketShape.bounds.height / 2 <= 0) {
                this.direction = 1; // Change direction to down
            } else if (this.rocketShape.position.y + this.rocketShape.bounds.height / 2 >= paper.view.size.height) {
                this.direction = -1; // Change direction to up
            }

            this.rocketShape.position.y += this.direction * speed; // Move the rocket vertically
            paper.view.update(); // Update the view
            requestAnimationFrame(this.animate.bind(this)); // Bind 'this' to ensure correct context
        }
    }

    startAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animate();
        }
    }

    stopAnimation() {
        this.isAnimating = false;
    }
}

export default Rocket;
