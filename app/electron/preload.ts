import { captureException } from "@sentry/electron";
import {  ipcRenderer, shell } from "electron";
import path from "path";

import { getConfig } from "../shared/config";
import { Badge } from "./badge/badge";
import { getAppUpdate } from "./updates";
const remote = require("@electron/remote");

console.log("Loading preload script.");

const uploadAndReadPackageJSON = () => {
  return new Promise((resolve, reject) => {
    try {
      remote.dialog
        .showOpenDialog({
          filters: [{ name: "package.json", extensions: ["json"] }],
        })
        .then(({ filePaths }: { filePaths: any }) => {
          const filePath: string | undefined =
            filePaths && filePaths.length > 0 ? filePaths[0] : undefined;
          if (filePath === undefined) {
            console.log("No file uploaded");
            return null;
          }
          require("fs").readFile(
            filePath,
            "utf-8",
            (err: any, fileData: any) => {
              if (err) {
                throw new Error("Error reading config file");
              }
              resolve({
                filePath,
                fileData,
              });
            },
          );
        });
    } catch (error) {
      console.log("error:", error);
      reject(error);
      return null;
    }
  });
};

const createTenHandsConfigFile = (filePath: string, fileData: any) => {
  const fileName = path.basename(filePath);
  const projectPath = path.dirname(filePath);

  const tenHandsFile = {
    name: fileName,
    path: projectPath,
    data: fileData,
  };

  return tenHandsFile;
};

const readUploadedConfigFile = async (filePath: string) => {
  return new Promise((resolve) => {
    require("fs").readFile(filePath, "utf8", (err: Error, fileData: any) => {
      if (err) {
        throw new Error("Error reading config file.");
      }

      const tenHandsFile = createTenHandsConfigFile(filePath, fileData);

      resolve(tenHandsFile);
    });
  });
};

const displayAppMenu = (x: number, y: number) => {
  ipcRenderer.send(`display-app-menu`, {
    x,
    y,
  });
};

const openWeblink = (uri: string) => shell.openExternal(uri);
const getAppConfig = () => getConfig();

const updateTaskCount = (count: number) => {
  const badge = new Badge(remote.getCurrentWindow());
  if (getConfig().showTaskCountBadge) {
    badge?.update(count);
  }
};

const getUpdates = async () => {
  try {
    return await getAppUpdate();
  } catch (error) {
    console.error("error:", error);
    captureException(error);
    return null;
  }
};

const exposedAPI = {
  desktop: true,
  getCurrentWindowData: () => {
    const currentBrowserWindow = remote.getCurrentWindow();
    const currentWindow = {
      isMaximized: currentBrowserWindow.isMaximized,
      isMinimazable: currentBrowserWindow.isMinimizable,
      minimize: currentBrowserWindow.minimize,
      unmaximize: currentBrowserWindow.unmaximize,
      close: currentBrowserWindow.close,
    };
    return currentWindow;
  },
  displayAppMenu,
  uploadAndReadPackageJSON,
  openWeblink,
  getAppConfig,
  updateTaskCount,
  getUpdates,
  readUploadedConfigFile,
  createTenHandsConfigFile,
};

console.log('exposedAPI:', exposedAPI);

// contextBridge.exposeInMainWorld("desktop", exposedAPI);

(window as any).desktop = exposedAPI;
