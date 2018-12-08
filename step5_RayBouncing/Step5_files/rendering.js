
MAX_RAY_BOUNCES = 5

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

function traceRay(ray, world, bouncesLeft) {

	let result = findCollision(ray, world)

	// If no collision occured, the ray flies into space
	if(!result.collided) {

		return world.backgroundColor
	}

	let colorSum = result.object.color.multiply(world.ambientColor.multiply(world.ambientStrength))

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

		colorSum = colorSum.add(light.getContribution(
			lightRay.direction, //L
			result.normal,		//N
			ray.direction))		//V
	}

	//console.log(colorSum.divide(world.lights.length / world.aperature).string())

	return colorSum.divide(world.lights.length / world.aperature)
}


function render(world, imageData, width, height) {

	for(let x = 0; x < width; x++) {
		for(let y = 0; y < height; y++) {
	
			//Create the ray
			let rx = (x / width) * 2 - 1
			let ry = (y / height) * 2 - 1
			let ray = world.camera.getRay(rx, ry)
	
			//Get the color from that ray
			let color = traceRay(ray, world, MAX_RAY_BOUNCES)
	
			//Draw that pixel on the pixel data array
			
			var index = (y * width + x) * 4
			imageData.data[index]     = color.x * 255	// R
			imageData.data[index + 1] = color.y * 255	// G
			imageData.data[index + 2] = color.z * 255	// B
			imageData.data[index + 3] = 255 		// A
		}
	}
}

