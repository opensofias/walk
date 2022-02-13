export const elem = ({tag = 'div', attr = {}, mixin = {}, content = [], svg = false}) => {
	const el = svg ?
		document.createElementNS ('http://www.w3.org/2000/svg', tag) :
		document.createElement (tag)
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

	return Object.assign (el, mixin)
}

export const sel = selector => document.querySelector (selector)
export const selAll = selector => [...document.querySelectorAll(selector)]

export const vecAdd = (...vecs) =>
	vecs.reduce ((acc, cur) =>
		acc.map ((comp, idx) =>
			comp + cur [idx]
		)
	)

export const vecMul = (vec, fact) =>
	fact == 1 ? vec : vec.map (comp => comp * fact)

export const vecEq = (vec1, vec2) =>
	vec1.length == vec2.length &&
	vec1.every ((val, idx) => val == vec2 [idx])