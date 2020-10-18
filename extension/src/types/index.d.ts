export interface IMessage {
  type: Messages;
  data: any;
}

interface Window {
  chrome: any;
  browser: any;
}

/// <reference types="react-scripts" />

type TaskViewStyle = "tabs" | "rows";

type TASK_SORT_ORDER = "name-asc" | "name-desc" | "last-executed" | "custom";

interface IConfig {
  port: string | number;
  shell: string;
  sendErrorReports?: boolean;
}

interface IMyTheme {
  theme: string;
  setTheme: any;
}

interface IProjectCommand {
  _id: string;
  lastExecutedAt: Date;
  shell?: string;
  [name: string]: any;
}

interface ISearchProjectCommand extends IProjectCommand {
  projectIndex: number;
  projectId: string;
  projectName: string;
}
interface IProject {
  _id: string;
  name: string;
  type: string;
  path: string;
  configFile?: string;
  commands: IProjectCommand[];
  taskSortOrder?: TASK_SORT_ORDER;
  shell?: string;
}

interface IJobAction {
  taskID: string;
  type: ACTION_TYPES;
  stdout?: string;
  state?: Record<string, unknown>;
  isRunning?: boolean;
  socketId?: string;
  process?: any;
}

interface IStateAction {
  type: ACTION_TYPES;
  state: Record<string, unknown>;
}

interface Window {
  tenHands: any;
}

interface ITenHandsFile {
  name: string;
  path?: string;
  data: string | ArrayBuffer | null;
}
