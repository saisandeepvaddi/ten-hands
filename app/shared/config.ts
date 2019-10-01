import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import { homedir } from "os";

const tenHandsDir = path.join(homedir(), ".ten-hands");

export const CONFIG_FILES = {
  configFile: path.join(tenHandsDir, "config.json"),
  dbFile: path.join(tenHandsDir, "db.json"),
  logFile: path.join(tenHandsDir, "log.log")
};

mkdirp.sync(tenHandsDir);

const defaultConfig: IConfig = {
  port: 5010,
  enableTerminalTheme: true
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
