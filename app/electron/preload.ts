// import { captureException } from "@sentry/electron";
import {  contextBridge, ipcRenderer, shell } from "electron";


// import { Badge } from "./badge/badge";
// import { getAppUpdate } from "./updates";
// const remote = require("@electron/remote");

console.log("Loading preload script.");



const displayAppMenu = (x: number, y: number) => {
  ipcRenderer.sendSync(`display-app-menu`, {
    x,
    y,
  });
};

const openWeblink = (uri: string) => shell.openExternal(uri);
const getAppConfig = () => ipcRenderer.sendSync('get-config');

const updateTaskCount = (count: number) => {
  ipcRenderer.sendSync('update-task-count', count)
};

const getUpdates = () => ipcRenderer.sendSync('get-updates');

const exposedAPI = {
  desktop: true,
  getCurrentWindowState: () => ipcRenderer.sendSync('get-current-window-state'),
  changeCurrentWindowState: (state: string) => ipcRenderer.sendSync('change-current-window-state', state),
  displayAppMenu,
  uploadAndReadPackageJSON: () => ipcRenderer.sendSync('upload-read-package-json'),
  openWeblink,
  getAppConfig,
  updateTaskCount,
  getUpdates,
  readUploadedConfigFile: (filePath: string) => ipcRenderer.sendSync('read-uploaded-config-file', filePath),
  createTenHandsConfigFile: (filePath: string, fileData: any) => ipcRenderer.sendSync('create-ten-hands-config-file', {filePath, fileData})
};

console.log('exposedAPI:', exposedAPI);

contextBridge.exposeInMainWorld("desktop", exposedAPI);

// (window as any).desktop = exposedAPI;
