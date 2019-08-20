import pKill from "tree-kill";
import path from "path";
import { exec } from "child_process";

/**
 * Task service class.
 * This is the class where child_processes of tasks are created.
 * This class returns responses to subscribed socket events.
 *
 * @class Job
 */
class Job {
  static socket: any;
  private room: any;
  constructor(room) {
    this.room = room;
  }

  /**
   * Starts a task.
   * Emits events to socket client when child_process for the task updates.
   *
   * @param {*} command
   * @param {*} projectPath
   * @memberof Job
   */
  public start(command, projectPath) {
    try {
      const job = command.cmd;
      const execPath =
        command.execDir.length > 0
          ? path.resolve(command.execDir)
          : path.resolve(projectPath);

      console.log("execPath:", execPath);
      const room = this.room;

      const n = exec(job, {
        cwd: execPath || process.cwd(),
        maxBuffer: 100 * 1024 * 1024
      });

      Job.socket.emit(`job_started`, { room, data: n });
      n.stdout.on("data", chunk => {
        Job.socket.emit(`job_output`, { room, data: chunk });
      });

      n.stderr.on("data", chunk => {
        Job.socket.emit(`job_error`, { room, data: chunk });
      });

      n.on("close", (code, signal) => {
        Job.socket.emit(`job_close`, {
          room,
          data: `Process closed with code ${code} by signal ${signal}`
        });
      });

      n.on("exit", (code, signal) => {
        Job.socket.emit(`job_exit`, {
          room,
          data: `Process exited with code ${code} by signal ${signal}`
        });
      });
    } catch (error) {
      console.log(`Big Catch: ${error.message}`);
    }
  }
}

/**
 * A manager class to manage multiple Job objects
 *
 * @export
 * @class JobManager
 */
export class JobManager {
  public static _instance: JobManager;
  io: any;
  socket: any;
  private constructor() {}

  /**
   * Kills a running task when user clicks on stop button on UI.
   *
   * @private
   * @param {*} room Room Id of the task. (This is actually the id of task)
   * @param {*} pid Process Id of the task. (Created by OS)
   * @memberof JobManager
   */
  private killJob(room, pid) {
    console.log(`Killing process: ${pid}`);
    pKill(pid);
    this.socket.emit(`job_killed`, {
      room,
      data: pid
    });
  }

  /**
   * Triggers a new object for a task.
   * Activates when play button is clicked on UI.
   * Responds to subscribe socket event.
   *
   * @private
   * @memberof JobManager
   */
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

  /**
   * Creates Socket.IO socket on server side.
   *
   * @param {*} io Socket.IO server side socket object. Check Socket.IO documentation for details.
   * @memberof JobManager
   */
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

  /**
   * Returns a singleton object of class.
   *
   * @static
   * @returns
   * @memberof JobManager
   */
  public static getInstance() {
    return this._instance || new this();
  }
}

export default Job;
