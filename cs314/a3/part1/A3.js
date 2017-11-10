/*
 * UBC CPSC 314, Vsep2017
 * Assignment 3 Template
 */

 // Scene Modes
let Part = {
  LIGHTING: 0,
  ANISOTROPIC: 1,
  TOON: 2,
  COUNT: 3
};
let mode = Part.LIGHTING;// current mode

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
  new THREE.Scene()
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

let rotationUniform = {type: "v3", value: rotationVector};
let translationUniform = {type:'v3',value: new THREE.Vector3(0,0,0)};
let scalingUniform = {type:'v3',value: new THREE.Vector3(1,1,1)};

// Materials
let phongMaterial = new THREE.ShaderMaterial({
  uniforms: {
      lightDirectionUniform,
      lightColorUniform,
      ambientColorUniform,
      shininessUniform,
      kAmbientUniform,
      kDiffuseUniform,
      kSpecularUniform
  },
});

let bPhongMaterial = new THREE.ShaderMaterial({
  uniforms: {
      lightDirectionUniform,
      lightColorUniform,
      ambientColorUniform,
      shininessUniform,
      kAmbientUniform,
      kDiffuseUniform,
      kSpecularUniform
  },
});



function getAnisotropicMaterial(this_scalingUniform,this_translationUniform,this_rotationUniform){
    let ret= new THREE.ShaderMaterial({
        uniforms:
            {
                lightDirectionUniform,
                lightColorUniform,
                ambientColorUniform,
                shininessUniform,
                kAmbientUniform,
                kDiffuseUniform,
                kSpecularUniform,
                alphaXUniform,
                alphaYUniform,
                scalingUniform : this_scalingUniform,
                translationUniform :this_translationUniform,
                rotationUniform: this_rotationUniform
            },
    });

    new THREE.SourceLoader().load(shaderFiles, function(shaders) {
        ret.fragmentShader = shaders['glsl/anisotropic.fs.glsl'];
        ret.vertexShader = shaders['glsl/anisotropic.vs.glsl'];

        ret.needsUpdate = true;
    });


    return ret;
}

function getToonMaterial(this_scalingUniform, this_translationUniform, this_rotationUniform){
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
        ret.fragmentShader = shaders['glsl/toon.fs.glsl'];
        ret.vertexShader = shaders['glsl/toon.vs.glsl'];

        ret.needsUpdate = true;
    });

    return ret;
}



let anisotropicMaterial = new THREE.ShaderMaterial({
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
    },
});

let toonMaterial = new THREE.ShaderMaterial({
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
  'glsl/phong.vs.glsl',
  'glsl/phong.fs.glsl',
  'glsl/phong_blinn.vs.glsl',
  'glsl/phong_blinn.fs.glsl',
  'glsl/anisotropic.vs.glsl',
  'glsl/anisotropic.fs.glsl',
  'glsl/toon.fs.glsl',
  'glsl/toon.vs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
  phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
  bPhongMaterial.vertexShader = shaders['glsl/phong_blinn.vs.glsl'];
  bPhongMaterial.fragmentShader = shaders['glsl/phong_blinn.fs.glsl'];
  anisotropicMaterial.fragmentShader = shaders['glsl/anisotropic.fs.glsl'];
  anisotropicMaterial.vertexShader = shaders['glsl/anisotropic.vs.glsl'];
  toonMaterial.fragmentShader = shaders['glsl/toon.fs.glsl'];
  toonMaterial.vertexShader = shaders['glsl/toon.vs.glsl'];
  
  phongMaterial.needsUpdate = true;
  bPhongMaterial.needsUpdate = true;
  anisotropicMaterial.needsUpdate = true;
  toonMaterial.needsUpdate = true;
});

/////////////////////////////////
//       LIGHTING SCENE        //
//    RELEVANT TO PART 1.A+B   //
/////////////////////////////////

lighting = {};

// Create spheres for lighting scene
lighting.sphere = new THREE.SphereGeometry(1, 16, 16);

lighting.gouraud = new THREE.Mesh(lighting.sphere, new THREE.MeshLambertMaterial({color: 0xFFFFFF}));
lighting.gouraud.position.set(-3, 1, 1);
scenes[Part.LIGHTING].add(lighting.gouraud);

lighting.phong = new THREE.Mesh(lighting.sphere, phongMaterial);
lighting.phong.position.set(0, 1, 1);
scenes[Part.LIGHTING].add(lighting.phong);

lighting.phong_blinn = new THREE.Mesh(lighting.sphere, bPhongMaterial);
lighting.phong_blinn.position.set(3, 1, 1);
scenes[Part.LIGHTING].add(lighting.phong_blinn);

