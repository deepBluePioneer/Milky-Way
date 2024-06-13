import * as THREE from 'three';

let renderer: THREE.WebGLRenderer | null = null;
let camera: THREE.PerspectiveCamera | null = null;

export function initScene3() {
  if (typeof window === 'undefined') return;

  if (renderer) {
    // Clean up existing renderer if already initialized
    const existingCanvas = document.getElementById('three-scene')?.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }
  }

  const scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Initial aspect ratio is 1
  renderer = new THREE.WebGLRenderer();

  const container = document.getElementById('three-scene');
  if (container) {
    const size = Math.min(container.clientWidth, container.clientHeight); // Ensure it's a square
    renderer.setSize(size, size);
    camera.aspect = 1; // Maintain 1:1 aspect ratio
    camera.updateProjectionMatrix();
    container.appendChild(renderer.domElement);
  }

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);
  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', onWindowResize);

  function onWindowResize() {
    if (container && camera && renderer) {
      const size = Math.min(container.clientWidth, container.clientHeight);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(size, size);
    }
  }
}
