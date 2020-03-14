import { ipcMain, shell } from "electron";
import { getConfig } from "../shared/config";
import { getAppUpdate } from "./updates";

export default function registerIPC() {
  ipcMain.on(`get-config`, e => {
    e.returnValue = getConfig();
  });

  ipcMain.on("get-updates", async e => {
    try {
      e.returnValue = await getAppUpdate();
    } catch (error) {
      console.log("error:", error);
      e.returnValue = null;
    }
  });

  ipcMain.on("open-downloads-page", e => {
    shell.openExternal("https://github.com/saisandeepvaddi/ten-hands/releases");
    e.returnValue = null;
  });
}
