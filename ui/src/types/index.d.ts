/// <reference types="react-scripts" />

type TaskViewStyle = "tabs" | "rows";

type TASK_SORT_ORDER = "name" | "last-executed";

interface IConfig {
  port: string | number;
  enableTerminalTheme: boolean;
  showStatusBar: boolean;
  taskViewStyle: TaskViewStyle;
}

interface IMyTheme {
  theme: string;
  setTheme: any;
}

interface IProjectCommand {
  _id: string;
  lastExecutedAt: Date;
  [name: string]: any;
}

interface IProject {
  _id: string;
  name: string;
  type: string;
  path: string;
  configFile?: string;
  commands: IProjectCommand[];
  taskSortOrder?: TASK_SORT_ORDER;
}

interface IJobAction {
  room: string;
  type: ACTION_TYPES;
  stdout?: string;
  state?: object;
  isRunning?: boolean;
  socketId?: string;
  process?: any;
}

interface IStateAction {
  type: ACTION_TYPES;
  state: object;
}

interface Window {
  tenHands: any;
}

interface ITenHandsFile {
  name: string;
  path?: string;
  data: string | ArrayBuffer | null;
}
