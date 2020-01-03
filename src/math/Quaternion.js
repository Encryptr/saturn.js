class Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
    this._onchange = () => {};
  }
  get isQuaternion() {
    return true;
  }
  get onchange() {
    return this._onchange;
  }
  set onchange(func) {
    if (typeof func === 'function') {
      this._onchange = func;
    } else {
      console.warn('Quaternion.js: (.set onchange) expected func to be of type function.');
    }
  }
  toArray() {
    return [...this];
  }
  toFloat32Array() {
    return new Float32Array(this.toArray());
  }
  copy(quat) {
    if (quat.isQuaternion) {
      this._x = quat.x;
      this._y = quat.y;
      this._z = quat.z;
      this._w = quat.w;
      this._onchange();
    } else {
      console.warn('Quaternion.js: (.copy) expected quat to be of type SATURN.Quaternion.');
    }
    return this;
  }
  clone() {
    return new Quaternion(
      this._x, this._y, this._z, this._w,
    );
  }
  set(x, y, z, w) {
    this._x = (x !== undefined) ? x : this._x;
    this._y = (y !== undefined) ? y : this._y;
    this._z = (z !== undefined) ? z : this._z;
    this._w = (w !== undefined) ? w : this._w;
    this._onchange();
    return this;
  }
  equals(quat, tolerance = 0.001) { // => boolean
    if (quat.isQuaternion) {
      return (
        (Math.abs(this._x - quat.x) < tolerance) &&
        (Math.abs(this._y - quat.y) < tolerance) &&
        (Math.abs(this._z - quat.z) < tolerance) &&
        (Math.abs(this._w - quat.w) < tolerance)
      );
    } else {
      console.warn('Quaternion.js: (.equals) expected vector to be of type SATURN.Quaternion.');
      return false;
    }
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
  get w() { // => number
    return this._w;
  }
  set w(value) { // => number
    this._w = value;
    this._onchange();
  }
  get magnitude() { // => number
    return Math.sqrt(
      this._y ** 2 +
      this._x ** 2 +
      this._z ** 2 +
      this._w ** 2
    );
  }
  get conjugate() {
    return new Quaternion(
      -this._x, -this._y, -this._z, this._w,
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
  multiply(quat) {
    if (quat.isQuaternion) {
      this.setFromProduct(this, quat);
      this._onchange();
    } else {
      console.warn('Quaternion.js: (.multiply) expected q2 to be of type SATURN.Quaternion.');
    }
    return this;
  }
  premultiply(quat) {
    if (quat.isQuaternion) {
      this.setFromProduct(quat, this);
      this._onchange();
    } else {
      console.warn('Quaternion.js: (.multiply) expected q2 to be of type SATURN.Quaternion.');
    }
    return this;
  }
  setFromProduct(q1, q2) {
    if (q1.isQuaternion && q2.isQuaternion) {
      const q1x = q1.x, q1y = q1.y, q1z = q1.z, q1w = q1.w;
      const q2x = q2.x, q2y = q2.y, q2z = q2.z, q2w = q2.w;
      this._x = q1x * q2w + q1w * q2x + q1y * q2z - q1z * q2y;
		  this._y = q1y * q2w + q1w * q2y + q1z * q2x - q1x * q2z;
		  this._z = q1z * q2w + q1w * q2z + q1x * q2y - q1y * q2x;
		  this._w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
      this._onchange();
    } else {
      console.warn('Quaternion.js (.setFromProduct) expected q1 and q2 to be of type SATURN.Quaternion.');
    }
    return this;
  }
  setFromAxisAngle(axis, angle) {
    if (axis.isVector3) {
      const vectorPart = axis
        .clone().normalize()
        .scale(Math.sin(angle / 2));
      this._x = vectorPart.x;
      this._y = vectorPart.y;
      this._z = vectorPart.z;
      this._w = Math.cos(angle / 2);
      this._onchange();
    } else {
      console.warn('Quaternion.js: (.setFromAxisAngle) expected axis to be of type SATURN.Vector3.');
    }
    return this;
  }
  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
    yield this._z;
    yield this._w;
  }
}

export { Quaternion };