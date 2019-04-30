import {
  Mesh,
  BufferGeometry,
  BufferAttribute,
  RawShaderMaterial,
  DoubleSide,
} from "three";

import vertexShader from "./shaders/faceCoverBaseVS.glsl";
import fragmentShader from "./shaders/faceCoverBaseFS.glsl";

const eyeScale = 0.1;

export default function getFaceBaseCover(
  uniforms,
  parent,
) {
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

  // ears
  {
    const material = new RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      defines: {
        MAP_NAME: "faceEarMap",
        SQUARE: true,
      }
    });

    const mesh = new Mesh(
      geometry,
      material,
    );
    mesh.frustumCulled = false;
    parent.add(mesh);
  }

  // face
  {
    const material = new RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      defines: {
        MAP_NAME: "faceBaseMap",
      },
    });

    const mesh = new Mesh(
      geometry,
      material,
    );
    mesh.frustumCulled = false;
    parent.add(mesh);
  }

  // left eye
  {
    const material = new RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      defines: {
        MAP_NAME: "faceEyeMap",
        SQUARE: true,
        SCALE: eyeScale,
        CENTER_POSITION: "leftEyeCenter",
      }
    });

    const mesh = new Mesh(
      geometry,
      material,
    );
    mesh.frustumCulled = false;
    parent.add(mesh);
  }

  // right eye
  {
    const material = new RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      defines: {
        MAP_NAME: "faceEyeMap",
        SQUARE: true,
        SCALE: eyeScale,
        CENTER_POSITION: "rightEyeCenter",
      }
    });

    const mesh = new Mesh(
      geometry,
      material,
    );
    mesh.frustumCulled = false;
    parent.add(mesh);
  }
}
