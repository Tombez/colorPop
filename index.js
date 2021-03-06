"use strict";

const s = 1; // node width and height
const clrOff = 0.05; // 0 to 1, how much the color can change between nodes

Math.TAU = 2 * Math.PI;
Array.prototype.alter = function(cb) {
	for (let i = 0; i < this.length; ++i)
		this[i] = cb(this[i], i);
	return this;
};

let canvas;
let cols;
let rows;
let ctx;
let filled;
let list = new DynamicStructArray(7);
let nodeProg = 0;
let mouseDown = false;

const rand = max => Math.random() * max | 0;
const clamp = (v, min, max) => v < min ? min : (v > max ? max : v);
const srgbToLinear = c => {
	if (c > 0.04045)
		return Math.pow((c + 0.055) / 1.055, 2.4);
	return c / 12.92;
};
const linearToSrgb = c => {
	if (c > 0.0031308)
		return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
	return 12.92 * c;
};
const adjustColor = (col) => {
	const a = Math.random() * Math.TAU; // red-green angle
	const b = (Math.random() - 0.5) * Math.PI; // blue angle
	const off = Math.random() * clrOff;
	col.alter(cc => srgbToLinear(cc / 255));
	const rgScale = Math.cos(b) * off;
	col[0] += Math.cos(a) * rgScale;
	col[1] += Math.sin(a) * rgScale;
	col[2] += Math.sin(b) * off;
	return col.alter(cc => clamp(Math.round(linearToSrgb(cc) * 255), 0, 255));
};
const addNode = (x, y, r, g, b) => {
	if (x < 0 || x >= cols || y < 0 || y >= rows) return;
	const index = x + y * cols;
	const byte = index >>> 3;
	const bit = index & 7;
	if (filled[byte] >>> bit & 1) return;
	const a = list.add();
	list.data[a] = x >>> 8;
	list.data[a + 1] = x & 255;
	list.data[a + 2] = y >>> 8;
	list.data[a + 3] = y & 255;
	list.data[a + 4] = r;
	list.data[a + 5] = g;
	list.data[a + 6] = b;
	filled[byte] |= 1 << bit;
};
const fillNode = a => {
	const x = list.data[a] << 8 | list.data[a + 1];
	const y = list.data[a + 2] << 8 | list.data[a + 3];
	const r = list.data[a + 4];
	const g = list.data[a + 5];
	const b = list.data[a + 6]
	const [nr, ng, nb] = adjustColor([r, g, b]);
	ctx.fillStyle = `rgb(${nr}, ${ng}, ${nb})`;
	ctx.fillRect(x * s, y * s, s, s);
	addNode(x, y - 1, nr, ng, nb);
	addNode(x + 1, y, nr, ng, nb);
	addNode(x, y + 1, nr, ng, nb);
	addNode(x - 1, y, nr, ng, nb);
	list.remove(a);
};
const loop = () => {
	if (list.length) {
		nodeProg += list.length / Math.TAU * 2;
		for (; nodeProg > 1 && list.length > 0; nodeProg--) {
			fillNode((Math.random() * list.length | 0) * list.unit);
		}
	}
	requestAnimationFrame(loop);
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
	ctx.fillText("Click!", canvas.width >>> 1, canvas.height >>> 1);
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
