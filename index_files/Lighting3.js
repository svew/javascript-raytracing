//
// Lighting, continued. Same as Lighting2.js except we define
// a 3x3 matrix for material properties and a 3x3 matrix for light
// properties that are passed to the fragment shader as uniforms.
//
// Edit the light/material matrices in the global variables to experiment.
// Edit main to choose a model and select face normals or vertex normals.
//


// given an instance of THREE.Geometry, returns an object
// containing raw data for vertices and normal vectors.
function getModelData(geom)
{
	var verticesArray = [];
	var normalsArray = [];
	var vertexNormalsArray = [];
	var reflectedNormalsArray = [];
	var count = 0;
	for (var f = 0; f < geom.faces.length; ++f)
	{
		var face = geom.faces[f];
		var v = geom.vertices[face.a];
		verticesArray.push(v.x);
		verticesArray.push(v.y);
		verticesArray.push(v.z);

		v = geom.vertices[face.b];
		verticesArray.push(v.x);
		verticesArray.push(v.y);
		verticesArray.push(v.z);

		v = geom.vertices[face.c];
		verticesArray.push(v.x);
		verticesArray.push(v.y);
		verticesArray.push(v.z);
		count += 3;

		var fn = face.normal;
		for (var i = 0; i < 3; ++i)
		{
			normalsArray.push(fn.x);
			normalsArray.push(fn.y);
			normalsArray.push(fn.z);
		}

		for (var i = 0; i < 3; ++i)
		{
			var vn = face.vertexNormals[i];
			vertexNormalsArray.push(vn.x);
			vertexNormalsArray.push(vn.y);
			vertexNormalsArray.push(vn.z);
		}

		for (var i = 0; i < 3; ++i)
		{
			var index = (count * 3 - 9) + 3 * i;
			vx = vertexNormalsArray[index];
			vy = vertexNormalsArray[index + 1];
			vz = vertexNormalsArray[index + 2];
			nx = normalsArray[index];
			ny = normalsArray[index + 1];
			nz = normalsArray[index + 2];
//	     nx = vertexNormalsArray[index];
//	      ny = vertexNormalsArray[index + 1];
//	      nz = vertexNormalsArray[index + 2];
//	      vx = normalsArray[index];
//	      vy = normalsArray[index + 1];
//	      vz = normalsArray[index + 2];

			var dot = vx * nx + vy * ny + vz * nz;
			rx = 2 * dot * nx - vx;
			ry = 2 * dot * ny - vy;
			rz = 2 * dot * nz - vz;
			reflectedNormalsArray.push(rx);
			reflectedNormalsArray.push(ry);
			reflectedNormalsArray.push(rz);
		}
	}

	console.log(count);
	return {
		numVertices: count,
		vertices: new Float32Array(verticesArray),
		normals: new Float32Array(normalsArray),
		vertexNormals: new Float32Array(vertexNormalsArray),
	    reflectedNormals: new Float32Array(reflectedNormalsArray)
	};
}


//Returns elements of the transpose of the inverse of the modelview matrix.
function makeNormalMatrixElements(model, view)
{
	var n = new Matrix4(view).multiply(model);
	n.invert();
	n.transpose();

	// take just the upper-left 3x3 submatrix
	n = n.elements;
	return new Float32Array([
	n[0], n[1], n[2],
	n[4], n[5], n[6],
	n[8], n[9], n[10] ]);
}


var axisVertices = new Float32Array([
0.0, 0.0, 0.0,
1.5, 0.0, 0.0,
0.0, 0.0, 0.0,
0.0, 1.5, 0.0,
0.0, 0.0, 0.0,
0.0, 0.0, 1.5]);

var axisColors = new Float32Array([
1.0, 0.0, 0.0, 1.0,
1.0, 0.0, 0.0, 1.0,
0.0, 1.0, 0.0, 1.0,
0.0, 1.0, 0.0, 1.0,
0.0, 0.0, 1.0, 1.0,
0.0, 0.0, 1.0, 1.0]);

