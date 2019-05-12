import { v4 as uuid } from "uuid";
import execa from "execa";
import pKill from "tree-kill";
import io from "socket.io";
import path from "path";

class Job {
  private io: any;
  private room: any;
  constructor(io, room) {
    this.io = io;
    this.room = room;
  }

  public start(command, projectPath) {
    const io = this.io;

    const job = command.cmd;
    // const execDir = command.execDir;
    const execPath = path.normalize(projectPath);
    console.log("execPath:", execPath);
    console.log("job:", job);

    const room = this.room;
    const n = execa(job, {
      cwd: execPath || process.cwd()
    });
    io.to(room).emit(`job_started-${room}`, { room, data: n });
    n.stdout.on("data", chunk => {
      // console.log("output:", chunk.toString());

      io.to(room).emit(`output-${room}`, { room, data: chunk.toString() });
    });

    n.stderr.on("data", chunk => {
      io.to(room).emit(`error-${room}`, { room, data: chunk.toString() });
    });

    n.on("close", (code, signal) => {
      io.to(room).emit(`close-${room}`, {
        room,
        data: `Exited with code ${code} by signal ${signal}`
      });
    });

    n.on("exit", (code, signal) => {
      io.to(room).emit(`exit-${room}`, {
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

  private killJob(room, pid) {
    console.log(`Killing Job`);
    pKill(pid);
    this.io.to(room).emit(`job_killed-${room}`, {
      room,
      data: pid
    });
  }

  private bindEvents() {
    this.socket.on(
      "subscribe",
      ({
        command,
        room,
        projectPath
      }: {
        command: IProjectCommand;
        room: string;
        projectPath: string;
      }) => {
        const job = command.cmd;

        this.socket.join(room, () => {
          this.io.to(room).emit(`joined_room-${room}`, {
            room,
            data: `${job} joined room ${room}`
          });
          const process = new Job(this.io, room);
          process.start(command, projectPath);
        });
      }
    );

    this.socket.on("unsubscribe", ({ room, pid }) => {
      this.killJob(room, pid);
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
