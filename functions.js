const translated = { x: 0, y: 0 }
const PI = Math.PI
let RECT_MODE = 'CORNERS' // [CORNERS, CORNER, CENTER, RADIUS]

//#region // *** Drawing *** //
function translate(x, y, p = 'add') {
	if (p === 'add') {
		translated.x += x
		translated.y += y
	}
	if (p === 'set') {
		translated.x = x
		translated.y = y
	}
}

function rectMode(m) {
	RECT_MODE = m
}

function fill(c) {
	ctx.fillStyle = c
}

function stroke(c) {
	ctx.strokeStyle = c
}

function strokeWidth(w) {
	ctx.lineWidth = w
}

function background(c) {
	ctx.fillStyle = c
	ctx.fillRect(0, 0, width, height)
}

function text(t, x, y) {
	strokeWidth(3)
	ctx.strokeText(t, x + translated.x, -y + translated.y)
	ctx.fillText(t, x + translated.x, -y + translated.y)
}

function rect(x1, y1, x2, y2) {
	ctx.beginPath()
	if (RECT_MODE == 'CORNERS') ctx.rect(x1 + translated.x, -y1 + translated.y, x2 - x1, -(y2 - y1))
	if (RECT_MODE == 'CORNER') ctx.rect(x1 + translated.x, -y1 + translated.y, x2, y2)
	if (RECT_MODE == 'CENTER') ctx.rect(x1 + translated.x - x2 / 2, -y1 + translated.y - y2 / 2, x2, y2)
	if (RECT_MODE == 'RADIUS') ctx.rect(x1 + translated.x - x2, -y1 + translated.y - y2, x2 * 2, y2 * 2)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}

function circle(x, y, r) {
	ctx.beginPath()
	ctx.ellipse(x + translated.x, -y + translated.y, r, r, 0, PI * 2, 0)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}

function point(x, y, r) {
	ctx.beginPath()
	ctx.ellipse(x + translated.x, -y + translated.y, r, r, 0, PI * 2, 0)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}

function ellipse(x, y, r1, r2, a = 0) {
	ctx.beginPath()
	ctx.ellipse(x + translated.x, -y + translated.y, r1, r2, a, PI * 2, 0)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}

function line(x1, y1, x2, y2) {
	ctx.beginPath()
	ctx.moveTo(x1 + translated.x, -y1 + translated.y)
	ctx.lineTo(x2 + translated.x, -y2 + translated.y)
	ctx.closePath()
	ctx.stroke()
}

function hexagon(x, y, r) {
	ctx.beginPath()
	ctx.moveTo(x + translated.x + r, -y + translated.y)
	for (let a = 0; a < PI * 2; a += PI / 3) {
		ctx.lineTo(x + translated.x + cos(a) * r, -y + translated.y + sin(a) * r)
	}
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}
//#endregion

//#region // *** Math *** //
function Map(value, minIn, maxIn, minOut, maxOut) {
	return ((value - minIn) * (maxOut - minOut)) / (maxIn - minIn) + minOut
}

function min() {
	return Math.min(...Array.from(arguments))
}

function max() {
	return Math.max(...Array.from(arguments))
}

function sin(v) {
	return Math.sin(v)
}

function cos(v) {
	return Math.cos(v)
}

function abs(v) {
	return Math.abs(v)
}

function floor(v) {
	return Math.floor(v)
}

function ceil(v) {
	return Math.ceil(v)
}

function round(v, p = 0) {
	return Math.round(v * 10 ** p) / 10 ** p
}

function sqrt(v) {
	return Math.sqrt(v)
}

function dtr(d) {
	return (d * PI) / 180
}

function rtd(r) {
	return (r * 180) / PI
}

function atan2(x, y) {
	return Math.atan2(y, x)
}
//#endregion

//#region // *** Utility *** //
/**
 * [ ] -> return random value from 0 to 1
 *
 * [ N ] -> returns random value from 0 to N
 *
 * [ N, M ] -> returns random value from N to M
 *
 * [ A ] -> returns a random entry of an Array A
 *
 * [ 'weights' or 'w', A ] -> returns an index of a random point inside weighted Array A
 */
function random() {
	if (arguments.length === 0) return Math.random()

	if (arguments.length === 1) {
		if (typeof arguments[0] === 'number') return Math.random() * arguments[0]
		if (Array.isArray(arguments[0])) return arguments[0][Math.floor(Math.random() * arguments[0].length)]
		return console.error('random function error: ', arguments)
	}

	if (arguments[0] === 'weights' || arguments[0] === 'w') {
		const weights = Array.from(arguments).splice(1)
		const sum = weights.reduce((a, b) => a + b)
		const value = random(sum)
		for (let i = 0, t = 0; i < weights.length; i++) {
			if (value < t) return i - 1
			t += weights[i]
		}
		return weights.length - 1
	}

	if (arguments.length === 2) {
		if (typeof arguments[0] === 'number' && typeof arguments[1] === 'number')
			return arguments[0] + (arguments[1] - arguments[0]) * Math.random()
		return console.error('random function error: ', arguments)
	}

	return console.error('random function error: ', arguments)
}

function range(start, stop, step = 1) {
	if (arguments.length === 1) {
		stop = start
		start = 0
	}

	if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
		return []
	}

	const result = []
	for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
		result.push(i)
	}

	return result
}

function getNoise(x = 0, y = 0, z = 0) {
	let frq = 1,
		amp = 1,
		noiseValue = 0

	for (let i = 0; i < octaves; i++) {
		const sampleX = ((x + offset.x) / scale) * frq
		const sampleY = ((y + offset.y) / scale) * frq
		const sampleZ = ((z + offset.z) / scale) * frq
		noiseValue += noise.simplex3(sampleX, sampleY, sampleZ) * amp

		frq *= lac
		amp *= per
	}

	return noiseValue
}

class Vector {
	constructor(x = 0, y = 0, z = 0) {
		this.x = x
		this.y = y
		this.z = z
	}

	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
	}

	magSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z
	}

	setMag(l) {
		this.normalize().mult(l)
		return this
	}

	normalize() {
		const l = this.mag()
		this.x /= l
		this.y /= l
		this.z /= l
		return this
	}

	mult(s) {
		this.x *= s
		this.y *= s
		this.z *= s
		return this
	}

	add(v) {
		this.x += v.x
		this.y += v.y
		this.z += v.y
		return this
	}

	sub(v) {
		this.x -= v.x
		this.y -= v.y
		this.z -= v.y
		return this
	}

	limit(l) {
		if (this.magSq() <= l * l) return this
		this.normalize()
		this.mult(l)
		return this
	}

	copy() {
		return new Vector(this.x, this.y, this.z)
	}

	static random2() {
		const a = random(Math.PI * 2)
		return new Vector(cos(a), sin(a))
	}

	static random3() {
		const u = random()
		const v = random()
		const a = Math.acos(2 * u - 1) - Math.PI / 2
		const b = Math.PI * 2 * v
		return new Vector(cos(a) * cos(b), cos(a) * sin(b), sin(b))
	}
}
//#endregion
