import { v4 as uuid } from "uuid";
import execa from "execa";
import pKill from "tree-kill";
import io from "socket.io";

class Job {
  private io: any;
  private room: any;
  constructor(io, room) {
    this.io = io;
    this.room = room;
  }

  public start(job) {
    // console.log("job:", job);
    const io = this.io;
    console.log(io.rooms);

    const room = this.room;
    const n = execa(job);
    io.to(room).emit("job_started", { room, data: n });
    n.stdout.on("data", chunk => {
      // console.log("output:", chunk.toString());

      io.to(room).emit("output", { room, data: chunk.toString() });
    });

    n.stderr.on("data", chunk => {
      io.to(room).emit("output", { room, data: chunk.toString() });
    });

    n.on("close", (code, signal) => {
      io.to(room).emit("output", {
        room,
        data: `Exited with code ${code} by signal ${signal}`
      });
    });

    n.on("exit", (code, signal) => {
      io.to(room).emit("output", {
        room,
        data: `Exited with code ${code} by signal ${signal}`
      });
    });

    setTimeout(() => {
      console.log("Attempt Kill");

      pKill(n.pid);
    }, 10000);
  }
}

export class JobManager {
  public static _instance: JobManager;
  io: any;
  socket: any;
  private constructor() {}

  private killJob(job, room, pid) {
    console.log(`Killing Job`);
    pKill(pid);
    this.io.to(room).emit("job_killed", pid);
  }

  private bindEvents() {
    this.socket.on("subscribe", ({ job, room }) => {
      this.socket.join(room, () => {
        let rooms = Object.keys(this.socket.rooms);
        console.log(rooms);

        console.log(`${job} joined room ${room}`);
        this.io
          .to(room)
          .emit("joined_room", { room, data: `${job} joined room ${room}` });
        const process = new Job(this.io, room);
        process.start(job);
      });
    });

    this.socket.on("unsubscribe", ({ job, room, pid }) => {
      console.log(`${job} leaving room ${room}`);
      this.killJob(job, room, pid);
      this.socket.leave(room);
    });
  }

  public bindIO(io: any) {
    if (!this.io) {
      this.io = io;
    }
    this.io.on("connection", socket => {
      console.log(`Client connected to socket`);

      this.socket = socket;
      this.bindEvents();
    });
  }
  public static getInstance() {
    return this._instance || new this();
  }
}

export default Job;
