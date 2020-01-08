import { Vector3 } from './Vector3.js';

export class Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
    this._onchange = () => {};
  }
  
  // Methods
  toArray() {
    return [...this];
  }
  toFloat32Array(target = new Float32Array(4)) {
    target.set(this.toArray());
    return target;
  }
  copy(quaternion) {
    this._x = quaternion.x;
    this._y = quaternion.y;
    this._z = quaternion.z;
    this._w = quaternion.w;
    
    this._onchange();
    return this;
  }
  clone() {
    return new Quaternion(this._x, this._y, this._z, this._w);
  }
  set(x, y, z, w) {
    this._x = (x !== undefined) ? x : this._x;
    this._y = (y !== undefined) ? y : this._y;
    this._z = (z !== undefined) ? z : this._z;
    this._w = (w !== undefined) ? w : this._w;
    
    this._onchange();
    return this;
  }
  equals(quaternion, tolerance = 0.001) { // => boolean
    return (
      (Math.abs(this._x - quaternion.x) < tolerance) &&
      (Math.abs(this._y - quaternion.y) < tolerance) &&
      (Math.abs(this._z - quaternion.z) < tolerance) &&
      (Math.abs(this._w - quaternion.w) < tolerance)
    );
  }
  normalize() {
    const magInv = 1 / this.magnitude;
    
    this._x *= magInv;
    this._y *= magInv;
    this._z *= magInv;
    this._w *= magInv;
    
    this._onchange();
    return this;
  }
  multiply(quaternion) {
    const q1x = this.x, q1y = this.y, q1z = this.z, q1w = this.w;
    const q2x = quaternion.x, q2y = quaternion.y, q2z = quaternion.z, q2w = quaternion.w;
    
    this._x = q1x * q2w + q1w * q2x + q1y * q2z - q1z * q2y;
    this._y = q1y * q2w + q1w * q2y + q1z * q2x - q1x * q2z;
    this._z = q1z * q2w + q1w * q2z + q1x * q2y - q1y * q2x;
    this._w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
    
    this._onchange();
    return this;
  }
  premultiply(quaternion) {
    const q1x = quaternion.x, q1y = quaternion.y, q1z = quaternion.z, q1w = quaternion.w;
    const q2x = this.x, q2y = this.y, q2z = this.z, q2w = this.w;
    
    this._x = q1x * q2w + q1w * q2x + q1y * q2z - q1z * q2y;
    this._y = q1y * q2w + q1w * q2y + q1z * q2x - q1x * q2z;
    this._z = q1z * q2w + q1w * q2z + q1x * q2y - q1y * q2x;
    this._w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
    
    this._onchange();
    return this;
  }
  setFromAxisAngle(axis, angle) {
    const scalar = Math.sin(angle / 2);
    
    this._x = axis.x * scalar;
    this._y = axis.y * scalar;
    this._z = axis.z * scalar;
    this._w = Math.cos(angle / 2);
    
    this._onchange();
    return this;
  }
  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
    yield this._z;
    yield this._w;
  }
  
  // Static Methods
  static Multiply(...quaternions) {
    const product = Quaternion.Identity;
    for (let i = 0; i < quaternions.length; i++) {
      product.multiply(quaternions[i]);
    }
    return product;
  }
  static Normalize(quaternion) {
    return new Quaternion(
      quaternion.x / quaternion.magnitude,
      quaternion.y / quaternion.magnitude,
      quaternion.z / quaternion.magnitude,
      quaternion.w / quaternion.magnitude,
    );
  }
  static CreateFromAxisAngle(axis, angle) {
    const scalar = Math.sin(angle / 2);
    
    return new Quaternion(
      axis.x * scalar,
      axis.y * scalar,
      axis.z * scalar,
      Math.cos(angle / 2),
    );
  }
  
  // Accessors
  get isQuaternion() {
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
  get w() {
    return this._w;
  }
  set w(value) {
    this._w = value;
    this._onchange();
  }
  get magnitude() {
    return Math.sqrt(
      this._y ** 2 +
      this._x ** 2 +
      this._z ** 2 +
      this._w ** 2
    );
  }
  get magnitudeSquared() {
    return (
      this._y ** 2 +
      this._x ** 2 +
      this._z ** 2 +
      this._w ** 2
    );
  }
  get conjugate() {
    return new Quaternion(-this._x, -this._y, -this._z, this._w);
  }
  
  // Static Accessors
  static get Identity() {
    return new Quaternion(0, 0, 0, 1);
  }
}