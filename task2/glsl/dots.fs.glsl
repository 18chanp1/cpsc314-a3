// HINT: Don't forget to define the uniforms here after you pass them in in A3.js

uniform float ticks;

// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 vertexPosition;

void main() {
    // TODO:
    // HINT: First, as you've already done in the Toon fragment shader, compute the light
    // intensity of the current fragment by determining the cosine angle between the surface
    // normal and the light vector. Next, pick any two colors, blend them based on light
    // intensity to give the 3D model some color and depth. Also make the color change wrt tick.
    // Next, implement rolling dots using the mod function, tick and discard.

    //discard pixels too close to grid

    //q1c
    
    //delete pixels too close to grid
    float gridpty = mod(ticks / 6.0, 0.1) - 0.05;
    if (distance((mod(vertexPosition + vec3(0,gridpty,0), 0.1)), vec3(0.05, 0.05, 0.05)) > 0.055) {
        discard;
    }


    // HINT: Set final rendered colour
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    vec3 L = normalize(lightDirection);
    vec3 N = normalize(interpolatedNormal);

    //compute light intensity
    float Lintensity = dot(N,L);

    //blend colors based on light intensity + tick
    float timeOffset = cos(3.0 * ticks);
    vec4 color1 = vec4(1.0, 0.0, 0.0, 1.0);
    vec4 color2 = vec4(0.0, 0.0, 1.0, 1.0);

    float finalIntensity = Lintensity + timeOffset;

    mod(finalIntensity, 1.0);

    vec4 blended = mix(color1, color2, finalIntensity);


    //color changes with respect to tick


    gl_FragColor = blended;


}
