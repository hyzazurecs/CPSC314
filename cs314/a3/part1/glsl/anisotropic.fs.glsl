uniform vec3 lightDirectionUniform;
uniform vec3 lightColorUniform;
uniform vec3 ambientColorUniform;
uniform float shininessUniform;
uniform float kAmbientUniform;
uniform float kDiffuseUniform;
uniform float kSpecularUniform;
uniform float alphaXUniform;
uniform float alphaYUniform;


varying vec3 eyeCordNormal ;
varying vec3 eyeCordPosition ;
varying vec3 eyeCordLightDir ;


void main() {

     vec3 N = normalize(eyeCordNormal);
     vec3 L = normalize(eyeCordLightDir);

     vec3 V = normalize( - eyeCordPosition);
     vec3 H = normalize(V + L);

     vec3 up = vec3(0.0,1.0,0.0);
     vec3 T = normalize(cross(N,up));
     vec3 B = normalize(cross(N,T));


    float diffuse = max(0.0, dot(N,L)) * kDiffuseUniform;

    float specular = 0.0;

    if (diffuse > 0.0){
        specular = kSpecularUniform * sqrt(max((dot(L,N)/dot(V,N)),0.0))
                   * exp(-2.0 * ((pow((dot(H,T)/alphaXUniform),2.0) +
                   pow((dot(H,B)/alphaYUniform),2.0))/(1.0 + dot(H,N))));
    }

    specular = max(0.0,specular);


	vec3 light_AMB = ambientColorUniform * kAmbientUniform;
	vec3 light_DFF = lightColorUniform * diffuse;
	vec3 light_SPC = lightColorUniform * specular;

	//TOTAL
	vec3 TOTAL = light_AMB + light_DFF + light_SPC;
	TOTAL = clamp(TOTAL,0.0,1.0);
	gl_FragColor = vec4(TOTAL, 0.0);

}