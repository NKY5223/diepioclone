const path = require("path");

const app = require("express")();
app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
}).get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", req.path));
});

const server = app.listen("80");
server.on("listening", () => {
    console.log("Listening");
});

const game = new (require("./game/game"))(2000, 2000);
const Vector = require("./game/vector");

// Spawn polygons
for (let i = 0; i < 100; i++) {
    game.addSquare(
        Vector.randomRect(game.w, game.h),
        Vector.random(0.1),
        Math.random() * 2 * Math.PI,
        Math.random() / 100
    )
}

const wss = new (require("ws").Server)({ server });
const msgpack = require("msgpack-lite");
/** @type {{ws: WebSocket, tank: Tank}[]} */
const clients = [];

wss.on("connection", ws => {
    console.log("WebSocket connected");
    ws.binaryType = "arraybuffer";

    const tank = game.addTank();

    const client = { ws, tank };
    clients.push(client);

    ws.on("message", e => {
        const msg = msgpack.decode(new Uint8Array(e));
        if (typeof msg.key === "number") {
            tank.keys[["up", "left", "down", "right"][msg.key]] = Boolean(msg.down);
        }
        if (typeof msg.aim === "object" && typeof msg.aim.x === "number" && typeof msg.aim.y === "number") {
            tank.angle = Math.atan2(msg.aim.y, msg.aim.x);
        }
    });

    ws.on("close", () => {
        console.log("WebSocket closed");
        clients.splice(clients.indexOf(client), 1);
        tank.remove();
    });
});

const Loop = require("accurate-game-loop");
const Tank = require("./game/tank/tank");
const loop = new Loop(
    () => {
        game.update();
        const entities = {
            polygons: game.polygons.map(polygon => ({
                x: polygon.pos.x,
                y: polygon.pos.y,
                radius: polygon.radius,
                angle: polygon.angle,
                type: polygon.polygonType,
                hp: polygon.hp,
                maxHp: polygon.maxHp
            })),
            bullets: game.bullets.map(bullet => ({
                x: bullet.pos.x,
                y: bullet.pos.y,
                radius: bullet.radius,
                id: bullet.id
            })),
            tanks: game.tanks.map(tank => ({
                x: tank.pos.x,
                y: tank.pos.y,
                angle: tank.angle,
                radius: tank.radius,
                barrels: tank.barrels.map(barrel => ({
                    x: barrel.pos.x,
                    y: barrel.pos.y,
                    w: barrel.w,
                    h: barrel.h,
                    angle: barrel.angle
                })),
                hp: tank.hp,
                maxHp: tank.maxHp,
                id: tank.id
            }))
        };
        for (let client of clients) {
            if (client.ws.readyState === client.ws.OPEN) {
                let statemsg = msgpack.encode({
                    state: {
                        entities,
                        x: client.tank.pos.x,
                        y: client.tank.pos.y,
                        w: game.w,
                        h: game.h,
                        id: client.tank.id
                    }
                });
                client.ws.send(statemsg);
            }
        }
    },
    60
);
loop.start();