import { Color } from './Color.js';

export class Material {
  constructor({
    color = new Color(),
    texture = null,
  } = {}) {
    this._id = Symbol();
    this._vertexShader = '';
    this._fragmentShader = '';
    this._uniforms = [];
    this._color = color;
    this._texture = texture;
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
  get fragmentShader() {
    return this._fragmentShader;
  }
  get uniforms() {
    return [...this._uniforms];
  }
  get color() {
    return this._color;
  }
  set color(color) {
    this._color = color;
  }
  get texture() {
    return this._texture;
  }
  set texture(texture) {
    this._texture = texture;
  }
}