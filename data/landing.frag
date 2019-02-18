#ifdef GL_ES
precision mediump float;
#endif
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision highp float;
#endif

#define pi 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;


void main(void) {
 float t = u_time;
 vec2 uv = gl_FragCoord.xy / u_resolution.xy;
 vec3 color = vec3(.1);
 gl_FragColor = vec4(color,1.);
}
