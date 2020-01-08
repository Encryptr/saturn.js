import { Light } from './Light.js';
import { Color } from './Color.js';
import { Vector3} from './math/Vector3.js';

export class PointLight extends Light {
  constructor({
    color = new Color(255, 255, 255),
    intensity = 1.0,
  }) {
    super(color, intensity);
  }
  get isPointLight() {
    return true;
  }
}