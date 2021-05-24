/** @type {Object<string, { points: [number, number][], stroke: string, fill: string }>} */
const polygonDatas = {
    square: {
        points: [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1]
        ],
        stroke: "#bfae4e",
        fill: "#ffe46b"
    }
};
const colors = {
    blue: {
        stroke: "#0083a8",
        fill: "#00b0e1"
    },
    red: {
        stroke: "#b33b3f",
        fill: "#f04f54"
    },
    barrel: {
        stroke: "#727272",
        fill: "#999999"
    },
    hp: {
        background: "#ffffff",
        fill: "#86c280"
    }
};

function render() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (!state) return;

    ctx.translate(canvas.width / 2 - state.x, canvas.height / 2 - state.y);

    ctx.fillStyle = "#404040";
    ctx.fillRect(0, 0, state.w, state.h);

    for (let polygon of state.entities.polygons) {
        if (polygon.type in polygonDatas) {
            const polygonData = polygonDatas[polygon.type];

            ctx.save();

            ctx.translate(polygon.x, polygon.y);
            ctx.rotate(polygon.angle);

            ctx.fillStyle = polygonData.fill;
            ctx.beginPath();

            for (let i in polygonData.points) {
                i = Number(i);
                let point = polygonData.points[i];
                if (i) {
                    ctx.lineTo(polygon.radius * point[0], polygon.radius * point[1]);
                } else {
                    ctx.moveTo(polygon.radius * point[0], polygon.radius * point[1]);
                }
            }
            ctx.fill();

            ctx.strokeStyle = polygonData.stroke;
            ctx.beginPath();

            for (let i in polygonData.points) {
                i = Number(i);
                let point = polygonData.points[i];
                let lastPoint = polygonData.points[(i + 1) % polygonData.points.length];

                ctx.moveTo(polygon.radius * lastPoint[0], polygon.radius * lastPoint[1]);
                ctx.lineTo(polygon.radius * point[0], polygon.radius * point[1]);

                ctx.stroke();
            }

            ctx.restore();
        } else {
            ctx.fillStyle = "#e0e0e0";
            ctx.strokeStyle = "#c0c0c0";

            ctx.beginPath();
            ctx.ellipse(polygon.x, polygon.y, polygon.radius, polygon.radius, polygon.angle, 0, 7);
            ctx.fill();
            ctx.stroke();
        }
        ctx.save();
        ctx.translate(polygon.x, polygon.y);

        ctx.lineWidth = 10;
        ctx.strokeStyle = colors.hp.background;
        ctx.beginPath();
        ctx.moveTo(-20, polygon.radius + 10);
        ctx.lineTo(20, polygon.radius + 10);
        ctx.stroke();

        ctx.lineWidth = 6;
        ctx.strokeStyle = colors.hp.fill;
        ctx.beginPath();
        ctx.moveTo(-20, polygon.radius + 10);
        ctx.lineTo((polygon.hp / polygon.maxHp) * 40 - 20, polygon.radius + 10);
        ctx.stroke();

        ctx.restore();
    }

    setColor(colors.red);
    for (let bullet of state.entities.bullets) {
        if (bullet.id === state.id) {
            ctx.save();
            setColor(colors.blue);

            ctx.beginPath();
            circle(bullet.x, bullet.y, bullet.r);
            ctx.fill();
            ctx.stroke();

            ctx.restore();
        } else {
            ctx.beginPath();
            circle(bullet.x, bullet.y, bullet.r);
            ctx.fill();
            ctx.stroke();
        }
    }

    for (let tank of state.entities.tanks) {
        ctx.save();

        if (tank.id === state.id) setColor(colors.blue);

        ctx.translate(tank.x, tank.y);
        ctx.rotate(tank.angle);

        for (let barrel of tank.barrels) {
            ctx.save();
            setColor(colors.barrel);

            ctx.rotate(barrel.angle);

            ctx.beginPath();
            ctx.rect(barrel.x - barrel.w / 2, barrel.y - barrel.h / 2, barrel.w, barrel.h);
            ctx.stroke();
            ctx.fill();

            ctx.restore();
        }

        ctx.beginPath();
        circle(0, 0, tank.radius);
        ctx.fill();
        ctx.stroke();

        ctx.rotate(-tank.angle);

        ctx.lineWidth = 10;
        ctx.strokeStyle = colors.hp.background;
        ctx.beginPath();
        ctx.moveTo(-20, tank.radius + 10);
        ctx.lineTo(20, tank.radius + 10);
        ctx.stroke();

        ctx.lineWidth = 6;
        ctx.strokeStyle = colors.hp.fill;
        ctx.beginPath();
        ctx.moveTo(-20, tank.radius + 10);
        ctx.lineTo((tank.hp / tank.maxHp) * 40 - 20, tank.radius + 10);
        ctx.stroke();

        ctx.restore();
    }
}
/** @param {{ stroke?: string, fill?: string }} obj */
function setColor(obj = { stroke: "#000000", fill: "#202020" }) {
    ctx.strokeStyle = obj.stroke ?? "#000000";
    ctx.fillStyle = obj.fill ?? "#202020";
}
/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} r 
 */
function circle(x = 0, y = 0, r = 10) {
    ctx.ellipse(x, y, r, r, 0, 0, 7);
}