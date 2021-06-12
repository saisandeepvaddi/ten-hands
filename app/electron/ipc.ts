import { captureException } from "@sentry/electron";
import { BrowserWindow, ipcMain, shell } from "electron";

import { getConfig } from "../shared/config";
import { Badge } from "./badge/badge";
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
}
