import { Geometry } from './WebGL-Geometry.js';
import { Attribute } from './WebGL-Attribute.js';
import * as Constants from './WebGL-constants.js';

class OBJParser {
  parse(text) {
    
    const geometry = new Geometry();
    const vertices = [];
    const indices = [];
    const lines = text.split(/\n/);
    
    lines.forEach(line => {
      
      const contents = line.split(/\s+/);
      
      switch (contents[ 0 ]) {
      
        case 'v':
          vertices.push(...contents.slice(1).map(str => Number(str)));
          break;
        
        case 'f':
          indices.push(...contents.slice(1).map(str => Number(str)-1));
          break;
        
        default: // nothing
      
      }
    
    });
    
    geometry.position = new Attribute(
      new Float32Array(vertices), 3, false, false,
    );
    geometry.index = new Uint16Array(indices);
    
    return geometry;
  
  }
}

// cache geometries 
class OBJCache {
  constructor() {
    
    this._assets = {};
  
  }
  set(url, geometry) {
  
    this._assets[url] = geometry;
  
  }
  get(url) {
  
    this._assets[url];
  
  }
  has(url) {
  
    return url in this._assets;
  
  }
};

export class OBJLoader {
  constructor() {
    
    this._cache = new OBJCache();
    this._parser = new OBJParser();
  
  }
  async load(url) {
    
    if (this._cache.has(url)) {
    
      return this._cache.get(url);
    
    } else {
    
      const response = await fetch(url);
      const fileText = await response.text();
      const geometry = this._parser.parse(fileText);
      this._cache.set(url, geometry);
      return geometry;
    
    }
    
  }
}
