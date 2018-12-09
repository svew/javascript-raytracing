
//Cameras behave so that they are level with the ground
//Their purpose is to act as a lense through which one can create rays to color

var OrthographicCamera = function(direction, position, width=2, height=2) {
	this.width = width
	this.height = height
	this.direction = direction.normalize()
	this.position = position
}
var PerspectiveCamera = function(direction, position, angle) {
	//console.assert(angle >= 0 && angle <= 90, "angle was not exclusively between 0 and 90")

	this.direction = direction.normalize()
	this.position = position
	this.angle = angle
}

OrthographicCamera.prototype.getRay = function(x, y) {
	//console.assert(x <= 1 && x >= -1 && y <= 1 && y >= -1, "x and/or y were not inclusively between -1 and 1")

	let unit_x = new Vector(0, 1, 0).cross(this.direction).normalize()
	let unit_y = unit_x.cross(this.direction).normalize()
	let planeOffset = unit_x.multiply(x * this.width / 2).add(unit_y.multiply(y * this.height / 2))

	return new Ray(
		this.position.add(planeOffset),
		this.direction,
	)
}

PerspectiveCamera.prototype.getRay = function(x, y) {
	//console.assert(x <= 1 && x >= -1 && y <= 1 && y >= -1, "x and/or y were not inclusively between -1 and 1")

	let direction = this.direction
			.rotateX(y * this.angle)
			.rotateY(x * this.angle)

	return new Ray(this.position, direction)	
}

