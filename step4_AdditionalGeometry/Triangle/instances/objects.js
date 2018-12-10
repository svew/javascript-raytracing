
//Because of floating point algebra, we allow some tolerance for ray intersection
//to prevent artifacts such as the ones in resources/step2_WeirdArtifacts.png
var EPSILON = 0.000001

var Sphere = function(center, radius, color) {
	this.center = center
	this.radius = radius
	this.color = color
}

Triangle.prototype.collide = function(ray) {
	let v0 = this.vertices[0]
	let v1 = this.vertices[1]
	let v2 = this.vertices[2]
	let v1v0 = v1.subtract(v0)
	let v2v0 = v2.subtract(v0)

	let P = ray.direction.normalize().cross(v2v0)
	let S = ray.start.subtract(v0)
	let Q = S.cross(v1v0)

	let determinant = v1v0.dot(P)
	let invertedDeterminant = 1.0/determinant

	let u = invertedDeterminant * (S.dot(P))
	let v = invertedDeterminant * ray.direction.normalize().dot(Q)

	if(determinant > -EPSILON && determinant < EPSILON || u < 0.0 || u > 1.0 || v < 0.0 || u + v > 1.0) { //Ray misses the triangle
		return {collided:false, intersection: null, normal: null}
	}

	let t = invertedDeterminant * v2v0.dot(Q)

	if(t > EPSILON) { //Colission!
		return {
			collided: true,
			intersection: ray.start.add(ray.direction.normalize()).multiply(t),
			normal: v2v0.cross(v1v0).normalize()
		}
	}

	return {
		collided: false, intersection: null, normal: null
	}
}

var Rectangle = function(vertices, color) {
	let v0 = vertices[0]
	let v1 = vertices[1]
	let v2 = vertices[2]
	let v3 = vertices[3]

	this.triangles = []
	this.triangles[0] = new Triangle([v0, v1, v2], color)
	this.triangles[1] = new Triangle([v3, v2, v1], color)
}

var Cuboid = function(vertices, color) {
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
	], color)
	this.rects[1] = new Rectangle([
		v4, v5, v6, v7 //BACK
	], color)
	this.rects[2] = new Rectangle([
		v0, v2, v4, v6 //TOP
	], color)
	this.rects[3] = new Rectangle([
		v1, v3, v5, v7 //BOTTOM
	], color)
	this.rects[4] = new Rectangle([
		v0, v1, v4, v5 //LEFT
	], color)
	this.rects[5] = new Rectangle([
		v2, v3, v6, v7 //RIGHT
	], color)
}
