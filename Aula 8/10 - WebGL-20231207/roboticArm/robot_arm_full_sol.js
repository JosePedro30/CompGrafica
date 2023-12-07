//----------------------------------------------------------------------------
// Variable Setup 
//----------------------------------------------------------------------------

// This variable will store the WebGL rendering context
let gl;

//Define points for
const cubeVerts = [
    [0.5, 0.5, 0.5, 1],     //0
    [0.5, 0.5, -0.5, 1],    //1
    [0.5, -0.5, 0.5, 1],    //2
    [0.5, -0.5, -0.5, 1],   //3
    [-0.5, 0.5, 0.5, 1],    //4
    [-0.5, 0.5, -0.5, 1],   //5
    [-0.5, -0.5, 0.5, 1],   //6
    [-0.5, -0.5, -0.5, 1],  //7
];

//Look up patterns from cubeVerts for different primitive types
const cubeLookups = [
    //Solid Cube - use TRIANGLES, starts at 0, 36 vertices
    0, 4, 6, //front
    0, 6, 2,
    1, 0, 2, //right
    1, 2, 3,
    5, 1, 3, //back
    5, 3, 7,
    4, 5, 7, //left
    4, 7, 6,
    4, 0, 1, //top
    4, 1, 5,
    6, 7, 3, //bottom
    6, 3, 2,
]; //(6 faces)(2 triangles/face)(3 vertices/triangle)

//load points into points array - runs once as page loads.
const points = [];
for (let i = 0; i < cubeLookups.length; i++) {
    points.push(cubeVerts[cubeLookups[i]]);
}
//console.log(points)

const red = [1.0, 0.0, 0.0, 1.0];
const green = [0.0, 1.0, 0.0, 1.0];
const blue = [0.0, 0.0, 1.0, 1.0];
const lightred = [1.0, 0.5, 0.5, 1.0];
const lightgreen = [0.5, 1.0, 0.5, 1.0];
const lightblue = [0.5, 0.5, 1.0, 1.0];
const white = [1.0, 1.0, 1.0, 1.0];

//Set up colors array
const colors = [
    //Colors for Solid Cube
    lightblue, lightblue, lightblue, lightblue, lightblue, lightblue,
    lightgreen, lightgreen, lightgreen, lightgreen, lightgreen, lightgreen,
    lightred, lightred, lightred, lightred, lightred, lightred,
    blue, blue, blue, blue, blue, blue,
    red, red, red, red, red, red,
    green, green, green, green, green, green,
];

//Variables for Transformation Matrices
let mv = new mat4();
let p = new mat4();
let mvLoc, projLoc;

//Model state variables
let robot = {
    shoulderUp: false, shoulderDown: false, shoulderAng: 0,
    elbowUp: false, elbowDown: false, elbowAng: 0,
    openFingers: false, closeFingers: false, fingersAng: 0,
    rotX: 0, solid: true
};

