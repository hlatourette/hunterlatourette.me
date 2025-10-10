function draw(gl, program, attribLocations, uniformLocations, buffers, texture, cubeRotation) {
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
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1]); // Axis to rotate around (Z)
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0]); // Axis to rotate around (Y)
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.3, [1, 0, 0]); // Axis to rotate around (X)

    // Transform normals
    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition atrribute.
    setPositionAttribute(gl, buffers.position, attribLocations);

    // Tell WebGL how to pull out the texture coordinates from the
    // buffer into the textureCoord attribute.
    setTextureAttribute(gl, buffers.texture, attribLocations);

    setNormalAttribute(gl, buffers.normal, attribLocations);

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    gl.useProgram(program);

    gl.uniformMatrix4fv(uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(uniformLocations.modelViewMatrix, false, modelViewMatrix);
    gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);

    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uniformLocations.uSampler, 0);

    const drawVertexCount = 36;
    const drawType = gl.UNSIGNED_SHORT;
    const drawOffset = 0;
    gl.drawElements(gl.TRIANGLES, drawVertexCount, drawType, drawOffset);
}

function setPositionAttribute(gl, positionBuffer, attribLocations) {
    const num = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(
        attribLocations.vertextPosition,
        num,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(attribLocations.vertexPosition);
}

function setTextureAttribute(gl, textureBuffer, attribLocations) {
    const num = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(
        attribLocations.textureCoordinate,
        num,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(attribLocations.textureCoordinate);
}

function setNormalAttribute(gl, normalBuffer, attribLocations) {
    const num = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(
        attribLocations.vertexNormal,
        num,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(attribLocations.vertexNormal);
}

export { draw };

