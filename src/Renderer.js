import * as ShaderUtil from './ShaderUtil.js';
import { Vector3 } from './math/Vector3.js';
import { Vector4 } from './math/Vector4.js';
import { Sphere } from './math/Sphere.js';
import { Cache } from './Cache.js';

const _v3 = new Vector3();
const _v4 = new Vector4();
const _sphere = new Sphere();

// symbolic constants
const MAX_LIGHTS = 32;
const DIR_LIGHT_BYTE_LENGTH = 32;
const POINT_LIGHT_BYTE_LENGTH = 32;
const SPOT_LIGHT_BYTE_LENGTH = 48;
const FLOATS_PER_DIR_LIGHT = 8;
const FLOATS_PER_POINT_LIGHT = 8;
const FLOATS_PER_SPOT_LIGHT = 12;

// utility class for caching
class ProgramInfo {
  constructor(program, uniforms) {
    this.program = program;
    this.uniforms = uniforms;
  }
}

// TODO: implement UBO system to reduce gl.uniform overhead
class Renderer {
  constructor(domElement) {
    this._domElement = domElement;
    this._gl = domElement.getContext('webgl2');
    
    this._state = {
      numDirLights: 0,
      numPointLights: 0,
      numSpotLights: 0,
    }
    this._debugInfo = {
      objectsDrawn: 0,
    }
    
    // caches
    this._vaoCache = new Cache();
    this._programCache = new Cache();
    this._textureCache = new Cache();
    
    // allocate Float32Arrays beforehand
    this._matrixF32 = new Float32Array(16);
    this._vectorF32 = new Float32Array(3);
    
    this._matrixUBO = this._gl.createBuffer();
    this._lightUBO = this._gl.createBuffer();
    
    this._lightBuffer = new ArrayBuffer(
      MAX_LIGHTS * (DIR_LIGHT_BYTE_LENGTH + POINT_LIGHT_BYTE_LENGTH + SPOT_LIGHT_BYTE_LENGTH) + 16 // extra integer data
    );
    this._dirLightView = new Float32Array(
      this._lightBuffer, 0, FLOATS_PER_DIR_LIGHT*MAX_LIGHTS,
    );
    this._pointLightView = new Float32Array(
      this._lightBuffer, MAX_LIGHTS * DIR_LIGHT_BYTE_LENGTH, FLOATS_PER_DIR_LIGHT*MAX_LIGHTS,
    );
    this._spotLightView = new Float32Array(
      this._lightBuffer, MAX_LIGHTS * (DIR_LIGHT_BYTE_LENGTH + POINT_LIGHT_BYTE_LENGTH), FLOATS_PER_SPOT_LIGHT*MAX_LIGHTS,
    );
    this._integerView = new Uint32Array(
      this._lightBuffer, MAX_LIGHTS * (DIR_LIGHT_BYTE_LENGTH + POINT_LIGHT_BYTE_LENGTH + SPOT_LIGHT_BYTE_LENGTH), 4,
    );
    
    // initialization
    this._gl.enable(this._gl.CULL_FACE);
    this._gl.enable(this._gl.DEPTH_TEST);
  }
  updateAspectRatio() {
    this._domElement.width = this._domElement.clientWidth;
    this._domElement.height = this._domElement.clientHeight;
    this._gl.viewport(
      0, 0, this._domElement.clientWidth, this._domElement.clientHeight
    );
  }
  _initMaterial(material) {
    console.info('Renderer.js: ._initMaterial() initialized WebGLProgram.');
    const program = ShaderUtil.compileProgram(
      this._gl,
      material.vertexShader,
      material.fragmentShader,
    );
    
    const uniforms = {};
    for (const name of material.uniforms) {
      uniforms[name] = this._gl.getUniformLocation(program, name);
    }
    
    //this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, this._matrixUBO);
    var index = this._gl.getUniformBlockIndex(program, 'Matrices');
    var bindingIndex = 0;
    var size = this._gl.getActiveUniformBlockParameter(program, index, this._gl.UNIFORM_BLOCK_DATA_SIZE);
    console.log('SIZE: ', size);
    this._gl.uniformBlockBinding(program, bindingIndex, index);
    this._gl.bindBufferRange(this._gl.UNIFORM_BUFFER, bindingIndex, this._matrixUBO, 0, size)
    this._gl.bufferData(this._gl.UNIFORM_BUFFER, new Float32Array(36), this._gl.DYNAMIC_DRAW);
    
    //this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, this._lightUBO);
    var index = this._gl.getUniformBlockIndex(program, 'Lights');
    var bindingIndex = 1;
    var size = this._gl.getActiveUniformBlockParameter(program, index, this._gl.UNIFORM_BLOCK_DATA_SIZE);
    console.log('SIZE2: ', size);
    this._gl.uniformBlockBinding(program, bindingIndex, index);
    this._gl.bindBufferRange(this._gl.UNIFORM_BUFFER, bindingIndex, this._lightUBO, 0, size);
    this._gl.bufferData(this._gl.UNIFORM_BUFFER, this._lightBuffer, this._gl.DYNAMIC_DRAW);
    this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, null);
    
