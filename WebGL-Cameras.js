import RenderObject from './WebGL-RenderObject.js';
import Matrix4 from './WebGL-matrix.js';

// TODO: .lookAt(x, y, z) method

class PerspectiveCamera extends RenderObject {
	constructor(fov, near, far, aspect) {
		super();
		this._projectionMatrix = Matrix4.perspective(fov, near, far, aspect);
	}
	get viewMatrix() {
		// cameraMatrix = modelMatrix
		return this._modelMatrix.inverse();
	}
	get projectionMatrix() {
		return this._projectionMatrix;
	}
	updateProjectionMatrix(fov, near, far, aspect) {
		this._projectionMatrix = Matrix4.perspective(fov, near, far, aspect);
	}
}

export { PerspectiveCamera };