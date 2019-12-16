// utility functions
const dot = (a, b) => (
  a[0]*b[0] + a[1]*b[1] + a[2]*b[2] + a[3]*b[3]
);

class Matrix4 {
  // note: elements are arranged in column-major order
  // m{row}{column} getters/setters can be used to access individual elements
  constructor(array = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]) {
    this._elements = array.slice(0, 16);
  }
  get isMatrix4() {
    return true;
  }
  toArray() {
    return [...this._elements];
  }
  toFloat32Array() {
    return new Float32Array(this._elements);
  }
  copy(a) {
    this._elements = a.toArray();
    return this;
  }
  clone() {
    return new Matrix4(this.toArray());
  }
  equals(a, tolerance = 0.01) {
    const array = a.toArray();
    return this._elements.every((m, i) => (
      Math.abs(m - array[i]) <= tolerance
    ));
  }
  get determinant() {
    // https://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    const [
      m00, m10, m20, m30,
      m01, m11, m21, m31,
      m02, m12, m22, m32,
      m03, m13, m23, m33,
    ] = this._elements;
    
    return (
      m03*m12*m21*m30 - m02*m13*m21*m30 - m03*m11*m22*m30 + m01*m13*m22*m30 +
      m02*m11*m23*m30 - m01*m12*m23*m30 - m03*m12*m20*m31 + m02*m13*m20*m31 +
      m03*m10*m22*m31 - m00*m13*m22*m31 - m02*m10*m23*m31 + m00*m12*m23*m31 +
      m03*m11*m20*m32 - m01*m13*m20*m32 - m03*m10*m21*m32 + m00*m13*m21*m32 +
      m01*m10*m23*m32 - m00*m11*m23*m32 - m02*m11*m20*m33 + m01*m12*m20*m33 +
      m02*m10*m21*m33 - m00*m12*m21*m33 - m01*m10*m22*m33 + m00*m11*m22*m33
    );
  }
  get inverse() {
    // https://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    const determinant = this.determinant;
    if (determinant === 0) {
      return undefined;
    } else {
      const [
        m00, m10, m20, m30,
        m01, m11, m21, m31,
        m02, m12, m22, m32,
        m03, m13, m23, m33,
      ] = this._elements;
      const inverse = new Matrix4();
      
      inverse.m00 = m12*m23*m31 - m13*m22*m31 + m13*m21*m32 - m11*m23*m32 - m12*m21*m33 + m11*m22*m33;
      inverse.m01 = m03*m22*m31 - m02*m23*m31 - m03*m21*m32 + m01*m23*m32 + m02*m21*m33 - m01*m22*m33;
      inverse.m02 = m02*m13*m31 - m03*m12*m31 + m03*m11*m32 - m01*m13*m32 - m02*m11*m33 + m01*m12*m33;
      inverse.m03 = m03*m12*m21 - m02*m13*m21 - m03*m11*m22 + m01*m13*m22 + m02*m11*m23 - m01*m12*m23;
      
      inverse.m10 = m13*m22*m30 - m12*m23*m30 - m13*m20*m32 + m10*m23*m32 + m12*m20*m33 - m10*m22*m33;
      inverse.m11 = m02*m23*m30 - m03*m22*m30 + m03*m20*m32 - m00*m23*m32 - m02*m20*m33 + m00*m22*m33;
      inverse.m12 = m03*m12*m30 - m02*m13*m30 - m03*m10*m32 + m00*m13*m32 + m02*m10*m33 - m00*m12*m33;
      inverse.m13 = m02*m13*m20 - m03*m12*m20 + m03*m10*m22 - m00*m13*m22 - m02*m10*m23 + m00*m12*m23;
      
      inverse.m20 = m11*m23*m30 - m13*m21*m30 + m13*m20*m31 - m10*m23*m31 - m11*m20*m33 + m10*m21*m33;
      inverse.m21 = m03*m21*m30 - m01*m23*m30 - m03*m20*m31 + m00*m23*m31 + m01*m20*m33 - m00*m21*m33;
      inverse.m22 = m01*m13*m30 - m03*m11*m30 + m03*m10*m31 - m00*m13*m31 - m01*m10*m33 + m00*m11*m33;
      inverse.m23 = m03*m11*m20 - m01*m13*m20 - m03*m10*m21 + m00*m13*m21 + m01*m10*m23 - m00*m11*m23;
      
      inverse.m30 = m12*m21*m30 - m11*m22*m30 - m12*m20*m31 + m10*m22*m31 + m11*m20*m32 - m10*m21*m32;
      inverse.m31 = m01*m22*m30 - m02*m21*m30 + m02*m20*m31 - m00*m22*m31 - m01*m20*m32 + m00*m21*m32;
      inverse.m32 = m02*m11*m30 - m01*m12*m30 - m02*m10*m31 + m00*m12*m31 + m01*m10*m32 - m00*m11*m32;
      inverse.m33 = m01*m12*m20 - m02*m11*m20 + m02*m10*m21 - m00*m12*m21 - m01*m10*m22 + m00*m11*m22;
      
      return inverse.scale(1/determinant);
    }
  }
  get transpose() {
    return new Matrix4([
      this.m00, this.m01, this.m02, this.m03,
      this.m10, this.m11, this.m12, this.m13,
      this.m20, this.m21, this.m22, this.m23,
      this.m30, this.m31, this.m32, this.m33,
    ]);
  }
  invert() {
    this._elements = this.inverse.toArray();
    return this;
  }
  multiply(b) {
    const a = this.clone();
    
    this.m00 = dot(a.row0, b.col0);
    this.m01 = dot(a.row0, b.col1);
    this.m02 = dot(a.row0, b.col2);
    this.m03 = dot(a.row0, b.col3);
    
    this.m10 = dot(a.row1, b.col0);
    this.m11 = dot(a.row1, b.col1);
    this.m12 = dot(a.row1, b.col2);
    this.m13 = dot(a.row1, b.col3);
    
    this.m20 = dot(a.row2, b.col0);
    this.m21 = dot(a.row2, b.col1);
    this.m22 = dot(a.row2, b.col2);
    this.m23 = dot(a.row2, b.col3);
    
    this.m30 = dot(a.row3, b.col0);
    this.m31 = dot(a.row3, b.col1);
    this.m32 = dot(a.row3, b.col2);
    this.m33 = dot(a.row3, b.col3);
    
    return this;
  }
  multiplyMatrices(...matrices) {
    matrices.forEach(a => this.multiply(a));
    return this;
  }
  scale(scalar) {
    this._elements = this._elements.map(e => e * scalar);
    return this;
  }
  static multiply(a, b) {
    return a.clone().multiply(b);
  }
  static multiplyMatrices(...matrices) {
    return new Matrix4().multiplyMatrices(...matrices);
  }
  static scale(a, scalar) {
    return a.clone().scale(scalar);
  }
  static makeScale(s) {
    return new Matrix4([
      s, 0, 0, 0,
      0, s, 0, 0,
      0, 0, s, 0,
      0, 0, 0, 1,
    ]);
  }
  static makeTranslation(x, y, z) {
    return new Matrix4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1,
    ]);
  }
  static makeRotationX(t) {
    return new Matrix4([
      1,            0,           0, 0,
      0,  Math.cos(t), Math.sin(t), 0,
      0, -Math.sin(t), Math.cos(t), 0,
      0,            0,           0, 1,
    ]);
  }
  static makeRotationY(t) {
    return new Matrix4([
      Math.cos(t), 0, -Math.sin(t), 0,
                0, 1,            0, 0,
      Math.sin(t), 0,  Math.cos(t), 0,
                0, 0,            0, 1,
    ]);
  }
  static makeRotationZ(t) {
    return new Matrix4([
       Math.cos(t), Math.sin(t), 0, 0,
      -Math.sin(t), Math.cos(t), 0, 0,
                0,            0, 1, 0,
                0,            0, 0, 1,
    ]);
  }
  static makeRotation(x, y, z) {
    return Matrix4.multiplyMatrices(
      Matrix4.makeRotationX(x),
      Matrix4.makeRotationY(y),
      Matrix4.makeRotationZ(z),
    );
  }
  static makeFromAxisAngle(axis, t) {
    // normalize the axis
    const u = axis.clone().normalize();
    const [sin, cos] = [Math.sin(t), Math.cos(t)];
    return new Matrix4([
      // column 1
      cos + u.x ** 2 * (1 - cos),
      u.y * u.x * (1 - cos) + u.z * sin,
      u.z * u.x * (1 - cos) - u.y * sin,
      0,
      // column 2
      u.x * u.y * (1 - cos) - u.z * sin,
      cos + u.y ** 2 * (1 - cos),
      u.z * u.y * (1 - cos) + u.x * sin,
      0,
      // column 3
      u.x * u.z * (1 - cos) + u.y * sin,
      u.y * u.z * (1 - cos) - u.x * sin,
      cos + u.z ** 2 * (1 - cos),
      0,
      // column 4
      0, 0, 0, 1,
    ]);
  }
  static makeOrthographic(left, right, bottom, top, near, far) {
    return new Matrix4([
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0, 0,
      
      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1,
    ]);
  }
  static makePerspective(fov, aspect, near, far) {
    const f = Math.tan(Math.PI * 0.5 - 0.5* fov);
    const rangeInv = 1 / (near - far);
    
    return new Matrix4([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0,
    ]);
  }
  static get IDENTITY() {
    return new Matrix4();
  }
}

for (let i = 0; i < 4; i++) {
  Object.defineProperties(
    Matrix4.prototype,
    {
      [`col${i}`]: {
        get() {
          return this._elements.slice(i*4, i*4+4);
        },
        set(array) {
          this._elements.splice(i*4, 4, ...array.slice(0, 4));
        },
      },
      [`row${i}`]: {
        get() {
          return [
            this._elements[i],
            this._elements[i+4],
            this._elements[i+8],
            this._elements[i+12],
          ];
        },
        set(array) {
          this._elements[i] = array[0];
          this._elements[i+4] = array[1];
          this._elements[i+8] = array[2];
          this._elements[i+12] = array[3];
        },
      }
    }
  );
  
  for (let j = 0; j < 4; j++) {
    // j => row, i => column
    Object.defineProperty(
      Matrix4.prototype,
      `m${j}${i}`,
      {
        get() {
          return this._elements[i * 4 + j];
        },
        set(value) {
          this._elements[i * 4 + j] = value;
        },
      }
    );
  }
}

export { Matrix4 };