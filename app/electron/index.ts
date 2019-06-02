const electron = require("electron");
const { BrowserWindow, ipcMain } = electron;
const app = electron.app;

const path = require("path");
const isDev = require("electron-is-dev");

import { startServer } from "../server";

let mainWindow;

const singleInstanceLock = app.requestSingleInstanceLock();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  const uiUrl = isDev
    ? "http://localhost:3010"
    : `file://${path.join(__dirname, "../ui/index.html")}`;
  mainWindow.loadURL(uiUrl);

  mainWindow.on("closed", () => (mainWindow = null));
  return mainWindow;
}

async function startApplication() {
  try {
    await startServer();

    app.on("ready", createWindow);

    ipcMain.on(`config-file-drop`, (e, msg) => {
      console.log(msg);
    });

    ipcMain.on(`get-config`, e => {
      e.returnValue = require("../shared/config").default;
    });

    app.on("second-instance", (event, commandLine, workingDirectory) => {
      console.log("Requesting second instance. Deny it");

      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        if (!mainWindow.isVisible()) {
          mainWindow.show();
        }
        mainWindow.focus();
      }
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("activate", () => {
      if (mainWindow === null) {
        createWindow();
      }
    });
  } catch (error) {
    console.log("error:", error);
  }
}

/* Makes app a single instance application */
if (!singleInstanceLock) {
  app.quit();
} else {
  console.log("starting app");

  startApplication();
}
