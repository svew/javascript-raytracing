
var CANVAS_WIDTH = 400
var CANVAS_HEIGHT = 400

/*
	i, j, k: Integers denoting direction vector is going in.
*/
var Vector = function(x, y, z) {
	this.x = x
	this.y = y
	this.z = z
}

Vector.prototype.add = function(v) {
	if(typeof v == "number") {
		v = new Vector(v, v, v)
	}
	return new Vector(this.x + v.x, this.y + v.y, this.z + v.z)
}
Vector.prototype.subtract = function(v) {
	if(typeof v == "number") {
		v = new Vector(v, v, v)
	}
	return new Vector(this.x - v.x, this.y - v.y, this.z - v.z)
}
Vector.prototype.multiply = function(v) {
	if(typeof v == "number") {
		v = new Vector(v, v, v)
	}
	return new Vector(this.x * v.x, this.y * v.y, this.z * v.z)
}
Vector.prototype.cross = function(v) {
	let sx = this.y*v.z - this.z*v.y
	let sy = this.z*v.x - this.x*v.z
	let sz = this.x*v.y - this.y*v.x
	return new Vector(sx, sy, sz)
}
Vector.prototype.normalize = function() {
	let length = this.length()
	return new Vector(this.x/length, this.y/length, this.z/length)
}
Vector.prototype.length = function() {
	return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z)
}
Vector.prototype.dot = function(v) {
	return this.x*v.x + this.y*v.y + this.z*v.z
}

/*
	start: Origin Point of the light ray.
	direction: Vector direction of light ray.
*/
var Ray = function(start, direction) {
	this.start = start
	this.vectorDirection = direction
}

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

Sphere.prototype.collide = function(ray) {
	let M = ray.start.subtract(this.center)
	let b = M.dot(ray.vectorDirection)
	let c = M.dot(M) - this.radius * this.radius

	if(c > 0.0 && b > 0.0)  {
		return { collided: false, distance: NaN } //Origin outside of sphere, and ray faces away
	}

	let discriminant = b*b - c
	if(discriminant < 0.0) {
		return { collided: false, distance: NaN } //Ray misses sphere
	}

	let t = -b - Math.sqrt(discriminant)
	if(t < 0.0) t = 0.0
	let q = ray.vectorDirection.multiply(t).add(ray.start)

	return { collided: true, distance: q.subtract(ray.start).length() }
}

//Get all of the objects that exist in the world (currently, just spheres)
function getWorld() {
	let world = []

	// Push the world objects
	world.push(new Sphere(new Vector(0.0, 0.0, 2.0), 0.5, [200, 150, 100]))
	world.push(new Sphere(new Vector(0.3, -0.4, 1.3), 0.2, [10, 250, 100]))

	return world
}

// Acts as a fragment shader
function traceRay(canvasX, canvasY, world) {
	let sx = (canvasX / CANVAS_WIDTH) * 2 - 1
	let sy = (canvasY / CANVAS_HEIGHT) * 2 - 1
	let sz = 0

	let ray = new Ray(new Vector(sx, sy, sz), new Vector(0, 0, 1))

	var shortestDistance = null
	var shortestObject = null
	for(let i = 0; i < world.length; i++) {
		let obj = world[i]
		let result = obj.collide(ray)

		//If there was a collision!
		if(result.collided) {
			if(shortestObject == null || result.distance < shortestDistance) {
				shortestObject = obj
				shortestDistance = result.distance
			}
		}
	}

	if(shortestObject != null) {
		return shortestObject.color
	} else {
		return [0, 0, 0]
	}
}

// entry point when page is loaded
function main() {
	var canvas = document.getElementById('theCanvas');
	var context = canvas.getContext('2d', {antialias: false, depth: false});
	var imageData = context.getImageData(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
	var world = getWorld()

	for(let x = 0; x < CANVAS_WIDTH; x++) {
		for(let y = 0; y < CANVAS_HEIGHT; y++) {

			//Get the color at that pixel
			let color = traceRay(x, y, world)

			//Draw that pixel on the pixel data array
			var index = (y * CANVAS_WIDTH + x) * 4;
			imageData.data[index]     = color[0] // R
			imageData.data[index + 1] = color[1] // G
			imageData.data[index + 2] = color[2] // B
			imageData.data[index + 3] = 255 // A
		}
	}

	context.putImageData(imageData, 0, 0, );

	console.log("Finished!")
}