// A few global variables...

// light and material properties, remember this is column major

// generic white light
// var lightPropElements = new Float32Array([
// 0.2, 0.2, 0.2,
// 0.7, 0.7, 0.7,
// 0.7, 0.7, 0.7
// ]);

// blue light with red specular highlights (because we can)
var lightPropElements = new Float32Array([
0.2, 0.2, 0.2,
0.0, 0.0, 0.7,
0.7, 0.0, 0.0
]);

// shiny green plastic
//var matPropElements = new Float32Array([
//0.3, 0.3, 0.3,
//0.0, 0.8, 0.0,
//0.8, 0.8, 0.8
//]);
//var shininess = 30;

// shiny brass
// var matPropElements = new Float32Array([
// 0.33, 0.22, 0.03,
// 0.78, 0.57, 0.11,
// 0.99, 0.91, 0.81
// ]);
// var shininess = 28.0;

// very fake looking white, useful for testing lights
var matPropElements = new Float32Array([
1, 1, 1,
1, 1, 1,
1, 1, 1
]);
var shininess = 20.0;

// clay or terracotta
// var matPropElements = new Float32Array([
// 0.75, 0.38, 0.26,
// 0.75, 0.38, 0.26,
// 0.25, 0.20, 0.15 // weak specular highlight similar to diffuse color
// ]);
// var shininess = 10.0;


// transformation matrices
var model = new Matrix4();

var axis = 'x';
var paused = false;

//view matrix
// One strategy is to identify a transformation to our camera frame,
// then invert it.  Here we use the inverse of
// rotate(30, 0, 1, 0) * rotateX(-45) * Translate(0, 0, 5)
var view = new Matrix4().translate(0, 0, -5).rotate(45, 1, 0, 0).rotate(-30, 0, 1, 0);

// Alternatively use the LookAt function, specifying the view (eye) point,
// a point at which to look, and a direction for "up".
// Approximate view point for above is (1.77, 3.54, 3.06)
//var view = new Matrix4().setLookAt(
//		1.77, 3.54, 3.06,   // eye
//		0, 0, 0,            // at - looking at the origin
//		0, 1, 0);           // up vector - y axis


// For projection we can use an orthographic projection, specifying
// the clipping volume explicitly
//var projection = new Matrix4().setOrtho(-1.5, 1.5, -1, 1, 4, 6)

// Or, use a perspective projection specified with a
// field of view, an aspect ratio, and distance to near and far
// clipping planes
// Here use aspect ratio 3/2 corresponding to canvas size 600 x 400
var projection = new Matrix4().setPerspective(30, 1.5, 0.1, 1000);

// Or, here is the same perspective projection, using the Frustum function
// a 30 degree field of view with near plane at 4 corresponds
// view plane height of  4 * tan(15) = 1.07
//var projection = new Matrix4().setFrustum(-1.5 * 1.07, 1.5 * 1.07, -1.07, 1.07, 4, 6);


//translate keypress events to strings
//from http://javascript.info/tutorial/keyboard-events
function getChar(event) {
	if (event.which == null) {
		return String.fromCharCode(event.keyCode) // IE
	} else if (event.which!=0 && event.charCode!=0) {
		return String.fromCharCode(event.which)   // the rest
	} else {
		return null // special key (arrow keys, backspace, etc.)
	}
}

//handler for key press events will choose which axis to
// rotate around
function handleKeyPress(event)
{
	var ch = getChar(event);
	switch(ch)
	{

	case ' ':
		paused = !paused;
		break;
	case 'x':
		axis = 'x';
		break;
	case 'y':
		axis = 'y';
		break;
	case 'z':
		axis = 'z';
		break;
	case 'o':
		model.setIdentity();
		axis = 'x';
		break;
		default:
			return;
	}
}

