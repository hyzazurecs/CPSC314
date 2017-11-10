// Shared variable passed to the fragment shader
varying vec3 color;

// Constant set via your javascript code
uniform float noddingAngle;
uniform float rotationAngle;

uniform vec3 armadilloPosition;

mat4 getRotationMatrix(vec3 axis, float angle);
mat4 getTranslationMatrix(float x,float y,float z);

float thisAngle = 0.0;


void main() {
	// No lightbulb, but we still want to see the armadillo!
	vec3 l = vec3(0.0, 0.0, -1.0);
	color = vec3(1.0) * dot(l, normal);
    vec4 newPosition = vec4(position, 1.0);



    float cur = mod(noddingAngle,1.2);
    if (cur >= 0.0 && cur < 0.3){
        thisAngle = cur;
    } else if (cur >= 0.3 && cur <0.9){
        thisAngle = 0.6- cur;
    } else{
        thisAngle = cur - 1.2;
    }


    // whole left leg
	if (newPosition.y < 1.4 && newPosition.x < -0.2 ){
	    mat4 translation1 = getTranslationMatrix(0.2,-1.35,0.0);
	    mat4 rt = getRotationMatrix(vec3(1.0,0.0,0.0),-thisAngle);
	    mat4 translation2 = getTranslationMatrix(-0.2,1.35,0.0);
	    newPosition = translation2 * rt * translation1 * newPosition;
	}

	if (newPosition.y < 1.4 && newPosition.x > 0.2){
	     mat4 translation1 = getTranslationMatrix(0.2,-1.35,0.0);
         mat4 rt = getRotationMatrix(vec3(1.0,0.0,0.0),thisAngle);
     	 mat4 translation2 = getTranslationMatrix(-0.2,1.35,0.0);
         newPosition = translation2 * rt * translation1 * newPosition;
	}

	mat4 translation = getTranslationMatrix(armadilloPosition.x,0.0, armadilloPosition.z);


	mat4 rotation = getRotationMatrix(vec3(0.0,1.0,0.0),rotationAngle);


	newPosition = translation * rotation * newPosition;




	// Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
	gl_Position = projectionMatrix * modelViewMatrix * newPosition;
}



// translate the object to (x,y,z)
mat4 getTranslationMatrix(float x,float y,float z){
    mat4 translationMatrix = mat4(1.0, 0.0, 0.0, 0.0,
                                  0.0, 1.0, 0.0, 0.0,
                                  0.0, 0.0, 1.0, 0.0,
                                  x,   y,   z,   1.0);

    return translationMatrix;
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
