import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x393E46,
  side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
groundMesh.position.y = 1.04;
scene.add(groundMesh);

const wallGeometry = new THREE.PlaneGeometry(10,  10);
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x393E46,
  side: THREE.DoubleSide,
  emissive: true,
});
const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
wallMesh.position.z = -1.5
scene.add(wallMesh);

const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.5, 1000);
const cameraTarget = new THREE.Vector3(0.03, 1.2, -1);
const originalCameraPosition = new THREE.Vector3(0.8, 1.75, -1.5);
camera.position.set(0.8, 1.75, -1.5);
camera.lookAt(cameraTarget);

const spotlightTarget = new THREE.Object3D();
spotlightTarget.position.copy(cameraTarget); // Set its position to cameraTarget
scene.add(spotlightTarget);

// Add Directional Light
const directionalLight = new THREE.SpotLight(0xffffff, 50); // Color and intensity
directionalLight.position.set(2, 2, 2); // Position the light in the scene
directionalLight.castShadow = true; // Enable shadows
directionalLight.shadow.bias = -0.0005;
directionalLight.angle = Math.PI / 50; // Spotlight cone angle (30 degrees)
directionalLight.penumbra = 0.5; // Makes the spotlight's edges softer
directionalLight.target = spotlightTarget;

// Configure shadow properties
directionalLight.shadow.mapSize.width = 2048; // Shadow map resolution (width)
directionalLight.shadow.mapSize.height = 2048; // Shadow map resolution (height)
directionalLight.shadow.camera.near = 0.5; // Near clipping plane
directionalLight.shadow.camera.far = 50; // Far clipping plane

// Add the directional light to the scene
scene.add(directionalLight);

const loader = new GLTFLoader().setPath('./Model/');
loader.load('scene.gltf', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  mesh.position.set(0, 1.05, -1);
  scene.add(mesh);

  //document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});

// Add a simulated screen with text
const screenGeometry = new THREE.PlaneGeometry(0.319, 0.215);
// Load the texture for the screen
const textureLoader = new THREE.TextureLoader();
const screenTexture = textureLoader.load('../Images/background.jpg'); // Replace with the actual path to your image

// Create the screen material with the texture
const screenMaterial = new THREE.MeshStandardMaterial({
  map: screenTexture,
});
const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
screenMesh.rotation.x = THREE.MathUtils.degToRad(-12.15);
screenMesh.position.copy(cameraTarget);
screenMesh.position.z += -0.1485
screenMesh.position.y += -0.02
screenMesh.position.x += -0.03
scene.add(screenMesh);

// Add text to the screen
const textMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: new THREE.Color(0xffffff),
  emissiveIntensity: 0.2
});
const loaderFont = new FontLoader();
loaderFont.load('./SegoeUI.json', (font) => {
  const textGeometry = new TextGeometry('Guillaume Currivand', {
    font: font,
    size: 0.01,
    height: 0.0001,
  });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.x = -0.06
  textMesh.position.y = -0.02
  screenMesh.add(textMesh);
});

// Load the texture for the circular image
const circularImageTexture = textureLoader.load('../Images/picture.png'); // Replace './mycircularimage.jpg' with the path to your image

// Create a circular geometry
const circularGeometry = new THREE.CircleGeometry(0.04, 64); // Radius of 0.05 and 64 segments for smoothness

// Create the material for the circular image
const circularMaterial = new THREE.MeshStandardMaterial({
  map: circularImageTexture,
  side: THREE.DoubleSide
});

// Create the circular mesh
const circularMesh = new THREE.Mesh(circularGeometry, circularMaterial);
circularMesh.position.set(0.005, 0.04, 0.01); // Adjust position relative to the screenMesh
screenMesh.add(circularMesh);

// Add a grey border for the white rectangle
const greyBorderGeometry = new THREE.PlaneGeometry(0.101, 0.011);
const greyBorderMaterial = new THREE.MeshStandardMaterial({
  color: 0x808080, // Grey color
  side: THREE.DoubleSide,
  emissive: new THREE.Color(0x808080), // Optional emissive effect
  emissiveIntensity: 0.2,
});

const greyBorderMesh = new THREE.Mesh(greyBorderGeometry, greyBorderMaterial);
greyBorderMesh.position.set(0.001, -0.035, 0.0009);
screenMesh.add(greyBorderMesh);

