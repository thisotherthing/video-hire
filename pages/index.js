import React from "react";

export default class Index extends React.Component {

  componentDidMount() {
    // TODO subscribe to socket.io messages

    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 1280,
        height: 720,
      },
    })
      .then((mediaStream) => {
        this.videoRef.srcObject = mediaStream;
        this.videoRef.onloadedmetadata = () => {
          this.videoRef.play();

          // TODO detect face with clmtracker, and to face mask

          // TODO setup audio filters
          // const context = new AudioContext();
          // const audioSource = context.createMediaElementSource(this.videoRef);
          // const filter = context.createBiquadFilter();
          // audioSource.connect(filter);
          // filter.connect(context.destination);

          // // Configure filter
          // filter.type = "lowshelf";
          // filter.frequency.value = 1000;
          // filter.gain.value = 25;
        };
      })
      .catch((err) => {
        console.log(err.name + ": " + err.message);
      });
  }

  render() {
    return (
      <div>
        <video ref={(ref) => {this.videoRef = ref; }} />
        <style jsx>{`
          video {
            width: 100vw;
            height: 100vh;
          }
        `}
        </style>
      </div>
    );
  }
}
