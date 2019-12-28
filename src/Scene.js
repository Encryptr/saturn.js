import { RenderObject } from './RenderObject.js';
import { Color } from './Color.js';
import { Fog } from './Fog.js';

// TODO: implement fog when uniform system is implemented
class Scene extends RenderObject {
  constructor() {
    super();
    this._background = new Color();
    this._fog = new Fog();
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
  get fog() {
    return this._fog;
  }
  set fog(fog) {
    if (fog.isFog) {
      this._fog = fog;
    } else {
      console.warn('Scene.js: (.set fog) expected fog to be of type SATURN.Fog.');
    }
  }
}

export { Scene };