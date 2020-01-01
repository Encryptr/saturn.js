import { Vector3 } from './math/Vector3.js';
import { Matrix4 } from './math/Matrix4.js';

class RenderObject {
  constructor() {
    const onchange = () => this.computeMatrices();
    
    // matrices
    this._position = new Vector3(0, 0, 0);
    this._rotation = new Vector3(0, 0, 0);
    this._scale = new Vector3(1, 1, 1);
    
    this._position.onchange = () => this.computeMatrices();
    this._rotation.onchange = () => this.computeMatrices();
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
      this._position.onchange = () => this.computeMatrices;
    } else {
      console.warn('RenderObject.js: (.set position) expected vector to be of type SATURN.Vector3.');
    }
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(vector) {
    if (vector.isVector3) {
      this._rotation = vector;
      this._rotation.onchange = () => this.computeMatrices;
    } else {
      console.warn('RenderObject.js: (.set rotation) expected vector to be of type SATURN.Vector3.');
    }
  }
  get scale() {
    return this._scale;
  }
  set scale(vector) {
    if (vector.isVector3) {
      this._scale = vector;
      this._scale.onchange = () => this.computeMatrices;
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
    this._localMatrix.makeIdentity().multiply(
      new Matrix4().makeTranslation(...this._position),
      new Matrix4().makeRotation(...this._rotation),
      new Matrix4().makeScale(...this._scale),
    );
    return this;
  }
  computeWorldMatrix() {
    if (this._parent === null) {
      this._worldMatrix.copy(this._localMatrix);
    } else {
      this._worldMatrix.makeIdentity().multiply(
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