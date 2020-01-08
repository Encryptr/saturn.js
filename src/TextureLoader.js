import { Texture } from './Texture.js';
import { Cache } from './Cache.js';

export class TextureLoader {
  constructor() {
    this._cache = new Cache();
  }
  async load(url) {
    const texture = this._cache.get(url);
    if (texture) {
      return texture;
    } else {
      const image = await loadImage(url);
      const texture = new Texture(image);
      this._cache.set(url, texture);
      return texture;
    }
  }
}

function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.src = url;
  });
}