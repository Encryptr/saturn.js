class Vector4 {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
    this._onchange = () => {};
  }
  toArray() {
    return [...this];
  }
  toFloat32Array(target = new Float32Array()) {
    target.set(this.toArray());
    return target;
  }
  copy(vector) {
    if (vector.isVector4) {
      
      this._x = v.x;
      this._y = v.y;
      this._z = v.z;
      this._w = v.w;
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector4: .copy() expected 'vector' to inherit from SATURN.Vector4.`);
  }
  clone() {
    return new Vector4(
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
  equals(vector, tolerance = 0.001) {
    if (vector.isVector4) {
      
      return (
        (Math.abs(this._x - vector.x) < tolerance) &&
        (Math.abs(this._y - vector.y) < tolerance) &&
        (Math.abs(this._z - vector.z) < tolerance) &&
        (Math.abs(this._w - vector.w) < tolerance)
      );
      
    } else throw new Error(
      `SATURN.Vector4: .equals() expected 'vector' to inherit from SATURN.Vector4.`);
  }
  _add(vector) {
    if (vector.isVector4) {
      
      this._x += vector.x;
      this._y += vector.y;
      this._z += vector.z;
      this._w += vector.w;
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector4: ._add() expected 'vector' to inherit from SATURN.Vector4.`);
  }
  _sub(vector) {
    if (vector.isVector4) {
      
      this._x -= vector.x;
      this._y -= vector.y;
      this._z -= vector.z;
      this._w -= vector.w;
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector4: ._sub() expected 'vector' to inherit from SATURN.Vector4.`);
  }
  add(...vectors) {
    if (vectors.every(vector => vector.isVector4)) {
      
      vectors.forEach(v => this._add(v));
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector4: .add() expected 'vectors' to inherit from SATURN.Vector4.`);
  }
  sub(...vectors) {
    if (vectors.every(vector => vector.isVector4)) {
      
      vectors.forEach(v => this._sub(v));
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector4: .sub() expected 'vectors' to inherit from SATURN.Vector4.`);
  }
  scale(s) {
    this._x *= s;
    this._y *= s;
    this._z *= s;
    this._w *= s;
    this._onchange();
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
      
    } else throw new Error(
      `SATURN.Vector4: .dot() expected 'vector' to inherit from SATURN.Vector4.`);
  }
  normalize() {
    this.scale(1/this.magnitude);
    this._onchange();
    return this;
  }
  applyMatrix4(matrix) {
    if (matrix.isMatrix4) {
      
      const v = this.clone();
      this.x = v.dot(matrix.row1);
      this.y = v.dot(matrix.row2);
      this.z = v.dot(matrix.row3);
      this.w = v.dot(matrix.row4);
      this._onchange();
      return this;
      
    } else throw new Error(
      `SATURN.Vector4: .applyMatrix4() expected 'matrix' to inherit from SATURN.Matrix4.`);
  }
  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
    yield this._z;
    yield this._w;
  }
  get isVector4() {
    return true;
  }
  get onchange() {
    return this.onchange;
  }
  set onchange(func) {
    if (typeof func === 'function')
      this._onchange = func;
    else throw new Error(
      `SATURN.Vector4: .set onchange() expected 'func' to be of type 'function'.`);
  }get x() {
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
}

export { Vector4 };