uniform float laserTrans;
varying vec4 color;


void main() {
	// Set constant color
//	gl_FragColor = vec4(1, 0, 0, laserTrans);
    gl_FragColor = color;
}