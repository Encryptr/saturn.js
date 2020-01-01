import { Light } from './Light.js';
import { Color } from './Color.js';
import { Vector3 } from './math/Vector3.js';

class DirectionalLight extends Light {
  constructor(color = new Color(255, 255, 255), intensity = 1.0, direction = new Vector3(0, 0, -1)) {
    super(color, intensity);
    this._direction = direction;
  }
  get isDirectionalLight() {
    return true;
  }
  get direction() {
    return this._direction;
  }
  set direction(vector) {
    if (vector.isVector3) {
      this._direction = vector;
    } else {
      console.warn('DirectionalLight.js: (.set direction) expected vector to be of type SATURN.Vector3.');
    }
  }
}

export { DirectionalLight };