// Add a white rectangle with text
const whiteRectGeometry = new THREE.PlaneGeometry(0.1, 0.01); // Adjust size as needed
const whiteRectMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff, // White color
  side: THREE.DoubleSide,
  emissive: new THREE.Color(0xffffff), // Optional emissive effect
  emissiveIntensity: 0.3,
});

const whiteRectMesh = new THREE.Mesh(whiteRectGeometry, whiteRectMaterial);
whiteRectMesh.position.set(0.001, -0.035, 0.001); 
screenMesh.add(whiteRectMesh);

let whiteRectTextMesh;
// Add text to the white rectangle
loaderFont.load('./SegoeUI.json', (font) => {
  const whiteRectTextGeometry = new TextGeometry('Password', {
    font: font,
    size: 0.005,
    height: 0.0001,
  });

  const whiteRectTextMaterial = new THREE.MeshStandardMaterial({
    color: 0x9c9c9c, // Black text color
    emissive: new THREE.Color(0x9c9c9c), // Optional emissive for text
    emissiveIntensity: 1,
  });

  whiteRectTextMesh = new THREE.Mesh(whiteRectTextGeometry, whiteRectTextMaterial);
  whiteRectTextMesh.position.set(-0.048, -0.003, 0.0); // Adjust position relative to the white rectangle
  whiteRectMesh.add(whiteRectTextMesh);
});

// Define an array of letters for each camera position
const letters = ['','B', 'Bi', 'Bien', 'Bienv', 'Bienven', 'Bienvenu', 'Bienvenue', 'Bienvenue !'];

let dynamicTextMesh; // Declare the text mesh globally
let loadedFont; // Declare a global variable to store the loaded font

// Load the font once and initialize the dynamic text mesh
loaderFont.load('./SegoeUI.json', (font) => {
  loadedFont = font; // Store the font globally for reuse
  
  // Create initial text geometry
  const textGeometry = new TextGeometry(letters[currentCameraIndex], {
    font: loadedFont,
    size: 0.005,
    height: 0.0001,
  });

  const textMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080, // Black text color
    emissive: new THREE.Color(0x808080),
    emissiveIntensity: 1,
  });

  // Create the text mesh
  dynamicTextMesh = new THREE.Mesh(textGeometry, textMaterial);
  dynamicTextMesh.position.set(-0.048, -0.003, 0.0); // Adjust position relative to the white rectangle
  whiteRectMesh.add(dynamicTextMesh);
});

// Function to update the text dynamically
function updateLetter(index) {
  if (dynamicTextMesh && loadedFont) {
    // Dispose of the old geometry
    dynamicTextMesh.geometry.dispose();

    dynamicTextMesh.geometry = new TextGeometry(index > 8 ? letters[8] : letters[index], {
      font: loadedFont, // Use the loaded font
      size: 0.005,
      height: 0.0001,
    });
  } else {
    console.warn("Font is not loaded yet or dynamicTextMesh is not initialized.");
  }
}

 // Add a blinking cursor
 const cursorGeometry = new THREE.PlaneGeometry(0.0005, 0.008); // Narrow rectangle for the cursor
 const cursorMaterial = new THREE.MeshStandardMaterial({
   color: 0x000000, // Grey color for the cursor
   emissive: new THREE.Color(0x000000), // Optional emissive effect
   emissiveIntensity: 1,
 });

 const cursorMesh = new THREE.Mesh(cursorGeometry, cursorMaterial);
 cursorMesh.position.set(-0.048, 0.0, 0.0001); // Position cursor to the right of the text
 whiteRectMesh.add(cursorMesh);

 let blinkTime = 0; // Time accumulator for blinking
 const blinkInterval = 10; // Blinking interval in seconds (1 second)
 
 function updateCursorBlink(deltaTime) {
   blinkTime += deltaTime;
   // Toggle visibility based on the blink interval
   if (blinkTime >= blinkInterval) {
     cursorMesh.visible = !cursorMesh.visible; // Toggle visibility
     blinkTime = 0; // Reset the time accumulator
   }
 }
 
 function animateCursor() {
   const deltaTime = 0.5; // Convert time to seconds
   updateCursorBlink(deltaTime);
 }


// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(cameraTarget);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;

// Set angle limits for OrbitControls
controls.minPolarAngle = Math.PI / 6; // Minimum vertical angle (30 degrees)
controls.maxPolarAngle = Math.PI / 2; // Maximum vertical angle (90 degrees)
controls.minAzimuthAngle = -Math.PI / 4; // Minimum horizontal angle (-45 degrees)
controls.maxAzimuthAngle = Math.PI / 4;  // Maximum horizontal angle (45 degrees)

