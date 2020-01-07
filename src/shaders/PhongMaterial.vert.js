export default (
`#version 300 es

layout (location = 0) in vec4 a_position;
layout (location = 1) in vec2 a_uv;
layout (location = 2) in vec3 a_normal;

layout (std140) uniform Matrices {
  mat4 u_projection;
  mat4 u_view;
};

uniform mat4 u_model;

out vec2 v_uv;
out vec3 v_normal;
out vec3 v_fragPosition;
out vec3 v_fragToView;

void main() {
  
  v_uv = a_uv;
  
  mat3 normalMatrix = mat3(
    inverse(transpose(u_model))
  );
  v_normal = normalMatrix * a_normal;
  v_fragPosition = (u_model * a_position).xyz;
  vec3 viewPosition = inverse(u_view)[3].xyz;
  v_fragToView = viewPosition - v_fragPosition;
  
  mat4 modelViewProjection = u_projection * u_view * u_model;
  gl_Position = modelViewProjection * a_position;
  
}`
);