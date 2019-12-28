import * as ShaderUtil from './ShaderUtil.js';
import { Cache } from './Cache.js';
import { Texture } from './Texture.js';
import { clamp } from './misc.js';

// utility class for caching
class ProgramInfo {
  constructor(program, uniforms) {
    this.program = program;
    this.uniforms = uniforms;
  }
}

class Renderer {
  constructor(domElement) {
    this._domElement = domElement;
    this._gl = domElement.getContext('webgl2');
    
    // caches
    this._vaoCache = new Cache();
    this._programCache = new Cache();
    
    // initialization
    this._gl.enable(this._gl.CULL_FACE);
    this._gl.enable(this._gl.DEPTH_TEST);
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
      material.vertexShader,
      material.fragmentShader,
    );
    
    const uniforms = {};
    for (const name of material.uniforms) {
      uniforms[name] = this._gl.getUniformLocation(program, name);
    }
    
    this._programCache.set(
      material.id,
      new ProgramInfo(program, uniforms),
    );
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
  _setProgram(scene, camera, material, object) {
    
    let currentTextureUnit = 0;
    
    const {
      program, uniforms,
    } = this._programCache.get(material.id) || this._initMaterial(material);
    
    this._gl.useProgram(program);
    
    this._gl.uniformMatrix4fv(uniforms.u_model, false, object.worldMatrix.toFloat32Array());
    this._gl.uniformMatrix4fv(uniforms.u_view, false, camera.viewMatrix.toFloat32Array());
    this._gl.uniformMatrix4fv(uniforms.u_projection, false, camera.projectionMatrix.toFloat32Array());
    
    let materialTexture;
    if (material.texture) {
      materialTexture = ShaderUtil.createTexture(
        this._gl, material.texture.image,
      );
    } else {
      materialTexture = ShaderUtil.createSingleColorTexture(
        this._gl, ...material.color,
      );
    }
    
    // texture unit 0 is reserved for material's texture/color
    this._gl.uniform1i(uniforms.u_texture, currentTextureUnit);
    this._gl.activeTexture(this._gl.TEXTURE0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, materialTexture);
    
    currentTextureUnit += 1;
  }
  render(scene, camera) {
    this._gl.clearColor(
      ...scene.background.toArrayNormalized(), 1,
    );
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    
    scene.traverseAncestors(object => {
      if (object.isMesh) {
        const geometry = object.geometry;
        const material = object.material;
        
        const vao = this._vaoCache.get(geometry.id) || this._initGeometry(geometry);
        this._gl.bindVertexArray(vao);
        
        this._setProgram(scene, camera, material, object);
        
        this._gl.drawElements(this._gl.TRIANGLES, geometry.count, this._gl.UNSIGNED_SHORT, 0);
      }
    });
  }
}

export { Renderer };