//#region // *** Basics *** //
const cnv = document.querySelector('.cnv')
const ctx = cnv.getContext('2d', { alpha: false })
const width = 800
const height = 800
cnv.width = width
cnv.height = height
let doLoop = false
let time = 0
const delta = 1 / 60

const lac = 2,
	per = 0.5,
	octaves = 8,
	seed = 0,
	scale = 400,
	offset = { x: 1000, y: 1000, z: 1000 }
noise.seed(seed)
//#endregion

//#region // *** Variables *** //

const terraceHeight = 5
const colorOffset = 1000
const hm = new NoiseMap({ x: 0, y: 0 }, { x: width, y: height }, { x: width / 4, y: height / 4 })

//#endregion

//#region // *** Setup *** //
function setup() {
	translate(width * 0.5, height * 0.5, 'set')

	hm.generate()

	loop()
}
//#endregion

//#region // *** Update *** //
function update(t) {}
//#endregion

//#region // *** Render *** //
function render() {
	background('hsla(0, 0%, 20%, 1)')

	hm.render()
}
//#endregion

//#region // *** Loop *** //
setup()
function loop() {
	update((time += delta))
	render()
	;(doLoop && setTimeout(loop, delta * 1000)) || console.log(`%c${'loop ended'}`, 'font-size: 1rem; color: lightblue')
}
//#endregion
