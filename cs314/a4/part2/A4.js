/*
 * UBC CPSC 314, Vsep2017
 * Assignment 4 Template
 */

// Setup renderer
var canvas = document.getElementById('canvas');
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xFFFFFF);
canvas.appendChild(renderer.domElement);

// Adapt backbuffer to window size
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  lightCamera.aspect = window.innerWidth / window.innerHeight;
  lightCamera.updateProjectionMatrix();
}

// Hook up to event listener
window.addEventListener('resize', resize);
window.addEventListener('vrdisplaypresentchange', resize, true);

// Disable scrollbar function
window.onscroll = function() {
  window.scrollTo(0, 0);
}

var depthScene = new THREE.Scene(); // shadowmap 
var finalScene = new THREE.Scene(); // final result

// Main camera 
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(0,10,20);
camera.lookAt(finalScene.position);
finalScene.add(camera);

// COMMENT BELOW FOR VR CAMERA
// ------------------------------

// Giving it some controls
cameraControl = new THREE.OrbitControls(camera);
cameraControl.damping = 0.2;
cameraControl.autoRotate = false;
// ------------------------------
// COMMENT ABOVE FOR VR CAMERA



// UNCOMMENT BELOW FOR VR CAMERA
// ------------------------------
// Apply VR headset positional data to camera.
// var controls = new THREE.VRControls(camera);
// controls.standing = true;

// // Apply VR stereo rendering to renderer.
// var effect = new THREE.VREffect(renderer);
// effect.setSize(window.innerWidth, window.innerHeight);


// var display;

// // Create a VR manager helper to enter and exit VR mode.
// var params = {
//   hideButton: false, // Default: false.
//   isUndistorted: false // Default: false.
// };
// var manager = new WebVRManager(renderer, effect, params);
// ------------------------------
// UNCOMMENT ABOVE FOR VR CAMERA


// ------------------------------
// LOADING MATERIALS AND TEXTURES

// Shadow map camera
var shadowMapWidth = 10;
var shadowMapHeight = 10;
var lightDirection = new THREE.Vector3(0.49,0.79,0.49);
var lightCamera = new THREE.OrthographicCamera(shadowMapWidth / - 2, shadowMapWidth / 2, shadowMapHeight / 2, shadowMapHeight / -2, 1, 1000)
lightCamera.position.set(10, 10, 10);
lightCamera.lookAt(new THREE.Vector3(lightCamera.position - lightDirection));
depthScene.add(lightCamera);

// XYZ axis helper
var worldFrame = new THREE.AxisHelper(2);
finalScene.add(worldFrame);

// texture containing the depth values from the lightCamera POV
// anisotropy allows the texture to be viewed decently at skewed angles
var shadowMapWidth = window.innerWidth;
var shadowMapHeight = window.innerHeight;

// Texture/Render Target where the shadowmap will be written to
var shadowMap = new THREE.WebGLRenderTarget(shadowMapWidth, shadowMapHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter } )

// Loading the different textures 
// Anisotropy allows the texture to be viewed 'decently' at different angles
var colorMap = new THREE.TextureLoader().load('images/color.jpg');
colorMap.anisotropy = renderer.getMaxAnisotropy();
var normalMap = new THREE.TextureLoader().load('images/normal.png');
normalMap.anisotropy = renderer.getMaxAnisotropy();
var aoMap = new THREE.TextureLoader().load('images/ambient_occlusion.png');
aoMap.anisotropy = renderer.getMaxAnisotropy();

// Uniforms
var cameraPositionUniform = {type: "v3", value: camera.position };
var lightColorUniform = {type: "c", value: new THREE.Vector3(1.0, 1.0, 1.0) };
var ambientColorUniform = {type: "c", value: new THREE.Vector3(1.0, 1.0, 1.0) };
var lightDirectionUniform = {type: "v3", value: lightDirection };
var kAmbientUniform = {type: "f", value: 0.1};
var kDiffuseUniform = {type: "f", value: 0.8};
var kSpecularUniform = {type: "f", value: 0.4};
var shininessUniform = {type: "f", value: 50.0};
var lightViewMatrixUniform = {type: "m4", value: lightCamera.matrixWorldInverse};
var lightProjectMatrixUniform = {type: "m4", value: lightCamera.projectionMatrix};

// Materials
var depthMaterial = new THREE.ShaderMaterial({});

