import { CONFIG_FILES } from "../shared/config";

const { app, Menu, shell } = require("electron");

const isMac = process.platform === "darwin";

const commonMenu = [
  {
    label: "Edit",
    submenu: [
      {
        label: "Configuration",
        click() {
          shell.openItem(CONFIG_FILES.configFile);
        }
      }
    ]
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { role: "toggledevtools" },
      { type: "separator" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ]
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click() {
          shell.openExternalSync(
            "https://github.com/saisandeepvaddi/ten-hands"
          );
        }
      }
    ]
  }
];

const macMenu = [
  {
    label: app.getName(),
    submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }]
  },
  ...commonMenu
];

const winMenu = [
  {
    label: "File",
    submenu: [{ role: "close" }]
  },
  ...commonMenu
];

export const menuTemplate = isMac ? macMenu : winMenu;

export const createMenu = () => {
  const appMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(appMenu);
};

export const getMenu = () => {
  return Menu.buildFromTemplate(menuTemplate);
};
