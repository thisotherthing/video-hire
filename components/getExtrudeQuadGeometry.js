import {
  BufferGeometry,
  BufferAttribute,
} from "three";

export default function getExtrudeQuadGeometry() {
  const extrudes = [
    -1.0, -1.0, 0.0,
    -1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, -1.0, 0.0,
  ];
  const uvs = [
    0.0, 0.0,
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
  ];
  const indices = [
    0, 1, 2,
    0, 2, 3,
  ];

  const geometry = new BufferGeometry();
  geometry.name = "Face Base";
  geometry.addAttribute("position", new BufferAttribute(new Float32Array(extrudes), 3));
  geometry.addAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
  geometry.setIndex(new BufferAttribute(new Uint16Array(indices), 1));

  return geometry;
}
