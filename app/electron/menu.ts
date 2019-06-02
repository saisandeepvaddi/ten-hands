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

console.log("isMac:", isMac);
const template = isMac ? macMenu : winMenu;
console.log("template:", template);

export const createMenu = () => {
  const appMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(appMenu);
};
