export const [O, A, N, d] = [Object, Array, Number, document]

export const elem = ({tag = 'div', attr = {}, mixin = {}, content = [], svg = false}) => {
	const el = svg ?
		d.createElementNS ('http://www.w3.org/2000/svg', tag) :
		d.createElement (tag)
	for (const name in attr)
		typeof attr[name] == 'boolean' ?
			attr[name] && el.setAttribute(name, name) :
			el.setAttribute(name, attr[name])

	void (type =>
		['string', 'number'].includes (type) ?
			el.innerText = content :
		type == 'object' && [content].flat ()
			.forEach(contEl => el.appendChild(contEl))
	) (typeof content)

	return O.assign (el, mixin)
}

export const sel = selector => d.querySelector (selector)
export const selAll = selector => [...d.querySelectorAll(selector)]

export const mod = (x, y) => ((x % y) + y) % y
export const {sin, cos, floor, ceil} = Math
export const TAU = Math.PI * 2

export const str2byte = str =>
	str.split ('').map (chr => chr.charCodeAt(0))