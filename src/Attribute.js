class Attribute {
  constructor(array, itemSize, normalized, dynamic) {
    this._array = null;
    
    this._itemSize = itemSize;
    this._normalized = normalized;
    this._dynamic = dynamic;
    
    this.array = array;
  }
  get isAttribute() {
    return true;
  }
  get array() {
    return this._array;
  }
  set array(array) {
    if (ArrayBuffer.isView(array)) {
      if (array.length % this._itemSize === 0) {
        this._array = array;
      } else {
        console.warn(`Attribute.js: (.set array) expected array.length to be a multiple of ${this._itemSize}.`);
      }
    } else {
      console.warn('Attribute.js: (.set array) expected array to be of type TypedArray.');
    }
  }
  get itemSize() {
    return this._itemSize;
  }
  get normalized() {
    return this._normalized;
  }
  set normalized(boolean) {
    this._normalized = boolean;
  }
  get dynamic() {
    return this._dynamic;
  }
  set dynamic(boolean) {
    this._dynamic = boolean;
  }
}

export { Attribute };