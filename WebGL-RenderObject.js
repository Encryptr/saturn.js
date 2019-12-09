import { Matrix4, Vector3 } from './WebGL-Math.js';

class RenderObject {
  constructor() {
    
    // matrices
    this._localMatrix = new Matrix4();
    this._worldMatrix = new Matrix4();
    
    // detect changes on position/rotation and update matrices
    this._position = new Proxy(new Vector3(), {
      
      set: (vector, component, value) => {
        
        Reflect.set(vector, component, value);
        
        this.updateLocalMatrix();
        this.updateWorldMatrix();
        
        return true;
      
      },
      
    });
    this._rotation = new Proxy(new Vector3(), {
      
      set: (vector, component, value) => {
        
        Reflect.set(vector, component, value);
        
        this.updateLocalMatrix();
        this.updateWorldMatrix();
        
        return true;
      
      },
      
    });
    
    this._scale = 1;
    
    // scene graph
    this._children = [];
    this._parent = null;
 
  }
    
  // matrices
  updateLocalMatrix() {
    
    const rotation    = Matrix4.rotation(...this._rotation);
    const translation = Matrix4.translation(...this._position);
    const scale       = Matrix4.scale(this._scale);
    
    this._localMatrix = new Matrix4().multiplyMatrices([
    
      translation, rotation, scale,
    
    ]);
    
  }
  updateWorldMatrix() {
    
    if (!this._parent) {
     
      this._worldMatrix = this._localMatrix.copy();
     
    } else {
     
      this._worldMatrix = this._parent.worldMatrix.multiply(this._localMatrix, {mutate: false});
     
    }
    
    this._children.forEach(object => object.updateWorldMatrix());
    
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
    
    this.updateLocalMatrix();
    this.updateWorldMatrix();
  
  }
    
  // scene graph
  get children() {
  
    return [...this._children];
  
  }
  get parent() {
    
    return this._parent;
  
  }
  set parent(object) {
    
    if (object === null || object.isRenderObject) { 
      this._parent = object;
    }
    
  }
  remove(object) {
    
    const i = this._children.indexOf(object);
    
    if (object.isRenderObject && i !== -1) {
      
      this._children.splice(i, 1);
      object.parent = null;
      object.updateWorldMatrix();
    
    }
  
  }
  add(object) {
    
    if (object.isRenderObject && object.parent !== this) {
      
      this._children.push(object);
      object.parent = this;
      object.updateWorldMatrix();
    
    }
  
  }
  get isRenderObject() {  
  
    return true;
  
  }
}

export { RenderObject };