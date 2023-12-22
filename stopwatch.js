class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.running = false;
    }

    start() {
        if (!this.running) {
            this.startTime = Date.now() - this.elapsedTime;
            this.running = true;
            this.interval = setInterval(() => {
                this.elapsedTime = Date.now() - this.startTime;
            }, 10);
        }
    }

    stop() {
        if (this.running) {
            clearInterval(this.interval);
            this.elapsedTime = Date.now() - this.startTime;
            this.running = false;
        }
    }

    reset() {
        this.elapsedTime = 0;
        if (!this.running) {
            this.startTime = Date.now();
        }
    }

    get time() {
        return this.formatTime(this.elapsedTime);
    }

    formatTime(time) {
        let date = new Date(time);
        let mins = date.getUTCMinutes().toString().padStart(2, '0');
        let secs = date.getUTCSeconds().toString().padStart(2, '0');
        let ms = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
        return `${mins}:${secs}.${ms}`;
    }
}

export default Stopwatch;