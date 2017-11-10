uniform vec3 lightDirectionUniform;
uniform vec3 lightColorUniform;
uniform vec3 ambientColorUniform;
uniform float shininessUniform;
uniform float kAmbientUniform;
uniform float kDiffuseUniform;
uniform float kSpecularUniform;

uniform vec3 translationUniform;
uniform vec3 rotationUniform;
uniform vec3 scalingUniform;


varying vec3 eyeCordNormal;
varying vec3 eyeCordLightDir;
varying vec3 eyeCordPosition;


mat4 getRotationMatrix(vec3 axis, float angle);
mat4 getTranslationMatrix(float x,float y,float z);
mat4 getMat4ScalingMatrix(float xx,float yy, float zz);



void main() {

    //get the translation matrixes
    mat4 scaling = getMat4ScalingMatrix(scalingUniform.x, scalingUniform.y, scalingUniform.z);
    mat4 rotation = getRotationMatrix(vec3(1.0,0.0,0.0),rotationUniform.x) *
    getRotationMatrix(vec3(0.0,1.0,0.0),rotationUniform.y) *
    getRotationMatrix(vec3(0.0,0.0,1.0),rotationUniform.z);
    mat4 translation = getTranslationMatrix(translationUniform.x, translationUniform.y, translationUniform.z);



    vec3 vNormal = normal;
    vec3 vPosition = position;

    vPosition = vec3(translation * rotation * scaling * vec4(vPosition,1.0));
    vNormal = vec3(rotation* vec4(vNormal,0.0)); //vector no need for scaling and rotation

	// TODO: PART 1D
   
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);


    eyeCordNormal = normalMatrix * vNormal;
    eyeCordLightDir = vec3(viewMatrix * vec4(lightDirectionUniform,0.0)); //light is innitially in the world coordinate.
    eyeCordPosition = vec3(modelViewMatrix * vec4(position,1.0));

}




mat4 getTranslationMatrix(float x,float y,float z){
    mat4 translationMatrix = mat4(1.0, 0.0, 0.0, 0.0,
                                  0.0, 1.0, 0.0, 0.0,
                                  0.0, 0.0, 1.0, 0.0,
                                  x,   y,   z,   1.0);

    return translationMatrix;
}

mat4 getMat4ScalingMatrix(float xx,float yy, float zz){
    return mat4(
        xx,0.0,0.0,0.0,
        0.0,yy,0.0,0.0,
        0.0,0.0,zz,0.0,
        0.0,0.0,0.0,1.0
    );
}

mat4 getRotationMatrix(vec3 axis, float angle){
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float v = 1.0 - c;

    return mat4(v * axis.x * axis.x + c,           v * axis.x * axis.y - axis.z * s,  v * axis.z * axis.x + axis.y * s,0.0,
                v * axis.x * axis.y + axis.z * s,  v * axis.y * axis.y + c,           v * axis.y * axis.z - axis.x * s,0.0,
                v * axis.z * axis.x - axis.y * s,  v * axis.y * axis.z + axis.x * s,  v * axis.z * axis.z + c,0.0,
                0.0,0.0,0.0,1.0);
}