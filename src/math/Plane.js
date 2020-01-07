import { Vector3 } from './Vector3.js';

class Plane {
  constructor(a = 0, b = 0, c = 0, d = 0) {
    this._normal = new Vector3(a, b, c);
    this._d = d;
  }
  normalize() {
    const magInv = 1.0 / this._normal.magnitude;
    this._normal.scale(magInv);
    this._d *= magInv;
    return this;
  }
  distanceToPoint(point) {
    if (point.isVector3) {
      
      return this._normal.dot(point) + this._d;
      
    } else throw new Error(
      `SATURN.Plane: .distanceToPoint() expected 'point' to inherit from SATURN.Vector3.`);
  }
  get isPlane() {
    return true;
  }
  get normal() {
    return this._normal;
  }
  set normal(vector) {
    if (vector.isVector3) {
      this._normal = vector;
    } else throw new Error(
      `SATURN.Plane: .set normal() expected 'vector' to inherit from SATURN.Vector3.`
    );
  }
  get d() {
    return this._d;
  }
  set d(value) {
    this._d = value;
  }
  set(a, b, c, d) {
    this._normal.set(a, b, c);
    this._d = d;
    return this;
  }
}

export { Plane };