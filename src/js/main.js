import { vertexShaderSource, fragmentShaderSource, loadShader } from "./shaders.js";
import { loadTexture } from "./textures.js";
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

    // Initialize textures 
    const texture = loadTexture(gl, "assets/arkansas_map.png");
    // Flip image pixels into the bottom-to-top order that WebGL expects
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Initialize buffers
    const positionBuffer = gl.createBuffer();
    const positions = [
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,     // Front face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, // Back face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,     // Top face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // Bottom face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,     // Right face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0  // Left face
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const textureBuffer = gl.createBuffer();
    const textureCoordinates = [
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Front face
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Back face
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Top face
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Bottom face
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Right face
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0  // Left face
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    const indices = [
        0,  1,  2,  0,  2,  3,
        4,  5,  6,  4,  6,  7,
        8,  9,  10, 8,  10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ];
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    const buffers = {
        position: positionBuffer,
        texture: textureBuffer,
        indices: indexBuffer
    };

    // Rendering loop
    let cubeRotation = 0.0;
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
                textureCoordinate: gl.getAttribLocation(shaderProgram, "aTextureCoord")
            },
            {
                projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                uSampler: gl.getUniformLocation(shaderProgram, "uSampler")
            },
            buffers,
            texture,
            cubeRotation
        );

        cubeRotation += deltaTime;
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

