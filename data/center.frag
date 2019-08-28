precision highp float;
uniform float time;
uniform vec2 resolution;

#define pi 3.14159265359

float cubicPulse( float c, float w, float x ){
   x = abs(x - c);
   if( x>w ) return 0.0;
   x /= w;
   return 1.0 - x*x*(3.0-2.0*x);
}

vec3 rgb( in vec3 c ){
 vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0 );
 rgb = rgb*rgb*(3.0-2.0*rgb);  return c.z * mix(vec3(1.0), rgb, c.y);
}

mat2 rotate2d(float angle){
  return mat2(cos(angle),-sin(angle), sin(angle),cos(angle));
}

void main(){
  vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
  vec3 hsb = vec3(0.);
  float scl = 50.;
  vec2 gv = fract(uv*scl)-.5;
  vec2 id = floor(uv*scl)+.5;
  hsb.b += abs(sin(id.x*id.y+time))*.5;
  gl_FragColor = vec4(rgb(hsb),1.);
}
