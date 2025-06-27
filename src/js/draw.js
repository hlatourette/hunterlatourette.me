function draw(gl, program, attribLocations, uniformLocations, buffers, squareRotation) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    const fieldOfView = (45 * Math.PI) / 180; // radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();
    // Move the drawing position to where we want to draw the square.
    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, squareRotation, [0, 0, 1]);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition atrribute.
    const positionBufferNumComponents = 2;
    const positionBufferType = gl.FLOAT;
    const positionBufferNormalize = false;
    const positionBufferStride = 0;
    const positionBufferOffset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        attribLocations.vertexPosition,
        positionBufferNumComponents,
        positionBufferType,
        positionBufferNormalize,
        positionBufferStride,
        positionBufferOffset
    );
    gl.enableVertexAttribArray(attribLocations.vertexPosition);

    // Tell WebGl how to pull out the colors from the color
    // buffer into the vertexColor attribute.
    const colorBufferNumComponents = 4;
    const colorBufferType = gl.FLOAT;
    const colorBufferNormalize = false;
    const colorBufferStride = 0;
    const colorBufferOffset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        attribLocations.vertexColor,
        colorBufferNumComponents,
        colorBufferType,
        colorBufferNormalize,
        colorBufferStride,
        colorBufferOffset
    );
    gl.enableVertexAttribArray(attribLocations.vertexColor);

    gl.useProgram(program);

    gl.uniformMatrix4fv(uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(uniformLocations.modelViewMatrix, false, modelViewMatrix);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export { draw };

