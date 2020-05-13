interface IProjectCommand {
  _id: string;
  execDir: string;
  lastExecutedAt: Date;
  shell: string;

  [name: string]: any;
}

type TASK_SORT_ORDER = "name-asc" | "name-desc" | "last-executed" | "custom";

interface IProject {
  _id: string;
  name: string;
  type: string;
  path: string;
  commands: IProjectCommand[];
  taskSortOrder?: TASK_SORT_ORDER;
  shell?: string;
}

declare enum JobStatus {
  RUNNING,
  STOPPED,
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
