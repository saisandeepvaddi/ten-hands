import { v4 as uuid } from "uuid";
import execa from "execa";
import pKill from "tree-kill";

class Job implements IJob {
  _id?: string;
  pid: number;
  status: JobStatus;
  command: IProjectCommand;
  createdAt: Date;
  socket: any;
  constructor(command: IProjectCommand) {
    // Pass a command to create Job
    this._id = uuid();
    this.command = command;
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
