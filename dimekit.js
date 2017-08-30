'use strict'

const iterMixin = Object.freeze({
	reduce (callback, initial) {
		let acc
		if (initial === undefined) {
			let first = true
			for (const val of this)	{
				if (first) acc = val
				else acc = callback (acc, val)
				first = false
			}
		} else {
			acc = initial
			this.forEach (val =>
				acc = callback (acc, val)
			)
		}	return acc
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
})

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

O.getOwnPropertyNames(Math)
.forEach (key => window [key] = Math [key])

O.assign (A.prototype, {
	transpose () {
		const result = []
		for (var index of this.reduce (
			(acc, val) => max(acc, val.length), 0)
		) result.push(this.map (child => child[index]))
	return result}
})

const arrayTypes = [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, Array]

const assignRect = type =>
	O.assign (type.prototype, {
		rect () { return O.assign (
			O.create (iterMixin), {
				parent: this,
				*[Symbol.iterator] () {
					const parent = this.parent
					let continues = ! parent.some (edge => edge <= 0)

					let countArray = type == Array ?
						parent.length.map(()=> 0) : 
						new type (parent.length)

					while (continues) {
						yield countArray.slice()

						for (const index of parent.length)
							if (countArray [index] < parent [index] - 1) {
								countArray [index] ++ ; break	
							} else if (index < parent.length - 1)
								countArray [index] = 0
							else continues = false
				}},
				forEach (callback) {
					for (let num of this) callback (num, this)
				},
				contains (comparedTo) {
					return parent.every ((num, index) => comparedTo[index] < num)
				},
				isContainedIn (comparedTo) {
					return parent.every ((num, index) => comparedTo[index] > num)
				}
	})}})

arrayTypes.forEach (assignRect)

O.assign (Set.prototype, iterMixin)

