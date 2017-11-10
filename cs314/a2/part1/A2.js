/*
 * UBC CPSC 314, Vsep2017
 * Assignment 2 Template
 */
// Modes.. one per part of question 1
let Part = {
    EYES: 0,
    LASERS: 1,
    DEFORM: 2,
    COUNT: 3
};
let mode = Part.EYES; // current mode

// Setup renderer
let canvas = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000); // black background colour
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
window.onscroll = function () {
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
    cameras[i].position.set(-5, 5, -15);
    cameras[i].lookAt(scenes[i].position);
    scenes[i].add(cameras[i]);

    // orbit controls
    controls[i] = new THREE.OrbitControls(cameras[i]);
    controls[i].damping = 0.2;
    controls[i].autoRotate = false;

    worldFrames[i] = new THREE.AxisHelper(3);

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
    var onProgress = function (query) {
        if (query.lengthComputable) {
            var percentComplete = query.loaded / query.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function () {
        console.log('Failed to load ' + file);
    };

    var loader = new THREE.OBJLoader();
    loader.load(file, function (object) {
        object.traverse(function (child) {
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

// SHARED MATERIALS
// Lightbulb has same position in both shaders
let lightPosition = {
    type: 'v3',
    value: new THREE.Vector3(0, 0, 0)
};

let leftEyePosition = {
    type: 'v3',
    value: new THREE.Vector3(0.11,2.43,-0.73)
};

let rightEyePosition = {
    type: 'v3',
    value: new THREE.Vector3(-0.11,2.43,-0.73)
};

let noddingAngle = {
    type: 'f',
    value: 0.0
};


// (A) & (B) ARMADILLO
let armadilloMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightPosition: lightPosition
    }
});
let armadilloShaderFiles = [
    'glsl/armadillo.vs.glsl',
    'glsl/armadillo.fs.glsl'
];

// (C) NODDING ARMADILLO
let noddingArmadilloMaterial = new THREE.ShaderMaterial({
    uniforms:{
        noddingAngle: noddingAngle
    }
});
let noddingArmadilloShaderFiles = [
    'glsl/nodding_armadillo.vs.glsl',
    'glsl/nodding_armadillo.fs.glsl'
];

new THREE.SourceLoader().load(armadilloShaderFiles, function (shaders) {
    armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
    armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];
});

new THREE.SourceLoader().load(noddingArmadilloShaderFiles, function (shaders) {
    noddingArmadilloMaterial.vertexShader = shaders['glsl/nodding_armadillo.vs.glsl'];
    noddingArmadilloMaterial.fragmentShader = shaders['glsl/nodding_armadillo.fs.glsl'];
});

// EYES
let leftEyeMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightPosition : lightPosition,
        eyePosition: leftEyePosition
    }
});
let rightEyeMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightPosition : lightPosition,
        eyePosition: rightEyePosition
    }
});
eyeShaderFiles = [
    'glsl/eye.vs.glsl',
    'glsl/eye.fs.glsl'
];
new THREE.SourceLoader().load(eyeShaderFiles, function (shaders) {
    leftEyeMaterial.vertexShader = shaders['glsl/eye.vs.glsl']
    leftEyeMaterial.fragmentShader = shaders['glsl/eye.fs.glsl']

    rightEyeMaterial.vertexShader = shaders['glsl/eye.vs.glsl']
    rightEyeMaterial.fragmentShader = shaders['glsl/eye.fs.glsl']
});


laserShaderFiles = [
    'glsl/laser.vs.glsl',
    'glsl/laser.fs.glsl'
];
new THREE.SourceLoader().load(laserShaderFiles, function (shaders) {
    leftLaserMaterial.vertexShader = shaders['glsl/laser.vs.glsl'],
        leftLaserMaterial.fragmentShader = shaders['glsl/laser.fs.glsl'],

        rightLaserMaterial.vertexShader = shaders['glsl/laser.vs.glsl'],
        rightLaserMaterial.fragmentShader = shaders['glsl/laser.fs.glsl']
});

//---------------------------
// (A) -- EYES SCENE OBJECTS
// WORK HERE FOR PART 1.A
//---------------------------
loadOBJ(Part.EYES, 'obj/armadillo.obj', armadilloMaterial, 1, 0, 0, 0, 0, 0, 0); // Armadillo

eyes = {};

// Lightbulb
eyes.lightbulbMaterial = new THREE.MeshBasicMaterial();
eyes.lightbulbMaterial.color = new THREE.Color(1, 1, 0);
eyes.lightbulbGeometry = new THREE.SphereGeometry(1, 32, 32);

eyes.lightbulb = new THREE.Mesh(eyes.lightbulbGeometry, eyes.lightbulbMaterial);
eyes.lightbulb.position.set(0, 2.43, -4.0);
eyes.lightbulb.scale.set(0.15, 0.15, 0.15);
scenes[Part.EYES].add(eyes.lightbulb);

// ADD YOUR OBJECTS HERE


