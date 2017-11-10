// Shared variable interpolated across the triangle
varying vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
