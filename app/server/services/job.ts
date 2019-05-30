import { v4 as uuid } from "uuid";
import execa from "execa";
import pKill from "tree-kill";
import io from "socket.io";
import path from "path";
import { exec } from "child_process";

class Job {
  static socket: any;
  private room: any;
  constructor(room) {
    this.room = room;
  }

  public start(command, projectPath) {
    try {
      const job = command.cmd;
      const execPath =
        command.execDir.length > 0
          ? path.normalize(command.execDir)
          : path.normalize(projectPath);

      console.log("execPath:", execPath);
      const room = this.room;

      // const n = execa(job, {
      //   cwd: execPath || process.cwd(),
      // });

      const n = exec(job, {
        cwd: execPath || process.cwd(),
        maxBuffer: 100 * 1024 * 1024
      });

      Job.socket.emit(`job_started`, { room, data: n });
      n.stdout.on("data", chunk => {
        Job.socket.emit(`job_output`, { room, data: chunk.toString() });
      });

      n.stderr.on("data", chunk => {
        Job.socket.emit(`job_error`, { room, data: chunk.toString() });
      });

      n.on("close", (code, signal) => {
        Job.socket.emit(`job_close`, {
          room,
          data: `Exited with code ${code} by signal ${signal}`
        });
      });

      n.on("exit", (code, signal) => {
        Job.socket.emit(`job_exit`, {
          room,
          data: `Exited with code ${code} by signal ${signal}`
        });
      });
    } catch (error) {
      console.log(`Big Catch: ${error.message}`);
    }
  }
}

export class JobManager {
  public static _instance: JobManager;
  io: any;
  socket: any;
  private constructor() {}

  private killJob(room, pid) {
    console.log(`Killing process: ${pid}`);
    pKill(pid);
    this.io.to(room).emit(`job_killed`, {
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
        const process = new Job(room);
        process.start(command, projectPath);
      }
    );

    this.socket.on("unsubscribe", ({ room, pid }) => {
      this.killJob(room, pid);
      // this.socket.leave(room);
    });
  }

  public bindIO(io: any) {
    if (!this.io) {
      this.io = io;
    }
    this.io.on("connection", socket => {
      console.log(`Client connected to socket: `, socket.id);
      Job.socket = socket;
      this.socket = socket;
      this.socket.on("disconnect", function() {
        console.log("Disconnecting: ", socket.id);
      });
      this.bindEvents();
    });
  }
  public static getInstance() {
    return this._instance || new this();
  }
}

export default Job;
