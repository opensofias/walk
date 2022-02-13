export const keys = function* () {
	const pressed = new Set();
	[onkeydown, onkeyup] = [true, false].map (
		down => ({key: keyId}) => {
			const key = ((x) =>
				(x.startsWith ('Arrow') ? x.slice (5) : x)
				.toLowerCase ()) (keyId)
			if (down != pressed.has (key)) {
				pressed [down ? 'add' : 'delete'] (key)
				showDebug (pressed)
			}
	})
	onblur = () => {
		if (pressed.size) {
			pressed.clear ()
			showDebug (pressed)
		}
	}

	const actionMap = {
		q: 'cw', e: 'ccw',
		w: 'up', s: 'down',
		a: 'left', d: 'right'
	}
	while (true)
		yield [...pressed].map (key => actionMap [key] ?? key)
}