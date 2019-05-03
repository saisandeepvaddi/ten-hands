import { v4 as uuid } from "uuid";
import execa from "execa";
import pKill from "tree-kill";
import io from "socket.io";

enum EventTypes {
  SUBSCRIBE = "SUBSCRIBE",
  UNSUBSCRIBE = "UNSUBSCRIBE"
}

export class JobManager {
  public static _instance: JobManager;
  io: any;
  socket: any;
  private constructor() {}

  private startJob(job, room) {
    const n = execa(job);
    this.io.to(room).emit("job_started", n);
    n.stdout.on("data", chunk => {
      console.log("output:", chunk.toString());
      this.io.to(room).emit("output", chunk.toString());
    });

    n.stderr.on("data", chunk => {
      console.log("data: ", chunk.toString());

      this.io.to(room).emit("output", chunk.toString());
    });

    n.on("close", (code, signal) => {
      this.io
        .to(room)
        .emit("output", `Exited with code ${code} by signal ${signal}`);
    });

    n.on("exit", (code, signal) => {
      this.io
        .to(room)
        .emit("output", `Exited with code ${code} by signal ${signal}`);
    });

    setTimeout(() => {
      console.log("Attempt Kill");

      pKill(n.pid);
    }, 10000);
  }

  private killJob(job, room, pid) {
    console.log(`Killing Job`);
    pKill(pid);
    this.io.to(room).emit("job_killed", pid);
  }

  private bindEvents() {
    this.socket.on("subscribe", ({ job, room }) => {
      console.log(`${job} joining room ${room}`);
      this.socket.join(room, () => {
        this.io.to(room).emit("joined_room", room);
        this.startJob(job, room);
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

class Job implements IJob {
  _id?: string;
  pid: number;
  status: JobStatus;
  command: IProjectCommand;
  createdAt: Date;
  // Room of socket. Each Job will get a room with the name of id
  room: any;
  manager: JobManager;
  constructor(command: IProjectCommand) {
    // Pass a command to create Job
    const id = uuid();
    this._id = id;
    this.room = id;
    this.command = command;
    this.manager = JobManager.getInstance();
  }

  start(): number {
    this.createdAt = new Date();

    return 0;
  }

  kill(): number {
    pKill(this.pid);
    return 0;
  }
}

export default Job;
