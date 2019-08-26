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

if (!fs.existsSync(CONFIG_FILES.configFile)) {
  fs.writeFileSync(
    CONFIG_FILES.configFile,
    JSON.stringify(defaultConfig, null, 2)
  );
}

export const getConfig = () => {
  try {
    let conf: IConfig = JSON.parse(
      fs.readFileSync(CONFIG_FILES.configFile, "utf8")
    );
    console.log("asking conf:", conf);
    return conf;
  } catch (error) {
    console.log("error:", error);
    return defaultConfig;
  }
};

let conf = JSON.parse(fs.readFileSync(CONFIG_FILES.configFile, "utf8"));
console.log("conf:", conf);

nodeWatch(CONFIG_FILES.configFile, (event, filename) => {
  try {
    let newConfig: IConfig = JSON.parse(
      fs.readFileSync(CONFIG_FILES.configFile, "utf8")
    );
    if (isEqual(conf, newConfig)) {
      console.log("Config is same. Not sending");

      return;
    }

    conf = { ...newConfig };

    if (mainWindow && mainWindow.webContents) {
      console.log("Sending new config");
      mainWindow.webContents.send("config-changed", newConfig);
    }
  } catch (error) {
    console.log("config error:", error);
  }
});

export default {
  ...defaultConfig,
  ...conf
};
