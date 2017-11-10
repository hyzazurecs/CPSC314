/*
 * UBC CPSC 314, Vsep2017
 * Assignment 3 Template
 */

 // Scene Modes
let Part = {
  GOOCH: 1,
  CROSS_HATCHING: 0,
  FOG: 2,
  COUNT: 3
};
let mode = Part.CROSS_HATCHING;// current mode

// Setup renderer
let canvas = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer();


renderer.setClearColor(0xFFFFFF); // black background colour
canvas.appendChild(renderer.domElement);

// Adapt backbuffer to window size
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  for (let i = 0; i < Part.COUNT; ++i) {
    cameras[i].aspect = window.innerWidth / window.innerHeight;
    cameras[i].updateProjectionMatrix();
  }
}

// Hook up to event listener
window.addEventListener('resize', resize);

// Disable scrollbar function
window.onscroll = function() {
  window.scrollTo(0, 0);
};

// Setup scenes
let scenes = [
  new THREE.Scene(),
  new THREE.Scene(),
  new THREE.Scene(),
];

// Setting up all shared objects
let cameras = [];
let controls = [];
let worldFrames = [];
let floorTextures = [];
let floorMaterials = [];
let floorGeometries = [];
let floors = [];

for (let i = 0; i < Part.COUNT; ++i) {
  cameras[i] = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
  cameras[i].position.set(0,10,20);
  cameras[i].lookAt(scenes[i].position);
  scenes[i].add(cameras[i]);

  let pointLight = new THREE.PointLight(0xFFFFFF, 1, 1000);
  pointLight.position.set(5, 8, 5);
  scenes[i].add(pointLight);

  // orbit controls
  controls[i] = new THREE.OrbitControls(cameras[i]);
  controls[i].damping = 0.2;
  controls[i].autoRotate = false;

  worldFrames[i] = new THREE.AxisHelper(2);
  worldFrames[i].position.set(-7.5, 0.1, -7.5);


  floorTextures[i] = new THREE.ImageUtils.loadTexture('images/floor.jpg');
  floorTextures[i].wrapS = floorTextures[i].wrapT = THREE.RepeatWrapping;
  floorTextures[i].repeat.set(1, 1);

  floorMaterials[i] = new THREE.MeshBasicMaterial({
    map: floorTextures[i],
    side: THREE.DoubleSide
  });
  floorGeometries[i] = new THREE.PlaneBufferGeometry(15, 15);
  floors[i] = new THREE.Mesh(floorGeometries[i], floorMaterials[i]);
  floors[i].rotation.x = Math.PI / 2;
  floors[i].parent = worldFrames[i];

  scenes[i].add(worldFrames[i]);
  scenes[i].add(floors[i]);
}
resize();

// LOAD OBJ ROUTINE
// mode is the scene where the model will be inserted
function loadOBJ(mode, file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  let onProgress = function(query) {
    if (query.lengthComputable) {
      let percentComplete = query.loaded / query.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };

  let onError = function() {
    console.log('Failed to load ' + file);
  };

  let loader = new THREE.OBJLoader();
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff, yOff, zOff);
    object.rotation.x = xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale, scale, scale);
    object.parent = worldFrames[mode];
    scenes[mode].add(object);
  }, onProgress, onError);
}

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Parameters defining the light
let lightColor = new THREE.Color(1.0,1.0,1.0);
let ambientColor = new THREE.Color(0.4,0.4,0.4);
let lightDirection = new THREE.Vector3(0.49,0.79,0.49);


// Material properties
let kAmbient = 0.4;
let kDiffuse = 0.8;
let kSpecular = 0.8;
let shininess = 10.0;
let alphaX = 0.7;
let alphaY = 0.1;

let rotationVector = new THREE.Vector3(0.0,0.0,0.0);

let fogNear = 400;
let fogFar = 600;
let fogColor = new THREE.Color(0xffffff);




// Uniforms
let lightColorUniform = {type: "c", value: lightColor};
let ambientColorUniform = {type: "c", value: ambientColor};
let lightDirectionUniform = {type: "v3", value: lightDirection};
let kAmbientUniform = {type: "f", value: kAmbient};
let kDiffuseUniform = {type: "f", value: kDiffuse};
let kSpecularUniform = {type: "f", value: kSpecular};
let shininessUniform = {type: "f", value: shininess};
let alphaXUniform = {type: "f", value: alphaX};
let alphaYUniform = {type: "f", value: alphaY};
let sControlUniform = {type: "f", value : 0.0};

let rotationUniform = {type: "v3", value: rotationVector};
let translationUniform = {type:'v3',value: new THREE.Vector3(0,0,0)};
let scalingUniform = {type:'v3',value: new THREE.Vector3(1,1,1)};

let fogColorUniform = {type: "c", value : fogColor};
let fogNearUniform = {type: 'f', value: fogNear};
let fogFarUniform = {type: 'f', value: fogFar};

