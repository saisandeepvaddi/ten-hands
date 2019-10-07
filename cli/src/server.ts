// import { getConfig } from "../../app/shared/config";
import { execSync } from "child_process";
import { resolve } from "path";

export const startServer = async () => {
  try {
    let serverPath = resolve(__dirname, "server", "start.js");
    execSync(`node ${serverPath}`, { stdio: "inherit" });
  } catch (error) {
    console.log("error:", error);
    console.error("Error starting server: ", error.message);
  }
};
