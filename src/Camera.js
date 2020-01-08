import { Matrix4 } from './math/Matrix4.js';
import { RenderObject } from './RenderObject.js';

export class Camera extends RenderObject {
  constructor() {
    super();
    this._projectionMatrix = Matrix4.Identity;
  }
  
  // Accessors
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

export class PerspectiveCamera extends Camera {
  constructor(fov, aspect, near, far) {
    super();
    this._projectionMatrix = Matrix4.Perspective(fov, aspect, near, far);
  }
  
  // Methods
  updateProjectionMatrix(fov, aspect, near, far) {
    this._projectionMatrix = Matrix4.Perspective(fov, aspect, near, far);
  }
  
  // Accessors
  get isPerspectiveCamera() {
    return true;
  }
}

export class OrthographicCamera extends Camera {
  constructor(left, right, bottom, top, near, far) {
    super();
    this._projectionMatrix = Matrix4.Orthographic(left, right, bottom, top, near, far);
  }
  
  // Methods
  updateProjectionMatrix(left, right, bottom, top, near, far) {
    this._projectionMatrix = Matrix4.Orthographic(left, right, bottom, top, near, far);
  }
  
  // Accessors
  get isOrthographicCamera() {
    return true;
  }
}