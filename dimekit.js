'use strict'

O.assign (N.prototype, {
	*[Symbol.iterator] () {
		const neg = this < 0
		const goal = neg ? -this : this
		let count = 0
		while (count < goal)
			yield neg ? -(this + ++ count) : count ++
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
