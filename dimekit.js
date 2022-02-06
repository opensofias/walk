'use strict'

O.assign (N.prototype, {
	*[Symbol.iterator] () {
		if (this < 0) throw 'cannot iterate over negative number: ' + this

		let count = 0
		while (count < this) yield count ++
	},
	forEach (callback) {
		for (const num of this) callback (num, this)
	},
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
	map (callback) {
		let result = []
		this.forEach (val => result.push (callback (val, this)))
		return result
	},
})
