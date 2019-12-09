import { RenderObject } from './WebGL-RenderObject.js';

class Mesh extends RenderObject {
  constructor(geometry, material) {
    
    super();
    this.geometry = geometry;
    this.material = material;
  
  }
  get isMesh() {
  
    return true;
  
  }
}

export { Mesh };