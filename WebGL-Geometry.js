import { POSITION } from './WebGL-constants.js';

class Geometry {
  constructor() {
    this._attributes = {};
  }
  get count() {
    if (POSITION in this._attributes) {
      const position = this._attributes[POSITION];
      return position.array.length / position.itemSize;
    }
    console.warn('Geometry.js: .count could not find POSITION in attributes', this);
    return 0; // default
  }
  getAttribute(name) {
    return this._attributes[name];
  }
  addAttribute(name, attribute) {
    this._attributes[name] = attribute;
  }
  removeAttribute(name) {
    delete this._attributes[name];
  }
}

export { Geometry };