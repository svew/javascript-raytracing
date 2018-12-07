
//Because of floating point algebra, we allow some tolerance for ray intersection
//to prevent artifacts such as the ones in resources/step2_WeirdArtifacts.png
var EPSILON = 0.000001

var Sphere = function(center, radius, color) {
	this.center = center
	this.radius = radius
	this.color = color
}

Sphere.prototype.collide = function(ray) {

	let m = ray.start.subtract(this.center)
	let b = m.dot(ray.direction.normalize())
	let c = m.dot(m) - this.radius * this.radius

	if(c > -EPSILON && b > -EPSILON)  {
		return { collided: false, intersection: null, normal: null } // Origin outside of sphere, and ray faces away
	}
	
	let discriminant = b * b - c
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

var Triangle = function(vertices, color) {
	this.vertices = vertices
	this.color = color
}

Triangle.prototype.collide = function(ray) {
	//Compute Normal
	let v0 = this.vertices[0]
	let v1 = this.vertices[1]
	let v2 = this.vertices[2]

	let v0v1 = v1.subtract(v0)
	let v0v2 = v2.subtract(v0)
	let normal = v0v1.cross(v0v2) //Normal Vector

	let b = normal.dot(ray.direction.normalize())
	let t = normal.dot(ray.start) + normal.dot(v0)

	let intersection = ray.direction.normalize().multiply(t).add(ray.start)

	let edge0 = v1.subtract(v0)
	let vp0 = intersection.subtract(v0)
	let C0 = edge0.cross(vp0)

	let edge1 = v2.subtract(v1)
	let vp1 = intersection.subtract(v1)
	let C1 = edge1.cross(vp1)

	let edge2 = v0.subtract(v2)
	let vp2 = intersection.subtract(v2)
	let C2 = edge2.cross(vp2)

	if(b < EPSILON || t < 0 || normal.dot(C0) < 0 || normal.dot(C1) < 0 || normal.dot(C2) < 0) {
		return {
			collided: false,
			intersection: null,
			normal: null
		}
	}
	
	return {
		collided:true,
		intersection: intersection,
		normal: normal
	}
}