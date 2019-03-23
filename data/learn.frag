precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform sampler2D backbuffer;
uniform sampler2D samples;
uniform sampler2D spectrum;
uniform float volume;

#define pi 3.1415926535897932384626433
#define S(a,b,x) smoothstep(a,b,x)

float plot(float c, float w, float x){
  return S(c-w,c,x) - S(c,c+w,x);
}

void main() {
  vec2 uv = (gl_FragCoord.xy-.5*resolution.xy) / resolution.y;
  vec3 color = vec3(0.);
  color += plot(uv.y, .1, uv.x);
  gl_FragColor = vec4(color,1.);
}
