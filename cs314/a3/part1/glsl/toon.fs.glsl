uniform vec3 lightDirectionUniform;
uniform vec3 lightColorUniform;
uniform vec3 ambientColorUniform;
uniform float shininessUniform;
uniform float kAmbientUniform;
uniform float kDiffuseUniform;
uniform float kSpecularUniform;


varying vec3 eyeCordNormal;
varying vec3 eyeCordLightDir;
varying vec3 eyeCordPosition;

const float numShades = 5.0;

void main() {
    vec3 lightColor = vec3(0.6,0.6,1.0);
    vec3 ambientColor = vec3(0.4,0.4,0.4);

    //phong_blinn
    vec3 N = normalize(eyeCordNormal);
    vec3 L = normalize(eyeCordLightDir);
    vec3 V = normalize(-eyeCordPosition);
    vec3 R = normalize((2.0 * dot(N,L)) * N - L);
    vec3 H = normalize(V + L);


    float diffuse =  max(0.0, dot(N,L)) * kDiffuseUniform;

    float specular = 0.0;

    if (diffuse > 0.0){
        specular =pow(max(dot(N, H),0.0),shininessUniform) * kSpecularUniform;
    }

    vec3 light_AMB = ambientColorUniform * kAmbientUniform;
    light_AMB = ambientColor;
    vec3 light_DFF = lightColor * diffuse;
    vec3 light_SPC = lightColor * specular;


    //TOTAL
    vec3 TOTAL = light_AMB + light_DFF + light_SPC;
    TOTAL = clamp(TOTAL,0.0,1.0);

    //end of bphong shading

    //silhouette
    float metallic = max(0.0,dot(N, V));
    metallic = smoothstep(0.1,0.6,metallic);
    metallic = metallic/2.0 + 0.5;
    TOTAL = TOTAL * metallic;


	//toon
	vec3 lightIntensity = ceil(numShades * TOTAL) / numShades;
   	vec4 resultingColor = vec4(TOTAL * lightIntensity , 1.0);

	gl_FragColor = resultingColor;
}
