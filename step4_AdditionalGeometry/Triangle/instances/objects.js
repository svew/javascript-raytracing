
//Because of floating point algebra, we allow some tolerance for ray intersection
//to prevent artifacts such as the ones in resources/step2_WeirdArtifacts.png
var EPSILON = 0.000001
var kEPSILON = 0.00033546262

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
	let dir = ray.direction.normalize()

	let v0v1 = v1.subtract(v0)
	let v0v2 = v2.subtract(v0)
	let N = v0v1.cross(v0v2).normalize()

	let NDotrayDir = N.dot(dir)
	if(Math.abs(NDotrayDir) < kEPSILON) {
		return {collided: false, intersection: null, normal: null}
	}

	let d = N.dot(v0)
	t = (N.dot(ray.start) + d)/NDotrayDir

	if(t < 0) {
		return {collided:false, intersection:null, normal: null}
	}

	let P = dir.multiply(t).add(ray.start)
	let edge0 = v1.subtract(v0)
	let vp0 = P.subtract(v0)
	let C = edge0.cross(vp0)

	if(N.dot(C) < 0) {
		return {collided:false, intersection:null, normal:null}
	}

	let edge1 = v2.subtract(v1)
	let vp1 = P.subtract(v1)
	C = edge1.cross(vp1)
	if(N.dot(C) < 0) {
		return {collided:false, intersection:null, normal:null}
	}

	let edge2 = v0.subtract(v2)
	let vp2 = P.subtract(v2)
	C = edge2.cross(vp2)
	if(N.dot(C) < 0) {
		return {collided:false, intersection:null, normal:null}
	}

	return {
		collided: true,
		intersection: P,
		normal: N
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

Cuboid.prototype.rotate = function(angle, x, y ,z) {
	for(let i = 0; i < 6; i++) {
		let oldX, oldY, oldZ
		if(x && !y && !z) {
			for(let j = 0; j < 2; j++) {
				for(let k = 0; k < 3; k++) {
					oldX1 = this.rects[i].triangles[j].vertices[k].x
					oldY1 = this.rects[i].triangles[j].vertices[k].y
					oldZ1 = this.rects[i].triangles[j].vertices[k].z
					this.rects[i].triangles[j].vertices[k].x = oldX1
					this.rects[i].triangles[j].vertices[k].y = (oldY1 * Math.cos(angle)) - (oldZ1 * Math.sin(angle))
					this.rects[i].triangles[j].vertices[k].z = (oldY1 * Math.sin(angle)) + (oldZ1 * Math.cos(angle))
				}
			}
		} else if(y && !z) {
			for(let j = 0; j < 2; j++) {
				for(let k = 0; k < 3; k++) {
					oldX = this.rects[i].triangles[j].vertices[k].x
					oldY = this.rects[i].triangles[j].vertices[k].y
					oldZ = this.rects[i].triangles[j].vertices[k].z
					this.rects[i].triangles[j].vertices[k].x = (oldZ * Math.sin(angle)) + (oldX * Math.cos(angle))
					this.rects[i].triangles[j].vertices[k].y = oldY
					this.rects[i].triangles[j].vertices[k].z = (oldZ * Math.cos(angle)) - (oldX * Math.sin(angle))
				}
			}
		} else if(z) {
			for(let j = 0; j < 2; j++) {
				for(let k = 0; k < 3; k++) {
					oldX = this.rects[i].triangles[j].vertices[k].x
					oldY = this.rects[i].triangles[j].vertices[k].y
					oldZ = this.rects[i].triangles[j].vertices[k].z
					this.rects[i].triangles[j].vertices[k].x = (oldX * Math.cos(angle)) - (oldY * Math.sin(angle))
					this.rects[i].triangles[j].vertices[k].y = (oldX * Math.sin(angle)) + (oldY * Math.cos(angle))
					this.rects[i].triangles[j].vertices[k].z = oldZ
				}
			}
		} else {
			console.log("Choose one!")
		}
	}
}
