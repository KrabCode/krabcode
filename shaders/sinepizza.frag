// Author: Krab (krabcode.github.com)
// Title: Sine Pizza

#ifdef GL_ES
precision mediump float;
#endif
#ifdef GL_FRAGMENT_PRECISION_HIGH

precision highp float;
#else
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359

float map(float x, float a1, float a2, float b1, float b2){
  return b1 + (b2-b1) * (x-a1) / (a2-a1);
}

vec3 rgb( in vec3 hsb ){
 vec3 rgb = clamp(abs(mod(hsb.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0 );
 rgb = rgb*rgb*(3.0-2.0*rgb);  return hsb.z * mix(vec3(1.0), rgb, hsb.y);
}

void main(void) {
 float t = u_time;
 vec2 uv = gl_FragCoord.xy / u_resolution.xy;
 float d = distance(uv, vec2(.5,.5));
 float a = atan(.5-uv.y, .5-uv.x);
 float amplitude = 0.05;
 float frequency = 80.;
 d += amplitude*sin(uv.x*frequency+t*5.);
 d = fract(d*12.);
 float pct = abs(0.5-d);
 vec3 color = vec3(smoothstep(.0,2., pct), 1. ,pct*2.5);
 gl_FragColor = vec4(rgb(color),1.);
}
