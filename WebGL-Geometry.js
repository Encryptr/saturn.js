import * as Constants from './WebGL-constants.js';
import { Attribute } from './WebGL-Attribute.js';

// TODO: implement custom attributes
const Geometry = (function() {
  
  let geometryID = 0;
  
  return class Geometry {
    constructor() {
      
      this._id = geometryID++;
      this._attributes = {};
      this._attributeRegistry = {};
      this._index = new Uint16Array([]);
    
    }
    get id() {
      
      return this._id;
    
    }
    get count() {
      
      return this._index.length;
    
    }
    get attributes() {
    
      return this._attributes;
    
    }
    get position() {
    
      return this._attributes[0];
    
    }
    set position(attribute) {
    
      this._attributes[0] = attribute;
    
    }
    get index() {
      
      return this._index;
    
    }
    set index(typedArray) {
    
      if (typedArray instanceof Uint16Array) {
        
        this._index = typedArray;
      
      } else {
      
        console.error('Geometry.js: (.set index) expected a Uint16Array');
      
      }
    
    }
  }
  
}());

export { Geometry };