import {} from './dimekit.js'
import {makeWorld, render} from './render.js'
import {keys} from './input.js'
import {vecAdd, vecMul, vecEq} from './tools.js'

onload = ()=> {
	const world = makeWorld ()
	const input = keys ()
	const beginning = {
		x: 0, y : 0,
		angle: 0,
		timestamp: performance.now(),
		actionList: []
	}

	document.body.appendChild (world.canvas)
	requestAnimationFrame (gameLoop ({world, input}) (beginning))
}

const gameLoop = ({world, input}) => past => timestamp => {
	const actionList = input.next ().value
	const moveVec = action2vec ({actionList})
	const speed = (timestamp - past.timestamp) / 1000 * 60

	const now = {
		...updatePosition ({past, moveVec, speed}),
		newAction: vecEq (actionList, past.actionList),
		moveVec, actionList, timestamp
	}

	render ({world, now})

	requestAnimationFrame (gameLoop ({world, input}) (now))
}

const actionVec = {
	up: [1, 0, 0], down: [-1, 0, 0],
	left: [0, 1, 0], right: [0, -1, 0],
	cw: [0, 0, 1], ccw: [0, 0, -1]
}

export const action2vec = ({actionList, factor = 1}) =>
	vecMul(
		actionList.reduce(
			(pre, cur) => vecAdd(pre, actionVec[cur] ?? [0, 0, 0]),
			[0, 0, 0]
		), factor * (actionList.includes ('shift') ? 4 : 1)
	)

const {sin, cos, floor, ceil} = Math
const TAU = Math.PI * 2

const updatePosition = ({past, moveVec, speed}) => {
	const {angle, y, x} = past
	const [dy, dx, d_angle] = vecMul (moveVec, speed)

	return {
		angle: angle + d_angle,
		y: y + cos (angle * TAU / 256) * dy -
			sin (angle * TAU / 256) * dx,
		x: x + sin (angle * TAU / 256) * dy +
			cos (angle * TAU / 256) * dx
	}
}