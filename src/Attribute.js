export class Attribute {
  constructor(array, itemSize, normalized, dynamic) {
    this._array = array;
    this._itemSize = itemSize;
    this._normalized = normalized;
    this._dynamic = dynamic;
  }
  get isAttribute() {
    return true;
  }
  get array() {
    return this._array;
  }
  set array(array) {
    this._array = array;
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