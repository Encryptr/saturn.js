import { Plane } from './Plane.js';

class Frustum {
  constructor(
    left = new Plane(),
    right = new Plane(),
    bottom = new Plane(),
    top = new Plane(),
    near = new Plane(),
    far = new Plane(),
  ) {
    this._planes = [left, right, bottom, top, near, far];
  }
  containsPoint(point) {
    if (point.isVector3) {
      
      return this._planes.every(plane => plane.distanceToPoint(point) >= 0);
      
    } else throw new Error(
      `SATURN.Frustum: .containsPoint() expected 'point' to inherit from SATURN.Vector3.`);
  }
  intersectsSphere(sphere) {
    if (sphere.isSphere) {
      
      return this._planes.every(plane => (
        plane.distanceToPoint(sphere.center) >= -sphere.radius
      ));
      
    } else throw new Error(
      `SATURN.Frustum: .intersectsSphere() expected sphere to inherit from SATURN.Sphere.`);
  }
  setFromProjectionMatrix(m) {
    if (m.isMatrix4) {
      // derive planes from projection matrix
      this.left.set(...m.row4.add(m.row1)).normalize();
      this.right.set(...m.row4.sub(m.row1)).normalize();
      this.bottom.set(...m.row4.add(m.row2)).normalize();
      this.top.set(...m.row4.sub(m.row2)).normalize();
      this.near.set(...m.row4.add(m.row3)).normalize();
      this.far.set(...m.row4.sub(m.row3)).normalize();
    } else throw new Error(
      `SATURN.Frustum: .setFromProjectionMatrix() expected 'm' to inherit from SATURN.Matrix4.`);
    return this;
  }
  get isFrustum() {
    return true;
  }
  get left() {
    return this._planes[0];
  }
  set left(plane) {
    if (plane.isPlane)
      this._planes[0] = plane;
    else throw new Error(
      `SATURN.Frustum: .set left() expected 'plane' to inherit from SATURN.Plane.`);
  }
  get right() {
    return this._planes[1];
  }
  set right(plane) {
    if (plane.isPlane)
      this._planes[1] = plane;
    else throw new Error(
      `SATURN.Frustum: .set right() expected 'plane' to inherit from SATURN.Plane.`);
  }
  get bottom() {
    return this._planes[2];
  }
  set bottom(plane) {
    if (plane.isPlane)
      this._planes[2] = plane;
    else throw new Error(
      `SATURN.Frustum: .set bottom() expected 'plane' to inherit from SATURN.Plane.`);
  }
  get top() {
    return this._planes[3];
  }
  set top(plane) {
    if (plane.isPlane)
      this._planes[3] = plane;
    else throw new Error(
      `SATURN.Frustum: .set top() expected 'plane' to inherit from SATURN.Plane.`);
  }
  get near() {
    return this._planes[4];
  }
  set near(plane) {
    if (plane.isPlane)
      this._planes[4] = plane;
    else throw new Error(
      `SATURN.Frustum: .set near() expected 'plane' to inherit from SATURN.Plane.`);
  }
  get far() {
    return this._planes[5];
  }
  set far(plane) {
    if (plane.isPlane)
      this._planes[5] = plane;
    else throw new Error(
      `SATURN.Frustum: .set far() expected 'plane' to inherit from SATURN.Plane.`);
  }
}

export { Frustum };