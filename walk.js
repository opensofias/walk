import {} from './dimekit.js'
import {makeWorld, render} from './render.js'
import {keys} from './input.js'

onload = ()=> {
	const world = makeWorld ()
	const actions = keys ()
	const beginning = {
		position: [0, 0],
		angle: 0,
		timestamp: performance.now()
	}

	document.body.appendChild (world.canvas)
	requestAnimationFrame (gameLoop ({world, actions}) (beginning))
}

const gameLoop = ({world, actions}) => past => timestamp => {
	const actionList = actions.next ().value
	window.test = actions.next ()
	const accel = actionList.includes ('shift') ? 4 : 1

	const speed =
		(timestamp - past.timestamp) /
		1000 * 60 * accel

	const now = updatePosition ({past, actions: actionList, speed})

	render ({world, actionList, now, accel})

	requestAnimationFrame (gameLoop ({world, actions}) ({...now, timestamp}))
}

const updatePosition = ({past, actions, speed}) => {
	let {angle, position} = past

	const moveBy = ([y, x, r]) => {
		position[0] +=
			cos (angle * TAU / 256) * y * speed -
			sin (angle * TAU / 256) * x * speed
		position[1] +=
			sin (angle * TAU / 256) * y * speed +
			cos (angle * TAU / 256) * x * speed
		angle += speed * r
	}
	for (const actionWord of actions) {
		moveBy (actionVec [actionWord] ?? [0, 0, 0])
	}

	return {angle, position}
}


const {sin, cos, floor, ceil} = Math
const TAU = Math.PI * 2


export const actionVec = {
	up: [1, 0, 0], down: [-1, 0, 0],
	left: [0, 1, 0], right: [0, -1, 0],
	cw: [0, 0, 1], ccw: [0, 0, -1]
}
