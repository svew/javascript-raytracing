
MAX_RAY_BOUNCES = 4


function findCollision(ray, world) {

	let shortestObject = null
	let shortestResult = null
	let shortestDistance = Infinity
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

function calcLightContribution(V, N, L, material, lightAtPoint) {

	V = V.normalize()
	N = N.normalize()
	L = L.normalize()

	let reflectedLight = lightAtPoint.multiply(material.reflectivity)
	let absorbedLight = lightAtPoint.multiply(1 - material.reflectivity)
	let emittedLight = absorbedLight.multiply(material.color).multiply(1 - material.absorbtion)			
	let diffuseFactor = Math.max(0.0, L.reverse().dot(N))
	let diffuseLight = emittedLight.multiply(diffuseFactor)
	let Rl = N.multiply(2 * N.dot(L)).subtract(L)
	let specularFactor = Math.pow(Math.max(0.0, V.dot(Rl)), 10 / (material.smoothness + 0.1))
	let specularLight = reflectedLight.multiply(specularFactor)

	return diffuseLight.add(specularLight)
}

function traceRay(ray, world, bouncesLeft) {

	if(bouncesLeft <= 0) { return world.backgroundColor }
	let result = findCollision(ray, world)
	if(!result.collided) { return world.backgroundColor }

	let lightSum = new Vector(0, 0, 0)
	let material = result.object.material
	let V = ray.direction.normalize()
	let N = result.normal.normalize()
	let I = result.intersection


	// Add the light contributions of world lights which land on this intersection
	for(let i = 0; i < world.lights.length; i++) {

		let light = world.lights[i] 
		let L = light.getDirection(I) //From light to surface
		let shadowRay = new Ray(I, L.reverse());
		let shadowCollision = findCollision(shadowRay, world)

		// If the light was able to reach the intersection point
		if( !( shadowCollision.collided && shadowCollision.distance < light.getDistance(I) ) ) {

			let lightAtPoint = light.color.multiply(light.getIntensity(I))
			lightSum = lightSum.add(calcLightContribution(V, N, L, material, lightAtPoint))

		}
	}

	// Add the light contribution of the reflected light which lands on this intersection
	if(material.reflectivity > 0) {
		let R = V.subtract(N.multiply(2 * N.dot(V))) //Reflected across V, starting at I
		let reflectedRay = new Ray(I, R)
		let reflectedLight = traceRay(reflectedRay, world, bouncesLeft - 1)
		
		lightSum = lightSum.add(calcLightContribution(V, N, R.reverse(), material, reflectedLight)
			.multiply(material.reflectivity))
	}

	let lightSensitivity = world.lights.length / world.aperature

	return lightSum.divide(lightSensitivity)
}

function render(world, imageData, width, height) {

	for(let x = 0; x < width; x++) {
		for(let y = 0; y < height; y++) {
	
			//Create the ray
			let rx = (x / width) * 2 - 1
			let ry = (y / height) * 2 - 1
			let ray = world.camera.getRay(rx, ry)
	
			//Get the color from that ray
			color = traceRay(ray, world, MAX_RAY_BOUNCES)
	
			//Draw that pixel on the pixel data array
			var index = (y * width + x) * 4
			imageData.data[index]     = color.x * 255	// R
			imageData.data[index + 1] = color.y * 255	// G
			imageData.data[index + 2] = color.z * 255	// B
			imageData.data[index + 3] = 255 		// A
			
		}
	}
}

