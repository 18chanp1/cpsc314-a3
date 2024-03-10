/*
 * UBC CPSC 314
 * Assignment 3 Template
 */
import { setup, createScene, loadAndPlaceGLB, loadAndPlaceOBJ } from './js/setup.js';
import * as THREE from './js/three.module.js';
import { SourceLoader } from './js/SourceLoader.js';
import { THREEx } from './js/KeyboardState.js';

// Setup the renderer
// You should look into js/setup.js to see what exactly is done here.
const { renderer, canvas } = setup();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Uniforms - Pass these into the appropriate vertex and fragment shader files
const spherePosition = { type: 'v3', value: new THREE.Vector3(0.0, 0.0, 0.0) };
const tangentDirection = { type: 'v3', value: new THREE.Vector3(0.5, 0.0, 1.0) };

const ambientColor = { type: 'c', value: new THREE.Color(0.0, 0.0, 1.0) };
const diffuseColor = { type: 'c', value: new THREE.Color(0.0, 1.0, 1.0) };
const specularColor = { type: 'c', value: new THREE.Color(1.0, 1.0, 1.0) };
const lightColor = { type: 'c', value: new THREE.Color(1.0, 1.0, 1.0) };
const toonColor = { type: 'c', value: new THREE.Color(1.0, 0.8, 0.4) };
const toonColor2 = { type: 'c', value: new THREE.Color(0.8, 0.1, 0.35) };
const outlineColor = { type: 'c', value: new THREE.Color(0.0, 0.0, 0.0) };

const kAmbient = { type: "f", value: 0.3 };
const kDiffuse = { type: "f", value: 0.6 };
const kSpecular = { type: "f", value: 1.0 };
const shininess = { type: "f", value: 50.0 };
const ticks = { type: "f", value: 0.0 };

const sphereLight = new THREE.PointLight(0xffffff, 200);


// Shader materials
const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spherePosition: spherePosition
  }
});

const blinnPhongMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spherePosition: spherePosition,
    ambientColor: ambientColor,
    diffuseColor: diffuseColor,
    specularColor: specularColor,
    kAmbient: kAmbient,
    kDiffuse: kDiffuse,
    kSpecular: kSpecular,
    shininess: shininess
  }
});

const toonMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spherePosition: spherePosition,
    toonColor: toonColor,
    toonColor2: toonColor2,
    outlineColor: outlineColor
  }
});

const dotsMaterial = new THREE.ShaderMaterial({
  uniforms: {
    ticks: ticks
  }
});

const helmetAlbedoMap = new THREE.TextureLoader().load( 'gltf/Default_albedo.jpg' );
helmetAlbedoMap.colorSpace = THREE.SRGBColorSpace;
helmetAlbedoMap.flipY = false;
helmetAlbedoMap.wrapS = 1000;
helmetAlbedoMap.wrapT = 1000;

// TODO: implement helmetMetalRoughnessMap, helmetEmissiveMap, helmetNormalMap, helmetAOMap
// similarly to how helmetAlbedoMap is implemented

/* q1d */
const helmetMetalRoughnessMap = new THREE.TextureLoader().load( 'gltf/Default_metalRoughness.jpg' );
helmetMetalRoughnessMap.colorSpace = THREE.SRGBColorSpace
helmetMetalRoughnessMap.flipY = false;
helmetMetalRoughnessMap.wrapS = 1000;
helmetMetalRoughnessMap.wrapT = 1000;

const helmetEmissiveMap = new THREE.TextureLoader().load( 'gltf/Default_emissive.jpg' );
helmetEmissiveMap.colorSpace = THREE.SRGBColorSpace
helmetEmissiveMap.flipY = false;
helmetEmissiveMap.wrapS = 1000;
helmetEmissiveMap.wrapT = 1000;

const helmetNormalMap = new THREE.TextureLoader().load( 'gltf/Default_normal.jpg' );
helmetNormalMap.colorSpace = THREE.SRGBColorSpace
helmetNormalMap.flipY = false;
helmetNormalMap.wrapS = 1000;
helmetNormalMap.wrapT = 1000;

const helmetAOMap = new THREE.TextureLoader().load( 'gltf/Default_ao.jpg' );
helmetAOMap.colorSpace = THREE.SRGBColorSpace
helmetAOMap.flipY = false;
helmetAOMap.wrapS = 1000;
helmetAOMap.wrapT = 1000;

const helmetPBRMaterial = new THREE.MeshStandardMaterial({
  // TODO: pass texture maps to the material. Note that
  // both metalnessMap and roughnessMap should be set to the same
  // texture map
  "aoMap": helmetAOMap,
  "normalMap": helmetNormalMap,
  "emissiveMap": helmetEmissiveMap,
  "roughnessMap": helmetMetalRoughnessMap,
  "metalnessMap": helmetMetalRoughnessMap,
  "map": helmetAlbedoMap,
});
// TODO: set the material's emissive color and metalness

