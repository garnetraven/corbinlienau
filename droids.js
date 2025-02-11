const canvas = document.getElementById('boidCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 400;

class Boid {
    constructor(x, y) {
        this.position = new Vector(x, y);
        this.velocity = Vector.random();
        this.acceleration = new Vector(0, 0);
        this.maxForce = 0.15;
        this.maxSpeed = 6;
        this.size = 6;
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.multiply(0);

        // Wrap around screen edges
        if (this.position.x > canvas.width) this.position.x = 0;
        if (this.position.x < 0) this.position.x = canvas.width;
        if (this.position.y > canvas.height) this.position.y = 0;
        if (this.position.y < 0) this.position.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = "#4361ee";
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(Math.atan2(this.velocity.y, this.velocity.x));
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        ctx.lineTo(-this.size, this.size / 2);
        ctx.lineTo(-this.size, -this.size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    flock(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }

    align(boids) {
        let perceptionRadius = 50;
        let steering = new Vector(0, 0);
        let total = 0;
        for (let other of boids) {
            let d = this.position.distance(other.position);
            if (other != this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.divide(total);
            steering.setMagnitude(this.maxSpeed);
            steering.subtract(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    cohesion(boids) {
        let perceptionRadius = 80;
        let steering = new Vector(0, 0);
        let total = 0;
        for (let other of boids) {
            let d = this.position.distance(other.position);
            if (other != this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.divide(total);
            steering.subtract(this.position);
            steering.setMagnitude(this.maxSpeed);
            steering.subtract(this.velocity);
            steering.limit(this.maxForce * 0.9);
        }
        return steering;
    }

    separation(boids) {
        let perceptionRadius = 50;
        let steering = new Vector(0, 0);
        let total = 0;
        for (let other of boids) {
            let d = this.position.distance(other.position);
            if (other != this && d < perceptionRadius) {
                let diff = Vector.subtract(this.position, other.position);
                diff.divide(d * d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.divide(total);
            steering.setMagnitude(this.maxSpeed);
            steering.subtract(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    multiply(n) {
        this.x *= n;
        this.y *= n;
    }

    divide(n) {
        this.x /= n;
        this.y /= n;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    setMagnitude(mag) {
        let m = this.magnitude();
        if (m !== 0) {
            this.multiply(mag / m);
        }
    }

    limit(max) {
        if (this.magnitude() > max) {
            this.setMagnitude(max);
        }
    }

    distance(v) {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static subtract(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static random() {
        return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
    }
}

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
