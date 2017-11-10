uniform vec3 lightPosition;
uniform float time;

varying vec3 thisPosition;

void main() {
    float distance = length(lightPosition.xz - thisPosition.xz);
    float color = 1.0 - distance * 0.5;

    float adjustTime = time * 0.001;
    float sine = abs(sin(adjustTime));
    float cosine = abs(cos(adjustTime));

    gl_FragColor = vec4(color * sine, color * cosine, color * sine * cosine ,1.0);

}