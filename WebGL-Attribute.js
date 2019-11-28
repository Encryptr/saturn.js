class Attribute {
  constructor(array, itemSize, normalized) {
    this._array = null;
    this._itemSize = itemSize;
    this.normalized = normalized;
    this.array = array;
  }
  get array() {
    return this._array;
  }
  set array(array) {
    if (array.length % this._itemSize !== 0) {
      console.warn('Attribute.js: .set array: array.length is not a multiple of itemsize', array);
    }
    this._array = array;
  }
  get itemSize() {
    return this._itemSize;
  }
  set itemSize(val) {
    if (this._array.length % val !== 0) {
      console.warn('Attribute.js: .set itemSize: this._array.length is not divisible by value', val);
    }
    this._itemSize = val;
  }
}

export { Attribute };