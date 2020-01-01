export default (
`#version 300 es
precision mediump float;

// LIGHT DATA
#define NUM_DIR_LIGHTS 0
#define NUM_POINT_LIGHTS 0
#define NUM_SPOT_LIGHTS 0

// DEFINES
#define ZERO vec3(0, 0, 0)
#define ONE vec3(1, 1, 1)

// DIRECTIONAL LIGHT
struct DirectionalLight
{
  vec3 direction;
  vec3 color;
  float intensity;
};

// POINT LIGHT
struct PointLight
{
  vec3 position;
  vec3 color;
  float intensity;
};

// SPOT LIGHT
struct SpotLight
{
  vec3 direction;
  vec3 position;
  vec3 color;
  float intensity;
  float innerLimit;
  float outerLimit;
};

// VARYINGS/INPUTS
in vec2 v_uv;
in vec3 v_normal;
in vec3 v_fragPosition;

// UNIFORMS
uniform sampler2D u_texture;
uniform vec3 u_ambientColor;
uniform float u_ambientIntensity;
uniform DirectionalLight dirLights[NUM_DIR_LIGHTS + 1];
uniform PointLight pointLights[NUM_POINT_LIGHTS + 1];
uniform SpotLight spotLights[NUM_SPOT_LIGHTS + 1];

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
  
  for (int i = 1; i < NUM_DIR_LIGHTS + 1; i++)
    calcDirLight(dirLights[ i ], normal, totalLightData);
    
  for (int i = 1; i < NUM_POINT_LIGHTS + 1; i++)
    calcPointLight(pointLights[ i ], normal, totalLightData);
  
  for (int i = 1; i < NUM_SPOT_LIGHTS + 1; i++)
    calcSpotLight(spotLights[ i ], normal, totalLightData);
  
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
    dot(-light.direction, normal) * light.color * light.intensity, ZERO, ONE
  );
  lightData.rgb += diffuse;
}

// POINT LIGHT CALCULATIONS
void calcPointLight(in PointLight light, in vec3 normal, inout vec3 lightData)
{
  vec3 fragToLightDir = normalize(light.position - v_fragPosition);
  
  // DIFFUSE
  vec3 diffuse = clamp(
    dot(fragToLightDir, normal) * light.color * light.intensity, ZERO, ONE
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
    cos(light.outerLimit), // outer limit
    cos(light.innerLimit), // inner limit
    cosAngle
  );
  
  // DIFFUSE
  vec3 diffuse = lightCoefficient * clamp(
    dot(fragToLightDir, normal) * light.color * light.intensity, ZERO, ONE
  );
  lightData.rgb += diffuse;
}`
);