import { RenderObject } from './WebGL-RenderObject.js';
import { Matrix4, Vector3 } from './WebGL-Math.js';

class Camera extends RenderObject {
  constructor() {
    super();
    this._projectionMatrix = new Matrix4();
  }
  updateProjectionMatrix() {
    this._projectionMatrix = new Matrix4();
  }
  get viewMatrix() {
    return this._worldMatrix.inverse;
  }
  get projectionMatrix() {
    return this._projectionMatrix;
  }
  get isCamera() {
    return true;
  }
}

class PerspectiveCamera extends Camera {
  constructor(fov, aspect, near, far) {
    super();
    this._projectionMatrix = Matrix4.perspective(fov, aspect, near, far);
  }
  updateProjectionMatrix(fov, aspect, near, far) {
    this._projectionMatrix = Matrix4.perspective(fov, aspect, near, far);
  }
}

export { PerspectiveCamera };