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
    if (color.isColor) {
      this._background = color;
    } else {
      console.warn('Scene.js: (.set background) expected color to be of type SATURN.Color.');
    }
  }
  get ambientColor() {
    return this._ambientColor;
  }
  set ambientColor(color) {
    if (color.isColor) {
      this._ambientColor = color;
    } else {
      console.warn('Scene.js: (.set ambientColor) expected color to be of type SATURN.Color.');
    }
  }
  get ambientIntensity() {
    return this._ambientIntensity;
  }
  set ambientIntensity(value) {
    this._ambientIntensity = value;
  }
}

export { Scene };