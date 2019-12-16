import { RenderObject } from './WebGL-RenderObject.js';

class RenderList extends RenderObject {
  constructor() {

    super();

  }
  _getObjects(surface) {
    
    let collection = [];
    
    surface.forEach(object => {
      
      collection.push(object);
      
      if (object.children.length > 0) {
      
        collection.push(...this._getObjects(object.children));
      
      }
      
    });
    
    return collection;
  
  }
  forEach(callback) {
    
    const objects = this._getObjects(this._children);
    objects.forEach(object => callback(object));
  
  }
  add(object) {
    
    if (object.isRenderObject && !this._children.includes(object)) {
    
      this._children.push(object);
    
    }
  
  }
  remove(object) {
    
    const i = this._children.indexOf(object);
    
    if (object.isRenderObject && i !== -1) {
    
      this._children.splice(i, 1);
    
    }
  }
  get isRenderList() {
  
    return true;
  
  }
}

export { RenderList };
