// Wrapper for DOMMatrix
// NOTE: column-major order
// NOTE: mXY = column X, component Y
class Matrix4 extends DOMMatrix {
  constructor([
      m11=1, m21=0, m31=0, m41=0,
      m12=0, m22=1, m32=0, m42=0,
      m13=0, m23=0, m33=1, m43=0,
      m14=0, m24=0, m34=0, m44=1,
    ]=[]) { // => Matrix4
    super([
      m11, m21, m31, m41,
      m12, m22, m32, m42,
      m13, m23, m33, m43,
      m14, m24, m34, m44,
    ]);
  }
    
  /**
   * Inherited Methods:
   * multiplySelf, multiply,
   * invertSelf, inverse,
   * preMultiplySelf, preMultiply,
   * translateSelf, translate,
   * scaleSelf, scale,
   * scale3dSelf, scale3d,
   * rotateSelf, rotate,
   * rotateAxisAngleSelf, rotateAxisAngle
   * rotateFromVectorSelf, rotateFromVector
   * setMatrixValue,
   * skewXSelf, skewX,
   * skewYSelf, skewY,
   * toFloat32Array,
   * toFloat64array,
   * toJSON, toString,
   * transformPoint,
   */
  
  // nullify this method 
  transformPoint() {
    return undefined;
  }
  
  transformVector3(v) {// => Vector3
    const domPoint = super.transformPoint(v);
    return new Vector3(
      domPoint.x,
      domPoint.y,	
      domPoint.z      
    );
  }
  
  static get IDENTITY() { // => Matrix4
    return new Matrix4();
  }
  static projection(width, height, depth) { // => Matrix4
    return new Matrix4([
      2/width,         0,       0, 0,
            0, -2/height,       0, 0,
            0,         0, 2/depth, 0,
           -1,         1,       0, 1,
    ]);
  }
  static orthographic(left, right, bottom, top, near, far) { // => Matrix4
    return new Matrix4([
      2/(right-left),              0,            0, 0,
                   0, 2/(top-bottom),            0, 0,
                   0,              0, 2/(near-far), 0,
      
      (left+right)/(left-right),
      (bottom+top)/(bottom-top),
      (near+far)/(near-far),
      1,
    ]);
  }
  static perspective(fov, near, far, aspect) { // => Matrix4
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
    const rangeInv = 1.0 / (near - far);
    
    return new Matrix4([
      f / aspect, 0,                         0,  0,
               0, f,                         0,  0,
               0, 0,   (near + far) * rangeInv, -1,
               0, 0, near * far * rangeInv * 2,  0,
    ]);
  }
  
  *[Symbol.iterator]() {
    const f32 = this.toFloat32Array();
    for (let element = 0; element < 16; element++) {
      yield f32[element];
    }
  }
}

class Vector3 {
  constructor(x = 0, y = 0, z = 0) { // => Vector3
    this._x = x;
    this._y = y;
    this._z = z;
  }
  set(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
  }
  get x()    { // => Number
    return this._x;
  }
  set x(val) { // => Number
    this._x = val;
  }
  get y() { // => Number
    return this._y;
  }
  set y(val) { // => Number
    this._y = val;
  }
  get z() { // => Number
    return this._z;
  }
  set z(val) { // => Number
    this._z = val;
  }
  add(v) { // => Vector3
    this._x += v.x;
    this._y += v.y;
    this._z += v.z;
    return this;
  }
  subtract(v) { // => Vector3
    this._x -= v.x;
    this._y -= v.y;
    this._z -= v.z;
    return this;
  }
  scale(s) { // => Vector3
    this._x *= s;
    this._y *= s;
    this._z *= s;
    return this;
  }
  dot(v) { // => Number
    const u = this;
    return (u.x * v.x) + (u.y * v.y) + (u.z * v.z);
  }
  cross(v) { // => Vector3
    const u = this;
    // TODO: Implement
  }
  transform(a) { // => Vector3
    const v = a.transformVector3(this);
    this._x = v.x;
    this._y = v.y;
    this._z = v.z;
    return this;
  }
  copy() {
    console.log(this._x, this._y, this._z);
    return new Vector3(this._x, this._y, this._z);
  }
  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
    yield this.z;
  }
}

export { Matrix4, Vector3 };