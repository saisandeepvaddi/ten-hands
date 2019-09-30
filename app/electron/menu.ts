import { CONFIG_FILES } from "../shared/config";
import {
  getAppUpdate,
  showUpdateAvailableMessage,
  showUpdateNotAvailableMessage,
  showUnableToCheckUpdatesMessage
} from "./updates";
import { MenuItem } from "electron";

const { app, Menu, shell } = require("electron");

const isMac = process.platform === "darwin";

const editMenu: MenuItem = new MenuItem({
  label: "Edit",
  submenu: [
    {
      label: "Configuration",
      click() {
        shell.openItem(CONFIG_FILES.configFile);
      }
    }
  ]
});

const viewMenu: MenuItem = new MenuItem({
  label: "View"
});

const helpMenu: MenuItem = new MenuItem({
  label: "Help",
  submenu: [
    {
      label: "Learn More",
      click() {
        shell.openExternalSync("https://github.com/saisandeepvaddi/ten-hands");
      }
    },
    {
      label: "Check for Updates",
      async click() {
        try {
          const update = await getAppUpdate();
          if (update && !update.prerelease) {
            showUpdateAvailableMessage();
          } else {
            showUpdateNotAvailableMessage();
          }
        } catch (error) {
          console.log("error:", error);
          showUnableToCheckUpdatesMessage();
        }
      }
    }
  ]
});

const commonMenu: MenuItem[] = [editMenu, viewMenu, helpMenu];

const macMenu: MenuItem[] = [
  new MenuItem({
    label: app.getName(),
    submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }]
  }),
  ...commonMenu
];

const winMenu: MenuItem[] = [
  new MenuItem({
    label: "File",
    submenu: [{ role: "quit" }]
  }),
  ...commonMenu
];

export const menuTemplate: MenuItem[] = isMac ? macMenu : winMenu;

export const getMenu = () => {
  // return Menu.buildFromTemplate(menuTemplate);
};

export const createMenu = () => {
  // const appMenu = getMenu();
  // Menu.setApplicationMenu(appMenu);
};
