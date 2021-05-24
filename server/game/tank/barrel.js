const Vector = require("../vector");
const Bullet = require("./bullet");
const Tank = require("./tank");

class Barrel {
    /** @param {Tank} tank */
    constructor(pos = new Vector(), cd = 100, w = 10, h = 15, angle = 0, bulletStats = { speed: 1, mass: 10, damage: 20, hp: 20 }, tank) {
        this.pos = pos;
        this.cd = cd;
        this.w = w;
        this.h = h;
        this.angle = angle;

        this.bulletRadius = this.h / 2;
        this.bulletSpeed = bulletStats.speed;
        this.bulletMass = bulletStats.mass;
        this.bulletDamage = bulletStats.damage;
        this.bulletHP = bulletStats.hp;

        this.nextFire = Date.now();
        this.tank = tank;
        this.game = tank.game;
    }
    update() {
        if (Date.now() < this.nextFire) return;
        this.nextFire += this.cd;
        this.fire();
    }
    fire() {
        let cos = Math.cos(this.tank.angle + this.angle);
        let sin = Math.sin(this.tank.angle + this.angle);

        let vel = new Vector(cos * this.bulletSpeed, sin * this.bulletSpeed);

        let bullet = new Bullet(
            new Vector(
                this.tank.pos.x + (this.pos.x + this.w / 2) * cos - this.pos.y * sin,
                this.tank.pos.y + (this.pos.x + this.w / 2) * sin + this.pos.y * cos
            ),
            vel,
            this.bulletMass,
            this.bulletRadius,
            this.bulletHP,
            this.bulletDamage,
            10000,
            this.tank.id,
            this.game
        );
        this.game.bullets.push(bullet);
        this.game.entities.push(bullet);

        this.tank.applyForce(vel.scale(-this.bulletMass * 0.01));
    }
}

module.exports = Barrel;