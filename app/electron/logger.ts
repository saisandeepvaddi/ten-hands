import Logger from "just-enough-logger";
import { CONFIG_FILES } from "../shared/config";

export const log = new Logger({
  transports: ["file"],
  file: CONFIG_FILES.logFile,
});
