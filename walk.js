'use strict'

onload = ()=> {
	d.body.appendChild (elem ({
		tag: 'svg', svg: true,
		attr: {
			id: 'game', viewBox: '0 0 256 256',
			xmlns: 'http://www.w3.org/2000/svg'
		},
		content: [
			elem ({
				tag: 'polygon', svg: true,
				attr: {
					id: 'player', fill: '#f60',
					points: '120,136 128,120 136,136',
				}
			}),
			elem ({
				tag: 'g', svg: true,
				attr: {id: 'world', fill: '#480',},
				content: makeTrees (),
			})
		]
	}))
	setInterval (gameLoop, 1000 / 60)
}

const makeTrees = ()=> 16 .map (num =>
	elem ({
		tag: 'circle', svg: true,
		attr: {
			cx: (num % 4 + .5) * 64 , cy: ((num >> 2) + .5) * 64, r: 8,
			fill: '#480',
		},
	})
)

const polygonString = array =>
	array.reduce ((val, acc, idx) =>
		[val, acc].join (' ,' [idx % 2])
	)

const pressed = new Set ()
let	newKey = false
let	position = [0, 0]
let	angle = 0

const actionMap = {
	q: 'strafeleft', e: 'straferight',
	w: 'up', s: 'down', a: 'left', d: 'right'
}

const keyListen = down => ({key}) => {
	key = key.toLowerCase()
	if (''.startsWith)
		if (key.startsWith ('arrow'))
			key = key.slice (5)
	newKey = down != pressed.has (key)
	newKey && pressed [down ? 'add' : 'delete'] (key)
}

onkeydown = keyListen (true)
onkeyup = keyListen (false)

const gameLoop = ()=> {
	if (newKey) {
		showDebug ()

	} newKey = false

	for (let key of pressed) {
		if (actionMap [key]) key = actionMap [key]
		const action = actions [key]
		action && action ()
	}

	pressed.size && sel ('#world').setAttribute (
		'transform',
		`rotate(${mod (angle * 360 / 256, 360)} 128 128) ` +
		`translate (${position.join(' ')})`
	)
}

const actions = {
	left: ()=> angle ++,
	right: ()=> angle --,
	up: () => {
		position[1] += cos (angle * TAU / 256)
		position[0] += sin (angle * TAU / 256)
	},
	down: () => {
		position[1] -= cos (angle * TAU / 256)
		position[0] -= sin (angle * TAU / 256)
	},
	strafeleft: () => {
		position[1] -= sin (angle * TAU / 256)
		position[0] += cos (angle * TAU / 256)
	},
	straferight: () => {
		position[1] += sin (angle * TAU / 256)
		position[0] -= cos (angle * TAU / 256)
	}
}

const showDebug = ()=> {
	const status = sel ('#status')
	status && status.remove ()
	d.body.appendChild (elem ({
		attr: {id: 'status'},
		content: [...pressed].map (key =>
			elem ({content: key})
		)
	}))
}