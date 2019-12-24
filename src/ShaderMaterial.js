const defaultVertex = `#version 300 es
layout (location = 0) in vec4 position;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
void main() {
  mat4 modelViewProjection = u_projection * u_view * u_model;
  gl_Position = modelViewProjection * position;
}`;
const defaultFragment = `#version 300 es
precision mediump float;
out vec4 color;
void main() {
  color = vec4(1, 0, 0, 1);
}`;

const ShaderMaterial = (function() {
  let materialId = 0;
  return class ShaderMaterial {
    constructor(vertex = defaultVertex, fragment = defaultFragment) {
      this._id = materialId++;
      this._vertex  = vertex;
      this._fragment = fragment;
    }
    get id() {
      return this._id;
    }
    get vertex() {
      return this._vertex;
    }
    set vertex(text) {
      this._vertex = text;
    }
    get fragment() {
      return this._fragment;
    }
    set fragment(text) {
      this._fragment = text;
    }
  }
}());
export { ShaderMaterial };