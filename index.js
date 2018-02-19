// Mr. JPrograms is the creator of this idea. See: https://www.khanacademy.org/computer-programming/color-pop/6416482056208384

const s = 1; // node width and height
const clrOff = 0.05; // 0 to 1, how much the color can change between nodes

const Node = (x, y, r, g, b) => {
	return {
		x: x,
		y: y,
		r: r,
		g: g,
		b: b,
		prev: null,
		next: null
	};
};
const rand = max => Math.random() * max | 0;
const constrain = (v, min, max) => (v < min ? min : (v > max ? max : v));
const srgbToLinear = c => c > .04045 ? Math.pow((c + 0.055) / (1 + 0.055), 2.4) : c / 12.92;
const linearToSrgb = c => c > .0031308 ? (1 + 0.055) * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;
const adjustColor = cc => constrain(Math.round(linearToSrgb(srgbToLinear(cc / 255) + Math.random() * clrOff * 2 - clrOff) * 255), 0, 255);
const coord = x => (x == 0) * -1 + (x == 2) * 1;
const setNode = a => {
	ctx.fillStyle = `rgb(${a.r = adjustColor(a.r)}, ${a.g = adjustColor(a.g)}, ${a.b = adjustColor(a.b)})`;
	ctx.fillRect(a.x * s, a.y * s, s, s);
	for (let n = 0; n < 4; n++) {
		const px = a.x + coord(n);
		const py = a.y + coord(n + 3 & 3);
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
	while (nodeProg > 1 && list.length > 0) {
		nodeProg--;
		setNode(list.remove(list.get(rand(list.length))));
	}
	list.length && requestAnimationFrame(loop);
};
const init = () => {
	canvas = document.getElementById("canvas");
	cols = (canvas.width = innerWidth) / s | 0;
	rows = (canvas.height = innerHeight) / s | 0;
	ctx = canvas.getContext("2d");
	filled = new Uint8Array(Math.ceil(cols * rows / 8));
	setNode(Node(rand(cols), rand(rows), rand(256), rand(256), rand(256)));
	loop();
};

let canvas;
let cols;
let rows;
let ctx;
let filled;
let list = new DoublyLinkedList();
let nodeProg = 0;

document.addEventListener("DOMContentLoaded", init);
