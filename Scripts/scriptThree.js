import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const canvas = document.getElementById('three-canvas');
const topLeftElement = document.querySelector(".top-left");
const scrollDownElement = document.querySelector(".scroll-down");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // Changed from SRGBColorSpace to ensure accurate color reproduction
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '1';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x393E46, side: THREE.DoubleSide });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
groundMesh.position.y = 1.04;
scene.add(groundMesh);

const wallGeometry = new THREE.PlaneGeometry(10, 10);
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x393E46, side: THREE.DoubleSide, emissive: true });
const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
wallMesh.receiveShadow = false;
wallMesh.position.z = -1.5;
scene.add(wallMesh);

const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.5, 1000);
const cameraTarget = new THREE.Vector3(0.01, 1.2, -1);
const originalCameraPosition = new THREE.Vector3(0.8, 1.75, -1.5);
camera.position.set(0.8, 1.75, -1.5);
camera.lookAt(cameraTarget);

const spotlightTarget = new THREE.Object3D();
spotlightTarget.position.copy(cameraTarget);
scene.add(spotlightTarget);

const directionalLight = new THREE.SpotLight(0xffffff, 200);
directionalLight.position.set(2, 2, 2);
directionalLight.castShadow = true;
directionalLight.shadow.bias = -0.0005;
directionalLight.angle = Math.PI / 50;
directionalLight.penumbra = 0.5;
directionalLight.target = spotlightTarget;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

const loader = new GLTFLoader().setPath('./Model/');
loader.load('scene.gltf', (gltf) => {
  const mesh = gltf.scene;
  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  mesh.position.set(0, 1.05, -1);
  scene.add(mesh);
});

const screenGeometry = new THREE.PlaneGeometry(0.319, 0.215);
const textureLoader = new THREE.TextureLoader();
const screenTexture = textureLoader.load('../Images/background.jpg', function(texture) {
  // Removed texture.encoding setting to preserve original image colors
});
const screenMaterial = new THREE.MeshBasicMaterial({ 
  map: screenTexture,
  toneMapped: false // Ensure no tone mapping is applied
});
const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
screenMesh.rotation.x = THREE.MathUtils.degToRad(-12.15);
screenMesh.position.copy(cameraTarget);
screenMesh.position.z += -0.1485;
screenMesh.position.y += -0.02;
screenMesh.position.x += -0.02;
scene.add(screenMesh);

const circularImageTexture = textureLoader.load('../Images/picture.png', function(texture) {
  // Removed texture.encoding setting to preserve original image colors
});
const circularGeometry = new THREE.CircleGeometry(0.04, 32);
const circularMaterial = new THREE.MeshBasicMaterial({ 
  map: circularImageTexture,
  toneMapped: false // Ensure no tone mapping is applied
});
const circularMesh = new THREE.Mesh(circularGeometry, circularMaterial);
circularMesh.position.set(0.005, 0.04, 0.001);
screenMesh.add(circularMesh);

const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: new THREE.Color(0xffffff), emissiveIntensity: 1 });
const loaderFont = new FontLoader();
loaderFont.load('./font.json', (font) => {
  const textGeometry = new TextGeometry('Guillaume Currivand', { font: font, size: 0.01, height: 0.0001 });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.x = -0.06;
  textMesh.position.y = -0.02;
  screenMesh.add(textMesh);
});

const greyBorderGeometry = new THREE.PlaneGeometry(0.101, 0.011);
const greyBorderMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, side: THREE.DoubleSide, emissive: new THREE.Color(0x808080), emissiveIntensity: 1 });
const greyBorderMesh = new THREE.Mesh(greyBorderGeometry, greyBorderMaterial);
greyBorderMesh.position.set(0.001, -0.035, 0.0009);
screenMesh.add(greyBorderMesh);

const whiteRectGeometry = new THREE.PlaneGeometry(0.1, 0.01);
const whiteRectMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, emissive: new THREE.Color(0xffffff), emissiveIntensity: 1 });
const whiteRectMesh = new THREE.Mesh(whiteRectGeometry, whiteRectMaterial);
whiteRectMesh.position.set(0.001, -0.035, 0.001);
screenMesh.add(whiteRectMesh);

let passwordTextMesh;
loaderFont.load('./font.json', (font) => {
  const whiteRectTextGeometry = new TextGeometry('Password', { font: font, size: 0.005, height: 0.0001 });
  const whiteRectTextMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
  passwordTextMesh = new THREE.Mesh(whiteRectTextGeometry, whiteRectTextMaterial);
  passwordTextMesh.position.set(-0.048, -0.003, 0.0);
  whiteRectMesh.add(passwordTextMesh);
});

