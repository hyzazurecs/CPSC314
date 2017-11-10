uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
uniform sampler2D fogTexture;

varying vec2 vUv;
varying vec3 vPosition;

void main() {

    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
