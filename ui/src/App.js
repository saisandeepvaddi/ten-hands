import React, { Component } from "react";
import "./App.css";
import io from "socket.io-client";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = io("http://localhost:3030");
    this.client = feathers();
    this.client.configure(socketio(this.socket));
    this.jobService = this.client.service("jobs");
    this.state = {
      command: "mongod --dbPath=C:\\Mongodata",
      jobs: [],
      stdout: ""
    };
    this.cmdRef = React.createRef();

    this.jobService.on("created", job => {
      console.log("created ", job);
    });

    this.jobService.on("command", job => {
      console.log("job:", job);
      const { data } = job;
      this.setState(prevState => ({
        stdout: (prevState.stdout + data).replace(/(?:\r\n|\r|\n)/g, "<br>")
      }));
    });

    this.jobService.on("removed", job => {
      console.log("removed ", job);
    });
  }

  componentDidMount() {
    this.jobService.find().then(jobs => {
      this.setState({ jobs });
    });
    this.cmdRef.current.focus();
  }

  updateJobs = async () => {
    const jobs = await this.jobService.find();
    this.setState({ jobs });
  };

  removeJobs = async () => {
    const jobs = await Promise.all(
      this.state.jobs.map(job => this.jobService.remove(job._id))
    );
    this.updateJobs();
    this.setState({ stdout: "" });
  };

  createJob = async () => {
    await this.jobService.create({
      command: this.state.command,
      pid: "",
      status: "started"
    });
    this.updateJobs();
  };

  removeJob = async id => {
    await this.jobService.remove(id);
    this.updateJobs();
  };

  render() {
    return (
      <div className="App">
        <input
          type="text"
          value={this.state.command}
          ref={this.cmdRef}
          onChange={e => this.setState({ command: e.target.value })}
        />
        <button onClick={this.createJob}>Create Job</button>
        <button onClick={this.removeJobs}>Remove Jobs</button>
        {this.state.jobs.map(job => (
          <pre key={job._id}>
            {JSON.stringify(job, null, 2)}
            <button onClick={() => this.removeJob(job._id)}>Remove</button>
          </pre>
        ))}
        <div
          style={{
            border: "1px solid black",
            background: "#EEEEEE",
            color: "black"
          }}
        >
          {this.state.stdout}
        </div>
      </div>
    );
  }
}

export default App;
