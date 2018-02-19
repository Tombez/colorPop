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
	}
	shrink() {
		//TODO
	}
	grow() {
		const oldSize = this.size;
		const oldStructs = this.structs;
		this.size <<= 1;
		this.structs = new Uint8Array(this.size * this.structSize);
		const end = oldSize * this.structSize;
		for (let n = 0; n < end; n++) this.structs[n] = oldStructs[n];
		for (let n = oldSize; n < this.size; n++) this.open.add(n);
	}
}
