import React from "react";
import io from 'socket.io-client';
import FaceCover from "../components/faceCover";
import VoiceCover from "../components/voiceCover";

export default class Index extends React.Component {
  constructor() {
    super()
    this.state = {
      showDebug: false,
      // messages: 'MatchWithoutLimits',
    }
  }
  handleMessage = (e) => {
    console.log(e);
  }

  componentDidMount() {
    // TODO subscribe to socket.io messages
    this.socket = io("localhost:3000");
    // this.socket = io("wss://match-without-limits.herokuapp.com/");
    this.socket.on("message", this.handleMessage);
    this.socket.emit("message", "from browser");

    window.addEventListener("keydown", this.onKeyboardDown);

    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 640,
        height: 480,
      },
    })
      .then((mediaStream) => {
        this.videoRef.srcObject = mediaStream;
        this.videoRef.onloadedmetadata = () => {
          this.videoRef.play();
          this.videoRef.volume = 0.0;

          this.faceCoverRef.setup(this.videoRef);

          // https://github.com/cwilso/PitchDetect

          const audioContext = new AudioContext();
          const audioSource = audioContext.createMediaStreamSource(mediaStream);

          this.voiceCover = new VoiceCover(
            audioContext,
            audioSource,
            audioContext.destination,
          );
        };
      })
      .catch((err) => {
        console.log(err.name + ": " + err.message);
      });
  }

  onKeyboardDown = (e) => {
    if (e.key === "d") {
      this.setState({
        showDebug: !this.state.showDebug,
      });
    }
  }

  componentWillUnmount() {
    this.socket.off('message', this.handleMessage);
    this.socket.close();

    window.removeEventListener("keydown", this.onKeyboardDown);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showDebug !== this.state.showDebug) {
      this.faceCoverRef.toggleDebug(this.state.showDebug);
    }
  }

  render() {
    return (

      <div>
        <div align="right">
          <h3>MatchWithoutLimits</h3>
        </div>

        <video
          width="640"
          height="480"
          muted
          ref={(ref) => {this.videoRef = ref; }}
          style={{
            opacity: this.state.showDebug ? 1.0 : 0.001,
          }}
        />
        <FaceCover
          showDebug={this.state.showDebug}
          ref={(ref) => {this.faceCoverRef = ref; }}
        />
        <style jsx>{`
          video {
            width: 640px;
            height: 480px;
          }
        `}
        </style>
      </div>
    );
  }
}
