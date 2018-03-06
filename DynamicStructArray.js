"use strict";

class DynamicStructArray {
	constructor(structSize) {
		this.unit = structSize;
		this.data = new Uint8Array(structSize);
		this.size = 1;
		this.length = 0;
	}
	add() {
		if (this.length == this.size) this.grow();
		return this.length++ * this.unit;
	}
	remove(index) {
		const last = --this.length * this.unit;
		if (index != last) {
			for (let n = 0; n < this.unit; n++) {
				this.data[index + n] = this.data[last + n];
			}
		}
		if (this.length < this.size / 4.0) this.shrink();
	}
	grow() {
		const oldData = this.data;
		this.data = new Uint8Array((this.size <<= 1) * this.unit);
		this.data.set(oldData);
	}
	shrink() {
		if (this.size === 1) return;
		this.data = this.data.slice(0, (this.size >>>= 1) * this.unit);
	}
}
