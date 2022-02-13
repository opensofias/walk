import {} from './dimekit.js'
import {makeWorld, render} from './render.js'
import {keys} from './input.js'
import {vecAdd, vecMul} from './tools.js'

onload = ()=> {
	const world = makeWorld ()
	const input = keys ()
	const beginning = {
		position: [0, 0],
		angle: 0,
		timestamp: performance.now()
	}

	document.body.appendChild (world.canvas)
	requestAnimationFrame (gameLoop ({world, input}) (beginning))
}

const gameLoop = ({world, input}) => past => timestamp => {
	const actionList = input.next ().value
	const accel = actionList.includes ('shift') ? 4 : 1

	const speed =
		(timestamp - past.timestamp) /
		1000 * 60 * accel

	const now = updatePosition ({past, actionList, speed})

	render ({world, actionList, now, accel})

	requestAnimationFrame (gameLoop ({world, input}) ({...now, timestamp}))
}

export const action2vec = ({actionList, accel}) =>
	vecMul(
		actionList.reduce(
			(pre, cur) => vecAdd(pre, actionVec[cur] ?? [0, 0, 0]),
			[0, 0, 0]
		), accel
	)

const updatePosition = ({past, actionList, speed}) => {
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
	for (const actionWord of actionList) {
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
