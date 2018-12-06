
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
	//let lightSphereSurfaceArea = (4 * Math.PI * Math.pow(distanceFromLight, 2))
	//let intensityAtIntersection = light.intensity / lightSphereSurfaceArea

	let R = N.multiply(2 * (N.dot(L))).subtract(L)

	diffuseColor = this.color
	specularColor = this.color

	let specularFactor = Math.pow(Math.max(0.0, L.dot(R)), 100)
	let diffuseFactor = Math.max(0.0, L.dot(N))

	return specularColor.multiply(specularFactor).add(diffuseColor.multiply(diffuseFactor));
	//return this.color
}

SunLight.prototype.getContribution = function(L, N, V) {
	return new Vector(1, 1, 1)
}