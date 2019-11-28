import { RenderObject } from './WebGL-RenderObject.js';
import { VIEW, PROJECTION, MODEL, POSITION } from './WebGL-constants.js';

// ShaderUtil.js
const ShaderUtil = {
  createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      return shader;
    
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return undefined;
  },
  createProgram(gl, vertex, fragment) {
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) 
      return program;
    
    console.warn(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return undefined;
  },
}

// Material.js
const Material = (function() {
  let materialID = 0;
  return class Material {
    constructor() {
      this._id = materialID++;
      this.shaderSource = {
        vertex:
        `#version 300 es
        
        in vec4 position;
        
        uniform mat4 ${MODEL};
		    uniform mat4 ${PROJECTION};
		    uniform mat4 ${VIEW};
        
        void main() {

		    	mat4 matrix = ${PROJECTION} * ${VIEW} * ${MODEL};
          gl_Position = matrix * position;
        
        }`,
        fragment:
        `#version 300 es
    
        precision mediump float;

        out vec4 out_color;
    
        void main() {

          out_color = vec4(1, 0, 0, 1);

        }`,
      }
    }
    get id() {
      return this._id;
    }
  }
}());




// Mesh.js
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

// Renderer.js
class _WebGLProgram {
  constructor(program, uniforms, attributes) {
    this.program = program;
    this.uniforms = uniforms;
    this.attributes = attributes;
  }
}

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
    })
    return collection;
  }
  traverse(callback) {
    const objects = this._getObjects(this._children);
    objects.forEach(object => callback(object));
  }
  get isRenderList() {
    return true;
  }
}

class Renderer {
  constructor(domElement) {
    this._domElement = domElement;
    this._gl = domElement.getContext('webgl2');
    if (!this._gl) 
      console.error('Renderer: unable to initialize WebGL 2 context');
    
    this._buffers = {
      position: this._gl.createBuffer(),
    };
    this._programCache = {};
  }
  _initMaterial(material) {
    const vertex = ShaderUtil.createShader(
      this._gl, this._gl.VERTEX_SHADER, material.shaderSource.vertex,
    );
    const fragment = ShaderUtil.createShader(
      this._gl, this._gl.FRAGMENT_SHADER, material.shaderSource.fragment,
    );
    const program = ShaderUtil.createProgram(this._gl, vertex, fragment);
    
    const uniforms = {
      [MODEL]: this._gl.getUniformLocation(program, MODEL),
      [VIEW]: this._gl.getUniformLocation(program, VIEW),
      [PROJECTION]: this._gl.getUniformLocation(program, PROJECTION),
    };
    
    const attributes = {
      [POSITION]: this._gl.getAttribLocation(program, POSITION),
    };
    
    this._programCache[material.id] = new _WebGLProgram(program, uniforms, attributes);
  }
  render(renderList, camera) {
    if (!renderList.isRenderList) return;
    
    const viewMatrixArray = camera.viewMatrix.toFloat32Array();
    const projectionMatrixArray = camera.projectionMatrix.toFloat32Array();
    
    this._gl.clearColor(0, 0, 0, 0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    
    //this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.position);
    
    renderList.traverse(object => {
      if (object.isMesh) {
        const { geometry, material } = object;
        if (!this._programCache[material.id]) {
          this._initMaterial(material);
        }
        
        const program = this._programCache[material.id].program;
        const uniforms = this._programCache[material.id].uniforms;
        const attributes = this._programCache[material.id].attributes;
        
        this._gl.useProgram(program);
        
        const position = geometry.getAttribute(POSITION); 
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._gl.createBuffer());
        this._gl.bufferData(this._gl.ARRAY_BUFFER, position.array, this._gl.STATIC_DRAW);
        this._gl.enableVertexAttribArray(attributes[POSITION]);
        this._gl.vertexAttribPointer(attributes[POSITION], position.itemSize, this._gl.FLOAT, position.normalized, 0, 0);
        
        this._gl.uniformMatrix4fv(uniforms[VIEW], false, viewMatrixArray);
        this._gl.uniformMatrix4fv(uniforms[PROJECTION], false, projectionMatrixArray);
        this._gl.uniformMatrix4fv(uniforms[MODEL], false, object.worldMatrix.toFloat32Array());
        
        this._gl.drawArrays(this._gl.TRIANGLES, 0, geometry.count);
      }
    });
  }
}

export { Material, Renderer, RenderList, Mesh };