import { IfcLoader } from '../lib/IfcLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three'

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa9a9a9);

//Renderer
const threeCanvas = document.getElementById("threeCanvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: threeCanvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;
camera.position.y = 8;
camera.position.x = 8;
// camera.up = new Vector3(0, 0, 1);
camera.lookAt(new THREE.Vector3(0, 0, 0));

//Controls
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor *= 2;

//Axes and grid
function createAxes() {
  const axes = new THREE.AxesHelper();
  axes.material.depthTest = false;
  axes.renderOrder = 2; // after the grid
  return axes;
}
scene.add(createAxes());
const grid = new THREE.GridHelper(100, 100);
grid.material.depthTest = true;
grid.renderOrder = 1;
// grid.rotation.x = Math.PI / 2;
scene.add(grid);

//Lights
const light1 = new THREE.DirectionalLight(0xffeeff, 0.8);
light1.position.set(1, 1, 1);
scene.add(light1);
const light2 = new THREE.DirectionalLight(0xffffff, 0.8);
light2.position.set(-1, 0.5, -1);
scene.add(light2);
const ambientLight = new THREE.AmbientLight(0xffffee, 0.25);
scene.add(ambientLight);

//Window resize support
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})

//Animation
function AnimationLoop() {
  requestAnimationFrame(AnimationLoop);
  controls.update();
  renderer.render(scene, camera);
}

AnimationLoop();

//Setup IFC Loader
(function readIfcFile() {
  const input = document.querySelector('input[type="file"]');
  if (!input) return;
  input.addEventListener(
    'change',
    (changed) => {
      var ifcURL = URL.createObjectURL(changed.target.files[0]);
      const ifcLoader = new IfcLoader();
      ifcLoader.load(ifcURL, (geometry) => scene.add(geometry));
    },
    false
  );
})();