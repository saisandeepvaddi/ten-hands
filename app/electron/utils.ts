import { BrowserWindow } from "electron";

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
