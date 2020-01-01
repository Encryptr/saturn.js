import { clamp } from './misc.js';

class Color {
  constructor(r = 0, g = 0, b = 0) {
    this._r = clamp(r, 0, 255);
    this._g = clamp(g, 0, 255);
    this._b = clamp(b, 0, 255);
    this._onchange = () => {};
  }
  get isColor() {
    return true;
  }
  get onchange() {
    return this.onchange;
  }
  set onchange(func) {
    if (typeof func === 'function') {
      this._onchange = func;
    } else {
      console.warn('Vector3.js: (.set onchange) expected func to be of type function.');
    }
  }
  get colorId() {
    return (this._r << 16 | this._g << 8 | this._b).toString(16);
  }
  get r() {
    return this._r;
  }
  set r(value) {
    this._r = clamp(value, 0, 255);
    this._onchange();
  }
  get g() {
    return this._g;
  }
  set g(value) {
    this._g = clamp(value, 0, 255);
    this._onchange();
  }
  get b() {
    return this._b;
  }
  set b(value) {
    this._b = clamp(value, 0, 255);
    this._onchange();
  }
  set(r, g, b) {
    this._r = (r !== undefined) ? r : this._r;
    this._g = (g !== undefined) ? g : this._g;
    this._b = (b !== undefined) ? b : this._b;
    this._onchange();
    return this;
  }
  copy(color) {
    if (color.isColor) {
      this.set(...color);
      this._onchange();
    } else {
      console.warn('Color.js: (.copy) expected color to be of type SATURN.Color.');
    }
  }
  toArray() {
    return [this._r, this._g, this._b];
  }
  toFloat32Array() {
    return new Float32Array(this.toArray());
  }
  toArrayNormalized() {
    return this.toArray().map(n => n / 255);
  }
  toFloat32ArrayNormalized() {
    return new Float32Array(this.toArrayNormalized());
  }
  copyIntoFloat32ArrayNormalized(typedArray) {
    typedArray.set([...this.toArrayNormalized()]);
    return typedArray;
  }
  *[Symbol.iterator]() {
    yield this._r;
    yield this._g;
    yield this._b;
  }
}

export { Color };