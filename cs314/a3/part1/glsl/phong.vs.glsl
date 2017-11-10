uniform vec3 lightDirectionUniform;
uniform vec3 lightColorUniform;
uniform vec3 ambientColorUniform;
uniform float shininessUniform;
uniform float kAmbientUniform;
uniform float kDiffuseUniform;
uniform float kSpecularUniform;


varying vec3 eyeCordNormal ;
varying vec3 eyeCordPosition ;
varying vec3 eyeCordLightDir ;


void main() {

    //do the lighting calcualtion in the eye coordinates
    eyeCordNormal = normalMatrix * normal;
    eyeCordLightDir = vec3(viewMatrix * vec4(lightDirectionUniform,0.0)); //light is innitially in the world coordinate.
    eyeCordPosition = vec3(modelViewMatrix * vec4(position,1.0));



    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}