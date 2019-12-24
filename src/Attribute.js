class Attribute {
  constructor(array, itemSize, normalized, dynamic) {
    // declare
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
  set array(a) {
    if (ArrayBuffer.isView(a) && a.length % this._itemSize === 0) {
      this._array = a;
    }
  }
  get itemSize() {
    return this._itemSize;
  }
  get normalized() {
    return this._normalized;
  }
  set normalized(b) {
    this._normalized = b;
  }
  get dynamic() {
    return this._dynamic;
  }
  set dynamic(b) {
    this._dynamic = b;
  }
}

export { Attribute };