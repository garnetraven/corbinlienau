import Vector from "./vector.js";

const canvas = document.getElementById('boidCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 400;

class Boid {
    constructor(x, y) {
        this.position = new Vector(x, y);
        this.velocity = Vector.random();
        this.acceleration = new Vector(0, 0);
        this.maxForce = 0.2;
        this.maxSpeed = 4;
        this.size = 6;
        this.alignmentRadius = 50;
        this.cohesionRadius = 100;
        this.separationRadius = 50;
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.multiply(0);
        
        if (this.position.x > canvas.width) {
            this.position.x = 0;
        }

        if (this.position.x < 0) {
            this.position.x = canvas.width;
        }

        if (this.position.y > canvas.height) {
            this.position.y = 0;
        }

        if (this.position.y < 0) {
            this.position.y = canvas.height;
        }
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
        let steering = new Vector(0, 0); 
        let total = 0;

        for (let other of boids) {
            let d = this.position.distance(other.position);
            if (other != this && d < this.alignmentRadius) {
                steering.add(this.velocity);
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
        let steering = new Vector(0, 0); 
        let total = 0;
        
        for (let other of boids) {
            let d = this.position.distance(other.position);
            if (other != this && d < this.cohesionRadius) {
                steering.add(other.position);
                total++;
            }
        }

        if (total > 0) {
            steering.divide(total);
            steering.subtract(this.position);
            steering.setMagnitude(this.maxSpeed);
            steering.subtract(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    separation(boids) {
        let steering = new Vector(0, 0); 
        let total = 0;
        
        for (let other of boids) {
            let d = this.position.distance(other.position);
            if (other != this && d < this.separationRadius) {
                let diff = Vector.subtract(this.position, other.position);
                diff.divide(d ** 2);
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

export default Boid;
