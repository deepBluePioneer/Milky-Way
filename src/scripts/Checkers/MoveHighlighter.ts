import * as THREE from 'three';
import { GameBoard } from './GameBoard';

export class MoveHighlighter {
  private scene: THREE.Scene;
  private board: GameBoard;
  private highlightMeshes: THREE.Mesh[] = [];
  private squareSize: number;

  constructor(scene: THREE.Scene, board: GameBoard, squareSize: number) {
    this.scene = scene;
    this.board = board;
    this.squareSize = squareSize;
  }

  public highlightMoves(row: number, col: number) {
    this.clearHighlights();

    const piece = this.board.getPiece(row, col);
    if (!piece) return;

    const directions = piece === 'b' ? [[1, -1], [1, 1]] : [[-1, -1], [-1, 1]];

    directions.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (this.isValidMove(newRow, newCol)) {
        this.highlightSquare(newRow, newCol);
      }
    });
  }

  private isValidMove(row: number, col: number): boolean {
    if (row < 0 || row >= this.board.boardSize || col < 0 || col >= this.board.boardSize) {
      return false;
    }
    return this.board.getPiece(row, col) === null;
  }

  private highlightSquare(row: number, col: number) {
    const highlightGeometry = new THREE.BoxGeometry(this.squareSize, 0.1, this.squareSize);
    const highlightMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
    const highlightMesh = new THREE.Mesh(highlightGeometry, highlightMaterial);
    highlightMesh.position.set(col, 0.1, row);
    highlightMesh.userData = { highlight: true, row, col };
    this.scene.add(highlightMesh);
    this.highlightMeshes.push(highlightMesh);
  }

  public clearHighlights() {
    this.highlightMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    this.highlightMeshes = [];
  }
}
