import { RenderObject } from './RenderObject.js';

export class Mesh extends RenderObject {
  constructor(geometry, material) {
    super();
    this._geometry = geometry;
    this._material = material;
  }
  get isMesh() {
    return true;
  }
  get geometry() {
    return this._geometry;
  }
  set geometry(geometry) {
    this._geometry = geometry;
  }
  get material() {
    return this._material;
  }
  set material(material) {
    this._material = material;
  }
}