import { CONFIG_FILES } from "../shared/config";
import { existsSync, writeFileSync, fstat, appendFileSync } from "fs";

interface ILoggerOptions {
  file: string;
}

let defaultOptions: ILoggerOptions = {
  file: CONFIG_FILES.logFile
};

class Logger {
  options: ILoggerOptions = null;

  constructor(options = defaultOptions) {
    this.options = options;
    this._createLogFile();
  }

  private _getDate() {
    return new Date().toLocaleString();
  }

  private _createLogFile() {
    const { file } = this.options;
    if (!existsSync(file)) {
      let firstMessage =
        new Date().toLocaleString() + "  " + "Log file created";
      writeFileSync(file, firstMessage);
    }
  }

  private _writeToFS = (message: string) => {
    const { file } = this.options;
    appendFileSync(file, message + "\n");
  };

  info(message: string) {
    let infoMessage = `${this._getDate()} : [INFO] : ${message}`;
    this._writeToFS(infoMessage);
  }

  error(message: string) {
    let infoMessage = `${this._getDate()} : [ERROR] : ${message}`;
    this._writeToFS(infoMessage);
  }
}

export default Logger;
