import {
  BufferGeometry,
  BufferAttribute,
} from "three";

export default function GetParticleGeometry(
  resolution,
) {
  const relX = [];
  const indices = [];

  relX.push(0.75); // move center to bottom center

  for (let i = 0, l = resolution; i < l; i++) {
    relX.push(i / (resolution - 1));

    if (i > 0) {
      indices.push(
        0,
        i,
        i - 1,
      );
    }
  }

  indices.push(
    0,
    1,
    resolution - 1,
  );

  const geometry = new BufferGeometry();

  // set shared data
  geometry.name = "Particle";
  geometry.addAttribute("uvX", new BufferAttribute(new Float32Array(relX), 1));
  geometry.setIndex(new BufferAttribute(new Uint16Array(indices), 1));

  return geometry;
}
