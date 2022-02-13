import {elem} from './tools.js'
import {actionVec} from './walk.js'

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

const makeTrees = ()=> 16 .map (num =>
	elem ({
		tag: 'circle', svg: true,
		attr: {
			cx: (num % 4 -1.5) * 64 , cy: ((num >> 2) - 1.5) * 64, r: 16,
			fill: '#480',
		},
	})
)

export const playerSprite = (actionList = [], accel = 1) => polygonString (vecAdd (
	vecMul (baseSprite, 8),
	spriteMod (
	vecMul (actionList.reduce ((pre, cur) =>
		vecAdd (pre, actionVec [cur] ?? [0, 0, 0]),
		[0, 0, 0]),
	accel))
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

const vecAdd = (...vecs) =>
	vecs.reduce ((acc, cur) =>
		acc.map ((comp, idx) =>
			comp + cur [idx]
		)
	)

const vecMul = (vec, fact) =>
	fact == 1 ? vec : vec.map (comp => comp * fact)