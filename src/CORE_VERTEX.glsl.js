/**
 * shader contains 'tags' that can be targeted
 * with regular expressions to provide
 * additional features to materials
 */
export default (
`#version 300 es

// will be replace pre-compilation with #define's
//TAG_DEFINE_HEADER

// attributes (unused ones will be discarded)
layout (location = 0) in vec4 a_position;
layout (location = 1) in vec2 a_uv;

// uniforms (unused ones will be discarded)
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

// varyings (unused ones will be discarded)
out vec2 v_uv;

void main() {
  
  v_uv = a_uv;
  
  mat4 modelViewProjection = u_projection * u_view * u_model;
  gl_Position = modelViewProjection * a_position;
  
  //TAG_END_OF_SHADER
  
}`
);