    if (material.isLambertMaterial || material.isPhongMaterial) {
      
      // DEBUG
      
      
      
      for (let i = 1; i < material.state.numDirLights + 1; i++) {
        uniforms[`dirLights[${i}].direction`] = this._gl.getUniformLocation(program, `dirLights[${i}].direction`);
        uniforms[`dirLights[${i}].colorIntensity`] = this._gl.getUniformLocation(program, `dirLights[${i}].colorIntensity`);
      }
      for (let i = 1; i < material.state.numPointLights + 1; i++) {
        uniforms[`pointLights[${i}].position`] = this._gl.getUniformLocation(program, `pointLights[${i}].position`);
        uniforms[`pointLights[${i}].colorIntensity`] = this._gl.getUniformLocation(program, `pointLights[${i}].colorIntensity`);
      }
      for (let i = 1; i < material.state.numSpotLights + 1; i++) {
        uniforms[`spotLights[${i}].direction`] = this._gl.getUniformLocation(program, `spotLights[${i}].direction`);
        uniforms[`spotLights[${i}].colorIntensity`] = this._gl.getUniformLocation(program, `spotLights[${i}].colorIntensity`);
        uniforms[`spotLights[${i}].position`] = this._gl.getUniformLocation(program, `spotLights[${i}].position`);
        uniforms[`spotLights[${i}].limit`] = this._gl.getUniformLocation(program, `spotLights[${i}].limit`);
      }
    }
    
