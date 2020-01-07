import { clamp } from './misc.js';

class Color {
  constructor(r = 0, g = 0, b = 0) {
    this._r = clamp(r, 0, 255);
    this._g = clamp(g, 0, 255);
    this._b = clamp(b, 0, 255);
    this._onchange = () => {};
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
      return this;
      
    } else throw new Error(
      `SATURN.Color: .copy() expected 'color' to inherit from SATURN.Color.`);
  }
  clone() {
    return new Color(
      this._r, this._g, this._b,
    );
  }
  toArray() {
    return [this._r, this._g, this._b];
  }
  toFloat32Array(target = new Float32Array()) {
    target.set(this.toArray());
    return target;
  }
  toArrayNormalized() {
    return this.toArray().map(n => n / 255);
  }
  toFloat32ArrayNormalized(target = new Float32Array(3)) {
    target.set(this.toArrayNormalized());
    return target;
  }
  *[Symbol.iterator]() {
    yield this._r;
    yield this._g;
    yield this._b;
  }
  get isColor() {
    return true;
  }
  get onchange() {
    return this._onchange;
  }
  set onchange(func) {
    if (typeof func === 'function')
      this._onchange = func;
    else throw new Error(
      `SATURN.Color: .set onchange() expected 'func' to be of type 'function'.`);
  }
  toHexString() {
    return '0x' + (this._r << 16 | this._g << 8 | this._b).toString(16);
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
}

export { Color };