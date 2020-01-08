import { clamp } from './misc.js';

export class Color {
  constructor(r = 0, g = 0, b = 0) {
    this._r = clamp(r, 0, 255);
    this._g = clamp(g, 0, 255);
    this._b = clamp(b, 0, 255);
  }
  set(r, g, b) {
    this._r = (r !== undefined) ? r : this._r;
    this._g = (g !== undefined) ? g : this._g;
    this._b = (b !== undefined) ? b : this._b;
    return this;
  }
  copy(color) {
    this.set(...color);
    return this;
  }
  clone() {
    return new Color(this._r, this._g, this._b);
  }
  toArray(normalized = false) {
    return [this._r, this._g, this._b].map(n => normalized ? n / 255 : n);
  }
  toFloat32Array(normalized = false, target = new Float32Array()) {
    target.set(this.toArray(normalized));
    return target;
  }
  toHexString() {
    return '0x' + (this._r << 16 | this._g << 8 | this._b).toString(16);
  }
  *[Symbol.iterator]() {
    yield this._r;
    yield this._g;
    yield this._b;
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
}