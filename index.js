// Mr. JPrograms is the creator of this idea. Refer to:
// https://www.khanacademy.org/computer-programming/color-pop/6416482056208384
"use strict";

const s = 1; // node width and height
const clrOff = 0.05; // 0 to 1, how much the color can change between nodes

Math.tau = 2 * Math.PI;

let canvas;
let cols;
let rows;
let ctx;
let filled;
let list = new StructList(7);
let nodeProg = 0;
let mouseDown = false;

const rgb = (r, g, b) => `rgb(${r},${g},${b})`;
const rand = max => Math.random() * max | 0;
const clamp = (v, min, max) => v < min ? min : (v > max ? max : v);
const srgbToLinear = c => {
	if (c > .04045) {
		return Math.pow((c + 0.055) / (1 + 0.055), 2.4);
	} else {
		return c / 12.92;
	}
}
const linearToSrgb = c => {
	if (c > .0031308) {
		return (1 + 0.055) * Math.pow(c, 1 / 2.4) - 0.055;
	} else {
		return 12.92 * c;
	}
}
const adjustColor = cc => {
	const variance = Math.random() * clrOff * 2 - clrOff;
	const newC = linearToSrgb(srgbToLinear(cc / 255) + variance);
	return clamp(Math.round(newC * 255), 0, 255);
};
const addNode = (x, y, r, g, b) => {
	if (!(x < 0 || x >= cols || y < 0 || y >= rows)) {
		const index = x + y * cols;
		const byte = index >> 3;
		const bit = index & 7;
		if ((filled[byte] >> bit & 1) === 0) {
			const a = list.add();
			list.data[a] = x >> 8;
			list.data[a + 1] = x & 255;
			list.data[a + 2] = y >> 8;
			list.data[a + 3] = y & 255;
			list.data[a + 4] = r;
			list.data[a + 5] = g;
			list.data[a + 6] = b;
			filled[byte] |= 1 << bit;
		}
	}
};
const fillNode = a => {
	const x = list.data[a] << 8 | list.data[a + 1];
	const y = list.data[a + 2] << 8 | list.data[a + 3];
	const nr = adjustColor(list.data[a + 4]);
	const ng = adjustColor(list.data[a + 5]);
	const nb = adjustColor(list.data[a + 6]);
	rect(x * s, y * s, nr, ng, nb);
	addNode(x, y - 1, nr, ng, nb);
	addNode(x + 1, y, nr, ng, nb);
	addNode(x, y + 1, nr, ng, nb);
	addNode(x - 1, y, nr, ng, nb);
	list.remove(a);
};
const rect = (x, y, r, g, b) => {
	ctx.fillStyle = rgb(r, g, b);
	ctx.fillRect(x, y, s, s);
};
const loop = () => {
	if (list.length) step();
	requestAnimationFrame(loop);
};
const step = () => {
	nodeProg += list.length / Math.tau * 2;
	for (; nodeProg > 1 && list.length > 0; nodeProg--) {
		let index;
		do index = rand(list.size); while (list.used.has(index) !== 1);
		// const b = list.data;
		// const a = index;
		// if ((b[a] | b[a + 1] | b[a + 2] | b[a + 3] | b[a + 4] | b[a + 5] | b[a + 6]) === 0) {
		// 	console.log("This is a bug");
		// }
		// If you're reading this, I haven't fixed the bug.
		fillNode(index * list.unit);
	}
};
const addFromEvent = ({clientX, clientY}) => {
	const x = clientX / s | 0;
	const y = clientY / s | 0;
	addNode(x, y, rand(256), rand(256), rand(256));
};
const drawClick = () => {
	ctx.font = "32px 'Ubuntu Mono', Ubuntu, Consolas, 'Courier New', Courier";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#fff";
	ctx.fillText("Click!", canvas.width / 2 | 0, canvas.height / 2 | 0);
};
const init = () => {
	canvas = document.getElementById("canvas");
	cols = Math.ceil((canvas.width = innerWidth) / s);
	rows = Math.ceil((canvas.height = innerHeight) / s);
	ctx = canvas.getContext("2d");
	filled = new Uint8Array(Math.ceil(cols * rows / 8.0));
	canvas.addEventListener("mousemove", event => {
		if (mouseDown) addFromEvent(event);
	});
	canvas.addEventListener("mousedown", event => {
		addFromEvent(event);
		mouseDown = true;
	});
	window.addEventListener("mouseup", () => mouseDown = false);
	drawClick();
	requestAnimationFrame(loop);
};

document.addEventListener("DOMContentLoaded", init);
