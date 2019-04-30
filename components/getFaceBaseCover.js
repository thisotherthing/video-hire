import {
  Mesh,
  RawShaderMaterial,
  DoubleSide,
} from "three";

import getExtrudeQuadGeometry from "./getExtrudeQuadGeometry";
import getSplineGeometry from "./getSplineGeometry";
import getDiskGeometry from "./getDiskGeometry";

import vertexShader from "./shaders/faceCoverBaseVS.glsl";
import fragmentShader from "./shaders/faceCoverBaseFS.glsl";

import splineVS from "./shaders/splineVS.glsl";
import splineFS from "./shaders/splineFS.glsl";

import mouthVS from "./shaders/mouthVS.glsl";
import mouthFS from "./shaders/mouthFS.glsl";

const eyeScale = 0.1;

export default function getFaceBaseCover(
  uniforms,
  parent,
) {
  const geometry = getExtrudeQuadGeometry();
  const splineGeometry = getSplineGeometry(64);
  const diskGeometry = getDiskGeometry(64);

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

  // left eye brow
  {
    const material = new RawShaderMaterial({
      vertexShader: splineVS,
      fragmentShader: splineFS,
      uniforms,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      defines: {
        POINT0: "leftEyebrow0Center",
        POINT1: "leftEyebrow1Center",
        POINT2: "leftEyebrow2Center",
      },
    });

    const mesh = new Mesh(
      splineGeometry,
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

  // right eye brow
  {
    const material = new RawShaderMaterial({
      vertexShader: splineVS,
      fragmentShader: splineFS,
      uniforms,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      defines: {
        POINT0: "rightEyebrow0Center",
        POINT1: "rightEyebrow1Center",
        POINT2: "rightEyebrow2Center",
      },
    });

    const mesh = new Mesh(
      splineGeometry,
      material,
    );
    mesh.frustumCulled = false;
    parent.add(mesh);
  }

  // open mouth
  {
    const material = new RawShaderMaterial({
      vertexShader: mouthVS,
      fragmentShader: mouthFS,
      uniforms,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });

    const mesh = new Mesh(
      diskGeometry,
      material,
    );
    mesh.frustumCulled = false;
    parent.add(mesh);
  }

  // mouth
  {
    const material = new RawShaderMaterial({
      vertexShader: splineVS,
      fragmentShader: splineFS,
      uniforms,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      defines: {
        POINT0: "mouthLeft",
        POINT1: "mouthCenter",
        POINT2: "mouthRight",
      },
    });

    const mesh = new Mesh(
      splineGeometry,
      material,
    );
    mesh.frustumCulled = false;
    parent.add(mesh);
  }
}
