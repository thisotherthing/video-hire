export default `precision highp float;

uniform float time;
uniform sampler2D MAP_NAME;

varying vec2 vUV;

void main() {
  vec4 color = vec4(
    vUV,
    0.5 + 0.5 * sin(time),
    1.0
  );

  gl_FragColor = color;
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  gl_FragColor = texture2D(MAP_NAME, vUV);
}`;
