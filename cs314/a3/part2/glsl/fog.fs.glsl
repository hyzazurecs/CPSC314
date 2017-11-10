uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
uniform sampler2D fogTexture;


varying vec2 vUv;
varying vec3 vPosition;

void main() {

     gl_FragColor = texture2D(fogTexture, vUv);
     float depth = gl_FragCoord.z / gl_FragCoord.w;
     float fogFactor = smoothstep( fogNear, fogFar, depth );

     gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
}
