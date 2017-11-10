uniform vec3 lightDirectionUniform;
uniform vec3 lightColorUniform;
uniform vec3 ambientColorUniform;
uniform float shininessUniform;
uniform float kAmbientUniform;
uniform float kDiffuseUniform;
uniform float kSpecularUniform;

varying vec3 eyeCordNormal ;
varying vec3 eyeCordPosition ;
varying vec3 eyeCordLightDir ;

void main() {


    //normal
	vec3 N = normalize(eyeCordNormal);
	//LightDir
	vec3 L = normalize(eyeCordLightDir);
	//View Dir
	vec3 V = normalize(-eyeCordPosition);

	//reflect
	vec3 R = normalize((2.0 * dot(N,L)) * N - L);
	//halfway
	vec3 H = normalize(V + L);


    float diffuse =  max(0.0, dot(N,L)) * kDiffuseUniform;

    float specular = 0.0;

    if (diffuse > 0.0){
        specular =pow(max(dot(N, H),0.0),shininessUniform) * kSpecularUniform;
    }

    vec3 light_AMB = ambientColorUniform * kAmbientUniform;
    vec3 light_DFF = lightColorUniform * diffuse;
    vec3 light_SPC = lightColorUniform * specular;


	//TOTAL
	vec3 TOTAL = light_AMB + light_DFF + light_SPC;
    TOTAL = clamp(TOTAL,0.0,1.0);
	gl_FragColor = vec4(TOTAL, 0.0);

}