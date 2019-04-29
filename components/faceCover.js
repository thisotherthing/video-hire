import * as React from "react";

/* global clm */

export default class Index extends React.Component {
  setup = (videoRef) => {

    this.videoRef = videoRef;

    this.faceTracker = new clm.tracker();
    this.faceTracker.init();
    this.faceTracker.start(this.videoRef);

    this.debugCanvasCtx = this.debugCanvasRef.getContext("2d");

    window.addEventListener("resize", this.onResize);
    this.onResize();

    this.renderloop();
  }

  renderloop = () => {
    this.featurePositions = this.faceTracker.getCurrentPosition();

    this.debugCanvasCtx.clearRect(0, 0, this.debugCanvasRef.width, this.debugCanvasRef.height);

    if (this.featurePositions) {
      this.faceTracker.draw(this.debugCanvasRef);
    }

    this.framerequest = requestAnimationFrame(this.renderloop);
  }

  onResize = () => {
    this.debugCanvasRef.width = window.innerWidth;
    this.debugCanvasRef.height = window.innerHeight;

    this.faceTracker.stop();
    this.faceTracker.reset();
    this.faceTracker.start(this.videoRef);
  }

  render() {
    return (
      <div>
        <canvas ref={(ref) => {this.debugCanvasRef = ref; }} />
        <canvas ref={(ref) => {this.canvasRef = ref; }} />
        <style jsx>{`
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
