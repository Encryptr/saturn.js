class Matrix4 {
  constructor(init = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]) {
    this._elements = init;
  }
  get elements() {
    return [...this._elements];
  }
  toFloat32Array() {
    const a = this.elements;
    return new Float32Array([
      a[0], a[4],  a[8], a[12],
      a[1], a[5],  a[9], a[13],
      a[2], a[6], a[10], a[14],
      a[3], a[7], a[11], a[15],
    ]);
  }
  copy() {
    return new Matrix4(this.elements);
  }
  get determinant() {
    // http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    const [
      a, b, c, d, 
      e, f, g, h,
      i, j, k, l,
      m, n, o, p,
    ] = this._elements;
    const det =
      d*g*j*m - c*h*j*m - d*f*k*m + b*h*k*m+
      c*f*l*m - b*g*l*m - d*g*i*n + c*h*i*n+
      d*e*k*n - a*h*k*n - c*e*l*n + a*g*l*n+
      d*f*i*o - b*h*i*o - d*e*j*o + a*h*j*o+
      b*e*l*o - a*f*l*o - c*f*i*p + b*g*i*p+
      c*e*j*p - a*g*j*p - b*e*k*p + a*f*k*p;
    return det;
  }
  get inverse() {
    // http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    const [
      a, b, c, d, 
      e, f, g, h,
      i, j, k, l,
      m, n, o, p,
    ] = this._elements;
    const det = this.determinant;
    if (det === 0) {
      console.warn('Matrix4: .inverse cannot invert matrix, .determinant returned 0', this);
      return undefined;
    } else {
      const inverse = new Matrix4();
      const inv = inverse._elements;
      
      inv[0]  = g*l*n - h*k*n + h*j*o - f*l*o - g*j*p + f*k*p;
      inv[1]  = d*k*n - c*l*n - d*j*o + b*l*o + c*j*p - b*k*p;
      inv[2]  = c*h*n - d*g*n + d*f*o - b*h*o - c*f*p + b*g*p;
      inv[3]  = d*g*j - c*h*j - d*f*k + b*h*k + c*f*l - b*g*l;
      
      inv[4]  = h*k*m - g*l*m - h*i*o + e*l*o + g*i*p - e*k*p;
      inv[5]  = c*l*m - d*k*m + d*i*o - a*l*o - c*i*p + a*k*p;
      inv[6]  = d*g*m - c*h*m - d*e*o + a*h*o + c*e*p - a*g*p;
      inv[7]  = c*h*i - d*g*i + d*e*k - a*h*k - c*e*l + a*g*l;
      
      inv[8]  = f*l*m - h*j*m + h*i*n - e*l*n - f*i*p + e*j*p;
      inv[9]  = d*j*m - b*l*m - d*i*n + a*l*n + b*i*p - a*j*p;
      inv[10] = b*h*m - d*f*m + d*e*n - a*h*n - b*e*p + a*f*p;
      inv[11] = d*f*i - b*h*i - d*e*j + a*h*j + b*e*l - a*f*l;
      
      inv[12] = g*j*m - f*k*m - g*i*n + e*k*n + f*i*o - e*j*o;
      inv[13] = b*k*m - c*j*m + c*i*n - a*k*n - b*i*o + a*j*o;
      inv[14] = c*f*m - b*g*m - c*e*n + a*g*n + b*e*o - a*f*o;
      inv[15] = b*g*i - c*f*i + c*e*j - a*g*j - b*e*k + a*f*k;
      
      inverse.scale(1/det);
      
      return inverse;
    }
  }
  multiply(matrix, {mutate = true} = {}) {
    const target = mutate ? this : this.copy();
    const [a, b, c] = [
      target.elements, 
      matrix.elements,
      target._elements,
    ];
    
    c[0]  = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
    c[1]  = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
    c[2]  = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
    c[3]  = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];
    
    c[4]  = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
    c[5]  = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
    c[6]  = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
    c[7]  = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];
    
    c[8]  = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
    c[9]  = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
    c[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
    c[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];
    
    c[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
    c[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
    c[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
    c[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];
    
    return target;
  }
  scale(s, mutate = true) {
    const target = mutate ? this : this.copy(); 
      
    for (let i = 0; i < 16; i++) 
      target._elements[i] *= s;
    
    return target;
  }
  
  // utility matrices
  static rotationX(t) {
    return new Matrix4([
      1,           0,            0, 0,
      0, Math.cos(t), -Math.sin(t), 0,
      0, Math.sin(t),  Math.cos(t), 0,
      0,           0,            0, 1,
    ]);
  }
  static rotationY(t) {
    return new Matrix4([
       Math.cos(t), 0, Math.sin(t), 0,
                 0, 1,           0, 0,
      -Math.sin(t), 0, Math.cos(t), 0,
                 0, 0,           0, 1,
    ]);
  }
  static rotationZ(t) {
    return new Matrix4([
      Math.cos(t), -Math.sin(t), 0, 0,
      Math.sin(t),  Math.cos(t), 0, 0,
                0,            0, 1, 0,
                0,            0, 0, 1,
    ]);
  }
  static translation(x, y, z) {
    return new Matrix4([
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, z,
      0, 0, 0, 1,
    ]);
  }
  static scale(s) {
    return new Matrix4([
      s, 0, 0, 0,
      0, s, 0, 0,
      0, 0, s, 0,
      0, 0, 0, 1,
    ]);
  }
  static rotation(x, y, z) {
    return new Matrix4().multiplyMatrices([
      Matrix4.rotationX(x),
      Matrix4.rotationY(y),
      Matrix4.rotationZ(z),
    ]);
  }
    
  // extra
  multiplyMatrices(matrices, {mutate = true} = {}) {
    const target = mutate ? this : this.copy();
    const c = target._elements;
    
    matrices.forEach(matrix => {
      const [a, b] = [target.elements, matrix.elements];
      
      c[0]  = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
      c[1]  = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
      c[2]  = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
      c[3]  = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];
    
      c[4]  = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
      c[5]  = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
      c[6]  = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
      c[7]  = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];
    
      c[8]  = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
      c[9]  = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
      c[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
      c[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];
      
      c[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
      c[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
      c[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
      c[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];
    });  
    
    return target;
  }
    
  // GL matrices
  static perspective(fov, aspect, near, far) {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
    const rangeInv = 1 / (near - far);
    return new Matrix4([
      f / aspect, 0,                       0,                         0,
               0, f,                       0,                         0,
               0, 0, (near + far) * rangeInv, near * far * rangeInv * 2,
               0, 0,                      -1,                         0,
    ]);
  }
}

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  copy() {
    return new Vector3(this.x, this.y, this.z);
  }
  get magnitude() {
    return Math.sqrt(this.x**2 + this.y**2 + this.z**2);
  }
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  scale(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }
  normalize() {
    const magnitude = this.magnitude;
    this.scale(1/magnitude);
    return this;
  }
  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
    yield this.z;
  }
}

export { Matrix4, Vector3 };