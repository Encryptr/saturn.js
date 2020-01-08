import { Material } from './Material.js';
import vertexShader from './shaders/LambertMaterial.vert.js';
import fragmentShader from './shaders/LambertMaterial.frag.js';

export class LambertMaterial extends Material {
  constructor(options) {
    super(options);
    this._vertexShader = vertexShader;
    this._fragmentShader = fragmentShader;
    this._uniforms = [
      'u_model',
      'u_texture',
      'u_ambientColor',
      'u_ambientIntensity',
    ];
  }
  get isLambertMaterial() {
    return true;
  }
}