import { Sphere } from './math/Sphere.js';
import { Cache } from './Cache.js';

// utility variables
const _sphere = new Sphere();

// utility class for caching
class ProgramInfo {
  constructor(program, uniforms) {
    this.program = program;
    this.uniforms = uniforms;
  }
}

// max lights per category (directional, point, spot)
const MAX_LIGHTS = 32;

// GLSL structs are padded to a multiple of 16 bytes
const BYTES_PER_DIR_LIGHT = 32;
const BYTES_PER_POINT_LIGHT = 32;
const BYTES_PER_SPOTLIGHT = 48;

/**
 * 'float' is just an alias for 4 bytes
 * not all floats are used, but still need to account for
 * extra memory as a result of padding in the shader
 */
const FLOATS_PER_DIR_LIGHT = 8;
const FLOATS_PER_POINT_LIGHT = 8;
const FLOATS_PER_SPOTLIGHT = 12;

// UBO constants
const MATRICES_BINDING_INDEX = 0;
const LIGHTS_BINDING_INDEX = 1;
const MATRICES_BYTE_LENGTH = 128;
const LIGHTS_BYTE_LENGTH = 3600;

export class WebGL2Renderer {
  constructor(domElement = document.createElement('canvas')) {
    this._domElement = domElement;
    
    // GL setup
    this._gl = domElement.getContext('webgl2');
    if (!this._gl)
      throw new Error('SATURN.WebGL2Renderer: .constructor() could not initialize WebGL2RenderingContext.');
    
    this._gl.enable(this._gl.CULL_FACE);
    this._gl.enable(this._gl.DEPTH_TEST);
    
    // caches
    this._vaoCache = new Cache();
    this._programInfoCache = new Cache();
    this._textureCache = new Cache();
    
    // allocate Float32Arrays
    this._mat4 = new Float32Array(16);
    this._vec4 = new Float32Array(4);
    this._vec3 = new Float32Array(3);
    
    // uniform buffer objects
    this._matrixUBO = this._gl.createBuffer();
    this._lightsUBO = this._gl.createBuffer();
    this._gl.bindBufferRange(this._gl.UNIFORM_BUFFER, MATRICES_BINDING_INDEX, this._matrixUBO, 0, MATRICES_BYTE_LENGTH);
    this._gl.bindBufferRange(this._gl.UNIFORM_BUFFER, LIGHTS_BINDING_INDEX, this._lightsUBO, 0, LIGHTS_BYTE_LENGTH);
    
    // single buffer that can be uploaded to the GPU
    this._matrixBuffer = new Float32Array(32); // 2 matrices, 16 elements each
    this._lightsBuffer = new ArrayBuffer(
      MAX_LIGHTS * (BYTES_PER_DIR_LIGHT + BYTES_PER_POINT_LIGHT + BYTES_PER_SPOTLIGHT) + 16 // byte length, +16 bytes is for extra integer data
    );
    
    // create multiple views into main buffer to provide easier access
    this._dirLightsView = new Float32Array(
      this._lightsBuffer,
      0, // byte offset
      MAX_LIGHTS * FLOATS_PER_DIR_LIGHT, // length in floats
    );
    this._pointLightsView = new Float32Array(
      this._lightsBuffer,
      MAX_LIGHTS * BYTES_PER_DIR_LIGHT, // byte offset
      MAX_LIGHTS * FLOATS_PER_POINT_LIGHT, // length in floats
    );
    this._spotlightsView = new Float32Array(
      this._lightsBuffer,
      MAX_LIGHTS * (BYTES_PER_DIR_LIGHT + BYTES_PER_POINT_LIGHT), // byte offset
      MAX_LIGHTS * FLOATS_PER_SPOTLIGHT, // length in floats
    );
    this._integerView = new Uint32Array(
      this._lightsBuffer,
      MAX_LIGHTS * (BYTES_PER_DIR_LIGHT + BYTES_PER_POINT_LIGHT + BYTES_PER_SPOTLIGHT), // byte offset
      4, // space for 4 integers, only 3 will be used
    );
    
    // state
    this._currentRenderState = {
      directionalLights: 0,
      pointLights: 0,
      spotlights: 0,
    };
    
    // debug
    this.debugInfo = {
      drawCalls: 0,
    };
  }
  
  // (!) only call when aspect ratio needs to be updated
  updateAspectRatio() {
    this._domElement.width = this._domElement.clientWidth;
    this._domElement.height = this._domElement.clientHeight;
    this._gl.viewport(
      0, 0, this._domElement.width, this._domElement.height
    );
  }
  
