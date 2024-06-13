import * as THREE from 'three';

export class Camera {
  private camera: THREE.OrthographicCamera;

  constructor(boardSize: number, height: number, aspect: number = 1) {
    const frustumSize = boardSize;
    this.camera = new THREE.OrthographicCamera(
      frustumSize / -2,
      frustumSize / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    this.camera.position.set(boardSize / 2 - 0.5, height, boardSize / 2 - 0.5);
    this.camera.lookAt(new THREE.Vector3(boardSize / 2 - 0.5, 0, boardSize / 2 - 0.5));
  }

  public getCamera(): THREE.OrthographicCamera {
    return this.camera;
  }

  public resize(size: number) {
    const frustumSize = this.camera.right - this.camera.left;
    this.camera.left = -frustumSize / 2;
    this.camera.right = frustumSize / 2;
    this.camera.top = frustumSize / 2;
    this.camera.bottom = -frustumSize / 2;
    this.camera.updateProjectionMatrix();
  }
}