    this._programCache.set(
      material.id,
      new ProgramInfo(program, uniforms),
    );
    return this._programCache.get(material.id);
  }
  _initGeometry(geometry) {
    console.info('Renderer.js: ._initGeometry() initialized vertex array object.');
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
  _initTexture(texture) {
    console.info('Renderer.js: ._initTexture() initialized texture.');
    this._textureCache.set(texture.id, ShaderUtil.createTexture(this._gl, texture));
    return this._textureCache.get(texture.id);
  }
  _initColor(color) {
    console.info('Renderer.js: ._initColor() initialized texture.');
    this._textureCache.set(color.toHexString(), ShaderUtil.createSingleColorTexture(this._gl, ...color));
    return this._textureCache.get(color.toHexString());
  }
  _setProgram(scene, camera, material, object, lights) {
    
    let currentTextureUnit = 0;
    
    if (material.isLambertMaterial || material.isPhongMaterial) {
      Object.assign(material.state, this._state);
    }
    
    const {
      program, uniforms,
    } = this._programCache.get(material.id) || this._initMaterial(material);
    
    this._gl.useProgram(program);
    
    this._gl.uniformMatrix4fv(uniforms.u_model, false, object.worldMatrix.copyIntoFloat32Array(this._matrixF32));
    //this._gl.uniformMatrix4fv(uniforms.u_view, false, camera.viewMatrix.copyIntoFloat32Array(this._matrixF32));
    //this._gl.uniformMatrix4fv(uniforms.u_projection, false, camera.projectionMatrix.copyIntoFloat32Array(this._matrixF32));
    
    let materialTexture;
    if (material.texture) {
      materialTexture = this._textureCache.get(material.texture.id) || this._initTexture(material.texture);
    } else {
      materialTexture = this._textureCache.get(material.color.toHexString()) || this._initColor(material.color);
    }
    
    // texture unit 0 is reserved for material's texture/color
    this._gl.uniform1i(uniforms.u_texture, currentTextureUnit);
    this._gl.activeTexture(this._gl.TEXTURE0);
    
    // bind new texture
    this._gl.bindTexture(this._gl.TEXTURE_2D, materialTexture);
    
    // increment texture unit
    currentTextureUnit += 1;
    
    // lights
    if (material.isLambertMaterial || material.isPhongMaterial) {
      
      this._gl.uniform3fv(uniforms.u_ambientColor, scene.ambientColor.toFloat32ArrayNormalized(this._vectorF32));
      this._gl.uniform1f(uniforms.u_ambientIntensity, scene.ambientIntensity);
      
      const dirLights = lights.filter(object => object.isDirectionalLight);
      const pointLights = lights.filter(object => object.isPointLight);
      const spotLights = lights.filter(object => object.isSpotLight);
      
      
      //let f32 = new Float32Array(dirLights.length * 7 + pointLights.length * 7 + spotLights.length * )
      
      for (let i = 0; i < dirLights.length; i++) {
        this._gl.uniform3fv(uniforms[`dirLights[${i+1}].direction`], dirLights[i].direction.clone().normalize().toFloat32Array(this._vectorF32));
        this._gl.uniform4fv(uniforms[`dirLights[${i+1}].colorIntensity`], dirLights[i]._ci);
      }
      for (let i = 0; i < pointLights.length; i++) {
        this._gl.uniform3fv(uniforms[`pointLights[${i+1}].position`], pointLights[i].position.toFloat32Array(this._vectorF32));
        this._gl.uniform4fv(uniforms[`pointLights[${i+1}].colorIntensity`], pointLights[i]._ci);
      }
      for (let i = 0; i < spotLights.length; i++) {
        this._gl.uniform3fv(uniforms[`spotLights[${i+1}].direction`], spotLights[i].direction.clone().normalize().toFloat32Array(this._vectorF32));
        this._gl.uniform4fv(uniforms[`spotLights[${i+1}].colorIntensity`], spotLights[i]._ci);
        this._gl.uniform3fv(uniforms[`spotLights[${i+1}].position`], spotLights[i].position.toFloat32Array(this._vectorF32));
        this._gl.uniform1f(uniforms[`spotLights[${i+1}].limit`], spotLights[i].limit);
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
    // debug
    this._debugInfo.objectsDrawn = 0;
    
    this._gl.clearColor(
      ...scene.background.toArrayNormalized(), 1,
    );
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    
    // update state
    const sceneAncestors =  scene.ancestors;
    const lights = scene.ancestors.filter(object => object.isLight);
    this._state.numDirLights = lights.filter(object => object.isDirectionalLight).length;
    this._state.numPointLights = lights.filter(object => object.isPointLight).length;
    this._state.numSpotLights = lights.filter(object => object.isSpotLight).length;
    
    // debug
    this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, this._matrixUBO);
    const f32 = new Float32Array(36);
    f32.set(camera.projectionMatrix.toFloat32Array(), 0);
    f32.set(camera.viewMatrix.toFloat32Array(), 16);
    this._gl.bufferData(this._gl.UNIFORM_BUFFER, f32, this._gl.DYNAMIC_DRAW);
    
    this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, this._lightUBO);
    this._gl.bufferData(this._gl.UNIFORM_BUFFER, this._lightBuffer, this._gl.DYNAMIC_DRAW);
          
    
    
    scene.traverseAncestors(object => {
      if (object.isMesh) {
        // frustum culling with bounding spheres
        if (object.frustumCulled) {
          if (!object.geometry.boundingSphere)
            object.geometry.computeBoundingSphere();
          
          _sphere.copy(object.geometry.boundingSphere);
          _sphere.center.add(object.position);
          _sphere.center.applyMatrix4(camera.viewMatrix);
          _sphere.center.applyMatrix4(object.worldMatrix);
          
          // arbitrary scale factor to make culling more subtle
          _sphere.radius *= Math.max(...object.scale);
        }
        
        if (!object.frustumCulled || camera.frustum.intersectsSphere(_sphere)) {
          const geometry = object.geometry;
          const material = object.material;
          const vao = this._vaoCache.get(geometry.id) || this._initGeometry(geometry);
          
          this._gl.bindVertexArray(vao);
          this._setProgram(scene, camera, material, object, lights);
          
          
          this._gl.drawElements(this._gl.TRIANGLES, geometry.count, this._gl.UNSIGNED_SHORT, 0);
          
          // debugs
          this._debugInfo.objectsDrawn += 1;
        }
      }
    });
  }
  get domElement() {
    return this._domElement;
  }
  get aspectRatio() {
    return (
      this._gl.drawingBufferWidth / this._gl.drawingBufferHeight
    );
  }
  get aspectRatioNeedsUpdate() {
    return (
      this._domElement.clientWidth !== this._domElement.width ||
      this._domElement.clientHeight !== this._domElement.height
    );
  }
}

export { Renderer };