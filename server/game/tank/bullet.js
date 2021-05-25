const Entity = require("../entity");
const Game = require("../game");
const Vector = require("../vector");

class Bullet extends Entity {
    /** @param {Game} game */
    constructor(pos = new Vector(), vel = new Vector(), mass = 10, radius = 5, hp = 20, damage = 20, decay = 2500, id = 0, game) {
        super(pos, vel, mass, radius, 0, 0, hp, damage, "bullet", game);
        this.friction = 0.999;
        this.decay = Date.now() + decay;
        this.id = id;
    }
    update() {
        if (Date.now() >= this.decay) {
            this.remove();
            return;
        }
        super.update();
    }
    /** @param {Entity} other */
    collide(other) {
        if (other === this) return;
        if (other.type === "tank" && other.id === this.id) return;
        if (other.type === "bullet" && other.id === this.id) return;

        if (other.type !== "bullet") {
            let relPos = other.pos.minus(this.pos);
            if (relPos.mag2 >= (this.radius + other.radius) * (this.radius + other.radius)) return;

            this.applyForce(relPos.norm(relPos.mag - this.radius - other.radius).scale(0.1 * other.mass));
        }

        if ((this.hp -= other.damage) <= 0) this.remove();
    }
    remove() {
        this.game.bullets.splice(this.game.bullets.indexOf(this), 1);
        super.remove();
    }
}

module.exports = Bullet;