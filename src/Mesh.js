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
  set geometry(geometry) {
    if (geometry.isGeometry) {
      this._geometry = geometry;
    } else {
      console.warn('Mesh.js: (.set geometry) expected geometry to be of type SATURN.Geometry.');
    }
  }
  get material() {
    return this._material;
  }
  set material(material) {
    if (material.isMaterial) {
      this._material = material;
    } else {
      console.warn('Mesh.js: (.set material) expected material to be of type SATURN.Material.');
    }
  }
}

export { Mesh };