//----------------------------------------------------------------------------
// Initialization Event Function
//----------------------------------------------------------------------------
window.onload = function init() {
    // Set up a WebGL Rendering Context in an HTML5 Canvas
    let canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    //  eg. - set a clear color
    //      - turn on depth testing
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //  Load shaders and initialize attribute buffers
    let program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Set up data to draw
    // Load the data into GPU data buffers and
    // Associate shader attributes with corresponding data buffers
    //***Vertices***
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    program.vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(program.vPosition, 4, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(program.vPosition);

    //***Colors***
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    program.vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(program.vColor, 4, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(program.vColor);

    // Get addresses of shader uniforms
    projLoc = gl.getUniformLocation(program, "p");    //projection
    mvLoc = gl.getUniformLocation(program, "mv");     //modelview

    let ratio = gl.viewportWidth / gl.viewportHeight;
    p = perspective(45, ratio, 0.1, 100);
    //p = ortho(-3, 3, -3, 3, zNear, zFar);
    gl.uniformMatrix4fv(projLoc, gl.FALSE, flatten(p));
    //Set initial view
    let eye = vec3(0.0, 5.0, 10.0); //position of the camera specified in world coordinates
    let at = vec3(0.0, 0.0, 0.0);   //indicates the target of the camera (where we want to look)
    let up = vec3(0.0, 1.0, 0.0);   //defines which direction is up
    mv = lookAt(eye, at, up);

    //Animate - draw continuously
    render();
}

//----------------------------------------------------------------------------
// Animation and Rendering Event Functions
//----------------------------------------------------------------------------

//updates and displays the model based on elapsed frames
//sets up another animation event as soon as possible
function render() {
    requestAnimFrame(render);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    let type = gl.LINE_STRIP;
    let start = 0;
    let num = 36;
    if (robot.solid == true) {
        type = gl.TRIANGLES;
    }
    let matStack = [];
    matStack.push(mv);

    //Shoulder
    if (robot.shoulderUp) {
        if (robot.shoulderAng < 45)
            robot.shoulderAng++;
    }
    if (robot.shoulderDown) {
        if (robot.shoulderAng > -45)
            robot.shoulderAng--;
    }

    mv = mult(mv, rotate(robot.rotX, [1, 0, 0]));
    mv = mult(mv, translate(-2.0, 0.0, 0.0));
    mv = mult(mv, rotate(robot.shoulderAng, [0, 0, 1]));
    mv = mult(mv, translate(1.0, 0.0, 0.0));
    matStack.push(mv);

    mv = mult(mv, scalem(2.0, 0.5, 1.0));
    gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
    gl.drawArrays(type, start, num);

    //Elbow
    if (robot.elbowUp) {
        if (robot.elbowAng < 90)
            robot.elbowAng++;
    }
    if (robot.elbowDown) {
        if (robot.elbowAng > 0)
            robot.elbowAng--;
    }
    mv = matStack.pop();
    mv = mult(mv, translate(1.0, 0.0, 0.0));
    mv = mult(mv, rotate(robot.elbowAng, [0, 0, 1]));
    mv = mult(mv, translate(1, 0.0, 0.0));
    matStack.push(mv);
    mv = mult(mv, scalem(2.0, 0.5, 1.0));
    gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
    gl.drawArrays(type, start, num);

    //1st Finger
    if (robot.openFingers) {
        if (robot.fingersAng < 45)
            robot.fingersAng++;
    }
    if (robot.closeFingers) {
        if (robot.fingersAng > -30)
            robot.fingersAng--;
    }
    mv = matStack.pop();    //Undo Scale
    matStack.push(mv);      //Save elbow settings (rotation + position)
    mv = mult(mv, translate(1.0, 0.2, 0.4));    //finger joint (from elbow)
    mv = mult(mv, rotate(robot.fingersAng + 45, [0, 0, 1]));       //rotation (-90, -15); start = -45
    mv = mult(mv, translate(0.25, 0.0, 0.0));   //center of rotation - Position on (0.25,0,0) - wrist
    matStack.push(mv);
    mv = mult(mv, scalem(0.5, 0.2, 0.2));
    gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
    gl.drawArrays(type, start, num);

    mv = matStack.pop(); //undo scale
    mv = mult(mv, translate(0.25, 0.0, 0.0));
    mv = mult(mv, rotate(-45, [0, 0, 1]));
    mv = mult(mv, translate(0.25, 0.0, 0.0));
    matStack.push(mv);
    mv = mult(mv, scalem(0.5, 0.2, 0.2));
    gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
    gl.drawArrays(type, start, num);

    //2nd Finger
    mv = matStack.pop();    //undo scale
    mv = matStack.pop();    //retrieve elbow settings (rotation + position)
    matStack.push(mv);
    mv = mult(mv, translate(1.0, 0.2, 0.0));
    mv = mult(mv, rotate(robot.fingersAng + 45, [0, 0, 1]));
    mv = mult(mv, translate(0.25, 0.0, 0.0));
    matStack.push(mv);
    mv = mult(mv, scalem(0.5, 0.2, 0.2));
    gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
    gl.drawArrays(type, start, num);

    mv = matStack.pop();
    mv = mult(mv, translate(0.25, 0.0, 0.0));
    mv = mult(mv, rotate(-45, [0, 0, 1]));
    mv = mult(mv, translate(0.25, 0.0, 0.0));
    matStack.push(mv);
    mv = mult(mv, scalem(0.5, 0.2, 0.2));
    gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
    gl.drawArrays(type, start, num);


    //3rd Finger
    mv = matStack.pop();
    mv = matStack.pop();
    matStack.push(mv);
    mv = mult(mv, translate(1.0, 0.2, -0.4));
    mv = mult(mv, rotate(robot.fingersAng + 45, [0, 0, 1]));
    mv = mult(mv, translate(0.25, 0.0, 0.0));
    matStack.push(mv);
    mv = mult(mv, scalem(0.5, 0.2, 0.2));
    gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
    gl.drawArrays(type, start, num);

    mv = matStack.pop();
    mv = mult(mv, translate(0.25, 0.0, 0.0));
    mv = mult(mv, rotate(-45, [0, 0, 1]));
    mv = mult(mv, translate(0.25, 0.0, 0.0));
    matStack.push(mv);
    mv = mult(mv, scalem(0.5, 0.2, 0.2));
    gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
    gl.drawArrays(type, start, num);

    //THUMB
    mv = matStack.pop();
    mv = matStack.pop();
    matStack.push(mv);
    mv = mult(mv, translate(1.0, -0.2, 0.4));
    mv = mult(mv, rotate(-45 - robot.fingersAng, [0, 0, 1]));
    mv = mult(mv, translate(0.25, 0.0, 0.0));
    matStack.push(mv);
    mv = mult(mv, scalem(0.5, 0.2, 0.2));
    gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
    gl.drawArrays(type, start, num);

    mv = matStack.pop();
    mv = mult(mv, translate(0.25, 0.0, 0.0));
    mv = mult(mv, rotate(45, [0, 0, 1]));
    mv = mult(mv, translate(0.25, 0.0, 0.0));
    matStack.push(mv);
    mv = mult(mv, scalem(0.5, 0.2, 0.2));
    gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
    gl.drawArrays(type, start, num);

    mv = matStack.pop();
    mv = matStack.pop();
    mv = matStack.pop();
}

//----------------------------------------------------------------------------
// Keyboard Event Functions
//----------------------------------------------------------------------------
document.addEventListener("keydown", (event) => {
    //Get key character
    let key = event.key;
    console.log(key)

    //Shoulder Updates
    if (key == "s")
        robot.shoulderUp = true;
    else if (key == "S")
        robot.shoulderDown = true;

    //Elbow Updates
    if (key == "e")
        robot.elbowUp = true;
    else if (key == "E")
        robot.elbowDown = true;

    //Fingers Updates
    if (key == "f")
        robot.openFingers = true;
    else if (key == "F")
        robot.closeFingers = true;

    // X rotation 
    if (key == "r") {
        robot.rotX++;
    }
    else if (key == "R") {
        robot.rotX--;
    }

    if (key == "t")
        robot.solid = !robot.solid;
});


document.addEventListener("keyup", (event) => {
    //Get key character
    let key = event.key;

    //stop all updates
    robot.shoulderUp = robot.shoulderDown = false;
    robot.elbowUp = robot.elbowDown = false;
    robot.openFingers = robot.closeFingers = false;
});