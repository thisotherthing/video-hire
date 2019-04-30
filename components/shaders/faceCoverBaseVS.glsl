export default `precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 faceBaseCenter;

#if defined(CENTER_POSITION)
  uniform vec3 CENTER_POSITION;
#endif
uniform vec3 faceBaseToRight;
uniform vec3 faceBaseToBottom;
uniform vec3 faceBaseToBottomSquare;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUV;

void main() {
  vUV = uv;

  #if defined(SCALE)
    float scale = SCALE;
  #else
    float scale = 1.0;
  #endif

  vec4 mvPosition = vec4(0.0, 0.0, 0.0, 1.0);
  mvPosition.xyz += faceBaseToRight * position.x * scale;

  #if defined(SQUARE)
    mvPosition.xyz += faceBaseToBottomSquare * position.y * scale;
  #else
    mvPosition.xyz += mix(faceBaseToBottom, faceBaseToBottomSquare, 0.4) * position.y * scale;
  #endif
  // mvPosition.x = -mvPosition.x;

  #if defined(CENTER_POSITION)
    mvPosition.xyz += CENTER_POSITION;
  #else
    mvPosition.xyz += faceBaseCenter;
  #endif

  mvPosition.y = -mvPosition.y;

  mvPosition = modelViewMatrix * mvPosition;
  mvPosition = projectionMatrix * mvPosition;

  gl_Position = mvPosition;
}`;
