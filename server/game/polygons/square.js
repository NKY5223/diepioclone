const Game = require("../game");
const Vector = require("../vector");
const Polygon = require("./polygon");

class Square extends Polygon {
    /** @param {Game} game */
    constructor(pos = new Vector(), vel = new Vector(), angle = 0, angVel = 0, game) {
        super(pos, vel, 1, 15, angle, angVel, 10, 2, "square", game);
    }
}

module.exports = Square;