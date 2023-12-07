import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1, 3, 14);
camera.lookAt(scene.position); //point the camera to the center of the scene

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#000000");
document.body.appendChild(renderer.domElement);

// USE ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

/*********************
* MESHES
* *******************/
// CUBE
let geometry = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);
let material = new THREE.MeshNormalMaterial({ wireframe: true });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(2, 2, 2)

// add the cube to the scene
scene.add(cube);

// SPHERE
geometry = new THREE.SphereGeometry(1, 8, 8);
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(3, 3, 0)
cube.add(sphere); // add the sphere to the cube (cube -> sphere)


// USEFULL trick to inspect THREE.JS objects
window.sphere = sphere

/*********************
* HELPER to visualize different CSs 
* *******************/
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const axesHelper2 = new THREE.AxesHelper(2);
cube.add(axesHelper2);

const axesHelper3 = new THREE.AxesHelper(2);
sphere.add(axesHelper3);

/**********************
Control panel
**********************/
let cubeControls = {
    Xrotation: false, Yrotation: true, Zrotation: false
}
let sphereControls = {
    Xrotation: false, Yrotation: true, Zrotation: false
}
const panel = new GUI();
let cubeFolder = panel.addFolder('Cube');
cubeFolder.add(cubeControls, 'Xrotation').listen();
cubeFolder.add(cubeControls, 'Yrotation').listen();
cubeFolder.add(cubeControls, 'Zrotation').listen();
let sphereFolder = panel.addFolder('Sphere');
sphereFolder.add(sphereControls, 'Xrotation').listen();
sphereFolder.add(sphereControls, 'Yrotation').listen();
sphereFolder.add(sphereControls, 'Zrotation').listen();


// start the animation
renderer.setAnimationLoop(render);


/*********************
* ANIMATION LOOP
* *******************/
function render() {
    // rotate the cube 
    if (cubeControls.Xrotation)
        cube.rotation.x += 0.01;
    if (cubeControls.Yrotation)
        cube.rotation.y += 0.01;
    if (cubeControls.Zrotation)
        cube.rotation.z += 0.01;

    // rotate the sphere
    if (sphereControls.Xrotation)
        sphere.rotation.x += 0.01;
    if (sphereControls.Yrotation)
        sphere.rotation.y += 0.01;
    if (sphereControls.Zrotation)
        sphere.rotation.z += 0.01;

    // controls.update();

    // render the scene ("draw" the scene into the Canvas, using the camera's point of view)
    renderer.render(scene, camera);
};