// Materials

let fogMaterial = new THREE.ShaderMaterial({
    uniforms:{
        fogColor: fogColorUniform,
        fogNear : fogNearUniform,
        fogFar : fogFarUniform,
        fogTexture: {type:'t', value: new THREE.ImageUtils.loadTexture('images/floor1.jpg')}

    },
});



function getgoochMaterial(this_scalingUniform,this_translationUniform,this_rotationUniform){
    let ret = new THREE.ShaderMaterial({
        uniforms:{
            lightDirectionUniform,
            lightColorUniform,
            ambientColorUniform,
            shininessUniform,
            kAmbientUniform,
            kDiffuseUniform,
            kSpecularUniform,
            alphaXUniform,
            alphaYUniform,
            sControlUniform,


            scalingUniform: this_scalingUniform,
            rotationUniform: this_rotationUniform,
            translationUniform: this_translationUniform
        }
    });

    new THREE.SourceLoader().load(shaderFiles, function(shaders){
        ret.fragmentShader = shaders['glsl/gooch.fs.glsl'];
        ret.vertexShader = shaders['glsl/gooch.vs.glsl'];

        ret.needsUpdate = true;
    });

    return ret;
}

function getCROSS_HATCHINGMaterial(this_scalingUniform, this_translationUniform, this_rotationUniform){
    let ret = new THREE.ShaderMaterial({
        uniforms:{
            lightDirectionUniform,
            lightColorUniform,
            ambientColorUniform,
            shininessUniform,
            kAmbientUniform,
            kDiffuseUniform,
            kSpecularUniform,

            scalingUniform: this_scalingUniform,
            rotationUniform: this_rotationUniform,
            translationUniform: this_translationUniform
        }
    });

    new THREE.SourceLoader().load(shaderFiles, function(shaders){
        ret.fragmentShader = shaders['glsl/CROSS_HATCHING.fs.glsl'];
        ret.vertexShader = shaders['glsl/CROSS_HATCHING.vs.glsl'];

        ret.needsUpdate = true;
    });

    return ret;
}



let goochMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightDirectionUniform,
        lightColorUniform,
        ambientColorUniform,
        shininessUniform,
        kAmbientUniform,
        kDiffuseUniform,
        kSpecularUniform,
        alphaXUniform,
        alphaYUniform,
        rotationUniform,
        translationUniform,
        scalingUniform,
        sControlUniform
    },
});

let CROSS_HATCHINGMaterial = new THREE.ShaderMaterial({
  uniforms: {
      lightDirectionUniform,
      lightColorUniform,
      ambientColorUniform,
      shininessUniform,
      kAmbientUniform,
      kDiffuseUniform,
      kSpecularUniform,
      rotationUniform: {type:'v3',value:new THREE.Vector3(0,0,0)},
      translationUniform: {type:'v3',value: new THREE.Vector3(0,0,0)},
      scalingUniform: { type:'v3',value: new THREE.Vector3(1,1,1)}

  },
});

// Load shaders
let shaderFiles = [
  'glsl/gooch.vs.glsl',
  'glsl/gooch.fs.glsl',
  'glsl/CROSS_HATCHING.fs.glsl',
  'glsl/CROSS_HATCHING.vs.glsl',
    'glsl/fog.vs.glsl',
    'glsl/fog.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  goochMaterial.fragmentShader = shaders['glsl/gooch.fs.glsl'];
  goochMaterial.vertexShader = shaders['glsl/gooch.vs.glsl'];
  CROSS_HATCHINGMaterial.fragmentShader = shaders['glsl/CROSS_HATCHING.fs.glsl'];
  CROSS_HATCHINGMaterial.vertexShader = shaders['glsl/CROSS_HATCHING.vs.glsl'];
  fogMaterial.vertexShader = shaders['glsl/fog.vs.glsl'];
  fogMaterial.fragmentShader = shaders['glsl/fog.fs.glsl'];

  goochMaterial.needsUpdate = true;
  CROSS_HATCHINGMaterial.needsUpdate = true;
  fogMaterial.needsUpdate = true;
});



let pi = Math.PI;

gooch = {};

// TODO: load your objects here

gooch.sphere = new THREE.SphereGeometry(1, 16, 16);
gooch.sphere_gooch = new THREE.Mesh(gooch.sphere, goochMaterial);
gooch.sphere_gooch.position.set(0, 1, 1);
scenes[Part.GOOCH].add(gooch.sphere_gooch);



loadOBJ( Part.GOOCH, 'obj/male.obj', getgoochMaterial(
    {type:'v3',value:new THREE.Vector3(0.025,0.025,0.025)},
    {type:'v3',value:new THREE.Vector3(4,0,-2)},
    {type:'v3', value:new THREE.Vector3(0,0 ,0)}),
    1,0,0,0,0,0,0);


