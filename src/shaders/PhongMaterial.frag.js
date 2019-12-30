export default (
`#version 300 es

precision mediump float;

#define NUM_DIR_LIGHTS 0
#define NUM_POINT_LIGHTS 0
#define NUM_SPOT_LIGHTS 0


// directional light
struct DirectionalLight {
  vec3 direction;
  vec3 color;
  float intensity;
};

// point light
struct PointLight {
  vec3 position;
  vec3 color;
  float intensity;
};

// spot light
struct SpotLight {
  vec3 direction;
  vec3 position;
  float innerLimit;
  float outerLimit;
  float intensity;
  vec3 color;
};

// varyings
in vec2 v_uv;
in vec3 v_normal;
in vec3 v_surfacePosition;
in vec3 v_surfaceToView;

// uniforms
uniform sampler2D u_texture;
uniform float u_shininess;
uniform vec3 u_specularColor;
uniform DirectionalLight directionalLights[NUM_DIR_LIGHTS + 1];
uniform PointLight pointLights[NUM_POINT_LIGHTS + 1];
uniform SpotLight spotLights[NUM_SPOT_LIGHTS + 1];

out vec4 color;

void main() {
  
  // main output
  color = texture(u_texture, v_uv);
  
  // declare variables
  vec3 normal = normalize(v_normal);
  vec3 surfaceToViewDir = normalize(v_surfaceToView);
  vec3 totalLight = vec3(0, 0, 0);
  vec3 diffuse = vec3(0, 0, 0);
  vec3 surfaceToLightDir = vec3(0, 0, 0);
  vec3 halfVector = vec3(0, 0, 0);
  float totalSpecular = 0.0;
  
  
  for (int i = 1; i < NUM_DIR_LIGHTS+1; i++) {
    
    // initialize
    DirectionalLight light = directionalLights[i];
    
    // surface to light unit vector
    surfaceToLightDir = normalize(-light.direction);
    
    // diffuse color
    diffuse = clamp(
      dot(-light.direction, normal) * light.color * light.intensity,
      vec3(0, 0, 0), vec3(1, 1, 1) // min/max light levels
    );
    
    // specular
    halfVector = normalize(surfaceToLightDir + surfaceToViewDir);
    if (diffuse != vec3(0, 0, 0)) {
      totalSpecular += clamp(
        pow(dot(normal, halfVector), u_shininess),
        0.0, 1.0
      );
    }
    
    // add to total light
    totalLight += diffuse;
    
  }
  
  for (int i = 1; i < NUM_POINT_LIGHTS+1; i++) {
    
    // initialize
    PointLight light = pointLights[i];
    
    // surface to light unit vector
    surfaceToLightDir = normalize(light.position - v_surfacePosition);
    
    // diffuse color
    diffuse = clamp(
      dot(surfaceToLightDir, normal) * light.color * light.intensity,
      vec3(0, 0, 0), vec3(1, 1, 1) // min/max light levels
    );
    
    // specular
    halfVector = normalize(surfaceToLightDir + surfaceToViewDir);
    if (diffuse != vec3(0, 0, 0)) {
      totalSpecular +=  pow(dot(normal, halfVector), u_shininess);
    }
    
    // add to total light
    totalLight += diffuse;
    
  }
  
  for (int i = 1; i < NUM_SPOT_LIGHTS+1; i++) {
    
    // initialize
    SpotLight light = spotLights[i];
    
    // surface to light unit vector
    surfaceToLightDir = normalize(light.position - v_surfacePosition);
    
    float dotFromDirection = dot(surfaceToLightDir, -light.direction);
    float inLight = smoothstep(
      cos(light.outerLimit),
      cos(light.innerLimit),
      dotFromDirection
    );
    
    // diffuse color
    diffuse = inLight * clamp(
      dot(surfaceToLightDir, normal) * light.color * light.intensity,
      vec3(0, 0, 0), vec3(1, 1, 1) // min/max light levels
    );
    
    // specular
    halfVector = normalize(surfaceToLightDir + surfaceToViewDir);
    if (diffuse != vec3(0, 0, 0)) {
      totalSpecular += inLight * clamp(
        pow(dot(normal, halfVector), u_shininess),
        0.0, 1.0
      );
    }
    
    // add to total light
    totalLight += diffuse;
    
  }
  
  // apply lights to main output
  color.rgb *= totalLight;
  color.rgb += totalSpecular * u_specularColor;
  
}`
);