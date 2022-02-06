'use strict'

O.assign (N.prototype, {
	*[Symbol.iterator] () {
		if (this < 0) throw 'cannot iterate over negative number: ' + this

		let count = 0
		while (count < this) yield count ++
	},
	forEach (fun) { for (const num of this) fun (num, this) },
	reduce (fun, init) {
		let acc = init
		let noInit = typeof init == 'undefined'
		for (const val of this) {
			if (noInit) acc = val, noInit = false
			else acc = fun (acc, val)
		}
		return acc
	},
	map (fun) {
		return this.reduce ((prev, cur) => [...prev, fun (cur)], [])
	},
})
