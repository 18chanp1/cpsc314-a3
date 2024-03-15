// HINT: Don't forget to define the uniforms here after you pass them in in A3.js

uniform vec3 toonColor;
uniform vec3 toonColor2;
uniform vec3 outlineColor;

// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 viewPosition;
in float fresnel;

void main() {
    // TODO:
    // HINT: First, compute the light intensity of the current fragment by determining
    // the cosine angle between the surface normal and the light vector. Next, define
    // ranges of light intensity values to shade; you may find GLSL's built-in `ceil`
    // function being useful. Next, define two colors: `toonColor` being a yellow
    // color for brighter areas, and `toonColor2` is a red color for darker areas.
    // Use the light intensity to blend the two colors. Finally, to achieve the toon
    // silhouette outline, set a dark fragment color if the current fragment is located
    // near the edge of the 3D model. Use a reasonable value as the threshold for the
    // silhouette thickness (i.e. proximity to edge).

    gl_FragColor = vec4(0.5, 0.0, 1.0, 1.0);

    //q1b

    // Compute the light intensity of the current fragment
    vec3 L = normalize(lightDirection);
    vec3 N = normalize(interpolatedNormal);
    float lightIntensity = dot(N, L);

    // Define ranges of light intensity values to shade - this one has 10 lvls
    float lightIntensityRange = ceil(lightIntensity * 4.0);

    //define two colors - apparently already given by uniform so no need to define lol

    // Use the light intensity to blend the two colors
    gl_FragColor = vec4(mix(toonColor, toonColor2, lightIntensityRange / 4.0), 1.0);

    // get silhouette outline
    if (fresnel < 0.4) {
        gl_FragColor = vec4(outlineColor, 1.0);
    }
}
