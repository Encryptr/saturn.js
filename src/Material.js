import { generateKey } from './misc.js';
import { Color } from './Color.js';
import CORE_VERTEX from './CORE_VERTEX.glsl.js';
import CORE_FRAGMENT from './CORE_FRAGMENT.glsl.js';

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
  }
  get fragmentShader() {
    return this._fragmentShader;
  }
  set fragmentShader(text) {
    this._fragmentShader = text;
  }
  get uniforms() {
    return [...this._uniforms];
  }
}

class FlatMaterial extends Material {
  constructor({
    color = new Color(),
    texture = null,
  }={}) {
    super();
    this._color = color;
    this._texture = texture;
    this._vertexShader = CORE_VERTEX;
    this._fragmentShader = CORE_FRAGMENT;
    this._uniforms = [
      'u_model',
      'u_view',
      'u_projection',
      'u_texture',
    ];
  }
  get isFlatMaterial() {
    return true;
  }
  get color() {
    return this._color;
  }
  set color(color) {
    if (color.isColor) {
      this._color = color;
    } else {
      console.warn('Material.js: (.set color) expected color to be of type SATURN.Color.');
    }
  }
  get texture() {
    return this._texture;
  }
  set texture(texture) {
    if (texture === null || texture.isTexture) {
      this._texture = texture;
    } else {
      console.warn('Material.js: (.set texture) expected texture to be null or of type SATURN.Texture');
    }
  }
}

export { Material, FlatMaterial };