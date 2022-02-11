import {} from './dimekit.js'
import {elem, sel} from './tools.js'

onload = ()=> {
	document.body.appendChild (elem ({
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
	keys.listen ()
	requestAnimationFrame (gameLoop)
}

const makeTrees = ()=> 16 .map (num =>
	elem ({
		tag: 'circle', svg: true,
		attr: {
			cx: (num % 4 -1.5) * 64 , cy: ((num >> 2) - 1.5) * 64, r: 16,
			fill: '#480',
		},
	})
)

const polygonString = array =>
	array.reduce ((val, acc, idx) =>
		[val, acc].join (' ,' [idx % 2])
	)

let	position = [0, 0]
let	angle = 0

const keys = {
	listen () {
		[onkeydown, onkeyup] = [true, false].map (
			down => ({key: keyId}) => {
				const key = ((x) =>
					(x.startsWith ('Arrow') ? x.slice (5) : x)
					.toLowerCase ()) (keyId)
				this.newEvent = down != this.pressed.has (key)
				this.newEvent && this.pressed [down ? 'add' : 'delete'] (key)
		})
	},
	newEvent: false,
	pressed: new Set(),
	actionMap: {
		q: 'cw', e: 'ccw',
		w: 'up', s: 'down',
		a: 'left', d: 'right'
	},
	get actionList () {
		return [...this.pressed].map (key => this.actionMap [key] ?? key)
	},
}

let lastFrame = 0

const playerSprite = (actionList = [], fast = false) =>
	polygonString (vecAdd (
		vecMul (baseSprite, 8),
		spriteMod (
		vecMul (actionList.reduce ((pre, cur) =>
			vecAdd (pre, actionVec [cur] ?? [0, 0, 0]),
			[0, 0, 0]),
		fast ? 4 : 1))
	))

const gameLoop = timestamp => {
	const fast = keys.pressed.has ('shift')

	if (keys.newEvent) {
		showDebug ()

		sel ('#player').setAttribute ('points',
			playerSprite (keys.actionList, fast)
		)
	} keys.newEvent = false
	

	const speed =
		(timestamp - lastFrame) /
		1000 * 60 * (fast ? 4 : 1)
	lastFrame = timestamp
	
	for (const actionWord of keys.actionList) {
		moveBy (actionVec [actionWord] ?? [0, 0, 0]) (speed)
	}

	keys.pressed.size && sel ('#world').setAttribute (
		'transform',
		`rotate(${mod (angle * 360 / 256, 360)}) ` +
		`translate (${position.slice ().reverse ().join(' ')})`
	)

	requestAnimationFrame (gameLoop)
}

const mod = (x, y) => ((x % y) + y) % y
const {sin, cos, floor, ceil} = Math
const TAU = Math.PI * 2

const moveBy = ([y, x, r]) => speed => {
	position[0] +=
		cos (angle * TAU / 256) * y * speed -
		sin (angle * TAU / 256) * x * speed
	position[1] +=
		sin (angle * TAU / 256) * y * speed +
		cos (angle * TAU / 256) * x * speed
	angle += speed * r
}

const vecAdd = (...vecs) =>
	vecs.reduce ((acc, cur) =>
		acc.map ((comp, idx) =>
			comp + cur [idx]
		)
	)

const vecMul = (vec, fact) =>
	fact == 1 ? vec : vec.map (comp => comp * fact)

const baseSprite = [-1, 0, 0, 1, 1, 0, 0, -1]

const actionVec = {
	up: [1, 0, 0], down: [-1, 0, 0],
	left: [0, 1, 0], right: [0, -1, 0],
	cw: [0, 0, 1], ccw: [0, 0, -1]
}

const spriteMod = ([y, x, r]) => [
	-x, y - r, x - r, -y,
	-x, y + r, x + r, -y,
]

const showDebug = ()=> {
	const status = sel ('#status')
	status && status.remove ()
	document.body.appendChild (elem ({
		attr: {id: 'status'},
		content: [...keys.pressed].map (key =>
			elem ({content: key})
		)
	}))
}