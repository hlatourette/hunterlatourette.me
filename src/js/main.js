import { vertexShaderSource, fragmentShaderSource, loadShader } from "./shaders.js";
import { draw } from "./draw.js";

main();

function main() {
    // Initialize the GL context
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext("webgl2");
    if (gl == null) {
        alert("Unable to initalize WebGL");
        return;
    }

    // Set clear color and clear the color buffer
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Initialize shaders
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS) ||
        !gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert(`Failed to create shaders`);
        return;
    }

    // Initialize shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Failed to create shader program`);
        return;
    }

    // Initialize buffers
    const positionBuffer = gl.createBuffer();
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    const colors = [
        1.0, 1.0, 1.0, 1.0, 
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const buffers = {
        position: positionBuffer,
        color: colorBuffer
    };

    // Rendering loop
    let squareRotation = 0.0;
    let deltaTime = 0;
    let then = 0;
    function render(now) {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;
        draw(
            gl,
            shaderProgram,
            {
                vertextPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor")
            },
            {
                projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix")
            },
            buffers,
            squareRotation
        );

        squareRotation += deltaTime;
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

