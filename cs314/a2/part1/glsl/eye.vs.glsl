// Shared variable passed to the fragment shader
varying vec3 color;
uniform vec3 lightPosition;
uniform vec3 eyePosition;

#define MAX_EYE_DEPTH 0.15
#define PI 3.1415926535897932384626433832795
//
//mat3 getScalingMatrix(float scale);
//mat3 getRotationMatrix(vec3 axis, float angle);
//mat4 getTranslationMatrix(float x, float y, float z);
//mat3 getLookAtMatrix(vec3 eyePosition, vec3 objectPosition, vec3 upMatrix);

mat4 getMat4LookAtMatrix(vec3 eye, vec3 at, vec3 up);
mat4 getRotationMatrix(vec3 axis, float angle);
mat4 getTranslationMatrix(float x,float y,float z);
mat4 getMat4ScalingMatrix(float xx,float yy, float zz);



void main() {
  // simple way to color the pupil where there is a concavity in the sphere
  // position is in local space, assuming radius 1
    float d = min(1.0 - length(position), MAX_EYE_DEPTH);
    color = mix(vec3(1.0), vec3(0.0), d * 1.0 / MAX_EYE_DEPTH);

    vec4 newPosition = vec4(position,1.0);

    mat4 sc = getMat4ScalingMatrix(0.05,0.05,0.05);

    mat4 rt = getRotationMatrix(vec3(0,0,1.0),PI) * getRotationMatrix(vec3(0,1.0,0),PI/2.0) ;

    mat4 lk = getMat4LookAtMatrix(eyePosition, vec3(lightPosition.x,2.43, lightPosition.z), vec3(0,1.0,0));
    mat4 tr = getTranslationMatrix(eyePosition.x,eyePosition.y,eyePosition.z);


    newPosition = tr * rt * lk  * sc *newPosition;


  // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    gl_Position = projectionMatrix * modelViewMatrix *  newPosition ;

}



// translate the object to (x,y,z)
mat4 getTranslationMatrix(float x,float y,float z){
    mat4 translationMatrix = mat4(1.0, 0.0, 0.0, 0.0,
                                  0.0, 1.0, 0.0, 0.0,
                                  0.0, 0.0, 1.0, 0.0,
                                  x,   y,   z,   1.0);

    return translationMatrix;
}



mat4 getMat4LookAtMatrix(vec3 eye,vec3 at, vec3 up){

    vec3 zz = normalize(at - eye);
    vec3 yy = normalize(cross(zz,up));
    vec3 xx = cross(zz,yy);


    return mat4(vec4(xx,0.0),
                vec4(yy,0.0),
                vec4(zz,0.0),
                vec4(0.0,0.0,0.0,1.0));
}



mat4 getMat4ScalingMatrix(float xx,float yy, float zz){
    return mat4(
        xx,0.0,0.0,0.0,
        0.0,yy,0.0,0.0,
        0.0,0.0,zz,0.0,
        0.0,0.0,0.0,1.0
    );
}


//get the rotation matrix
//@param axis : rotate the object around which axis
//@param angle: rotation angle
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
