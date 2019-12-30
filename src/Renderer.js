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
    
    this._state = {
      numDirLights: 0,
      numPointLights: 0,
      numSpotLights: 0,
    }
    
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
    
    if (material.isLambertMaterial || material.isPhongMaterial) {
      console.log(material);
      for (let i = 1; i < material.state.numDirLights + 1; i++) {
        uniforms[`directionalLights[${i}].direction`] = this._gl.getUniformLocation(program, `directionalLights[${i}].direction`);
        uniforms[`directionalLights[${i}].color`] = this._gl.getUniformLocation(program, `directionalLights[${i}].color`);
        uniforms[`directionalLights[${i}].intensity`] = this._gl.getUniformLocation(program, `directionalLights[${i}].intensity`);
      }
      for (let i = 1; i < material.state.numPointLights + 1; i++) {
        uniforms[`pointLights[${i}].position`] = this._gl.getUniformLocation(program, `pointLights[${i}].position`);
        uniforms[`pointLights[${i}].color`] = this._gl.getUniformLocation(program, `pointLights[${i}].color`);
        uniforms[`pointLights[${i}].intensity`] = this._gl.getUniformLocation(program, `pointLights[${i}].intensity`);
      }
      for (let i = 1; i < material.state.numSpotLights + 1; i++) {
        uniforms[`spotLights[${i}].direction`] = this._gl.getUniformLocation(program, `spotLights[${i}].direction`);
        uniforms[`spotLights[${i}].color`] = this._gl.getUniformLocation(program, `spotLights[${i}].color`);
        uniforms[`spotLights[${i}].intensity`] = this._gl.getUniformLocation(program, `spotLights[${i}].intensity`);
        uniforms[`spotLights[${i}].position`] = this._gl.getUniformLocation(program, `spotLights[${i}].position`);
        uniforms[`spotLights[${i}].innerLimit`] = this._gl.getUniformLocation(program, `spotLights[${i}].innerLimit`);
        uniforms[`spotLights[${i}].outerLimit`] = this._gl.getUniformLocation(program, `spotLights[${i}].outerLimit`);
      }
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
  _setProgram(scene, camera, material, object, lights) {
    
    let currentTextureUnit = 0;
    
    // update material state
    if (material.isLambertMaterial || material.isPhongMaterial) {
      if (this._state.numDirLights !== material.state.numDirLights)
        material.state.numDirLights = this._state.numDirLights;
      if (this._state.numPointLights !== material.state.numPointLights)
        material.state.numPointLights = this._state.numPointLights;
      if (this._state.numSpotLights !== material.state.numSpotLights)
        material.state.numSpotLights = this._state.numSpotLights;
    }
    
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
    
    // clear previous texture
    this._gl.deleteTexture(
      this._gl.getParameter(this._gl.TEXTURE_BINDING_2D)
    );
    
    // bind new texture
    this._gl.bindTexture(this._gl.TEXTURE_2D, materialTexture);
    
    // increment texture unit
    currentTextureUnit += 1;
    
    // lights
    if (material.isLambertMaterial || material.isPhongMaterial) {
      
      const directionalLights = lights.filter(object => object.isDirectionalLight);
      const pointLights = lights.filter(object => object.isPointLight);
      const spotLights = lights.filter(object => object.isSpotLight);
      
      for (let i = 0; i < directionalLights.length; i++) {
        this._gl.uniform3fv(uniforms[`directionalLights[${i+1}].direction`], directionalLights[i].direction.toFloat32Array());
        this._gl.uniform3fv(uniforms[`directionalLights[${i+1}].color`], directionalLights[i].color.toFloat32ArrayNormalized());
        this._gl.uniform1f(uniforms[`directionalLights[${i+1}].intensity`], directionalLights[i].intensity);
      }
      for (let i = 0; i < pointLights.length; i++) {
        this._gl.uniform3fv(uniforms[`pointLights[${i+1}].position`], pointLights[i].position.toFloat32Array());
        this._gl.uniform3fv(uniforms[`pointLights[${i+1}].color`], pointLights[i].color.toFloat32ArrayNormalized());
        this._gl.uniform1f(uniforms[`pointLights[${i+1}].intensity`], pointLights[i].intensity);
      }
      for (let i = 0; i < spotLights.length; i++) {
        this._gl.uniform3fv(uniforms[`spotLights[${i+1}].direction`], spotLights[i].direction.toFloat32Array());
        this._gl.uniform3fv(uniforms[`spotLights[${i+1}].color`], spotLights[i].color.toFloat32ArrayNormalized());
        this._gl.uniform1f(uniforms[`spotLights[${i+1}].intensity`], spotLights[i].intensity);
        this._gl.uniform3fv(uniforms[`spotLights[${i+1}].position`], spotLights[i].position.toFloat32Array());
        this._gl.uniform1f(uniforms[`spotLights[${i+1}].innerLimit`], spotLights[i].limit);
        this._gl.uniform1f(uniforms[`spotLights[${i+1}].outerLimit`], spotLights[i].limit + 0.05);
      }
    }
    
    // phong-specific uniforms
    if (material.isPhongMaterial) {
      this._gl.uniform1f(uniforms.u_shininess, material.shininess);
      this._gl.uniform3fv(uniforms.u_specularColor,
        new Float32Array(material.specularColor.toArrayNormalized()),
      );
    }
  }
  render(scene, camera) {
    this._gl.clearColor(
      ...scene.background.toArrayNormalized(), 1,
    );
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    
    // update state
    const sceneAncestors =  scene.ancestors;
    const lights = sceneAncestors.filter(object => object.isLight);
    this._state.numDirLights = sceneAncestors.filter(object => object.isDirectionalLight).length;
    this._state.numPointLights = sceneAncestors.filter(object => object.isPointLight).length;
    this._state.numSpotLights = sceneAncestors.filter(object => object.isSpotLight).length;
    
    scene.traverseAncestors(object => {
      if (object.isMesh) {
        const geometry = object.geometry;
        const material = object.material;
        const vao = this._vaoCache.get(geometry.id) || this._initGeometry(geometry);
        
        this._gl.bindVertexArray(vao);
        this._setProgram(scene, camera, material, object, lights);
        
        this._gl.drawElements(this._gl.TRIANGLES, geometry.count, this._gl.UNSIGNED_SHORT, 0);
      }
    });
  }
}

export { Renderer };