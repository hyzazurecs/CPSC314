/*
 * UBC CPSC 314, Vsep2017
 * Assignment 2 Template
 */
// Modes.. one per part of question 1
let Part = {
    DEFORM: 0,
    COUNT: 1
};
let mode = Part.DEFORM; // current mode

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

let rotationAngle = {
    type :'f',
    value: 0.0
};

let laserTrans = {
    type:'f',
    value : 0.0
};

let armadilloPosition = {
    type: 'v3',
    value: new THREE.Vector3(0,0,0)
};

let noddingArmadilloMaterial = new THREE.ShaderMaterial({
    uniforms:{
        noddingAngle: noddingAngle,
        rotationAngle: rotationAngle,
        armadilloPosition: armadilloPosition
    }
});
let noddingArmadilloShaderFiles = [
    'glsl/nodding_armadillo.vs.glsl',
    'glsl/nodding_armadillo.fs.glsl'
];



new THREE.SourceLoader().load(noddingArmadilloShaderFiles, function (shaders) {
    noddingArmadilloMaterial.vertexShader = shaders['glsl/nodding_armadillo.vs.glsl'];
    noddingArmadilloMaterial.fragmentShader = shaders['glsl/nodding_armadillo.fs.glsl'];
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



let lightbulbMaterial = new THREE.MeshBasicMaterial();
lightbulbMaterial.color = new THREE.Color(1,1,0);
let lightbulbGeometry = new THREE.SphereGeometry(1,32,32);

let lightbulb = new THREE.Mesh(lightbulbGeometry, lightbulbMaterial);

lightbulb.scale.set(0.1,0.1,0.1);
lightbulb.position.set(-1,2,0);
scenes[Part.DEFORM].add(lightbulb);

// Laser geometry
let laserGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 16);
for (let i = 0; i < laserGeometry.vertices.length; ++i)
    laserGeometry.vertices[i].y += 1;

leftLaserMaterial =  new THREE.ShaderMaterial({
    uniforms: {
        lightPosition : lightPosition,
        laserPosition: leftEyePosition,
        rotationAngle: rotationAngle,
        armadilloPosition: armadilloPosition,
        laserTrans: laserTrans
    }
});
rightLaserMaterial =  new THREE.ShaderMaterial({
    uniforms: {
        lightPosition : lightPosition,
        laserPosition: rightEyePosition,
        rotationAngle: rotationAngle,
        armadilloPosition: armadilloPosition,
        laserTrans: laserTrans
    }
});


laserMesh = {};
laserMesh.leftEyeLaser = new THREE.Mesh(laserGeometry, leftLaserMaterial);
laserMesh.rightEyeLaser = new THREE.Mesh(laserGeometry, rightLaserMaterial);

leftLaserMaterial.transparent = true;
rightLaserMaterial.transparent = true;


scenes[Part.DEFORM].add(laserMesh.leftEyeLaser);
scenes[Part.DEFORM].add(laserMesh.rightEyeLaser);


//---------------------------
loadOBJ(Part.DEFORM, 'obj/armadillo.obj', noddingArmadilloMaterial, 1, 0, 0, 0, 0, 0, 0); // Armadillo



// LISTEN TO KEYBOARD
let keyboard = new THREEx.KeyboardState();

function checkKeyboard() {

    if (mode == Part.DEFORM) {
        if (keyboard.pressed("W"))
        {
            noddingAngle.value += 0.01;
            armadilloPosition.value.z -= 0.01 * Math.cos(-rotationAngle.value);
            armadilloPosition.value.x -= 0.01 * Math.sin(-rotationAngle.value);

            leftEyePosition.value.z -= 0.01 * Math.cos(-rotationAngle.value);
            leftEyePosition.value.x -= 0.01 * Math.sin(-rotationAngle.value);

            rightEyePosition.value.z -= 0.01 * Math.cos(-rotationAngle.value);
            rightEyePosition.value.x -= 0.01 * Math.sin(-rotationAngle.value);

        }
        else if (keyboard.pressed("S"))
        {
            noddingAngle.value -= 0.01;
            armadilloPosition.value.z += 0.01 * Math.cos(-rotationAngle.value);
            armadilloPosition.value.x += 0.01 * Math.sin(-rotationAngle.value);


            leftEyePosition.value.z += 0.01 * Math.cos(-rotationAngle.value);
            leftEyePosition.value.x += 0.01 * Math.sin(-rotationAngle.value);

            rightEyePosition.value.z += 0.01 * Math.cos(-rotationAngle.value);
            rightEyePosition.value.x += 0.01 * Math.sin(-rotationAngle.value);
        }

        if (keyboard.pressed("A"))
            rotationAngle.value -= 0.004;
        else if (keyboard.pressed("D"))
            rotationAngle.value += 0.004;

        if (keyboard.pressed(" ")){
            laserTrans.value = 1.0;
        }

    }

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

setInterval(function () {
    lightPosition.value.x = -5 + Math.random() * 10;
    lightPosition.value.y = Math.random() * 5;
    lightPosition.value.z = -3 - Math.random() * 2;

    lightbulb.position.set(lightPosition.value.x,lightPosition.value.y,lightPosition.value.z);
},1000);

setInterval(function () {
    if (laserTrans.value >= 0.1)
        laserTrans.value -= 0.1;
    else
        laserTrans.value = 0.0;
},30);

update();
