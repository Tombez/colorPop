"use strict";

class BoundedSet {
	constructor(size) {
		this.size = size;
		this.data = new Uint8Array(Math.ceil(size / 8.0));
	}
	add(index) {
		this.data[index >>> 3] |= 1 << (index & 7);
	}
	remove(index) {
		this.data[index >>> 3] &= ~(1 << (index & 7));
	}
	has(index) {
		return this.data[index >>> 3] >>> (index & 7) & 1;
	}
	findEmpty() {
		let n = 0;
		const bLen = this.data.length;
		const extra = (bLen << 3) - this.size;
		for (const end = bLen - 1; n < end; n++) if (this.data[n] != 255) break;
		const byte = this.data[n];
		let i = 0;
		for (const end = extra || 8; i < end; i++) if ((byte >>> i & 1) === 0) break;
		return (n << 3) + i;
	}
}

class StructPool {
	constructor(structSize) {
		this.unit = structSize;
		this.data = new Uint8Array(structSize);
		this.used = new BoundedSet(1);
		this.size = 1;
		this.length = 0;
	}
	add() {
		let index;
		if (this.length == this.size) {
			this.grow();
			index = this.size >>> 1;
		} else {
			index = this.used.findEmpty();
		}
		this.used.add(index);
		this.length++;
		return index * this.unit;
	}
	remove(index) {
		for (let n = 0; n < this.unit; n++) this.data[index + n] = 0;
		this.used.remove(index / this.unit | 0);
		this.length--;
		if (this.length < this.size / 2.5) this.shrink();
	}
	grow() {
		const oldSize = this.size;
		const oldData = this.data;
		const oldUsed = this.used;
		this.size <<= 1;
		this.data = new Uint8Array(this.size * this.unit);
		this.data.set(oldData);
		this.used = new BoundedSet(this.size);
		this.used.data.set(oldUsed.data);
	}
	shrink() {
		if (this.size === 1) return;
		const oldSize = this.size;
		const oldData = this.data;
		this.size >>>= 1;
		this.data = new Uint8Array(this.size * this.unit);
		let i = 0;
		for (let n = 0; n < oldSize && i < this.length; n++) {
			if (this.used.has(n) === 1) {
				const a = i * this.unit;
				const b = n * this.unit;
				for (let j = 0; j < this.unit; j++) {
					this.data[a + j] = oldData[b + j];
				}
				i++;
			}
		}
		this.used = new BoundedSet(this.size);
		const bLen = this.length >>> 3;
		for (let n = 0; n < bLen; n++) this.used.data[n] = 255;
		for (let n = this.length & ~7; n < this.length; n++) this.used.add(n);
	}
}
