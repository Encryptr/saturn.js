import {
  RepeatWrapping,
  LinearMipmapLinearFilter,
  LinearFilter,
} from './constants.js';

export class Texture {
  constructor(image) {
    this._image = image;
    this._id = Symbol();
    this._wrapS = RepeatWrapping;
    this._wrapT = RepeatWrapping;
    this._minFilter = LinearMipmapLinearFilter;
    this._magFilter = LinearFilter;
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
    this._wrapS = mode;
    this._id = Symbol();
  }
  get wrapT() {
    return this._wrapT;
  }
  set wrapT(mode) {
    this._wrapT = mode;
    this._id = Symbol();
  }
  get minFilter() {
    return this._minFilter;
  }
  set minFilter(mode) {
    this._minFilter = mode;
    this._id = Symbol();
  }
  get magFilter() {
    return this._magFilter;
  }
  set magFilter(mode) {
    this._magFilter = mode;
    this._id = Symbol();
  }
}