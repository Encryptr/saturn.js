import { Vector4 } from './Vector4.js';
import { Quaternion } from './Quaternion.js';

// utilities
const _v4 = new Vector4(0, 0, 0, 1);
const _q1 = new Quaternion(0, 0, 0, 1);
const _q2 = new Quaternion(0, 0, 0, 1);
const _q3 = new Quaternion(0, 0, 0, 1);

class Vector3 {
  constructor(x = 0, y = 0, z = 0) { // => Vector3
    this._x = x;
    this._y = y;
    this._z = z;
    this._onchange = () => {};
  }
  toArray() {
    return [...this];
  }
  toFloat32Array(target = new Float32Array(3)) {
    target.set(this.toArray());
    return target;
  }
  copy(vector) { // => Vector3
    if (vector.isVector3) {
      
      this._x = vector.x;
      this._y = vector.y;
      this._z = vector.z;
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector3: .copy() expected 'vector' to inherit from SATURN.Vector3.`);
  }
  clone() { // => Vector3
    return new Vector3(
      this._x, this._y, this._z,
    );
  }
  set(x, y, z) { // => Vector3
    this._x = (x !== undefined) ? x : this._x;
    this._y = (y !== undefined) ? y : this._y;
    this._z = (z !== undefined) ? z : this._z;
    this._onchange();
    return this;
  }
  equals(vector, tolerance = 0.001) { // => boolean
    if (vector.isVector3) {
      
      return (
        (Math.abs(this._x - vector.x) < tolerance) &&
        (Math.abs(this._y - vector.y) < tolerance) &&
        (Math.abs(this._z - vector.z) < tolerance)
      );
      
    } else throw new Error(
      `SATURN.Vector3: .equals() expected 'vector' to inherit from SATURN.Vector3.`);
  }
  _add(vector) { // => Vector3
    if (vector.isVector3) {
      
      this._x += vector.x;
      this._y += vector.y;
      this._z += vector.z;
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector3: ._add() expected 'vector' to inherit from SATURN.Vector3.`);
  }
  _sub(vector) { // => Vector3
    if (vector.isVector3) {
      
      this._x -= vector.x;
      this._y -= vector.y;
      this._z -= vector.z;
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector3: ._sub() expected 'vector' to inherit from SATURN.Vector3.`);
  }
  add(...vectors) { // => Vector3
    if (vectors.every(vector => vector.isVector3)) {
      
      vectors.forEach(v => this._add(v));
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector3: .add() expected 'vectors' to inherit from SATURN.Vector3.`);
  }
  sub(...vectors) { // => Vector3
    if (vectors.every(vector => vector.isVector3)) {
      
      vectors.forEach(v => this._sub(v));
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector3: .sub() expected 'vectors' inherit from SATURN.Vector3.`);
  }
  scale(s) { // => Vector3
    this._x *= s;
    this._y *= s;
    this._z *= s;
    this._onchange();
    return this;
  }
  dot(vector) { // => number
    if (vector.isVector3) {
      
      return (
        this._x * vector.x +
        this._y * vector.y +
        this._z * vector.z
      );
      
    } else throw new Error(
      `SATURN.Vector3: .dot() expected 'vector' to inherit from SATURN.Vector3.`);
  }
  cross(vector) { // => Vector3
    if (vector.isVector3) {
      
      const u = this.clone();
      this._x = u.y * vector.z - u.z * vector.y;
      this._y = u.z * vector.x - u.x * vector.z;
      this._z = u.x * vector.y - u.y * vector.x;
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector3: .cross() expected 'vector' to inherit from SATURN.Vector3.`);
  }
  normalize() { // => Vector3
    this.scale(1 / this.magnitude);
    this._onchange();
    return this;
  }
  angleTo(vector) { // => number
    if (vector.isVector3) {
      
      // a . b == cos(t)
      const [u, v] = [
        this.clone().normalize(),
        vector.clone().normalize(),
      ];
      return Math.acos(u.dot(v));
      
    } else throw new Error(
      `SATURN.Vector3: .angleTo() expected 'vector' to inherit from SATURN.Vector3.`);
  }
  distanceTo(vector) {
    if (vector.isVector3) {
      
      const difference = vector.clone()._sub(this);
      return difference.magnitude;
      
    } else throw new Error(
      `SATURN.Vector3: .distanceTo() expected 'vector' to inherit from SATURN.Vector3.`);
  }
  distanceToSquared(vector) {
    if (vector.isVector3) {
      
      const difference = vector.clone()._sub(this);
      return difference.magnitudeSq;
      
    } else throw new Error(
      `SATURN.Vector3: .distanceToSquared() expected 'vector' to inherit from SATURN.Vector3.`);
  }
  applyMatrix4(matrix) {
    if (matrix.isMatrix4) {
      
      _v4.set(...this, 1).applyMatrix4(matrix);
      // divide by perspective
      this.x = _v4.x / _v4.w;
      this.y = _v4.y / _v4.w;
      this.z = _v4.z / _v4.w;
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector3: .applyMatrix4() expected 'matrix' to inherit from SATURN.Matrix4.`);
  }
  applyQuaternion(quat) {
    if (quat.isQuaternion) {
      
      _q1.copy(quat);
      _q2.set(this._x, this._y, this._z, 0);
      _q3.copy(_q1.conjugate);
      _q1.multiply(_q2).multiply(_q3);
      this._x = _q1.x;
      this._y = _q1.y;
      this._z = _q1.z;
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector3: .applyQuaternion() expected 'quat' to inherit from SATURN.Quaternion.`);
  }
  rotateOnAxis(axis, angle) {
    if (axis.isVector3) {
      
      _q1.setFromAxisAngle(axis, angle);
      this.applyQuaternion(_q1);
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector3: .rotateOnAxis() expected 'axis' to inherit from SATURN.Vector3.`);
  }
  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
    yield this._z;
  }
  get isVector3() { // => boolean
    return true;
  }
  get onchange() {
    return this._onchange;
  }
  set onchange(func) {
    if (typeof func === 'function') {
      this._onchange = func;
    } else throw new Error(
      `SATURN.Vector3: .set onchange() expected 'func' to be of type 'function'.`);
  }
  get x() { // => number
    return this._x;
  }
  set x(value) { // => number
    this._x = value;
    this._onchange();
  }
  get y() { // => number
    return this._y;
  }
  set y(value) { // => number
    this._y = value;
    this._onchange();
  }
  get z() { // => number
    return this._z;
  }
  set z(value) { // => number
    this._z = value;
    this._onchange();
  }
  get magnitude() { // => number
    return Math.sqrt(
      this._y ** 2 +
      this._x ** 2 +
      this._z ** 2
    );
  }
  get magnitudeSq() {
    return (
      this._y ** 2 +
      this._x ** 2 +
      this._z ** 2
    );
  }
}

export { Vector3 };