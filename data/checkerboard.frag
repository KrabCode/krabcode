/*{ "audio": true,
    "pixelRatio": 1
}*/
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform sampler2D backbuffer;
uniform sampler2D samples;
uniform sampler2D spectrum;
uniform float volume;


#define pi 3.1415926535897932384626433

float cubicPulse( float c, float w, float x ){
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}

vec3 rgb( in vec3 hsb){
    vec3 rgb = clamp(abs(mod(hsb.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,0.0,1.0);
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return hsb.z * mix(vec3(1.0), rgb, hsb.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float xor(float a, float b){
  return a*(1.-b)+b*(1.-a);
}

void main() {
  float t = 500.+time*.03;
  vec2 uv = (gl_FragCoord.xy-.5*resolution.xy) / resolution.y;
  uv *= rotate2d(pi/4.);
  float scl = .3;
  const float range = 5.;
  float pct = 0.;
  for(float x = -range;x < range;x++){
      for(float y = -range;y < range;y++){
        vec2 offset = vec2(x,y);
        vec2 gv = fract(uv*scl);
        vec2 id = floor(uv*scl);
        float d = 1.-length(gv+offset)*10.2;
        float amt = 1.*(cos(10.*sin(t*.001)*d+t));
        pct = xor(pct,smoothstep(.97, 1.,amt)/pow(range,2.));
    }
  }

  vec3 color = rgb(vec3(
    .7+clamp(pct*.1, 0., 1.),
    clamp(1.-pct*3., 0., 1.),
    clamp(pct*5., 0., 1.)
    ));

  gl_FragColor = vec4(color,1.);
}
