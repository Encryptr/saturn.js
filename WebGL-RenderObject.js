import { Matrix4, Vector3 } from './WebGL-Math.js';

class RenderObject {
  constructor() {
    this._localMatrix = new Matrix4();
    this._worldMatrix = new Matrix4();
    
    this._position = new Proxy(new Vector3(), {
      set: (vector, component, value) => {
        vector[component] = value;
        this._computeLocalMatrix();
        this._computeWorldMatrix();
        return true;
      }
    });
    this._rotation = new Proxy(new Vector3(), {
      set: (vector, component, value) => {
        vector[component] = value;
        this._computeLocalMatrix();
        this._computeWorldMatrix();
        return true;
      }
    });
    this._scale = 1;
    
    this._children = [];
    this._parent = null;
  }
    
  // matrices
  _computeLocalMatrix() {
  	const rotation    = Matrix4.rotation(...this._rotation);
    const translation = Matrix4.translation(...this._position);
    const scale       = Matrix4.scale(this._scale);
    this._localMatrix = new Matrix4().multiplyMatrices([
      translation, rotation, scale,
    ]);
  }
  _computeWorldMatrix() {
  	 if (!this._parent) {
       this._worldMatrix = this._localMatrix.copy();
     } else {
       this._worldMatrix = this._parent.worldMatrix.multiply(this._localMatrix, false);
     }
     this._children.forEach(object => object._computeWorldMatrix());
  }
  get localMatrix() {
    return this._localMatrix;
  }
  get worldMatrix() {
    return this._worldMatrix;
  }
    
  // manipulate local matrix
  get position() {
    return this._position;
  }
  get rotation() {
    return this._rotation;
  }
  get scale() {
    return this._scale;
  }
  set scale(s) {
    this._scale = s;
    this._computeLocalMatrix();
    this._computeWorldMatrix();
  }
    
  // scene graph
  get isRenderObject() {  
    return true;
  }
  get children() {
    return [...this._children];
  }
  get parent() {
    return this._parent;
  }
  set parent(object) {
    if (object === null || object.isRenderObject) 
      this._parent = object;
  }
  remove(object) {
    const i = this._children.indexOf(object);
    if (object.isRenderObject && i !== -1) {
      this._children.splice(i, 1);
      object.parent = null;
    }
  }
  add(object) {
    if (object.isRenderObject && object.parent !== this) {
      this._children.push(object);
      object.parent = this;
    }
  }
}

export { RenderObject };