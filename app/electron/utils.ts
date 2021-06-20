import { BrowserWindow, session } from "electron";
import { readdir } from "fs";
import { join } from "path";

import { getConfig } from "../shared/config";
import { showMessage } from "./tray";

export const openAndFocusWindow = (mainWindow: BrowserWindow) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
    mainWindow.focus();
  }
};

export const hideWindowToTray = (mainWindow: BrowserWindow) => {
  console.info("Hiding app to tray.");
  mainWindow.hide();
  if (getConfig()?.showAppRunningTrayNotification) {
    showMessage(
      "Ten Hands is still running. Exit it from tray to completely quit Ten Hands."
    );
  }
};

export const loadReactDevTools = () => {
  return new Promise((resolve, reject) => {
    const reactDevToolsFolder = join(
      require("os").homedir(),
      "\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi"
    );

    // Read directory instead of hard-coding version number in path because of new React DevTools releases.
    readdir(reactDevToolsFolder, async (err, files) => {
      if (err || !files?.[0]) {
        console.error("Failed to load react-dev-tools");
        return reject(false);
      }
      const reactDevToolsPath = join(reactDevToolsFolder, files[0]);
      await session.defaultSession.loadExtension(reactDevToolsPath);
      return resolve(true);
    });
  });
};
