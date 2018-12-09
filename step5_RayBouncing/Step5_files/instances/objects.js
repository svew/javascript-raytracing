
//Because of floating point algebra, we allow some tolerance for ray intersection
//to prevent artifacts such as the ones in resources/step2_WeirdArtifacts.png
var EPSILON = 0.000001



var Sphere = function(center, radius, material) {
	this.center = center
	this.radius = radius
	this.material = material
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



var Plane = function(origin, normal, material) {
	this.origin = origin
	this.normal = normal.normalize()
	this.material = material
}

Plane.prototype.collide = function(ray) {
	
	let d = this.normal.dot(ray.direction)
	if(Math.abs(d) > EPSILON) {
		let t = (this.origin.subtract(ray.start)).dot(this.normal) / d
		if(t > EPSILON) {
			let I = ray.direction.multiply(t).add(ray.start)
			return {
				collided: true,
				intersection: I,
				normal: this.normal,
			}
		}
	}

	return { collided: false }
}
