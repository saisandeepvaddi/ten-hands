import { shell, dialog } from "electron";
import { join, basename, dirname } from "path";
import { existsSync, readFile } from "fs";
import { getMenu } from "./menu";
import { getConfig } from "../shared/config";
import { Badge } from "./badge/badge";
import { getAppUpdate } from "./updates";

const isWindows = process.platform === "win32";

export interface IElectronPreload {
  openExternal: any;
  hasYarnLock: any;
  openInExplorer: any;
  openAppMenu: any;
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
}

declare global {
  interface Window {
    electronPreload: IElectronPreload;
  }
}

const { remote, ipcRenderer } = require("electron");

let badge: Badge;

function getCurrentWindow() {
  return remote.getCurrentWindow();
}
function initializeElectronFunctions() {
  badge = badge ?? new Badge(getCurrentWindow());
}

function minimizeWindow(browserWindow = getCurrentWindow()) {
  if (browserWindow.minimizable) {
    // browserWindow.isMinimizable() for old electron versions
    browserWindow.minimize();
  }
}

function maximizeWindow(browserWindow = getCurrentWindow()) {
  if (browserWindow.maximizable) {
    // browserWindow.isMaximizable() for old electron versions
    browserWindow.maximize();
  }
}

function unmaximizeWindow(browserWindow = getCurrentWindow()) {
  browserWindow.unmaximize();
}

function maxUnmaxWindow(browserWindow = getCurrentWindow()) {
  if (browserWindow.isMaximized()) {
    browserWindow.unmaximize();
  } else {
    browserWindow.maximize();
  }
}

function closeWindow(browserWindow = getCurrentWindow()) {
  browserWindow.close();
}

function isWindowMaximized(browserWindow = getCurrentWindow()) {
  return browserWindow.isMaximized();
}

function openExternal(uri: string) {
  shell.openExternal(uri);
}

function openInExplorer(uri: string) {
  shell.openPath(uri);
}

function openAppMenu({ x, y }: { x: number; y: number }) {
  if (isWindows) {
    const appMenu = getMenu();
    const mainWindow = getCurrentWindow();
    if (mainWindow) {
      appMenu.popup({ window: mainWindow, x, y });
    }
  }
}

function hasYarnLock(filePath: string) {
  if (existsSync(join(filePath, "yarn.lock"))) {
    // yarn.lock exists
    return true;
  }

  return false;
}

function isMaximized() {
  return remote.getCurrentWindow().isMaximized();
}

function getPathBasename(filePath: string) {
  return basename(filePath);
}

function getPathDirname(filePath: string) {
  return dirname(filePath);
}

function readFileAsync(
  path: string,
  enc: "utf",
  cb: (err: any, fileData: any) => any
) {
  return readFile(path, enc, cb);
}

function getConfigFileFromDialog() {
  return new Promise((res, rej) => {
    try {
      dialog
        .showOpenDialog({
          filters: [{ name: "package.json", extensions: ["json"] }],
        })
        .then(({ filePaths }) => {
          const configFilePath: string | undefined =
            filePaths && filePaths.length > 0 ? filePaths[0] : undefined;
          if (configFilePath === undefined) {
            console.log("No file uploaded");
            return null;
          }
          require("fs").readFile(
            configFilePath,
            "utf-8",
            (err: any, fileData: any) => {
              if (err) {
                throw new Error("Error reading config file");
              }
              return res({ configFilePath, fileData });
            }
          );
        });
    } catch (error) {
      console.log("error:", error);
      return rej(null);
    }
  });
}

function getServerConfig() {
  return getConfig();
}

function updateTaskCount(count: number) {
  if (getConfig().showTaskCountBadge) {
    badge?.update(count);
  }
}
async function getAppUpdates() {
  try {
    return await getAppUpdate();
  } catch (error) {
    console.error("error getting updates: ", error);
    return null;
  }
}

const electronPreload: IElectronPreload = {
  openExternal,
  hasYarnLock,
  openInExplorer,
  openAppMenu,
  isMaximized,
  minimizeWindow,
  maximizeWindow,
  unmaximizeWindow,
  maxUnmaxWindow,
  closeWindow,
  isWindowMaximized,
  getPathBasename,
  getPathDirname,
  readFileAsync,
  getServerConfig,
  initializeElectronFunctions,
  getConfigFileFromDialog,
  updateTaskCount,
  getAppUpdates,
};

window.addEventListener("DOMContentLoaded", () => {
  window.electronPreload = electronPreload;
});
