import { Sphere } from './math/Sphere.js';
import { Vector3 } from './math/Vector3.js';
import { generateKey } from './misc.js';

const _o = new Vector3(0, 0, 0);
const _v3 = new Vector3();

class Geometry {
  constructor() {
    this._id = generateKey();
    this._attributes = {};
    this._index = null;
    this._boundingSphere = null;
  }
  computeBoundingSphere() {
    if (this.position) {
      
      this._boundingSphere = new Sphere();
      let maxDistance = 0;
      const position = this._attributes[0].array;
      for (let i = 0; i < position.length / 3; i+=3) {
        _v3.set(...position.slice(i * 3, i * 3 + 3));
        maxDistance = Math.max(
          _v3.distanceToSquared(this._boundingSphere.center), maxDistance,
        );
      }
      this._boundingSphere.radius = Math.sqrt(maxDistance);
      return this;
      
    } else throw new Error(
      `SATURN.Geometry: .computeBoundingSphere() attribute 0 (position) is not defined.`);
  }
  get isGeometry() {
    return true;
  }
  get id() {
    return this._id;
  }
  get boundingSphere() {
    return this._boundingSphere;
  }
  set boundingSphere(sphere) {
    if (sphere.isSphere)
      this._boundingSphere = sphere;
    else throw new Error(
      `SATURN.Geometry: .set boundingSphere() expected 'sphere' to inherit from SATURN.Sphere.`);
  }
  get count() {
    return this._index.length;
  }
  get attributes() {
    return this._attributes;
  }
  get index() {
    return this._index;
  }
  set index(array) {
    if (array instanceof Uint16Array)
      this._index = array;
    else throw new Error(
      `SATURN.Geometry: .set index() expected 'array' to inherit from Uint16Array.`);
  }
  get position() {
    return this._attributes[0];
  }
  set position(attribute) {
    if (attribute.isAttribute) {
      this._attributes[0] = attribute;
      this._id = generateKey(); // generate new ID so that VAO is created again
      this.computeBoundingSphere();
    } else throw new Error(
      `SATURN.Geometry: .set position() expected 'attribute' to inherit from SATURN.Attribute`);
  }
  get uv() {
    return this._attributes[1];
  }
  set uv(attribute) {
    if (attribute.isAttribute) {
      this._attributes[1] = attribute;
      this._id = generateKey(); // generate new ID so that VAO is created again
    } else throw new Error(
      `SATURN.Geometry: .set uv() expected 'attribute' to inherit from SATURN.Attribute.`);
  }
  get normal() {
    return this._attributes[2];
  }
  set normal(attribute) {
    if (attribute.isAttribute) {
      this._attributes[2] = attribute;
      this._id = generateKey(); // generate new ID so that VAO is created again
    } else throw new Error(
      `SATURN.Geometry: .set normal() expected 'attribute' to inherit from SATURN.Attribute.`);
  }
}

export { Geometry };