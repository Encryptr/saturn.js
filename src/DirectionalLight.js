import { Light } from './Light.js';
import { Color } from './Color.js';
import { Vector3 } from './math/Vector3.js';

export class DirectionalLight extends Light {
  constructor({
    color = new Color(255, 255, 255),
    intensity = 1.0,
    direction = new Vector3(0, 0, -1),
  }) {
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
    this._direction = vector;
  }
}