var terrainMaterial = new THREE.ShaderMaterial({
  // side: THREE.DoubleSide,
  uniforms: {
    lightColorUniform: lightColorUniform,
    ambientColorUniform: ambientColorUniform,
    lightDirectionUniform: lightDirectionUniform,
    kAmbientUniform: kAmbientUniform,
    kDiffuseUniform: kDiffuseUniform,
    kSpecularUniform: kSpecularUniform,
    shininessUniform: shininessUniform,
    colorMap: { type: "t", value: colorMap },
    normalMap: { type: "t", value: normalMap },
    aoMap: { type: "t", value: aoMap },
    shadowMap: { type: "t", value: shadowMap }
  }
});

var armadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightColorUniform: lightColorUniform,
    ambientColorUniform: ambientColorUniform,
    lightDirectionUniform: lightDirectionUniform,
    kAmbientUniform: kAmbientUniform,
    kDiffuseUniform: kDiffuseUniform,
    kSpecularUniform: kSpecularUniform,
    shininessUniform: shininessUniform
  }
});

var skyboxCubemap = new THREE.CubeTextureLoader()
  .setPath( 'images/cubemap/' )
  .load( [
  'cube1.png', 'cube2.png',
  'cube3.png', 'cube4.png',
  'cube5.png', 'cube6.png'
  ] );

var skyboxMaterial = new THREE.ShaderMaterial({
	uniforms: {
		skybox: { type: "t", value: skyboxCubemap },
	},
    side: THREE.DoubleSide
});

// -------------------------------
// LOADING SHADERS
var shaderFiles = [
  'glsl/depth.vs.glsl',
  'glsl/depth.fs.glsl',

  'glsl/terrain.vs.glsl',
  'glsl/terrain.fs.glsl',  

  'glsl/bphong.vs.glsl',
  'glsl/bphong.fs.glsl',

  'glsl/skybox.vs.glsl',
  'glsl/skybox.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
	depthMaterial.vertexShader = shaders['glsl/depth.vs.glsl'];
	depthMaterial.fragmentShader = shaders['glsl/depth.fs.glsl'];
	terrainMaterial.vertexShader = shaders['glsl/terrain.vs.glsl'];
	terrainMaterial.fragmentShader = shaders['glsl/terrain.fs.glsl'];
	armadilloMaterial.vertexShader = shaders['glsl/bphong.vs.glsl'];
	armadilloMaterial.fragmentShader = shaders['glsl/bphong.fs.glsl'];
	skyboxMaterial.vertexShader = shaders['glsl/skybox.vs.glsl'];
	skyboxMaterial.fragmentShader = shaders['glsl/skybox.fs.glsl'];
});

// LOAD OBJ ROUTINE
// mode is the scene where the model will be inserted
function loadOBJ(scene, file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if (query.lengthComputable) {
      var percentComplete = query.loaded / query.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };

  var onError = function() {
    console.log('Failed to load ' + file);
  };

  var loader = new THREE.OBJLoader();
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
    scene.add(object)
  }, onProgress, onError);
}

// -------------------------------
// ADD OBJECTS TO THE SCENE
var terrainGeometry = new THREE.PlaneBufferGeometry(10, 10);
var terrain = new THREE.Mesh(terrainGeometry, terrainMaterial)
terrain.rotation.set(-1.57, 0, 0)
finalScene.add(terrain)
var terrainDO = new THREE.Mesh(terrainGeometry, depthMaterial)
terrainDO.rotation.set(-1.57, 0, 0)
depthScene.add(terrainDO)


loadOBJ(finalScene, 'obj/armadillo.obj', armadilloMaterial, 1.0, 0, 1.0, 0, 0, 0, 0);
loadOBJ(depthScene, 'obj/armadillo.obj', depthMaterial, 1.0, 0, 1.0, 0, 0, 0, 0);

// -------------------------------
// UPDATE ROUTINES
var keyboard = new THREEx.KeyboardState();

function checkKeyboard() { }

function updateMaterials() {
	cameraPositionUniform.value = camera.position;

	depthMaterial.needsUpdate = true;
	terrainMaterial.needsUpdate = true;
	armadilloMaterial.needsUpdate = true;
	skyboxMaterial.needsUpdate = true;
}

// Update routine
function update() {
	checkKeyboard();
	updateMaterials();

	requestAnimationFrame(update);
	renderer.render(depthScene, lightCamera, shadowMap);
	renderer.render(finalScene, camera);


  // UNCOMMENT BELOW FOR VR CAMERA
  // ------------------------------
  // Update VR headset position and apply to camera.
  // controls.update();
  // ------------------------------
  // UNCOMMENT ABOVE FOR VR CAMERA

  // To see the shadowmap values: 
    // renderer.render(depthScene, lightCamera)
}

resize();
update();
