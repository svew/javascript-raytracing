
/*
	i, j, k: Integers denoting direction vector is going in.
*/
var Vector = function(x, y, z) {
	this.x = x
	this.y = y
	this.z = z
}

/*
	start: Origin Point of the light ray.
	direction: Vector direction of light ray.
*/
var Ray = function(start, direction) {
	this.start = start
	this.direction = direction
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
Vector.prototype.divide = function(v) {
	if(typeof v == "number") {
		v = new Vector(v, v, v)
	}
	return new Vector(this.x / v.x, this.y / v.y, this.z / v.z)
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
Vector.prototype.cosangle = function(v) {
	return this.dot(v).divide(this.length()).divide(this.length())
}
Vector.prototype.angle = function(v) {
	return Math.acos(this.cosangle(v))
}
