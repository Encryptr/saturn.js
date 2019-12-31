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
in vec3 v_fragPosition;
in vec3 v_fragToView;

// uniforms
uniform sampler2D u_texture;
uniform vec3 u_ambientColor;
uniform float u_ambientIntensity;
uniform float u_shininess;
uniform vec3 u_specularColor;
uniform DirectionalLight directionalLights[NUM_DIR_LIGHTS + 1];
uniform PointLight pointLights[NUM_POINT_LIGHTS + 1];
uniform SpotLight spotLights[NUM_SPOT_LIGHTS + 1];

out vec4 color;

void main() {
  
  // main output
  color = texture(u_texture, v_uv);
  
  // declare variables beforehand
  vec3 totalLight = vec3(0, 0, 0);
  vec3 diffuse = vec3(0, 0, 0);
  vec3 fragToLightNorm = vec3(0, 0, 0);
  vec3 phongHalfVector = vec3(0, 0, 0);
  float totalSpecular = 0.0;
  
  // normalize vars
  vec3 fragToViewNorm = normalize(v_fragToView);
  vec3 normal = normalize(v_normal);
  
  totalLight += clamp(
    u_ambientColor * u_ambientIntensity,
    vec3(0, 0, 0), vec3(1, 1, 1)
  );
  
  for (int i = 1; i < NUM_DIR_LIGHTS+1; i++) {
    
    // initialize
    DirectionalLight light = directionalLights[i];
    
    // surface to light unit vector
    fragToLightNorm = normalize(-light.direction);
    
    // diffuse color
    diffuse = clamp(
      dot(fragToLightNorm, normal) * light.color * light.intensity,
      vec3(0, 0, 0), vec3(1, 1, 1) // min/max light levels
    );
    
    // specular component
    phongHalfVector = normalize(fragToLightNorm + fragToViewNorm);
    if (diffuse != vec3(0, 0, 0))
      totalSpecular +=  pow(max(dot(normal, phongHalfVector), 0.0), u_shininess);
    
    // add to total light
    totalLight += diffuse;
    
  }
  
  for (int i = 1; i < NUM_POINT_LIGHTS+1; i++) {
    
    // initialize
    PointLight light = pointLights[i];
    
    // surface to light unit vector
    fragToLightNorm = normalize(light.position - v_fragPosition);
    
    // diffuse color
    diffuse = clamp(
      dot(fragToLightNorm, normal) * light.color * light.intensity,
      vec3(0, 0, 0), vec3(1, 1, 1) // min/max light levels
    );
    
    // specular component
    phongHalfVector = normalize(fragToLightNorm + fragToViewNorm);
    if (diffuse != vec3(0, 0, 0))
      totalSpecular +=  pow(max(dot(normal, phongHalfVector), 0.0), u_shininess);
    
    // add to total light
    totalLight += diffuse;
    
  }
  
  for (int i = 1; i < NUM_SPOT_LIGHTS+1; i++) {
    
    // initialize
    SpotLight light = spotLights[i];
    
    // surface to light unit vector
    fragToLightNorm = normalize(light.position - v_fragPosition);
    
    float dotFromDirection = dot(fragToLightNorm, -light.direction);
    float inLight = smoothstep(
      cos(light.outerLimit),
      cos(light.innerLimit),
      dotFromDirection
    );
    
    // diffuse color
    diffuse = inLight * clamp(
      dot(fragToLightNorm, normal) * light.color * light.intensity,
      vec3(0, 0, 0), vec3(1, 1, 1) // min/max light levels
    );
    
    // specular component
    phongHalfVector = normalize(fragToLightNorm + fragToViewNorm);
    if (diffuse != vec3(0, 0, 0))
      totalSpecular +=  inLight * pow(max(dot(normal, phongHalfVector), 0.0), u_shininess);
    
    // add to total light
    totalLight += diffuse;
    
  }
  
  // apply lights to main output
  color.rgb *= totalLight;
  color.rgb += totalSpecular * u_specularColor;
  
}`
);