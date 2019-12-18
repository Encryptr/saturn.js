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
  copy(v) {
    this._x = v.x;
    this._y = v.y;
    this._z = v.z;
    this._w = v.w;
    return this;
  }
  clone() {
    return new Vector4(
      this._x, this._y, this._z, this._w,
    );
  }
  set(x, y, z, w) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
    return this;
  }
  equals(v, tolerance = 0.001) {
    return (
      (Math.abs(this._x - v.x) < tolerance) &&
      (Math.abs(this._y - v.y) < tolerance) &&
      (Math.abs(this._z - v.z) < tolerance) &&
      (Math.abs(this._w - v.w) < tolerance)
    );
  }
  add(v) {
    this._x += v.x;
    this._y += v.y;
    this._z += v.z;
    this._w += v.w;
    return this;
  }
  subtract(v) {
    this._x -= v.x;
    this._y -= v.y;
    this._z -= v.z;
    this._w -= v.w;
    return this;
  }
  addVectors(...vectors) {
    vectors.forEach(v => this.add(v));
    return this;
  }
  subtractVectors(...vectors) {
    vectors.forEach(v => this.subtract(v));
    return this;
  }
  scale(s) {
    this._x *= s;
    this._y *= s;
    this._z *= s;
    this._w *= s;
    return this;
  }
  dot(v) {
    return (
      this._x * v.x +
      this._y * v.y +
      this._z * v.z +
      this._w * v.w
    );
  }
  normalize() {
    this.scale(1/this.magnitude);
    return this;
  }
  applyMatrix4(m) {
    const v = this.clone();
    
    this.x = v.dot(m.col0);
    this.y = v.dot(m.col1);
    this.z = v.dot(m.col2);
    this.w = v.dot(m.col3);
    
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