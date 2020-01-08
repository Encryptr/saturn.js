import { Vector3 } from './Vector3.js';
import { Vector4 } from './Vector4.js';

// elements are arranged in column-major order
export class Matrix4 {
  constructor(array = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]) {
    this._elements = array.slice(0, 16);
  }
  
  // Methods
  toArray() {
    return [...this._elements];
  }
  toFloat32Array(target = new Float32Array(16)) {
    target.set(this._elements);
    return target;
  }
  copy(matrix) {
    this._elements = matrix.toArray();
    return this;
  }
  clone() {
    return new Matrix4(this.toArray());
  }
  set(array) {
    this._elements = array.slice(0, 16);
    return this;
  }
  equals(matrix, tolerance = 0.001) {
    const array = matrix.toArray();
    return this._elements.every((m, i) => (
      Math.abs(m - array[i]) < tolerance
    ));
  }
  invert() {
    this._elements = this.inverse.toArray();
    return this;
  }
  multiply(matrix) {
    const row1 = this.row1,
          row2 = this.row2,
          row3 = this.row3,
          row4 = this.row4;
    
    this.m11 = row1.dot(matrix.col1);
    this.m12 = row1.dot(matrix.col2);
    this.m13 = row1.dot(matrix.col3);
    this.m14 = row1.dot(matrix.col4);
    
    this.m21 = row2.dot(matrix.col1);
    this.m22 = row2.dot(matrix.col2);
    this.m23 = row2.dot(matrix.col3);
    this.m24 = row2.dot(matrix.col4);
    
    this.m31 = row3.dot(matrix.col1);
    this.m32 = row3.dot(matrix.col2);
    this.m33 = row3.dot(matrix.col3);
    this.m34 = row3.dot(matrix.col4);
    
    this.m41 = row4.dot(matrix.col1);
    this.m42 = row4.dot(matrix.col2);
    this.m43 = row4.dot(matrix.col3);
    this.m44 = row4.dot(matrix.col4);
      
    return this;
  }
  premultiply(matrix) {
    const row1 = matrix.row1,
          row2 = matrix.row2,
          row3 = matrix.row3,
          row4 = matrix.row4;
    
    this.m11 = row1.dot(this.col1);
    this.m12 = row1.dot(this.col2);
    this.m13 = row1.dot(this.col3);
    this.m14 = row1.dot(this.col4);
    
    this.m21 = row2.dot(this.col1);
    this.m22 = row2.dot(this.col2);
    this.m23 = row2.dot(this.col3);
    this.m24 = row2.dot(this.col4);
    
    this.m31 = row3.dot(this.col1);
    this.m32 = row3.dot(this.col2);
    this.m33 = row3.dot(this.col3);
    this.m34 = row3.dot(this.col4);
    
    this.m41 = row4.dot(this.col1);
    this.m42 = row4.dot(this.col2);
    this.m43 = row4.dot(this.col3);
    this.m44 = row4.dot(this.col4);
      
    return this;
  }
  scale(scalar) {
    this._elements = this._elements.map(e => e * scalar);
    return this;
  }
  *[Symbol.iterator]() {
    for (let i = 0; i < 16; i++) {
      yield this._elements[i];
    }
  }
  
  // Static Methods
  static Multiply(...matrices) {
    const product = Matrix4.Identity;
    for (let i = 0; i < matrices.length; i++) {
      product.multiply(matrices[i]);
    }
    return product;
  }
  static Translation(x, y, z) {
    return new Matrix4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1,
    ]);
  }
  static Scale(x, y, z) {
    return new Matrix4([
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1,
    ]);
  }
  static RotationX(t) {
    return new Matrix4([
      1,            0,           0, 0,
      0,  Math.cos(t), Math.sin(t), 0,
      0, -Math.sin(t), Math.cos(t), 0,
      0,            0,           0, 1,
    ]);
  }
  static RotationY(t) {
    return new Matrix4([
      Math.cos(t), 0, -Math.sin(t), 0,
                0, 1,            0, 0,
      Math.sin(t), 0,  Math.cos(t), 0,
                0, 0,            0, 1,
    ]);
  }
  static RotationZ(t) {
    return new Matrix4([
       Math.cos(t), Math.sin(t), 0, 0,
      -Math.sin(t), Math.cos(t), 0, 0,
                0,            0, 1, 0,
                0,            0, 0, 1,
    ]);
  }
  static FromQuaternion(quaternion) {
    
    // quat is assumed to be a unit quaternion
    //https://www.cprogramming.com/tutorial/3d/quaternions.html
    const x = quaternion.x, y = quaternion.y, z = quaternion.z, w = quaternion.w;
    const x2 = quaternion.x**2, y2 = quaternion.y**2, z2 = quaternion.z**2;
    
    return new Matrix4([
      1-2*y2-2*z2, 2*x*y+2*w*z, 2*x*z-2*w*y, 0,
      2*x*y-2*w*z, 1-2*x2-2*z2, 2*y*z+2*w*x, 0,
      2*x*z+2*w*y, 2*y*z-2*w*x, 1-2*x2-2*y2, 0,
                0,           0,           0, 1,
    ]);
  }
  static Orthographic(left, right, bottom, top, near, far) {
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
  static Perspective(fov, aspect, near, far) {
    const f = Math.tan(Math.PI * 0.5 - 0.5* fov);
    const rangeInv = 1 / (near - far);
    
    return new Matrix4([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0,
    ]);
  }
  
  // Accessors
  get isMatrix4() {
    return true;
  }
  get determinant() {
    // https://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    const [
      m11, m21, m31, m41,
      m12, m22, m32, m42,
      m13, m23, m33, m43,
      m14, m24, m34, m44,
    ] = this._elements;
    
    return (
      m14*m23*m32*m41 - m13*m24*m32*m41 - m14*m22*m33*m41 + m12*m24*m33*m41 +
      m13*m22*m34*m41 - m12*m23*m34*m41 - m14*m23*m31*m42 + m13*m24*m31*m42 +
      m14*m21*m33*m42 - m11*m24*m33*m42 - m13*m21*m34*m42 + m11*m23*m34*m42 +
      m14*m22*m31*m43 - m12*m24*m31*m43 - m14*m21*m32*m43 + m11*m24*m32*m43 +
      m12*m21*m34*m43 - m11*m22*m34*m43 - m13*m22*m31*m44 + m12*m23*m31*m44 +
      m13*m21*m32*m44 - m11*m23*m32*m44 - m12*m21*m33*m44 + m11*m22*m33*m44
    );
  }
  get inverse() {
    // https://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    const determinant = this.determinant;
    if (determinant === 0) {
      return undefined;
    } else {
      const [
        m11, m21, m31, m41,
        m12, m22, m32, m42,
        m13, m23, m33, m43,
        m14, m24, m34, m44,
      ] = this._elements;
      const inverse = new Matrix4();
      
      inverse.m11 = m23*m34*m42 - m24*m33*m42 + m24*m32*m43 - m22*m34*m43 - m23*m32*m44 + m22*m33*m44;
      inverse.m12 = m14*m33*m42 - m13*m34*m42 - m14*m32*m43 + m12*m34*m43 + m13*m32*m44 - m12*m33*m44;
      inverse.m13 = m13*m24*m42 - m14*m23*m42 + m14*m22*m43 - m12*m24*m43 - m13*m22*m44 + m12*m23*m44;
      inverse.m14 = m14*m23*m32 - m13*m24*m32 - m14*m22*m33 + m12*m24*m33 + m13*m22*m34 - m12*m23*m34;
      
      inverse.m21 = m24*m33*m41 - m23*m34*m41 - m24*m31*m43 + m21*m34*m43 + m23*m31*m44 - m21*m33*m44;
      inverse.m22 = m13*m34*m41 - m14*m33*m41 + m14*m31*m43 - m11*m34*m43 - m13*m31*m44 + m11*m33*m44;
      inverse.m23 = m14*m23*m41 - m13*m24*m41 - m14*m21*m43 + m11*m24*m43 + m13*m21*m44 - m11*m23*m44;
      inverse.m24 = m13*m24*m31 - m14*m23*m31 + m14*m21*m33 - m11*m24*m33 - m13*m21*m34 + m11*m23*m34;
      
      inverse.m31 = m22*m34*m41 - m24*m32*m41 + m24*m31*m42 - m21*m34*m42 - m22*m31*m44 + m21*m32*m44;
      inverse.m32 = m14*m32*m41 - m12*m34*m41 - m14*m31*m42 + m11*m34*m42 + m12*m31*m44 - m11*m32*m44;
      inverse.m33 = m12*m24*m41 - m14*m22*m41 + m14*m21*m42 - m11*m24*m42 - m12*m21*m44 + m11*m22*m44;
      inverse.m34 = m14*m22*m31 - m12*m24*m31 - m14*m21*m32 + m11*m24*m32 + m12*m21*m34 - m11*m22*m34;
      
      inverse.m41 = m23*m32*m41 - m22*m33*m41 - m23*m31*m42 + m21*m33*m42 + m22*m31*m43 - m21*m32*m43;
      inverse.m42 = m12*m33*m41 - m13*m32*m41 + m13*m31*m42 - m11*m33*m42 - m12*m31*m43 + m11*m32*m43;
      inverse.m43 = m13*m22*m41 - m12*m23*m41 - m13*m21*m42 + m11*m23*m42 + m12*m21*m43 - m11*m22*m43;
      inverse.m44 = m12*m23*m31 - m13*m22*m31 + m13*m21*m32 - m11*m23*m32 - m12*m21*m33 + m11*m22*m33;
      
      return inverse.scale(1 / determinant);
    }
  }
  get transpose() {
    return new Matrix4([
      this.m11, this.m12, this.m13, this.m14,
      this.m21, this.m22, this.m23, this.m24,
      this.m31, this.m32, this.m33, this.m34,
      this.m41, this.m42, this.m43, this.m44,
    ]);
  }
  
  // Static Accessors
  static get Identity() {
    return new Matrix4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }
}

// Accessors
for (let i = 0; i < 4; i++) {
  Object.defineProperties(
    Matrix4.prototype,
    {
      [`col${i+1}`]: {
        get() {
          return new Vector4(
            ...this._elements.slice(i*4, i*4+4)
          );
        },
        set(vector) {
          this._elements.splice(i*4, 4, ...vector.toArray());
        },
      },
      [`row${i+1}`]: {
        get() {
          return new Vector4(
            this._elements[i],
            this._elements[i+4],
            this._elements[i+8],
            this._elements[i+12],
          );
        },
        set(vector) {
          this._elements[i] = vector.x;
          this._elements[i+4] = vector.y;
          this._elements[i+8] = vector.z;
          this._elements[i+12] = vector.w;
        },
      }
    }
  );
  
  for (let j = 0; j < 4; j++) {
    // j => row, i => column
    Object.defineProperty(
      Matrix4.prototype,
      `m${j+1}${i+1}`,
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