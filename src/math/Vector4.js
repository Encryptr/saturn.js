export class Vector4 {
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
  copy(vector) {
    this._x = v.x;
    this._y = v.y;
    this._z = v.z;
    this._w = v.w;
    
    this._onchange();
    return this;
  }
  clone() {
    return new Vector4(this._x, this._y, this._z, this._w);
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
    return (
      (Math.abs(this._x - vector.x) < tolerance) &&
      (Math.abs(this._y - vector.y) < tolerance) &&
      (Math.abs(this._z - vector.z) < tolerance) &&
      (Math.abs(this._w - vector.w) < tolerance)
    );
  }
  add(vector) {
    this._x += vector.x;
    this._y += vector.y;
    this._z += vector.z;
    this._w += vector.w;
    
    this._onchange();
    return this;
  }
  sub(vector) {
    this._x -= vector.x;
    this._y -= vector.y;
    this._z -= vector.z;
    this._w -= vector.w;
    
    this._onchange();
    return this;
  }
  scale(scalar) {
    this._x *= scalar;
    this._y *= scalar;
    this._z *= scalar;
    this._w *= scalar;
    
    this._onchange();
    return this;
  }
  dot(vector) {
    return (
      this._x * vector.x +
      this._y * vector.y +
      this._z * vector.z +
      this._w * vector.w
    );
  }
  normalize() {
    this.scale(1 / this.magnitude);
    
    this._onchange();
    return this;
  }
  applyMatrix4(matrix) {
    const vector = this.clone();
    
    this.x = vector.dot(matrix.row1);
    this.y = vector.dot(matrix.row2);
    this.z = vector.dot(matrix.row3);
    this.w = vector.dot(matrix.row4);
    
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
  static Add(a, b) {
    return new Vector4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
  }
  static Sub(a, b) {
    return new Vector4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
  }
  static Scale(vector, scalar) {
    return new Vector4(
      vector.x * scalar,
      vector.y * scalar,
      vector.z * scalar,
      vector.w * scalar,
    );
  }
  static Normalize(vector) {
    return new Vector4(
      vector.x / vector.magnitude,
      vector.y / vector.magnitude,
      vector.z / vector.magnitude,
      vector.w / vector.magnitude,
    );
  }
  static ApplyMatrix4(vector, matrix) {
    return new Vector4(
      vector.dot(matrix.row1),
      vector.dot(matrix.row2),
      vector.dot(matrix.row3),
      vector.dot(matrix.row4),
    );
  }
  
  // Accessors
  get isVector4() {
    return true;
  }
  get onchange() {
    return this.onchange;
  }
  set onchange(callback) {
    this._onchange = callback
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
}