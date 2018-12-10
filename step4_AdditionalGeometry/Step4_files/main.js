
CANVAS_WIDTH = 800
CANVAS_HEIGHT = 800

//Get all of the objects that exist in the world
function getWorld() {

	// Push objects
	let objects = []
	//objects.push(new Sphere(new Vector(0.2, 0, 2.0), 0.5, new Vector(1, 1, 0.5))) //Large
	//objects.push(new Sphere(new Vector(-0.4, 0.5, 2.0), 0.2, new Vector(0, 1, 1))) //Small
	//objects.push(new Sphere(new Vector(-0.5, -0.5, 3.0), 0.35, new Vector(1, 1, 1))) //Medium
	width = 1
	height = 1


	objects.push(new Triangle([
		new Vector(0, 0.5, 3), //Vertice 1
		new Vector(-0.5, -0.5, 3), //Vertice 2
		new Vector(0.5, -0.5, 3), //Vertice 3
	], new Vector(1, 0, 0)))

	/*
	let rectangle = new Rectangle([
		new Vector(-0.2 * width, 0.2 * height, 1.0),
		new Vector(-0.2 * width, -0.2 * height, 1.0),
		new Vector(0.2 * width, 0.2 * height, 1.0),
		new Vector(0.2 * width, -0.2 * height, 1.0)
	], new Vector(1, 1, 1))
	for(let i = 0; i < 2; i++) {
		objects.push(rectangle.triangles[i])
	}*/

	/*
	let cuboid = new Cuboid([
		new Vector(-0.2, 0.1, 3.0), // TOP LEFT -Z
		new Vector(-0.2, -0.2, 3.0), // BOTTOM LEFT -Z
		new Vector(0, 0, 2.0), // TOP RIGHT Z
		new Vector(0, -0.3, 2.0), // BOTTOM RIGHT -Z
		new Vector(0, 0.2, 4.0), // TOP LEFT Z
		new Vector(0, 0, 4.0), // BOTTOM LEFT Z
		new Vector(0.2, 0.1, 3.0), // TOP RIGHT Z
		new Vector(0.2, -0.2, 3.0) // BOTTOM RIGHT -Z
	], new Vector(1, 1, 1))

	for(let i = 0; i < cuboid.rects.length; i++) {
		objects.push(cuboid.rects[i].triangles[0])
		objects.push(cuboid.rects[i].triangles[1])
	}
	*/


	// Push lights
	let lights = []
	//lights.push(new PointLight(new Vector(0, 7, 2), COLORS.GREEN, 500)) //Green
	//lights.push(new PointLight(new Vector(-2, 0.9, 1), COLORS.RED, 300)) //Red
	//lights.push(new PointLight(new Vector(2, -5, -1), COLORS.BLUE, 500)) //Blue
	//lights.push(new PointLight(new Vector(-1, -1, -1), COLORS.WHITE, 500))
	lights.push(new PointLight(new Vector(1, 1, -1), COLORS.WHITE, 200));

	let ambientColor = new Vector(1,1,1)
	let ambientStrength = 0.2
	let backgroundColor = new Vector(1, 1, 1)
	let aperature = 2 //How much light we collect from the world

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
