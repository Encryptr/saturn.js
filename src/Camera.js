import { Matrix4 } from './math/Matrix4.js';
import { Frustum } from './math/Frustum.js';
import { RenderObject } from './RenderObject.js';

class Camera extends RenderObject {
  constructor() {
    super();
    this._projectionMatrix = new Matrix4();
    this._frustum = new Frustum().setFromProjectionMatrix(this._projectionMatrix);
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
  get frustum() {
    return this._frustum;
  }
}

class PerspectiveCamera extends Camera {
  constructor(fov, aspect, near, far) {
    super();
    this._projectionMatrix.makePerspective(fov, aspect, near, far);
    this._frustum.setFromProjectionMatrix(this._projectionMatrix);
  }
  updateProjectionMatrix(fov, aspect, near, far) {
    this._projectionMatrix.makePerspective(fov, aspect, near, far);
    this._frustum.setFromProjectionMatrix(this._projectionMatrix);
  }
}

export { Camera, PerspectiveCamera };