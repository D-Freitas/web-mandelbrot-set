attribute vec2 position;
varying vec2 pixelPosition;

void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    pixelPosition = position;
}
