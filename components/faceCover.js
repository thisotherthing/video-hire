import * as React from "react";
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Clock,
  TextureLoader,
} from "three";

import addFaceBaseCover from "./getFaceBaseCover";

const videoWidth = 320;
const videoHeight = 240;

const faceScale = 3.0;

const shiftX = -1.0;
const shiftY = -0.5;

/* global clm */

const lerp = (a, b, t) => {
  return a + ((b - a) * t);
};

const setOffsetVector = (
  target,
  point0,
  point1,
) => {
  target[0] =
    (
      point0[0]
      - point1[0]
    ) / videoWidth * faceScale;

  target[1] =
    (
      point0[1]
      - point1[1]
    ) / videoHeight * faceScale;
};
const setPoint = (
  target,
  point,
) => {
  target[0] = point[0] / videoWidth * faceScale;
  target[1] = point[1] / videoHeight * faceScale;
};

const vecLength = (vec) => {
  return Math.sqrt(
    vec[0] * vec[0] +
    vec[1] * vec[1]
  );
};

const normalizeLengthTo = (
  srcVec,
  targetVec,
) => {
  const srcLength = vecLength(srcVec);
  const targetLength = vecLength(targetVec);

  const scaler = srcLength / targetLength;
  targetVec[0] *= scaler;
  targetVec[1] *= scaler;
};

