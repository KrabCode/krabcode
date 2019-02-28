
/*{ "audio": true }*/

precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform sampler2D backbuffer;
uniform sampler2D samples;
uniform sampler2D spectrum;
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

void main() {
    float t = time;
    vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
    float a = atan(uv.x,uv.y);
    vec3 color = vec3(.0);

    uv.x += .5;
    if (uv.x < .5){
    	uv.x = -uv.x+.5;
    }else{
     	uv.x = uv.x-.5;
    }
    float sp = texture2D(spectrum, vec2(uv.x*0.25, .0)).r;
    sp *= sp/(.25+10.*length(uv.y));

    color += rgb(vec3(
        .62+.1*sp,
        1.-sp*.3,
        smoothstep(.0, 1., sp)
    ));

    gl_FragColor = vec4(color,1.);
}
