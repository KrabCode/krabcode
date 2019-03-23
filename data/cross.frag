
/*{ "audio": true }*/

precision highp float;

uniform vec2 resolution;
uniform float time;

vec3 rgb( in vec3 hsb){
    vec3 rgb = clamp(abs(mod(hsb.x*6.0+
      vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return hsb.z * mix(vec3(1.0), rgb, hsb.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
}

void main(void) {
   float t = time*.35;
   vec2 uv = (gl_FragCoord.xy-.5*resolution.xy) / resolution.y;
   float d = 1.-length(uv);
   float a = atan(uv.y,uv.x);
   uv *= sin(a*2.);
   float ad = 1.-smoothstep(0., 0.5, length(uv));
   uv = fract(uv*8.)-.5;
   float gd = 1.-length(uv);
   vec3 rgb = rgb(vec3(1.*ad-gd*1.+t,clamp(1.-ad+gd,.0,1.),clamp(ad*2.-gd*1.25, 0., 1.)));
   gl_FragColor = vec4(rgb,1.);
}
