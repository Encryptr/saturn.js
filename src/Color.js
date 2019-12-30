import { clamp } from './misc.js';

class Color {
  constructor(r = 0, g = 0, b = 0) {
    this._r = clamp(r, 0, 255);
    this._g = clamp(g, 0, 255);
    this._b = clamp(b, 0, 255);
  }
  get isColor() {
    return true;
  }
  get r() {
    return this._r;
  }
  set r(value) {
    this._r = clamp(value, 0, 255);
  }
  get g() {
    return this._g;
  }
  set g(value) {
    this._g = clamp(value, 0, 255);
  }
  get b() {
    return this._b;
  }
  set b(value) {
    this._b = clamp(value, 0, 255);
  }
  set(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  copy(color) {
    if (color.isColor) {
      this.set(...color);
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
  *[Symbol.iterator]() {
    yield this._r;
    yield this._g;
    yield this._b;
  }
}

export { Color };