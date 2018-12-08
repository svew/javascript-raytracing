
CANVAS_WIDTH = 800
CANVAS_HEIGHT = 800

//Get all of the objects that exist in the world
function getWorld() {

	// Push objects
	let objects = []
	objects.push(new Sphere(new Vector(0.0, 0, 2.0), 0.5, new Vector(1, 0, 0))) //Large
	objects.push(new Sphere(new Vector(-0.5, 0.5, 2.0), 0.2, new Vector(1, 1, 1))) //Small
	objects.push(new Sphere(new Vector(-0.5, -0.5, 2.0), 0.35, new Vector(1, 1, 1))) //Medium


	// Push lights
	let lights = []
	lights.push(new PointLight(new Vector(0, 7, 2), COLORS.GREEN, 300)) //Green
	lights.push(new PointLight(new Vector(-2, 0.9, 1), COLORS.RED, 100)) //Red
	lights.push(new PointLight(new Vector(2, -5, -1), COLORS.BLUE, 200)) //Blue
	//lights.push(new PointLight(new Vector(-1, -1, -1), COLORS.WHITE, 300))

	let ambientColor = new Vector(1,1,1)
	let ambientStrength = 0.2
	let backgroundColor = new Vector(0.1, 0.1, 0.1)
	let aperature = 5.0 //How much light we collect from the world

	let camera = new PerspectiveCamera(new Vector(0, 0, 1), new Vector(0, 0, 0), 0.01)

	return {
		objects: objects, 
		lights: lights,
		ambientColor: ambientColor,
		ambientStrength: ambientStrength,
		backgroundColor: backgroundColor,
		aperature: aperature,
		camera: camera,
	}
}

function main() {
	var canvas = document.getElementById('theCanvas')
	var context = canvas.getContext('2d', {antialias: false, depth: false})
	var imageData = context.getImageData(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
	var world = getWorld()
	
	render(world, imageData, 800, 800)

	context.putImageData(imageData, 0, 0)
	console.log("New Image data posted")
}

