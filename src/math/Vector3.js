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
  toFloat32Array() {
    return new Float32Array(this.toArray());
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
  copy(vector) { // => Vector3
    if (vector.isVector3) {
      this._x = vector.x;
      this._y = vector.y;
      this._z = vector.z;
    } else {
      console.warn('Vector3.js: (.copy) expected vector to be of type SATURN.Vector3.');
    }
    return this;
  }
  clone() { // => Vector3
    return new Vector3(
      this._x, this._y, this._z,
    );
  }
  set(x, y, z) { // => Vector3
    this._x = x || this._x;
    this._y = y || this._y;
    this._z = z || this._z;
    return this;
  }
  equals(vector, tolerance = 0.001) { // => boolean
    if (vector.isVector3) {
      return (
        (Math.abs(this._x - vector.x) < tolerance) &&
        (Math.abs(this._y - vector.y) < tolerance) &&
        (Math.abs(this._z - vector.z) < tolerance)
      );
    } else {
      console.warn('Vector3.js: (.equals) expected vector to be of type SATURN.Vector3.');
      return false;
    }
  }
  _add(vector) { // => Vector3
    if (vector.isVector3) {
      this._x += vector.x;
      this._y += vector.y;
      this._z += vector.z;
    } else {
      console.warn('Vector3.js: (._add) expected vector to be of type SATURN.Vector3.');
    }
    return this;
  }
  _sub(vector) { // => Vector3
    if (vector.isVector) {
      this._x -= vector.x;
      this._y -= vector.y;
      this._z -= vector.z;
    } else {
      console.warn('Vector3.js: (._sub) expected vector to be of type SATURN.Vector3.');
    }
    return this;
  }
  add(...vectors) { // => Vector3
    if (vectors.every(vector => vector.isVector3)) {
      vectors.forEach(v => this._add(v));
    } else {
      console.warn('Vector3.js: (.add) expected vectors to be of type SATURN.Vector3.');
    }
    return this;
  }
  sub(...vectors) { // => Vector3
    if (vectors.every(vector => vector.isVector3)) {
      vectors.forEach(v => this._sub(v));
    } else {
      console.warn('Vector3.js: (.sub) expected vectors to be of type SATURN.Vector3.');
    }
    return this;
  }
  scale(s) { // => Vector3
    this._x *= s;
    this._y *= s;
    this._z *= s;
    return this;
  }
  dot(vector) { // => number
    if (vector.isVector3) {
      return (
        this._x * vector.x +
        this._y * vector.y +
        this._z * vector.z
      );
    } else {
      console.warn('Vector3.js: (.dot) expected vector to be of type SATURN.Vector3.');
      return NaN;
    }
  }
  cross(vector) { // => Vector3
    if (vector.isVector3) {
      const u = this.clone();
      this._x = u.y * vector.z - u.z * vector.y;
      this._y = u.z * vector.x - u.x * vector.z;
      this._z = u.x * vector.y - u.y * vector.x;
    } else {
      console.warn('Vector3.js: (.cross) expected vector to be of type SATURN.Vector3.');
    }
    return this;
  }
  normalize() { // => Vector3
    this.scale(1/this.magnitude);
    return this;
  }
  angleTo(vector) { // => number
    if (vector.isVector3) {
      // a * b == Math.cos(t)
      const [u, v] = [
        this.clone().normalize(),
        vector.clone().normalize(),
      ];
      return Math.acos(u.dot(v));
    } else {
      console.warn('Vector3.js: (.angleTo) expected vector to be of type SATURN.Vector3.');
      return NaN;
    }
  }
  applyMatrix4(matrix) {
    if (matrix.isMatrix4) {
      _v4.set(...this).applyMatrix4(matrix);
      
      // divide by perspective
      this.x = _v4.x / _v4.w;
      this.y = _v4.y / _v4.w;
      this.z = _v4.z / _v4.w;
    } else {
      console.warn('Vector3.js: (.applyMatrix4) expected matrix to be of type SATURN.Matrix4.');
    }
    return this;
  }
  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
    yield this._z;
  }
}

export { Vector3 };