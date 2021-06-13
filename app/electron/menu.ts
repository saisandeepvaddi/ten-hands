import { captureException } from "@sentry/electron";
import { app, dialog, Menu, MenuItem , shell } from "electron";

import { CONFIG_FILES } from "../shared/config";
import { logger } from "./logger";
import {
  getAppUpdate,
  showUnableToCheckUpdatesMessage,
  showUpdateAvailableMessage,
  showUpdateNotAvailableMessage,
} from "./updates";

const isMac = process.platform === "darwin";

const editMenu: MenuItem = new MenuItem({
  label: "Edit",
  submenu: [
    {
      label: "Configuration",
      click() {
        shell.openPath(CONFIG_FILES.configFile);
      },
    },
    {
      label: "Database",
      click() {
        shell.openPath(CONFIG_FILES.dbFile);
      },
    },
  ],
});

const viewMenu: MenuItem = new MenuItem({
  label: "View",
  submenu: [
    { role: "reload" },
    { role: "forceReload" },
    { role: "toggleDevTools" },
    { type: "separator" },
    { role: "togglefullscreen" },
  ],
});

const helpMenu: MenuItem = new MenuItem({
  label: "Help",
  submenu: [
    {
      label: "Learn More",
      click() {
        shell.openExternal("https://github.com/saisandeepvaddi/ten-hands");
      },
    },
    {
      label: "Check for Updates",
      async click() {
        try {
          const update = await getAppUpdate();
          logger.info("Update: " + JSON.stringify(update));
          if (update && !update.prerelease) {
            showUpdateAvailableMessage();
          } else {
            showUpdateNotAvailableMessage();
          }
        } catch (error) {
          showUnableToCheckUpdatesMessage();
          logger.error("check for updates error: " + error.message);
          captureException(error);
        }
      },
    },
    {
      label: "About",
      async click() {
        dialog.showMessageBoxSync({
          type: "info",
          title: "Ten Hands",
          message: `Version: ${app.getVersion()}`,
        });
      },
    },
  ],
});

const commonMenu: MenuItem[] = [editMenu, viewMenu, helpMenu];

const macMenu: MenuItem[] = [
  new MenuItem({
    label: app.getName(),
    submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }],
  }),
  ...commonMenu,
];

const winMenu: MenuItem[] = [
  new MenuItem({
    label: "File",
    submenu: [{ role: "quit" }],
  }),
  ...commonMenu,
];

export const menuTemplate: MenuItem[] = isMac ? macMenu : winMenu;

export const getMenu = () => {
  return Menu.buildFromTemplate(menuTemplate);
};

export const createMenu = () => {
  const appMenu = getMenu();
  Menu.setApplicationMenu(appMenu);
};
