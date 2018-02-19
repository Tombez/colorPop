"use strict";

class DoublyLinkedList {
	constructor() {
		this.length = 0;
		this.first = null;
		this.last = null;
		/*this.cur = null;
		this.index = 0;*/
	}
	unshift(node) {
		if (!this.last) {
			this.last = node;
		}
		if (this.first) {
			node.next = this.first;
			this.first.prev = node;
		}
		this.first = node;
		return ++this.length;
	}
	push(node) {
		if (!this.first) {
			this.first = node;
		}
		if (this.last) {
			node.prev = this.last;
			this.last.next = node;
		}
		this.last = node;
		return ++this.length;
	}
	shift() {
		const node = this.first;
		this.first = node.next;
		if (this.first) {
			this.first.prev = null;
		}
		this.length--;
		return node;
	}
	pop() {
		let node = this.last;
		this.last = node.prev;
		if (this.last) {
			this.last.next = null;
		}
		this.length--;
		return node;
	}
	get(index) {
		let node;
		if (index < this.length / 2) {
			node = this.first;
			for (let n = 0; n < index; n++) {
				node = node.next;
			}
		} else {
			node = this.last;
			for (let n = this.length - 1; n > index; n--) {
				node = node.prev;
			}
		}
		return node;
	}
	insert(node, index) {
		//TODO
	}
	remove(node) {
		if (node == this.first) {
			return this.shift();
		} else if (node == this.last) {
			return this.pop();
		}
		node.prev.next = node.next;
		node.next.prev = node.prev;
		this.length--;
		return node;
	}
}
