/*{ "audio": true,
    "pixelRatio": 3
}*/

precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec3 pointers[10];

#define pi 3.14159265359
#define S(a, b, t) smoothstep(a, b, t)

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

float distLine(vec2 p, vec2 a , vec2 b){
  vec2 pa = p-a;
  vec2 ba = b-a;
  float t = clamp(dot(pa,ba)/dot(ba,ba), .0, 1.);
  return length(pa-ba*t);
}

float line(vec2 p, vec2 a, vec2 b){
  float d = distLine(p,a,b);
  float m = smoothstep(.008, .0, d);
  float dd = length(a-b);
  return m;
}

float N21(vec2 p){
  p = fract(p*vec2(230.44,80.73));
  p += dot(p,p+19.5);
  return fract(p.x*p.y);
}

vec2 N22(vec2 p){
  float n = N21(p);
  return vec2(n, N21(p+n));
}

vec2 getPos(vec2 id, vec2 offset){
  vec2 n = N22(id+offset)*(800.+time*.5);
  return offset+sin(n)*.45;
}

float drawGrid(vec2 uv){
  vec2 gv = fract(uv)-.5;
  vec2 id = floor(uv);
  vec2 pos  = getPos(id,vec2(0.));
  float resultColor = 0.;

  //draw line from center to all direct  neighbours
  for(float x = -1.; x <= 1.; x++){
    for(float y = -1.; y <= 1.; y++){
      vec2 offpos = getPos(id,vec2(x,y));
      resultColor += line(gv, pos, offpos);
    }
  }

  //draw  lines crossing the center but not originating in it
  resultColor += line(gv,getPos(id, vec2(-1., 0.)), getPos(id, vec2(0., -1.)));
  resultColor += line(gv,getPos(id, vec2(-1., 0.)), getPos(id, vec2(0.,  1.)));
  resultColor += line(gv,getPos(id, vec2( 1., 0.)), getPos(id, vec2(0., -1.)));
  resultColor += line(gv,getPos(id, vec2( 1., 0.)), getPos(id, vec2(0.,  1.)));
  return resultColor;
}

void main(){
  vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
  float t = time*.000025;
  vec2 m = pointers[0].xy/resolution.xy;
  uv *= rotate2d(-pi*.5);
  vec3 hsb = vec3(0.,0.,0.);
  const float count = 100.;
  for(float i = 0.; i < count; i++){
  	float iN = i;
  	float ang = iN*pi*2.*sin(t);
    float jN = (i+1.)/count;
  	float jng = jN*pi*2.*cos(-t);
  	float freq = pi*12.;
  	float amp = .25;
  	float off = 1.;
  	vec2 a = vec2(off*amp*cos(ang*freq),off*amp*sin(ang*freq));
  	vec2 b = vec2(amp*cos(jng*freq),amp*sin(jng*freq));
  	hsb.b += .3*line(uv,a,b);
  }
  hsb.b = clamp(hsb.b, 0., 1.);
  gl_FragColor = vec4(rgb(hsb),1.);
}
