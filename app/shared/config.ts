import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import { homedir } from "os";
import nodeWatch from "node-watch";
import { isEqual } from "lodash";
import { mainWindow } from "../electron/index";

const tenHandsDir = path.join(homedir(), ".ten-hands");

export const CONFIG_FILES = {
  configFile: path.join(tenHandsDir, "config.json"),
  dbFile: path.join(tenHandsDir, "db.json")
};

mkdirp.sync(tenHandsDir);

const defaultConfig: IConfig = {
  port: 5010,
  enableTerminalTheme: true
};

/* If user accidentally updates config file with invalid values, send default */
const isValidConfig = (config): boolean => {
  if (
    typeof config.port !== "number" ||
    config.port < 0 ||
    config.port > 65535
  ) {
    return false;
  }

  if (typeof config.enableTerminalTheme !== "boolean") {
    return false;
  }

  return true;
};

/* If user accidentally updates config file with invalid values, send default */
const getValidConfig = config => {
  const _config = { ...config };

  if (
    typeof config.port !== "number" ||
    config.port < 0 ||
    config.port > 65535
  ) {
    _config.port = defaultConfig.port;
  }

  if (typeof config.enableTerminalTheme !== "boolean") {
    _config.enableTerminalTheme = defaultConfig.enableTerminalTheme;
  }

  return _config;
};

const writeConfigToFS = config => {
  fs.writeFileSync(CONFIG_FILES.configFile, JSON.stringify(config, null, 2));
};

export const getConfig = () => {
  try {
    let conf: IConfig = JSON.parse(
      fs.readFileSync(CONFIG_FILES.configFile, "utf8")
    );

    const validConfig = getValidConfig(conf);
    return validConfig;
  } catch (error) {
    console.log("error:", error);
    return defaultConfig;
  }
};

if (!fs.existsSync(CONFIG_FILES.configFile)) {
  writeConfigToFS(getConfig());
}

/* For cache purposes. see below nodeWatch */
let conf = JSON.parse(fs.readFileSync(CONFIG_FILES.configFile, "utf8"));

const sendConfigToUI = config => {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send("config-changed", config);
  }
};

nodeWatch(CONFIG_FILES.configFile, (event, filename) => {
  try {
    let newConfig: IConfig = JSON.parse(
      fs.readFileSync(CONFIG_FILES.configFile, "utf8")
    );

    if (isEqual(conf, newConfig)) {
      return;
    }

    const validConfig = getValidConfig(newConfig);
    conf = { ...validConfig };
    sendConfigToUI(validConfig);
  } catch (error) {
    sendConfigToUI(getConfig());
  }
});

export default {
  ...defaultConfig,
  ...conf
};
