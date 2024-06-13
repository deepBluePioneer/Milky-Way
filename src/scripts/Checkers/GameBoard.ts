import * as THREE from 'three';

export class GameBoard {
  public boardSize: number;
  private squareSize: number;
  private scene: THREE.Scene;
  private pieces: ('b' | 'r' | null)[][];
  private pieceMeshes: THREE.Mesh[][];

  constructor(scene: THREE.Scene, boardSize: number, squareSize: number) {
    this.boardSize = boardSize;
    this.squareSize = squareSize;
    this.scene = scene;
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
        square.userData = { row, col, highlight: false };
        this.scene.add(square);

        const piece = this.pieces[row][col];
        if (piece) {
          this.addPiece(row, col, piece);
        }
      }
    }
  }

  private addPiece(row: number, col: number, piece: 'b' | 'r') {
    const radius = this.squareSize / 2 - 0.1;
    const pieceGeometry = new THREE.CylinderGeometry(radius, radius, 0.2, 32);
    const pieceMaterial = new THREE.MeshLambertMaterial({ color: piece === 'b' ? 'black' : 'red' });
    const pieceMesh = new THREE.Mesh(pieceGeometry, pieceMaterial);
    pieceMesh.position.set(col, 0.2, row);
    pieceMesh.userData = {
      originalColor: pieceMaterial.color.getHex(),
      owner: piece === 'b' ? 'opponent' : 'player' // Tag the owner
    };
    console.log("Adding piece with userData:", pieceMesh.userData);
    this.scene.add(pieceMesh);

    this.pieceMeshes[row][col] = pieceMesh;
  }

  public movePiece(fromRow: number, fromCol: number, toRow: number, toCol: number, pieceMesh: THREE.Mesh) {
    const piece = this.pieces[fromRow][fromCol];
    if (piece && this.isValidMove(toRow, toCol)) {
      // Remove piece from current position
      this.removePiece(fromRow, fromCol);
      // Add piece to new position
      this.addPieceMesh(toRow, toCol, pieceMesh, piece);
    }
  }

  private addPieceMesh(row: number, col: number, pieceMesh: THREE.Mesh, piece: 'b' | 'r') {
    pieceMesh.position.set(col, 0.2, row);
    pieceMesh.userData = {
      originalColor: (pieceMesh.material as THREE.MeshLambertMaterial).color.getHex(),
      owner: piece === 'b' ? 'opponent' : 'player' // Tag the owner
    };
    this.pieces[row][col] = piece;
    this.pieceMeshes[row][col] = pieceMesh;
  }

  private removePiece(row: number, col: number) {
    const pieceMesh = this.pieceMeshes[row][col];
    if (pieceMesh) {
      this.scene.remove(pieceMesh);
      pieceMesh.geometry.dispose();
      (pieceMesh.material as THREE.Material).dispose();
      this.pieceMeshes[row][col] = null;
      this.pieces[row][col] = null;
    }
  }

  public isValidMove(row: number, col: number): boolean {
    if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) {
      return false;
    }
    return this.pieces[row][col] === null;
  }

  public getPiece(row: number, col: number): ('b' | 'r' | null) {
    return this.pieces[row][col];
  }

  public getPieceMesh(row: number, col: number): THREE.Mesh | null {
    return this.pieceMeshes[row][col];
  }

  public getPieces() {
    return this.pieces;
  }

  public getPieceMeshes() {
    return this.pieceMeshes;
  }
}
