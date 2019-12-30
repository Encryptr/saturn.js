import { Material } from './Material.js';
import { generateKey } from './misc.js';
import { Color } from './Color.js';
import vertexShader from './shaders/LambertMaterial.vert.js';
import fragmentShader from './shaders/LambertMaterial.frag.js';

class LambertMaterial extends Material {
  constructor({
    color = new Color(),
    texture = null,
  }={}) {
    super();
    this._color = color;
    this._texture = texture;
    
    this._state = new Proxy({
      numDirLights: 0,
      numPointLights: 0,
      numSpotLights: 0,
    }, {
      set: (object, key, value) => {
        if (object[key] !== value) {
          Reflect.set(object, key, value);
          
          // update define headers
          this._fragmentShader = this._fragmentShader.replace(
            /#define NUM_DIR_LIGHTS \d+/g, `#define NUM_DIR_LIGHTS ${this._state.numDirLights}`
          ).replace(
            /#define NUM_POINT_LIGHTS \d+/g, `#define NUM_POINT_LIGHTS ${this._state.numPointLights}`
          ).replace(
            /#define NUM_SPOT_LIGHTS \d+/g, `#define NUM_SPOT_LIGHTS ${this._state.numSpotLights}`
          );
          
          // reset id
          this._id = generateKey();
        }
        return true;
      }
    });
    
    this._vertexShader = vertexShader;
    this._fragmentShader = fragmentShader;
    this._uniforms = [
      'u_model',
      'u_view',
      'u_projection',
      'u_texture',
    ];
  }
  get isLambertMaterial() {
    return true;
  }
  get state() {
    return this._state;
  }
  get color() {
    return this._color;
  }
  set color(color) {
    if (color.isColor) {
      this._color = color;
    } else {
      console.warn('LambertMaterial.js: (.set color) expected color to be of type SATURN.Color.');
    }
  }
  get texture() {
    return this._texture;
  }
  set texture(texture) {
    if (texture === null || texture.isTexture) {
      this._texture = texture;
    } else {
      console.warn('LambertMaterial.js: (.set texture) expected texture to be null or of type SATURN.Texture');
    }
  }
}

export { LambertMaterial };