class Vector4 {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }
  get isVector4() {
    return true;
  }
  toArray() {
    return [...this];
  }
  toFloat32Array() {
    return new Float32Array(this.toArray());
  }
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
  }
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
  }
  get z() {
    return this._z;
  }
  set z(value) {
    this._z = value;
  }
  get w() {
    return this._w;
  }
  set w(value) {
    this._w = value;
  }
  get magnitude() {
    return Math.sqrt(
      this._y ** 2 +
      this._x ** 2 +
      this._z ** 2 +
      this._w ** 2
    );
  }
  copy(vector) {
    if (vector.isVector4) {
      this._x = v.x;
      this._y = v.y;
      this._z = v.z;
      this._w = v.w;
    } else {
      console.warn('Vector4.js: (.copy) expected vector to be of type SATURN.Vector4.');
    }
    return this;
  }
  clone() {
    return new Vector4(
      this._x, this._y, this._z, this._w,
    );
  }
  set(x, y, z, w) {
    this._x = x || this._x;
    this._y = y || this._y;
    this._z = z || this._z;
    this._w = w || this._w;
    return this;
  }
  equals(vector, tolerance = 0.001) {
    if (vector.isVector4) {
      return (
        (Math.abs(this._x - vector.x) < tolerance) &&
        (Math.abs(this._y - vector.y) < tolerance) &&
        (Math.abs(this._z - vector.z) < tolerance) &&
        (Math.abs(this._w - vector.w) < tolerance)
      );
    } else {
      console.warn('Vector4.js: (.equals) expected vector to be of type SATURN.Vector4.');
      return false;
    }
  }
  _add(vector) {
    if (vector.isVector4) {
      this._x += v.x;
      this._y += v.y;
      this._z += v.z;
      this._w += v.w;
    } else {
      console.warn('Vector4.js: (._add) expected vector to be of type SATURN.Vector4.');
    }
    return this;
  }
  _sub(vector) {
    if (vector.isVector4) {
      this._x -= v.x;
      this._y -= v.y;
      this._z -= v.z;
      this._w -= v.w;
    } else {
      console.warn('Vector4.js: (._sub) expected vector to be of type SATURN.Vector4.');
    }
    return this;
  }
  add(...vectors) {
    if (vectors.every(vector => vector.isVector4)) {
      vectors.forEach(v => this.add(v));
    } else {
      console.warn('Vector4.js: (.add) expected vectors to be of type SATURN.Vector4.');
    }
    return this;
  }
  sub(...vectors) {
    if (vectors.every(vector => vector.isVector4)) {
      vectors.forEach(v => this.sub(v));
    } else {
      console.warn('Vector4.js: (.sub) expected vectors to be of type SATURN.Vector4.');
    }
    return this;
  }
  scale(s) {
    this._x *= s;
    this._y *= s;
    this._z *= s;
    this._w *= s;
    return this;
  }
  dot(vector) {
    if (vector.isVector4) {
      return (
        this._x * vector.x +
        this._y * vector.y +
        this._z * vector.z +
        this._w * vector.w
      );
    } else {
      console.warn('Vector4.js: (.sub) expected vector to be of type SATURN.Vector4.');
      return NaN;
    }
  }
  normalize() {
    this.scale(1/this.magnitude);
    return this;
  }
  applyMatrix4(matrix) {
    if (matrix.isMatrix4) {
      const v = this.clone();
      this.x = v.dot(matrix.col0);
      this.y = v.dot(matrix.col1);
      this.z = v.dot(matrix.col2);
      this.w = v.dot(matrix.col3);
    } else {
      console.warn('Vector4.js: (.applyMatrix4) expected matrix to be of type SATURN.Matrix4.');
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

export { Vector4 };