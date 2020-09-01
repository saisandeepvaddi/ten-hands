/// <reference types="react-scripts" />

type TaskViewStyle = "tabs" | "rows";

type TASK_SORT_ORDER = "name-asc" | "name-desc" | "last-executed" | "custom";

interface IConfig {
  port: string | number;
  enableTerminalTheme: boolean;
  showStatusBar: boolean;
  taskViewStyle: TaskViewStyle;
  shell: string;
  terminalRenderer?: "canvas" | "webgl";
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
  room: string;
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

interface ITenHandsFile {
  name: string;
  path?: string;
  data: string | ArrayBuffer | null;
}

export interface IElectronPreload {
  openExternal: any;
  hasYarnLock: any;
  openInExplorer: any;
  displayAppMenu: any;
  isMaximized: any;
  minimizeWindow: any;
  maximizeWindow: any;
  unmaximizeWindow: any;
  maxUnmaxWindow: any;
  closeWindow: any;
  isWindowMaximized: any;
  getPathBasename: any;
  getPathDirname: any;
  readFileAsync: any;
  getServerConfig: any;
  initializeElectronFunctions: any;
  getConfigFileFromDialog: any;
  updateTaskCount: any;
  getAppUpdates: any;
  openAppMenu: any;
}

declare global {
  interface Window {
    tenHands: any;
    electronPreload: IElectronPreload;
  }
}