loadOBJ(Part.EYES, 'obj/eye.obj', leftEyeMaterial, 1, 0, 0, 0, 0, 0, 0);
loadOBJ(Part.EYES, 'obj/eye.obj', rightEyeMaterial, 1, 0, 0, 0, 0, 0, 0);
//----------------------------
// (B) -- LASERS SCENE OBJECTS
// WORK HERE FOR PART 1.B
//---------------------------
loadOBJ(Part.LASERS, 'obj/armadillo.obj', armadilloMaterial, 1, 0, 0, 0, 0, 0, 0); // Armadillo

lasers = {};

// Lightulb
lasers.lightbulbMaterial = new THREE.MeshBasicMaterial();
lasers.lightbulbMaterial.color = new THREE.Color(1, 1, 0);
lasers.lightbulbGeometry = new THREE.SphereGeometry(1, 32, 32);

lasers.lightbulb = new THREE.Mesh(lasers.lightbulbGeometry, lasers.lightbulbMaterial);
lasers.lightbulb.position.set(0.11, 2.43, -2.73);
lasers.lightbulb.scale.set(0.15, 0.15, 0.15);
scenes[Part.LASERS].add(lasers.lightbulb);

// Laser geometry
let laserGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 16);
for (let i = 0; i < laserGeometry.vertices.length; ++i)
    laserGeometry.vertices[i].y += 1;

leftLaserMaterial =  new THREE.ShaderMaterial({
    uniforms: {
        lightPosition : lightPosition,
        laserPosition: leftEyePosition
    }
});
rightLaserMaterial =  new THREE.ShaderMaterial({
    uniforms: {
        lightPosition : lightPosition,
        laserPosition: rightEyePosition
    }
});


laserMesh = {};
laserMesh.leftEyeLaser = new THREE.Mesh(laserGeometry, leftLaserMaterial);
laserMesh.rightEyeLaser = new THREE.Mesh(laserGeometry, rightLaserMaterial);


scenes[Part.LASERS].add(laserMesh.leftEyeLaser);
scenes[Part.LASERS].add(laserMesh.rightEyeLaser);


// ADD YOUR OBJECTS HERE
loadOBJ(Part.LASERS, 'obj/eye.obj', leftEyeMaterial, 1, 0, 0, 0, 0, 0, 0);
loadOBJ(Part.LASERS, 'obj/eye.obj', rightEyeMaterial, 1, 0, 0, 0, 0, 0, 0);

//---------------------------
// (C) - DEFORM SCENE OBJECTS
// WORK HERE FOR PART 1.C
//---------------------------
loadOBJ(Part.DEFORM, 'obj/armadillo.obj', noddingArmadilloMaterial, 1, 0, 0, 0, 0, 0, 0); // Armadillo

// ADD YOUR OBJECTS HERE
// You won't need eye for part C


// LISTEN TO KEYBOARD
let keyboard = new THREEx.KeyboardState();

function checkKeyboard() {
    if (keyboard.pressed("1"))
        mode = Part.EYES;
    else if (keyboard.pressed("2"))
        mode = Part.LASERS;
    else if (keyboard.pressed("3"))
        mode = Part.DEFORM;

    if (mode == Part.EYES) {
        if (keyboard.pressed("W"))
            lightPosition.value.z -= 0.1;
        else if (keyboard.pressed("S"))
            lightPosition.value.z += 0.1;

        if (keyboard.pressed("A"))
            lightPosition.value.x -= 0.1;
        else if (keyboard.pressed("D"))
            lightPosition.value.x += 0.1;

        if (keyboard.pressed('Q'))
            lightPosition.value.y += 0.1;
        else if (keyboard.pressed('E'))
            lightPosition.value.y -= 0.1;

        lightPosition.value = eyes.lightbulb.position;
    }
    else if (mode == Part.LASERS) {
        if (keyboard.pressed("W"))
            lightPosition.value.z -= 0.1;
        else if (keyboard.pressed("S"))
            lightPosition.value.z += 0.1;

        if (keyboard.pressed("A"))
            lightPosition.value.x -= 0.1;
        else if (keyboard.pressed("D"))
            lightPosition.value.x += 0.1;

        if (keyboard.pressed('Q'))
            lightPosition.value.y += 0.1;
        else if (keyboard.pressed('E'))
            lightPosition.value.y -= 0.1;

        lightPosition.value = lasers.lightbulb.position;
    }
    else if (mode == Part.DEFORM) {
        if (keyboard.pressed("W"))
            noddingAngle.value += 0.01;
        else if (keyboard.pressed("S"))
            noddingAngle.value -= 0.01;

        if (noddingAngle.value > 0.5)
            noddingAngle.value = 0.5;
        if (noddingAngle.value < -0.3)
            noddingAngle.value = -0.3;
    }

    armadilloMaterial.needsUpdate = true;
    leftEyeMaterial.needsUpdate = true;
    rightEyeMaterial.needsUpdate = true;
    leftLaserMaterial.needsUpdate = true;
    rightLaserMaterial.needsUpdate = true;

    noddingArmadilloMaterial.needsUpdate = true;

}

// SETUP UPDATE CALL-BACK
function update() {
    checkKeyboard();
    requestAnimationFrame(update);
    renderer.render(scenes[mode], cameras[mode]);
}

update();
