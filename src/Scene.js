import { RenderObject } from './RenderObject.js';
import { Color } from './Color.js';
import { Fog } from './Fog.js';

// TODO: implement fog when uniform system is implemented
class Scene extends RenderObject {
  constructor() {
    super();
    this._background = new Color();
    this._ambientColor = new Color();
    this._ambientIntensity = 0;
    this._fogColor = new Color();
    this._fogDensity = 0;
  }
  get isScene() {
    return true;
  }
  get background() {
    return this._background;
  }
  set background(color) {
    this._background = color;
  }
  get ambientColor() {
    return this._ambientColor;
  }
  set ambientColor(color) {
    this._ambientColor = color;
  }
  get ambientIntensity() {
    return this._ambientIntensity;
  }
  set ambientIntensity(value) {
    this._ambientIntensity = value;
  }
}

export { Scene };