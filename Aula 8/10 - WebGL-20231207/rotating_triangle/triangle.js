let gl;

//Variables for Transformation Matrices
let mv = new mat4();
let p = new mat4();
let mvLoc, projLoc;

let rotation = 0

window.onload = function init() {

	// Gets 3D Canvas context
	let canvas = document.querySelector('#gl-canvas');
	gl = WebGLUtils.setupWebGL(canvas);

	if (!gl) { alert("WebGL is not available"); }

	// sets WebGL viewport and background color
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.8, 0.8, 0.8, 1.0);

	// compiles both vertex and fragment shaders in GPU
	let program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	//triangle data: vertices and colors
	const vertices = new Float32Array(
		[-0.5, -0.5, 0,
			0, 0.5, 0,
			0.5, -0.5, 0]);

	// Creates buffer for geometric data
	let vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	// Links shader variable to geometric data buffer
	let vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	//Get address for the vertex shader uniform modelview variable
	mvLoc = gl.getUniformLocation(program, "modelview");     

	render();
};


function render() {
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

	mv = new mat4();
	mv = mult(mv, rotate(rotation++, [0, 1, 1])); // Y & Z axis rotation
	// update shader variable with the new rotation value
	gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv)); 

	// draws a filled triangle with interpolated colors
	gl.drawArrays(gl.TRIANGLES, 0, 3);

	//NEXT FRAME
	requestAnimationFrame(render);
}