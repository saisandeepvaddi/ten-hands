import logProcessErrors from "log-process-errors";
logProcessErrors();

try {
  const debug = require("electron-debug");
  debug();
  require("electron-reloader")(module);
  console.log("About to start electron");
} catch (error) {
  console.log(error);
}
