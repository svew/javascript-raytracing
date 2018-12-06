
//Because of floating point algebra, we allow some tolerance for ray intersection
//to prevent artifacts such as the ones in resources/step2_WeirdArtifacts.png
var EPSILON = 0.000001

/*
	center: Center of the Sphere
	radius: The radius of the Sphere
	color: The color of the Sphere
*/
var Sphere = function(center, radius, color) {
	this.center = center
	this.radius = radius
	this.color = color
}

var PointLight = function(position, color, intensity) {
	this.position = position
	this.color = color
	this.intensity = intensity
}

var SunLight = function(direction, color, intensity) {
	this.direction = direction
	this.color = color
	this.intensity = intensity
}


Sphere.prototype.collide = function(ray) {

	let m = ray.start.subtract(this.center)
	let b = m.dot(ray.direction.normalize())
	let c = m.dot(m) - this.radius * this.radius

	if(c > -EPSILON && b > -EPSILON)  {
		return { collided: false, intersection: null, normal: null } // Origin outside of sphere, and ray faces away
	}
	
	let discriminant = b*b - c
	if(discriminant < 0.0) {
		return { collided: false, intersection: null, normal: null } // Ray misses sphere
	}

	let t = -b - Math.sqrt(discriminant)
	if(t < 0.0) t = 0.0
	let q = ray.direction.multiply(t).add(ray.start) // The point of intersection

	return { 
		collided: true, 
		intersection: q,
		normal: q.subtract(this.center)
	}
	
}

PointLight.prototype.getContribution = function(L, N, V) {
	//let lightSphereSurfaceArea = (4 * Math.PI * Math.pow(distanceFromLight, 2))
	//let intensityAtIntersection = light.intensity / lightSphereSurfaceArea

	let R = V.subtract(N.multiply(2*V.dot(N)))

	diffuseColor = this.color
	specularColor = this.color

	let specularFactor = Math.pow(Math.max(0.0, V.dot(R)), 300)
	let diffuseFactor = Math.max(0.0, L.dot(N))

	return specularColor.multiply(specularFactor).add(diffuseColor.multiply(diffuseFactor));
	//return this.color
}