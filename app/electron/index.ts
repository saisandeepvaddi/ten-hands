import "./prestart";
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
  console.log(path.join(__dirname, "../build/index.html"));

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../../ui/build/index.html")}`
  );
  if (isDev) {
    // Open the DevTools.
    // BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
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
