import * as THREE from 'three';
import { GameBoard } from './Checkers/GameBoard';
import { Camera } from './Checkers/Camera';
import { PieceSelector } from './Checkers/PieceSelector';
import { PieceMover } from './Checkers/PieceMover';

let renderer: THREE.WebGLRenderer | null = null;
let camera: Camera | null = null;
let scene: THREE.Scene | null = null;
let board: GameBoard | null = null;
let pieceSelector: PieceSelector | null = null;
let pieceMover: PieceMover | null = null;

const boardSize = 8;
const squareSize = 1;
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

  board = new GameBoard(scene, boardSize, squareSize);

  pieceSelector = new PieceSelector(scene, camera.getCamera(), renderer, board, squareSize);
  pieceMover = new PieceMover(scene, camera.getCamera(), renderer, board, pieceSelector);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera!.getCamera());
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', onWindowResize);
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
