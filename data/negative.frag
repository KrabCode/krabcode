
precision highp float;

uniform vec2 resolution;
uniform float time;

float cubicPulse( float c, float w, float x ){
	 x = abs(x - c);
	 if( x>w ) return 0.0;
	 x /= w;
	 return 1.0 - x*x*(3.0-2.0*x);
}


mat2 rotate2d(float angle){
	return mat2(cos(angle),-sin(angle), sin(angle),cos(angle));
}

void main(){
  vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
  float t = sin(time);

  float pct = 0.;
  vec2 gv = fract(uv*5.);
  vec2 sv = fract(gv*4.)-.5;
  float d = distance(sv, fract(gv*1.));

  pct = d;

  gl_FragColor = vec4(vec3(pct),1.);
}
