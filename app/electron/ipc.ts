import { captureException } from "@sentry/electron";
import { BrowserWindow, ipcMain, shell } from "electron";

import { getConfig } from "../shared/config";
import { Badge } from "./badge/badge";
import { createTenHandsConfigFile, readUploadedConfigFile, uploadAndReadPackageJSON } from "./renderer-node-utils";
import { getAppUpdate } from "./updates";

export default function registerIPC(mainWindow: BrowserWindow) {
  const badge = new Badge(mainWindow);
  ipcMain.on(`get-config`, (e) => {
    e.returnValue = getConfig();
  });

  ipcMain.on("get-updates", async (e) => {
    try {
      e.returnValue = await getAppUpdate();
    } catch (error) {
      console.error("error:", error);
      captureException(error);
      e.returnValue = null;
    }
  });

  ipcMain.on("update-task-count", (e, count) => {
    if (getConfig().showTaskCountBadge) {
      badge?.update(count);
    }
    e.returnValue = null;
  });

  ipcMain.on("open-downloads-page", (e) => {
    shell.openExternal("https://github.com/saisandeepvaddi/ten-hands/releases");
    e.returnValue = null;
  });

  ipcMain.on("upload-read-package-json", async (e) => {
    
    e.returnValue = await uploadAndReadPackageJSON();
  })

  ipcMain.on("read-uploaded-config-file", async (e, filePath) => {
    
    e.returnValue = await readUploadedConfigFile(filePath);
  })

  ipcMain.on("create-ten-hands-config-file", (e, {filePath, fileData}) => {
    
    e.returnValue = createTenHandsConfigFile(filePath, fileData);
  })

  ipcMain.on("get-current-window-state", (e) => {
    e.returnValue = {
      isMaximized: BrowserWindow.getFocusedWindow()?.isMaximized() ?? false,
      isMinimizable: BrowserWindow.getFocusedWindow()?.isMinimizable() ?? false
    }
  })

  ipcMain.on("change-current-window-state", (e, action) => {
    switch (action) {
      case 'minimize':
        {
          BrowserWindow.getFocusedWindow()?.minimize();
          e.returnValue = null;
          return;
        }
      case 'maximize':
        {
          BrowserWindow.getFocusedWindow()?.maximize();
          e.returnValue = null;
          return;
        }
        case 'unmaximize': {
          BrowserWindow.getFocusedWindow()?.unmaximize();
          e.returnValue = null;
          return;
        }
        case 'close': {
          BrowserWindow.getFocusedWindow()?.close()
          e.returnValue = null;
          return;
        }
        default: {
          e.returnValue = null;
        }
    }
    
  })


}
