// Create shared variable. The value is given as the interpolation between normals computed in the vertex shader
varying float cosine;
varying float distance;

/* HINT: YOU WILL NEED MORE SHARED/UNIFORM VARIABLES TO COLOR ACCORDING TO COS(ANGLE) */

void main() {
  // Set final rendered color according to the surface normal
    if (distance < 1.0) {
        gl_FragColor = vec4(0 ,cosine, 0, 1.0);
    } else {
        gl_FragColor = vec4(vec3(cosine) , 1.0);
    }

}
