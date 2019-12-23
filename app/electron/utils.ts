import { BrowserWindow } from "electron";
import { showMessage } from "./tray";
import { getConfig } from "../shared/config";

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
  if (getConfig()?.showAppRunningTrayMessage) {
    showMessage(
      "Ten Hands is still running. Exit it from tray to completely quit Ten Hands."
    );
  }
};