// code to actually render our geometry
function draw()
{
	// clear the framebuffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BIT);

	// bind the shader
	gl.useProgram(lightingShader);

	// get the index for the a_Position attribute defined in the vertex shader
	var positionIndex = gl.getAttribLocation(lightingShader, 'a_Position');
	if (positionIndex < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}

	var normalIndex = gl.getAttribLocation(lightingShader, 'a_Normal');
	if (normalIndex < 0) {
		console.log('Failed to get the storage location of a_Normal');
		return;
	}

	// "enable" the a_position attribute
	gl.enableVertexAttribArray(positionIndex);
	gl.enableVertexAttribArray(normalIndex);

	// bind buffers for points
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(positionIndex, 3, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
	gl.vertexAttribPointer(normalIndex, 3, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	// set uniform in shader for projection * view * model transformation
	var loc = gl.getUniformLocation(lightingShader, "model");
	gl.uniformMatrix4fv(loc, false, model.elements);
	loc = gl.getUniformLocation(lightingShader, "view");
	gl.uniformMatrix4fv(loc, false, view.elements);
	loc = gl.getUniformLocation(lightingShader, "projection");
	gl.uniformMatrix4fv(loc, false, projection.elements);
	loc = gl.getUniformLocation(lightingShader, "normalMatrix");
	gl.uniformMatrix3fv(loc, false, makeNormalMatrixElements(model, view));

	loc = gl.getUniformLocation(lightingShader, "lightPosition");
	gl.uniform4f(loc, 2.0, 4.0, 2.0, 1.0);

	// light and material properties
	loc = gl.getUniformLocation(lightingShader, "lightProperties");
	gl.uniformMatrix3fv(loc, false, lightPropElements);
	loc = gl.getUniformLocation(lightingShader, "materialProperties");
	gl.uniformMatrix3fv(loc, false, matPropElements);
	loc = gl.getUniformLocation(lightingShader, "shininess");
	gl.uniform1f(loc, shininess);



	gl.drawArrays(gl.TRIANGLES, 0, theModel.numVertices);

	gl.disableVertexAttribArray(positionIndex);
	gl.disableVertexAttribArray(normalIndex);


	// bind the shader
	gl.useProgram(colorShader);

	// get the index for the a_Position attribute defined in the vertex shader
	positionIndex = gl.getAttribLocation(colorShader, 'a_Position');
	if (positionIndex < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}

	var colorIndex = gl.getAttribLocation(colorShader, 'a_Color');
	if (colorIndex < 0) {
		console.log('Failed to get the storage location of a_Normal');
		return;
	}

	// "enable" the a_position attribute
	gl.enableVertexAttribArray(positionIndex);
	gl.enableVertexAttribArray(colorIndex);


	// draw axes (not transformed by model transformation)
	gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
	gl.vertexAttribPointer(positionIndex, 3, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, axisColorBuffer);
	gl.vertexAttribPointer(colorIndex, 4, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	// set transformation to projection * view only
	loc = gl.getUniformLocation(colorShader, "transform");
	transform = new Matrix4().multiply(projection).multiply(view);
	gl.uniformMatrix4fv(loc, false, transform.elements);

	// draw axes
	gl.drawArrays(gl.LINES, 0, 6);

	// unbind shader and "disable" the attribute indices
	// (not really necessary when there is only one shader)
	gl.disableVertexAttribArray(positionIndex);
	gl.disableVertexAttribArray(colorIndex);
	gl.useProgram(null);

}

//The document's canvas
var canvas

//This program's OpenGL context
var gl

var moveHandler = new MoveHandler()
function init_canvas() {

	canvas = document.getElementById('theCanvas')
	window.onkeypress = handleKeyPress
	window.onkeydown = function(event) {moveHandler.handleKeyDown(event)}
	window.onkeyup = function(event) {moveHandler.handleKeyUp(event)}
	gl = getWebGLContext(canvas, false)
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL')
		return
	}

}

// handle to the compiled shader program on the GPU
var lightingShader;
var colorShader;

function init_shaders() {

	// load and compile the shader pair, using utility from the teal book
	var vshaderSource = document.getElementById('vertexColorShader').textContent;
	var fshaderSource = document.getElementById('fragmentColorShader').textContent;
	if (!initShaders(gl, vshaderSource, fshaderSource)) {
		console.log('Failed to intialize shaders.');
		return;
	}
	colorShader = gl.program;
	gl.useProgram(null);

	// load and compile the shader pair, using utility from the teal book
	var vshaderSource = document.getElementById('vertexLightingShader').textContent;
	var fshaderSource = document.getElementById('fragmentLightingShader').textContent;
	if (!initShaders(gl, vshaderSource, fshaderSource)) {
		console.log('Failed to intialize shaders.');
		return;
	}
	lightingShader = gl.program;
	gl.useProgram(null);

}

//the model data
var theModel

// handle to a buffer on the GPU
var vertexBuffer;
var vertexNormalBuffer;
var axisBuffer;
var axisColorBuffer;

function init_buffers() {

	// basic sphere
	//theModel = getModelData(new THREE.SphereGeometry(1))

	// sphere with more faces
	//theModel = getModelData(new THREE.SphereGeometry(1, 48, 24));

	// torus knot
	theModel = getModelData(new THREE.TorusKnotGeometry(1, .4, 128, 16));

	// buffer for vertex positions for triangles
	vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return;
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, theModel.vertices, gl.STATIC_DRAW);

	// buffer for vertex normals
	vertexNormalBuffer = gl.createBuffer();
	if (!vertexNormalBuffer) {
		console.log('Failed to create the buffer object');
		return;
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);

	// choose face normals, vertex normals, or wacky normals
	//gl.bufferData(gl.ARRAY_BUFFER, theModel.normals, gl.STATIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER, theModel.vertexNormals, gl.STATIC_DRAW);
	//gl.bufferData(gl.ARRAY_BUFFER, theModel.reflectedNormals, gl.STATIC_DRAW);

	// axes
	axisBuffer = gl.createBuffer();
	if (!axisBuffer) {
		console.log('Failed to create the buffer object');
		return;
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, axisVertices, gl.STATIC_DRAW);

	// buffer for axis colors
	axisColorBuffer = gl.createBuffer();
	if (!axisColorBuffer) {
		console.log('Failed to create the buffer object');
		return;
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, axisColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, axisColors, gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	// specify a fill color for clearing the framebuffer
	gl.clearColor(0.0, 0.2, 0.2, 1.0);

	gl.enable(gl.DEPTH_TEST);

}

// entry point when page is loaded
function main() {

	init_canvas()
	init_shaders()
	init_buffers()

	console.log("Loaded stuff")

	// define an animation loop
	var moveForwardSpeed = 0.1
	var moveRightSpeed = 0.1
	var lookUpSpeed = 0.3
	var lookRightSpeed = 0.3
	var animate = function() {
		draw();

		// increase the rotation by some amount, depending on the axis chosen
		var increment = 0;
		if (!paused)
		{
			switch(axis)
			{
			case 'x':
				model = new Matrix4().setRotate(increment, 1, 0, 0).multiply(model);
				axis = 'x';
				break;
			case 'y':
				axis = 'y';
				model = new Matrix4().setRotate(increment, 0, 1, 0).multiply(model);
				break;
			case 'z':
				axis = 'z';
				model = new Matrix4().setRotate(increment, 0, 0, 1).multiply(model);
				break;
			default:
			}
		}

		//Move the camera
		view = moveHandler.moveMatrix(view)	

		// request that the browser calls animate() again "as soon as it can"
		requestAnimationFrame(animate, canvas);
	};

  // start drawing!
  animate();


}
