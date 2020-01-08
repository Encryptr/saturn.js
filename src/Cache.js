export class Cache {
  constructor() {
    this._internal = {};
  }
  get(name) {
    return this._internal[name];
  }
  set(name, value) {
    this._internal[name] = value;
  }
  clear() {
    this._internal = {};
  }
}