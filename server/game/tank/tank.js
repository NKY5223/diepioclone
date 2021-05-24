const Entity = require("../entity");
const Vector = require("../vector");
const Barrel = require("./barrel");

class Tank extends Entity {
    constructor(pos = new Vector(), vel = new Vector(), mass = 3, radius = 30, angle = 0, hp = 100, damage = 10, id = 0, game) {
        super(pos, vel, mass, radius, angle, 0, hp, damage, "tank", game);
        this.barrels = [
            new Barrel(
                new Vector(20, 0), // pos
                1000, // cd
                30, 15, // size
                0, // angle
                {
                    speed: 3,
                    mass: 1,
                    damage: 5,
                    hp: 10
                }, // stats
                this
            )
        ];

        // Octo tank
        // this.barrels = new Array(10).fill(0).map((_v, i, a) => 
        //     new Barrel(
        //         new Vector(20, 0), // pos
        //         100, // cd
        //         30, 15, // size
        //         Math.PI * 2 * i / a.length, // angle
        //         {
        //             speed: 3,
        //             mass: 2,
        //             damage: 5,
        //             hp: 5
        //         }, // stats
        //         this
        //     )
        // );

        this.keys = {
            up: false,
            left: false,
            down: false,
            right: false
        };
        this.friction = 0.9;
        this.speed = 0.25;
        this.id = id;
    }
    update() {
        for (let barrel of this.barrels) {
            barrel.update();
        }

        let movement = new Vector(
            this.keys.right - this.keys.left,
            this.keys.down - this.keys.up
        );
        if (movement.mag2) this.accelerate(movement.norm(this.speed));

        this.pos.add(this.vel.add(this.accel, true).scale(this.friction, true), true);
        this.accel.set();

        this.angle += this.angleVel;
        this.angle %= 2 * Math.PI;

        this.pos.x = Math.max(0, Math.min(this.pos.x, this.game.w));
        this.pos.y = Math.max(0, Math.min(this.pos.y, this.game.h));
    }
    /** @param {Entity} other */
    collide(other) {
        if (other === this) return;
        if (other.type === "bullet" && other.id === this.id) return;

        let relPos = other.pos.minus(this.pos);
        if (relPos.mag2 >= (this.radius + other.radius) * (this.radius + other.radius)) return;

        this.accelerate(relPos.norm(relPos.mag - this.radius - other.radius).scale(0.2 * other.mass / this.mass));

        if ((this.hp -= other.damage) <= 0) this.remove();
    }
    remove() {
        this.game.tanks.splice(this.game.tanks.indexOf(this), 1);
        super.remove();
    }
}

module.exports = Tank;