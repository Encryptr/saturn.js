import { Matrix4 } from './Matrix4.js';

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
    this.onchange = () => {};
  }
  get isVector3() {
    return true;
  }
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
    this.onchange();
  }
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
    this.onchange();
  }
  get z() {
    return this._z;
  }
  set z(value) {
    this._z = value;
    this.onchange();
  }
  get magnitude() {
    return Math.sqrt(
      this._y ** 2 +
      this._x ** 2 +
      this._z ** 2
    );
  }
  copy(v) {
    this._x = v.x;
    this._y = v.y;
    this._z = v.z;
    
    this.onchange();
    return this;
  }
  clone() {
    return new Vector3(
      this._x, this._y, this._z,
    );
  }
  set(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
    
    this.onchange();
    return this;
  }
  equals(v, tolerance = 0.01) {
    return (
      (this._x - v.x <= tolerance) &&
      (this._y - v.y <= tolerance) &&
      (this._z - v.z <= tolerance)
    );
  }
  add(v) {
    this._x += v.x;
    this._y += v.y;
    this._z += v.z;
    
    this.onchange();
    return this;
  }
  subtract(v) {
    this._x -= v.x;
    this._y -= v.y;
    this._z -= v.z;
    
    this.onchange();
    return this;
  }
  scale(s) {
    this._x *= s;
    this._y *= s;
    this._z *= s;
    
    this.onchange();
    return this;
  }
  dot(v) {
    return (
      this._x * v.x +
      this._y * v.y +
      this._z * v.z
    );
  }
  cross(v) {
    const u = this.clone();
    this._x = u.y * v.z - u.z * v.y;
    this._y = u.z * v.x - u.x * v.z;
    this._z = u.x * v.y - u.y * v.x;
    
    this.onchange();
    return this;
  }
  normalize() {
    this.scale(1/this.magnitude);
    
    this.onchange();
    return this;
  }
  angleTo(w) {
    // a * b == Math.cos(t)
    const [u, v] = [
      this.clone().normalize(),
      w.clone().normalize(),
    ];
    return Math.acos(u.dot(v));
  }
  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
    yield this._z;
  }
}

export { Vector3 };