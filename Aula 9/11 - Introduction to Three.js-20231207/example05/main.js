import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 7.5, 30);
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
let material = new THREE.MeshNormalMaterial({ wireframe: false });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(2, 2, 2)
// add the cube to the scene
scene.add(cube);

// PIVOT
const spherePivot = new THREE.Object3D();
spherePivot.position.set(2, 2, 0)
cube.add(spherePivot)

// SPHERE
geometry = new THREE.SphereGeometry(1, 8, 8);
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(1.5, 1.5, 0)
spherePivot.add(sphere); // add the sphere to the cube (cube -> sphere)

// USEFULL trick to inspect THREE.JS objects
window.sphere = sphere
window.cube = cube
window.camera = camera

/*********************
* HELPER to visualize different CSs 
* *******************/
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const axesHelper2 = new THREE.AxesHelper(2);
cube.add(axesHelper2);

const axesHelper3 = new THREE.AxesHelper(2);
sphere.add(axesHelper3);

const axesHelper4 = new THREE.AxesHelper(2);
spherePivot.add(axesHelper4);

/**********************
Control panel
**********************/
let GUIcontrols = {
    cube: { Yrotation: 0 },
    pivot: { Yrotation: 0 },
    sphere: { Yrotation: 0 },
    reset: function () {
        this.cube.Yrotation = 0;
        cube.rotation.y = 0;
        this.pivot.Yrotation = 0;
        spherePivot.rotation.y = 0;
        this.sphere.Yrotation = 0;
        sphere.rotation.y = 0;
        material.wireframe = false;
    },
    toggleWireframe: function () {
        material.wireframe = !material.wireframe;
    },
    toggleAxisHelper: function () {
        axesHelper.visible = !axesHelper.visible;
        axesHelper2.visible = !axesHelper2.visible;
        axesHelper3.visible = !axesHelper3.visible;
        axesHelper4.visible = !axesHelper4.visible;
    }
}

const panel = new GUI();
let cubeFolder = panel.addFolder('Cube');
cubeFolder.add(GUIcontrols.cube, 'Yrotation', 0, 0.1, 0.01).listen();
let pivotFolder = panel.addFolder('Pivot');
pivotFolder.add(GUIcontrols.pivot, 'Yrotation', 0, 0.1, 0.01).listen();
let sphereFolder = panel.addFolder('Sphere');
sphereFolder.add(GUIcontrols.sphere, 'Yrotation', 0, 0.1, 0.01).listen();
panel.add(GUIcontrols, 'reset');
panel.add(GUIcontrols, 'toggleWireframe');
panel.add(GUIcontrols, 'toggleAxisHelper');



// start the animation
renderer.setAnimationLoop(render);


/*********************
* ANIMATION LOOP
* *******************/
function render() {
    // rotate the cube 
    cube.rotation.y += GUIcontrols.cube.Yrotation

    // rotate the pivot
    spherePivot.rotation.y += GUIcontrols.pivot.Yrotation

    // rotate the sphere
    sphere.rotation.y += GUIcontrols.sphere.Yrotation

    // controls.update();

    // render the scene ("draw" the scene into the Canvas, using the camera's point of view)
    renderer.render(scene, camera);
};