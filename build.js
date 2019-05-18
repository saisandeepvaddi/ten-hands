const fs = require("fs-extra");
const path = require("path");
const execa = require("execa");

const buildUI = async () => {
  return new Promise((resolve, reject) => {
    try {
      const uiBuild = execa("yarn build", {
        cwd: path.join(__dirname, "ui")
      });

      uiBuild.stdout.on("data", chunk => {
        console.log(chunk.toString());
      });

      uiBuild.stderr.on("data", chunk => {
        console.log(chunk.toString());
        reject(new Error("UI Build Failed"));
      });

      uiBuild.on("exit", chunk => {
        console.log(chunk.toString());
        resolve(true);
      });
    } catch (error) {
      console.log("error:", error);
      reject(new Error("UI Build Failed"));
    }
  });
};

const buildElectron = async () => {
  return new Promise((resolve, reject) => {
    try {
      const electronBuild = execa("yarn build", {
        cwd: path.join(__dirname, "app")
      });

      electronBuild.stdout.on("data", chunk => {
        console.log(chunk.toString());
      });

      electronBuild.stderr.on("data", chunk => {
        console.log(chunk.toString());
        reject(new Error("Electron Build Failed"));
      });

      electronBuild.on("exit", chunk => {
        console.log(chunk.toString());
        resolve(true);
      });
    } catch (error) {
      console.log("error:", error);
      reject(new Error("Electron Build Failed"));
    }
  });
};

const moveBuilds = async () => {
  try {
    console.log(`Moving UI build`);
    await fs.move(
      path.join(__dirname, "ui", "build"),
      path.join(__dirname, "app", "build", "ui"),
      { overwrite: true }
    );
  } catch (error) {
    console.log("error:", error);
  }
};

const buildInstaller = async () => {
  return new Promise((resolve, reject) => {
    try {
      const installerBuild = execa("yarn build:installer", {
        cwd: path.join(__dirname, "app")
      });

      installerBuild.stdout.on("data", chunk => {
        console.log(chunk.toString());
      });

      installerBuild.stderr.on("data", chunk => {
        console.log(chunk.toString());
        reject(new Error("Installer Build Failed"));
      });

      installerBuild.on("exit", chunk => {
        console.log(chunk.toString());
        resolve(true);
      });
    } catch (error) {
      console.log("error:", error);
      reject(new Error("Installer Build Failed"));
    }
  });
};

const startBuild = async () => {
  try {
    await buildUI();
    await buildElectron();
    await moveBuilds();
    await buildInstaller();
  } catch (error) {
    console.log("error:", error);
  }
};

startBuild();
