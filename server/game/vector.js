class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(vec = new Vector(), set = false) {
        if (set) {
            this.x += vec.x;
            this.y += vec.y;
            return this;
        } else {
            return new Vector(this.x + vec.x, this.y + vec.y);
        }
    }
    minus(vec = new Vector(), set = false) {
        if (set) {
            this.x -= vec.x;
            this.y -= vec.y;
            return this;
        } else {
            return new Vector(this.x - vec.x, this.y - vec.y);
        }
    }
    scale(scalar = 1, set = false) {
        if (set) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        } else {
            return new Vector(this.x * scalar, this.y * scalar);
        }
    }
    norm(mag = 1, set = false) {
        let oMag = this.mag;
        if (set) {
            if (oMag) {
                this.scale(mag / oMag, true);
            } else {
                this.set(mag);
            }
            return this;
        } else {
            if (oMag) {
                return this.scale(mag / oMag);
            } else {
                return new Vector(mag);
            }
        }
    }

    dot(vec = new Vector()) {
        return this.x * vec.x + this.y * vec.y;
    }
    set(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        return this;
    }
    get mag2() {
        return this.x * this.x + this.y * this.y;
    }
    get mag() {
        return Math.sqrt(this.mag2);
    }
    
    static random(mag = 1) {
        let a = Math.random() * 2 * Math.PI;
        return new Vector(mag * Math.cos(a), mag * Math.sin(a));
    }
    static randomRect(x = 1, y = 1) {
        return new Vector(Math.random() * x, Math.random() * y);
    } 
}
module.exports = Vector;