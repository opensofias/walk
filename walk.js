'use strict'

onload = ()=> {
	d.body.appendChild (elem ({
		tag: 'svg', svg: true,
		attr: {
			id: 'game', viewBox: '-128 -128 256 256',
			xmlns: 'http://www.w3.org/2000/svg'
		},
		content: [
			elem ({
				tag: 'polygon', svg: true,
				attr: {
					id: 'player', fill: '#f60',
					points: playerSprite (),
				}
			}),
			elem ({
				tag: 'g', svg: true,
				attr: {id: 'world', fill: '#480',},
				content: makeTrees (),
			})
		]
	}))
	requestAnimationFrame (gameLoop)
}

const makeTrees = ()=> 16 .map (num =>
	elem ({
		tag: 'circle', svg: true,
		attr: {
			cx: (num % 4 -1.5) * 64 , cy: ((num >> 2) - 1.5) * 64, r: 8,
			fill: '#480',
		},
	})
)

const polygonString = array =>
	array.reduce ((val, acc, idx) =>
		[val, acc].join (' ,' [idx % 2])
	)

const pressed = new Set ()
let actionList = []
let	newKey = false
let	position = [0, 0]
let	angle = 0

const actionMap = {
	q: 'cw', e: 'ccw',
	w: 'up', s: 'down',
	a: 'left', d: 'right'
}

const keyListen = down => ({key}) => {
	key = key.toLowerCase()
	if (key.startsWith ('arrow'))
		key = key.slice (5)
	newKey = down != pressed.has (key)
	newKey && pressed [down ? 'add' : 'delete'] (key)
}

onkeydown = keyListen (true)
onkeyup = keyListen (false)

let lastFrame = 0

const playerSprite = (actionList = [], fast = false) =>
	polygonString (vecAdd (
		vecMul (spriteMod.base, 8),
		actionList.length ? vecMul (
			vecAdd (
			...actionList.map (action =>
				spriteMod [action] || 8 .map (()=> 0)
			)
		), fast ? 4 : 1 ) : 8 .map (()=> 0)
	))

const gameLoop = timestamp => {
	const fast = pressed.has ('shift')

	if (newKey) {
		showDebug ()

		actionList = [...pressed].map (key => actionMap [key] || key)

		sel ('#player').setAttribute ('points',
			playerSprite (actionList, fast)
		)
	} newKey = false
	

	const speed =
		(timestamp - lastFrame) /
		1000 * 60 * (fast ? 4 : 1)
	lastFrame = timestamp
	
	for (const actionWord of actionList) {
		const action = actions [actionWord]
		action && action (speed)
	}

	pressed.size && sel ('#world').setAttribute (
		'transform',
		`rotate(${mod (angle * 360 / 256, 360)}) ` +
		`translate (${position.slice ().reverse ().join(' ')})`
	)

	requestAnimationFrame (gameLoop)
}

const moveBy = (...vec) => speed => {
	position[0] +=
		cos (angle * TAU / 256) * vec [0] * speed -
		sin (angle * TAU / 256) * vec [1] * speed
	position[1] += 
		sin (angle * TAU / 256) * vec [0] * speed +
		cos (angle * TAU / 256) * vec [1] * speed
}

const actions = {
	cw: speed => angle += speed,
	ccw: speed => angle -= speed,
	up: moveBy (1, 0),
	down: moveBy (-1, 0),
	left: moveBy (0, 1),
	right: moveBy (0, -1)
}

const vecAdd = (...vecs) =>
	vecs.reduce ((acc, cur) =>
		acc.map ((comp, idx) =>
			comp + cur [idx]
		)
	)

const vecMul = (vec, fact) =>
	fact == 1 ? vec : vec.map (comp => comp * fact)

const spriteMod = {
	base: [-1, 0, 0, 1, 1, 0, 0, -1],
	up: [0, 1, 0, -1, 0, 1, 0, -1],
	down: [0, -1, 0, 1, 0, -1, 0, 1],
	left: [-1, 0, 1, 0, -1, 0, 1, 0],
	right: [1, 0, -1, 0, 1, 0, -1, 0],
	cw: [0, -1, -1, 0, 0, 1, 1, 0],
	ccw: [0, 1, 1, 0, 0, -1, -1, 0],
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