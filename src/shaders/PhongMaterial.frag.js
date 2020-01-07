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
in vec3 v_fragToView;

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
// vec4 => (r, g, b, specular)
void calcDirLight(in DirectionalLight light, in vec3 normal, in vec3 fragToViewDir, inout vec4 lightData);
void calcPointLight(in PointLight light, in vec3 normal, in vec3 fragToViewDir, inout vec4 lightData);
void calcSpotLight(in SpotLight light, in vec3 normal, in vec3 fragToViewDir, inout vec4 lightData);

// SHADER OUTPUT
out vec4 fragmentColor;

// MAIN FUNCTION
void main()
{
  
  // INITIALIZE SHADER OUTPUT
  fragmentColor = texture(u_texture, v_uv);
  
  // LIGHTING VARS
  // lightData.xyz = light, lightData.w = specular
  vec4 totalLightData = vec4(0, 0, 0, 0);
  vec3 normal = normalize(v_normal);
  vec3 fragToViewDir = normalize(v_fragToView);
  
  for (int i = 0; i < u_numDirLights; i++)
    calcDirLight(u_dirLights[ i ], normal, fragToViewDir, totalLightData);
    
  for (int i = 0; i < u_numPointLights; i++)
    calcPointLight(u_pointLights[ i ], normal, fragToViewDir, totalLightData);
  
  for (int i = 0; i < u_numSpotlights; i++)
    calcSpotLight(u_spotlights[ i ], normal, fragToViewDir, totalLightData);
  
  // APPLY AMBIENT TO LIGHT
  totalLightData.xyz += clamp(
    u_ambientColor * u_ambientIntensity,
    vec3(0, 0, 0), vec3(1, 1, 1)
  );
  
  // APPLY LIGHTS TO SHADER OUTPUT
  fragmentColor.rgb *= totalLightData.xyz;
  fragmentColor.rgb += totalLightData.w * u_specularColor;
  
}

// FUNCTION DEFINITIONS

// DIRECTIONAL LIGHT CALCULATIONS
void calcDirLight(in DirectionalLight light, in vec3 normal, in vec3 fragToViewDir, inout vec4 lightData)
{
  // DIFFUSE
  vec3 diffuse = clamp(
    dot(-light.direction, normal) * light.colorIntensity.rgb * light.colorIntensity.w, ZERO, ONE
  );
  lightData.rgb += diffuse;
  
  // SPECULAR
  vec3 halfVectorDir = normalize(-light.direction + fragToViewDir);
  if (diffuse != ZERO)
    lightData.w += pow(max(dot(halfVectorDir, normal), 0.0), u_shininess);
}

// POINT LIGHT CALCULATIONS
void calcPointLight(in PointLight light, in vec3 normal, in vec3 fragToViewDir, inout vec4 lightData)
{
  vec3 fragToLightDir = normalize(light.position - v_fragPosition);
  
  // DIFFUSE
  vec3 diffuse = clamp(
    dot(fragToLightDir, normal) * light.colorIntensity.rgb * light.colorIntensity.w, ZERO, ONE
  );
  lightData.rgb += diffuse;
  
  // SPECULAR
  vec3 halfVectorDir = normalize(fragToLightDir + fragToViewDir);
  if (diffuse != ZERO)
    lightData.w += pow(max(dot(halfVectorDir, normal), 0.0), u_shininess);
}

// SPOT LIGHT CALCULATIONS
void calcSpotLight(in SpotLight light, in vec3 normal, in vec3 fragToViewDir, inout vec4 lightData)
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
  
  // SPECULAR
  vec3 halfVectorDir = normalize(fragToLightDir + fragToViewDir);
  if (diffuse != ZERO)
    lightData.w += lightCoefficient * pow(max(dot(halfVectorDir, normal), 0.0), u_shininess);
}`
);