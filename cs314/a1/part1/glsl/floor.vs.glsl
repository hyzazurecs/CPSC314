uniform vec3 lightPosition;
uniform float time;

varying vec3 thisPosition;


void main() {
    float angle = 3.14/2.0;

    mat3 rotationMatrix = mat3(1.0,0,0,
                            0,cos(angle),-sin(angle),
                            0,sin(angle),cos(angle));

    thisPosition = position * rotationMatrix;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(thisPosition, 1.0);
}
