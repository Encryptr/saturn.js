class Texture {
  constructor(image) {
    this._image = image;
  }
  get isTexture() {
    return true;
  }
  get image() {
    return this._image;
  }
}

export { Texture };