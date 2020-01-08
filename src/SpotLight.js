import { Light } from './Light.js';
import { Color } from './Color.js';
import { Vector3 } from './math/Vector3.js';

export class SpotLight extends Light {
  constructor({
    color = new Color(255, 255, 255),
    intensity = 1,
    direction = new Vector3(0, 0, -1),
    limit = 0,
  }) {
    super(color, intensity);
    this._direction = direction
    this._limit = limit;
    this._direction = direction;
  }
  get isSpotLight() {
    return true;
  }
  get direction() {
    return this._direction;
  }
  set direction(vector) {
    this._direction = vector;
  }
  get limit() {
    return this._limit;
  }
  set limit(value) {
    this._limit = value;
  }
}