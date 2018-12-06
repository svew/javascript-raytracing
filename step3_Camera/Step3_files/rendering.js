
var CANVAS_WIDTH = 800
var CANVAS_HEIGHT = 800


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
			lightRay.direction.normalize(), //L
			result.normal.normalize(),		//N
			ray.direction.normalize()))		//V
	}

	return colorSum.divide(world.lights.length / world.aperature)
}


function render(world, imageData, width, height) {

}

