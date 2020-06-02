import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import { homedir } from "os";

const tenHandsDir = path.join(homedir(), ".ten-hands");

export const CONFIG_FILES = {
  configFile: path.join(tenHandsDir, "config.json"),
  dbFile: path.join(tenHandsDir, "db.json"),
  logFile: path.join(tenHandsDir, "log.log"),
};

mkdirp.sync(tenHandsDir);

const defaultConfig: IConfig = {
  port: 5010,
  enableTerminalTheme: true,
  globalHotKey: "CommandOrControl+Alt+T",
  showAppRunningTrayNotification: true,
  showStatusBar: true,
  taskViewStyle: "rows",
  shell: "",
  hideToTrayOnClose: true,
};

/* If user accidentally updates config file with invalid values, send default */
const getValidConfig = (config: IConfig): IConfig => {
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

  if (typeof config.globalHotKey !== "string") {
    _config.globalHotKey = defaultConfig.globalHotKey;
  }

  if (typeof config.showAppRunningTrayNotification !== "boolean") {
    _config.showAppRunningTrayNotification =
      defaultConfig.showAppRunningTrayNotification;
  }

  if (typeof config.showStatusBar !== "boolean") {
    _config.showStatusBar = defaultConfig.showStatusBar;
  }

  if (
    typeof config.taskViewStyle !== "string" ||
    ["tabs", "rows"].indexOf(config.taskViewStyle) === -1
  ) {
    _config.taskViewStyle = defaultConfig.taskViewStyle;
  }

  if (typeof config.shell !== "string") {
    _config.shell = defaultConfig.shell;
  }

  if (typeof config.hideToTrayOnClose !== "boolean") {
    _config.hideToTrayOnClose = defaultConfig.hideToTrayOnClose;
  }

  return _config;
};

const writeConfigToFS = (config: IConfig) => {
  fs.writeFileSync(CONFIG_FILES.configFile, JSON.stringify(config, null, 2));
};

export const getConfig = (): IConfig => {
  try {
    let conf: IConfig = JSON.parse(
      fs.readFileSync(CONFIG_FILES.configFile, "utf8")
    );

    const validConfig = getValidConfig(conf);
    return validConfig;
  } catch (error) {
    console.log(
      "Config file not found. Creating default config file and database file at ~/.ten-hands/"
    );
    return defaultConfig;
  }
};

if (!fs.existsSync(CONFIG_FILES.configFile)) {
  writeConfigToFS(getConfig());
}
