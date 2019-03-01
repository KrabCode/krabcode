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

float random (in vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

vec3 random3(vec3 c) {
    float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
    vec3 r;
    r.z = fract(512.0*j);
    j *= .125;
    r.x = fract(512.0*j);
    j *= .125;
    r.y = fract(512.0*j);
    return r-0.5;
}

const float F3 =  0.3333333;
const float G3 =  0.1666667;
float snoise(float x0, float y0, float z0) {
    vec3 p = vec3(x0,y0,z0);
    vec3 s = floor(p + dot(p, vec3(F3)));
    vec3 x = p - s + dot(s, vec3(G3));
    vec3 e = step(vec3(0.0), x - x.yzx);
    vec3 i1 = e*(1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy*(1.0 - e);
    vec3 x1 = x - i1 + G3;
    vec3 x2 = x - i2 + 2.0*G3;
    vec3 x3 = x - 1.0 + 3.0*G3;
    vec4 w, d;
    w.x = dot(x, x);
    w.y = dot(x1, x1);
    w.z = dot(x2, x2);
    w.w = dot(x3, x3);
    w = max(0.6 - w, 0.0);
    d.x = dot(random3(s), x);
    d.y = dot(random3(s + i1), x1);
    d.z = dot(random3(s + i2), x2);
    d.w = dot(random3(s + 1.0), x3);
    w *= w;
    w *= w;
    d *= w;
    return dot(d, vec4(52.0));
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

#define OCTAVES 12
float fbm (float x, float y, float z) {
	vec3 st = vec3(x,y,z);
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    for (int i = 0; i < OCTAVES; i++) {
		float n = abs(snoise(st.x, st.y, st.z));
        value += amplitude * n;
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

float xor(float a, float b){
  return a*(1.-b)+b*(1.-a);
}

void main() {
  float t = time*.03;
  vec2 uv = (gl_FragCoord.xy-.5*resolution.xy) / resolution.y;
  uv *= rotate2d(pi/4.);
  float scl = 10.3;
  const float range = 5.;
  float pct = 0.;
  for(float x = -range;x < range;x++){
      for(float y = -range;y < range;y++){
        vec2 offset = vec2(x,y);
        vec2 gv = fract(uv*scl);
        vec2 id = floor(uv*scl);
        float d = 1.-length(gv+offset)*50.2;
        float amt = 1.*(cos(60.*sin(t*.001)*d+t));
        pct = xor(pct,smoothstep(.996, 1.,amt)/pow(range,2.));
    }
  }

  vec3 color = rgb(vec3(
    .7+clamp(pct*.1, 0., 1.),
    clamp(1.-pct*3., 0., 1.),
    clamp(pct*5., 0., 1.)
    ));

  gl_FragColor = vec4(color,1.);
}
