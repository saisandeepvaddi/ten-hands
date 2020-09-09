import { ipcMain, shell, BrowserWindow } from "electron";
import { getConfig } from "../shared/config";
import { getAppUpdate } from "./updates";
import { Badge } from "./badge/badge";
import { captureException } from "@sentry/electron";

export default function registerIPC(mainWindow: BrowserWindow) {
  let badge = new Badge(mainWindow);
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
