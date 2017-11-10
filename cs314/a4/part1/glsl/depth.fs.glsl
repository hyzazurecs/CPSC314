void main() {
	// The code below is to get shadow mapping working on OpenGL ES 2.0
	// as floating point textures and reading from depth buffer are not supported
	// the 32-bit floating value is packed into the RGBA(8+8+8+8) integers
	// In such way the depth buffer can be obtained by unpacking the RGBA value after sampling
	const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
	const vec4 bitMask = vec4(1.0/256.0, 1.0/256.0, 1.0/256.0, 0.0);
	vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift);
	rgbaDepth -= rgbaDepth.gbaa * bitMask;

	gl_FragColor = rgbaDepth;
}
