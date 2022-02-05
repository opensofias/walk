'use strict'

const [O, A, N, d] = [Object, Array, Number, document]

const {elem, sel, selAll} = document ? {
	elem ({tag = 'div', attr = {}, mixin = {}, content = [], svg = false}) {
		const el = svg ?
			d.createElementNS ('http://www.w3.org/2000/svg', tag) :
			d.createElement (tag)
		for (const name in attr)
			typeof attr[name] == 'boolean' ?
				attr[name] && el.setAttribute(name, name) :
				el.setAttribute(name, attr[name])
		void {
			string () {el.innerText = content},
			number: ()=> el.innerText = content.toString(),
			undefined: ()=> undefined,
			object: ()=> content instanceof Array ?
				content.forEach(contEl => el.appendChild(contEl)) :
				el.appendChild(content)
		} [typeof content] ()

		return O.assign (el, mixin)
	},
	sel: selector => d.querySelector (selector),
	selAll: selector => [...d.querySelectorAll(selector)]
} : {}

const inherit = (parent, ...mixins) =>
	O.freeze (O.assign (
		O.create (parent), ...mixins
	))

const mod = (x, y) => ((x % y) + y) % y
const {sin, cos, floor, ceil} = Math
const TAU = Math.PI * 2

const str2byte = str =>
	str.split ('').map (chr => chr.charCodeAt(0))