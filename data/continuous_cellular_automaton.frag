  /*{
      "pixelRatio": 2
  }*/

precision highp float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const float pi = 3.14159265359;

vec3 rgb( in vec3 hsb){
    vec3 rgb = clamp(abs(mod(hsb.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,0.0,1.0);
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return hsb.z * mix(vec3(1.0), rgb, hsb.y);
}

float cubicPulse( float c, float w, float x ){
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}

float get(vec2 uv, vec2 offset){
  return (texture2D(backbuffer, uv+offset).x + texture2D(backbuffer, uv+offset).y + texture2D(backbuffer, uv+offset).z ) / 3.;
}

void main(){
  float t = (.5+.5*sin(time*.15));
  vec2 cc = (gl_FragCoord.xy-.5*resolution.xy) / resolution.y;

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float pixelSizeX = 1. / resolution.x;
  float pixelSizeY = 1. / resolution.y;

  float grayscale = 0.;
  float d = length(cc);

  float neighbourSum =
          get(uv, vec2(pixelSizeX,  0.)) +
          get(uv, vec2(pixelSizeX,  pixelSizeY)) +
          get(uv, vec2(0.,          pixelSizeY)) +
          get(uv, vec2(-pixelSizeX, pixelSizeY)) +
          get(uv, vec2(-pixelSizeX, 0.)) +
          get(uv, vec2(-pixelSizeX, -pixelSizeY)) +
          get(uv, vec2(0.,          -pixelSizeY)) +
          get(uv, vec2(pixelSizeX,  -pixelSizeY));

  float me = get(uv, vec2(0.));

  neighbourSum = fract(neighbourSum/8.-me*(.5+.3*t));
  grayscale += neighbourSum*t;
  vec3 hsb = vec3(0.);
  hsb += rgb(vec3(grayscale*2.,grayscale, grayscale));

  // cc = fract(cc*6.);
  hsb.b += cubicPulse(.0, .005, d);

  gl_FragColor = vec4(hsb,1.);
}
