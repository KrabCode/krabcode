

/*
{
  "IMPORTED": {
    "bricks": {
      "PATH": "mosaic.jpg",
    },
  },
}
*/

precision highp float;
uniform float time;
uniform vec2 resolution;

#define TWOPI 6.28318530718
uniform vec4 offset; // xy = input rotate/translate (normalised), z = output rotation
const float div = 12.;    // number of slices
const vec2 mirror = vec2(1., 3.); // x = enable, y = mirror per x slices
uniform sampler2D bricks;

void main()
{

    vec2 uv = (gl_FragCoord.xy / resolution.xy)-.5;
    vec2 n = uv;

    // polar coords
    n.x = atan(uv.y, uv.x)+offset.z*TWOPI;
    n.y = sqrt(uv.y*uv.y + uv.x*uv.x)+offset.y;

    n.x += TWOPI/4.;    // make it face downwards

    float section = TWOPI/div;

    n.x *= (mirror.x==1.) ? sign(mod(n.x, section*mirror.y)-section) : 1.; // if mirror, mirror, else don't

    n.x = mod(n.x, section)
                -(section)*(1.+.25*(div-2.)) // bottom is always mirrored by default
                +offset.x*TWOPI;

    n = vec2(cos(n.x), sin(n.x)) * n.y + .5;
    vec4 color = texture2D(bricks, n);
    gl_FragColor = color;
}
