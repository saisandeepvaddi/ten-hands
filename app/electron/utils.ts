import { BrowserWindow } from "electron";
import { showMessage } from "./tray";
import { getConfig } from "../shared/config";
import { join } from "path";

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
  const reactDevToolsPath = join(
    require("os").homedir(),
    "\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\4.7.0_0"
  );
  require("fs").access(reactDevToolsPath, (error: Error) => {
    if (error) {
      console.error("failed to load react dev-tools error:", error);
      return;
    }
    BrowserWindow.addDevToolsExtension(reactDevToolsPath);
  });
};
