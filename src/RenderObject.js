import { Vector3 } from './math/Vector3.js';
import { Matrix4 } from './math/Matrix4.js';
import { Quaternion } from './math/Quaternion.js';

let _xAxis = new Vector3(1, 0, 0);
let _yAxis = new Vector3(0, 1, 0);
let _zAxis = new Vector3(0, 0, 1);
let _q1 = new Quaternion(0, 0, 0, 1);

export class RenderObject {
  constructor() {
    this._position = new Vector3(0, 0, 0);
    this._quaternion = new Quaternion(0, 0, 0, 1);
    this._scale = new Vector3(1, 1, 1);
    
    this._position.onchange = () => this.computeMatrices();
    this._quaternion.onchange =  () => this.computeMatrices();
    this._scale.onchange = () => this.computeMatrices();
    
    this._localMatrix = new Matrix4();
    this._worldMatrix = new Matrix4();
    
    // scenegraph
    this._parent = null;
    this._children = [];
  }
  get isRenderObject() {
    return true;
  }
  get position() {
    return this._position;
  }
  set position(vector) {
    this._position = vector;
    this._position.onchange = () => this.computeMatrices();
    this._position.onchange();
  }
  get quaternion() {
    return this._quaternion;
  }
  set quaternion(quaternion) {
    this._quaternion = quaternion;
    this._quaternion.onchange = () => this.computeMatrices();
    this._quaternion.onchange();
  }
  get scale() {
    return this._scale;
  }
  set scale(vector) {
    this._scale = vector;
    this._scale.onchange = () => this.computeMatrices();
    this._scale.onchange();
  }
  get localMatrix() {
    return this._localMatrix;
  }
  get worldMatrix() {
    return this._worldMatrix;
  }
  computeLocalMatrix() {
    this._localMatrix = Matrix4.Multiply(
      Matrix4.Translation(...this._position),
      Matrix4.FromQuaternion(this._quaternion),
      Matrix4.Scale(...this._scale),
    );
    return this;
  }
  computeWorldMatrix() {
    if (this._parent === null) {
      this._worldMatrix.copy(this._localMatrix);
    } else {
      this._worldMatrix = Matrix4.Multiply(
        this._parent.worldMatrix, this._localMatrix,
      );
    }
    this._children.forEach(child => child.computeWorldMatrix());
    return this;
  }
  computeMatrices() {
    this.computeLocalMatrix();
    this.computeWorldMatrix();
  }
  rotateOnAxis(axis, angle) {
    _q1.setFromAxisAngle(axis, angle);
    this._quaternion.multiply(_q1);
    return this;
  }
  rotateOnWorldAxis(axis, angle) {
    _q1.setFromAxisAngle(axis, angle);
    this._quaternion.premultiply(_q1);
    return this;
  }
  rotateX(angle) {
    _q1.setFromAxisAngle(_xAxis, angle);
    this._quaternion.multiply(_q1);
    return this;
  }
  rotateY(angle) {
    _q1.setFromAxisAngle(_yAxis, angle);
    this._quaternion.multiply(_q1);
    return this;
  }
  rotateZ(angle) {
    _q1.setFromAxisAngle(_zAxis, angle);
    this._quaternion.multiply(_q1);
    return this;
  }
  rotateXYZ(x = 0, y = 0, z = 0) {
    this.rotateX(x)
      .rotateY(y)
      .rotateZ(z);
    return this;
  }
  translateX(number) {
    this._position.x += number;
    return this;
  }
  translateY(number) {
    this._position.y += number;
    return this;
  }
  translateZ(number) {
    this._position.z += number;
    return this;
  }
  translateXYZ(x = 0, y = 0, z = 0) {
    this._position.x += x;
    this._position.y += y;
    this._position.z += z;
    return this;
  }
  scaleX(number) {
    this._scale.x *= Math.abs(number);
    return this;
  }
  scaleY(number) {
    this._scale.y *= Math.abs(number);
    return this;
  }
  scaleZ(number) {
    this._scale.z *= Math.abs(number);
    return this;
  }
  scaleXYZ(x = 1, y = 1, z = 1) {
    this._scale.x *= Math.abs(x);
    this._scale.y *= Math.abs(y);
    this._scale.z *= Math.abs(z);
    return this;
  }
  scaleUniformly(scalar) {
    this._scale.x *= Math.abs(scalar);
    this._scale.y *= Math.abs(scalar);
    this._scale.z *= Math.abs(scalar);
    return this;
  }
  get parent() {
    return this._parent;
  }
  set parent(objectOrNull) {
    this._parent = objectOrNull;
  }
  get children() {
    return [...this._children];
  }
  get ancestors() {
    return (function getChildren(object) {
      const children = [];
      object.children.forEach(child => {
        children.push(child);
        if (child.children.length > 0) {
          objects.push(...getChildren(child));
        }
      });
      return children;
    }(this));
  }
  add(object) {
    if (object.parent) {
      object.parent.remove(object);
    }
    this._children.push(object);
    object.parent = this;
    object.computeWorldMatrix();
    return this;
  }
  remove(object) {
    const index = this._children.indexOf(object);
    if (index !== -1) {
      this._children.splice(index, 1);
      object.parent = null;
      object.computeWorldMatrix();
    }
    return this;
  }
  traverseChildren(callback) {
    this._children.forEach(callback);
  }
  traverseAncestors(callback) {
    this.ancestors.forEach(callback);
  }
}