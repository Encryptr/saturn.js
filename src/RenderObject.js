import { Vector3 } from './math/Vector3.js';
import { Matrix4 } from './math/Matrix4.js';

const _makeVectorHandler = (o) => ({
  set(vector, component, value) {
    Reflect.set(vector, component, value);
    o.computeMatrices();
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
  set position(v) {
    this._position.copy(v);
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(v) {
    this._rotation.copy(v);
  }
  get scale() {
    return this._scale;
  }
  set scale(v) {
    this._scale.copy(v);
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
  add(o) {
    if (o.isRenderObject) {
      if (o.parent)
        o.parent.remove(o);
      this._children.push(o);
      o._parent = this;
      return this;
    }
  }
  remove(o) {
    const index = this._children.indexOf(o);
    if (index !== -1) {
      this._children.splice(index, 1);
      o._parent = null;
    }
    return this;
  }
  traverseChildren(f) {
    this._children.forEach(f);
  }
  traverseAncestors(f) {
    this.ancestors.forEach(f);
  }
}

export { RenderObject };