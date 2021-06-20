import { captureException } from "@sentry/electron";
import { BrowserWindow, globalShortcut } from "electron";

import { getConfig } from "../shared/config";
import { getMainWindow } from ".";
import { hideWindowToTray, openAndFocusWindow } from "./utils";

const config: IConfig = getConfig();

export const registerGlobalShortcuts = () => {
  try {
    if (config.globalHotKey && config.globalHotKey !== "") {
      const ret = globalShortcut.register(config.globalHotKey, () => {
        console.log(`Global Hot Key: ${config.globalHotKey} pressed.`);
        const mainWindow: BrowserWindow | null = getMainWindow();

        if (!mainWindow) {
          return;
        }

        if (mainWindow.isMinimized() || !mainWindow.isVisible()) {
          openAndFocusWindow(mainWindow);
        } else {
          hideWindowToTray(mainWindow);
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
    captureException(error);
    console.log("Unable to register global hot key: ", error.message);
  }
};

export const unregisterGlobalShortcuts = () => {
  globalShortcut.unregisterAll();
};
