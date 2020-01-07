export default (
`#version 300 es

layout (location = 0) in vec4 a_position;
layout (location = 1) in vec2 a_uv;

layout (std140) uniform Matrices {
  mat4 u_projection;
  mat4 u_view;
};

uniform mat4 u_model;

out vec2 v_uv;

void main() {
  
  v_uv = a_uv;
  
  mat4 modelViewProjection = u_projection * u_view * u_model;
  gl_Position = modelViewProjection * a_position;
  
}`
);