process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

import { BrowserWindow, ipcMain, app, dialog } from "electron";
const unhandled = require("electron-unhandled");
unhandled();

const path = require("path");
const isDev = require("electron-is-dev");

import { startServer } from "../server";
import { createMenu, getMenu } from "./menu";
import { getConfig } from "../shared/config";
import { log } from "./logger";

import { createTray } from "./tray";
import { isAppQuitting, setIsAppQuitting } from "./app-state";
import {
  registerGlobalShortcuts,
  unregisterGlobalShortcuts,
} from "./global-hot-keys";
import { hideWindowToTray, loadReactDevTools } from "./utils";
import registerIPC from "./ipc";
import db from "../server/services/db";

const isWindows = process.platform === "win32";
export let mainWindow: BrowserWindow | null;

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

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
      loadReactDevTools();
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

    mainWindow.on("close", (e) => {
      if (!isAppQuitting()) {
        e.preventDefault();
        if (mainWindow) {
          if (getConfig().hideToTrayOnClose) {
            hideWindowToTray(mainWindow);
          } else {
            setIsAppQuitting(true);
            app.quit();
          }
        }
        e.returnValue = false;
      }
    });

    return mainWindow;
  } catch (error) {
    console.log("error:", error);
    log.error("createWindow Error: " + error.message);
  }
}

async function startApplication() {
  try {
    const config: IConfig = getConfig();
    console.log("config:", config);
    log.info(`config: ${JSON.stringify(config)}`);

    try {
      await startServer();
    } catch (error) {
      console.log("error:", error);
      log.error("failed to start server: " + error.message);
    }

    log.info("Server Started");

    app.on("ready", () => {
      log.info("app.on.ready called");
      createWindow();
      registerGlobalShortcuts();
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
      if (mainWindow) {
        createTray(mainWindow);
      }
    });

    registerIPC();

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

    app.on("before-quit", (e) => {
      log.info("App before-quit");
      const runningProcesses = db.getRunningTaskCount();
      console.log("runningProcesses:", runningProcesses);
      if (runningProcesses > 0) {
        const response = dialog.showMessageBoxSync({
          type: "warning",
          title: "Warning",
          message: "Are you sure you want to exit?",
          detail: `${runningProcesses} ${
            runningProcesses === 1 ? "task is" : "tasks are"
          } still running. Running tasks will keep running and consume resources.`,
          buttons: ["Cancel", "Exit"],
        });

        // Cancel = 0
        // Exit = 1
        if (response !== 1) {
          setIsAppQuitting(false);
          e.preventDefault();
        }
      }
    });

    app.on("will-quit", () => {
      unregisterGlobalShortcuts();
    });

    app.on("activate", () => {
      if (mainWindow === null) {
        log.info("app.on.activate");
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
    log.error("startApplication error: " + error.message);
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
