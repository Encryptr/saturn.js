import { Material } from './Material.js';
import vertexShader from './shaders/FlatMaterial.vert.js';
import fragmentShader from './shaders/FlatMaterial.frag.js';

export class FlatMaterial extends Material {
  constructor(options) {
    super(options);
    this._vertexShader = vertexShader;
    this._fragmentShader = fragmentShader;
    this._uniforms = [
      'u_model',
      'u_texture',
    ];
  }
  get isFlatMaterial() {
    return true;
  }
}