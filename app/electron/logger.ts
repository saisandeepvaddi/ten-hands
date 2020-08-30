import { Logger } from "just-enough-logger";
import { CONFIG_FILES, CONFIG_FILES_DIR } from "../shared/config";
import { join } from "path";

export const log = new Logger({
  transports: ["file", "console"],
  file: CONFIG_FILES.logFile,
});

export const stream = log.getLogStream();

export const devLogger = new Logger({
  transports: ["file", "console"],
  file: join(CONFIG_FILES_DIR, "requests.log"),
});
