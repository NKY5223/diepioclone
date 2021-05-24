const Entity = require("../entity");
const Game = require("../game");
const Vector = require("../vector");

class Polygon extends Entity {
    /** @param {Game} game */
    constructor(pos = new Vector(), vel = new Vector(), mass = 1, radius = 10, angle = 0, angleVel = 0, hp = 100, damage = 10, polygonType = "circle", game) {
        super(pos, vel, mass, radius, angle, angleVel, hp, damage, "polygon", game);
        
        this.polygonType = polygonType;

        this.friction = 0.9;
    }
    remove() {
        this.game.polygons.splice(this.game.polygons.indexOf(this), 1);
        super.remove();
    }
}

module.exports = Polygon;