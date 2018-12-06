#define MAX_LIGHTS 2

precision mediump float;

uniform mat3 materialProperties;
uniform mat3 lightProperties[MAX_LIGHTS];
uniform float shininess;

varying vec3 fL[MAX_LIGHTS];
varying vec3 fN;
varying vec3 fV;

// helper method does lighting calculation for one light
// and returns the resulting color
vec4 getLightContribution(vec3 fL, mat3 lightProp, vec3 N, vec3 V)
{
  vec3 L = normalize(fL);

  // reflected vector
  vec3 R = reflect(-L, N);

  mat3 products = matrixCompMult(lightProp, materialProperties);
  vec4 ambientColor = vec4(products[0], 1.0);
  vec4 diffuseColor = vec4(products[1], 1.0);
  vec4 specularColor = vec4(products[2], 1.0);

  // Lambert's law, clamp negative values to zero
  float diffuseFactor = max(0.0, dot(L, N));

  // specular factor from Phong reflection model
  float specularFactor = pow(max(0.0, dot(V, R)), shininess);

  // add the components together
  vec4 ret = specularColor * specularFactor + diffuseColor * diffuseFactor + ambientColor;

  return ret;
}

void main() 
{
  // normalize after interpolating
  vec3 N = normalize(fN);
  vec3 V = normalize(fV);

  // add in the contribution from each light
  vec4 sum = vec4(0.0, 0.0, 0.0, 0.0);
  for (int i = 0; i < MAX_LIGHTS; ++i)
  {
    sum += getLightContribution(fL[i], lightProperties[i], N, V);
  }

  // usually need to rescale somehow after adding
  gl_FragColor = sum / float(MAX_LIGHTS);
  gl_FragColor.a = 1.0;
}