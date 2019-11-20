import { Matrix4, Vector3 } from './WebGL-matrix.js';

class RenderObject {
  constructor() { // => 
    this._modelMatrix = Matrix4.IDENTITY;
    
		this._position = new Proxy(
			new Vector3(0, 0, 0),
			{
        // arrow function causes 'this' to refer to RenderObject object
				set: (object, coord, val) => {
          object[coord] = val;
          this._computeModelMatrix();
          return true; // success
				},
			}
		);
		this._rotation = new Proxy(
      new Vector3(0, 0, 0), 
      { 
        // arrow function causes 'this' to refer to RenderObject object
        set: (object, coord, val) => {
          object[coord] = val;
          this._computeModelMatrix();
          return true; // success
        }
      }
    );
		this._scale = 1;
  }
  _computeModelMatrix() {
    this._modelMatrix = Matrix4.IDENTITY;
   	const modelMatrix = this._modelMatrix;
    
    modelMatrix.translateSelf(...this.position);
    modelMatrix.rotateSelf(...this.rotation);
    modelMatrix.scale3dSelf(this.scale);
  }
	get modelMatrix() {
    return this._modelMatrix;
	}
	get position() {
		return this._position;
	}
	get rotation() {
		return this._rotation;
	}
	get scale() {
		return this._scale;
	}
	set scale(scalar) {
    this._scale = scalar;
    this._computeModelMatrix();
	}
}

export default RenderObject;