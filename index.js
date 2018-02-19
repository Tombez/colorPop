// Mr. JPrograms is the creator of this idea. See: https://www.khanacademy.org/computer-programming/color-pop/6416482056208384
"use strict";

const s = 1; // node width and height
const clrOff = 0.05; // 0 to 1, how much the color can change between nodes

const rand = max => Math.random() * max | 0;
const constrain = (v, min, max) => (v < min ? min : (v > max ? max : v));
const srgbToLinear = c => c > .04045 ? Math.pow((c + 0.055) / (1 + 0.055), 2.4) : c / 12.92;
const linearToSrgb = c => c > .0031308 ? (1 + 0.055) * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;
const adjustColor = cc => constrain(Math.round(linearToSrgb(srgbToLinear(cc / 255) + Math.random() * clrOff * 2 - clrOff) * 255), 0, 255);
const coord = x => (x & 1) * (x - 2);
const addNode = (x, y, r, g, b) => {
	const a = list.add();
	list.structs[a] = x >> 8;
	list.structs[a + 1] = x & 255;
	list.structs[a + 2] = y >> 8;
	list.structs[a + 3] = y & 255;
	list.structs[a + 4] = r;
	list.structs[a + 5] = g;
	list.structs[a + 6] = b;
};
const setNode = a => {
	const x = list.structs[a] << 8 | list.structs[a + 1];
	const y = list.structs[a + 2] << 8 | list.structs[a + 3];
	const nr = adjustColor(list.structs[a + 4]);
	const ng = adjustColor(list.structs[a + 5]);
	const nb = adjustColor(list.structs[a + 6]);
	ctx.fillStyle = `rgb(${nr}, ${ng}, ${nb})`;
	ctx.fillRect(x * s, y * s, s, s);
	for (let n = 0; n < 4; n++) {
		const px = x + coord(n);
		const py = y + coord(n + 3 & 3);
		if (px >= 0 && px < cols && py >= 0 && py < rows) {
			const index = px + py * cols;
			const byte = index >> 3;
			const bit = 1 << (index & 7);
			if (!(filled[byte] & bit)) {
				addNode(px, py, nr, ng, nb);
				filled[byte] |= bit;
			}
		}
	}
	list.remove(a);
};
const loop = now => {
	step(now);
	if (list.length !== 0) requestAnimationFrame(loop);
};
const step = now => {
	nodeProg += list.length / (2 * Math.PI) * ((now - prev) / (1e3 / 60));
	prev = now;
	while (nodeProg > 1 && list.length > 0) {
		nodeProg--;
		let index;
		do {
			index = rand(list.size);
		} while (list.open.has(index));
		setNode(index * list.structSize);
	}
};
const init = () => {
	canvas = document.getElementById("canvas");
	cols = Math.ceil((canvas.width = innerWidth) / s);
	rows = Math.ceil((canvas.height = innerHeight) / s);
	ctx = canvas.getContext("2d");
	filled = new Uint8Array(Math.ceil(cols * rows / 8));
	const x = rand(cols);
	const y = rand(rows);
	addNode(x, y, rand(256), rand(256), rand(256));
	setNode(0);
	/*const index = x + y * cols;
	const byte = index >> 3;
	const bit = 1 << (index & 7);
	filled[byte] |= bit;*/
	prev = performance.now();
	requestAnimationFrame(loop);
};

let canvas;
let cols;
let rows;
let ctx;
let filled;
let list = new StructList(7);
let nodeProg = 0;
let prev;

document.addEventListener("DOMContentLoaded", init);
