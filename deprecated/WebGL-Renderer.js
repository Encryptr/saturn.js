import { RenderObject } from './WebGL-RenderObject.js';
import { VIEW, PROJECTION, MODEL, POSITION } from './WebGL-constants.js';
import { ShaderUtil } from './WebGL-ShaderUtil.js';

class ResourceCache {
  constructor() {
  
    this._cache = {};
  
  }
  set(id, resource) {
  
    this._cache[id] = resource;
    return true;
    
  }
  get(id) {
  
    return this._cache[id] || false;
  
  }
}

class ProgramInfo {
  constructor(program, uniforms) {
    
    this.program = program;
    this.uniforms = uniforms;
  
  }
}

class Renderer {
  constructor(domElement) {
    
    this._domElement = domElement;
    
    // TODO: add a parameters argument to configure WebGL2RenderingContext
    this._gl = domElement.getContext('webgl2');
    
    this._programCache = new ResourceCache();
    this._vaoCache = new ResourceCache();
    
    // TODO: add a parameters argument to configure renderer
    this._gl.enable(this._gl.CULL_FACE);
    this._gl.enable(this._gl.DEPTH_TEST);
    this._gl.clearColor(0, 0, 0, 1);
    
  }
  get aspectRatio() {
    return (
      this._gl.drawingBufferWidth / this._gl.drawingBufferHeight
    );
  }
  updateAspectRatio() {
    
    const canvas = this._domElement;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      this._gl.viewport(0, 0, canvas.width, canvas.height);
    
    }
    
  }
  
  
  // compile and cache material 
  _initProgram(material) {
    
    // vertex & fragment shaders
    const vertexShader = ShaderUtil.createShader(
      this._gl, this._gl.VERTEX_SHADER, material.shaderSource.vertex,
    );
    const fragmentShader = ShaderUtil.createShader(
      this._gl, this._gl.FRAGMENT_SHADER, material.shaderSource.fragment,
    );
    
    // WebGLProgram
    const program = ShaderUtil.createProgram(this._gl, vertexShader, fragmentShader);
    
    // uniform locations
    const uniforms = {
      [MODEL]: this._gl.getUniformLocation(program, MODEL),
      [VIEW]: this._gl.getUniformLocation(program, VIEW),
      [PROJECTION]: this._gl.getUniformLocation(program, PROJECTION),
    };
    
    // cache
    this._programCache.set(material.id, new ProgramInfo(program, uniforms));
    
    return this._programCache.get(material.id);
  }
  
  // initialize and cache geometry VAO
  _initVAO(geometry) {
    
    // initialize VAO 
    const vao = this._gl.createVertexArray();
    this._gl.bindVertexArray(vao);
    
    // upload geometry attribute data
    for (const location in geometry.attributes) {
      
      const attribute = geometry.attributes[location];      
      
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._gl.createBuffer());
      this._gl.bufferData(this._gl.ARRAY_BUFFER, attribute.array, this._gl.STATIC_DRAW);
    
      this._gl.enableVertexAttribArray(location);
      this._gl.vertexAttribPointer(location, attribute.itemSize, this._gl.FLOAT, attribute.normalized, 0, 0);
    
    }
    
    // upload geometry index data
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._gl.createBuffer());
    this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, geometry.index, this._gl.STATIC_DRAW);
    
    // reset
    this._gl.bindVertexArray(null);
    
    // cache
    this._vaoCache.set(geometry.id, vao);
    
    return this._vaoCache.get(geometry.id);
    
  }
  
  // render objects in renderList, using camera view/projection matrices
  render(renderList, camera) {
    
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    
    const viewMatrixArray = camera.viewMatrix.toFloat32Array();
    const projectionMatrixArray = camera.projectionMatrix.toFloat32Array();
    
    renderList.forEach(object => {
      
      if (object.isMesh) {
        
        const { geometry, material } = object;
        
        const {
          program, uniforms,
        } = this._programCache.get(material.id) || this._initProgram(material);
        
        const vao = this._vaoCache.get(geometry.id) || this._initVAO(geometry);
        
        this._gl.useProgram(program);
        
        this._gl.bindVertexArray(vao);
        
        this._gl.uniformMatrix4fv(uniforms[VIEW], false, viewMatrixArray);
        this._gl.uniformMatrix4fv(uniforms[PROJECTION], false, projectionMatrixArray);
        this._gl.uniformMatrix4fv(uniforms[MODEL], false, object.worldMatrix.toFloat32Array());
        
        this._gl.drawElements(this._gl.LINES, geometry.count, this._gl.UNSIGNED_SHORT, 0);
        
      }
      
    });
    
  }
}

export { Renderer };
