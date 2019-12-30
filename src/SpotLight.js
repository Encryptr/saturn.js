import { Light } from './Light.js';
import { Color } from './Color.js';
import { Vector3 } from './math/Vector3.js';

// already has position because prototype of Light is RenderObject
class SpotLight extends Light {
  constructor({
    color = new Color(255, 255, 255),
    intensity = 1,
    direction = new Vector3(0, 0, -1),
    limit = 0,
    position = new Vector3(0, 0, 0),
  }={}) {
    super({color, intensity});
    this._direction = direction.clone().normalize();
    this._limit = limit;
    
    // call RenderObject position setter
    this.position = position;
  }
  get isSpotLight() {
    return true;
  }
  get direction() {
    return this._direction;
  }
  set direction(vector) {
    if (vector.isVector3) {
      this._direction.copy(vector).normalize();
    } else {
      console.warn('SpotLight.js: (.set direction) expected vector to be of type SATURN.Vector3.');
    }
  }
  get limit() {
    return this._limit;
  }
  set limit(value) {
    this._limit = value;
  }
}

export { SpotLight };