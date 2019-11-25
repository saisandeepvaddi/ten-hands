import { getConfig } from "../shared/config";
import { globalShortcut, BrowserWindow } from "electron";
import { getMainWindow } from ".";
import { openAndFocusWindow } from "./utils";

const config: IConfig = getConfig();

export const registerGlobalShortcuts = () => {
  try {
    if (config.globalHotKey && config.globalHotKey !== "") {
      const ret = globalShortcut.register(config.globalHotKey, () => {
        console.log(`Global Hot Key: ${config.globalHotKey} pressed.`);
        const mainWindow: BrowserWindow = getMainWindow();
        if (
          mainWindow &&
          (mainWindow.isMinimized() || !mainWindow.isVisible())
        ) {
          openAndFocusWindow(mainWindow);
        } else {
          mainWindow.hide();
        }
      });

      if (!ret) {
        console.log(
          `Registering Global Hot Key: ${config.globalHotKey} failed.`
        );
      } else {
        console.log(`Global Hot Key: ${config.globalHotKey} registered.`);
      }
    }
  } catch (error) {
    console.log("Unable to register global hot key: ", error.message);
  }
};

export const unregisterGlobalShortcuts = () => {
  globalShortcut.unregisterAll();
};
