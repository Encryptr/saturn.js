import { Vector3 } from './Vector3.js';
import { Vector4 } from './Vector4.js';

class Matrix4 {
  // note: elements are arranged in column-major order
  // m{row}{column} getters/setters can be used to access individual elements
  constructor(array = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]) { // => Matrix4
    this._elements = array.slice(0, 16);
  }
  
  get isMatrix4() { // => boolean
    return true;
  }
  
  toArray() { // => Array
    return [...this._elements];
  }
  
  toFloat32Array(target = new Float32Array(16)) { // => Float32Array
    target.set(this._elements);
    return target;
  }
  
  copyIntoFloat32Array(typedArray) {
    typedArray.set(this._elements);
    return typedArray;
  }
  
  copy(matrix) {
    if (matrix.isMatrix4) {
      this._elements = matrix.toArray();
    } else {
      console.warn('Matrix4.js: (.copy) expected matrix to be of type SATURN.Matrix4.');
    }
    return this;
  }
  
  clone() { // => Matrix4
    return new Matrix4(this.toArray());
  }
  
  set(array) {
    if (Array.isArray(array)) {
      this._elements = array.slice(0, 16);
    } else {
      console.warn('Matrix4.js: (.set) expected array to be of type Array.');
    }
    return this;
  }
  
  equals(matrix, tolerance = 0.001) { // => boolean
    if (matrix.isMatrix4) {
      const array = matrix.toArray();
      return this._elements.every((m, i) => (
        Math.abs(m - array[i]) < tolerance
      ));
    } else {
      console.warn('Matrix4.js: (.equals) expected matrix to be of type SATURN.Matrix4.');
      return false;
    }
  }
  
  get determinant() { // => number
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
  
  get inverse() { // => Matrix4 or undefined
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
      
      return inverse.scale(1/determinant);
    }
  }
  
  get transpose() { // => Matrix4
    return new Matrix4([
      this.m11, this.m12, this.m13, this.m14,
      this.m21, this.m22, this.m23, this.m24,
      this.m31, this.m32, this.m33, this.m34,
      this.m41, this.m42, this.m43, this.m44,
    ]);
  }
  
  invert() { // => Matrix4
    this._elements = this.inverse.toArray();
    return this;
  }
  
  _multiply(b) { // => Matrix4
    if (b.isMatrix4) {
      const a = this.clone();
      
      this.m11 = a.row1.dot(b.col1);
      this.m12 = a.row1.dot(b.col2);
      this.m13 = a.row1.dot(b.col3);
      this.m14 = a.row1.dot(b.col4);
      
      this.m21 = a.row2.dot(b.col1);
      this.m22 = a.row2.dot(b.col2);
      this.m23 = a.row2.dot(b.col3);
      this.m24 = a.row2.dot(b.col4);
      
      this.m31 = a.row3.dot(b.col1);
      this.m32 = a.row3.dot(b.col2);
      this.m33 = a.row3.dot(b.col3);
      this.m34 = a.row3.dot(b.col4);
      
      this.m41 = a.row4.dot(b.col1);
      this.m42 = a.row4.dot(b.col2);
      this.m43 = a.row4.dot(b.col3);
      this.m44 = a.row4.dot(b.col4);
    } else {
      console.warn('Matrix4.js: (._multiply) expected b to be of type SATURN.Matrix4.');
    }
    return this;
  }
  
  multiply(...matrices) { // => Matrix4
    if (matrices.every(matrix => matrix.isMatrix4)) {
      matrices.forEach(a => this._multiply(a));
    } else {
      console.warn('Matrix4.js: (.multiply) expected matrices to be of type SATURN.Matrix4.');
    }
    return this;
  }
  
  scale(scalar) { // => Matrix4
    this._elements = this._elements.map(e => e * scalar);
    return this;
  }
  
  setIdentity() {
    this._elements = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
    return this;
  }
  
  setFromScale(x, y, z) { // => Matrix4
    this._elements = [
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1,
    ];
    return this;
  }
  
  setFromTranslation(x, y, z) { // => Matrix4
    this._elements = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1,
    ];
    return this;
  }
  
  setFromRoll(t) { // => Matrix4
    this._elements = [
      1,            0,           0, 0,
      0,  Math.cos(t), Math.sin(t), 0,
      0, -Math.sin(t), Math.cos(t), 0,
      0,            0,           0, 1,
    ];
    return this;
  }
  
  setFromPitch(t) { // => Matrix4
    this._elements = [
      Math.cos(t), 0, -Math.sin(t), 0,
                0, 1,            0, 0,
      Math.sin(t), 0,  Math.cos(t), 0,
                0, 0,            0, 1,
    ];
    return this;
  }
  
  setFromYaw(t) { // => Matrix4
    this._elements = [
       Math.cos(t), Math.sin(t), 0, 0,
      -Math.sin(t), Math.cos(t), 0, 0,
                0,            0, 1, 0,
                0,            0, 0, 1,
    ];
    return this;
  }
  
  setFromEuler(roll, pitch, yaw, order) { // => Matrix4
    this.setIdentity();
    if (order === 'XYZ') {
      this.multiply(
        new Matrix4().setFromRoll(roll),
        new Matrix4().setFromPitch(pitch),
        new Matrix4().setFromYaw(yaw),
      );
    } else if (order === 'ZYX') {
      this.multiply(
        new Matrix4().setFromYaw(yaw),
        new Matrix4().setFromPitch(pitch),
        new Matrix4().setFromRoll(roll),
      );
    }
    return this;
  }
  
  setFromQuaternion(quat) {
    // quat is assumed to be a unit quaternion
    if (quat.isQuaternion) {
      //https://www.cprogramming.com/tutorial/3d/quaternions.html
      const x = quat.x, y = quat.y, z = quat.z, w = quat.w;
      const x2 = quat.x**2, y2 = quat.y**2, z2 = quat.z**2;
      this._elements = [
        1-2*y2-2*z2, 2*x*y+2*w*z, 2*x*z-2*w*y, 0,
        2*x*y-2*w*z, 1-2*x2-2*z2, 2*y*z+2*w*x, 0,
        2*x*z+2*w*y, 2*y*z-2*w*x, 1-2*x2-2*y2, 0,
                  0,           0,           0, 1,
      ];
    } else {
      console.warn('Matrix4.js: (.setFromQuaternion) expected quat to be of type SATURN.Quaternion.');
    }
    return this;
  }
  
  makeOrthographic(left, right, bottom, top, near, far) { // => Matrix4
    this._elements = [
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0, 0,
      
      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1,
    ];
    return this;
  }
  
  makePerspective(fov, aspect, near, far) { // => Matrix4
    const f = Math.tan(Math.PI * 0.5 - 0.5* fov);
    const rangeInv = 1 / (near - far);
    
    this._elements = [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0,
    ];
    return this;
  }
  
  *[Symbol.iterator]() {
    for (let i = 0; i < 16; i++) {
      yield this._elements[i];
    }
  }
}