/////////////////////////////////
//      ANISOTROPIC SCENE      //
//    RELEVANT TO PART 1.C     //
/////////////////////////////////

let pi = Math.PI;

anisotropic = {};

// TODO: load your objects here

anisotropic.sphere = new THREE.SphereGeometry(1, 16, 16);
anisotropic.sphere_aniso = new THREE.Mesh(anisotropic.sphere, anisotropicMaterial);
anisotropic.sphere_aniso.position.set(0, 1, 1);
scenes[Part.ANISOTROPIC].add(anisotropic.sphere_aniso);




loadOBJ( Part.ANISOTROPIC, 'obj/male.obj', getAnisotropicMaterial(
    {type:'v3',value:new THREE.Vector3(0.025,0.025,0.025)},
    {type:'v3',value:new THREE.Vector3(4,0,-2)},
    {type:'v3', value:new THREE.Vector3(0,0 ,0)}),
    1,0,0,0,0,0,0);


//load car obj
loadOBJ( Part.ANISOTROPIC, 'obj/car.obj', getAnisotropicMaterial(
    {type:'v3',value:new THREE.Vector3(0.05,0.05,0.05)},
    {type:'v3',value:new THREE.Vector3(-6,0,-6)},
    {type:'v3', value:new THREE.Vector3(pi/2,0,-pi/4)}),
    1, 0,0,0,0,0,0);

loadOBJ( Part.ANISOTROPIC, 'obj/armadillo.obj', getAnisotropicMaterial(
    {type:'v3',value:new THREE.Vector3(0.8,0.8,0.8)},
    {type:'v3',value:new THREE.Vector3(-3,0.8,3)},
    {type:'v3', value:new THREE.Vector3(0,0.75 * pi ,0)}),
    1,0,0,0,0,0,0);


loadOBJ( Part.ANISOTROPIC, 'obj/bunny.obj', getAnisotropicMaterial(
    {type:'v3',value:new THREE.Vector3(0.5,0.5,0.5)},
    {type:'v3',value:new THREE.Vector3(4,0,2)},
    {type:'v3', value:new THREE.Vector3(0, pi/6 ,0)}),
    1,0,0,0,0,0,0);




/////////////////////////////////
//      TOON SCENE             //
//    RELEVANT TO PART 1.D     //
/////////////////////////////////

toon = {};

// TODO: load your objects here

toon.sphere = new THREE.SphereGeometry(1, 16, 16);
toon.npr_toon = new THREE.Mesh(toon.sphere, toonMaterial);
toon.npr_toon.position.set(0, 1, 1);
scenes[Part.TOON].add(toon.npr_toon);

//
loadOBJ( Part.TOON, 'obj/male.obj', getToonMaterial(
    {type:'v3',value:new THREE.Vector3(0.025,0.025,0.025)},
    {type:'v3',value:new THREE.Vector3(2,0,-2)},
    {type:'v3', value:new THREE.Vector3(0,pi/8 ,0)}),
    1,0,0,0,0,0,0);


loadOBJ( Part.TOON, 'obj/car.obj', getToonMaterial(
    {type:'v3',value:new THREE.Vector3(0.05,0.05,0.05)},
    {type:'v3',value:new THREE.Vector3(-6,0,-6)},
    {type:'v3', value:new THREE.Vector3(pi/2,0,-pi/4)}),
    1, 0,0,0,0,0,0);

loadOBJ( Part.TOON, 'obj/armadillo.obj', getToonMaterial(
    {type:'v3',value:new THREE.Vector3(0.8,0.8,0.8)},
    {type:'v3',value:new THREE.Vector3(-3,0.8,3)},
    {type:'v3', value:new THREE.Vector3(0,0.75 * pi ,0)}),
    1,0,0,0,0,0,0);


loadOBJ( Part.TOON, 'obj/bunny.obj', getToonMaterial(
    {type:'v3',value:new THREE.Vector3(0.5,0.5,0.5)},
    {type:'v3',value:new THREE.Vector3(4,0,2)},
    {type:'v3', value:new THREE.Vector3(0, pi/6 ,0)}),
    1,0,0,0,0,0,0);


// LISTEN TO KEYBOARD
let keyboard = new THREEx.KeyboardState();

function checkKeyboard() {
  if (keyboard.pressed("1"))
    mode = Part.LIGHTING;
  else if (keyboard.pressed("2"))
    mode = Part.ANISOTROPIC;
  else if (keyboard.pressed("3"))
    mode = Part.TOON;
}

// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  requestAnimationFrame(update);
  renderer.render(scenes[mode], cameras[mode]);
}

update();
