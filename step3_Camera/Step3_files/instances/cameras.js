
//Cameras behave so that they are level with the ground
//Their purpose is to act as a lense through which one can create rays to color

var OrthographicCamera = function(direction, position, width=2, height=2) {
	this.width = width
	this.height = height
	this.direction = direction.normalize()
	this.position = position
}
var PerspectiveCamera = function(direction, position, angle, width=2, height=2) {
	//console.assert(angle >= 0 && angle <= 90, "angle was not exclusively between 0 and 90")

	this.width = width
	this.height = height
	this.direction = direction.normalize()
	this.position = position
	this.eyeOffset = Math.tan(angle * 180 / 3.1415926) * width / 2
}

OrthographicCamera.prototype.getRay = function(x, y) {
	//console.assert(x <= 1 && x >= -1 && y <= 1 && y >= -1, "x and/or y were not inclusively between -1 and 1")

	let unit_x = new Vector(0, 1, 0).cross(this.direction).normalize()
	let unit_y = unit_x.cross(this.direction).normalize()
	let planeOffset = unit_x.multiply(x * width).add(unit_y.multiply(y * height))

	return new Ray(
		this.position.add(planeOffset),
		this.direction,
	)
}

PerspectiveCamera.prototype.getRay = function(x, y) {
	//console.assert(x <= 1 && x >= -1 && y <= 1 && y >= -1, "x and/or y were not inclusively between -1 and 1")

	let unit_x = new Vector(0, 1, 0).cross(this.direction).normalize()
	let unit_y = unit_x.cross(this.direction).normalize()
	let planeOffset = unit_x.multiply(x * width).add(unit_y.multiply(y * height))
	let eyeLocation = this.direction.multiply(-this.eyeOffset)
	let start = this.position.add(planeOffset)

	return new Ray(
		start,
		start.subtract(eyeLocation).normalize()
	)
	
}

