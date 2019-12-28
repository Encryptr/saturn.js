/**
 * shader contains 'tags' that can be targeted
 * with regular expressions to provide
 * additional features to materials
 */
export default (
`#version 300 es

// will be replaced pre-compilation with #define's
//TAG_DEFINE_HEADER

precision mediump float;

// varyings (unused ones will be discarded)
in vec2 v_uv;

// uniforms (unused ones will be discarded)
uniform sampler2D u_texture;

// final output color
out vec4 finalColor;

void main() {
  
  vec4 color = texture(u_texture, v_uv);
  
  finalColor = color;
  
  //TAG_END_OF_SHADER
  
}`
);