
var CANVAS_WIDTH = 800
var CANVAS_HEIGHT = 800

//Get all of the objects that exist in the world
function getWorld() {

	// Push objects
	let objects = []
	objects.push(new Sphere(new Vector(-0.1, 0, 2.0), 0.5, new Vector(1, 0, 0))) //Large
	objects.push(new Sphere(new Vector(-0.5, 0.5, 2.0), 0.2, new Vector(1, 1, 1))) //Small
	objects.push(new Sphere(new Vector(-0.5, -0.5, 2.0), 0.35, new Vector(1, 1, 1))) //Medium


	// Push lights
	let lights = []
	//lights.push(new PointLight(new Vector(0, 8, 2), new Vector(0, 1, 0), 20)) //Green
	//lights.push(new PointLight(new Vector(-2, 0.9, 1), new Vector(1, 0, 0), 20)) //Red
	//lights.push(new PointLight(new Vector(2, -5, -1), new Vector(0, 0, 1), 20)) //Blue
	lights.push(new PointLight(new Vector(0, 0, 0), new Vector(0, 0, 0), 20)) //White


	let ambientColor = new Vector(1,1,1)
	let ambientStrength = 0.2
	let backgroundColor = new Vector(0.1,0)
	let aperature = 2.0 //How much light we collect from the world

	return { 
		objects: objects, 
		lights: lights,
		ambientColor: ambientColor,
		ambientStrength: ambientStrength,
		backgroundColor: backgroundColor,
		aperature: aperature,
	}
}

function findCollision(ray, world) {

	let shortestObject = null
	let shortestResult = null
	let shortestDistance = NaN
	let shortestIndex = NaN

	//Find the closest collision point amongst all objects in the world
	for(let i = 0; i < world.objects.length; i++) {

		let obj = world.objects[i]
		let result = obj.collide(ray)

		if(result.collided) {

			let distance = result.intersection.subtract(ray.start).len()

			if(shortestObject == null || distance < shortestDistance) {
				shortestObject = obj
				shortestResult = result
				shortestDistance = distance
				shortestIndex = i
			}
		}
	}

	if(shortestObject == null) {
		return { collided: false }
	} else {
		return {
			collided: true,
			object: shortestObject,
			objectIndex: shortestIndex,
			intersection: shortestResult.intersection,
			normal: shortestResult.normal,
			distance: shortestDistance,
		}
	}
}

function traceRay(ray, world) {

	let result = findCollision(ray, world)

	// If no collision occured, the ray flies into space
	if(!result.collided) {
		return world.backgroundColor
	}

	let colorSum = world.ambientColor.multiply(world.ambientStrength)

	// Search for lights which shine on this point
	for(let i = 0; i < world.lights.length; i++) {

		let light = world.lights[i]
		let lightRay = new Ray(
			result.intersection,
			light.position.subtract(result.intersection)
		);
		let distanceFromLight = lightRay.direction.len()
		let lightCollision = findCollision(lightRay, world)

		//The light ray collided with something during its travel to the light
		if(lightCollision.collided && lightCollision.distance < distanceFromLight) {
			continue
		}

		colorSum = colorSum.add(
			light.getContribution(
				lightRay.direction.normalize(), //L
				result.normal.normalize(),		//N
				ray.direction.normalize()		//V
			)
		)		

		colorSum = result.object.color.multiply(colorSum)
	}

	return colorSum.divide(world.lights.length / world.aperature)
}

// entry point when page is loaded
function main() {
	var canvas = document.getElementById('theCanvas')
	var context = canvas.getContext('2d', {antialias: false, depth: false})
	var imageData = context.getImageData(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
	var world = getWorld()

	for(let x = 0; x < CANVAS_WIDTH; x++) {
		for(let y = 0; y < CANVAS_HEIGHT; y++) {

			//Create the ray
			let rx = (x / CANVAS_WIDTH) * 2 - 1
			let ry = (y / CANVAS_HEIGHT) * 2 - 1
			let rz = 0
			let ray = new Ray(new Vector(rx, ry, rz), new Vector(0, 0, 1))

			//Get the color from that ray
			let color = traceRay(ray, world)

			//Draw that pixel on the pixel data array
			var index = ((CANVAS_HEIGHT - 1 - y) * CANVAS_WIDTH + x) * 4
			imageData.data[index]     = color.x * 255	// R
			imageData.data[index + 1] = color.y * 255	// G
			imageData.data[index + 2] = color.z * 255	// B
			imageData.data[index + 3] = 255 			// A
		}
	}

	context.putImageData(imageData, 0, 0)
	console.log("Finished!")
}
