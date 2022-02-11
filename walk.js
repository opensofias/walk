import {} from './dimekit.js'
import {elem, sel} from './tools.js'
import {makeWorld, playerSprite} from './render.js'

onload = ()=> {
	const world = makeWorld ()

	document.body.appendChild (world.canvas)
	keys.listen ()
	requestAnimationFrame (gameLoop (world) ({}))
}

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

const gameLoop = world => past => timestamp => {
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

	keys.pressed.size && sel ('#land').setAttribute (
		'transform',
		`rotate(${mod (angle * 360 / 256, 360)}) ` +
		`translate (${position.slice ().reverse ().join(' ')})`
	)

	requestAnimationFrame (gameLoop (world) ({}))
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

export const actionVec = {
	up: [1, 0, 0], down: [-1, 0, 0],
	left: [0, 1, 0], right: [0, -1, 0],
	cw: [0, 0, 1], ccw: [0, 0, -1]
}

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