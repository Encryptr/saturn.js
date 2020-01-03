import { Vector3 } from './math/Vector3.js';
import { Matrix4 } from './math/Matrix4.js';
import { Euler } from './math/Euler.js';
import { Quaternion } from './math/Quaternion.js';
import { XYZ } from './constants.js';

const _xAxis = new Vector3(1, 0, 0);
const _yAxis = new Vector3(0, 1, 0);
const _zAxis = new Vector3(0, 0, 1);
const _q1 = new Quaternion(0, 0, 0, 1);

class RenderObject {
  constructor() {
    const onchange = () => this.computeMatrices();
    
    // matrices
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
  
  // matrices
  get position() {
    return this._position;
  }
  set position(vector) {
    if (vector.isVector3) {
      this._position = vector;
      this._position.onchange = () => this.computeMatrices();
      this._position.onchange();
    } else {
      console.warn('RenderObject.js: (.set position) expected vector to be of type SATURN.Vector3.');
    }
  }
  get quaternion() {
    return this._quaternion;
  }
  set quaternion(quat) {
    if (quaternion.isQuaternion) {
      this._quaternion = quat;
      this._quaternion.onchange = () => this.computeMatrices();
      this._quaternion.onchange;
    } else {
      console.warn('RenderObject.js: (.set quaternion) expected quat to be of type SATURN.Quaternion.');
    }
  }
  get scale() {
    return this._scale;
  }
  set scale(vector) {
    if (vector.isVector3) {
      this._scale = vector;
      this._scale.onchange = () => this.computeMatrices();
      this._scale.onchange();
    } else {
      console.warn('RenderObject.js: (.set scale) expected vector to be of type SATURN.Vector3.');
    }
  }
  get localMatrix() {
    return this._localMatrix;
  }
  get worldMatrix() {
    return this._worldMatrix;
  }
  computeLocalMatrix() {
    this._localMatrix.setIdentity().multiply(
      new Matrix4().setFromTranslation(...this._position),
      new Matrix4().setFromQuaternion(this._quaternion),
      new Matrix4().setFromScale(...this._scale),
    );
    return this;
  }
  computeWorldMatrix() {
    if (this._parent === null) {
      this._worldMatrix.copy(this._localMatrix);
    } else {
      this._worldMatrix.setIdentity().multiply(
        this._parent.worldMatrix, this._localMatrix,
      );
    }
    this._children.forEach(o => o.computeWorldMatrix());
    return this;
  }
  computeMatrices() {
    this.computeLocalMatrix();
    this.computeWorldMatrix();
  }
  
  rotateOnAxis(axis, t) {
    if (axis.isVector3) {
      _q1.setFromAxisAngle(axis, t);
      this._quaternion.multiply(_q1);
    } else {
      console.warn('RenderObject.js: (.rotateOnAxis) expected axis to be of type SATURN.Vector3');
    }
  }
  rotateOnWorldAxis(axis, t) {
    if (axis.isVector3) {
      _q1.setFromAxisAngle(axis, t);
      this._quaternion.premultiply(_q1);
    } else {
      console.warn('RenderObject.js: (.rotateOnWorldAxis) expected axis to be of type SATURN.Vector3');
    }
  }
  
  rotateX(t) {
    _q1.setFromAxisAngle(_xAxis, t);
    this._quaternion.multiply(_q1);
    return this;
  }
  rotateY(t) {
    _q1.setFromAxisAngle(_yAxis, t);
    this._quaternion.multiply(_q1);
    return this;
  }
  rotateZ(t) {
    _q1.setFromAxisAngle(_zAxis, t);
    this._quaternion.multiply(_q1);
    return this;
  }
  rotateXYZ(x, y, z) {
    this
      .rotateX(x)
      .rotateY(y)
      .rotateZ(z);
    return this;
  }
  
  translateX(x) {
    this._position.x += x;
    return this;
  }
  translateY(y) {
    this._position.y += y;
    return this;
  }
  translateZ(z) {
    this._position.z += z;
    return this;
  }
  translateXYZ(x, y, z) {
    this
      .translateX(x)
      .translateY(y)
      .translateZ(z);
    return this;
  }
  
  scaleX(s) {
    this._scale.x *= s;
    return this;
  }
  scaleY(s) {
    this._scale.y *= s;
    return this;
  }
  scaleZ(s) {
    this._scale.z *= s;
    return this;
  }
  scaleXYZ(x, y, z) {
    this
      .scaleX(x)
      .scaleY(y)
      .scaleZ(z);
    return this;
  }
  
  // scenegraph
  get parent() {
    return this._parent;
  }
  set parent(object) {
    if (object === null || object.isRenderObject) {
      this._parent = object;
    } else {
      console.warn('RenderObject.js: (.set parent) expected object to be of type SATURN.RenderObject.');
    }
  }
  get children() {
    return [...this._children];
  }
  get ancestors() {
    return (function getChildren(a) {
      const objects = [];
      a.forEach(o => {
        objects.push(o);
        if (o.children.length > 0) {
          objects.push(...getChildren(o.children));
        }
      });
      return objects;
    }(this._children));
  }
  add(object) {
    if (object.isRenderObject) {
      if (object.parent)
        object.parent.remove(object);
      this._children.push(object);
      object.parent = this;
      object.computeWorldMatrix();
      return this;
    } else {
      console.warn('RenderObject.js: (.add) expected object to be of type SATURN.RenderObject.');
    }
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

export { RenderObject };