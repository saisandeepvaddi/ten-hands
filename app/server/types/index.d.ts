interface IProjectCommand {
  _id: string;
  execDir: string;
  [name: string]: string;
}

interface IProject {
  _id: string;
  name: string;
  type: string;
  path: string;
  commands: IProjectCommand[];
}

declare enum JobStatus {
  RUNNING,
  STOPPED
}

interface IJob {
  _id: string;
  createdAt: Date;
  pid: number;
  status: JobStatus;
  command: IProjectCommand;
  start(): number; // returns pid
  kill(): number;
}

declare module "fix-path" {
  export default function _(): any;
}
