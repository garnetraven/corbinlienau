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
        return Math.sqrt((this.x ** 2) + (this.y ** 2));
    }

    setMagnitude(mag) {
        let m = this.magnitude()
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
        return Math.sqrt((dx ** 2) + (dy ** 2));
    }

    static subtract(v1, v2) {
       return new Vector(v1.x - v2.x, v1.y - v2.y); 
    }

    static random() {
        return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
    }
}

export default Vector;

