import Vector from "./vector.js";
import Boid from "./boid.js";

const canvas = document.getElementById('boidCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 400;

/*    update() {
        if (this.position.x > canvas.width) this.position.x = 0;
        if (this.position.x < 0) this.position.x = canvas.width;
        if (this.position.y > canvas.height) this.position.y = 0;
        if (this.position.y < 0) this.position.y = canvas.height;
    }
*/

const flock = [];
const numBoids = 100;

for (let i = 0; i < numBoids; i++) {
    flock.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let boid of flock) {
        boid.flock(flock);
        boid.update();
        boid.draw();
    }

    requestAnimationFrame(animate);
}

animate();
