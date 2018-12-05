
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

var Plane = function(origin, normal, color) {
	this.origin = origin
	this.normal = normal
	this.color = color
}

var PointLight = function(position, color, intensity) {
	this.position = position
	this.color = color
	this.intensity = intensity
}


Sphere.prototype.collide = function(ray) {
	let M = ray.start.subtract(this.center)
	let b = M.dot(ray.direction)
	let c = M.dot(M) - this.radius * this.radius

	if(c > 0.0 && b > 0.0)  {
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

Plane.prototype.collide = function(ray) {
	let d = ray.direction.dot(this.normal)

	if(d <= 0.0) { // Ray misses plane
		return { collided: false, intersection: null, normal: null}
	}

	let t = (this.origin - ray.start).dot(this.normal) / d
	
}