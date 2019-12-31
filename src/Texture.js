import { generateKey } from './misc.js';
import * as Constants from './constants.js';

const validWrapModes = [
  Constants.RepeatWrapping,
  Constants.ClampToEdgeWrapping,
  Constants.MirroredRepeatWrapping,
];
const validMinFilters = [
  Constants.NearestFilter,
  Constants.LinearFilter,
  Constants.NearestMipmapNearestFilter,
  Constants.LinearMipmapNearestFilter,
  Constants.NearestMipmapLinearFilter,
  Constants.LinearMipmapLinearFilter,
];

const validMagFilters = [
  Constants.NearestFilter,
  Constants.LinearFilter,
];

class Texture {
  constructor(image) {
    this._image = image;
    this._id = generateKey();
    this._wrapS = Constants.RepeatWrapping;
    this._wrapT = Constants.RepeatWrapping;
    this._minFilter = Constants.LinearMipmapLinearFilter;
    this._magFilter = Constants.LinearFilter;
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
  get wrapS() {
    return this._wrapS;
  }
  set wrapS(mode) {
    if (validWrapModes.includes(mode)) {
      this._wrapS = mode;
      this._id = generateKey();
    } else {
      console.warn('Texture.js: (.set wrapS) invalid wrapping mode.');
    }
  }
  get wrapT() {
    return this._wrapT;
  }
  set wrapT(mode) {
    if (validWrapModes.includes(mode)) {
      this._wrapT = mode;
      this._id = generateKey();
    } else {
      console.warn('Texture.js: (.set wrapT) invalid wrapping mode.');
    }
  }
  get minFilter() {
    return this._minFilter;
  }
  set minFilter(mode) {
    if (validMinFilters.includes(mode)) {
      this._minFilter = mode;
      this._id = generateKey();
    } else {
      console.warn('Texture.js: (.set minFilter) invalid filtering mode.');
    }
  }
  get magFilter() {
    return this._magFilter;
  }
  set magFilter(mode) {
    if (validMagFilters.includes(mode)) {
      this._magFilter = mode;
      this._id = generateKey();
    } else {
      console.warn('Texture.js: (.set magFilter) invalid filtering mode.');
    }
  }
}

export { Texture };