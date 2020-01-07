export default (
`#version 300 es
precision mediump float;

#define MAX_LIGHTS 32

// DEFINES
#define ZERO vec3(0, 0, 0)
#define ONE vec3(1, 1, 1)

// DIRECTIONAL LIGHT
struct DirectionalLight // 32 bytes
{
  vec4 colorIntensity; // 16
  vec3 direction; // 16
};

// POINT LIGHT
struct PointLight // 32 bytes
{
  vec4 colorIntensity; // 16
  vec3 position; // 16
};

// SPOT LIGHT
struct SpotLight // 52 bytes, padded to 64 bytes
{
  vec4 colorIntensity; // 16
  vec3 direction; // 16
  vec3 position; // 12, last 4 are used by limit
  float limit; // 4
};

// VARYINGS/INPUTS
in vec2 v_uv;
in vec3 v_normal;
in vec3 v_fragPosition;

// UNIFORMS
uniform sampler2D u_texture;
uniform vec3 u_ambientColor;
uniform float u_ambientIntensity;
uniform float u_shininess;
uniform vec3 u_specularColor;

layout (std140) uniform Lights {
  DirectionalLight u_dirLights[MAX_LIGHTS];
  PointLight u_pointLights[MAX_LIGHTS];
  SpotLight u_spotlights[MAX_LIGHTS];
  int u_numDirLights;
  int u_numPointLights;
  int u_numSpotlights;
};

// FUNCTION DECLARATIONS
// vec3 => (r, g, b)
void calcDirLight(in DirectionalLight light, in vec3 normal, inout vec3 lightData);
void calcPointLight(in PointLight light, in vec3 normal, inout vec3 lightData);
void calcSpotLight(in SpotLight light, in vec3 normal, inout vec3 lightData);

// SHADER OUTPUT
out vec4 fragmentColor;

// MAIN FUNCTION
void main()
{
  
  // INITIALIZE SHADER OUTPUT
  fragmentColor = texture(u_texture, v_uv);
  
  // LIGHTING VARS
  // lightData.xyz = light
  vec3 totalLightData = vec3(0, 0, 0);
  vec3 normal = normalize(v_normal);
  
  for (int i = 0; i < u_numDirLights; i++)
    calcDirLight(u_dirLights[ i ], normal, totalLightData);
    
  for (int i = 0; i < u_numPointLights; i++)
    calcPointLight(u_pointLights[ i ], normal, totalLightData);
  
  for (int i = 0; i < u_numSpotlights; i++)
    calcSpotLight(u_spotlights[ i ], normal, totalLightData);
  
  // APPLY AMBIENT TO LIGHT
  totalLightData.xyz += clamp(
    u_ambientColor * u_ambientIntensity,
    vec3(0, 0, 0), vec3(1, 1, 1)
  );
  
  // APPLY LIGHTS TO SHADER OUTPUT
  fragmentColor.rgb *= totalLightData.xyz;
  
}

// FUNCTION DEFINITIONS

// DIRECTIONAL LIGHT CALCULATIONS
void calcDirLight(in DirectionalLight light, in vec3 normal, inout vec3 lightData)
{
  // DIFFUSE
  vec3 diffuse = clamp(
    dot(-light.direction, normal) * light.colorIntensity.rgb * light.colorIntensity.w, ZERO, ONE
  );
  lightData.rgb += diffuse;
}

// POINT LIGHT CALCULATIONS
void calcPointLight(in PointLight light, in vec3 normal, inout vec3 lightData)
{
  vec3 fragToLightDir = normalize(light.position - v_fragPosition);
  
  // DIFFUSE
  vec3 diffuse = clamp(
    dot(fragToLightDir, normal) * light.colorIntensity.rgb * light.colorIntensity.w, ZERO, ONE
  );
  lightData.rgb += diffuse;
}

// SPOT LIGHT CALCULATIONS
void calcSpotLight(in SpotLight light, in vec3 normal, inout vec3 lightData)
{
  vec3 fragToLightDir = normalize(light.position - v_fragPosition);
  
  // lightCoefficient: 1 if inside inner-limit, 0-1 if between limits, 1 if outside outer-limit
  float cosAngle = dot(fragToLightDir, -light.direction);
  float lightCoefficient = smoothstep(
    cos(light.limit + 0.05), // outer limit
    cos(light.limit), // inner limit
    cosAngle
  );
  
  // DIFFUSE
  vec3 diffuse = lightCoefficient * clamp(
    dot(fragToLightDir, normal) * light.colorIntensity.rgb * light.colorIntensity.w, ZERO, ONE
  );
  lightData.rgb += diffuse;
}`
);