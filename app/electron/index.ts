process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
import * as SentryElectron from "@sentry/electron";
import { BrowserWindow, ipcMain, app, dialog, crashReporter } from "electron";
const unhandled = require("electron-unhandled");
unhandled();

const path = require("path");
const isDev = require("electron-is-dev");
import windowStateKeeper from "electron-window-state";

import { startServer } from "../server";
import { createMenu, getMenu } from "./menu";
import { getConfig } from "../shared/config";
import { logger } from "./logger";

import { createTray } from "./tray";
import { isAppQuitting, setIsAppQuitting } from "./app-state";
import {
  registerGlobalShortcuts,
  unregisterGlobalShortcuts,
} from "./global-hot-keys";
import { hideWindowToTray, loadReactDevTools } from "./utils";
import registerIPC from "./ipc";
import db from "../server/services/db";

if (getConfig().sendErrorReports) {
  SentryElectron.init({
    dsn:
      "https://885a9f7ca5304d6087e9ab08502d297a@o443842.ingest.sentry.io/5418372",
    beforeSend(event) {
      // Modify the event here
      if (event.user) {
        // Don't send user's email address
        delete event.user.email;
        delete event.user.ip_address;
      }
      return event;
    },
  });
}

crashReporter.start({
  companyName: "ten-hands",
  productName: "ten-hands",
  ignoreSystemCrashHandler: true,
  submitURL:
    "https://885a9f7ca5304d6087e9ab08502d297a@o443842.ingest.sentry.io/5418372",
});

const isWindows = process.platform === "win32";
export let mainWindow: BrowserWindow | null;

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

const singleInstanceLock = app.requestSingleInstanceLock();

function createWindow() {
  try {
    let mainWindowState = windowStateKeeper({
      defaultWidth: 1366,
      defaultHeight: 768,
    });
    mainWindow = new BrowserWindow({
      width: mainWindowState.width,
      height: mainWindowState.height,
      x: mainWindowState.x,
      y: mainWindowState.y,
      frame: isWindows ? false : true,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    const uiUrl = isDev
      ? "http://localhost:3010"
      : `file://${path.join(__dirname, "../ui/index.html")}`;

    mainWindow.loadURL(uiUrl);

    if (isDev) {
      loadReactDevTools();
      // mainWindow.webContents.openDevTools();
    }
    mainWindow.on("closed", () => {
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

    mainWindowState.manage(mainWindow);
    return mainWindow;
  } catch (error) {
    logger.error("createWindow Error: " + error.message);
    SentryElectron.captureException(error);
  }
}

async function startApplication() {
  try {
    try {
      await startServer();
    } catch (error) {
      console.log("error:", error);
      logger.error("failed to start server: " + error.message);
      SentryElectron.captureException(error);
    }

    app.on("ready", () => {
      createWindow();
      registerGlobalShortcuts();
      if (!isWindows) {
        try {
          createMenu();
        } catch (error) {
          console.log("error:", error);
          logger.error("app.ready error: " + error.message);
          SentryElectron.captureException(error);
        }
      }
      if (mainWindow) {
        createTray(mainWindow);
        registerIPC(mainWindow);
      }
    });

    app.on("second-instance", () => {
      console.log("Requesting second instance. Deny it");
      logger.warn("Requesting second instance. Deny it");

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
    logger.error("startApplication error: " + error.message);
    SentryElectron.captureException(error);
  }
}

/* Makes app a single instance application */
if (!singleInstanceLock) {
  app.quit();
  logger.error("Quitting instance because of single instance lock.");
} else {
  console.log("starting app");
  logger.info("Starting app");
  startApplication();
}
