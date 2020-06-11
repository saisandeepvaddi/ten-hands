import SocketManager from "./socket";
import path from "path";
import * as pty from "node-pty";
// const pty = require("node-pty");
import { platform } from "os";

export class PTY {
  socketManager: SocketManager;
  private room: any;
  private shell: string;
  private ptyProcess: pty.IPty;
  constructor(room: string, shell: string, socketManager: SocketManager) {
    this.room = room;
    this.shell = shell;
    this.socketManager = socketManager;
  }

  public start(command: IProjectCommand, projectPath: string) {
    try {
      const job = command.cmd;
      const execPath =
        command.execDir.length > 0
          ? path.resolve(command.execDir)
          : path.resolve(projectPath);

      const room = this.room;

      let env: { [key: string]: string } = {};
      Object.entries(process.env).forEach(([key, value]) => {
        if (value) {
          env[key] = value;
        }
      });

      const shell = this.getShell();
      console.log("shell:", shell);

      this.ptyProcess = pty.spawn(this.getShell(), [], {
        name: job,
        cwd: execPath || process.cwd(),
        env,
      });

      this.ptyProcess.onData((data) => {
        this.socketManager.emit("job_output", { room, data });
      });

      this.ptyProcess.onExit(({ exitCode, signal }) => {
        console.log("exitCode:", exitCode);
        this.socketManager.emit(`job_exit`, {
          room,
          data: `Process with PID ${this.ptyProcess.pid ||
            "--"} closed with code ${exitCode} ${
            signal ? "by signal" + signal : ""
          }.`,
        });
      });

      this.ptyProcess.write(`${job}\r`);
      this.socketManager.emit("job_started", {
        room,
        data: {
          pid: this.ptyProcess.pid,
        },
      });

      console.log("execPath:", execPath);
    } catch (error) {
      console.log("PTY start error:", error.message);
    }
  }

  public write(data: string) {
    this.ptyProcess.write(data);
  }

  private getShell(): string {
    const _shell =
      this.shell && this.shell !== ""
        ? this.shell
        : platform() === "win32"
        ? "cmd.exe"
        : "bash";
    return _shell;
  }
}
