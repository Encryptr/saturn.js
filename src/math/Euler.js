import { Matrix4 } from './Matrix4.js';
import * as Constants from '../constants.js';
import { clamp } from '../misc.js';

const _m1 = new Matrix4();

const validOrders = [
  Constants.XYZ, Constants.ZYX,
];

class Euler {
  constructor(x = 0, y = 0, z = 0, order = Constants.XYZ) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._order = order;
    this._onchange = () => {};
  }
  get isEuler() {
    return true;
  }
  get onchange() {
    return this.onchange;
  }
  set onchange(func) {
    if (typeof func === 'function') {
      this._onchange = func;
    } else {
      console.warn('Euler.js: (.set onchange) expected func to be of type function.');
    }
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
  get order() {
    return this._order;
  }
  set order(value) {
    if (validOrders.includes(value)) {
      this._order = value;
      this._onchange();
    } else {
      console.warn('Euler.js: (.set order) invalid order value.');
    }
  }
  copy(euler) {
    if (euler.isEuler) {
      this._x = euler.x;
      this._y = euler.y;
      this._z = euler.z;
      this._order = euler.order;
      this._onchange();
    } else {
      console.warn('Euler.js: (.copy) expected euler to be of type SATURN.Euler.');
    }
    return this;
  }
  clone() {
    return new Euler(
      this._x, this._y, this._z, this._order,
    );
  }
  set(x, y, z, order) {
    this._x = (x !== undefined) ? x : this._x;
    this._y = (y !== undefined) ? y : this._y;
    this._z = (z !== undefined) ? z : this._z;
    
    // use order setter to protect property from garbage
    this.order = order || this._order;
    this._onchange();
    return this;
  }
  equals(euler, tolerance = 0.001) { // => boolean
    if (euler.isVector3) {
      return (
        (Math.abs(this._x - euler.x) < tolerance) &&
        (Math.abs(this._y - euler.y) < tolerance) &&
        (Math.abs(this._z - euler.z) < tolerance) &&
        this._order === euler.order
      );
    } else {
      console.warn('Euler.js: (.equals) expected euler to be of type SATURN.Euler.');
      return false;
    }
  }
  /*setFromRotationMatrix(matrix, order, triggerUpdate = true) {
    if (matrix.isMatrix4) {
      this._order = order || this._order;
      if (this._order === Constants.XYZ) {
        this._y = Math.asin(clamp(matrix.m13, -1, 1));
        if (Math.abs(matrix.m13) < 0.9999999) {
          this._x = Math.atan2(-matrix.m23, matrix.m33);
          this._z = Math.atan2(-matrix.m12, matrix.m11);
        } else {
          this._x = Math.atan2(matrix.m32, matrix.m22);
          this._z = 0;
        }
      } else if (this._order === Constants.ZYX) {
        this._y = Math.asin(-clamp(matrix.m31, -1, 1));
        if (Math.abs(matrix.m31) < 0.9999999) {
          this._x = Math.atan2(matrix.m32, matrix.m33);
          this._z = Math.atan2(matrix.m21, matrix.m11);
        } else {
          this._x = 0;
          this._z = Math.atan2(-matrix.m12, matrix.m22);
        }
      }
    } else {
      console.warn('Euler.js: (.setFromRotationMatrix) expected matrix to be of type SATURN.Matrix4.');
    }
    return this;
  }
  setFromQuaternion(quat, order, triggerUpdate = true) {
    if (quat.isQuaternion) {
      _m1.setFromQuaternion(quat, order, triggerUpdate);
      this.setFromRotationMatrix(_m1);
    } else {
      console.warn('Euler.js: (.setFromQuaternion) expected quat to be of type SATURN.Quaternion.');
    }
    return this;
  }*/
}

export { Euler };