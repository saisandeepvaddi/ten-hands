const electron = require("electron");
const { BrowserWindow } = electron;
const app = electron.app;

const path = require("path");
const isDev = require("electron-is-dev");

import { startServer } from "../server";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const uiUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../ui/index.html")}`;
  mainWindow.loadURL(uiUrl);

  mainWindow.on("closed", () => (mainWindow = null));
  return mainWindow;
}

async function startElectronApp() {
  try {
    await startServer();

    app.on("ready", createWindow);

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

startElectronApp();
