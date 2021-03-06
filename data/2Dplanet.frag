/*{
    "pixelRatio": 2
}*/

precision highp float;

uniform vec2 resolution;
uniform float time;

#define pi 3.14159265359
#define S(a, b, t) smoothstep(a, b, t)

// functions from the Book of Shaders
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
float snoise(float x0,float y0, float z0) {
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

void main(){
  vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
  float d = length(uv);
  vec2 landId = floor(uv*40.)+1.0;
  vec2 atmoId = floor(uv*70.)+1.0;
  float planet = smoothstep(.35,.3, d);
  float landScl = .04;
  float atmoScl = .01;
  float land = max(.5,clamp(3.*fbm(landScl*landId.x-time*.1, landScl*landId.y, 0.), 0.,1.));
  float atmosphere = clamp(fbm(atmoScl*atmoId.x-time*.2, atmoScl*atmoId.y, 0.), 0.,1.);
  float poles = smoothstep(.0, .1,abs(.5-landId.y)*.004);
  vec3 hsb = vec3(mix(.2, 1.0, 1.-land), 1.-poles*planet-atmosphere-(smoothstep(.3,.35,d)-smoothstep(.35,0.5,d)), planet+poles*planet);
  gl_FragColor = vec4(rgb(hsb),1.);
}