export default class Index extends React.Component {
  setup = (videoRef) => {

    this.videoRef = videoRef;

    this.faceTracker = new clm.tracker();
    this.faceTracker.init();
    this.faceTracker.start(this.videoRef);

    this.debugCanvasCtx = this.debugCanvasRef.getContext("2d");

    this.clock = new Clock();
    this.clock.start();

    this.renderer = new WebGLRenderer({
      canvas: this.canvasRef,
      // antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1.0);
    this.renderer.setClearColor(0xffffff, 0.0);

    this.scene = new Scene();

    const textureLoader = new TextureLoader();

    this.uniforms = {
      time: {type: "f", value: 0.0},
      aspectRatio: {type: "f", value: 0.0},
      screenParams: {
        type: "4fv",
        value: [1.0, 1.0, 0.0, 0.0],
      },

      faceBaseCenter: {
        type: "3fv",
        value: [0.0, 0.0, -2.0],
      },
      leftEyeCenter: {
        type: "3fv",
        value: [-0.1, 0.0, -2.0],
      },
      leftEyebrow0Center: {type: "3fv", value: [-0.1, 0.0, -2.0]},
      leftEyebrow1Center: {type: "3fv", value: [-0.1, 0.0, -2.0]},
      leftEyebrow2Center: {type: "3fv", value: [-0.1, 0.0, -2.0]},

      rightEyeCenter: {
        type: "3fv",
        value: [0.1, 0.0, -2.0],
      },
      rightEyebrow0Center: {type: "3fv", value: [-0.1, 0.0, -2.0]},
      rightEyebrow1Center: {type: "3fv", value: [-0.1, 0.0, -2.0]},
      rightEyebrow2Center: {type: "3fv", value: [-0.1, 0.0, -2.0]},

      mouthLeft: {type: "3fv", value: [-0.1, 0.2, -2.0]},
      mouthCenter: {type: "3fv", value: [0.0, 0.2, -2.0]},
      mouthRight: {type: "3fv", value: [0.1, 0.2, -2.0]},
      mouthBottom: {type: "3fv", value: [0.0, 0.3, -2.0]},

      faceBaseToRight: {
        type: "3fv",
        value: [0.2, 0.0, 0.0],
      },
      faceBaseToBottom: {
        type: "3fv",
        value: [0.0, 0.4, 0.0],
      },
      faceBaseToBottomSquare: {
        type: "3fv",
        value: [0.0, 0.2, 0.0],
      },

      faceBaseMap: {type: "t", value: textureLoader.load("/static/head.png")},
      faceEarMap: {type: "t", value: textureLoader.load("/static/head_ears.png")},
      faceEyeMap: {type: "t", value: textureLoader.load("/static/eye.png")},
    };

    this.camera = new PerspectiveCamera(
      50,
      1.0,
      1.0,
      100.0,
    );
    this.camera.position.z = 2.5;

    addFaceBaseCover(
      this.uniforms,
      this.scene,
    );

    window.addEventListener("resize", this.onResize);
    this.onResize();

    this.renderloop();
  }

  toggleDebug(showDebug) {
    this.debugCanvasRef.style.opacity = showDebug ? 1.0 : 0.001;
  }

  renderloop = () => {
    const delta = Math.min(1.0 / 20.0, this.clock.getDelta());
    this.uniforms.time.value += delta;
    this.uniforms.time.value %= 1000.0;

    this.featurePositions = this.faceTracker.getCurrentPosition();

    this.debugCanvasCtx.clearRect(0, 0, this.debugCanvasRef.width, this.debugCanvasRef.height);

    this.renderer.render(this.scene, this.camera);

    if (this.featurePositions) {
      this.faceTracker.draw(this.debugCanvasRef);

      const eyeCenterX = lerp(
        this.featurePositions[27][0],
        this.featurePositions[32][0],
        0.5
      );
      const eyeCenterY = lerp(
        this.featurePositions[27][1],
        this.featurePositions[32][1],
        0.5
      );

      this.uniforms.faceBaseCenter.value[0] = eyeCenterX / videoWidth + shiftX;
      this.uniforms.faceBaseCenter.value[1] = eyeCenterY / videoHeight + shiftY;


      this.uniforms.leftEyeCenter.value[0] = this.featurePositions[27][0] / videoWidth + shiftX;
      this.uniforms.leftEyeCenter.value[1] = this.featurePositions[27][1] / videoHeight + shiftY;

      this.uniforms.leftEyebrow0Center.value[0] = this.featurePositions[22][0] / videoWidth + shiftX;
      this.uniforms.leftEyebrow0Center.value[1] = this.featurePositions[22][1] / videoHeight + shiftY;
      this.uniforms.leftEyebrow1Center.value[0] = this.featurePositions[20][0] / videoWidth + shiftX;
      this.uniforms.leftEyebrow1Center.value[1] = this.featurePositions[20][1] / videoHeight + shiftY;
      this.uniforms.leftEyebrow2Center.value[0] = this.featurePositions[19][0] / videoWidth + shiftX;
      this.uniforms.leftEyebrow2Center.value[1] = this.featurePositions[19][1] / videoHeight + shiftY;


      this.uniforms.rightEyeCenter.value[0] = this.featurePositions[32][0] / videoWidth + shiftX;
      this.uniforms.rightEyeCenter.value[1] = this.featurePositions[32][1] / videoHeight + shiftY;
      this.uniforms.rightEyebrow0Center.value[0] = this.featurePositions[18][0] / videoWidth + shiftX;
      this.uniforms.rightEyebrow0Center.value[1] = this.featurePositions[18][1] / videoHeight + shiftY;
      this.uniforms.rightEyebrow1Center.value[0] = this.featurePositions[16][0] / videoWidth + shiftX;
      this.uniforms.rightEyebrow1Center.value[1] = this.featurePositions[16][1] / videoHeight + shiftY;
      this.uniforms.rightEyebrow2Center.value[0] = this.featurePositions[15][0] / videoWidth + shiftX;
      this.uniforms.rightEyebrow2Center.value[1] = this.featurePositions[15][1] / videoHeight + shiftY;

      this.uniforms.mouthLeft.value[0] = this.featurePositions[44][0] / videoWidth + shiftX;
      this.uniforms.mouthLeft.value[1] = this.featurePositions[44][1] / videoHeight + shiftY;
      this.uniforms.mouthCenter.value[0] = this.featurePositions[60][0] / videoWidth + shiftX;
      this.uniforms.mouthCenter.value[1] = this.featurePositions[60][1] / videoHeight + shiftY;
      this.uniforms.mouthRight.value[0] = this.featurePositions[50][0] / videoWidth + shiftX;
      this.uniforms.mouthRight.value[1] = this.featurePositions[50][1] / videoHeight + shiftY;

      this.uniforms.mouthBottom.value[0] = this.featurePositions[53][0] / videoWidth + shiftX;
      this.uniforms.mouthBottom.value[1] = this.featurePositions[53][1] / videoHeight + shiftY;

      setOffsetVector(
        this.uniforms.faceBaseToRight.value,
        this.featurePositions[27],
        this.featurePositions[32],
      );

      setOffsetVector(
        this.uniforms.faceBaseToBottom.value,
        [eyeCenterX, eyeCenterY],
        this.featurePositions[7],
      );
      this.uniforms.faceBaseToBottom.value[0] *= 0.5;
      this.uniforms.faceBaseToBottom.value[1] *= 0.5;

      this.uniforms.faceBaseToBottomSquare.value[0] = this.uniforms.faceBaseToBottom.value[0];
      this.uniforms.faceBaseToBottomSquare.value[1] = this.uniforms.faceBaseToBottom.value[1];

      normalizeLengthTo(
        this.uniforms.faceBaseToRight.value,
        this.uniforms.faceBaseToBottomSquare.value,
      );
    }

    this.framerequest = requestAnimationFrame(this.renderloop);
  }

  onResize = () => {
    this.debugCanvasRef.width = window.innerWidth;
    this.debugCanvasRef.height = window.innerHeight;

    this.faceTracker.stop();
    this.faceTracker.reset();
    this.faceTracker.start(this.videoRef);


    this.rect = this.containerRef.getBoundingClientRect();

    this.windowWidth = this.rect.width;
    this.windowHeight = this.rect.height;

    this.renderer.setSize(this.windowWidth, this.windowHeight);

    this.camera.aspect = this.windowWidth / this.windowHeight;
    this.camera.updateProjectionMatrix();

    this.uniforms.aspectRatio.value = this.windowWidth / this.windowHeight;

    this.uniforms.screenParams.value[0] = this.windowWidth;
    this.uniforms.screenParams.value[1] = this.windowHeight;
    this.uniforms.screenParams.value[2] = 1.0 / this.windowWidth;
    this.uniforms.screenParams.value[3] = 1.0 / this.windowHeight;
  }

  render() {
    return (
      <div
        className="container"
        ref={(ref) => {this.containerRef = ref; }}
      >
        <canvas
          ref={(ref) => {this.debugCanvasRef = ref; }}
          style={{
            opacity: this.props.showDebug ? 1.0 : 0.0001,
          }}
        />
        <canvas ref={(ref) => {this.canvasRef = ref; }} />
        <style jsx>{`
          .container {
            width: 100vw;
            height: 100vh;

            position: absolute;
            top: 0;
            left: 0;
          }

          canvas {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        `}
        </style>
      </div>
    );
  }
}
