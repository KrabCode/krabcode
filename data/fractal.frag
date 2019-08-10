/*{
    "pixelRatio": 1
}*/

precision highp float;
uniform float time;
uniform vec2 resolution;

const float n1 = 2.; //Power 1
const float iterations = 50.;

vec2 Scale(vec2 p){
	return (2.*p-resolution.xy)/resolution.y*1.5;
}


float mandelbrot(vec2 c){
    vec2 z = vec2(0.);

    float t = sin(time/8.)*.5+.5;
    float n2 = 8.*cos(t); //Power 2
	for (float i=0.;i<iterations;i++){
		//to (r,a)
		float rad = length(z);
		float phi = atan(z.y,z.x);

		//escaped?
		if (rad>5.) return i;

		//calculation1
		float rad1 = pow(rad,n1);
		float phi1 = phi*n1;

        //calculation2
		float rad2 = pow(rad,n2);
		float phi2 = phi*n2;

		//to (x,y)
		z = vec2(
			cos(phi1)*rad1,
			sin(phi1)*rad1
		)*t+
        vec2(
			cos(phi2)*rad2,
			sin(phi2)*rad2
		)*(1.-t)
        +c;
	}
	return iterations;
}

void main( ){

  vec2 uv = gl_FragCoord.xy;
  // uv.x += 7600.;
  // uv.xy *= .2;
  vec2 scaledp = Scale(uv);
	vec3 color = vec3(mandelbrot(scaledp)/iterations);
	gl_FragColor = vec4(color, 1.0);
}
