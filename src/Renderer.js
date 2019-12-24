import * as ShaderUtil from './ShaderUtil.js';
import { Cache } from './Cache.js';

class ProgramInfo {
  constructor(program, uniformLocations) {
    this.program = program;
    this.uniformLocations = uniformLocations;
  }
}

class Renderer {
  constructor(domElement) {
    this._domElement = domElement;
    this._gl = domElement.getContext('webgl2');
    this._vaoCache = new Cache();
    this._programCache = new Cache();
    
    this._gl.enable(this._gl.CULL_FACE);
    this._gl.enable(this._gl.DEPTH_TEST);
    this._gl.clearColor(0, 0, 0, 1);
  }
  get domElement() {
    return this._domElement;
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
  _initMaterial(material) {
    const program = ShaderUtil.compileProgram(
      this._gl,
      material.vertex,
      material.fragment,
    );
    const uniformLocations = {
      'u_model': this._gl.getUniformLocation(program, 'u_model'),
      'u_view': this._gl.getUniformLocation(program, 'u_view'),
      'u_projection': this._gl.getUniformLocation(program, 'u_projection'),
    };
    this._programCache.set(material.id, new ProgramInfo(program, uniformLocations));
    
    return this._programCache.get(material.id);
  }
  _initGeometry(geometry) {
    const vao = this._gl.createVertexArray();
    this._gl.bindVertexArray(vao);
    
    for (const location in geometry.attributes) {
      const attribute = geometry.attributes[location];
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._gl.createBuffer());
      this._gl.bufferData(this._gl.ARRAY_BUFFER, attribute.array, this._gl.STATIC_DRAW);
      this._gl.enableVertexAttribArray(location);
      this._gl.vertexAttribPointer(location, attribute.itemSize, this._gl.FLOAT, attribute.normalized, 0, 0);
    }
    
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._gl.createBuffer());
    this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, geometry.index, this._gl.STATIC_DRAW);
    
    this._gl.bindVertexArray(null);
    
    this._vaoCache.set(geometry.id, vao);
    
    return this._vaoCache.get(geometry.id);
  }
  render(scene, camera) {
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    const viewMatrixF32 = camera.viewMatrix.toFloat32Array();
    const projectionMatrixF32 = camera.projectionMatrix.toFloat32Array();
    scene.traverseAncestors(object => {
      if (object.isMesh) {
        const geometry = object.geometry;
        const material = object.material;
        
        const {
          program, uniformLocations
        } = this._programCache.get(material.id) || this._initMaterial(material);
        const vao = this._vaoCache.get(geometry.id) || this._initGeometry(geometry);
        
        this._gl.useProgram(program);
        
        this._gl.bindVertexArray(vao);
        
        this._gl.uniformMatrix4fv(uniformLocations.u_view, false, viewMatrixF32);
        this._gl.uniformMatrix4fv(uniformLocations.u_projection, false, projectionMatrixF32);
        this._gl.uniformMatrix4fv(uniformLocations.u_model, false, object.worldMatrix.toFloat32Array());
        
        this._gl.drawElements(this._gl.LINES, geometry.count, this._gl.UNSIGNED_SHORT, 0);
      }
    });
  }
}

export { Renderer };