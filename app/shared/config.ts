import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import { homedir } from "os";

const tenHandsDir = path.join(homedir(), ".ten-hands");

export const CONFIG_FILES = {
  configFile: path.join(tenHandsDir, "config.json"),
  dbFile: path.join(tenHandsDir, "db.json")
};

mkdirp.sync(tenHandsDir);

const defaultConfig: IConfig = {
  port: 1010,
  launchAtStartup: false
};

if (!fs.existsSync(CONFIG_FILES.configFile)) {
  fs.writeFileSync(
    CONFIG_FILES.configFile,
    JSON.stringify(defaultConfig, null, 2)
  );
}

const conf = JSON.parse(fs.readFileSync(CONFIG_FILES.configFile, "utf8"));

export default {
  ...defaultConfig,
  ...conf
};
