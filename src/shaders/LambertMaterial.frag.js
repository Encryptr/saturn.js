export default (
`#version 300 es

precision mediump float;

#define NUM_DIR_LIGHTS 0
#define NUM_POINT_LIGHTS 0
#define NUM_SPOT_LIGHTS 0

struct DirectionalLight {
  vec3 direction;
  vec3 color;
  float intensity;
};

struct PointLight {
  vec3 position;
  vec3 color;
  float intensity;
};

struct SpotLight {
  vec3 direction;
  vec3 position;
  float innerLimit;
  float outerLimit;
  float intensity;
  vec3 color;
};

in vec2 v_uv;
in vec3 v_normal;
in vec3 v_surfacePosition;

uniform sampler2D u_texture;
uniform vec3 u_ambientColor;
uniform float u_ambientIntensity;
uniform DirectionalLight directionalLights[NUM_DIR_LIGHTS + 1];
uniform PointLight pointLights[NUM_POINT_LIGHTS + 1];
uniform SpotLight spotLights[NUM_SPOT_LIGHTS + 1];

out vec4 color;

void main() {
  
  color = texture(u_texture, v_uv);
  
  vec3 normal = normalize(v_normal);
  vec3 totalLight = vec3(0, 0, 0);
  vec3 surfaceToLight = vec3(0, 0, 0);
  
  totalLight += clamp(
    u_ambientColor * u_ambientIntensity,
    vec3(0, 0, 0), vec3(1, 1, 1)
  );
  
  for (int i = 1; i < NUM_DIR_LIGHTS+1; i++) {
    
    DirectionalLight light = directionalLights[i];
    
    vec3 diffuse = clamp(
      dot(-light.direction, normal) * light.color * light.intensity,
      vec3(0, 0, 0), vec3(1, 1, 1) // min/max light levels
    );
    
    totalLight += diffuse;
    
  }
  
  for (int i = 1; i < NUM_POINT_LIGHTS+1; i++) {
    
    PointLight light = pointLights[i];
    
    surfaceToLight = normalize(light.position - v_surfacePosition);
    
    vec3 diffuse = clamp(
      dot(surfaceToLight, normal) * light.color * light.intensity,
      vec3(0, 0, 0), vec3(1, 1, 1) // min/max light levels
    );
    
    totalLight += diffuse;
    
  }
  
  for (int i = 1; i < NUM_SPOT_LIGHTS+1; i++) {
    
    SpotLight light = spotLights[i];
    
    surfaceToLight = normalize(light.position - v_surfacePosition);
    
    float dotFromDirection = dot(surfaceToLight, -light.direction);
    
    float inLight = smoothstep(
      cos(light.outerLimit),
      cos(light.innerLimit),
      dotFromDirection
    );
    
    vec3 diffuse = inLight * clamp(
      dot(surfaceToLight, normal) * light.color * light.intensity,
      vec3(0, 0, 0), vec3(1, 1, 1) // min/max light levels
    );
    
    totalLight += diffuse;
    
  }
  
  color.rgb *= totalLight;
  
}`
);