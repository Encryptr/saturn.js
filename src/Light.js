import { RenderObject } from './RenderObject.js';
import { Color } from './Color.js';
import { clamp } from './misc.js';

class Light extends RenderObject {
  constructor(color = new Color(255, 255, 255), intensity = 1.0) {
    super();
    this._color = color;
    this._color.onchange = () => this._ci.set(this._color.toArrayNormalized(), 0);
    this._intensity = intensity;
    
    // optimization for uniform uploading
    this._ci = new Float32Array([...color.toArrayNormalized(), intensity]);
  }
  get isLight() {
    return true;
  }
  get color() {
    return this._color;
  }
  set color(color) {
    if (color.isColor) {
      this._color = color;
      this._color.onchange = () => this._ci.set(this._color.toArrayNormalized(), 0);
      this._color.onchange();
    } else {
      console.warn('Light.js: (.set color) expected color to be of type SATURN.Color.');
    }
  }
  get intensity() {
    return this._intensity;
  }
  set intensity(value) {
    this._intensity = value;
    this._ci[3] = value;
  }
}

export { Light };