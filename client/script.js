/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/** @type {State} */
let state = null;

const ws = new WebSocket(location.href.replace(/^http/, "ws"));
ws.binaryType = "arraybuffer";
ws.addEventListener("open", () => {
    window.requestAnimationFrame(function run() {
        render();
        window.requestAnimationFrame(run);
    });
});
ws.addEventListener("close", () => {
    location.reload();
});
ws.addEventListener("message", e => {
    /** @type {{e: string}} */
    const msg = msgpack.decode(new Uint8Array(e.data));
    if (msg.state) state = msg.state;
});

const controls = ["w", "a", "s", "d"];
document.addEventListener("keydown", e => {
    if (e.repeat) return;

    let s = e.key.toLowerCase();
    if (controls.includes(s)) {
        send({
            key: controls.indexOf(s),
            down: true
        });
    }
});
document.addEventListener("keyup", e => {
    let s = e.key.toLowerCase();
    if (controls.includes(s)) {
        send({
            key: controls.indexOf(s),
            down: false
        });
    }
});
document.addEventListener("mousemove", e => {
    send({
        aim: {
            x: e.pageX - window.innerWidth / 2,
            y: e.pageY - window.innerHeight / 2
        }
    });
});

function send(msg) {
    if (ws.readyState === ws.OPEN) ws.send(msgpack.encode(msg));
}