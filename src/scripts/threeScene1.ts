import * as THREE from 'three';
import { Board } from './Checkers/Board';
import { Pieces } from './Checkers/Pieces';
import { Camera } from './Checkers/Camera';

let renderer: THREE.WebGLRenderer | null = null;
let camera: Camera | null = null;
let scene: THREE.Scene | null = null;
let pieces: Pieces | null = null;

const boardSize = 8;
const squareSize = 1;
let selectedPiece: { row: number, col: number } | null = null;
let cameraHeight = 10; // Variable to adjust camera height

export function initScene1() {
  if (typeof window === 'undefined') return;

  if (renderer) {
    // Clean up existing renderer if already initialized
    const existingCanvas = document.getElementById('three-scene')?.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }
  }

  scene = new THREE.Scene();
  camera = new Camera(boardSize, cameraHeight);
  renderer = new THREE.WebGLRenderer();

  const container = document.getElementById('three-scene');
  if (container) {
    const size = Math.min(container.clientWidth, container.clientHeight); // Ensure it's a square
    renderer.setSize(size, size);
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
    container.appendChild(renderer.domElement);
  }

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7).normalize();
  scene.add(light);

  new Board(scene, boardSize, squareSize);
  pieces = new Pieces(scene, boardSize, squareSize);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera!.getCamera());
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  // Add click event listener for piece movement
  window.addEventListener('click', onWindowClick);
}

function onWindowResize() {
  if (!renderer || !camera) return;

  const container = document.getElementById('three-scene');
  if (container) {
    const size = Math.min(container.clientWidth, container.clientHeight);
    camera.resize(size);
    renderer.setSize(size, size);
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
  }
}

function onWindowClick(event: MouseEvent) {
  if (!camera || !renderer || !scene || !pieces) return;

  const container = document.getElementById('three-scene');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera.getCamera());
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const intersect = intersects[0];
    const point = intersect.point;
    const col = Math.floor(point.x + 0.5);
    const row = Math.floor(point.z + 0.5);

    if (selectedPiece) {
      // Move piece to new position
      pieces.movePiece(selectedPiece.row, selectedPiece.col, row, col);
      selectedPiece = null;
    } else if (pieces.getPieces()[row][col]) {
      // Select piece
      selectedPiece = { row, col };
    }
  }
}
