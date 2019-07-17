/*
{
  "IMPORTED": {
    "image1": {
      "PATH": "Assumption.jpg",
    },
  },
}
*/

precision highp float;

uniform vec2 resolution;
uniform float time;
uniform sampler2D image1;

#define pi 3.14159265359

float hexDist(vec2 p){
  p  = abs(p);
  float c = dot(p, normalize(vec2(1.,1.73)));
  c = max(c, p.x);
  return c;
}

vec4 hexCoords(vec2 uv){
  vec2 gridStep = vec2(1.,1.73);
  vec2 halfStep = gridStep*.5;
  vec2 a = mod(uv,gridStep)-halfStep;
  vec2 b = mod(uv-halfStep, gridStep)-halfStep;
  bool odd = length(a) < length(b);
  vec2 gv = odd ? a:b;
  float row = odd ? 1.:0.;
  float hexDist = hexDist(gv);
  return vec4(gv, gv.x-uv.x, row);
}

void main(){
  float third = 1./3.;
  float sixth = 1./6.;
  float t = time*.1;
  vec3 col = vec3(0.);
  vec2 uv = (gl_FragCoord.xy-.5*resolution.xy) / resolution.y;
  uv *= 3.;
  vec4 hexCoords = hexCoords(uv);
  float hexDist = hexDist(hexCoords.xy)*.5;

  float angle = atan(hexCoords.y, hexCoords.x);
  angle = (pi+angle)/(pi*2.); // normalize from [-pi,pi] to [0,1]
  angle += sixth*hexCoords.w;
  bool mirror = mod(angle, third) > sixth;
  angle = mod(angle, sixth);
  if(mirror){
    angle = (sixth)-angle;
  }
  angle = angle*6.;

  vec2 st = vec2(.5+hexDist*cos(angle), .5+hexDist*sin(angle+t));
  col.rgb = texture2D(image1, st).rgb;
  gl_FragColor = vec4(col,1.);
}
