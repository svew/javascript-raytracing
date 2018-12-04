// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 600;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true}); //Replace with our own renderer for ray tracing

// Configure renderer clear color
renderer.setClearColor("#f0f0f0");

// Configure renderer size
renderer.setSize( 1280 , 720 );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// DEFINE MATERIALS

var phongMaterial = new THREE.MeshPhongMaterial( {
    color: "white",
    specular: 0x222222,
    shininess: 60,
    vertexColors: THREE.NoColors,
    flatShading: false
} );

//SETUP SPHERES

var geometry = new THREE.SphereGeometry(50, 64, 32 );
var sphere = new THREE.Mesh( geometry, phongMaterial);
sphere.position.set(-350, 0, -300);
sphere.scale.multiplyScalar( 3.0 );

scene.add( sphere );

geometry = new THREE.SphereGeometry(50, 64, 32 );
var sphere2 = new THREE.Mesh( geometry, phongMaterial);
sphere2.position.set(350, 0, -300);
sphere2.scale.multiplyScalar( 3.0 );

scene.add( sphere2 );

geometry = new THREE.SphereGeometry(50, 64, 32 );
var sphere3 = new THREE.Mesh( geometry, phongMaterial);
sphere3.position.set(0, 0, 0);
sphere3.scale.multiplyScalar( 3.0 );

scene.add( sphere3 );

// SETUP LIGHTS

var intensity = 1.0;
var light = new THREE.PointLight("white", intensity);
light.position.set( -500, 100, 100);
light.physicalAttenuation = true;
scene.add(light);

intensity = 0.7
light = new THREE.PointLight( "red", intensity);
light.position.set( 0, 0, 300);
light.physicalAttenuation = true;
scene.add(light);

intensity = 0.7
light = new THREE.PointLight( "blue", intensity);
light.position.set( 500, 100, 100);
light.physicalAttenuation = true;
scene.add(light);

//RENDER
var render = function () {
  requestAnimationFrame( render );
  renderer.render(scene, camera);
};

render();