for (let i = 0; i < 4; i++) {
  Object.defineProperties(
    Matrix4.prototype,
    {
      [`col${i+1}`]: {
        get() { // => Vector4
          return new Vector4(
            ...this._elements.slice(i*4, i*4+4)
          );
        },
        set(vector) { // => Vector4
          if (vector.isVector4) {
            this._elements.splice(i*4, 4, ...vector.toArray());
          } else {
            console.warn(`Matrix4.js: (.set col${i+1}) expected vector to be of type SATURN.Vector4.`);
          }
        },
      },
      [`row${i+1}`]: {
        get() { // => Vector4
          return new Vector4(
            this._elements[i],
            this._elements[i+4],
            this._elements[i+8],
            this._elements[i+12],
          );
        },
        set(vector) { // => Vector4
          if (vector.isVector4) {
            this._elements[i] = vector.x;
            this._elements[i+4] = vector.y;
            this._elements[i+8] = vector.z;
            this._elements[i+12] = vector.w;
          } else {
            console.warn(`Matrix4.js: (.set row${i+1}) expected vector to be of type SATURN.Vector4.`);
          }
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
        get() { // => number
          return this._elements[i * 4 + j];
        },
        set(value) { // => number
          this._elements[i * 4 + j] = value;
        },
      }
    );
  }
}

export { Matrix4 };