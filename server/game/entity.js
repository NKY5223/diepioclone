const Game = require("./game");
const Vector = require("./vector");

class Entity {
    /** @param {Game} game */
    constructor(pos = new Vector(), vel = new Vector(), mass = 1, radius = 10, angle = 0, angleVel = 0, hp = 100, damage = 10, type = "entity", game) {
        this.pos = pos;
        this.vel = vel;
        this.accel = new Vector();

        this.mass = mass;
        this.radius = radius;
        this.angle = angle;
        this.angleVel = angleVel;

        this.maxHp = this.hp = hp;
        this.damage = damage;

        this.type = type;
        this.game = game;

        this.friction = 0.9;
    }
    update() {
        this.pos.add(this.vel.add(this.accel, true).scale(this.friction, true), true);
        this.accel.set();

        this.angle += this.angleVel;
        this.angle %= 2 * Math.PI;

        if (this.pos.x < 0 || this.pos.x > this.game.w || this.pos.y < 0 || this.pos.y > this.game.h) {
            this.remove();
        }
    }
    accelerate(vec = new Vector()) {
        this.accel.add(vec, true);
    }
    applyForce(vec = new Vector()) {
        this.accelerate(vec.scale(1 / this.mass));
    }

    /** @param {Entity} other */
    collide(other) {
        if (other === this) return;

        let relPos = other.pos.minus(this.pos);
        if (relPos.mag2 >= (this.radius + other.radius) * (this.radius + other.radius)) return;

        this.accelerate(relPos.norm(relPos.mag - this.radius - other.radius).scale(0.2 * other.mass / this.mass));

        if (this.type !== other.type && (this.hp -= other.damage) <= 0) this.remove();
    }
    remove() {
        this.game.entities.splice(this.game.entities.indexOf(this), 1);
    }
}

module.exports = Entity;