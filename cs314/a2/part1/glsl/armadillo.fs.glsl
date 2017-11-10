// Shared variable interpolated across the triangle
varying vec3 light;

void main() {
	// Setting final pixel color
	gl_FragColor = vec4(light, 1.0); 
}
