
var PointLight = function(position, color, intensity) {
	this.position = position
	this.color = color
	this.intensity = intensity
}

PointLight.prototype.getDirection = function(point) {
	return point.subtract(this.position)
}

PointLight.prototype.getIntensity = function(point) {
	let L = point.subtract(this.position)
	let lightSphereSurfaceArea = (4 * Math.PI * L.dot(L))
	return this.intensity / lightSphereSurfaceArea
}

PointLight.prototype.getDistance = function(point) {
	return point.subtract(this.position).len()
}



var SunLight = function(direction, color, intensity) {
	this.direction = direction
	this.color = color
	this.intensity = intensity
}

SunLight.prototype.getDirection = function(point) {
	return this.direction
}

SunLight.prototype.getIntensity = function(point) {
	return this.intensity
}

SunLight.prototype.getDistance = function(point) {
	return Infinity
}
