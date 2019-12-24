import { Matrix4 } from './math/Matrix4.js';
import { RenderObject } from './RenderObject.js';

class Camera extends RenderObject {
  constructor() {
    super();
    this._projectionMatrix = new Matrix4();
  }
  get isCamera() {
    return true;
  }
  get viewMatrix() {
    return this._worldMatrix.inverse;
  }
  get projectionMatrix() {
    return this._projectionMatrix;
  }
}

class PerspectiveCamera extends Camera {
  constructor(fov, aspect, near, far) {
    super();
    this._projectionMatrix = new Matrix4().makePerspective(fov, aspect, near, far);
  }
  updateProjectionMatrix(fov, aspect, near, far) {
    this._projectionMatrix.makePerspective(fov, aspect, near, far);
  }
}

export { Camera, PerspectiveCamera };