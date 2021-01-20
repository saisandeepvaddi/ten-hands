import fkill from "fkill";
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
  private taskID: any;
  private shell: string;
  private pid: number;
  constructor(taskID: string, shell: string, socketManager: SocketManager) {
    this.taskID = taskID;
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
      const taskID = this.taskID;
      const jobOptions: any = {
        cwd: execPath || process.cwd(),
        maxBuffer: 100 * 1024 * 1024,
      };

      if (this.shell && this.shell !== "") {
        jobOptions.shell = this.shell;
      }

      const n = exec(job, jobOptions);
      this.pid = n.pid;

      console.log(`Process started with PID: ${n.pid}`);

      this.socketManager.emit(`job_started`, { taskID, data: n });
      n.stdout?.on("data", (chunk) => {
        this.socketManager.emit(`job_output`, { taskID, data: chunk });
      });

      n.stderr?.on("data", (chunk) => {
        this.socketManager.emit(`job_error`, { taskID, data: chunk });
      });

      n.on("close", (code, signal) => {
        this.socketManager.emit(`job_close`, {
          taskID,
          data: `Process with PID ${
            n.pid || "--"
          } closed with code ${code} by signal ${signal}`,
        });
      });

      n.on("exit", (code, signal) => {
        this.socketManager.emit(`job_exit`, {
          taskID,
          data: `Process with PID ${
            n.pid || "--"
          } exited with code ${code} by signal ${signal}`,
        });
      });
    } catch (error) {
      console.log(`Big Catch: ${error.message}`);
    }
  }

  public getPID() {
    return this.pid;
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public bindSocketManager(socketManager: SocketManager) {
    this.socketManager = socketManager;
    this.subscribeEvents();
  }

  /**
   * Kills a running task when user clicks on stop button on UI.
   *
   * @private
   * @param {*} taskID Room Id of the task. (This is actually the id of task)
   * @param {*} pid Process Id of the task. (Created by OS)
   * @memberof JobManager
   */
  private async killJob(taskID: string, pid: number): Promise<boolean> {
    console.log(`Killing process: ${pid}`);
    try {
      await fkill(pid, {
        force: true,
      });

      this.socketManager.emit(`job_killed`, {
        taskID,
        data: pid,
      });

      return true;
    } catch (error) {
      console.error(`Error killing process: ${pid}\n ${error.message}`);
      this.socketManager.emit(`job_error`, {
        taskID,
        data: `Error killing process: ${pid}.\n ${error.message}`,
      });
      return false;
    }
    // return new Promise((resolve, reject) => {
    // pKill(pid, (error) => {
    //   if (error) {
    //     return reject(error);
    //   }
    //   setTimeout(() => {
    //     return resolve(true);
    //   });
    // });
    // });
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
        taskID,
        projectPath,
        shell,
      }: {
        command: IProjectCommand;
        taskID: string;
        projectPath: string;
        shell: string;
      }) => {
        const process = new Job(taskID, shell, this.socketManager);
        process.start(command, projectPath);
      },
    };

    const jobKillSubscriber: ISocketListener = {
      event: "unsubscribe",
      callback: ({ taskID, pid }) => {
        this.killJob(taskID, pid);
      },
    };

    const jobRestartSubscriber: ISocketListener = {
      event: "restart",
      callback: ({
        command,
        taskID,
        pid,
        projectPath,
        shell,
      }: {
        command: IProjectCommand;
        taskID: string;
        pid: number;
        projectPath: string;
        shell: string;
      }) => {
        console.log(`Restart: ${taskID}, pid: ${pid}`);

        this.killJob(taskID, pid).then((isKilled) => {
          if (!isKilled) {
            throw new Error(`Did not kill pid: ${pid}`);
          }

          console.log(`Killed: ${taskID}, pid: ${pid}`);

          // Add delay as I've seen restart task button on sidebar not syncing state and leaving dangling processes which I had to kill from Task Manager.
          setTimeout(() => {
            const process = new Job(taskID, shell, this.socketManager);
            process.start(command, projectPath);
            console.log(`Started: ${taskID}, pid: ${process.getPID()}`);
          }, 1000);
        });
      },
    };

    this.socketManager.subscribe(jobStartSubscriber);
    this.socketManager.subscribe(jobKillSubscriber);
    this.socketManager.subscribe(jobRestartSubscriber);
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
