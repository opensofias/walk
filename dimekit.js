'use strict'

const iterMixin = {
	reduce (callback, initial) {
		let acc = initial
		let noInitial = typeof initial == 'undefined'
		for (const val of this) {
			if (noInitial) acc = val
			else acc = callback (acc, val)
			noInitial = false
		}
		return acc
	},
	filter (callback) {
		let result = []
		this.forEach (val => callback (val, this) && result.push (val))
		return result
	},
	map (callback) {
		let result = []
		this.forEach (val => result.push (callback (val, this)))
		return result
	},
	some (callback) {
		for (let val of this) if (callback (val)) return true
	return false},
	every (callback) {
		for (let val of this) if (! callback (val)) return false
	return true},
	find (callback) {
		for (let val of this)
			if (callback (val, this)) return val
	return undefined}
}

O.assign (N.prototype, {
	*[Symbol.iterator] () {
		if (this < 0) throw 'cannot iterate over negative number: ' + this

		let count = 0
		while (count < this) yield count ++
	},
	forEach (callback) {
		for (const num of this) callback (num, this)
	},
	get array () {
		const result = []
		this.forEach (val => result.push (val))
	return result},
	digit (base, pos = 0)
		{return mod (this / pow (base, pos), base) | 0},
	digitArray (base) {
		const result = []; let temp = this
		do result.push (mod (temp, base) | 0)
			while ((temp /= base) >= 1)
		return result}
}, iterMixin)

O.assign (Set.prototype, iterMixin)

