export class Geometry {
  constructor() {
    this._id = Symbol();
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
    this._index = array;
  }
  get position() {
    return this._attributes[0];
  }
  set position(attribute) {
    this._attributes[0] = attribute;
    this._id = Symbol(); // generate new ID so that VAO is created again
  }
  get uv() {
    return this._attributes[1];
  }
  set uv(attribute) {
    this._attributes[1] = attribute;
    this._id = Symbol(); // generate new ID so that VAO is created again
  }
  get normal() {
    return this._attributes[2];
  }
  set normal(attribute) {
    this._attributes[2] = attribute;
    this._id = Symbol(); // generate new ID so that VAO is created again
  }
}