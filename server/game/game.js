const Polygon = require("./polygons/polygon");
const Square = require("./polygons/square");
const Bullet = require("./tank/bullet");
const Tank = require("./tank/tank");
const Vector = require("./vector");

class Game {
    constructor(w = 500, h = 500) {
        /** @type {Polygon[]} */
        this.polygons = [];
        /** @type {Entity[]} */
        this.entities = [];
        /** @type {Bullet[]} */
        this.bullets = [];
        /** @type {Tank[]} */
        this.tanks = [];

        this.w = w;
        this.h = h;

        this.idCounter = 0;
    }
    addSquare(pos = new Vector(), vel = new Vector(), angle = 0, angleVel = 0) {
        let square = new Square(pos, vel, angle, angleVel, this);
        this.polygons.push(square);
        this.entities.push(square);

        return square;
    }
    addTank(pos = Vector.randomRect(this.w, this.h)) {
        let tank = new Tank(
            pos, // pos
            new Vector(), // vel
            2, // mass
            20, // radius
            0, // angle
            100, // hp
            2, // damage,
            this.idCounter++, // id
            this // game
        );
        this.tanks.push(tank);
        this.entities.push(tank);

        return tank;
    }
    update() {
        for (let entity of this.entities) {
            for (let other of this.entities) {
                entity.collide(other);
            }
        }
        for (let entity of this.entities) {
            entity.update();
        }
    }
}
module.exports = Game;