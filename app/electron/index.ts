process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const electron = require("electron");
const { BrowserWindow, ipcMain, app, dialog } = electron;

const path = require("path");
const isDev = require("electron-is-dev");

import { startServer } from "../server";
import { createMenu, menuTemplate, getMenu } from "./menu";
import { getConfig } from "../shared/config";

const isWindows = process.platform === "win32";

export let mainWindow;

const singleInstanceLock = app.requestSingleInstanceLock();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    frame: isWindows ? false : true,
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
    const config: IConfig = require("../shared/config").default;
    console.log("config:", config);

    await startServer();

    app.on("ready", () => {
      createWindow();
      if (!isWindows) {
        createMenu();
      }
    });

    ipcMain.on(`get-config`, e => {
      e.returnValue = getConfig();
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

    app.on("before-quit", e => {
      const response = dialog.showMessageBox({
        type: "info",
        title: "Warning",
        message: "Are you sure you want to exit?",
        detail: "Any running tasks will keep running.",
        buttons: ["Cancel", "Exit"]
      });

      // Cancel = 0
      // Exit = 1
      if (response !== 1) {
        e.preventDefault();
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

    ipcMain.on(`display-app-menu`, (e, args) => {
      if (isWindows) {
        const appMenu = getMenu();
        if (mainWindow) {
          appMenu.popup({ window: mainWindow, x: args.x, y: args.y });
        }
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
