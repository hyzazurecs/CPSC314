uniform vec3 lightDirectionUniform;
uniform vec3 lightColorUniform;
uniform vec3 ambientColorUniform;
uniform float shininessUniform;
uniform float kAmbientUniform;
uniform float kDiffuseUniform;
uniform float kSpecularUniform;
uniform float sControlUniform;


varying vec3 eyeCordNormal;
varying vec3 eyeCordLightDir;
varying vec3 eyeCordPosition;

vec4 ambientColor = vec4(0.0, 0.0, 0.2, 0.0);

vec3 u_objectColor = vec3(1.0, 1.0, 1.0);
vec3 u_coolColor = vec3(159.0/255.0, 148.00/255.0, 255.0/255.0);
vec3 u_warmColor = vec3(255.0/255.0, 75.0/255.0, 75.0/255.0);
float u_alpha = 0.25;
float u_beta = 0.5;

void main() {
    vec3 lightColor = vec3(0.5,1.0,0.5);

    //phong_blinn
    vec3 N = normalize(eyeCordNormal);
    vec3 L = normalize(eyeCordLightDir);
    vec3 V = normalize(-eyeCordPosition);
    vec3 R = normalize((2.0 * dot(N,L)) * N - L);
    vec3 H = normalize(V + L);


    vec4 resultingColor = vec4(0.0,0.0,0.0,1.0);

    float diffuse = max(0.0, dot(N,L));

    vec3 coolColor = u_coolColor + u_objectColor * u_alpha;
    vec3 warmColor = u_warmColor + u_objectColor * u_beta;
    vec3 colorOut = mix(coolColor,warmColor, diffuse);

    resultingColor = vec4(colorOut,1.0);


    float specular = 0.0;

    if (diffuse > 0.0){
        specular =pow(max(dot(N, H),0.0),shininessUniform) *kSpecularUniform;
    }

//    vec3 light_AMB = ambientColorUniform * kAmbientUniform;
    vec3 light_DFF = colorOut;
    vec3 light_SPC = lightColorUniform * specular;


    	//TOTAL
    vec3 TOTAL;
    if (sControlUniform == 1.0){
        TOTAL = light_DFF + light_SPC;
    } else{
        TOTAL = light_DFF;
    }
    TOTAL = clamp(TOTAL,0.0,1.0);
    gl_FragColor = vec4(TOTAL, 0.0);

//	gl_FragColor = resultingColor;
}
