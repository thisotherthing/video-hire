import * as React from "react";

/* global clm */

export default class Index extends React.Component {
  setup = (videoRef) => {

    this.faceTracker = new clm.tracker();
    this.faceTracker.init();
    this.faceTracker.start(videoRef);

    this.debugCanvasCtx = this.debugCanvasRef.getContext("2d");

    window.addEventListener("resize", this.onResize);
    this.onResize();

    this.renderloop();
  }

  renderloop = () => {
    this.featurePositions = this.faceTracker.getCurrentPosition();

    console.log(this.featurePositions);

    this.debugCanvasCtx.clearRect(0, 0, this.debugCanvasRef.width, this.debugCanvasRef.height);
    this.faceTracker.draw(this.debugCanvasRef);

    this.framerequest = requestAnimationFrame(this.renderloop);
  }

  onResize = () => {
    this.debugCanvasRef.width = window.innerWidth;
    this.debugCanvasRef.height = window.innerHeight;
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
