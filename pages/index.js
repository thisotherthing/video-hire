import React from "react";
import io from 'socket.io-client';
import FaceCover from "../components/faceCover";

export default class Index extends React.Component {
  constructor() {
    super()
    this.state = {
      messages: 'ABC1243dsjhfksdhf'
    }
  }
  handleMessage = (e) => {
    console.log(e);
  }
  

  componentDidMount() {
    // TODO subscribe to socket.io messages
    // this.socket = io('localhost:3000');
    this.socket = io("wss://match-without-limits.herokuapp.com/");
    this.socket.on('message', this.handleMessage)
    this.socket.emit('message', "from browser");

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

          this.faceCoverRef.setup(this.videoRef);

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

  componentWillUnmount() {
    this.socket.off('message', this.handleMessage)
    this.socket.close()
  }

  render() {
    return (
      <div>
        {this.state.messages}
        <video
          width="640"
          height="480"
          ref={(ref) => {this.videoRef = ref; }}
        />
        <FaceCover
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
