class NoiseMap {
	constructor(center, size, dim) {
		this.center = center // position
		this.size = size //     width and height
		this.dim = dim //       resolution
		this.values = new Array(this.dim.x).fill().map(() => new Array(this.dim.y))
	}

	generate() {
		const step = { x: this.size.x / this.dim.x, y: this.size.y / this.dim.y }
		const noiseMinMax = { min: new int4(), max: new int4() }

		for (let i = 0; i < this.dim.x; i++) {
			for (let j = 0; j < this.dim.y; j++) {
				const x = this.center.x - this.size.x / 2 + (i + 0) * step.x
				const y = this.center.y - this.size.y / 2 + (j + 1) * step.y

				let v = new int4(
					getNoise(x, y, 0 * colorOffset),
					getNoise(x, y, 1 * colorOffset),
					getNoise(x, y, 2 * colorOffset),
					getNoise(x, y, 3 * colorOffset),
				)
				this.values[i][j] = v

				noiseMinMax.min.min(v)
				noiseMinMax.max.max(v)
			}
		}

		for (let i = 0; i < this.dim.x; i++) {
			for (let j = 0; j < this.dim.y; j++) {
				this.values[i][j].map(noiseMinMax.min, noiseMinMax.max, new int4(0, 0, 0, 0), new int4(1, 1, 1, 1))
			}
		}

		return this.values
	}

	render(rb = random([0, 1]), gb = random([0, 1]), bb = random([0, 1]), ab = random([0, 1])) {
		const step = { x: this.size.x / this.dim.x, y: this.size.y / this.dim.y }
		for (let i = 0; i < this.dim.x; i++) {
			for (let j = 0; j < this.dim.y; j++) {
				const x = this.center.x - this.size.x / 2 + (i + 0) * step.x
				const y = this.center.y - this.size.y / 2 + (j + 1) * step.y

				let r = (this.values[i][j].r + ((this.values[i][j].r * terraceHeight) % 1)) / 2
				if (this.values[i][j].r === 1) r = 1
				let g = (this.values[i][j].g + ((this.values[i][j].g * terraceHeight) % 1)) / 2
				if (this.values[i][j].g === 1) g = 1
				let b = (this.values[i][j].b + ((this.values[i][j].b * terraceHeight) % 1)) / 2
				if (this.values[i][j].b === 1) b = 1
				let a = (this.values[i][j].a + ((this.values[i][j].a * terraceHeight) % 1)) / 2
				if (this.values[i][j].a === 1) a = 1

				const c = `rgba(${r * 255}, ${g * 255}, ${b * 255}, 1)` //`rgba(${rb ? r * 255 : 0}, ${gb ? g * 255 : 0}, ${bb ? b * 255 : 0}, ${ab ? a * 255 : 0})`
				fill(c)
				stroke(c)
				rectMode('CORNER')
				rect(x, y, step.x, step.y)
			}
		}
	}
}

class int4 {
	constructor(r = 0, g = 0, b = 0, a = 0) {
		this.r = r
		this.g = g
		this.b = b
		this.a = a
	}

	min(c) {
		this.r = min(this.r, c.r)
		this.g = min(this.g, c.g)
		this.b = min(this.b, c.b)
		this.a = min(this.a, c.a)
	}

	max(c) {
		this.r = max(this.r, c.r)
		this.g = max(this.g, c.g)
		this.b = max(this.b, c.b)
		this.a = max(this.a, c.a)
	}

	map(c1, c2, c3, c4) {
		this.r = Map(this.r, c1.r, c2.r, c3.r, c4.r)
		this.g = Map(this.g, c1.g, c2.g, c3.g, c4.g)
		this.b = Map(this.b, c1.b, c2.b, c3.b, c4.b)
		this.a = Map(this.a, c1.a, c2.a, c3.a, c4.a)
	}

	forEach(f) {
		this.r = f(this.r)
		this.g = f(this.g)
		this.b = f(this.b)
		this.a = f(this.a)
	}
}
