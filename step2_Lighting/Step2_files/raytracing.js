
var CANVAS_WIDTH = 800
var CANVAS_HEIGHT = 800

//Get all of the objects that exist in the world
function getWorld() {
	let objects = []
	let lights = []

	// Push objects
	objects.push(new Sphere(new Vector(0, 0, 2.0), 0.5, [255, 0, 200]))

	// Push lights
	lights.push(new PointLight(new Vector(-1.5, 0, 1), [255, 255, 255], 10))

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

function traceRay(canvasX, canvasY, world) {
	let sx = (canvasX / CANVAS_WIDTH) * 2 - 1
	let sy = (canvasY / CANVAS_HEIGHT) * 2 - 1
	let sz = 0
	let shininess = 40
	let ambientStrength = 0.1;
	let specularStength = 0.5;

	let ray = new Ray(new Vector(sx, sy, sz), new Vector(0, 0, 1))
	let result = findCollision(ray, world)

	// If no collision occured, the ray flies into space
	if(!result.collided) {
		return [60, 60, 60]
	}

	let lightContributions
	let color = result.object.color

	// Search for lights which shine on this point
	for(let i = 0; i < world.lights.length; i++) {

		let light = world.lights[i]
		let lightRay = new Ray(
			light.position,
			light.position.subtract(result.intersection)
		);
		let distanceFromLight = lightRay.direction.len()
		let lightCollision = findCollision(lightRay, world)

		//No light obstructions!
		if(!lightCollision.collided || lightCollision.distance <= distanceFromLight) {
			let lightSphereSurfaceArea = (4 * Math.PI * Math.pow(distanceFromLight, 2))
			let intensityAtIntersection = light.intensity / lightSphereSurfaceArea

			//Vertex Shader Work

			//Need to set up
			//TODO
			let fL = new Vector(1, 0, 0);
			let fN = new Vector(1, 0, 0);
			let fR = new Vector(1, 0, 0);
			let fV = new Vector(1, 0, 0);

			//Fragment Shader Work

			//Normalized versions of the above
			let L = fL.normalize()
			let N = fN.normalize()
			let R = fR.normalize()
			let V = fV.normalize()

			// Reflected vector (NEEDS TO BE UPDATE FOR JS)
		    //R = reflect(-L, N);

			//TODO
			//Set up colors
			diffuseColor = [255, 255, 255];
			specularColor = [255, 255, 255];
			ambientColor = [
				world.lights[i].color[0] * ambientStrength,
				world.lights[i].color[1] * ambientStrength,
				world.lights[i].color[2] * ambientStrength
			];

			// Lambert's law, clamp negative values to zero
		    let diffuseFactor = new Vector(
				Math.max(0.0, L.x * N.x),
				Math.max(0.0, L.y * N.y),
				Math.max(0.0, L.z * N.z)
			);

		    // specular factor from Phong reflection model
		    let specularFactor = new Vector(
				Math.pow(Math.max(0.0, V.x * R.x), shininess),
				Math.pow(Math.max(0.0, V.y * R.y), shininess),
				Math.pow(Math.max(0.0, V.z * R.z), shininess)
			);

			color = [
				color[0] * (diffuseColor[0] * diffuseFactor.x + specularColor[0] * specularFactor.x + ambientColor[0]),
				color[1] * (diffuseColor[1] * diffuseFactor.y + specularColor[1] * specularFactor.y + ambientColor[1]),
				color[2] * (diffuseColor[2] * diffuseFactor.z + specularColor[2] * specularFactor.z + ambientColor[2])
			];
		}
	}
	return color
}

// entry point when page is loaded
function main() {
	var canvas = document.getElementById('theCanvas')
	var context = canvas.getContext('2d', {antialias: false, depth: false})
	var imageData = context.getImageData(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
	var world = getWorld()

	for(let x = 0; x < CANVAS_WIDTH; x++) {
		for(let y = 0; y < CANVAS_HEIGHT; y++) {

			//Get the color at that pixel
			let color = traceRay(x, y, world)

			//Draw that pixel on the pixel data array
			var index = (y * CANVAS_WIDTH + x) * 4
			imageData.data[index]     = color[0] // R
			imageData.data[index + 1] = color[1] // G
			imageData.data[index + 2] = color[2] // B
			imageData.data[index + 3] = 255 // A
		}
	}

	context.putImageData(imageData, 0, 0)
	console.log("Finished!")
}