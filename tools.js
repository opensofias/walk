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