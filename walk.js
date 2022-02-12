import {} from './dimekit.js'
import {elem, sel} from './tools.js'
import {makeWorld, playerSprite} from './render.js'

onload = ()=> {
	const world = makeWorld ()
	const beginning = {
		position: [0, 0],
		angle: 0,
		timestamp: 0
	}

	document.body.appendChild (world.canvas)
	keys.listen ()
	requestAnimationFrame (gameLoop (world) (beginning))
}

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

const gameLoop = world => past => timestamp => {
	const fast = keys.pressed.has ('shift')

	if (keys.newEvent) {
		showDebug ()

		sel ('#player').setAttribute ('points',
			playerSprite (keys.actionList, fast)
		)
	} keys.newEvent = false
	

	const speed =
		(timestamp - past.timestamp) /
		1000 * 60 * (fast ? 4 : 1)

	//todo: functionalize this
	const now = (({position, angle}) => {
		const state = {position, angle}
		for (const actionWord of keys.actionList) {
			moveBy (state) (actionVec [actionWord] ?? [0, 0, 0]) (speed)
		}
		return state
	}) (past)

	keys.pressed.size && sel ('#land').setAttribute (
		'transform',
		`rotate(${mod (now.angle * 360 / 256, 360)}) ` +
		`translate (${now.position.slice ().reverse ().join(' ')})`
	)

	requestAnimationFrame (gameLoop (world) ({...now, timestamp}))
}

const mod = (x, y) => ((x % y) + y) % y
const {sin, cos, floor, ceil} = Math
const TAU = Math.PI * 2

// todo: functionalize this
const moveBy = state => ([y, x, r]) => speed => {
	state.position[0] +=
		cos (state.angle * TAU / 256) * y * speed -
		sin (state.angle * TAU / 256) * x * speed
	state.position[1] +=
		sin (state.angle * TAU / 256) * y * speed +
		cos (state.angle * TAU / 256) * x * speed
	state.angle += speed * r
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