//load car obj
loadOBJ( Part.GOOCH, 'obj/car.obj', getgoochMaterial(
    {type:'v3',value:new THREE.Vector3(0.05,0.05,0.05)},
    {type:'v3',value:new THREE.Vector3(-6,0,-6)},
    {type:'v3', value:new THREE.Vector3(pi/2,0,-pi/4)}),
    1, 0,0,0,0,0,0);

loadOBJ( Part.GOOCH, 'obj/armadillo.obj', getgoochMaterial(
    {type:'v3',value:new THREE.Vector3(0.8,0.8,0.8)},
    {type:'v3',value:new THREE.Vector3(-3,0.8,3)},
    {type:'v3', value:new THREE.Vector3(0,0.75 * pi ,0)}),
    1,0,0,0,0,0,0);


loadOBJ( Part.GOOCH, 'obj/bunny.obj', getgoochMaterial(
    {type:'v3',value:new THREE.Vector3(0.5,0.5,0.5)},
    {type:'v3',value:new THREE.Vector3(4,0,2)},
    {type:'v3', value:new THREE.Vector3(0, pi/6 ,0)}),
    1,0,0,0,0,0,0);





CROSS_HATCHING = {};

// TODO: load your objects here

CROSS_HATCHING.sphere = new THREE.SphereGeometry(1, 16, 16);
CROSS_HATCHING.npr_CROSS_HATCHING = new THREE.Mesh(CROSS_HATCHING.sphere, CROSS_HATCHINGMaterial);
CROSS_HATCHING.npr_CROSS_HATCHING.position.set(0, 1, 1);
scenes[Part.CROSS_HATCHING].add(CROSS_HATCHING.npr_CROSS_HATCHING);

//
loadOBJ( Part.CROSS_HATCHING, 'obj/male.obj', getCROSS_HATCHINGMaterial(
    {type:'v3',value:new THREE.Vector3(0.025,0.025,0.025)},
    {type:'v3',value:new THREE.Vector3(4,0,-2)},
    {type:'v3', value:new THREE.Vector3(0,0 ,0)}),
    1,0,0,0,0,0,0);


loadOBJ( Part.CROSS_HATCHING, 'obj/car.obj', getCROSS_HATCHINGMaterial(
    {type:'v3',value:new THREE.Vector3(0.05,0.05,0.05)},
    {type:'v3',value:new THREE.Vector3(-6,0,-6)},
    {type:'v3', value:new THREE.Vector3(pi/2,0,-pi/4)}),
    1, 0,0,0,0,0,0);

loadOBJ( Part.CROSS_HATCHING, 'obj/armadillo.obj', getCROSS_HATCHINGMaterial(
    {type:'v3',value:new THREE.Vector3(0.8,0.8,0.8)},
    {type:'v3',value:new THREE.Vector3(-3,0.8,3)},
    {type:'v3', value:new THREE.Vector3(0,0.75 * pi ,0)}),
    1,0,0,0,0,0,0);


loadOBJ( Part.CROSS_HATCHING, 'obj/bunny.obj', getCROSS_HATCHINGMaterial(
    {type:'v3',value:new THREE.Vector3(0.5,0.5,0.5)},
    {type:'v3',value:new THREE.Vector3(4,0,2)},
    {type:'v3', value:new THREE.Vector3(0, pi/6 ,0)}),
    1,0,0,0,0,0,0);



//part fog
fog = {};
fog.cube = new THREE.CubeGeometry(3,3,3);
fog.CubeObj = new THREE.Mesh(fog.cube, fogMaterial);
fog.CubeObj.position.set(0,1,1);
// scenes[Part.FOG].add(fog.CubeObj);



for (let i = 0; i < 100; i++){
    let scale =10 + Math.random() * 10;
    let posX = - 100 + Math.random() * 200;
    let posY = 0;
    let posZ = - 100 + Math.random() * 200;

    loadOBJ(Part.FOG, 'obj/Tree.obj',fogMaterial,scale,posX,posY,posZ,0,0,0);
}




// LISTEN TO KEYBOARD
let keyboard = new THREEx.KeyboardState();

function checkKeyboard() {
  if (keyboard.pressed("1"))
    mode = Part.CROSS_HATCHING;
  else if (keyboard.pressed("2"))
    mode = Part.GOOCH;
  else if (keyboard.pressed("3"))
      mode = Part.FOG;


  if (keyboard.pressed('s')){
      if (sControlUniform.value == 1){
          sControlUniform.value = 0;
      } else {
          sControlUniform.value = 1;
      }
  }

  if (keyboard.pressed('q')){
      fogFarUniform.value += 3;
  } else if (keyboard.pressed('a')){
      fogFarUniform.value -= 3;
  }

  if (fogFarUniform.value <= fogNearUniform.value){
      fogFarUniform.value = fogNearUniform.value + 10;
  }


}

// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  requestAnimationFrame(update);
  renderer.render(scenes[mode], cameras[mode]);
}

update();
