import { Vector4 } from './Vector4.js';
import { Quaternion } from './Quaternion.js';

let _v4 = new Vector4(0, 0, 0, 1);
let _q1 = new Quaternion(0, 0, 0, 1);
let _q2 = new Quaternion(0, 0, 0, 1);
let _q3 = new Quaternion(0, 0, 0, 1);

export class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._onchange = () => {};
  }
  
  // Methods
  toArray() {
    return [...this];
  }
  toFloat32Array(target = new Float32Array(3)) {
    target.set(this.toArray());
    return target;
  }
  copy(vector) {
    this._x = vector.x;
    this._y = vector.y;
    this._z = vector.z;
    
    this._onchange();
    return this;
  }
  clone() {
    return new Vector3(this._x, this._y, this._z);
  }
  set(x, y, z) {
    this._x = (x !== undefined) ? x : this._x;
    this._y = (y !== undefined) ? y : this._y;
    this._z = (z !== undefined) ? z : this._z;
    
    this._onchange();
    return this;
  }
  equals(vector, tolerance = 0.001) {
    return (
      (Math.abs(this._x - vector.x) < tolerance) &&
      (Math.abs(this._y - vector.y) < tolerance) &&
      (Math.abs(this._z - vector.z) < tolerance)
    );
  }
  add(vector) {
      this._x += vector.x;
      this._y += vector.y;
      this._z += vector.z;
      
      this._onchange();
      return this;
  }
  sub(vector) {
    this._x -= vector.x;
    this._y -= vector.y;
    this._z -= vector.z;
    
    this._onchange();
    return this;
  }
  scale(scalar) {
    this._x *= scalar;
    this._y *= scalar;
    this._z *= scalar;
    
    this._onchange();
    return this;
  }
  dot(vector) {
    return (
      this._x * vector.x +
      this._y * vector.y +
      this._z * vector.z
    );
  }
  cross(vector) {
    const x = this._x, y = this._y, z = this._z;
    
    this._x = y * vector.z - z * vector.y;
    this._y = z * vector.x - x * vector.z;
    this._z = x * vector.y - y * vector.x;
    
    this._onchange();
    return this;
  }
  normalize() {
    this.scale(1 / this.magnitude);
    
    this._onchange();
    return this;
  }
  angleTo(vector) {
    const u = this.clone().normalize();
    const v = vector.clone().normalize();
    return Math.acos(u.dot(v));
  }
  distanceTo(vector) {
    const difference = vector.clone().sub(this);
    return difference.magnitude;
  }
  distanceToSquared(vector) {
    const difference = vector.clone()._sub(this);
    return difference.magnitudeSquared;
  }
  applyMatrix4(matrix) {
    _v4.set(...this, 1).applyMatrix4(matrix);
    
    // divide by perspective
    this.x = _v4.x / _v4.w;
    this.y = _v4.y / _v4.w;
    this.z = _v4.z / _v4.w;
    
    this._onchange();
    return this;
  }
  applyQuaternion(quaternion) {
    _q1.copy(quaternion);
    _q2.set(this._x, this._y, this._z, 0);
    
    _q3 = Quaternion.Multiply(_q1, _q2, _q1.conjugate);
    this._x = _q3.x;
    this._y = _q3.y;
    this._z = _q3.z;
    
    this._onchange();
    return this;
  }
  rotateOnAxis(axis, angle) {
    _q1.setFromAxisAngle(axis, angle);
    this.applyQuaternion(_q1);
    
    this._onchange();
    return this;
  }
  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
    yield this._z;
  }
  
  // Static Methods
  static Add(a, b) {
    return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
  }
  static Sub(a, b) {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
  }
  static Cross(a, b) {
    return new Vector3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x,
    );
  }
  static Scale(vector, scalar) {
    return new Vector3(
      vector.x * scalar,
      vector.y * scalar,
      vector.z * scalar,
    );
  }
  static Normalize(vector) {
    return new Vector3(
      vector.x / vector.magnitude,
      vector.y / vector.magnitude,
      vector.z / vector.magnitude,
    );
  }
  static ApplyMatrix4(vector, matrix) {
    return vector.clone().applyMatrix4(matrix);
  }
  static ApplyQuaternion(vector, quaternion) {
    return vector.clone().applyQuaternion(quaternion);
  }
  
  // Accessors
  get isVector3() {
    return true;
  }
  get onchange() {
    return this._onchange;
  }
  set onchange(callback) {
    this._onchange = callback;
  }
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
    this._onchange();
  }
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
    this._onchange();
  }
  get z() {
    return this._z;
  }
  set z(value) {
    this._z = value;
    this._onchange();
  }
  get magnitude() {
    return Math.sqrt(
      this._y ** 2 +
      this._x ** 2 +
      this._z ** 2
    );
  }
  get magnitudeSquared() {
    return (
      this._y ** 2 +
      this._x ** 2 +
      this._z ** 2
    );
  }
  
  // Static Accessors
  static get Zero() {
    return new Vector3(0, 0, 0);
  }
  static get X() {
    return new Vector3(1, 0, 0);
  }
  static get Y() {
    return new Vector3(0, 1, 0);
  }
  static get Z() {
    return new Vector3(0, 0, 1);
  }
}
