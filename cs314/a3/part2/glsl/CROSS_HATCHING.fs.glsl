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

	float THRESHOLD = 0.4;
//	if (lightIntensity.x < THRESHOLD * TOTAL.x && lightIntensity.y < THRESHOLD * TOTAL.y && lightIntensity.z < THRESHOLD * TOTAL.z){
    if (lightIntensity.x < 0.7 && lightIntensity.x >=0.6){
          float plane = mod(eyeCordPosition.x + eyeCordPosition.y,0.03);
          if ( plane <= 0.005 && plane >= 0.0){
               resultingColor = vec4(vec3(0.0),1.0);
          }
	}

	if (lightIntensity.x < 0.6){
	    float  plane1= mod(eyeCordPosition.x + eyeCordPosition.y,0.05);

	    if ( plane1 <= 0.005 && plane1 >= 0.0){
	        resultingColor = vec4(vec3(0.0),1.0);
        }
	    float plane2 = mod(eyeCordPosition.x - eyeCordPosition.y,0.05);
        if (plane2 <= 0.005 && plane2 >=0.0){
            resultingColor = vec4(vec3(0.0),1.0);
        }
	}


	gl_FragColor = resultingColor;
}


//uniform vec3 lightColor;
//uniform vec3 lightDirection;
//
//varying vec3 vNormal;
//varying vec3 vPosition;
//
//vec4 ambientColor = vec4(0.0, 0.0, 0.2, 0.0);
//
//void main() {
//
//	//TOTAL INTENSITY
//	float lightIntensity = 0.0;
//    lightIntensity = max(0.0,dot(lightDirection,vNormal));
//
//    float fraction = 1.0;
//
//   	vec4 resultingColor = vec4(vec3(1.0),0.0);
//
//
//    if (lightIntensity > pow(0.95,fraction)){
//        resultingColor = vec4(vec3(1.0),1.0);
//    } else if (lightIntensity > pow(0.75,fraction)){
//        resultingColor = vec4(vec3(0.7),1.0);
//    } else if (lightIntensity > pow(0.55,fraction)){
//        resultingColor = vec4(vec3(0.55),1.0);
//    }
//    else if (lightIntensity > pow(0.25,fraction)){
//        resultingColor = vec4(vec3(0.4),1.0);
//        float num = mod(vPosition.x + vPosition.y,0.03);
//        if ( num <= 0.01 && num >= 0.0){
//            resultingColor = vec4(vec3(0.0),1.0);
//        }
//
//    } else {
//        resultingColor = vec4(vec3(0.2),1.0);
//
//
//        float numX = mod(vPosition.x + vPosition.y,0.05);
//        if ( numX <= 0.015 && numX >= 0.0){
//            resultingColor = vec4(vec3(0.0),1.0);
//        }
//
//        float numZ = mod(vPosition.z - vPosition.y,0.05);
//
//        if (numZ <= 0.015 && numZ >=0.0){
//            resultingColor = vec4(vec3(0.0),1.0);
//        }
//    }
//
//    resultingColor += ambientColor;
//
//	gl_FragColor = resultingColor;
//}
