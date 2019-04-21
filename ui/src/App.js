import React, { Component } from "react";
import "./App.css";
import io from "socket.io-client";

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = io("http://localhost:1010");
    this.state = {
      command: "node functions.js",
      jobs: [],
      stdout: []
    };
    this.cmdRef = React.createRef();
  }

  componentDidMount() {
    this.socket.on("connect", () => {
      console.log("Connected to socket");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected to socket");
    });

    this.socket.on("result", result => {
      console.log(result);
      this.setState(prevState => ({
        stdout: [...prevState.stdout, result]
      }));
    });
  }

  updateJobs = async () => {};

  removeJobs = async () => {};

  createJob = async () => {
    console.log("this.state.command:", this.state.command);
    this.socket.emit("start", {
      command: this.state.command
    });
  };

  removeJob = async id => {};

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.command}
          ref={this.cmdRef}
          onChange={e => this.setState({ command: e.target.value })}
        />
        <button onClick={this.createJob}>Create Job</button>
        <button onClick={this.removeJobs}>Remove Jobs</button>
        <div
          style={{
            border: "1px solid black",
            background: "#EEEEEE",
            color: "black",
            fontSize: "12px",
            fontFamily: "consolas"
          }}
        >
          {this.state.stdout.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
