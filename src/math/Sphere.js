import { Vector3 } from './Vector3.js';

class Sphere {
  constructor(center = new Vector3(), radius = 0) {
    this._center = center;
    this._radius = radius;
  }
  copy(sphere) {
    if (sphere.isSphere) {
      
      this._center = sphere.center.clone();
      this._radius = sphere.radius;
      
    } else throw new Error(
      `SATURN.Sphere: .copy() expected 'sphere' to inherit from SATURN.Sphere.`);
  }
  clone() {
    return new Sphere(
      this._center.clone(), this._radius,
    );
  }
  get isSphere() {
    return true;
  }
  get center() {
    return this._center;
  }
  set center(point) {
    if (point.isVector3)
      this._center = point;
    else throw new Error(
      `SATURN.Sphere: .set center() expected 'point' to inherit from SATURN.Vector3.`);
  }
  get radius() {
    return this._radius;
  }
  set radius(value) {
    this._radius = value;
  }
}

export { Sphere };