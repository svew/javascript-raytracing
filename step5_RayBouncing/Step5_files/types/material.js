
COLORS = {
	RED: new Vector(1, 0, 0),
	GREEN: new Vector(0, 1, 0),
	BLUE: new Vector(0, 0, 1),
	CYAN: new Vector(0, 1, 1),
	WHITE: new Vector(1, 1, 1),
}

/*
Light hitting a surface will do one of two things:
 - Be immediately reflected
 - Enter the material

The material calculations are based on these properties. All light
hitting the surface is either reflected or enters the material,
meaning if 20% of the light is reflected, then 80% of the light must
therefore be absorbed into the material.

Reflectivity: The percent of light reflected

Consider the light reflected. It's important to know how the light will 
bounce off of the surface. If a surface is completely smooth, the
reflected light will bounce off exactly as expected. If the surface
is very bumpy, the reflected light will bounce off at different angles.

Smoothness: How smooth the surface is

Consider the light absorbed. If the absorbed light is re-emmited by the
material, it will take on some of that material's color. The material
can only subtract color from the ray, not add it, so the material color
represents what portions of the light are subtracted by the material.
We consider all absorbed light to be re-emmited, after being subtracted
by the given color.

Absorbtion: How much absorbed light will not be reemitted
*/

var Material = function(reflectivity, smoothness, absorbtion, color) {
	this.reflectivity = reflectivity
	this.smoothness = smoothness
	this.absorbtion = absorbtion
	this.color = color.add(new Vector(0.01, 0.01, 0.01)) //Because no surface should 100% absorb all forms of light
}
