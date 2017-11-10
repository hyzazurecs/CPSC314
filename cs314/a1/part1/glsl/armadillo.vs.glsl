// Create shared variable for the vertex and fragment shaders
//varying vec3 interpolatedNormal;
varying float cosine;
varying float distance;

uniform vec3 lightPosition;

/* HINT: YOU WILL NEED MORE SHARED/UNIFORM VARIABLES TO COLOR ACCORDING TO COS(ANGLE) */

void main() {
    // Set shared variable to vertex normal
    vec3 interpolatedNormal = normal;

    vec3 dirVec = lightPosition - position;
    cosine = dot(interpolatedNormal,normalize(dirVec));

    distance = length(dirVec);



    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}
