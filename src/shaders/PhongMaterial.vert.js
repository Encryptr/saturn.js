export default (
`#version 300 es

layout (location = 0) in vec4 a_position;
layout (location = 1) in vec2 a_uv;
layout (location = 2) in vec3 a_normal;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

out vec2 v_uv;
out vec3 v_normal;
out vec3 v_surfacePosition;
out vec3 v_surfaceToView;

void main() {
  
  v_uv = a_uv;
  mat3 normalMatrix = mat3(
    inverse(transpose(u_model))
  );
  v_normal = normalMatrix * a_normal;
  v_surfacePosition = (u_model * a_position).xyz;
  
  // camera is always positioned at (0, 0, 0), so just multiply position by model and view
  v_surfaceToView = -(u_view * u_model * a_position).xyz;
  
  mat4 modelViewProjection = u_projection * u_view * u_model;
  gl_Position = modelViewProjection * a_position;
  
}`
);