// Mr. JPrograms is the creator of this idea. See: https://www.khanacademy.org/computer-programming/color-pop/6416482056208384

const s = 1; // node width and height
const clrOff = 20; // 0 to 255, how much the color can change between nodes

const dirs = [[-1, 0], [0, -1], [1, 0], [0, 1]];

const Node = (x, y, r, g, b) => {
    return {
        x: x,
        y: y,
        r: r,
        g: g,
        b: b
    };
};
const rand = max => Math.random() * max | 0;
const constrain = (v, min, max) => (v < min ? min : (v > max ? max : v));
const adjustColor = cc => constrain(cc + rand(clrOff * 2 + 1) - clrOff, 0, 255);
const setNode = a => {
    ctx.fillStyle = `rgb(${a.r = adjustColor(a.r)}, ${a.g = adjustColor(a.g)}, ${a.b = adjustColor(a.b)})`;
    ctx.fillRect(a.x * s, a.y * s, s, s);
    for (const [x, y] of dirs) {
        const px = a.x + x;
        const py = a.y + y;
        if (px >= 0 && px < cols && py >= 0 && py < rows) {
            const index = px + py * cols;
            const byte = index >> 3;
            const bit = 1 << (index & 7);
            if (!(filled[byte] & bit)) {
                list.push(Node(px, py, a.r, a.g, a.b));
                filled[byte] |= bit;
            }
        }
    }
};
const loop = () => {
    nodeProg += list.length / (2 * Math.PI);
    while (nodeProg > 1 && list.length) {
        nodeProg--;
        setNode(list.splice(rand(list.length), 1)[0]);
    }
    requestAnimationFrame(loop);
};
const init = () => {
    canvas = document.getElementById("canvas");
    cols = (canvas.width = innerWidth) / s | 0;
    rows = (canvas.height = innerHeight) / s | 0;
    ctx = canvas.getContext("2d");
    filled = new Uint8Array(Math.ceil(cols * rows / 8));
    const first = Node(rand(cols), rand(rows), rand(256), rand(256), rand(256));
    setNode(first);
    loop();
};

let canvas;
let cols;
let rows;
let ctx;
let filled;
let list = [];
let nodeProg = 0;

document.addEventListener("DOMContentLoaded", init);
