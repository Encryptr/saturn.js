import { RenderObject } from './RenderObject.js';

class Mesh extends RenderObject {
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
  set geometry(g) {
    this._geometry = g;
  }
  get material() {
    return this._material;
  }
  set material(m) {
    this._material = m;
  }
}

export { Mesh };