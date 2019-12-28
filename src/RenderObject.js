import { Vector3 } from './math/Vector3.js';
import { Matrix4 } from './math/Matrix4.js';

const _makeVectorHandler = (object) => ({
  set(vector, component, value) {
    Reflect.set(vector, component, value);
    object.computeMatrices();
    return true;
  },
});

class RenderObject {
  constructor() {
    const _vectorHandler = _makeVectorHandler(this);
    
    // matrices
    this._position = new Proxy(
      new Vector3(0, 0, 0), _vectorHandler,
    );
    this._rotation = new Proxy(
      new Vector3(0, 0, 0), _vectorHandler,
    );
    this._scale = new Proxy(
      new Vector3(1, 1, 1), _vectorHandler,
    );
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
      this._position.copy(vector);
    } else {
      console.warn('RenderObject.js: (.set position) expected vector to be of type SATURN.Vector3.');
    }
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(vector) {
    if (vector.isVector3) {
      this._rotation.copy(vector);
    } else {
      console.warn('RenderObject.js: (.set rotation) expected vector to be of type SATURN.Vector3.');
    }
  }
  get scale() {
    return this._scale;
  }
  set scale(vector) {
    if (vector.isVector3) {
      this._scale.copy(vector);
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
    if (object.isRenderObject) {
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
  remove(o) {
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