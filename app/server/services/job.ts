import pKill from "tree-kill";
import path from "path";
import { exec } from "child_process";
import SocketManager, { ISocketListener } from "./socket";

/**
 * Task service class.
 * This is the class where child_processes of tasks are created.
 * This class returns responses to subscribed socket events.
 *
 * @class Job
 */
class Job {
  socketManager: SocketManager;
  private room: any;
  private shell: string;
  constructor(room: string, shell: string, socketManager: SocketManager) {
    this.room = room;
    this.shell = shell;
    this.socketManager = socketManager;
  }

  /**
   * Starts a task.
   * Emits events to socket client when child_process for the task updates.
   *
   * @param {*} command
   * @param {*} projectPath
   * @memberof Job
   */
  public start(command: IProjectCommand, projectPath: string) {
    try {
      const job = command.cmd;
      const execPath =
        command.execDir.length > 0
          ? path.resolve(command.execDir)
          : path.resolve(projectPath);

      console.log("execPath:", execPath);
      const room = this.room;
      let jobOptions: any = {
        cwd: execPath || process.cwd(),
        maxBuffer: 100 * 1024 * 1024,
      };

      console.log("this.shell:", this.shell);

      if (this.shell && this.shell !== "") {
        jobOptions.shell = this.shell;
      }

      console.log("jobOptions:", jobOptions);

      const n = exec(job, jobOptions);

      console.log(`Process started with PID: ${n.pid}`);

      this.socketManager.emit(`job_started`, { room, data: n });
      n.stdout?.on("data", (chunk) => {
        this.socketManager.emit(`job_output`, { room, data: chunk });
      });

      n.stderr?.on("data", (chunk) => {
        this.socketManager.emit(`job_error`, { room, data: chunk });
      });

      n.on("close", (code, signal) => {
        this.socketManager.emit(`job_close`, {
          room,
          data: `Process with PID ${n.pid ||
            "--"} closed with code ${code} by signal ${signal}`,
        });
      });

      n.on("exit", (code, signal) => {
        this.socketManager.emit(`job_exit`, {
          room,
          data: `Process with PID ${n.pid ||
            "--"} exited with code ${code} by signal ${signal}`,
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
  socketManager: SocketManager;
  private constructor() {}

  public bindSocketManager(socketManager: SocketManager) {
    this.socketManager = socketManager;
    this.subscribeEvents();
  }

  /**
   * Kills a running task when user clicks on stop button on UI.
   *
   * @private
   * @param {*} room Room Id of the task. (This is actually the id of task)
   * @param {*} pid Process Id of the task. (Created by OS)
   * @memberof JobManager
   */
  private killJob(room: string, pid: number) {
    console.log(`Killing process: ${pid}`);
    pKill(pid);
    this.socketManager.emit(`job_killed`, {
      room,
      data: pid,
    });
  }

  /**
   * Subscribes Job events to SocketManager
   * @private
   * @memberof JobManager
   */
  private subscribeEvents() {
    const jobStartSubscriber: ISocketListener = {
      event: "subscribe",
      callback: ({
        command,
        room,
        projectPath,
        shell,
      }: {
        command: IProjectCommand;
        room: string;
        projectPath: string;
        shell: string;
      }) => {
        const process = new Job(room, shell, this.socketManager);
        process.start(command, projectPath);
      },
    };

    const jobKillSubscriber: ISocketListener = {
      event: "unsubscribe",
      callback: ({ room, pid }) => {
        this.killJob(room, pid);
      },
    };
    this.socketManager.subscribe(jobStartSubscriber);
    this.socketManager.subscribe(jobKillSubscriber);
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
