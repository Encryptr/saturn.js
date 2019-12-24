const Geometry = (function() {
  let geometryId = 0;
  return class Geometry {
    constructor() {
      this._id = geometryId++;
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
    set index(a) {
      this._index = a;
    }
    get position() {
      return this._attributes[0] || false;
    }
    set position(attribute) {
      this._attributes[0] = attribute;
    }
  }
}());

export { Geometry };