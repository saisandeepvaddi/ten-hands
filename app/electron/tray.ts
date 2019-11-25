import {
  Tray,
  Menu,
  app,
  BrowserWindow,
  nativeImage,
  NativeImage
} from "electron";
import path from "path";
import { setIsAppQuitting } from "./app-state";
import { openAndFocusWindow } from "./utils";

// This is the path after building TS
const iconPath = path.resolve(__dirname, "..", "tray-icon.png");

const icon: NativeImage = nativeImage
  .createFromPath(iconPath)
  .resize({ width: 16, height: 16 });

export let tray: Tray = null;

export function createTray(mainWindow: BrowserWindow): Tray {
  tray = new Tray(icon);
  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click() {
        openAndFocusWindow(mainWindow);
      }
    },
    {
      label: "Quit",
      click() {
        setIsAppQuitting(true);
        app.quit();
      }
    }
  ]);

  tray.on("double-click", () => openAndFocusWindow(mainWindow));
  tray.setToolTip("Ten Hands");
  tray.setContextMenu(trayContextMenu);

  return tray;
}
