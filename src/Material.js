import { generateKey } from './misc.js';

class Material {
  constructor() {
    this._id = generateKey();
    this._vertexShader = '';
    this._fragmentShader = '';
    this._uniforms = [];
    this._customUniforms = {};
  }
  get isMaterial() {
    return true;
  }
  get id() {
    return this._id;
  }
  get vertexShader() {
    return this._vertexShader;
  }
  set vertexShader(text) {
    this._vertexShader = text;
    this._id = generateKey();
  }
  get fragmentShader() {
    return this._fragmentShader;
  }
  set fragmentShader(text) {
    this._fragmentShader = text;
    this._id = generateKey();
  }
  get uniforms() {
    return [...this._uniforms];
  }
}

export { Material };