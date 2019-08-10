
/*{ "audio": true }*/

precision highp float;

uniform vec2 resolution;
uniform float time;
uniform sampler2D samples;
uniform sampler2D spectrum;
uniform sampler2D backbuffer;
uniform float volume;

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

float pulse(float c, float w, float x){
  return smoothstep(c-w, c, x) - smoothstep(c, c+w, x);
}

void main() {
    float t = time;
    vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
    vec3 color = vec3(.00);
    float smp = texture2D(samples, abs(uv)).x;
    uv.y += .1*smp-.05;

    // uv.y = fract(uv.y*2.)-.5;
    color += pulse(.0, .005, uv.y);

    color += texture2D(backbuffer, gl_FragCoord.xy/resolution.xy).xyz*.5;
    gl_FragColor = vec4(color,1.);
}
