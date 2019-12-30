import { generateKey } from './misc.js';

class Texture {
  constructor(image) {
    this._image = image;
    this._id = generateKey();
  }
  get isTexture() {
    return true;
  }
  get id() {
    return this._id;
  }
  get image() {
    return this._image;
  }
}

export { Texture };