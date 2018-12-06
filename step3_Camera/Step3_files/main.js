

//Get all of the objects that exist in the world
function getWorld() {

	// Push objects
	let objects = []
	objects.push(new Sphere(new Vector(-0.1, 0, 2.0), 0.5, new Vector(1, 0, 0))) //Large
	objects.push(new Sphere(new Vector(-0.5, 0.5, 2.0), 0.2, new Vector(1, 1, 1))) //Small
	objects.push(new Sphere(new Vector(-0.5, -0.5, 2.0), 0.35, new Vector(1, 1, 1))) //Medium


	// Push lights
	let lights = []
	lights.push(new PointLight(new Vector(0, 8, 2), new Vector(0, 1, 0), 20)) //Green
	lights.push(new PointLight(new Vector(-2, 0.9, 1), new Vector(1, 0, 0), 20)) //Red
	lights.push(new PointLight(new Vector(2, -5, -1), new Vector(0, 0, 1), 20)) //Blue

	let ambientColor = new Vector(1,1,1)
	let ambientStrength = 0.2
	let backgroundColor = new Vector(0.1,0)
	let aperature = 2.0 //How much light we collect from the world

	let camera = PerspectiveCamera(new Vector(0, 0, 1), new Vector(0, 0, 0), 60)

	return {
		objects: objects, 
		lights: lights,
		ambientColor: ambientColor,
		ambientStrength: ambientStrength,
		backgroundColor: backgroundColor,
		aperature: aperature,
		camera: camera,
	}
}

function clearCanvas(imageData, width, height) {
	for(let x = 0; x < width; x++) {
		for(let y = 0; y < height; y++) {
			var index = ((height - 1 - y) * width + x) * 4
			imageData.data[index]     = 255	// R
			imageData.data[index + 1] = 255	// G
			imageData.data[index + 2] = 255	// B
			imageData.data[index + 3] = 255 // A
		}
	}
}

function main() {
	var canvas = document.getElementById('theCanvas')
	var context = canvas.getContext('2d', {antialias: false, depth: false})
	var imageData = context.getImageData(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)

	//Get the world elements
	var world = getWorld()



	//Create animation thread
	//Inside loop
		//Render the canvas using worker thread
		//When key pressed to change camera
			//Wipe the canvas clean
			//stop worker if in the middle of rendering
			//Start at beginning of loop
	
			

	for(let x = 0; x < CANVAS_WIDTH; x++) {
		for(let y = 0; y < CANVAS_HEIGHT; y++) {

			//Create the ray
			let rx = (x / CANVAS_WIDTH) * 2 - 1
			let ry = (y / CANVAS_HEIGHT) * 2 - 1
			let rz = 0
			let ray = new Ray(new Vector(rx, ry, rz), new Vector(0, 0, 1))

			//Get the color from that ray
			let color = traceRay(ray, world)

			//Draw that pixel on the pixel data array
			var index = ((CANVAS_HEIGHT - 1 - y) * CANVAS_WIDTH + x) * 4
			imageData.data[index]     = color.x * 255	// R
			imageData.data[index + 1] = color.y * 255	// G
			imageData.data[index + 2] = color.z * 255	// B
			imageData.data[index + 3] = 255 			// A
		}
	}

	context.putImageData(imageData, 0, 0)
	console.log("Finished!")
}
