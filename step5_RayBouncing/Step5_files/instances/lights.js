
COLORS = {
	RED: new Vector(1, 0, 0),
	GREEN: new Vector(0, 1, 0),
	BLUE: new Vector(0, 0, 1),
	CYAN: new Vector(0, 1, 1),
	WHITE: new Vector(1, 1, 1),
}

var PointLight = function(position, color, intensity) {
	this.position = position
	this.color = color
	this.intensity = intensity
}
var SunLight = function(direction, color, intensity) {
	this.direction = direction
	this.color = color
	this.intensity = intensity
}



PointLight.prototype.getContribution = function(L, N, V) {
	let lightSphereSurfaceArea = (4 * Math.PI * L.dot(L))

	L = L.normalize()
	N = N.normalize()
	V = V.normalize()

	let R = N.multiply(2 * (N.dot(L))).subtract(L)

	diffuseColor = this.color.multiply(this.intensity / lightSphereSurfaceArea)
	specularColor = this.color.multiply(this.intensity / lightSphereSurfaceArea)

	let specularFactor = Math.pow(Math.max(0.0, V.dot(R)), 100)
	let diffuseFactor = Math.max(0.0, L.dot(N))

	return specularColor.multiply(specularFactor).add(diffuseColor.multiply(diffuseFactor));
	//return this.color
}

SunLight.prototype.getContribution = function(L, N, V) {
	return new Vector(1, 1, 1)
}