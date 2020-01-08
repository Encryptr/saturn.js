import { Material } from './Material.js';
import { Color } from './Color.js';
import vertexShader from './shaders/PhongMaterial.vert.js';
import fragmentShader from './shaders/PhongMaterial.frag.js';

export class PhongMaterial extends Material {
  constructor({
    color = new Color(0, 0, 0),
    texture = null,
    shininess = 0,
    specularColor = new Color(255, 255, 255),
  } = {}) {
    super({color, texture});
    this._shininess = shininess;
    this._specularColor = specularColor;
    this._vertexShader = vertexShader;
    this._fragmentShader = fragmentShader;
    this._uniforms = [
      'u_model',
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
    this._specularColor = color;
  }
}