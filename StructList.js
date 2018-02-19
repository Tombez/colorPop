"use strict";

class StructList {
	constructor(structSize) {
		this.structSize = structSize;
		this.structs = new Uint8Array(structSize);
		this.open = new Set([0]);
		this.size = 1;
		this.length = 0;
	}
	add() {
		let first = this.open.values().next().value;
		if (first === undefined) {
			this.grow();
			first = this.open.values().next().value;
		}
		this.open.delete(first);
		this.length++;
		return first * this.structSize;
	}
	remove(a) {
		this.open.add(a / this.structSize | 0);
		this.length--;
		if (this.length < this.size / 2.5) {
			this.shrink();
		}
	}
	shrink() {
		const oldSize = this.size;
		const oldStructs = this.structs;
		this.size >>= 1;
		this.structs = new Uint8Array(this.size * this.structSize);
		console.log("shrink", oldSize, this.size);
		let i = 0;
		for (let n = 0; n < oldSize && i < this.length; n++) {
			if (!this.open.has(n)) {
				const a = i * this.structSize;
				const b = n * this.structSize;
				for (let j = 0; j < this.structSize; j++) {
					this.structs[a + j] = oldStructs[b + j];
				}
				i++;
			}
		}
		//console.log("i", i);
		//console.log("length", this.length);
		this.open = new Set();
		for (let n = this.length; n < this.size; n++) this.open.add(n);
		//debugger;
	}
	grow() {
		const oldSize = this.size;
		const oldStructs = this.structs;
		this.size <<= 1;
		this.structs = new Uint8Array(this.size * this.structSize);
		console.log("grow", oldSize, this.size);
		const end = oldSize * this.structSize;
		for (let n = 0; n < end; n++) this.structs[n] = oldStructs[n];
		for (let n = oldSize; n < this.size; n++) this.open.add(n);
	}
}
