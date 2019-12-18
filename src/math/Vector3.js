import { Vector4 } from './Vector4.js';

const _v4 = new Vector4();

class Vector3 {
  constructor(x = 0, y = 0, z = 0) { // => Vector3
    this._x = x;
    this._y = y;
    this._z = z;
  }
  get isVector3() { // => boolean
    return true;
  }
  toArray() {
    return [...this];
  }
  get x() { // => number
    return this._x;
  }
  set x(value) { // => number
    this._x = value;
  }
  get y() { // => number
    return this._y;
  }
  set y(value) { // => number
    this._y = value;
  }
  get z() { // => number
    return this._z;
  }
  set z(value) { // => number
    this._z = value;
  }
  get magnitude() { // => number
    return Math.sqrt(
      this._y ** 2 +
      this._x ** 2 +
      this._z ** 2
    );
  }
  copy(v) { // => Vector3
    this._x = v.x;
    this._y = v.y;
    this._z = v.z;
    return this;
  }
  clone() { // => Vector3
    return new Vector3(
      this._x, this._y, this._z,
    );
  }
  set(x, y, z) { // => Vector3
    this._x = x;
    this._y = y;
    this._z = z;
    return this;
  }
  equals(v, tolerance = 0.001) { // => boolean
    return (
      (Math.abs(this._x - v.x) < tolerance) &&
      (Math.abs(this._y - v.y) < tolerance) &&
      (Math.abs(this._z - v.z) < tolerance)
    );
  }
  add(v) { // => Vector3
    this._x += v.x;
    this._y += v.y;
    this._z += v.z;
    return this;
  }
  subtract(v) { // => Vector3
    this._x -= v.x;
    this._y -= v.y;
    this._z -= v.z;
    return this;
  }
  addVectors(...vectors) { // => Vector3
    vectors.forEach(v => this.add(v));
    return this;
  }
  subtractVectors(...vectors) { // => Vector3
    vectors.forEach(v => this.subtract(v));
    return this;
  }
  scale(s) { // => Vector3
    this._x *= s;
    this._y *= s;
    this._z *= s;
    return this;
  }
  dot(v) { // => number
    return (
      this._x * v.x +
      this._y * v.y +
      this._z * v.z
    );
  }
  cross(v) { // => Vector3
    const u = this.clone();
    this._x = u.y * v.z - u.z * v.y;
    this._y = u.z * v.x - u.x * v.z;
    this._z = u.x * v.y - u.y * v.x;
    return this;
  }
  normalize() { // => Vector3
    this.scale(1/this.magnitude);
    return this;
  }
  angleTo(w) { // => number
    // a * b == Math.cos(t)
    const [u, v] = [
      this.clone().normalize(),
      w.clone().normalize(),
    ];
    return Math.acos(u.dot(v));
  }
  applyMatrix4(m) {
    _v4.set(...this).applyMatrix4(m);
    // divide by perspective
    this.x = _v4.x / _v4.w;
    this.y = _v4.y / _v4.w;
    this.z = _v4.z / _v4.w;
    return this;
  }
  static get X_AXIS() {
    return new Vector3(1, 0, 0);
  }
  static get Y_AXIS() {
    return new Vector3(0, 1, 0);
  }
  static get Z_AXIS() {
    return new Vector3(0, 0, 1);
  }
  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
    yield this._z;
  }
}

export { Vector3 };