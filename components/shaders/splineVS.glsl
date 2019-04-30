export default `precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 POINT0;
uniform vec3 POINT1;
uniform vec3 POINT2;

attribute float extrude;
attribute float uvX;

void main() {
  #if defined(SCALE)
    float scale = SCALE;
  #else
    float scale = 1.0;
  #endif

  vec4 mvPosition = vec4(0.0, 0.0, 0.0, 1.0);
  mvPosition.xyz = mix(
    mix(POINT0, POINT1, uvX),
    mix(POINT1, POINT2, uvX),
    uvX
  );

  float forwardPos = min(1.0, uvX + 0.001);
  vec3 forwardPoint = mix(
    mix(POINT0, POINT1, forwardPos),
    mix(POINT1, POINT2, forwardPos),
    forwardPos
  );
  vec2 forwardV = forwardPoint.xy - mvPosition.xy;
  vec2 extrudeV;
  extrudeV.x = forwardV.y;
  extrudeV.y = -forwardV.x;
  extrudeV = normalize(extrudeV);

  mvPosition.xy += extrudeV * extrude * 0.01;

  mvPosition.y = -mvPosition.y;

  mvPosition = modelViewMatrix * mvPosition;
  mvPosition = projectionMatrix * mvPosition;

  gl_Position = mvPosition;
}`;
