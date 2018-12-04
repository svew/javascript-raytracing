
var CANVAS_WIDTH = 400
var CANVAS_HEIGHT = 400

//Get all of the objects that exist in the world (currently, just spheres)
function getWorld() {
	let objects = []
	let lights = []

	// Push objects
	objects.push(new Sphere(new Vector(0.0, 0.0, 2.0), 0.5, [200, 150, 100]))

	// Push lights
	lights.push(new PointLight(new Vector(1.0, 1.0, 0.0), [255, 255, 255], 50))

	return { objects: objects, lights: lights }
}

function findCollision(ray, world) {

	var shortestObject = null
	var shortestResult = null
	var shortestDistance = NaN

	for(let i = 0; i < world.objects.length; i++) {
		let obj = world.objects[i]
		let result = obj.collide(ray)

		if(result.collided) {

			let distance = result.intersection.subtract(ray.start).length()

			if(shortestObject == null || distance < shortestDistance) {
				shortestObject = obj
				shortestResult = result
				shortestDistance = distance
			}
		}
	}

	if(shortestObject == null) {
		return { collided: false }
	} else {
		return {
			collided: true,
			object: shortestObject,
			intersection: shortestResult.intersection,
			normal: shortestResult.normal,
			distance: shortestDistance,
		}
	}
}

// Acts as a fragment shader
function traceRay(canvasX, canvasY, world) {
	let sx = (canvasX / CANVAS_WIDTH) * 2 - 1
	let sy = (canvasY / CANVAS_HEIGHT) * 2 - 1
	let sz = 0

	let ray = new Ray(new Vector(sx, sy, sz), new Vector(0, 0, 1))
	let result = findCollision(ray, world)

	// If no collision occured, the ray flies into space
	if(!result.collided) {
		return [0, 0, 0]
	}

	// Search for lights which shine on this point
	for(let i = 0; i < world.lights.length; i++) {

		let light = world.lights[i]
		let lightRay = new Ray(
				light.position,
				light.position.subtract(result.intersection))
		let distanceFromLight = lightRay.direction.length()
		let lightCollision = findCollision(lightRay, world)

		//No light obstructions!
		if(!lightCollision.collided || lightCollision.distance <= distanceFromLight) {
		}
	}

	return shortestObject.color
}

// entry point when page is loaded
function main() {
	var canvas = document.getElementById('theCanvas');
	var context = canvas.getContext('2d', {antialias: false, depth: false});
	var imageData = context.getImageData(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
	var world = getWorld()

	for(let x = 0; x < CANVAS_WIDTH; x++) {
		for(let y = 0; y < CANVAS_HEIGHT; y++) {

			//Get the color at that pixel
			let color = traceRay(x, y, world)

			//Draw that pixel on the pixel data array
			var index = (y * CANVAS_WIDTH + x) * 4;
			imageData.data[index]     = color[0] // R
			imageData.data[index + 1] = color[1] // G
			imageData.data[index + 2] = color[2] // B
			imageData.data[index + 3] = 255 // A
		}
	}

	context.putImageData(imageData, 0, 0, );

	console.log("Finished!")
}
