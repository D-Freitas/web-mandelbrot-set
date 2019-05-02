precision highp float;

uniform vec2 resolution;
uniform float maxIterations;

void main() {
    vec2 center = vec2(-0.5, 0.0);
    vec2 z = vec2(0.0, 0.0);
    float aspectRatio = resolution.x / resolution.y;
    vec2 c = center + (gl_FragCoord.xy / resolution - 0.5) * 4.0 * vec2(aspectRatio, 1.0);
    int n = 0;
    for (int i = 0; i < 1000; i++) {
        if (n >= int(maxIterations)) break;
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if (length(z) > 2.0) break;
        n++;
    }
    vec3 colorMap;
    if (n < int(maxIterations)) {
        float t = float(n) / float(maxIterations);
        colorMap = vec3(0.0, 0.0, 0.0);
        colorMap = mix(colorMap, vec3(0.0, 0.0, 1.0), t);
        colorMap = mix(colorMap, vec3(0.0, 0.5, 1.0), t);
        colorMap = mix(colorMap, vec3(0.0, 1.0, 1.0), t);
        colorMap = mix(colorMap, vec3(1.0, 1.0, 1.0), t);
    } else {
        colorMap = vec3(0.0);
    }
    gl_FragColor = vec4(colorMap, 1.0);
}
