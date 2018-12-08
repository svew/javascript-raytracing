
CANVAS_WIDTH = 800
CANVAS_HEIGHT = 800

//Get all of the objects that exist in the world
function getWorld() {

	// Push objects
	let objects = []
	//objects.push(new Sphere(new Vector(0.2, 0, 2.0), 0.5, new Vector(1, 1, 0.5))) //Large
	//objects.push(new Sphere(new Vector(-0.4, 0.5, 2.0), 0.2, new Vector(0, 1, 1))) //Small
	objects.push(new Sphere(new Vector(-0.5, -0.5, 2.0), 0.35, new Vector(1, 1, 1))) //Medium
	objects.push(new Triangle([
		new Vector(0, 0.2, 3), //Vertice 1
		new Vector(-0.2, -0.2, 3), //Vertice 2
		new Vector(0.2, -0.2, 2), //Vertice 3
	], new Vector(1, 0, 0)));


	// Push lights
	let lights = []
	lights.push(new PointLight(new Vector(0, 7, 2), COLORS.GREEN, 500)) //Green
	lights.push(new PointLight(new Vector(-2, 0.9, 1), COLORS.RED, 300)) //Red
	lights.push(new PointLight(new Vector(2, -5, -1), COLORS.BLUE, 600)) //Blue
	lights.push(new PointLight(new Vector(-1, -1, -1), COLORS.WHITE, 200))
	lights.push(new PointLight(new Vector(0, 0, 0), COLORS.WHITE, 30));

	let ambientColor = new Vector(1,1,1)
	let ambientStrength = 0.2
	let backgroundColor = new Vector(0, 0, 0)
	let aperature = 2 //How much light we collect from the world

	let camera = new PerspectiveCamera(new Vector(0, 0, 1), new Vector(0, 0, 0), 30)

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