helmetPBRMaterial.emissive = new THREE.Color(0.0, 0.0, 255.0);
helmetPBRMaterial.metalness = 0.9;


// Load shaders
const shaderFiles = [
  'glsl/sphere.vs.glsl',
  'glsl/sphere.fs.glsl',
  'glsl/blinn_phong.vs.glsl',
  'glsl/blinn_phong.fs.glsl',
  'glsl/toon.vs.glsl',
  'glsl/toon.fs.glsl',
  'glsl/dots.vs.glsl',
  'glsl/dots.fs.glsl',
];

new SourceLoader().load(shaderFiles, function (shaders) {
  sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
  sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];

  blinnPhongMaterial.vertexShader = shaders['glsl/blinn_phong.vs.glsl'];
  blinnPhongMaterial.fragmentShader = shaders['glsl/blinn_phong.fs.glsl'];

  toonMaterial.vertexShader = shaders['glsl/toon.vs.glsl'];
  toonMaterial.fragmentShader = shaders['glsl/toon.fs.glsl'];

  dotsMaterial.vertexShader = shaders['glsl/dots.vs.glsl'];
  dotsMaterial.fragmentShader = shaders['glsl/dots.fs.glsl'];
});

// Define the shader modes
const shaders = {
  BLINNPHONG: { key: 0, material: blinnPhongMaterial },
  TOON: { key: 1, material: toonMaterial },
  DOTS: { key: 2, material: dotsMaterial },
  PBR: { key: 3, material: helmetPBRMaterial },
};

let mode = shaders.TOON.key; // Default

// Set up scenes
let scenes = [];
for (let shader of Object.values(shaders)) {
  // Create the scene
  const { scene, camera, worldFrame } = createScene(canvas, renderer);

  // Create the main sphere geometry (light source)
  // https://threejs.org/docs/#api/en/geometries/SphereGeometry
  const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(0.0, 1.5, 0.0);
  sphere.parent = worldFrame;
  scene.add(sphere);

  // Load both the armadillo and the helmet, for scene key 4.
  if(shader.material == helmetPBRMaterial){
    
    loadAndPlaceGLB('gltf/DamagedHelmet.glb', shaders.PBR.material, function(helmet) {
      helmet.position.set(0, 0, -10.0);
      helmet.scale.set(7, 7, 7);
      helmet.parent = worldFrame;
      scene.add(helmet);
    });

    loadAndPlaceOBJ('obj/armadillo.obj', shaders.BLINNPHONG.material, function (armadillo) {
      armadillo.position.set(0.0, 0.0, -30.0);
      armadillo.rotation.y = Math.PI;
      armadillo.scale.set(10, 10, 10);
      armadillo.parent = worldFrame;
      scene.add(armadillo);
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 3.0);
    scene.add(ambientLight);

    sphereLight.parent = worldFrame;
    scene.add(sphereLight);

  } else{
    // If there's no helmet, then only place the armadillo. i.e. key 1, 2, 3
    loadAndPlaceOBJ('obj/armadillo.obj', shader.material, function (armadillo) {
      armadillo.position.set(0.0, 0.0, -10.0);
      armadillo.rotation.y = Math.PI;
      armadillo.scale.set(10, 10, 10);
      armadillo.parent = worldFrame;
      scene.add(armadillo);
    });
  }

  scenes.push({ scene, camera });
}



// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {

  if (keyboard.pressed("1"))
    mode = shaders.BLINNPHONG.key;
  else if (keyboard.pressed("2"))
    mode = shaders.TOON.key;
  else if (keyboard.pressed("3"))
    mode = shaders.DOTS.key;
  else if (keyboard.pressed("4"))
    mode = shaders.PBR.key;

  if (keyboard.pressed("W"))
    spherePosition.value.z -= 0.3;
  else if (keyboard.pressed("S"))
    spherePosition.value.z += 0.3;

  if (keyboard.pressed("A"))
    spherePosition.value.x -= 0.3;
  else if (keyboard.pressed("D"))
    spherePosition.value.x += 0.3;

  if (keyboard.pressed("E"))
    spherePosition.value.y -= 0.3;
  else if (keyboard.pressed("Q"))
    spherePosition.value.y += 0.3;

  sphereLight.position.set(spherePosition.value.x, spherePosition.value.y, spherePosition.value.z);

  // The following tells three.js that some uniforms might have changed
  sphereMaterial.needsUpdate = true;
  blinnPhongMaterial.needsUpdate = true;
  helmetPBRMaterial.needsUpdate = true;
  toonMaterial.needsUpdate = true;
  dotsMaterial.needsUpdate = true;
}

// clock = THREE.Clock;

// Setup update callback
function update() {
  checkKeyboard();
  ticks.value += 1 / 100.0;

  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  const { scene, camera } = scenes[mode];
  renderer.render(scene, camera);
}

// Start the animation loop.
update();