// Add an event listener to reset the camera after interaction
let lastDragPosition = camera.position.clone();
controls.addEventListener('start', () => {
  lastDragPosition.copy(camera.position); // Save the position when dragging starts
});

controls.addEventListener('end', () => {
  smoothMoveCamera(lastDragPosition, 1000); // Move back to the starting position of the drag
});

let currentCameraIndex = 0;
let allowScroll = true;

renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0'; // Stick to the top
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '-1';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.dataset.forcecamera = false

// Add two intermediate control points to shape the curve
const controlPoint1 = new THREE.Vector3(-0.5, 1.3, 0.5);
const controlPoint2 = new THREE.Vector3(0.3, 1.2, -0.2);

// Create a cubic bezier curve
const bezierCurve = new THREE.CubicBezierCurve3(
  originalCameraPosition,
  controlPoint1,
  controlPoint2,
  cameraTarget
);

// Generate evenly spaced points along the curve
const cameraPositions = [];
const steps = 10; // Number of steps (segments)
for (let i = 0; i <= steps; i++) {
  const t = i / steps; // Normalized parameter (0 to 1)
  const position = bezierCurve.getPoint(t); // Get point on the curve at t
  cameraPositions.push(position);
}

// Update the `handleScroll` function
function handleScroll(event) {
  const forceCameraElement = document.querySelector('[data-forcecamera]');
  if(forceCameraElement.dataset.forcecamera == 'true' && window.scrollY == 0 && renderer.domElement.style.opacity == 0 ){
    allowScroll = true
    currentCameraIndex = 8;
    forceCameraElement.dataset.forcecamera = false
    return
  }

  if (!allowScroll) return; // Exit if scrolling is disabled

  const direction = event.deltaY > 0 ? 1 : -1; // Determine scroll direction
  // Update the current index based on scroll direction
  const newIndex = currentCameraIndex + direction;

  if (newIndex >= 0 && newIndex < cameraPositions.length) {
    updateLetter(newIndex);
    if (currentCameraIndex === 7 && newIndex === 8) {
      renderer.domElement.style.transition = 'opacity 0.5s ease'; // Smooth transition
      renderer.domElement.style.opacity = '0';
      renderer.domElement.style.zIndex = '-10000'
      allowScroll = false;
    } else if (currentCameraIndex < 8 && newIndex < currentCameraIndex) {
      renderer.domElement.style.transition = 'opacity 0.5s ease';
      renderer.domElement.style.opacity = '1';
      renderer.domElement.style.zIndex = '1'
      allowScroll = true;
    }

    if (currentCameraIndex > 0) {
      whiteRectTextMesh.visible = false;
    } else {
      whiteRectTextMesh.visible = true;
    }

    const bboxDynamicText = new THREE.Box3().setFromObject(dynamicTextMesh);
    const cursorXPosition = bboxDynamicText.max.x;
    cursorMesh.position.x = cursorXPosition == '-Infinity' ? -0.048 : cursorXPosition || 0;

    // Update camera position
    currentCameraIndex = newIndex;
    const targetPosition = cameraPositions[currentCameraIndex];

    // Smoothly move the camera to the new position
    smoothMoveCamera(targetPosition, 250); // Adjust duration as needed
  }
}

// Attach the event listener for the scroll event
window.addEventListener('wheel', handleScroll);



// Updated smoothMoveCamera function for straight-line movement
function smoothMoveCamera(targetPosition, duration) {
  const startPosition = camera.position.clone();
  const startTime = performance.now();

  controls.enabled = false;

  function update() {
    const elapsedTime = performance.now() - startTime;
    const t = Math.min(elapsedTime / duration, 1);

    const intermediatePosition = new THREE.Vector3().lerpVectors(startPosition, targetPosition, t);
    camera.position.copy(intermediatePosition);
    camera.lookAt(cameraTarget);

    if (t < 1) {
      requestAnimationFrame(update);
    } else {
      controls.enabled = true;
    }
  }

  update();
}

function animate() {
  if(renderer.domElement.style.opacity > '0'){
    allowScroll = true;
  }
  // Keep the camera looking at the target point
  camera.lookAt(cameraTarget);

  // Update OrbitControls
  controls.update();

  animateCursor();

  // Render the scene
  renderer.render(scene, camera);

  // Request the next animation frame
  requestAnimationFrame(animate);
}

animate();

