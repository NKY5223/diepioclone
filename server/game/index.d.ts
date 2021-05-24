import Vector from "../utils/vector";

export class Entity {
    constructor(pos?: Vector, vel?: Vector, radius?: number, angle?: number, angleVel?: number, hp?: number, damage?: number, type?: string, game?: Game);

    update(): void;
    accelerate(vec: Vector): void;
    collide(other: Entity): void;
    remove(): void;

    pos: Vector;
    vel: Vector;
    accel: Vector;
    radius: number;
    angle: number;
    angleVel: number;
    type: string;
    game: Game;
}

export class Polygon extends Entity {
    constructor(pos?: Vector, vel?: Vector, mass?: number, angle?: number, angleVel?: number, radius?: number, polygonType?: string, game?: Game);

    desiredVel: Vector;
    polygonType: string;
}

export class Bullet extends Entity {}
export class Tank extends Entity {}

export class Game {
    constructor();

    addEntity(pos?: Vector, vel?: Vector, mass?: number, radius?: number): Entity;
    addTank(pos?: Vector): Tank;
    update(): void;

    entities: Entity[];
    polygons: Polygon[];
    bullets: Bullet[];
}