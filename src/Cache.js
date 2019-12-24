class Cache {
  constructor() {
    this._internal = {};
  }
  get(name) {
    return this._internal[name] || false;
  }
  set(name, value) {
    this._internal[name] = value;
  }
  clear() {
    this._internal = {};
  }
}

export { Cache };