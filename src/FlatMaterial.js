import { Material } from './Material.js';
import { Color } from './Color.js';
import vertexShader from './shaders/FlatMaterial.vert.js';
import fragmentShader from './shaders/FlatMaterial.frag.js';

class FlatMaterial extends Material {
  constructor({
    color = new Color(),
    texture = null,
  }={}) {
    super();
    this._color = color;
    this._texture = texture;
    this._vertexShader = vertexShader;
    this._fragmentShader = fragmentShader;
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
      console.warn('FlatMaterial.js: (.set color) expected color to be of type SATURN.Color.');
    }
  }
  get texture() {
    return this._texture;
  }
  set texture(texture) {
    if (texture === null || texture.isTexture) {
      this._texture = texture;
    } else {
      console.warn('FlatMaterial.js: (.set texture) expected texture to be null or of type SATURN.Texture');
    }
  }
}

export { FlatMaterial };