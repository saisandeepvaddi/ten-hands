process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const electron = require("electron");
const { BrowserWindow, ipcMain, app, dialog } = electron;

const path = require("path");
const isDev = require("electron-is-dev");

import { startServer } from "../server";
import { createMenu, getMenu } from "./menu";
import { getConfig } from "../shared/config";
import { log } from "./logger";

const isWindows = process.platform === "win32";

export let mainWindow;

const singleInstanceLock = app.requestSingleInstanceLock();

function createWindow() {
  try {
    mainWindow = new BrowserWindow({
      width: 1366,
      height: 768,
      frame: isWindows ? false : true,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    if (isDev) {
      mainWindow.webContents.openDevTools();
    }

    const uiUrl = isDev
      ? "http://localhost:3010"
      : `file://${path.join(__dirname, "../ui/index.html")}`;
    log.info("uiUrl:" + uiUrl);
    mainWindow.loadURL(uiUrl);

    mainWindow.on("closed", () => {
      log.info("Window Closing");
      mainWindow = null;
    });
    return mainWindow;
  } catch (error) {
    console.log("error:", error);
    log.error("createWindow Error: ", error.message);
  }
}

async function startApplication() {
  try {
    const config: IConfig = getConfig();
    console.log("config:", config);
    log.info(`config: ${JSON.stringify(config, null, 2)}`);

    await startServer();

    app.on("ready", () => {
      createWindow();
      log.info("Window Created in app.ready");
      if (!isWindows) {
        try {
          log.info("Creating Menu");
          createMenu();
        } catch (error) {
          console.log("error:", error);
          log.error("app.ready error: " + error.message);
        }
      }
    });

    ipcMain.on(`get-config`, e => {
      e.returnValue = getConfig();
    });

    app.on("second-instance", () => {
      console.log("Requesting second instance. Deny it");
      log.warn("Requesting second instance. Deny it");

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
      const response = dialog.showMessageBoxSync({
        type: "info",
        title: "Warning",
        message: "Are you sure you want to exit?",
        detail: "Any running tasks will keep running.",
        buttons: ["Cancel", "Exit"],
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
  log.error("Quitting instance because of single instance lock.");
} else {
  console.log("starting app");
  log.info("Starting app");
  startApplication();
}
