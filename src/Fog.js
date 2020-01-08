import { Color } from './Color.js';
import { clamp } from './misc.js';

export class Fog {
  constructor(color = new Color(), density = 0) {
    this._color = color;
    this._density = clamp(density, 0, 1);
  }
  get isFog() {
    return true;
  }
  get color() {
    return this._color;
  }
  set color(color) {
    this._color = color;
  }
  get density() {
    return this._density;
  }
  set density(number) {
    this._density = clamp(number, 0, 1);
  }
}