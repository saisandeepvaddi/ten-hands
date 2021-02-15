import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import { homedir } from "os";
import { captureException } from "@sentry/node";

export const CONFIG_FILES_DIR = path.join(homedir(), ".ten-hands");

export const CONFIG_FILES = {
  configFile: path.join(CONFIG_FILES_DIR, "config.json"),
  dbFile: path.join(CONFIG_FILES_DIR, "db.json"),
  logFile: path.join(CONFIG_FILES_DIR, "log.log"),
};

mkdirp.sync(CONFIG_FILES_DIR);

const defaultConfig: IConfig = {
  port: 5010,
  enableTerminalTheme: true,
  globalHotKey: "CommandOrControl+Alt+T",
  showAppRunningTrayNotification: true,
  showStatusBar: true,
  taskViewStyle: "rows",
  shell: "",
  hideToTrayOnClose: true,
  terminalRenderer: "canvas",
  showTaskCountBadge: true,
  sendErrorReports: true,
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

  if (
    typeof config.terminalRenderer !== "string" ||
    ["canvas", "webgl"].indexOf(config.terminalRenderer) === -1
  ) {
    _config.terminalRenderer = defaultConfig.terminalRenderer;
  }

  if (typeof config.showTaskCountBadge !== "boolean") {
    _config.showTaskCountBadge = defaultConfig.showTaskCountBadge;
  }

  if (typeof config.sendErrorReports !== "boolean") {
    _config.sendErrorReports = defaultConfig.sendErrorReports;
  }

  return _config;
};

const writeConfigToFS = (config: IConfig) => {
  fs.writeFileSync(CONFIG_FILES.configFile, JSON.stringify(config, null, 2));
};

export const getConfig = (): IConfig => {
  try {
    const conf: IConfig = JSON.parse(
      fs.readFileSync(CONFIG_FILES.configFile, "utf8")
    );

    const validConfig = getValidConfig(conf);
    return validConfig;
  } catch (error) {
    console.log(
      "Config file not found. Creating default config file and database file at ~/.ten-hands/"
    );
    captureException(error);
    return defaultConfig;
  }
};

if (!fs.existsSync(CONFIG_FILES.configFile)) {
  writeConfigToFS(getConfig());
}
