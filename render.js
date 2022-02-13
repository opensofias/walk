import {elem, vecAdd, vecEq, vecMul} from './tools.js'

export const makeWorld = ()=> {
	const player = elem ({
		tag: 'polygon', svg: true,
		attr: {
			id: 'player', fill: '#f60',
			points: playerSprite (),
		}
	})
	const land = elem ({
		tag: 'g', svg: true,
		attr: {id: 'land', fill: '#480',},
		content: makeTrees (),
	})
	const canvas = elem ({
		tag: 'svg', svg: true,
		attr: {
			id: 'game', viewBox: '-128 -128 256 256',
			xmlns: 'http://www.w3.org/2000/svg'
		},
		content: [player, land]
	})

	return {player, land, canvas}
}

const mod = (x, y) => ((x % y) + y) % y

export const render = ({world, moveVec, now, newAction}) => {
	newAction && world.player.setAttribute (
		'points', playerSprite (moveVec)
	)

	!vecEq (moveVec, [0, 0, 0]) && world.land.setAttribute (
		'transform',
		`rotate(${mod (now.angle * 360 / 256, 360)}) ` +
		`translate (${now.position.slice ().reverse ().join(' ')})`
	)
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

export const playerSprite = (moveVec = [0, 0, 0]) =>
	polygonString (vecAdd (
		vecMul (baseSprite, 8),
		spriteMod (moveVec)
	))

const spriteMod = ([y, x, r]) => [
	-x, y - r, x - r, -y,
	-x, y + r, x + r, -y,
]

const baseSprite = [-1, 0, 0, 1, 1, 0, 0, -1]

const polygonString = array =>
	array.reduce ((val, acc, idx) =>
		[val, acc].join (' ,' [idx % 2])
	)