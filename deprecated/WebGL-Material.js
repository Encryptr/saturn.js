import {
  VIEW, PROJECTION, MODEL, POSITION
} from './WebGL-constants.js';


const Material = (function() {
  
  let materialID = 0;
  
  return class Material {
    constructor() {
      
      this._id = materialID++;
      
      this.shaderSource = {
        vertex:
        `#version 300 es
        
        layout (location = 0) in vec4 position;
        
        uniform mat4 ${MODEL};
		    uniform mat4 ${PROJECTION};
		    uniform mat4 ${VIEW};
        
        void main() {
		    	mat4 modelViewProjection = ${PROJECTION} * ${VIEW} * ${MODEL};
          gl_Position = modelViewProjection * position;
        
        }`,
        fragment:
        `#version 300 es
    
        precision mediump float;

        out vec4 out_color;
    
        void main() {

          out_color = vec4(1.0, 0.0, 0.0, 1.0);

        }`,
      };
      
    }
    get id() {
    
      return this._id;
    
    }
  }
  
}());

export { Material };
