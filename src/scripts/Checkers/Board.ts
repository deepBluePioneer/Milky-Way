import * as THREE from 'three';

export class Board {
  private scene: THREE.Scene;
  private boardSize: number;
  private squareSize: number;
  private pieces: ('b' | 'r' | null)[][];
  private pieceMeshes: THREE.Mesh[][];

  constructor(scene: THREE.Scene, boardSize: number, squareSize: number) {
    this.scene = scene;
    this.boardSize = boardSize;
    this.squareSize = squareSize;
    this.pieces = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
    this.pieceMeshes = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
    this.initBoard();
    this.drawBoard();
  }

  private initBoard() {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (row < 3 && (row + col) % 2 === 1) {
          this.pieces[row][col] = 'b'; // black pieces
        } else if (row >= 5 && (row + col) % 2 === 1) {
          this.pieces[row][col] = 'r'; // red pieces
        }
      }
    }
  }

  private drawBoard() {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const color = (row + col) % 2 === 0 ? 0xf0d9b5 : 0xb58863;
        const squareGeometry = new THREE.BoxGeometry(this.squareSize, 0.2, this.squareSize);
        const squareMaterial = new THREE.MeshLambertMaterial({ color });
        const square = new THREE.Mesh(squareGeometry, squareMaterial);
        square.position.set(col, 0, row);
        this.scene.add(square);

        const piece = this.pieces[row][col];
        if (piece) {
          this.drawPiece(row, col, piece);
        }
      }
    }
  }

  private drawPiece(row: number, col: number, piece: 'b' | 'r') {
    const radius = this.squareSize / 2 - 0.1;
    const pieceGeometry = new THREE.CylinderGeometry(radius, radius, 0.2, 32);
    const pieceMaterial = new THREE.MeshLambertMaterial({ color: piece === 'b' ? 'black' : 'red' });
    const pieceMesh = new THREE.Mesh(pieceGeometry, pieceMaterial);
    pieceMesh.position.set(col, 0.2, row);
    this.scene.add(pieceMesh);

    this.pieceMeshes[row][col] = pieceMesh;
  }
}
