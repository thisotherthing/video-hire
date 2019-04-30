import {
  BufferGeometry,
  BufferAttribute,
} from "three";

export default function(
  subdivisions,
) {
  const extrudes = [];
  const uvXs = [];
  const indices = [];

  let relI = 0.0;
  let baseIndex = 0;

  const uvXStep = 1.0 / (subdivisions + 1);

  for (let i = 1, l = subdivisions - 1; i < l; i++) {
    extrudes.push(
      -1.0, 1.0,
    );

    relI = uvXStep + uvXStep * i;
    uvXs.push(relI, relI);

    baseIndex = (i - 1) * 2;

    if (i > 1) {
      indices.push(baseIndex - 1, baseIndex, baseIndex + 1);
      indices.push(baseIndex, baseIndex - 2, baseIndex - 1);
    }
  }


  const geometry = new BufferGeometry();
  geometry.addAttribute("extrude", new BufferAttribute(new Float32Array(extrudes), 1));
  geometry.addAttribute("uvX", new BufferAttribute(new Float32Array(uvXs), 1));
  geometry.setIndex(new BufferAttribute(new Uint16Array(indices), 1));

  return geometry;
}
