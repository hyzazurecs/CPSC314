// Create shared variable for the vertex and fragment shaders
//varying vec3 interpolatedNormal;
varying float cosine;
varying float distance;

uniform vec3 lightPosition;
uniform float angle;
/* HINT: YOU WILL NEED MORE SHARED/UNIFORM VARIABLES TO COLOR ACCORDING TO COS(ANGLE) */

void main() {
    // Set shared variable to vertex normal



    mat3 rotationMatrix = mat3(cos(angle),0,sin(angle),
                            0,1.0,0,
                            -sin(angle),0,cos(angle));

    vec3 thisPosition = position * rotationMatrix;
    vec3 interpolatedNormal = normal;

    vec3 dirVec = lightPosition - thisPosition;
    cosine = dot(interpolatedNormal,normalize(dirVec));

    distance = length(dirVec);


    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(thisPosition, 1.0);

}