const letters = ['', 'B', 'Bi', 'Bien', 'Bienv', 'Bienven', 'Bienvenu', 'Bienvenue', 'Bienvenue !'];

let dynamicTextMesh;
let loadedFont;

loaderFont.load('./font.json', (font) => {
  loadedFont = font;
  const textGeometry = new TextGeometry(letters[0], { font: loadedFont, size: 0.005, height: 0.0001 });
  const textMaterial = new THREE.MeshStandardMaterial({ color: 0x555555});
  dynamicTextMesh = new THREE.Mesh(textGeometry, textMaterial);
  dynamicTextMesh.position.set(-0.048, -0.003, 0.0);
  whiteRectMesh.add(dynamicTextMesh);
});

function updateLetter(index) {
  if (dynamicTextMesh && loadedFont) {
    dynamicTextMesh.geometry.dispose();
    dynamicTextMesh.geometry = new TextGeometry(index > 8 ? letters[8] : letters[index], { font: loadedFont, size: 0.005, height: 0.0001 });
  }
}

const cursorGeometry = new THREE.PlaneGeometry(0.0005, 0.008);
const cursorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: new THREE.Color(0x000000), emissiveIntensity: 1 });
const cursorMesh = new THREE.Mesh(cursorGeometry, cursorMaterial);
cursorMesh.position.set(-0.048, 0.0, 0.0001);
whiteRectMesh.add(cursorMesh);

let blinkTime = 0;
const blinkInterval = 10;

function updateCursorBlink(deltaTime) {
  blinkTime += deltaTime;
  if (blinkTime >= blinkInterval) {
    cursorMesh.visible = !cursorMesh.visible;
    blinkTime = 0;
  }
}

function animateCursor() {
  const deltaTime = 0.5;
  updateCursorBlink(deltaTime);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(cameraTarget);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.minPolarAngle = Math.PI / 6;
controls.maxPolarAngle = Math.PI / 2;
controls.minAzimuthAngle = -Math.PI / 4;
controls.maxAzimuthAngle = Math.PI / 4;

let lastDragPosition = camera.position.clone();
controls.addEventListener('start', () => {
  lastDragPosition.copy(camera.position);
});

controls.addEventListener('end', () => {
  smoothMoveCamera(lastDragPosition, 1000);
});

let currentCameraIndex = 0;
let allowScroll = true;
const controlPoint1 = new THREE.Vector3(-0.5, 1.3, 0.5);
const controlPoint2 = new THREE.Vector3(0.3, 1.2, -0.2);
const bezierCurve = new THREE.CubicBezierCurve3(originalCameraPosition, controlPoint1, controlPoint2, cameraTarget);

const cameraPositions = [];
const steps = 10;
for (let i = 0; i <= steps; i++) {
  const t = i / steps;
  const position = bezierCurve.getPoint(t);
  cameraPositions.push(position);
}

function handleScroll(event) {
  if (!allowScroll) return;
  const direction = event.deltaY > 0 ? 1 : -1;
  const newIndex = currentCameraIndex + direction;

  if (newIndex >= 0 && newIndex < cameraPositions.length) {
    updateLetter(newIndex);
    if (currentCameraIndex === 7 && newIndex === 8) {
      renderer.domElement.style.transition = 'opacity 0.5s ease';
      renderer.domElement.style.opacity = '0';
      renderer.domElement.addEventListener('transitionend', function handleTransitionEnd() {
        renderer.domElement.style.zIndex = '-10';
        scrollDownElement.style.zIndex = '-10';
        topLeftElement.style.zIndex = '-10';
        allowScroll = false;
        renderer.domElement.removeEventListener('transitionend', handleTransitionEnd);
      });
    }
    if (currentCameraIndex > 0) {
      passwordTextMesh.visible = false;
    } else {
      passwordTextMesh.visible = true;
    }

    const bboxDynamicText = new THREE.Box3().setFromObject(dynamicTextMesh);
    const cursorXPosition = bboxDynamicText.max.x;
    cursorMesh.position.x = cursorXPosition == '-Infinity' ? -0.048 : cursorXPosition +0.01 || 0;

    currentCameraIndex = newIndex;
    const targetPosition = cameraPositions[currentCameraIndex];
    smoothMoveCamera(targetPosition, 250);
  }
}

window.addEventListener('wheel', handleScroll);

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
  if (renderer.domElement.style.opacity > '0') {
    allowScroll = true;
  }
  camera.lookAt(cameraTarget);
  controls.update();
  animateCursor();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();