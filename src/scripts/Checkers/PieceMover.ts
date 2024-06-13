import * as THREE from 'three';
import { GameBoard } from './GameBoard';
import { PieceSelector } from './PieceSelector';

export class PieceMover {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private board: GameBoard;
  private pieceSelector: PieceSelector;
  private highlightedSpot: THREE.Mesh | null = null;

  constructor(scene: THREE.Scene, camera: THREE.OrthographicCamera, renderer: THREE.WebGLRenderer, board: GameBoard, pieceSelector: PieceSelector) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.board = board;
    this.pieceSelector = pieceSelector;

    renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    console.log("PieceMover initialized and event listener attached.");
  }

  private onMouseDown(event: MouseEvent) {
    if (event.button !== 0) return; // Left mouse button only

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);


    if (intersects.length > 0) {
      const intersect = intersects[0];

      const selectedPiece = this.pieceSelector.getSelectedPiece();

      if (selectedPiece && intersect.object.userData.highlight) {
        const { row, col } = intersect.object.userData;
        if (this.isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
          this.board.movePiece(selectedPiece.row, selectedPiece.col, row, col, selectedPiece.mesh);
          this.pieceSelector.clearSelection();
          this.clearHighlight();
        }
      }
    }
  }

  private onMouseMove(event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      if (intersect.object.userData.highlight) {
        const { row, col } = intersect.object.userData;
        if (this.highlightedSpot !== intersect.object) {
          if (this.highlightedSpot) {
            (this.highlightedSpot.material as THREE.MeshLambertMaterial).color.set(0x00ff00);
          }
          this.highlightedSpot = intersect.object as THREE.Mesh;
          (this.highlightedSpot.material as THREE.MeshLambertMaterial).color.set(0xffff00); // Highlight color
        }
      } else {
        this.clearHighlight();
      }
    } else {
      this.clearHighlight();
    }
  }

  private clearHighlight() {
    if (this.highlightedSpot) {
      (this.highlightedSpot.material as THREE.MeshLambertMaterial).color.set(0x00ff00); // Reset color
      this.highlightedSpot = null;
    }
  }

  private isValidMove(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    console.log(`Checking if move from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol}) is valid.`);
    // Implement checkers move logic here
    const piece = this.board.getPiece(fromRow, fromCol);
    if (!piece) return false;

    const validDirections = piece === 'b' ? [[1, -1], [1, 1]] : [[-1, -1], [-1, 1]];
    return validDirections.some(([dRow, dCol]) => fromRow + dRow === toRow && fromCol + dCol === toCol && this.board.isValidMove(toRow, toCol));
  }
}
