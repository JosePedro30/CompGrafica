import * as THREE from 'three';

/*********************
* SCENE 
* *******************/
// create an empty scene, that will hold all our elements such as objects, cameras and lights
const scene = new THREE.Scene();

/*********************
 * CAMERA 
 * *******************/
// create a camera, which defines where we're looking at
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // move the camera to the world position (0,0,5)

/*********************
 * RENDERER 
 * *******************/
// create a render and set the size
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// configure renderer clear color
renderer.setClearColor("#000000");
// add the output of the renderer to an HTML element (this case, the body)
document.body.appendChild(renderer.domElement);

/*********************
* MESH 
* *******************/
// create an object 3D - a cube
let geometry = new THREE.BoxGeometry(2, 2, 2);
let material = new THREE.MeshNormalMaterial({ wireframe: false });
// let material = new THREE.MeshBasicMaterial({ color: 0x0000FF, wireframe: false });
const cube = new THREE.Mesh(geometry, material);

// add the cube to the scene
scene.add(cube);

// TRIANGLE - build a custom geometry, composed of 3 vertices
geometry = new THREE.BufferGeometry();

const points = []// define array of vertices
points.push(new THREE.Vector3(-2, 2, 0))
points.push(new THREE.Vector3(-2, -2, 0))
points.push(new THREE.Vector3(2, -2, 0))

geometry.setFromPoints(points);
geometry.computeVertexNormals(); // computes vertex normals for the given vertex data

// material = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true });
material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide });
let triangle = new THREE.Mesh(geometry, material);

cube.add(triangle); // add the triangle to the scene

window.cube = cube // USEFULL trick to inspect THREE.JS objects

/*********************
* HELPER to visualize different CSs 
* *******************/
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const axesHelper2 = new THREE.AxesHelper(2);
cube.add(axesHelper2);

// start the animation
renderer.setAnimationLoop(render);


/*********************
* ANIMATION LOOP
* *******************/
function render() {
    // rotate the cube around its axes
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;

    // render the scene ("draw" the scene into the Canvas, using the camera's point of view)
    renderer.render(scene, camera);
};