  // sensitive methods, should not be called externally
  
  _createVao(geometry) {
    console.info('SATURN.WebGL2Renderer: ._createVao() initialized a WebGLVertexArrayObject.');
    
    const vao = this._gl.createVertexArray();
    this._gl.bindVertexArray(vao);
    
    // initialize attributes
    for (const location in geometry.attributes) {
      const attribute = geometry.attributes[location];
      
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._gl.createBuffer());
      this._gl.bufferData(this._gl.ARRAY_BUFFER, attribute.array, this._gl.STATIC_DRAW);
      
      this._gl.enableVertexAttribArray(location);
      this._gl.vertexAttribPointer(location, attribute.itemSize, this._gl.FLOAT, attribute.normalized, 0, 0);
    }
    
    // initialize indices
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._gl.createBuffer());
    this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, geometry.index, this._gl.STATIC_DRAW);
    
    this._gl.bindVertexArray(null);
    this._vaoCache.set(geometry.id, vao);
    return vao;
  }
  
  _createTexture(texture) {
    console.info('SATURN.WebGL2Renderer: ._createTexture() initialized a WebGLTexture.');
    this._textureCache.set(texture.id, createTexture(this._gl, texture));
    return this._textureCache.get(texture.id);
  }
  
  _createColor(color) {
    console.info('SATURN.WebGL2Renderer: ._createColor() initialized a WebGLTexture.');
    this._textureCache.set(color.toHexString(), createColorTexture(this._gl, color));
    return this._textureCache.get(color.toHexString());
  }
  
  _createProgramInfo(material) {
    console.info('SATURN.WebGL2Renderer: ._createProgramInfo() initialized a WebGLProgram.');
    
    const program = createProgram(this._gl, material.vertexShader, material.fragmentShader);
    
    const uniforms = {};
    for (const name of material.uniforms)
      uniforms[name] = this._gl.getUniformLocation(program, name);
      
    // link UBOs to program
    const matricesIndex = this._gl.getUniformBlockIndex(program, 'Matrices');
    this._gl.uniformBlockBinding(program, MATRICES_BINDING_INDEX, matricesIndex);
    const lightsIndex = this._gl.getUniformBlockIndex(program, 'Lights');
    this._gl.uniformBlockBinding(program, LIGHTS_BINDING_INDEX, lightsIndex);
    
    const info = new ProgramInfo(program, uniforms);
    this._programInfoCache.set(material.id, info);
    return info;
  }
  
  _updateMatrixUBO(camera) {
    this._matrixBuffer.set(camera.projectionMatrix.toArray(), 0);
    this._matrixBuffer.set(camera.viewMatrix.toArray(), 16);
    this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, this._matrixUBO);
    this._gl.bufferData(this._gl.UNIFORM_BUFFER, this._matrixBuffer, this._gl.DYNAMIC_DRAW);
    this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, null);
  }
  
  _updateLightsUBO(lights) {
    /**
     * directional light internal memory layout (32 bytes total):
     *   colorIntensity.r, colorIntensity.g, colorIntensity.b, colorIntensity.w, -> 16 bytes
     *   direction.x, direction.y, direction.z, 0,                               -> 16 bytes
     *
     * point light internal memory layout (32 bytes total):
     *   colorIntensity.r, colorIntensity.g, colorIntensity.b, colorIntensity.w, -> 16 bytes
     *   position.x, position.y, position.z, 0,                                  -> 16 bytes
     *
     * spotlight internal memory layout (48 bytes total):
     *   colorIntensity.r, colorIntensity.g, colorIntensity.b, colorIntensity.w, -> 16 bytes
     *   direction.x, direction.y, direction.z, 0,                               -> 16 bytes
     *   position.x, position.y, position.z, limit                               -> 16 bytes
     */
    
    const dirLights = lights.filter(light => light.isDirectionalLight);
    const pointLights = lights.filter(light => light.isPointLight);
    const spotlights = lights.filter(light => light.isSpotLight);
    
    this._dirLightsView.fill(0);
    this._pointLightsView.fill(0);
    this._spotlightsView.fill(0);
    this._integerView.fill(0);
    let light;
    
    for (let i = 0; i < dirLights.length; i++) {
      light = dirLights[i];
      this._dirLightsView.set([
        ...light.color.toArrayNormalized(), light.intensity, // 16 bytes
        ...light.direction, 0,                               // 16 bytes
      ], i * FLOATS_PER_DIR_LIGHT);
    }
    
    for (let i = 0; i < pointLights.length; i++) {
      light = pointLights[i];
      this._pointLightsView.set([
        ...light.color.toArrayNormalized(), light.intensity, // 16 bytes
        ...light.position, 0,                                // 16 bytes
      ], i * FLOATS_PER_POINT_LIGHT);
    }
    
    for (let i = 0; i < spotlights.length; i++) {
      light = spotlights[i];
      this._spotlightsView.set([
        ...light.color.toArrayNormalized(), light.intensity, // 16 bytes
        ...light.direction, 0,                               // 16 bytes
        ...light.position, light.limit,                      // 16 bytes
      ], i * FLOATS_PER_SPOTLIGHT);
    }
    
    this._integerView[0] = dirLights.length; // u_numDirLights
    this._integerView[1] = pointLights.length; // u_numPointLights
    this._integerView[2] = spotlights.length; // u_numSpotlights
    
    this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, this._lightsUBO);
    this._gl.bufferData(this._gl.UNIFORM_BUFFER, this._lightsBuffer, this._gl.DYNAMIC_DRAW);
    this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, null);
  }
  
  render(scene, camera) {
    this.debugInfo.drawCalls = 0;
    
    // categorize RenderObjects
    const ancestors = scene.ancestors;
    const meshes = ancestors.filter(object => object.isMesh);
    const lights = ancestors.filter(object => object.isLight);
    
    // update UBOs
    this._updateMatrixUBO(camera);
    this._updateLightsUBO(lights);
    
    this._gl.clearColor(...scene.background.toArrayNormalized(), 1);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    
    // main rendering loop
    let mesh;
    for (let i = 0; i < meshes.length; i++) {
      mesh = meshes[i];
      const geometry = mesh.geometry;
      const material = mesh.material;
      
      const vao = this._vaoCache.get(geometry.id) || this._createVao(geometry);
      this._gl.bindVertexArray(vao);
      const {program, uniforms} = this._programInfoCache.get(material.id) || this._createProgramInfo(material);
      this._gl.useProgram(program);
      
      // model matrix
      this._gl.uniformMatrix4fv(uniforms.u_model, false, mesh.worldMatrix.toFloat32Array(this._mat4));
      
      // scene ambience
      this._gl.uniform3fv(uniforms.u_ambientColor, scene.ambientColor.toFloat32ArrayNormalized(this._vec3));
      this._gl.uniform1f(uniforms.u_ambientIntensity, scene.ambientIntensity);
      
      // material texture
      let texture;
      if (material.texture) {
        texture = this._textureCache.get(material.texture.id) || this._createTexture(material.texture);
      } else {
        texture = this._textureCache.get(material.color.toHexString()) || this._createColor(material.color);
      }
      this._gl.uniform1i(uniforms.u_texture, 0);
      this._gl.activeTexture(this._gl.TEXTURE0);
      this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
      
      // shininess and specular color
      if (material.isPhongMaterial) {
        this._gl.uniform1f(uniforms.u_shininess, material.shininess);
        this._gl.uniform3fv(uniforms.u_specularColor, material.specularColor.toFloat32ArrayNormalized(this._vec3));
      }
      
      this._gl.drawElements(this._gl.TRIANGLES, geometry.count, this._gl.UNSIGNED_SHORT, 0);
      this.debugInfo.drawCalls += 1;
    }
  }
  
  get domElement() {
    return this._domElement;
  }
  
  get aspectRatio() {
    return this._domElement.clientWidth / this._domElement.clientHeight;
  }
  
  get aspectRatioNeedsUpdate() {
    return (
      this._domElement.width !== this._domElement.clientWidth ||
      this._domElement.height !== this._domElement.clientHeight
    );
  }
}

// utility functions

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  } else {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message);
  }
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  } else {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(message);
  }
}

function createTexture(gl, texture) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(
    gl.TEXTURE_2D,       // target
    0,                   // mip level
    gl.RGBA,             // internal format
    gl.RGBA,             // format
    gl.UNSIGNED_BYTE,    // type
    texture.image, // data
  );
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[texture.wrapS.description]);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[texture.wrapT.description]);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[texture.minFilter.description]);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[texture.magFilter.description]);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}

function createColorTexture(gl, color) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(
    gl.TEXTURE_2D,                   // target
    0,                               // level
    gl.RGB,                          // internal format
    1,                               // width
    1,                               // height
    0,                               // border
    gl.RGB,                          // format
    gl.UNSIGNED_BYTE,                // type
    new Uint8Array(color.toArray()), // data
  );
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}