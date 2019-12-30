import { Light } from './Light.js';
import { Color } from './Color.js';
import { Vector3} from './math/Vector3.js';

// already has position because prototype of Light is RenderObject
class PointLight extends Light {
  constructor({
    color = new Color(255, 255, 255),
    intensity = 1.0,
    position = new Vector3(0, 0, 0),
  }={}) {
    super({color, intensity});
    
    // call RenderObject position setter
    this.position = position;
  }
  get isPointLight() {
    return true;
  }
}

export { PointLight };