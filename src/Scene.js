import { RenderObject } from './RenderObject.js';

class Scene extends RenderObject {
  get isScene() {
    return true;
  }
}

export { Scene };