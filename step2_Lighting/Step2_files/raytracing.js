
var CANVAS_WIDTH = 800
var CANVAS_HEIGHT = 800

//Get all of the objects that exist in the world
function getWorld() {

	// Push objects
	let objects = []
	objects.push(new Sphere(new Vector(0, 0, 2.0), 0.5, new Vector(1, 0, 0)))
	objects.push(new Sphere(new Vector(-0.5, 0.5, 2.0), 0.2, new Vector(1, 1, 1)))

	// Push lights
	let lights = []
	lights.push(new PointLight(new Vector(4, -1, -1), new Vector(0, 1, 1), 20))
	lights.push(new PointLight(new Vector(-2, 0, 2), new Vector(1, 0, 0), 20))

	let ambientColor = new Vector(1,1,1)
	let ambientStrength = 0.2
	let backgroundColor = new Vector(0.1,0)

	return { 
		objects: objects, 
		lights: lights,
		ambientColor: ambientColor,
		ambientStrength: ambientStrength,
		backgroundColor: backgroundColor,
	}
}

function findCollision(ray, world) {

	var shortestObject = null
	var shortestResult = null
	var shortestDistance = NaN

	for(let i = 0; i < world.objects.length; i++) {
		let obj = world.objects[i]
		let result = obj.collide(ray)

		if(result.collided) {

			let distance = result.intersection.subtract(ray.start).len()

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

function lightContribution(light, L, N, V) {
	//let lightSphereSurfaceArea = (4 * Math.PI * Math.pow(distanceFromLight, 2))
	//let intensityAtIntersection = light.intensity / lightSphereSurfaceArea

	let R = V.subtract(N.multiply(V.dot(N) * 2))

	diffuseColor = light.color
	specularColor = light.color

	let specularFactor = Math.pow(Math.max(0.0, V.dot(R)), 300)
	let diffuseFactor = Math.max(0.0, L.dot(N))

	return specularColor.multiply(specularFactor).add(diffuseColor.multiply(diffuseFactor));
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

		//No light obstructions!
		if(!lightCollision.collided || (lightCollision.collided && lightCollision.distance >= distanceFromLight)) {
			colorSum = colorSum.add(lightContribution(
				light, 							//light
				lightRay.direction.normalize(), //L
				result.normal.normalize(),		//N
				ray.direction.reverse().normalize()))		//V
		}
	}

	//console.log(colorSum.x)
	return colorSum.divide(world.lights.length)
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
			imageData.data[index]     = color.x * 255 // R
			imageData.data[index + 1] = color.y * 255// G
			imageData.data[index + 2] = color.z * 255// B
			imageData.data[index + 3] = 255 // A
		}
	}

	context.putImageData(imageData, 0, 0)
	console.log("Finished!")
}
