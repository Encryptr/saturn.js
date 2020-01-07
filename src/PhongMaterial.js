import { Material } from './Material.js';
import { generateKey } from './misc.js';
import { Color } from './Color.js';
import vertexShader from './shaders/PhongMaterial.vert.js';
import fragmentShader from './shaders/PhongMaterial.frag.js';

class PhongMaterial extends Material {
  constructor({
    color = new Color(0, 0, 0),
    texture = null,
    shininess = 0,
    specularColor = new Color(255, 255, 255),
  }={}) {
    super();
    this._color = color;
    this._texture = texture;
    this._shininess = shininess;
    this._specularColor = specularColor;
    this._vertexShader = vertexShader;
    this._fragmentShader = fragmentShader;
    this._uniforms = [
      'u_model',
      'u_view',
      'u_projection',
      'u_texture',
      'u_ambientColor',
      'u_ambientIntensity',
      'u_shininess',
      'u_specularColor',
    ];
  }
  get isPhongMaterial() {
    return true;
  }
  get color() {
    return this._color;
  }
  set color(color) {
    if (color.isColor) {
      this._color = color;
    } else {
      console.warn('PhongMaterial.js: (.set color) expected color to be of type SATURN.Color.');
    }
  }
  get texture() {
    return this._texture;
  }
  set texture(texture) {
    if (texture === null || texture.isTexture) {
      this._texture = texture;
    } else {
      console.warn('PhongMaterial.js: (.set texture) expected texture to be null or of type SATURN.Texture');
    }
  }
  get shininess() {
    return this._shininess
  }
  set shininess(value) {
    this._shininess = value;
  }
  get specularColor() {
    return this._specularColor;
  }
  set specularColor(color) {
    if (color.isColor) {
      this._specularColor = color;
    } else {
      console.warn('PhongMaterial.js: (.set specularColor) expected color to be of type SATURN.Color.');
    }
  }
}

export { PhongMaterial };