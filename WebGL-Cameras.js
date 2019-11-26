import { RenderObject } from './WebGL-RenderObject.js';
import { Matrix4, Vector3 } from './WebGL-Math.js';

class PerspectiveCamera extends RenderObject {
  constructor(fov, aspect, near, far) {
    super();
    this._projectionMatrix = Matrix4.perspective(fov, aspect, near, far);
  }
  updateProjectionMatrix(fov, aspect, near, far) {
    this._projectionMatrix = Matrix4.perspective(fov, aspect, near, far);
  }
  get viewMatrix() {
    return this._worldMatrix.inverse;
  }
  get projectionMatrix() {
    return this._projectionMatrix;
  }
}

export { PerspectiveCamera };