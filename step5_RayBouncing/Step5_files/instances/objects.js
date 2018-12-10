
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

var Triangle = function(vertices, color, material) {
	this.vertices = vertices
	this.color = color
	this.material = material
}

Triangle.prototype.collide = function(ray) {
	let v0 = this.vertices[0]
	let v1 = this.vertices[1]
	let v2 = this.vertices[2]
	let edge1 = v1.subtract(v0)
	let edge2 = v2.subtract(v0)
	let h = ray.direction.normalize().cross(edge2)
	let a = edge1.dot(h)
	let f = 1.0/a
	let s = ray.start.subtract(v0)
	let u = f * (s.dot(h))
	let q = s.cross(edge1)
	let v = f * ray.direction.normalize().dot(q)

	if(a > -EPSILON && a < EPSILON || u < 0.0 || u > 1.0 || v < 0.0 || u + v > 1.0) {
		return {collided:false, intersection: null, normal: null}
	}

	let t = f * edge2.dot(q)

	if(t > EPSILON) {
		return {
			collided: true,
			intersection: ray.start.add(ray.direction.normalize()).multiply(t),
			normal: edge2.cross(edge1).normalize()
		}
	}

	return {
		collided: false, intersection: null, normal: null
	}
}

var Rectangle = function(vertices, color, material) {
	let v0 = vertices[0]
	let v1 = vertices[1]
	let v2 = vertices[2]
	let v3 = vertices[3]

	this.triangles = []
	this.triangles[0] = new Triangle([v0, v1, v2], color, material)
	this.triangles[1] = new Triangle([v3, v2, v1], color, material)
}

var Cuboid = function(vertices, color, material) {
	let v0 = vertices[0]
	let v1 = vertices[1]
	let v2 = vertices[2]
	let v3 = vertices[3]
	let v4 = vertices[4]
	let v5 = vertices[5]
	let v6 = vertices[6]
	let v7 = vertices[7]

	this.rects = []
	this.rects[0] = new Rectangle([
		v0, v1, v2, v3 //FRONT
	], color, material)
	this.rects[1] = new Rectangle([
		v4, v5, v6, v7 //BACK
	], color, material)
	this.rects[2] = new Rectangle([
		v0, v2, v4, v6 //TOP
	], color, material)
	this.rects[3] = new Rectangle([
		v1, v3, v5, v7 //BOTTOM
	], color, material)
	this.rects[4] = new Rectangle([
		v0, v1, v4, v5 //LEFT
	], color, material)
	this.rects[5] = new Rectangle([
		v2, v3, v6, v7 //RIGHT
	], color, material)
}
