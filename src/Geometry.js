import { generateKey } from './misc.js';

class Geometry {
  constructor() {
    this._id = generateKey();
    this._attributes = {};
    this._index = null;
  }
  get isGeometry() {
    return true;
  }
  get id() {
    return this._id;
  }
  get count() {
    return this._index.length;
  }
  get attributes() {
    return this._attributes;
  }
  get index() {
    return this._index;
  }
  set index(array) {
    if (array instanceof Uint16Array) {
      this._index = array;
    } else {
      console.warn('Geometry.js: (.set index) expected array to be of type Uint16Array.');
    }
  }
  get position() {
    return this._attributes[0];
  }
  set position(attribute) {
    if (attribute.isAttribute) {
      this._attributes[0] = attribute;
    } else {
      console.warn('Geometry.js: (.set position) expected attribute to be of type SATURN.Attribute.');
    }
  }
  get uv() {
    return this._attributes[1];
  }
  set uv(attribute) {
    if (attribute.isAttribute) {
      this._attributes[1] = attribute;
    } else {
      console.warn('Geometry.js: (.set uv) expected attribute to be of type SATURN.Attribute.');
    }
  }
  get normal() {
    return this._attributes[2];
  }
  set normal(attribute) {
    if (attribute.isAttribute) {
      this._attributes[2] = attribute;
    } else {
      console.warn('Geometry.js: (.set normal) expected attribute to be of type SATURN.Attribute.');
    }
  }
}

export { Geometry };