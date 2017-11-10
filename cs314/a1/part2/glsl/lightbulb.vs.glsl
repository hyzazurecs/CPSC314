// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 lightPosition;

void main() {
	/* HINT: WORK WITH lightPosition HERE! */
    vec3 newPosition = position + lightPosition;

    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);



}
