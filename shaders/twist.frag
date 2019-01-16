// Author: Krab
// Title: Twist

precision highp float;

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


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
 float amplitude = .15+(.5+.5*sin(t));
 float frequency = 25.;
 d += amplitude*sin(a+frequency*d-t);
 d = fract(d);
 float pct = abs(0.5-d);
 vec3 color = vec3(smoothstep(0.,2., pct), 1. ,pct*2.5);
 gl_FragColor = vec4(rgb(color),1.);
}