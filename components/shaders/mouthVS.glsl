export default `precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 mouthLeft;
uniform vec3 mouthCenter;
uniform vec3 mouthRight;
uniform vec3 mouthBottom;

attribute float extrude;
attribute float uvX;

float when_gt(float x, float y) {
  return max(sign(x - y), 0.0);
}

void main() {
  vec4 mvPosition = vec4(0.0, 0.0, 0.0, 1.0);
  float topProgress = min(uvX * 2.0, 1.0);
  vec3 topPosition = mix(
    mix(mouthLeft, mouthCenter, topProgress),
    mix(mouthCenter, mouthRight, topProgress),
    topProgress
  );
  float bottomProgress = max(uvX * 2.0 - 1.0, 0.0);
  vec3 bottomPosition = mix(
    mix(mouthRight, mouthBottom, bottomProgress),
    mix(mouthBottom, mouthLeft, bottomProgress),
    bottomProgress
  );

  vec3 mouthPosition = mix(
    topPosition,
    bottomPosition,
    when_gt(uvX, 0.5)
  );
  mvPosition.xyz = mouthPosition;
  mvPosition.y = -mvPosition.y;

  mvPosition = modelViewMatrix * mvPosition;
  mvPosition = projectionMatrix * mvPosition;

  gl_Position = mvPosition;
}`;
