import { RenderObject } from './RenderObject.js';
import { Color } from './Color.js';
import { clamp } from './misc.js';

class Light extends RenderObject {
  constructor(color = new Color(255, 255, 255), intensity = 1.0) {
    super();
    this._color = color;
    this._intensity = intensity;
  }
  get isLight() {
    return true;
  }
  get color() {
    return this._color;
  }
  set color(color) {
    this._color = color;
  }
  get intensity() {
    return this._intensity;
  }
  set intensity(value) {
    this._intensity = value;
  }
}

export { Light };