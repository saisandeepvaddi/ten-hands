interface IProjectCommand {
  _id?: string;
  [name: string]: string;
}

interface IProject {
  _id?: string;
  name: string;
  type: string;
  path: string;
  commands: IProjectCommand[];
}

type Job = {
  _id?: string;
  name: string; //projectname-commandname
  pid: number; // Process Id once the process is started

  // The following is same as in IProject
  type: string;
  path: string;
};

interface IJob {
  _id?: string;
  name: string;
  pid: number;
  type: string;
  path: string;
  createdAt: Date;
  start(): number; // returns pid
  kill(): boolean;
}
