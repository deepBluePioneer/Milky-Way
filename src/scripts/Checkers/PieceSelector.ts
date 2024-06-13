import * as THREE from 'three';
import { GameBoard } from './GameBoard';
import { MoveHighlighter } from './MoveHighlighter';

export class PieceSelector {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private highlightedPiece: THREE.Mesh | null = null;
  private board: GameBoard;
  private moveHighlighter: MoveHighlighter;
  private selectedPiece: { row: number, col: number, mesh: THREE.Mesh } | null = null;

  constructor(scene: THREE.Scene, camera: THREE.OrthographicCamera, renderer: THREE.WebGLRenderer, board: GameBoard, squareSize: number) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.board = board;
    this.moveHighlighter = new MoveHighlighter(scene, board, squareSize);

    renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
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

      if (intersect.object instanceof THREE.Mesh && this.isSelectablePiece(intersect.object)) {

        if (this.highlightedPiece !== intersect.object) {
          if (this.highlightedPiece) {
            (this.highlightedPiece.material as THREE.MeshLambertMaterial).color.set(this.highlightedPiece.userData.originalColor);
            this.moveHighlighter.clearHighlights();
          }
          this.highlightedPiece = intersect.object;
          this.highlightedPiece.userData.originalColor = (this.highlightedPiece.material as THREE.MeshLambertMaterial).color.getHex();
         
          (this.highlightedPiece.material as THREE.MeshLambertMaterial).color.set(0xffff00); // Highlight color
          this.moveHighlighter.highlightMoves(intersect.object.position.z, intersect.object.position.x);
          this.selectedPiece = { row: intersect.object.position.z, col: intersect.object.position.x, mesh: intersect.object };
        } else {
          (this.highlightedPiece.material as THREE.MeshLambertMaterial).color.set(this.highlightedPiece.userData.originalColor);
          this.highlightedPiece = null;
          this.moveHighlighter.clearHighlights();
          this.selectedPiece = null;
        }
      } else {
        if (this.highlightedPiece) {
         
          (this.highlightedPiece.material as THREE.MeshLambertMaterial).color.set(this.highlightedPiece.userData.originalColor);
          this.highlightedPiece = null;
          this.moveHighlighter.clearHighlights();
          this.selectedPiece = null;
        }
      }
    } else {
      if (this.highlightedPiece) {
        
        this.highlightedPiece = null;
        this.moveHighlighter.clearHighlights();
        this.selectedPiece = null;
      }
    }
  }

  private isSelectablePiece(piece: THREE.Mesh): boolean {
   
    return piece.userData && piece.userData.owner === 'player';
  }

  public getSelectedPiece(): { row: number, col: number, mesh: THREE.Mesh } | null {
    return this.selectedPiece;
  }

  public clearSelection() {
    if (this.highlightedPiece) {
      (this.highlightedPiece.material as THREE.MeshLambertMaterial).color.set(this.highlightedPiece.userData.originalColor);
      this.highlightedPiece = null;
    }
    this.moveHighlighter.clearHighlights();
    this.selectedPiece = null;
  }
}
